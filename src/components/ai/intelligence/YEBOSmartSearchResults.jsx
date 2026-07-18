import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineSparkles } from "react-icons/hi";
import AICard from "../primitives/AICard";

const formatPrice = (n) => (n ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const YEBOSmartSearchResults = ({ data, compact = false }) => {
  if (!data) return null;

  const searchRequest = data.searchRequest || null;
  const hasResults = Array.isArray(data.results) && data.results.length > 0;

  return (
    <div className={`space-y-3 yebone-fade-up ${compact ? "" : "mt-4"}`}>
      <div className="flex items-center gap-2 flex-wrap">
        <HiOutlineSparkles className="text-yebone-gold" size={16} />
        <p className="text-xs font-semibold text-yebone-primary">YEBO search results</p>
        {data.parsedIntent?.type && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-yebone-gold/20 text-yebone-dark-text font-semibold">
            {data.parsedIntent.type}
            {data.parsedIntent.language ? ` · ${data.parsedIntent.language}` : ""}
          </span>
        )}
      </div>

      {searchRequest && (
        <div className="flex flex-wrap gap-1.5">
          {searchRequest.brand && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800">
              Brand: {searchRequest.brand}
            </span>
          )}
          {searchRequest.category && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800">
              Category: {searchRequest.category}
            </span>
          )}
          {searchRequest.maxPrice != null && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800">
              Max: RWF {formatPrice(searchRequest.maxPrice)}
            </span>
          )}
          {searchRequest.minPrice != null && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800">
              Min: RWF {formatPrice(searchRequest.minPrice)}
            </span>
          )}
        </div>
      )}

      {data.summary && (
        <p className="text-[11px] text-gray-500 leading-relaxed">{data.summary}</p>
      )}

      <div className="space-y-2">
        {hasResults ? (
          data.results.map((item) => (
            <AICard key={item._id} padding="sm" className="!p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link
                    to={`/product/${item._id}`}
                    className="text-sm font-semibold dark:text-white truncate hover:text-yebone-primary"
                  >
                    {item.name}
                  </Link>
                  {item.reason && (
                    <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">{item.reason}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-yebone-primary tabular-nums">
                    RWF {formatPrice(item.discountPrice)}
                  </p>
                  {item.matchScore != null && (
                    <p className="text-[10px] text-yebone-gold font-semibold">
                      {item.matchScore}% match
                    </p>
                  )}
                </div>
              </div>
            </AICard>
          ))
        ) : (
          <p className="text-[11px] text-gray-500">
            No products matched this request yet. Try refining your search or use the header search
            bar for direct filters.
          </p>
        )}
      </div>

      {data.meta?.total != null && (
        <p className="text-[10px] text-gray-400">
          {data.meta.count || 0} shown · {data.meta.total} total matches
        </p>
      )}
    </div>
  );
};

export default YEBOSmartSearchResults;
