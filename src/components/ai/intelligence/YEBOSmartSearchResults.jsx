import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineSparkles } from "react-icons/hi";
import AICard from "../primitives/AICard";

const formatPrice = (n) => (n ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const YEBOSmartSearchResults = ({ data, compact = false }) => {
  if (!data) return null;

  return (
    <div className={`space-y-3 yebone-fade-up ${compact ? "" : "mt-4"}`}>
      <div className="flex items-center gap-2">
        <HiOutlineSparkles className="text-yebone-gold" size={16} />
        <p className="text-xs font-semibold text-yebone-primary">YEBO mock results</p>
        {data.parsedIntent?.type && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-yebone-gold/20 text-yebone-dark-text font-semibold ml-auto">
            {data.parsedIntent.type}
          </span>
        )}
      </div>

      <div className="space-y-2">
        {data.results?.map((item) => (
          <AICard key={item._id} padding="sm" className="!p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold dark:text-white truncate">{item.name}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{item.reason}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-yebone-primary tabular-nums">
                  RWF {formatPrice(item.discountPrice)}
                </p>
                <p className="text-[10px] text-yebone-gold font-semibold">{item.matchScore}% match</p>
              </div>
            </div>
          </AICard>
        ))}
      </div>

      {data.tips?.length > 0 && (
        <p className="text-[10px] text-gray-400 leading-relaxed">
          {data.tips[0]} · Use{" "}
          <Link to="/products" className="text-yebone-primary hover:underline">
            header search
          </Link>{" "}
          for live results.
        </p>
      )}
    </div>
  );
};

export default YEBOSmartSearchResults;
