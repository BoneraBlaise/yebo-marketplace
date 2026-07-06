import React from "react";
import { HiOutlineSparkles, HiOutlineCheckCircle } from "react-icons/hi";
import AICard from "../primitives/AICard";

const formatPrice = (n) => (n ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const YEBOProductComparison = ({ data }) => {
  if (!data?.items?.length) return null;

  return (
    <div className="space-y-3 yebone-fade-up">
      <p className="text-xs font-semibold text-yebone-primary flex items-center gap-1">
        <HiOutlineSparkles size={14} /> YEBO comparison
      </p>

      <div className="grid gap-3">
        {data.items.map((item) => (
          <AICard key={item.id} padding="sm" glass className={item.yebonRecommendation ? "ring-2 ring-yebone-gold/40" : ""}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="font-semibold text-sm dark:text-white">{item.name}</p>
              {item.yebonRecommendation && (
                <span className="text-[10px] font-bold text-yebone-primary flex items-center gap-0.5 shrink-0">
                  <HiOutlineCheckCircle size={12} /> YEBO pick
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] mb-2">
              <div><span className="text-gray-500">Price</span><p className="font-semibold text-yebone-primary">RWF {formatPrice(item.price)}</p></div>
              <div><span className="text-gray-500">Rating</span><p className="font-semibold dark:text-white">{item.rating} ★</p></div>
              <div><span className="text-gray-500">Popularity</span><p className="dark:text-gray-200">{item.popularity}</p></div>
              <div><span className="text-gray-500">Best for</span><p className="dark:text-gray-200">{item.bestFor}</p></div>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {item.features?.map((f) => (
                <span key={f} className="ai-prompt-chip text-[10px] py-0.5">{f}</span>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-2 text-[10px]">
              <div><span className="text-emerald-600 font-semibold">Pros:</span> {item.pros?.join(", ")}</div>
              <div><span className="text-amber-600 font-semibold">Cons:</span> {item.cons?.join(", ")}</div>
            </div>
          </AICard>
        ))}
      </div>

      {data.summary && (
        <p className="text-xs text-gray-500 yebone-glass rounded-xl p-3 border border-yebone-primary/10">
          <span className="font-semibold text-yebone-primary">YEBO recommends: </span>
          {data.summary}
        </p>
      )}
    </div>
  );
};

export default YEBOProductComparison;
