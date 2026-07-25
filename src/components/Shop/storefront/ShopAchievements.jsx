import React from "react";
import { MdVerified, MdLocalShipping, MdStar, MdFavorite, MdShield } from "react-icons/md";
import { HiOutlineSparkles } from "react-icons/hi";

const ICON_MAP = {
  verified: MdVerified,
  top: HiOutlineSparkles,
  shipping: MdLocalShipping,
  star: MdStar,
  heart: MdFavorite,
  shield: MdShield,
};

const ShopAchievements = ({ achievements = [] }) => {
  if (!achievements.length) return null;

  return (
    <section aria-label="Shop achievements">
      <h2 className="text-lg font-semibold mb-3 dark:text-white">Achievements</h2>
      <div className="shop-achievements">
        {achievements.map((badge) => {
          const Icon = ICON_MAP[badge.icon] || MdVerified;
          return (
            <span key={badge.id} className="shop-badge" title={badge.label}>
              <Icon size={14} aria-hidden="true" />
              {badge.label}
            </span>
          );
        })}
      </div>
    </section>
  );
};

export default ShopAchievements;
