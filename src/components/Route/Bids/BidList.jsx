import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineClock, HiOutlineUser } from "react-icons/hi";

const BidList = ({ bids }) => {
  const formatPrice = (price) =>
    price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";

  const getTimeRemaining = (endTime) => {
    const diff = new Date(endTime) - new Date();
    if (diff <= 0) return { label: "Ended", urgent: false };
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    if (hours > 48) return { label: `${Math.floor(hours / 24)}d left`, urgent: false };
    if (hours < 6) return { label: `${hours}h ${minutes}m`, urgent: true };
    return { label: `${hours}h ${minutes}m`, urgent: false };
  };

  return (
    <div className="marketplace-product-grid mpc-grid--page mb-8">
      {bids?.map((bid) => {
        const time = getTimeRemaining(bid?.auctionEndTime);
        const isActive = new Date(bid?.auctionEndTime) > new Date();

        return (
          <article
            key={bid._id}
            className="yebone-card-lift group flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm"
          >
            <div className="relative aspect-square overflow-hidden bg-yebone-light-gray">
              <img
                src={bid?.auctionProduct?.images?.[0]?.url}
                alt={bid?.auctionProduct?.name}
                className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out yebone-img-fade"
              />
              <span
                className={`absolute top-3 left-3 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase text-white ${
                  isActive ? "bg-yebone-primary" : "bg-gray-500"
                }`}
              >
                {isActive ? "Live" : "Closed"}
              </span>
              {bid?.isFlashSale && (
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-red-500 text-white text-[10px] font-bold uppercase">
                  Flash
                </span>
              )}
              {time.urgent && (
                <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-lg bg-red-500 text-white text-[10px] font-semibold">
                  Ending soon
                </span>
              )}
            </div>

            <div className="p-4 flex flex-col flex-grow gap-2">
              <h3 className="font-Poppins font-medium text-sm line-clamp-2 dark:text-white group-hover:text-yebone-primary transition">
                {bid?.auctionProduct?.name}
              </h3>

              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wide">Current bid</p>
                <p className="text-yebone-primary font-bold">
                  RWF {formatPrice(bid?.currentBid || bid?.startingBid)}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <HiOutlineClock className="shrink-0" />
                <span className={time.urgent ? "text-red-500 font-semibold" : ""}>
                  {time.label}
                </span>
              </div>

              {bid?.shop?.name && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <HiOutlineUser className="shrink-0" />
                  <span className="truncate">{bid.shop.name}</span>
                </div>
              )}

              <Link
                to={`/bid/${bid._id}`}
                className="mt-auto block w-full text-center rounded-xl bg-yebone-primary hover:bg-yebone-primary-dark text-white text-sm font-semibold py-2.5 transition yebone-btn-lift"
              >
                View auction
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default BidList;
