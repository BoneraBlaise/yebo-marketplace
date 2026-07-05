import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getWinningBids } from '../../redux/actions/bids';
import styles from '../../styles/styles';
import { toast } from 'react-hot-toast';
import { addTocart } from '../../redux/actions/cart';

const WinningBids = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { winningBids, isLoading } = useSelector((state) => state.bids);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      dispatch(getWinningBids());
    }
  }, [dispatch, user]);

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handlePurchase = (bid) => {
    if (!user) {
      toast.error("Please login to purchase");
      return;
    }

    const wonBid = {
      _id: bid.auctionProduct._id,
      name: bid.auctionProduct.name,
      discountPrice: bid.highestBid,
      originalPrice: bid.auctionProduct.originalPrice,
      images: bid.auctionProduct.images,
      qty: 1,
      shopId: bid.auctionProduct.shop._id,
      isWonBid: true,
      bidId: bid._id,
      stock: 1
    };

    dispatch(addTocart(wonBid));

    navigate("/checkout", { 
      state: { 
        wonBid,
        orderType: 'won_bid'
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#29625d]"></div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-5">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-[25px] font-[600] dark:text-white pb-2">
          Won Auctions
        </h1>
      </div>
      <br />
      <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12">
        {winningBids && winningBids.length > 0 ? (
          winningBids.map((bid) => (
            <div
              key={bid._id}
              className="bg-white dark:bg-[#2b2b2b] rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <div className="relative aspect-square">
                <img
                  src={bid.auctionProduct.images[0]?.url}
                  alt={bid.auctionProduct.name}
                  className="w-full h-full object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Won
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  {bid.auctionProduct.name}
                </h2>
                <p className="text-[#29625d] font-semibold mt-2">
                  Winning Bid: RWF {formatPrice(bid.highestBid)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Ended: {new Date(bid.auctionEndTime).toLocaleDateString()}
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handlePurchase(bid)}
                    className="flex-1 bg-[#29625d] text-white text-center py-2 rounded-lg hover:bg-[#1f4f4a] transition-colors"
                  >
                    Purchase
                  </button>
                  <Link
                    to={`/bid/${bid._id}`}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">
              No won auctions yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WinningBids; 