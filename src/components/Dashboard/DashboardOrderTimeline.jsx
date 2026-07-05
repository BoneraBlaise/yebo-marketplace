import React from "react";

const STEPS = [
  { key: "received", label: "Order Received" },
  { key: "processing", label: "Processing" },
  { key: "packed", label: "Packed" },
  { key: "shipped", label: "Shipped" },
  { key: "out", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

const getStepIndex = (status) => {
  if (!status) return 0;
  if (status === "Processing") return 1;
  if (status === "Transferred to delivery partner") return 2;
  if (status === "Shipping") return 3;
  if (status === "Received" || status === "On the way") return 4;
  if (status === "Delivered") return 5;
  if (status === "Processing refund" || status === "Refund Success") return 5;
  return 0;
};

const DashboardOrderTimeline = ({ status, className = "" }) => {
  const current = getStepIndex(status);

  return (
    <div className={`dashboard-timeline ${className}`}>
      {STEPS.map((step, index) => {
        const isComplete = index <= current;
        const isCurrent = index === current;
        return (
          <div
            key={step.key}
            className={`dashboard-timeline-step ${
              isComplete ? "is-complete" : ""
            } ${isCurrent ? "is-current" : ""}`}
          >
            <p
              className={`font-medium text-sm ${
                isComplete ? "text-yebone-primary dark:text-white" : "text-gray-400"
              }`}
            >
              {step.label}
            </p>
            {isCurrent && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Current status: {status}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DashboardOrderTimeline;
