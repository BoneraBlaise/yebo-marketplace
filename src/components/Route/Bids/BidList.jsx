import React from "react";
import { Link } from "react-router-dom";

const BidList = ({ bids }) => {
  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 mb-8">
      {bids?.map((bid) => (
        <div 
          key={bid._id} 
          className="bg-white dark:bg-[#2b2b2b] rounded-lg shadow-sm hover:shadow-md transition-all flex flex-col"
        >
          <div className="relative w-full aspect-square">
            <img
              src={bid?.auctionProduct?.images?.[0]?.url}
              alt={bid?.auctionProduct?.name}
              className="w-full h-full object-cover rounded-t-lg"
            />
            {bid?.isFlashSale && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                Flash Sale
              </div>
            )}
          </div>
          <div className="p-3 flex flex-col flex-grow">
            <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">
              {bid?.auctionProduct?.name}
            </h3>
            <div className="text-[#29625d] font-semibold text-sm">
              RWF {formatPrice(bid?.currentBid || bid?.startingBid)}
            </div>
            <div className="text-xs text-gray-500 mb-2">
              Ends: {new Date(bid?.auctionEndTime).toLocaleDateString()}
            </div>
            <Link
              to={`/bid/${bid._id}`}
              className="mt-auto block w-full text-center bg-[#29625d] hover:bg-[#1f4f4a] text-white text-sm py-1.5 rounded-lg transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BidList; 