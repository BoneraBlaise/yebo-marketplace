import React from 'react';
import { Link } from 'react-router-dom';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

const MobileBidCard = ({ bid, isInWishlist, handleWishlistToggle, formatPrice, handleBidClick }) => {
  const bidEndTime = new Date(bid.auctionEndTime);
  const isEnded = bidEndTime < new Date();
  
  return (
    <div
      key={bid._id}
      className="flex flex-col border dark:bg-[#2b2b2b] dark:border-1 dark:border-[#2b2b2b] transition-shadow duration-300 w-full mx-auto relative mb-4 rounded-lg shadow-lg"
    >
      {/* Auction Ended Badge */}
      {isEnded && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
          Ended
        </span>
      )}
      
      {/* Product Image */}
      <Link to={`/bid/${bid._id}`} className="flex-shrink-0 flex items-center justify-center w-full">
        <img
          src={bid.auctionProduct.images[0]?.url}
          alt={bid.auctionProduct.name}
          className="w-full h-[180px] object-cover bg-[#f1f1f1] rounded-t-lg"
        />
      </Link>

      {/* Product Details */}
      <div className="p-4">
        <Link to={`/bid/${bid._id}`} onClick={() => handleBidClick(bid._id)}>
          <h2 className="font-medium text-lg text-[#29625d] mb-2">
            {bid.auctionProduct.name.length > 120
              ? `${bid.auctionProduct.name.slice(0, 100)}...`
              : bid.auctionProduct.name}
          </h2>
        </Link>
        <div className="flex justify-between items-center mb-2">
          <h5 className="text-md font-semibold">RWF {formatPrice(bid.highestBid || bid.originalPrice)}</h5>
        </div>

        {/* Auction Time Remaining */}
        {isEnded ? (
          <p className="text-sm text-[#29625d] font-bold">Auction Ended</p>
        ) : (
          <p className="text-sm text-green-600 font-semibold mt-2">
            Auction Ending in: {Math.ceil((new Date(bid.auctionEndTime) - new Date()) / (1000 * 60 * 60 * 24))} days
          </p>
        )}
      </div>

      {/* Action Buttons (Wishlist, Bid) */}
      <div className="flex gap-3 p-4">
        {/* Wishlist Button */}
        {isInWishlist ? (
          <AiFillHeart
            size={32}
            className="cursor-pointer p-1 rounded-full"
            color="red"
            onClick={() => handleWishlistToggle(bid)}
            title="Remove from wishlist"
          />
        ) : (
          <AiOutlineHeart
            size={32}
            className="cursor-pointer p-1 rounded-full"
            onClick={() => handleWishlistToggle(bid)}
            title="Add to wishlist"
          />
        )}

        {/* Bid Button */}
        <Link to={`/bid/${bid._id}`}>
          <button
            className="bg-[#29625d] text-white py-2 px-4 rounded-full transition duration-300 hover:bg-black"
            onClick={() => console.log('Place Bid')} // Implement place bid action here
            title="Place a bid"
          >
            Place Bid
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MobileBidCard;
