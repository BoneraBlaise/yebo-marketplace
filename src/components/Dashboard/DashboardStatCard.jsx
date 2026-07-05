import React from "react";
import { typography } from "../../design-system/typography";

const DashboardStatCard = ({
  title,
  value,
  icon: Icon,
  subtitle,
  onClick,
  className = "",
}) => (
  <div
    className={`dashboard-stat-card yebone-surface yebone-card-lift ${onClick ? "cursor-pointer" : ""} ${className}`}
    onClick={onClick}
    role={onClick ? "button" : undefined}
    tabIndex={onClick ? 0 : undefined}
    onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {title}
        </p>
        <p className={`${typography.subheading} text-xl md:text-2xl mt-1 text-yebone-primary dark:text-white`}>
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>
      {Icon && (
        <div className="w-10 h-10 rounded-xl bg-yebone-primary/10 flex items-center justify-center text-yebone-primary">
          <Icon size={20} />
        </div>
      )}
    </div>
  </div>
);

export default DashboardStatCard;
