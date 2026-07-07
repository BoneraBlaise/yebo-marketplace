import React from "react";
import classNames from "classnames";
import { polishClasses } from "../../ui-polish/polishClasses";

/**
 * Styling shell for product cards. Wrap existing product card content for consistent layout.
 */
const ProductCardShell = ({ children, className, onMouseEnter, onMouseLeave, as: Component = "article" }) => (
  <Component
    className={classNames(
      polishClasses.productCard,
      "group relative cursor-pointer",
      className
    )}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {children}
  </Component>
);

export default ProductCardShell;
