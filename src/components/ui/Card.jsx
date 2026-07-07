import React from "react";
import classNames from "classnames";

const Card = ({ children, className, padding = "md", hover = true, ...props }) => {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-5 md:p-6",
    lg: "p-6 md:p-8",
  };

  return (
    <div
      className={classNames(
        "bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-yebo",
        hover && "yebone-card-lift transition-all duration-300",
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
