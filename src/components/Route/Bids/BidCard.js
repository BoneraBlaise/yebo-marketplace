import React from 'react';
import { Link } from 'react-router-dom';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { toast } from 'react-toastify';
import Ratings from '../../Products/Ratings'; // Assuming you have this component for displaying ratings

const BidCard = ({ bid, onPlaceBid }) => {
  // Format the price
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Format the time left
  const getTimeLeft = (endTime) => {
    const now = new Date();
    const auctionEndTime = new Date(endTime);
    const timeDiff = auctionEndTime - now;
    if (timeDiff <= 0) return 'Auction Ended';
    
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m left`;
  };

  const handlePlaceBid = () => {
    if (!bid.startingBid || bid.startingBid <= 0) {
      toast.error('Please enter a valid bid amount!');
      return;
    }
    onPlaceBid(bid._id, bid.startingBid + 100); // Example increment of 100
  };

  const isAuctionEnded = new Date(bid.auctionEndTime) < new Date();
  const isInWishlist = false; // Modify based on your wishlist management logic

  return (
    <div className="flex border dark:border-1 dark:border-[#2b2b2b] transition-shadow duration-300 w-full h-[270px] max-w-full mx-auto relative">
      {isAuctionEnded && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
          Ended
        </span>
      )}
      <Link to={`/bid/${bid._id}`} className="flex-shrink-0 flex items-center h-full">
        <img
          src={bid.images[0]?.url}
          alt={bid.name}
          className="h-full w-[250px] object-cover bg-[#f1f1f1]"
        />
      </Link>
      <div className="flex-grow flex flex-col justify-between p-6">
        <div>
          <Link to={`/bid/${bid._id}`}>
            <h2 className="font-medium text-xl mb-2">
              {bid.name.length > 360 ? `${bid.name.slice(0, 330)}...` : bid.name}
            </h2>
          </Link>

          <div className="flex justify-between items-center mb-2">
            <h5 className="text-md font-semibold">
              RWF {formatPrice(bid.startingBid ? bid.startingBid : bid.originalPrice)}
            </h5>
            <span className="font-medium text-sm mt-4 text-[#68d284]">
              {bid.stock} In Stock
            </span>
          </div>
          <div className="flex mt-1">
            <Ratings rating={bid.ratings} /> {bid.reviews?.length} Reviews
          </div>
          {!isAuctionEnded && (
            <p className="text-sm text-[#29625d] font-bold">
              {getTimeLeft(bid.auctionEndTime)}
            </p>
          )}
        </div>

        <div className="flex gap-3 mt-3">
          {isInWishlist ? (
            <AiFillHeart
              size={42}
              className="cursor-pointer bg-gray-100 dark:bg-transparent p-1 rounded-full"
              color="red"
              title="Remove from wishlist"
            />
          ) : (
            <AiOutlineHeart
              size={42}
              className="cursor-pointer bg-gray-100 dark:bg-transparent p-1 rounded-full"
              title="Add to wishlist"
            />
          )}
          <button
            className="bg-[#29625d] text-white py-2 px-4 rounded-full transition duration-300 hover:bg-black"
            onClick={handlePlaceBid}
            disabled={isAuctionEnded}
            title="Place Bid"
          >
            {isAuctionEnded ? 'Auction Ended' : 'Place Bid'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BidCard;
