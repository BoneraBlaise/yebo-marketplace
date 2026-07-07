import React from "react";
import classNames from "classnames";
import { typography } from "../../design-system/typography";

const SectionTitle = ({
  title,
  subtitle,
  align = "center",
  className,
  as: Tag = "h2",
}) => {
  const alignClass =
    align === "left"
      ? "text-left"
      : align === "right"
      ? "text-right"
      : "text-center";

  return (
    <div className={classNames("mb-8 md:mb-10", alignClass, className)}>
      <Tag className={typography.heading}>{title}</Tag>
      {subtitle && (
        <p className={classNames(typography.subtitle, "mt-2 max-w-2xl", align === "center" && "mx-auto")}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
