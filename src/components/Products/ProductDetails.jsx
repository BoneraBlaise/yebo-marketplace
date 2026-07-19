import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { server } from "../../server";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import axios from "axios";
import ReactQuill from "react-quill";
import { FaShare } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { generateShareLink, trackCommissionClick } from "../../redux/actions/order";
import { RxCross1 } from "react-icons/rx";
import { useReferral } from "../../context/ReferralContext";
import {
  createReferralAttribution,
  trackReferralClickApi,
} from "../../services/growthConfigurationService";
import "./product-details.css";
import { Container, Button } from "../ui";
import ProductGallery from "./ProductGallery";
import ProductPurchasePanel from "./ProductPurchasePanel";
import ProductAISections from "./ProductAISections";
import ProductTrustSection from "./ProductTrustSection";
import ProductDetailsTabs from "./ProductDetailsTabs";

// Modal Component
const Modal = ({ show, onClose, description }) => {
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[200] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto hide-scrollbar shadow-2xl border border-gray-100 dark:border-gray-800 pdp-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-Poppins text-xl font-semibold dark:text-white mb-4">Full Description</h2>
        <ReactQuill value={description} readOnly theme="bubble" className="dark:text-white" />
        <button
          type="button"
          onClick={onClose}
          className="mt-6 px-6 py-2.5 rounded-xl bg-yebone-primary text-white font-semibold hover:bg-yebone-primary-dark transition pdp-btn-lift"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const ProductDetails = ({ data }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.products);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const [shopVerify, setShopVerify] = useState(false);
  const [loading, setLoading] = useState(true); // To track loading state
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [shareLink, setShareLink] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const location = useLocation();
  const { addReferralProduct } = useReferral();

  // Slice the description to 200 characters
  const shortDescription = data?.description?.slice(0, 350);
  const isDescriptionLong = data?.description?.length > 350;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  useEffect(() => {
    if (data) {
      dispatch(getAllProductsShop(data.shop._id));
      setClick(wishlist.some((i) => i._id === data._id));
    }
  }, [data, wishlist, dispatch]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const refCode = params.get("ref");
    const attToken = params.get("att");

    if (!refCode || !data?._id) return;

    const applyReferral = async () => {
      let attributionToken = attToken;
      try {
        if (!attributionToken) {
          const response = await createReferralAttribution({
            referralCode: refCode,
            productId: data._id,
            shopId: data.shop?._id,
          });
          attributionToken = response?.data?.attributionToken;
        }
        addReferralProduct(data._id, refCode, attributionToken);
        await trackReferralClickApi(refCode);
        dispatch(trackCommissionClick(refCode));
      } catch (error) {
        addReferralProduct(data._id, refCode, attributionToken);
        dispatch(trackCommissionClick(refCode));
      }

      const newUrl =
        window.location.pathname +
        (window.location.search
          ? window.location.search.replace(/(\?|&)ref=[^&]*(&|$)/, "$1").replace(/(\?|&)att=[^&]*(&|$)/, "$1").replace(/\?$|&$/, "")
          : "");
      window.history.replaceState({}, "", newUrl);
    };

    applyReferral();
  }, [location, data, addReferralProduct, dispatch]);

  const incrementCount = () => setCount((prev) => prev + 1);
  const decrementCount = () => count > 1 && setCount((prev) => prev - 1);

  const toggleWishlist = () => {
    setClick((prev) => !prev);
    click ? dispatch(removeFromWishlist(data)) : dispatch(addToWishlist(data));
  };

  const addToCartHandler = (id) => {
    if (!data) return;

    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
      return;
    }

    if (data.stock < count) {
      toast.error("Product stock limited!");
      return;
    }

    // Create cart item
    const cartItem = {
      ...data,
      qty: count
    };

    dispatch(addTocart(cartItem));
    toast.success("Item added to cart successfully!");
  };

  const buyNowHandler = () => {
    if (!data) return;
    const isItemExists = cart && cart.find((i) => i._id === data._id);
    if (!isItemExists) {
      if (data.stock < count) {
        toast.error("Product stock limited!");
        return;
      }
      dispatch(addTocart({ ...data, qty: count }));
    }
    navigate("/checkout");
  };
  //Fetching the shop details to get if shop is verified
  useEffect(() => {
    if (data?.shop?._id) {
      axios
        .get(`${server}/shop/get-shop-info/${data.shop._id}`)
        .then((response) => {
          setShopVerify(response.data.shop.isVerified);
          if (response.data.isVerified !== undefined) {
          } else {
            setError("Shop verification status not available");
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching shop details:", error);
          setError("Error fetching shop details");
          setLoading(false);
        });
    } else {
      console.warn("No shop ID found in data", data);
      setLoading(false); // No shop ID, stop loading
    }
  }, [data]);
  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = `${data._id}${user._id}`;
      const userId = user._id;
      const sellerId = data.shop._id;

      try {
        // First check if conversation exists
        const existingConversations = await axios.get(
          `${server}/conversation/get-all-conversation-user/${userId}`,
          { withCredentials: true }
        );

        let conversationId;
        const existingConversation = existingConversations.data.conversations.find(
          conv => conv.members.includes(sellerId)
        );

        if (existingConversation) {
          // Use existing conversation
          conversationId = existingConversation._id;
        } else {
          // Create new conversation with product context
          const newConversation = await axios.post(
            `${server}/conversation/create-new-conversation`,
            {
              groupTitle,
              userId,
              sellerId,
            }
          );
          conversationId = newConversation.data.conversation._id;
        }

        // Send initial message with product context
        await axios.post(`${server}/message/create-new-message`, {
          conversationId,
          sender: userId,
          // The message contains a clickable product name linking to the product details page
          text: `Hi, I'm interested in ${data.name} with price ${data.discountPrice} RWF. Can you provide more details?`,
        });


        navigate(`/inbox?${conversationId}`);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error creating conversation");
      }
    } else {
      toast.error("Please login to create a conversation");
    }
  };
  const formatPrice = (price) =>
    price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const totalReviewsLength = products?.reduce(
    (acc, product) => acc + product.reviews.length,
    0
  );

  const totalRatings = products?.reduce(
    (acc, product) =>
      acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
    0
  );

  const averageRating = (totalRatings / totalReviewsLength || 0).toFixed(2);

  const handleGenerateShareLink = async () => {
    if (!user?.isCommissioner) {
      toast.info("Join our commission program to share and earn!");
      navigate("/profile?tab=commission");
      return;
    }

    try {
      const link = await dispatch(generateShareLink(data._id));
      setShareLink(link);
      setShowShareModal(true);
    } catch (error) {
      toast.error("Failed to generate share link");
    }
  };

  const handleScroll = (direction) => {
    const container = document.querySelector(".tags-scroll-container");
    const scrollAmount = 200;
    if (container) {
      if (direction === "left") {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const container = e.currentTarget;
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeft(container.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const container = e.currentTarget;
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    const container = e.currentTarget;
    setStartX(touch.pageX - container.offsetLeft);
    setScrollLeft(container.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const container = e.currentTarget;
    const touch = e.touches[0];
    const x = touch.pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeft - walk;
  };

  const CommissionShare = () => {
    const { shareLink, shareLinkLoading } = useSelector((state) => state.order);

    const handleGenerateLink = async () => {
      try {
        const link = await dispatch(generateShareLink(data._id));
        setShareLink(link);
        setShowShareModal(true);
      } catch (error) {
        toast.error("Failed to generate share link");
      }
    };

    if (!user?.isCommissioner) {
      return (
        <Link to="/profile?tab=commission" className="mt-4 block">
          <button className="bg-[#29625d] text-white px-4 py-2 rounded-full hover:bg-[#1f4e45] transition-all">
            Join Commission Program to Earn {data.commissionRate || "up to 10%"}
          </button>
        </Link>
      );
    }

    return (
      <div className="mt-4">
        <button
          onClick={handleGenerateLink}
          className="bg-[#29625d] text-white px-4 py-2 rounded-full hover:bg-[#1f4e45] transition-all flex items-center gap-2"
          disabled={shareLinkLoading}
        >
          <FaShare className="text-lg" />
          Share & Earn {data.commissionRate || "up to 10%"}
        </button>
      </div>
    );
  };

  const ShareModal = () => (
    showShareModal && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={() => setShowShareModal(false)} // Close when clicking the backdrop
      >
        <div
          className="bg-white dark:bg-[#2d2d2d] p-6 rounded-lg max-w-md w-full"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the modal content
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold dark:text-white">Share & Earn</h3>
            <button
              onClick={() => setShowShareModal(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <RxCross1 size={20} />
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Share this link to earn commission on sales!
          </p>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="flex-1 p-2 border rounded dark:bg-[#1f1f1f] dark:border-gray-600"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareLink);
                toast.success("Link copied to clipboard!");
              }}
              className="bg-[#29625d] text-white px-4 py-2 rounded hover:bg-[#1f4e45]"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="bg-yebone-light-gray dark:bg-gray-950 dark:text-gray-200 min-h-screen pb-24 lg:pb-0">
      {data ? (
        <>
          <Container className="pt-6 pb-4">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 dark:text-gray-400 pdp-fade-in" aria-label="Breadcrumb">
              <Link to="/products" className="hover:text-yebone-primary transition">Products</Link>
              <span className="mx-2">›</span>
              <Link to={`/products?category=${data.category}`} className="hover:text-yebone-primary transition">
                {data.category}
              </Link>
              {data.subcategory && (
                <>
                  <span className="mx-2">›</span>
                  <Link to={`/products?subcategory=${data.subcategory}`} className="hover:text-yebone-primary transition">
                    {data.subcategory}
                  </Link>
                </>
              )}
              <span className="mx-2">›</span>
              <span className="text-gray-700 dark:text-gray-300 line-clamp-1">{data.name}</span>
            </nav>
          </Container>

          {/* Tags */}
          <Container className="pb-6">
            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 overflow-hidden relative group shadow-sm">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-yebone-primary hover:bg-yebone-primary-dark rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition"
              >
                <IoIosArrowBack className="text-white" size={18} />
              </button>
              <button
                type="button"
                onClick={() => handleScroll("right")}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-yebone-primary hover:bg-yebone-primary-dark rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition"
              >
                <IoIosArrowForward className="text-white" size={18} />
              </button>
              <div
                className="flex gap-2 overflow-x-auto hide-scrollbar tags-scroll-container select-none px-8"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
                style={{ cursor: isDragging ? "grabbing" : "grab" }}
              >
                {data.brand && (
                  <Link to={`/products?brand=${data.brand}`} className="shrink-0 px-3 py-1.5 bg-yebone-light-gray dark:bg-gray-800 text-sm rounded-full hover:bg-yebone-primary hover:text-white transition">
                    More from {data.brand}
                  </Link>
                )}
                <Link to={`/products?category=${data.category}`} className="shrink-0 px-3 py-1.5 bg-yebone-light-gray dark:bg-gray-800 text-sm rounded-full hover:bg-yebone-primary hover:text-white transition">
                  All {data.category}
                </Link>
                <Link to={`/products?condition=${data.condition}`} className="shrink-0 px-3 py-1.5 bg-yebone-light-gray dark:bg-gray-800 text-sm rounded-full hover:bg-yebone-primary hover:text-white transition">
                  {data.condition} Products
                </Link>
                {data.location && (
                  <Link to={`/products?location=${encodeURIComponent(data.location)}&category=${data.category}`} className="shrink-0 px-3 py-1.5 bg-yebone-light-gray dark:bg-gray-800 text-sm rounded-full hover:bg-yebone-primary hover:text-white transition">
                    More in {data.location}
                  </Link>
                )}
                <Link to={`/products?shop=${data.shop._id}&category=${data.category}`} className="shrink-0 px-3 py-1.5 bg-yebone-light-gray dark:bg-gray-800 text-sm rounded-full hover:bg-yebone-primary hover:text-white transition">
                  From this shop
                </Link>
                <Link to={`/products?category=${data.category}&minPrice=${data.discountPrice * 0.8}&maxPrice=${data.discountPrice * 1.2}`} className="shrink-0 px-3 py-1.5 bg-yebone-light-gray dark:bg-gray-800 text-sm rounded-full hover:bg-yebone-primary hover:text-white transition">
                  Similar price
                </Link>
              </div>
            </div>
          </Container>

          {/* Gallery + Purchase */}
          <Container className="pb-8">
            <div className="flex flex-wrap gap-2 mb-6">
              {data.condition && (
                <span className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${data.condition.toLowerCase() === "new" ? "bg-emerald-500" : "bg-yebone-primary"}`}>
                  {data.condition}
                </span>
              )}
              {data.location && (
                <span className="px-3 py-1 text-xs font-semibold bg-gray-900 text-white rounded-full">{data.location}</span>
              )}
              {data.productType && (
                <span className="px-3 py-1 text-xs font-semibold bg-yebone-gold text-yebone-dark-text rounded-full">{data.productType}</span>
              )}
            </div>

            <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
              <ProductGallery images={data.images} select={select} setSelect={setSelect} />
              <ProductPurchasePanel
                data={data}
                count={count}
                incrementCount={incrementCount}
                decrementCount={decrementCount}
                addToCartHandler={addToCartHandler}
                buyNowHandler={buyNowHandler}
                click={click}
                toggleWishlist={toggleWishlist}
                shopVerify={shopVerify}
                handleMessageSubmit={handleMessageSubmit}
                handleGenerateShareLink={handleGenerateShareLink}
                formatPrice={formatPrice}
                discountPct={
                  data.originalPrice > data.discountPrice
                    ? Math.round(((data.originalPrice - data.discountPrice) / data.originalPrice) * 100)
                    : 0
                }
                moneySaved={
                  data.originalPrice > data.discountPrice
                    ? data.originalPrice - data.discountPrice
                    : 0
                }
                reviewCount={data.reviews?.length || 0}
                showRating={(data.reviews?.length || 0) > 0 && (data.ratings || 0) > 0}
                shortDescription={shortDescription}
                isDescriptionLong={isDescriptionLong}
                onShowMore={toggleModal}
                CommissionShare={CommissionShare}
              />
            </div>
          </Container>

          <ProductAISections category={data.category} />
          <ProductTrustSection />

          <Container>
            <ProductDetailsTabs
              data={data}
              products={products}
              totalReviewsLength={totalReviewsLength}
              averageRating={averageRating}
              shopVerify={shopVerify}
              handleMessageSubmit={handleMessageSubmit}
            />
          </Container>

          {/* Mobile sticky bar */}
          <div className="pdp-mobile-bar fixed bottom-0 inset-x-0 z-50 lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-2xl px-4 py-3 flex gap-3">
            <div className="flex flex-col justify-center min-w-0">
              <p className="font-Poppins font-bold text-yebone-primary text-lg truncate">
                RWF {formatPrice(data.discountPrice)}
              </p>
              <p className="text-xs text-gray-500 truncate">{data.name}</p>
            </div>
            <Button size="md" className="flex-1 pdp-btn-lift shrink-0" onClick={() => addToCartHandler(data._id)} disabled={data.stock < 1}>
              Add to Cart
            </Button>
            <Button variant="secondary" size="md" className="pdp-btn-lift shrink-0" onClick={buyNowHandler} disabled={data.stock < 1}>
              Buy
            </Button>
          </div>
        </>
      ) : (
        <div className="h-[60vh] flex items-center justify-center text-gray-500">
          No product details available.
        </div>
      )}

      <Modal show={isModalOpen} onClose={toggleModal} description={data?.description} />
      <ShareModal />
    </div>
  );
};

export default ProductDetails;
