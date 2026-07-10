import React from "react";
import classNames from "classnames";
import "../Route/ProductCard/productCard.css";

/**
 * Styling shell for product cards. Wrap existing product card content for consistent layout.
 */
const ProductCardShell = ({
  children,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
  as: Component = "article",
}) => (
  <Component
    className={classNames("ypc group", className)}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {children}
  </Component>
);

export default ProductCardShell;
