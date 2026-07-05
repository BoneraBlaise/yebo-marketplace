import React from "react";
import classNames from "classnames";
import { typography } from "../../design-system/typography";

const SectionTitle = ({
  title,
  subtitle,
  align = "center",
  className,
}) => {
  const alignClass =
    align === "left"
      ? "text-left"
      : align === "right"
      ? "text-right"
      : "text-center";

  return (
    <div className={classNames("mb-6 md:mb-8", alignClass, className)}>
      <h2 className={typography.heading}>{title}</h2>
      {subtitle && (
        <p className={classNames(typography.body, "mt-2 text-gray-600 dark:text-gray-400")}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
