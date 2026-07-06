import React from "react";
import classNames from "classnames";
import { HiOutlineSparkles } from "react-icons/hi";
import { Container, SectionTitle, Badge } from "../../ui";

const AISection = ({
  title,
  subtitle,
  children,
  className,
  id,
  badge = "AI Powered",
  align = "left",
  contained = true,
  compact = false,
}) => {
  const content = (
    <>
      <div className={classNames("flex items-center gap-2", align === "center" && "justify-center")}>
        {badge && (
          <Badge variant="gold" className="mb-0">
            {badge}
          </Badge>
        )}
        <span className="text-xs font-semibold text-yebone-primary uppercase tracking-wider flex items-center gap-1">
          <HiOutlineSparkles size={14} />
          YEBO
        </span>
      </div>
      {title && (
        <SectionTitle
          title={title}
          subtitle={subtitle}
          align={align}
          className={compact ? "mt-2 mb-4" : "mt-2 mb-6"}
        />
      )}
      {children}
    </>
  );

  if (!contained) {
    return (
      <section id={id} className={classNames(compact ? "py-6" : "yebone-section", className)}>
        {content}
      </section>
    );
  }

  return (
    <section id={id} className={classNames(compact ? "py-6" : "yebone-section", className)}>
      <Container>{content}</Container>
    </section>
  );
};

export default AISection;
