import React from "react";
import classNames from "classnames";

const AICard = ({ children, className, padding = "md", hover = true, glass = false, ...props }) => {
  const paddingClass = { sm: "p-3", md: "p-4 lg:p-5", lg: "p-6 lg:p-8" }[padding] || "p-4";

  return (
    <div
      className={classNames(
        "rounded-2xl border border-gray-100 dark:border-gray-800",
        glass ? "yebone-glass bg-white/80 dark:bg-gray-900/80" : "yebone-surface bg-white/90 dark:bg-gray-900/90",
        hover && "yebone-card-lift",
        paddingClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default AICard;
