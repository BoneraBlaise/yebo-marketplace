import React, { useState } from "react";
import classNames from "classnames";
import {
  HiOutlineDeviceMobile,
  HiOutlineHome,
  HiOutlineSparkles,
  HiOutlineShoppingBag,
  HiOutlineTruck,
  HiOutlineHeart,
} from "react-icons/hi";

const CATEGORY_ICONS = {
  default: HiOutlineShoppingBag,
  electronics: HiOutlineDeviceMobile,
  fashion: HiOutlineSparkles,
  home: HiOutlineHome,
  beauty: HiOutlineHeart,
  automotive: HiOutlineTruck,
};

const getCategoryIcon = (title = "") => {
  const key = title.toLowerCase();
  if (/phone|computer|electronic|laptop|tablet|gaming/.test(key)) return CATEGORY_ICONS.electronics;
  if (/fashion|cloth|shoe|dress|wear|jewel/.test(key)) return CATEGORY_ICONS.fashion;
  if (/home|furniture|garden|kitchen/.test(key)) return CATEGORY_ICONS.home;
  if (/beauty|health|skin|cosmetic/.test(key)) return CATEGORY_ICONS.beauty;
  if (/auto|car|vehicle|motor/.test(key)) return CATEGORY_ICONS.automotive;
  return CATEGORY_ICONS.default;
};

const CategoryImage = ({ src, title, className }) => {
  const [failed, setFailed] = useState(!src);
  const Icon = getCategoryIcon(title);

  if (failed) {
    return (
      <div
        className={classNames(
          "w-full h-full flex flex-col items-center justify-center rounded-xl",
          "bg-gradient-to-br from-yebone-primary/15 via-yebone-gold/10 to-yebone-primary-dark/20",
          "home-placeholder-pulse",
          className
        )}
      >
        <div className="w-14 h-14 rounded-2xl bg-[var(--home-surface)] shadow-inner flex items-center justify-center mb-2">
          <Icon className="w-7 h-7 text-yebone-primary" />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-yebone-primary/70 px-2 text-center line-clamp-2">
          {title}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`${title} — Yebone category`}
      className={classNames(
        "w-full h-full object-contain group-hover:scale-110 transition-transform duration-500",
        className
      )}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
};

export default CategoryImage;
