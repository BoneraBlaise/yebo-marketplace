import React from "react";

export const GrowthCommerceStatusBanner = ({ tone = "info", title, message, action = null }) => {
  const toneClasses = {
    info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100",
    error: "border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100",
    success: "border-green-200 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-950/40 dark:text-green-100",
    warning:
      "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100",
  };

  return (
    <div
      className={`rounded-2xl border p-4 ${toneClasses[tone] || toneClasses.info}`}
      role={tone === "error" ? "alert" : "status"}
    >
      {title ? <p className="font-medium">{title}</p> : null}
      {message ? <p className={`text-sm ${title ? "mt-1" : ""}`}>{message}</p> : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
};
