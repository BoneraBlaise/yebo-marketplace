import React from "react";
import { MdVerified, MdLock, MdLocalShipping, MdReplay } from "react-icons/md";

const BADGES = [
  { icon: MdLock, label: "Secure checkout" },
  { icon: MdVerified, label: "Buyer protection" },
  { icon: MdLocalShipping, label: "Fast delivery" },
  { icon: MdReplay, label: "Easy returns" },
];

const CheckoutTrustBadges = ({ compact = false }) => (
  <div className={`flex flex-wrap gap-2 ${compact ? "" : "pt-4 border-t border-gray-100 dark:border-gray-800"}`}>
    {BADGES.map(({ icon: Icon, label }) => (
      <span
        key={label}
        className="inline-flex items-center gap-1.5 text-[11px] font-medium text-gray-500 dark:text-gray-400 px-2.5 py-1.5 rounded-full bg-yebone-light-gray/80 dark:bg-gray-800/50"
      >
        <Icon className="text-yebone-primary shrink-0" size={14} />
        {label}
      </span>
    ))}
  </div>
);

export default CheckoutTrustBadges;
