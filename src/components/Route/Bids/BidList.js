import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { getActiveBids } from '../../../redux/actions/bids';
import { useMediaQuery } from 'react-responsive';
import { addToWishlist, removeFromWishlist } from '../../../redux/actions/wishlist';  // Same action for both products and bids
import MobileBidCard from './MobileBidCard';
import { server } from '../../../server';
import axios from 'axios';

const BidList = ({ bids }) => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  
  const { isLoading, error, activeBids } = useSelector((state) => state.bids);
  const { wishlist } = useSelector((state) => state.wishlist);
  const isMobile = useMediaQuery({ query: '(max-width: 900px)' });
  const [clickedBidId, setClickedBidId] = useState(null);
  const [filteredBids, setFilteredBids] = useState([]);

  // Filter bids based on search term
  useEffect(() => {
    if (!Array.isArray(activeBids)) {
      setFilteredBids([]);
      return;
    }

    const filtered = activeBids.filter(bid => {
      if (!bid || !bid.auctionProduct) return false;

      const matchesSearch = searchTerm ? (
        bid.auctionProduct.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bid.auctionProduct.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bid.auctionProduct.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (bid.auctionProduct.tags && 
          bid.auctionProduct.tags.some(tag => 
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          ))
      ) : true;

      return matchesSearch;
    });

    setFilteredBids(filtered);
  }, [activeBids, searchTerm]);

  // Fetch active bids
  useEffect(() => {
    if (!activeBids.length) {
      dispatch(getActiveBids());
    }
  }, [dispatch, activeBids.length]);

  const handleWishlistToggle = async (bid) => {
    const bidData = {
      _id: bid._id,
      name: bid.auctionProduct.name,
      imageUrl: bid.auctionProduct.images[0]?.url,  // Ensure image[0] is used
      totalPrice: bid.highestBid || bid.originalPrice,  // Fallback to originalPrice if highestBid is undefined
    };

    const isInWishlist = wishlist.some((item) => item._id === bid._id);

    try {
      // Send the request to the server to handle the like/unlike logic
      const response = await axios.put(
        `${server}/bids/like-bid`,
        { bidId: bid._id },
        {
          withCredentials: true,  // Ensure cookies are sent with the request
        }
      );

      if (response.data.success) {
        // Update the Redux state after a successful response from the server
        if (isInWishlist) {
          dispatch(removeFromWishlist(bidData));
          toast.info('Removed from wishlist!');
        } else {
          dispatch(addToWishlist(bidData));
          toast.success('Added to wishlist!');
        }
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      toast.error("Can not follow this Auction at the moment!.");
    }
  };

  // Format price with commas
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Handle bid click to change color
  const handleBidClick = (bidId) => {
    setClickedBidId(bidId);
  };

  if (isLoading) {
    return <div>Loading bids...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={`p-4 w-full mx-auto ${isMobile ? 'grid grid-cols-1 gap-4' : 'flex flex-col gap-4'}`}>
      {bids.length === 0 ? (
        <div className="text-center w-full pb-[100px] text-[20px]">
          {searchTerm ? `No bids found matching "${searchTerm}"` : 'No active bids available!'}
        </div>
      ) : (
        bids.map((bid) => {
          const bidEndTime = new Date(bid.auctionEndTime);
          const isEnded = bidEndTime < new Date();
          const isInWishlist = wishlist.some((item) => item._id === bid._id);
          const isClicked = clickedBidId === bid._id;

          // Mobile Card View using MobileBidCard Component
          return isMobile ? (
            <MobileBidCard
              key={bid._id}
              bid={bid}
              isInWishlist={isInWishlist}
              handleWishlistToggle={handleWishlistToggle}
              formatPrice={formatPrice}
              handleBidClick={handleBidClick}
            />
          ) : (
            // Desktop Card View
            <div
              key={bid._id}
              className="flex border dark:border-1 dark:border-[#2b2b2b] transition-shadow duration-300 w-full h-[270px] max-w-full mx-auto relative"
            >
              {isEnded && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  Closed
                </span>
              )}
              <Link to={`/bid/${bid._id}`} className="flex-shrink-0 flex items-center h-full">
                <img
                  src={bid.auctionProduct.images[0]?.url}
                  alt={bid.auctionProduct.name}
                  className="h-full w-[250px] object-cover bg-[#f1f1f1]"
                />
              </Link>
              <div className="flex-grow flex flex-col justify-between p-6">
                <div>
                  <Link to={`/bid/${bid._id}`} onClick={() => handleBidClick(bid._id)}>
                    <h2
                      className={`font-medium text-xl mb-2 ${isClicked ? 'text-blue-500' : 'hover:text-[#29625d]'}`}
                    >
                      {bid.auctionProduct.name.length > 360
                        ? `${bid.auctionProduct.name.slice(0, 330)}...`
                        : bid.auctionProduct.name}
                    </h2>
                  </Link>
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-md font-semibold text-red-400 dark:text-green-200">
                      RWF {formatPrice(bid.highestBid || bid.originalPrice)}
                    </h5>
                  </div>
                  {isEnded ? (
                    <p className="text-sm text-[#29625d] font-bold">Auction Closed</p>
                  ) : (
                    <p className="mt-4 text-md block">
                      <p className="text-sm text-gray-400 dark:text-gray-400">
                        {bid.bids.length} Bids
                      </p>
                      <span className="text-green-600 text-sm font-medium block">
                        {new Date(bid.auctionEndTime).toLocaleString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                        <span className="text-sm font-medium ml-2">
                          ({Math.ceil((new Date(bid.auctionEndTime) - new Date()) / (1000 * 60 * 60 * 24))} days remaining)
                        </span>
                      </span>
                    </p>
                  )}
                </div>
                <div className="flex mt-3">
                  {/* Wishlist Button */}
                  <div className="flex items-center border px-3 rounded-full mr-2">
                    {isInWishlist ? (
                      <AiFillHeart
                        size={35}
                        className="cursor-pointer dark:bg-transparent p-1 rounded-full"
                        onClick={() => handleWishlistToggle(bid, true)}
                        color="#ffd496"
                        title="Remove from wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={35}
                        className="cursor-pointer dark:bg-transparent p-1 rounded-full"
                        onClick={() => handleWishlistToggle(bid, false)}
                        title="Add to wishlist"
                      />
                    )}
                    <span className="text-sm mr-2 text-green-700">{bid.likes.length}</span>
                  </div>
                  {isEnded ? (
                    <p className="text-sm text-red-600 mt-1 bg-red-200 bg-opacity-60 py-1 px-2 font-bold">Auction Closed</p>
                  ) : (
                    // Bid Button
                    <Link to={`/bid/${bid._id}`}>
                      <button
                        className="bg-[#29625d] text-white py-2 px-4 rounded-full transition duration-300 hover:bg-black"
                        onClick={() => console.log('Place Bid')} // Implement place bid action here
                        title="Place a bid"
                      >
                        Place Bid
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default BidList;
