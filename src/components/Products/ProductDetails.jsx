import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { server } from "../../server";
import styles from "../../styles/styles";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "./Ratings";
import axios from "axios";
import ReactQuill from "react-quill";
import verified from "../verify/verified.png";
import {
  FaDiscord,
  FaFacebook,
  FaInstagram,
  FaPinterest,
  FaReddit,
  FaShare,
} from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { generateShareLink, trackCommissionClick } from "../../redux/actions/order";
import { RxCross1 } from "react-icons/rx";
import { useReferral } from '../../context/ReferralContext';

// Modal Component
const Modal = ({ show, onClose, description }) => {
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div className="bg-white dark:bg-[#2b2b2b] p-6 rounded-lg w-[100%] max-w-lg h-[80vh] overflow-y-auto hide-scrollbar">
        <h2 className="text-xl font-bold dark:text-white">Full Description</h2>
        <ReactQuill
          value={description}
          readOnly
          theme="bubble"
          className="dark:text-white"
        />
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-full"
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
    const refCode = params.get('ref');

    if (refCode && data?._id) {
      console.log(`Tracking referral: Product ${data._id} with code ${refCode}`);
      
      // Store referral code for this specific product
      addReferralProduct(data._id, refCode);
      
      // Track the click
      dispatch(trackCommissionClick(refCode));
      
      // Store in localStorage as well for redundancy
      const referralProducts = JSON.parse(localStorage.getItem('referralProducts') || '{}');
      referralProducts[data._id] = refCode;
      localStorage.setItem('referralProducts', JSON.stringify(referralProducts));
      
      // Remove ref parameter from URL to prevent tracking on page refresh
      // but keep the rest of the URL intact
      const newUrl = window.location.pathname + 
        (window.location.search ? 
          window.location.search.replace(/(\?|&)ref=[^&]*(&|$)/, '$1').replace(/\?$/, '') : 
          '');
      
      window.history.replaceState({}, '', newUrl);
    }
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

  const ShareButtons = () => {
    const productUrl = window.location.href; // or a predefined URL
    const shareLinks = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${productUrl}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${productUrl}`,
      instagram: `https://www.instagram.com/sharing/?url=${productUrl}`,
      discord: `https://discord.com/share?url=${productUrl}`,
      reddit: `https://www.reddit.com/submit?url=${productUrl}`,
    };

    const handleShare = (url) => {
      window.open(url, "_blank");
    };

    const [loading, setLoading] = useState(true);

    return (
      <div className="mt-2 p-2 flex justify-start items-center space-x-2">
        <h2>SHARE: </h2>
        {Object.entries(shareLinks).map(([platform, url]) => {
          const Icon = {
            facebook: FaFacebook,
            pinterest: FaPinterest,
            instagram: FaInstagram,
            discord: FaDiscord,
            reddit: FaReddit,
          }[platform];
          return (
            <Icon
              key={platform}
              className="cursor-pointer text-[24px] h-8 w-8 text-white bg-[#29625d] rounded-full p-2 hover:text-black transition duration-200"
              onClick={() => handleShare(url)}
            />
          );
        })}
      </div>
    );
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
    <div className="bg-white dark:bg-[#1f1f1f] dark:text-gray-200">
      {data ? (
        <div className={`${styles.section} w-[98%] 800px:w-[80%]`}>
          {/* Navigation breadcrumb - Moved outside and styled independently */}
          <div className="py-2 text-sm text-gray-500 dark:text-gray-400 px-4">
            <Link to="/products" className="hover:text-[#29625d]">
              Products
            </Link>
            <span className="mx-2">›</span>
            <Link
              to={`/products?category=${data.category}`}
              className="hover:text-[#29625d]"
            >
              {data.category}
            </Link>
            {data.subcategory && (
              <>
                <span className="mx-2">›</span>
                <Link
                  to={`/products?subcategory=${data.subcategory}`}
                  className="hover:text-[#29625d]"
                >
                  {data.subcategory}
                </Link>
              </>
            )}
            <span className="mx-2">›</span>
            <span className="text-gray-700 dark:text-gray-300">
              {data.name}
            </span>
          </div>

          {/* Scrollable tags section */}
          <div className="mt-4 mb-6 p-4 bg-gray-50 dark:bg-[#2d2d2d] rounded-lg overflow-hidden relative group">
            {/* Left scroll button - adjusted z-index and positioning */}
            <button
              onClick={() => handleScroll("left")}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-30 bg-[#29625d] hover:bg-black rounded-full p-2 shadow-md transition-all duration-300 opacity-0 group-hover:opacity-70 hover:opacity-100"
            >
              <IoIosArrowBack className="text-white" size={20} />
            </button>

            {/* Right scroll button - adjusted z-index and positioning */}
            <button
              onClick={() => handleScroll("right")}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-30 bg-[#29625d] hover:bg-black rounded-full p-2 shadow-md transition-all duration-300 opacity-0 group-hover:opacity-70 hover:opacity-100"
            >
              <IoIosArrowForward className="text-white" size={20} />
            </button>

            {/* Container for tags with gradient fade effects */}
            <div className="relative">
              {/* Left fade gradient */}
              <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50 to-transparent dark:from-[#2d2d2d] z-20"></div>

              {/* Right fade gradient */}
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 to-transparent dark:from-[#2d2d2d] z-20"></div>

              {/* Tags container with padding adjustments */}
              <div
                className="flex gap-2 overflow-x-auto whitespace-nowrap pb-2 hide-scrollbar tags-scroll-container select-none px-8"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  cursor: isDragging ? "grabbing" : "grab",
                }}
              >
                {/* Brand related */}
                {data.brand && (
                  <Link
                    to={`/products?brand=${data.brand}`}
                    className="px-3 py-1.5 bg-white dark:bg-[#3d3d3d] text-sm rounded-full hover:bg-[#29625d] hover:text-white transition-colors"
                  >
                    More from {data.brand}
                  </Link>
                )}

                {/* Category related */}
                <Link
                  to={`/products?category=${data.category}`}
                  className="px-3 py-1.5 bg-white dark:bg-[#3d3d3d] text-sm rounded-full hover:bg-[#29625d] hover:text-white transition-colors"
                >
                  All {data.category}
                </Link>

                {/* Condition filter */}
                <Link
                  to={`/products?condition=${data.condition}`}
                  className="px-3 py-1.5 bg-white dark:bg-[#3d3d3d] text-sm rounded-full hover:bg-[#29625d] hover:text-white transition-colors"
                >
                  {data.condition} Products
                </Link>

                {/* Location based */}
                {data.location && (
                  <Link
                    to={`/products?location=${encodeURIComponent(
                      data.location
                    )}&category=${data.category}`}
                    className="px-3 py-1.5 bg-white dark:bg-[#3d3d3d] text-sm rounded-full hover:bg-[#29625d] hover:text-white transition-colors"
                  >
                    More {data.category} in {data.location}
                  </Link>
                )}

                {/* Price Range Suggestions */}
                <Link
                  to={`/products?category=${data.category}&maxPrice=${data.discountPrice}`}
                  className="px-3 py-1.5 bg-white dark:bg-[#3d3d3d] text-sm rounded-full hover:bg-[#29625d] hover:text-white transition-colors"
                >
                  Under {formatPrice(data.discountPrice)} RWF
                </Link>

                {/* Product Type */}
                {data.productType && (
                  <Link
                    to={`/products?productType=${data.productType}`}
                    className="px-3 py-1.5 bg-white dark:bg-[#3d3d3d] text-sm rounded-full hover:bg-[#29625d] hover:text-white transition-colors"
                  >
                    {data.productType} Items
                  </Link>
                )}

                {/* Category specific suggestions */}
                {data.category === "Cars" && (
                  <>
                    <Link
                      to={`/products?category=Cars&brand=${data.brand}`}
                      className="px-3 py-1.5 bg-white dark:bg-[#3d3d3d] text-sm rounded-full hover:bg-[#29625d] hover:text-white transition-colors"
                    >
                      All {data.brand} Cars
                    </Link>
                    <Link
                      to={`/products?category=Car Parts&brand=${data.brand}`}
                      className="px-3 py-1.5 bg-white dark:bg-[#3d3d3d] text-sm rounded-full hover:bg-[#29625d] hover:text-white transition-colors"
                    >
                      {data.brand} Parts
                    </Link>
                    <Link
                      to="/products?category=Car Accessories"
                      className="px-3 py-1.5 bg-white dark:bg-[#3d3d3d] text-sm rounded-full hover:bg-[#29625d] hover:text-white transition-colors"
                    >
                      Car Accessories
                    </Link>
                  </>
                )}

                {/* Shop related */}
                <Link
                  to={`/products?shop=${data.shop._id}&category=${data.category}`}
                  className="px-3 py-1.5 bg-white dark:bg-[#3d3d3d] text-sm rounded-full hover:bg-[#29625d] hover:text-white transition-colors"
                >
                  More {data.category} from this Shop
                </Link>

                {/* Similar Price Range */}
                <Link
                  to={`/products?category=${data.category}&minPrice=${data.discountPrice * 0.8
                    }&maxPrice=${data.discountPrice * 1.2}`}
                  className="px-3 py-1.5 bg-white dark:bg-[#3d3d3d] text-sm rounded-full hover:bg-[#29625d] hover:text-white transition-colors"
                >
                  Similar Price Range
                </Link>

                {/* Wholesale/Retail */}
                {data.productType?.toLowerCase().includes("wholesale") && (
                  <Link
                    to="/products?productType=wholesale"
                    className="px-3 py-1.5 bg-white dark:bg-[#3d3d3d] text-sm rounded-full hover:bg-[#29625d] hover:text-white transition-colors"
                  >
                    Wholesale Products
                  </Link>
                )}

                {/* Flash Sale */}
                {data.productType?.toLowerCase().includes("flashsale") && (
                  <Link
                    to="/products?productType=flashsale"
                    className="px-3 py-1.5 bg-white dark:bg-[#3d3d3d] text-sm rounded-full hover:bg-[#29625d] hover:text-white transition-colors"
                  >
                    Flash Sale Items
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="w-full py-5">
            <div className="block w-full 800px:flex relative gap-10 mx-auto">
              {/* Main Image Container */}
              <div className="w-full h-full md:w-[50%] overflow-hidden mb-10">
                {/* Product Tags */}
                <div className="flex flex-wrap items-center justify-center gap-2 my-4 mx-auto">
                  {data.condition && (
                    <span
                      className={`px-3 py-1 text-sm text-white rounded-full ${data.condition.toLowerCase() === "new"
                          ? "bg-green-500"
                          : "bg-[#29625d]"
                        }`}
                    >
                      {data.condition}
                    </span>
                  )}
                  {data.location && (
                    <span className="px-3 py-1 text-sm bg-black text-white rounded-full">
                      {data.location}
                    </span>
                  )}
                  {data.productType && (
                    <span className="px-3 py-1 text-sm bg-[#29625d] text-white rounded-full">
                      {data.productType}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <img
                    src={data.images[select]?.url}
                    alt=""
                    className="w-full h-[400px] md:full object-contain"
                  />
                  {/* Thumbnail Images Below */}
                  <div className="flex justify-center space-x-2 mt-4">
                    {data.images.slice(0, 4).map((img, index) => (
                      <img
                        key={index}
                        src={img.url}
                        alt=""
                        className={`h-[60px] w-[60px] object-cover rounded-md border p-1 cursor-pointer 
            ${select === index ? "border-[#29625d] border-2" : "border-gray-300"
                          }`}
                        onClick={() => setSelect(index)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              {/* Product Info Container */}
              <div className="w-full 800px:w-[50%] md:px-0 px-2 pt-5">
                <h1
                  className={`${styles.productTitle} text-md sm:text-xl md:text-2xl lg:text-2xl dark:text-white`}
                >
                  {data.name}
                </h1>
                <div className="flex pt-3">
                  <h4
                    className={`${styles.productDiscountPrice} text-base sm:text-lg md:text-xl lg:text-2xl`}
                  >
                    {formatPrice(data.discountPrice)}
                    <span className="text-sm ml-1">RWF</span>
                  </h4>
                  <h3
                    className={`${styles.price} text-sm sm:text-base md:text-lg lg:text-xl`}
                  >
                    {data.originalPrice
                      ? formatPrice(data.originalPrice)
                      : null}
                  </h3>
                </div>
                <div className="flex mt-4">
                  <Ratings rating={data.ratings} />{" "}
                  <span className="text-gray-700 dark:text-gray-400">
                    ({data.reviews ? data.reviews.length : "No"} Reviews)
                  </span>
                </div>
                <p className="text-gray-400 text-base font-bold mt-2 uppercase">
                  Description:
                </p>
                <div>
                  <ReactQuill
                    value={shortDescription}
                    readOnly
                    theme="bubble"
                  />
                  {isDescriptionLong && (
                    <button
                      className="text-[#27b3a7]  p-2 block mb-10 cursor-pointer"
                      onClick={toggleModal}
                    >
                      Show more
                    </button>
                  )}
                </div>
                <div className="flex items-center md:items-start mt-1 pr-3 space-x-2 mx-auto md:mx-0">
                  <div className="flex items-center border rounded-full overflow-hidden shadow-lg">
                    <button
                      className="text-gray-600 dark:text-white font-bold border-r border-gray-300 lg:text-md px-3 py-2 flex items-center justify-center hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={decrementCount}
                    >
                      -
                    </button>
                    <span className="text-gray-800 dark:text-white text-sm sm:text-base md:text-md lg:text-lg border-r border-gray-300 flex items-center justify-center px-3 py-2">
                      {count}
                    </span>
                    <button
                      className="text-gray-600 dark:text-white font-bold lg:text-md px-3 py-2 flex items-center justify-center hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={incrementCount}
                    >
                      +
                    </button>
                  </div>

                  <div
                    className="flex items-center px-4 bg-black px-4 py-2 rounded-full mt-1 cursor-pointer hover:bg-[#29635d]"
                    onClick={() => addToCartHandler(data._id)}
                  >
                    <span className="text-white flex items-center ">
                      <AiOutlineShoppingCart className="mr-1" />
                      Add to cart
                    </span>
                  </div>

                  <div className="p-2">
                    {click ? (
                      <AiFillHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={toggleWishlist}
                        color="#fdd69e"
                        title="Remove from wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={toggleWishlist}
                        color="#333"
                        title="Add to wishlist"
                      />
                    )}
                  </div>
                </div>
                <div className="flex items-center pt-8 md:mx-0 mx-auto">
                  <Link to={`/shop/preview/${data.shop._id}`}>
                    <img
                      src={data.shop.avatar.url}
                      alt=""
                      className="w-[50px] h-[50px] rounded-full mr-2 border"
                    />
                  </Link>
                  <div className="pr-8">
                    <Link to={`/shop/preview/${data.shop._id}`}>
                      <div className="flex items-center md:items-start justify-center md:justify-start space-x-2 mt-2">
                        <h3 className="text-center mb-1 text-sm md:text-lg lg:text-xl text-gray-800 dark:text-[#29625d]">
                          {data.shop.name}
                        </h3>
                        {/* Display the verified badge if the shop is verified */}
                        {shopVerify && (
                          <img
                            src={verified}
                            alt="Verified Badge"
                            className="w-[20px] h-[20px] mt-[1px] md:mt-[5px] cursor-pointer filter invert-0 hover:scale-110 transition-transform duration-200 ease-in-out"
                            draggable="false"
                            onContextMenu={(e) => e.preventDefault()} // Prevent right-click
                          />
                        )}
                      </div>
                    </Link>
                    <h5 className="pb-3 mt-[-8px] text-xs sm:text-sm md:text-base lg:text-md">
                      {/* Display average rating */}({averageRating}/5) Ratings
                    </h5>
                  </div>
                  <div
                    className="bg-[#29625d] p-2 rounded-md cursor-pointer hover:bg-black"
                    onClick={handleMessageSubmit}
                  >
                    <span className="text-white text-sm md:text-sm lg:text-sm flex items-center font-semibold">
                      Message Seller
                    </span>
                  </div>
                </div>
                <hr className="mt-12"></hr>
                <div className="flex items-center gap-4 mt-4">
                  <button
                    onClick={handleGenerateShareLink}
                    className="flex items-center gap-2 bg-[#29625d] text-white px-4 py-2 rounded-full hover:bg-[#1f4e45]"
                  >
                    <FaShare />
                    Share & Earn
                  </button>
                </div>
                <ShareButtons />
                <div className="mt-6 border-t pt-4">
                  <h4 className="text-lg font-semibold mb-2">Earn by Sharing</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Share this product and earn up to {data.commissionRate || 5}% commission on sales!
                  </p>
                  <CommissionShare />
                </div>
              </div>
            </div>
          </div>
          <ProductDetailsInfo
            data={data}
            products={products}
            totalReviewsLength={totalReviewsLength}
            averageRating={averageRating}
          />
          <br />
          <br />
        </div>
      ) : (
        <div className="h-screen flex items-center justify-center">No product details available.</div>
      )}
      <Modal
        show={isModalOpen}
        onClose={toggleModal}
        description={data?.description}
      />
      <ShareModal />
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .tags-scroll-container {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

const ProductDetailsInfo = ({
  data,
  products,
  totalReviewsLength,
  averageRating,
}) => {
  const [active, setActive] = useState(1);

  return (
    <div className="bg-[#f5f6fb] dark:bg-[#1f1f1f] dark:text-gray-200 px-3 800px:px-10 py-2 rounded">
      <div className="w-full flex justify-between border-b pt-10 pb-2">
        <div className="relative">
          <h5
            className="text-[#000] dark:text-white text-sm sm:text-base md:text-lg lg:text-xl px-1 leading-5 font-[600] cursor-pointer"
            onClick={() => setActive(1)}
          >
            Product Details
          </h5>
          {active === 1 && <div className={`${styles.active_indicator}`} />}
        </div>
        <div className="relative">
          <h5
            className="text-[#000] dark:text-white text-sm sm:text-base md:text-lg lg:text-xl px-1 leading-5 font-[600] cursor-pointer"
            onClick={() => setActive(2)}
          >
            Product Reviews
          </h5>
          {active === 2 && <div className={`${styles.active_indicator}`} />}
        </div>
        <div className="relative">
          <h5
            className="text-[#000] dark:text-white text-sm sm:text-base md:text-lg lg:text-xl px-1 leading-5 font-[600] cursor-pointer"
            onClick={() => setActive(3)}
          >
            Seller Information
          </h5>
          {active === 3 && <div className={`${styles.active_indicator}`} />}
        </div>
      </div>

      {active === 1 && (
        <>
          <div className="py-2 text-sm sm:text-base md:text-md lg:text-md height-[300px] overflow-hidden overflow-y-auto hide-scrollbar">
            <ReactQuill value={data.description} readOnly theme="bubble" />
          </div>
          <p className="py-2 text-sm sm:text-base md:text-lg lg:text-xl">
            {data.details}
          </p>
        </>
      )}

      {active === 2 && (
        <div className="w-full min-h-[40vh] flex flex-col items-center py-3 overflow-y-scroll">
          {data.reviews.map((item, index) => (
            <div className="w-full flex my-2" key={index}>
              <img
                src={item.user.avatar.url}
                className="w-[50px] h-[50px] rounded-full"
                alt=""
              />
              <div className="pl-2">
                <div className="w-full flex items-center">
                  <h1 className="font-[500] mr-3 text-sm sm:text-base md:text-lg lg:text-xl">
                    {item.user.name}
                  </h1>
                  <Ratings rating={data.ratings} />
                </div>
                <p className="text-xs sm:text-sm md:text-base lg:text-md">
                  {item.comment}
                </p>
              </div>
            </div>
          ))}
          {data.reviews.length === 0 && <h5>No Reviews yet!</h5>}
        </div>
      )}

      {active === 3 && (
        <div className="w-full block 800px:flex p-5">
          <div className="w-full 800px:w-[50%]">
            <div className="flex items-center">
              <img
                src={data.shop.avatar.url}
                className="w-[50px] h-[50px] rounded-full border"
                alt=""
              />
              <div className="pl-3">
                <div className="flex items-start justify-start space-x-2 mt-2">
                  <h3 className="text-center mb-1 text-sm md:text-lg lg:text-xl text-gray-800 dark:text-[#29625d]">
                    {data.shop.name}
                  </h3>
                </div>
                <h5 className="pb-2 text-xs sm:text-sm md:text-base lg:text-md">
                  ({averageRating}/5) Ratings
                </h5>
              </div>
            </div>
            <div className="py-2 text-sm sm:text-base md:text-md lg:text-md">
              <p className="pb-2 text-xs sm:text-sm md:text-base lg:text-md">
                PAY THROUGH: {data.shop.paymentInfo}
              </p>
            </div>
            <div className="py-2 text-sm sm:text-base md:text-md lg:text-md">
              <ReactQuill
                value={data.shop.description}
                readOnly
                theme="bubble"
              />
            </div>
          </div>
          <div className="w-full 800px:w-[50%] mt-5 800px:mt-0 800px:flex 800px:flex-col 800px:items-end">
            <div className="text-left 800px:text-right">
              <h5 className="font-[600] text-xs sm:text-sm md:text-base lg:text-md">
                Joined on:{" "}
                <span className="font-[500]">
                  {data.shop.createdAt?.slice(0, 10)}
                </span>
              </h5>
              <h5 className="font-[600] pt-3 text-xs sm:text-sm md:text-base lg:text-md">
                Total Products:{" "}
                <span className="font-[500]">{products.length}</span>
              </h5>
              <h5 className="font-[600] pt-3 text-xs sm:text-sm md:text-base lg:text-md">
                Total Reviews:{" "}
                <span className="font-[500]">{totalReviewsLength}</span>
              </h5>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
