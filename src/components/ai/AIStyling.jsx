import React from "react";
import classNames from "classnames";
import { typography } from "../../design-system/typography";
import Badge from "../ui/Badge";
import Card from "../ui/Card";

/**
 * Placeholder for future AI styling assistant. No functionality yet.
 */
const AIStyling = ({ className }) => (
  <Card className={classNames("border-dashed border-yebone-primary/30", className)} padding="md">
    <div className="flex items-center gap-2 mb-4">
      <Badge variant="gold">Coming soon</Badge>
      <span className={classNames(typography.subheading, "text-base")}>AI Styling</span>
    </div>
    <div className="space-y-3 opacity-60 pointer-events-none">
      <div className="h-10 rounded-lg bg-yebone-light-gray dark:bg-gray-800 border border-yebone-primary/20" />
      <div className="h-24 rounded-lg bg-yebone-light-gray dark:bg-gray-800 border border-yebone-primary/20 flex items-center justify-center">
        <p className={typography.caption}>Style suggestions will appear here</p>
      </div>
    </div>
  </Card>
);

export default AIStyling;
