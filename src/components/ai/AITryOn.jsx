import React from "react";
import classNames from "classnames";
import { typography } from "../../design-system/typography";
import Badge from "../ui/Badge";
import Card from "../ui/Card";

/**
 * Placeholder for future AI virtual try-on. No functionality yet.
 */
const AITryOn = ({ className, productName = "Product" }) => (
  <Card className={classNames("border-dashed border-yebone-primary/30", className)} padding="md">
    <div className="flex items-center gap-2 mb-4">
      <Badge variant="gold">Coming soon</Badge>
      <span className={classNames(typography.subheading, "text-base")}>AI Try-On</span>
    </div>
    <div
      className="aspect-[4/5] rounded-lg bg-yebone-light-gray dark:bg-gray-800 flex flex-col items-center justify-center text-center p-6 opacity-70"
      aria-hidden="true"
    >
      <div className="w-16 h-16 rounded-full border-2 border-yebone-primary/40 mb-4" />
      <p className={typography.body}>Preview how {productName} looks on you</p>
      <p className={classNames(typography.caption, "mt-2")}>Feature in development</p>
    </div>
  </Card>
);

export default AITryOn;
