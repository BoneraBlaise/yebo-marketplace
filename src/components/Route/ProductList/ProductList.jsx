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
import HomeProductCard from "../../Home/HomeProductCard";
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

  if (!products?.length) {
    return null;
  }

  return (
    <div
      className={`w-full mx-auto ${
        isMobile ? "grid grid-cols-2 gap-3 sm:gap-4 p-2" : "marketplace-product-grid p-1"
      }`}
    >
      {products.map((product) => {
        if (isMobile) {
          return (
            <MobileProductCard
              key={product._id}
              data={product}
              className="w-full gap-2"
            />
          );
        }

        return (
          <div
            key={product._id}
            className="flex justify-center"
            onClick={() => handleProductClick(product)}
          >
            <HomeProductCard data={product} compact />
          </div>
        );
      })}
    </div>
  );
};

export default ProductList;