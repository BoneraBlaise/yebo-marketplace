import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import Ratings from "../../Products/Ratings";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";
import { addTocart } from "../../../redux/actions/cart";
import MobileProductCard from "../ProductCard/MobileProductCard";
import { useMediaQuery } from "react-responsive";
import Cookies from "js-cookie";
import axios from "axios";
import { server } from "../../../server";
import { MdVerifiedUser } from "react-icons/md";
import ml5 from "ml5";
import * as tf from "@tensorflow/tfjs";
import { useTranslation } from "react-i18next";

const ProductList = ({ products }) => {
  const { t } = useTranslation();
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ query: "(max-width: 900px)" });
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [model, setModel] = useState(null);
  const [isTraining, setIsTraining] = useState(false);

  const recommendationCache = new Map();

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const saveToRecentlyViewed = (product) => {
    try {
      const productDetails = {
        _id: product._id,
        name: product.name,
        image: product.images[0]?.url,
        price: product.discountPrice || product.originalPrice,
        category: product.category,
        subcategory: product.subcategory,
      };

      let recentlyViewed = [];
      try {
        recentlyViewed = JSON.parse(Cookies.get("recentlyViewed") || "[]");
      } catch (e) {
        console.error("Error parsing recently viewed products:", e);
        recentlyViewed = [];
      }

      recentlyViewed = recentlyViewed.filter(item => item._id !== product._id);
      recentlyViewed.unshift(productDetails);

      const limitedViewed = recentlyViewed.slice(0, 12);

      try {
        Cookies.set("recentlyViewed", JSON.stringify(limitedViewed), {
          expires: 7,
          sameSite: 'Lax'
        });
      } catch (e) {
        console.error("Error saving to cookies:", e);
      }
    } catch (error) {
      console.error("Error in saveToRecentlyViewed:", error);
    }
  };

  const handleWishlistToggle = async (product, isInWishlist) => {
    try {
      const response = await axios.put(
        `${server}/product/like-product`,
        { productId: product._id },
        { withCredentials: true }
      );

      if (response.data.success) {
        if (isInWishlist) {
          dispatch(removeFromWishlist(product));
          toast.info("Removed from wishlist!");
        } else {
          dispatch(addToWishlist(product));
          toast.success("Added to wishlist!");
        }
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      toast.error("Cannot watch this product at the moment!");
      console.error("Error during request:", error);
    }
  };

  const loadModel = async () => {
    try {
      await tf.ready();
      const options = {
        task: 'regression',
        debug: false,
        inputs: ['price', 'category'],
        outputs: ['score'],
        learningRate: 0.005,
        hiddenUnits: 16,
        epochs: 50,
        batchSize: 8
      };

      const net = ml5.neuralNetwork(options);
      setModel(net);
    } catch (error) {
      console.error('Error loading model:', error);
    }
  };

  const prepareData = async () => {
    if (isTraining || !model) return;

    try {
      setIsTraining(true);
      const recentlyViewed = JSON.parse(Cookies.get('recentlyViewed') || '[]');

      if (recentlyViewed.length < 2) {
        setIsTraining(false);
        return;
      }

      const validProducts = recentlyViewed.filter(product =>
        product &&
        typeof product.price === 'number' &&
        typeof product.category === 'string'
      );

      if (validProducts.length < 2) {
        setIsTraining(false);
        return;
      }

      const prices = validProducts.map(p => p.price);
      const maxPrice = Math.max(...prices);
      const minPrice = Math.min(...prices);
      const categories = [...new Set(validProducts.map(p => p.category))];

      const inputs = validProducts.map((product, index) => {
        const normalizedPrice = (product.price - minPrice) / (maxPrice - minPrice || 1);
        const categoryIndex = categories.indexOf(product.category) / (categories.length - 1 || 1);
        return [normalizedPrice, categoryIndex];
      });

      const outputs = validProducts.map((_, index) => {
        return [1 - (index / validProducts.length)];
      });

      const inputTensor = tf.tensor(inputs);
      const outputTensor = tf.tensor(outputs);

      model.addData(inputTensor, outputTensor);

      await model.train({
        epochs: 50,
        batchSize: 8,
        validationSplit: 0.2
      });

      await makeRecommendations();
      setIsTraining(false);
      inputTensor.dispose();
      outputTensor.dispose();
    } catch (error) {
      console.error('Error in prepareData:', error);
      setIsTraining(false);
    }
  };

  const makeRecommendations = async () => {
    if (!model) return;

    try {
      const recentlyViewed = JSON.parse(Cookies.get('recentlyViewed') || '[]');
      if (recentlyViewed.length === 0) return;

      // Create a cache key based on recently viewed products
      const cacheKey = recentlyViewed.map(p => p._id).join('-');
      
      // Check if we have cached recommendations
      const cachedRecommendations = recommendationCache.get(cacheKey);
      if (cachedRecommendations) {
        setRecommendedProducts(cachedRecommendations);
        return;
      }

      const categoryFrequency = {};
      recentlyViewed.forEach(product => {
        categoryFrequency[product.category] = (categoryFrequency[product.category] || 0) + 1;
      });

      const sortedCategories = Object.entries(categoryFrequency)
        .sort(([,a], [,b]) => b - a)
        .map(([category]) => category);

      const validProducts = products.filter(product =>
        product &&
        typeof product.discountPrice === 'number' &&
        typeof product.category === 'string' &&
        sortedCategories.includes(product.category)
      );

      const prices = validProducts.map(p => p.discountPrice);
      const maxPrice = Math.max(...prices);
      const minPrice = Math.min(...prices);
      const categories = [...new Set(validProducts.map(p => p.category))];

      const inputs = validProducts.map(product => {
        const normalizedPrice = (product.discountPrice - minPrice) / (maxPrice - minPrice || 1);
        const categoryIndex = categories.indexOf(product.category) / (categories.length - 1 || 1);
        return [normalizedPrice, categoryIndex];
      });

      const inputTensor = tf.tensor(inputs);
      const predictions = await model.predict(inputTensor);

      const recommendations = validProducts.map((product, index) => ({
        ...product,
        score: predictions.arraySync()[index][0] * 
          (1 + (categoryFrequency[product.category] || 0) / recentlyViewed.length)
      }));

      const filteredRecommendations = recommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, 12);

      // Cache the recommendations
      recommendationCache.set(cacheKey, filteredRecommendations);
      setRecommendedProducts(filteredRecommendations);

      inputTensor.dispose();
      predictions.dispose();
    } catch (error) {
      console.error('Error in makeRecommendations:', error);
    }
  };

  useEffect(() => {
    loadModel();
  }, []);

  useEffect(() => {
    if (model && !isTraining) {
      prepareData();
    }
  }, [model, isTraining]);

  const handleProductClick = (product) => {
    saveToRecentlyViewed(product);
  };

  return (
    <div
      className={`p-4 w-full mx-auto ${isMobile ? "grid grid-cols-2 gap-4" : "flex flex-col gap-4"}`}
    >
      {products.map((product) => {
        const isInWishlist = wishlist.some((item) => item._id === product._id);

        const addToCartHandler = (id) => {
          const isItemExists = cart.find((i) => i._id === id);
          if (isItemExists) {
            toast.error("Item already in cart!");
          } else {
            if (product.stock < 1) {
              toast.error("Product stock limited!");
            } else {
              const cartData = { ...product, qty: 1 };
              dispatch(addTocart(cartData));
              toast.success("Item added to cart successfully!");
            }
          }
        };

        if (isMobile) {
          return (
            <MobileProductCard
              key={product._id}
              data={product}
              className="w-full gap-2"
            />
          );
        }

        const isNew = new Date() - new Date(product.createdAt) < 24 * 60 * 60 * 1000;
        const discount = product.originalPrice - product.discountPrice;
        const showDiscountText = discount > 10000;

        return (
          <div
            key={product._id}
            className="flex border dark:border-1 dark:border-[#2b2b2b] transition-shadow duration-300 w-full h-[270px] max-w-full mx-auto relative overflow-hidden"
            onClick={() => handleProductClick(product)}
          >
            {/* Sold Out Badge */}
            {product.stock === 0 && (
              <div className="absolute top-[20px] left-[-50px] transform -rotate-45 bg-red-500 text-white py-1 px-16 text-sm font-bold z-50 shadow-md">
                {t("product.soldOut")}
              </div>
            )}

            {product.featured && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                {t("product.featured")}
              </span>
            )}
            {isNew && (
              <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                {t("product.new")}
              </span>
            )}
            <Link
              to={`/product/${product._id}`}
              className="flex-shrink-0 flex items-center h-full"
            >
              <img
                src={product.images[0]?.url}
                alt={product.name}
                className="h-full w-[250px] object-cover bg-[#f1f1f1]"
              />
            </Link>
            <div className="flex-grow flex flex-col justify-between p-6">
              <div>
                <Link to={`/product/${product._id}`}>
                  <h2 className="font-medium text-xl mb-2">
                    {product.name.length > 360
                      ? `${product.name.slice(0, 330)}...`
                      : product.name}
                  </h2>
                </Link>

                <div className="flex justify-between items-center mb-2">
                  <h5 className="text-md font-semibold">
                    RWF{" "}
                    {formatPrice(
                      product.discountPrice
                        ? product.discountPrice
                        : product.originalPrice
                    )}
                  </h5>
                  <span className="font-medium text-sm mt-4 text-[#68d284]">
                    {product.stock} {t("product.inStock")}
                  </span>
                </div>

                <div className="flex mt-1">
                  <Ratings rating={product.ratings} /> {product.reviews.length}{" "}
                  {t("product.reviews")}
                </div>

                {product.bestdeal && (
                  <p className="text-sm text-[#29625d] font-bold">{t("product.bestDeal")}</p>
                )}

                {product.bestdeal && showDiscountText && (
                  <p className="text-sm text-red-500 font-bold">{t("product.onDiscount")}</p>
                )}

                <p
                  className={`text-sm font-medium mt-2 ${product.shop.isVerified ? "text-gray-500" : "text-gray-500"
                    }`}
                >
                  {product.shop.isVerified ? (
                    <>
                      <MdVerifiedUser size={24} className="inline-block" />{" "}
                      {t("product.verifiedSeller")}
                    </>
                  ) : (
                    ""
                  )}
                </p>
              </div>

              <div className="flex mt-3">
                <div className="flex items-center border px-3 rounded-full mr-2">
                  {isInWishlist ? (
                    <AiFillHeart
                      size={35}
                      className="cursor-pointer dark:bg-transparent p-1 rounded-full"
                      onClick={() => handleWishlistToggle(product, true)}
                      color="#ffd496"
                      title={t("product.removeFromWishlist")}
                    />
                  ) : (
                    <AiOutlineHeart
                      size={35}
                      className="cursor-pointer dark:bg-transparent p-1 rounded-full"
                      onClick={() => handleWishlistToggle(product, false)}
                      title={t("product.addToWishlist")}
                    />
                  )}
                  <span className="text-sm mr-2 text-green-700">
                    {product.likes.length}
                  </span>
                </div>
                <button
                  onClick={() => addToCartHandler(product._id)}
                  className="text-sm p-2 px-3 bg-[#29625d] hover:bg-[#000000] text-white rounded-full cursor-pointer"
                >
                  {t("product.addToCart")}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductList;