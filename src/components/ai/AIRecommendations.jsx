import React from "react";
import classNames from "classnames";
import { typography } from "../../design-system/typography";
import Badge from "../ui/Badge";
import SectionTitle from "../ui/SectionTitle";

/**
 * Placeholder for future AI product recommendations. No functionality yet.
 */
const AIRecommendations = ({ className, title = "Recommended for you" }) => (
  <section className={className} aria-label="AI Recommendations placeholder">
    <div className="flex items-center gap-2 mb-2">
      <Badge variant="gold">Coming soon</Badge>
      <span className={typography.caption}>AI Recommendations</span>
    </div>
    <SectionTitle title={title} subtitle="Personalized picks powered by Yebone AI" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-50 pointer-events-none">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="aspect-square rounded-lg bg-yebone-light-gray dark:bg-gray-800 border border-dashed border-yebone-primary/20"
        />
      ))}
    </div>
  </section>
);

export default AIRecommendations;
