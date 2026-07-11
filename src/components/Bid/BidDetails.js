import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBidDetails, placeBid } from "../../redux/actions/bids";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import io from 'socket.io-client';
import { socketUrl } from "../../server";
import { addTocart } from "../../redux/actions/cart";

// Custom hook for debouncing input changes
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Memoized Thumbnail Image Component
const ThumbnailImage = React.memo(({ img, onClick }) => (
  <img
    key={img.url}
    src={img.url}
    alt={img.url}
    className="h-[50px] w-[50px] object-cover rounded-md border dark:bg-[#1f1f1f] shadow-md cursor-pointer"
    onClick={onClick}
  />
));

const BidDetails = () => {
  const { bidId } = useParams();
  const dispatch = useDispatch();
  const [select, setSelect] = useState(0);
  const [bidAmount, setBidAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tags, setTags] = useState([
    "All Bids",
    "Active Bids",
    "Ending Soon",
    "New Bids",
    "Popular",
    "Most Viewed",
    "Featured",
    "High Value",
  ]);
  const [relatedBids, setRelatedBids] = useState([]);
  const [socket, setSocket] = useState(null);
  const [currentHighestBid, setCurrentHighestBid] = useState(0);
  const navigate = useNavigate();

  const { bidDetails, isLoading, error } = useSelector((state) => state.bids);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  // Debounce bidAmount to avoid unnecessary state updates
  const bidAmountDebounced = useDebounce(bidAmount, 500);

  useEffect(() => {
    if (bidId) {
      dispatch(getBidDetails(bidId)); // Fetch the bid details only once on mount
    }
  }, [dispatch, bidId]);

  // Handle the input change with a simple regex to restrict bidAmount
  const handleBidAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setBidAmount(value);
    }
  };

  // Function to place the bid
  const handlePlaceBid = async () => {
    if (parseFloat(bidAmountDebounced) <= currentHighestBid) {
      toast.error("Your bid must be higher than the current highest bid!");
      return;
    }

    try {
      await dispatch(placeBid(bidId, bidAmountDebounced));
      // Emit the new bid event
      socket.emit('placeBid', {
        bidId,
        amount: parseFloat(bidAmountDebounced)
      });
      setBidAmount(""); // Clear input after successful bid
    } catch (error) {
      toast.error("Failed to place bid. Please try again.");
    }
  };

  // Format the price to include commas for better readability
  const formatPrice = (price) =>
    price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Lazy load images - this is optional but can help with performance
  const imagePlaceholder = "/path/to/placeholder-image.jpg"; // Use a generic image as placeholder

  const bidEndTime = new Date(bidDetails?.auctionEndTime);
  const isEnded = bidEndTime < new Date();

  const description =
    bidDetails?.auctionProduct.description || "No description available.";
  const isDescriptionLong = description.length > 350;
  const truncatedDescription =
    description.slice(0, 350) + (isDescriptionLong ? "..." : "");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Add this function for tag scrolling
  const handleTagScroll = (direction) => {
    const container = document.querySelector(".tags-scroll-container");
    const scrollAmount = 200;
    if (container) {
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Add this useEffect for socket connection
  useEffect(() => {
    const newSocket = io(socketUrl);
    setSocket(newSocket);

    // Cleanup on unmount
    return () => newSocket.disconnect();
  }, []);

  

  // Add this useEffect for real-time bid updates
  useEffect(() => {
    if (socket && bidId) {
      // Join bid room
      socket.emit('joinBidRoom', bidId);

      // Listen for new bids
      socket.on('newBid', (data) => {
        if (data.bidId === bidId) {
          setCurrentHighestBid(data.amount);
          // Update the UI with new bid info
          toast.success(`New bid placed: RWF ${formatPrice(data.amount)}`);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('newBid');
        socket.emit('leaveBidRoom', bidId);
      }
    };
  }, [socket, bidId]);

  // Update initial highest bid when bid details are loaded
  useEffect(() => {
    if (bidDetails) {
      setCurrentHighestBid(bidDetails.highestBid);
    }
  }, [bidDetails]);

  // Add isWinningBid calculation
  const isWinningBid = bidDetails && user &&
    bidDetails.highestBidder === user._id &&
    (bidDetails.isAuctionClosed || new Date(bidDetails.auctionEndTime) < new Date());

  const handlePurchaseNow = () => {
    if (!isAuthenticated) {
      toast.error("Please login to continue");
      navigate('/login');
      return;
    }

    if (!user.addresses || user.addresses.length === 0) {
      toast.error("Please add a shipping address first");
      navigate('/profile');
      return;
    }

    if (bidDetails && isWinningBid) {
      try {
        // Create cart item from won bid
        const cartItem = {
          _id: bidDetails.auctionProduct._id,
          name: bidDetails.auctionProduct.name,
          description: bidDetails.auctionProduct.description,
          price: bidDetails.highestBid,
          discountPrice: bidDetails.highestBid, // Same as price for won bids
          qty: 1,
          images: bidDetails.auctionProduct.images,
          shopId: bidDetails.seller,
          shop: bidDetails.shop,
          isWonBid: true,
          auctionId: bidDetails._id,
        };

        // Add to cart
        dispatch(addTocart(cartItem));
        toast.success("Added to cart successfully!");
        navigate("/checkout");
      } catch (error) {
        console.error("Error preparing order:", error);
        toast.error("Error processing your order. Please try again.");
      }
    }
  };

  // Avoid rendering if the bidDetails are still loading or empty
  if (isLoading) {
    return (
      <div className="flex h-[100vh] justify-center items-center p-2">
        <div className="border-t-4  border border-3 border-[#29625d] animate-spin rounded-full h-16 w-16"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[100vh] justify-center items-center p-2">
        <div className="text-red-600 block w-full">{error}</div>
      </div>
    );
  }

  if (!bidDetails) {
    return <div>Bid not found</div>;
  }

  return (
    <div className="bg-white mt-0 dark:bg-[#1f1f1f] min-h-screen">
      {/* Tags Navigation */}
      <div className="w-full mt-0 dark:bg-[#2b2b2b] sticky top-0">
        <div className="max-w-[1200px] mx-auto relative px-4 py-3">
          {/* Left scroll button */}
          <button
            onClick={() => handleTagScroll("left")}
            className="absolute -left-2 top-1/2 transform -translate-y-1/2 z-[41] bg-[#29625d] hover:bg-black rounded-full p-1.5 shadow-md opacity-70 hover:opacity-100 transition-all"
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Tags container */}
          <div className="overflow-x-auto tags-scroll-container hide-scrollbar mx-8">
            <div className="flex gap-3 whitespace-nowrap">
              {tags.map((tag, index) => (
                <Link
                  key={index}
                  to={`/bids?tag=${tag}`}
                  className="px-4 py-1.5 bg-[#f5f5f5] dark:bg-[#1f1f1f] text-sm rounded-full text-gray-700 dark:text-white hover:bg-[#29625d] hover:text-white transition-colors flex-shrink-0"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Right scroll button */}
          <button
            onClick={() => handleTagScroll("right")}
            className="absolute -right-2 top-1/2 transform -translate-y-1/2 z-[41] bg-[#29625d] hover:bg-black rounded-full p-1.5 shadow-md opacity-70 hover:opacity-100 transition-all"
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Images */}
          <div className="w-full lg:w-[45%]">
            {/* Main Image */}
            <div className="relative aspect-square bg-white dark:bg-transparent rounded-xl overflow-hidden shadow-sm">
              <img
                src={bidDetails.auctionProduct.images[select]?.url}
                alt={bidDetails.auctionProduct.name}
                className="w-full h-full object-contain p-4"
              />
            </div>

            {/* Thumbnails */}
            {/* Thumbnails */}
            <div className="flex justify-center gap-3 mt-4 overflow-x-auto hide-scrollbar">
              {bidDetails.auctionProduct.images.map((img, index) => (
                <div
                  key={index}
                  onClick={() => setSelect(index)}
                  className={`relative w-16 h-16 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden 
                bg-white dark:bg-[#2b2b2b] transition-all
                ${select === index
                      ? "ring-2 ring-[#7e807f]"
                      : "ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-[#29625d]"
                    }
            `}
                >
                  <img
                    src={img.url}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="flex-1 lg:w-[55%]">
            <div className="bg-white dark:bg-transparent rounded-xl p-6 shadow-sm">
              {/* Title and Description */}
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {bidDetails.auctionProduct.name}
                </h1>
                <div className="prose dark:prose-invert max-w-none">
                  <ReactQuill
                    value={truncatedDescription}
                    readOnly
                    theme="bubble"
                    className="dark:text-gray-300"
                  />
                  {isDescriptionLong && (
                    <button
                      onClick={openModal}
                      className="text-[#29625d] hover:text-[#1f4f4a] dark:hover:text-[#3a7d77] font-medium transition-colors"
                    >
                      Read More
                    </button>
                  )}
                </div>
              </div>

              {/* Bid Info */}
              <div className="space-y-6 border-t border-gray-100 dark:border-gray-800 pt-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Current Highest Bid
                  </h2>
                  <p className="text-3xl font-bold text-[#29625d] dark:text-[#3a7d77] mt-2">
                    RWF {formatPrice(currentHighestBid)}
                  </p>
                </div>

                {/* Auction Details */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Auction Details
                  </h2>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-2">
                    <span>{bidDetails.bids.length} Bids</span>
                    <span>•</span>
                    <span>
                      Ends{" "}
                      {new Date(bidDetails.auctionEndTime).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Bid Input or Purchase Section */}
                {isWinningBid ? (
                  <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="text-green-800 dark:text-green-200 font-semibold">
                      Congratulations! You won this auction!
                    </div>
                    <div className="text-green-700 dark:text-green-300 text-sm mt-1">
                      Winning Bid: RWF {formatPrice(bidDetails.highestBid)}
                    </div>
                    <button
                      onClick={handlePurchaseNow}
                      className="mt-4 w-full bg-[#29625d] hover:bg-[#1f4f4a] text-white py-2 rounded-lg transition-colors"
                    >
                      Purchase Now
                    </button>
                  </div>
                ) : !isEnded ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="number"
                        min={bidDetails.highestBid + 1}
                        value={bidAmount}
                        onChange={handleBidAmountChange}
                        className="w-full pl-16 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg 
                                                    bg-gray-50 dark:bg-[#1f1f1f] text-gray-900 dark:text-white placeholder-gray-500
                                                    dark:placeholder-gray-400 focus:ring-2 focus:ring-[#29625d] focus:border-transparent
                                                    transition-colors"
                        placeholder="Enter your bid amount"
                      />
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 dark:text-gray-400">
                          RWF
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handlePlaceBid}
                      disabled={isEnded || !bidAmount}
                      className="w-full bg-[#29625d] hover:bg-[#1f4f4a] text-white font-medium py-3 px-6 
                                                rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed
                                                transform hover:scale-[0.99] active:scale-[0.97]"
                    >
                      Place Bid
                    </button>
                  </div>
                ) : (
                  <div
                    className="text-red-500 dark:text-red-400 font-semibold text-center py-2 
                                        bg-red-50 dark:bg-red-900/20 rounded-lg"
                  >
                    Auction has ended
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Bids Section */}
      {relatedBids.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Related Bids
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedBids.map((bid) => (
              <Link key={bid._id} to={`/bid/${bid._id}`} className="group">
                <div className="bg-white dark:bg-[#2b2b2b] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                  <div className="aspect-square">
                    <img
                      src={bid.images[0]?.url}
                      alt={bid.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {bid.name}
                    </h3>
                    <p className="text-[#29625d] font-semibold mt-1">
                      Current Bid: RWF {formatPrice(bid.currentBid)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Description Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white dark:bg-[#2b2b2b] rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-y-auto hide-scrollbar">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Full Description
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <ReactQuill
                  value={description}
                  readOnly
                  theme="bubble"
                  className="dark:text-gray-300"
                />
              </div>
              <button
                onClick={closeModal}
                className="mt-6 bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BidDetails;
