import React from "react";
import classNames from "classnames";
import { HiOutlineSparkles } from "react-icons/hi";

const AIEmptyState = ({
  title = "No AI insights yet",
  description = "Start a conversation or browse products to unlock personalized suggestions.",
  className,
  action,
}) => (
  <div
    className={classNames(
      "flex flex-col items-center text-center py-8 px-4 rounded-2xl border border-dashed border-yebone-primary/20 yebone-glass",
      className
    )}
  >
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yebone-primary to-yebone-primary-dark flex items-center justify-center mb-4">
      <HiOutlineSparkles className="text-yebone-gold" size={28} />
    </div>
    <p className="font-Poppins font-semibold dark:text-white mb-1">{title}</p>
    <p className="text-sm text-gray-500 max-w-sm leading-relaxed">{description}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default AIEmptyState;
