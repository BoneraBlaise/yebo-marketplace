import React from "react";
import classNames from "classnames";

/**
 * Styling shell for product cards. Wrap existing product card content for consistent layout.
 */
const ProductCardShell = ({ children, className, onMouseEnter, onMouseLeave }) => (
  <div
    className={classNames(
      "group relative bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300",
      className
    )}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {children}
  </div>
);

export default ProductCardShell;
