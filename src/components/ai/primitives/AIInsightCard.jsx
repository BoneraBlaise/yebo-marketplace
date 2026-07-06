import React from "react";
import classNames from "classnames";
import AICard from "./AICard";

const AIInsightCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  metric,
  confidence,
  className,
  onClick,
}) => (
  <AICard
    className={classNames(onClick && "cursor-pointer", className)}
    padding="sm"
    onClick={onClick}
    role={onClick ? "button" : undefined}
    tabIndex={onClick ? 0 : undefined}
  >
    <div className="flex items-start justify-between gap-2 mb-2">
      {Icon && (
        <div className="w-9 h-9 rounded-xl bg-yebone-primary/10 flex items-center justify-center text-yebone-primary shrink-0">
          <Icon size={18} />
        </div>
      )}
      {metric && (
        <span className="text-xs font-bold text-yebone-gold bg-yebone-gold/15 px-2 py-0.5 rounded-full">
          {metric}
        </span>
      )}
    </div>
    <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">{title}</p>
    <p className="font-Poppins font-semibold text-sm lg:text-base mt-1 dark:text-white leading-snug">
      {value}
    </p>
    {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    {confidence != null && (
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 h-1 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div className="h-full bg-yebone-primary rounded-full" style={{ width: `${confidence}%` }} />
        </div>
        <span className="text-[10px] font-semibold text-yebone-primary">{confidence}%</span>
      </div>
    )}
  </AICard>
);

export default AIInsightCard;
