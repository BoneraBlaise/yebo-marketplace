import React from "react";
import classNames from "classnames";
import { spacing } from "../../design-system/spacing";

const Container = ({ children, className, as: Component = "div", ...props }) => (
  <Component
    className={classNames(spacing.container, className)}
    {...props}
  >
    {children}
  </Component>
);

export default Container;
