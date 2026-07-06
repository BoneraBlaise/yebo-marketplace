import React from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Button } from "../../components/ui";

/** Reusable YEBO/YIP error presentation */
const YEBOErrorState = ({ error, onRetry, className }) => {
  if (!error) return null;

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 p-4 ${className || ""}`}
      role="alert"
    >
      <HiOutlineExclamationCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-sm text-red-800 dark:text-red-200">{error.title || "Error"}</p>
        <p className="text-xs text-red-600 dark:text-red-300 mt-1">{error.message}</p>
        {onRetry && error.recoverable && (
          <Button size="sm" variant="outline" className="mt-3 yebone-btn-lift" onClick={onRetry}>
            Try again
          </Button>
        )}
      </div>
    </div>
  );
};

export default YEBOErrorState;
