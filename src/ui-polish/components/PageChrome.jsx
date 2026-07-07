import React from "react";
import { polishClasses } from "../polishClasses";
import { typeScale } from "../typographySystem";

export const PageContainer = ({ children, className = "", ...props }) => (
  <div className={`${polishClasses.page} ${polishClasses.pageSection} ${className}`} {...props}>{children}</div>
);

export const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 md:mb-8">
    <div className="space-y-1">
      <h2 className={typeScale.sectionTitle}>{title}</h2>
      {subtitle && <p className={polishClasses.sectionSubtitle}>{subtitle}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export const PremiumCard = ({ children, className = "", accent = false, ...props }) => (
  <div
    className={`${polishClasses.premiumCard} p-5 md:p-6 ${accent ? "border-l-4 border-l-yebone-gold" : ""} ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default { PageContainer, SectionHeader, PremiumCard };
