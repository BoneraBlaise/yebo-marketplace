import React from "react";
import { a11yProps } from "../accessibility";
import { motionClasses } from "../motion/MotionSystem";

export const Toast = ({ message, variant = "info", onClose }) => (
  <div className={`fixed bottom-4 right-4 z-[1400] px-4 py-3 rounded-lg shadow-lg text-white ${motionClasses.toast} ${variant === "error" ? "bg-red-600" : variant === "success" ? "bg-green-600" : variant === "warning" ? "bg-yellow-600" : "bg-gray-800"}`} {...a11yProps.alert()}>
    {message}<button type="button" onClick={onClose} className="ml-2 opacity-75" aria-label="Dismiss">×</button>
  </div>
);

export const Alert = ({ children, variant = "info" }) => {
  const v = { info: "bg-blue-50 text-blue-800 border-blue-200", success: "bg-green-50 text-green-800", warning: "bg-yellow-50 text-yellow-800", error: "bg-red-50 text-red-800" };
  return <div role="alert" className={`p-3 rounded-lg border ${v[variant]}`}>{children}</div>;
};

export const Banner = ({ children, variant = "info" }) => <Alert variant={variant}>{children}</Alert>;
export const SuccessNotification = ({ message }) => <Toast message={message} variant="success" />;
export const ErrorNotification = ({ message }) => <Toast message={message} variant="error" />;
export const WarningNotification = ({ message }) => <Toast message={message} variant="warning" />;
export const InfoNotification = ({ message }) => <Toast message={message} variant="info" />;
export const ProgressNotification = ({ message, progress }) => (
  <div className="fixed bottom-4 right-4 z-[1400] p-4 rounded-lg shadow-lg bg-white dark:bg-gray-900 border w-72">
    <p className="text-sm mb-2">{message}</p>
    <div className="h-2 bg-gray-200 rounded-full"><div className="h-full bg-yebone-primary rounded-full transition-all" style={{ width: `${progress}%` }} /></div>
  </div>
);
export const AIProcessingNotification = ({ message = "AI processing..." }) => <ProgressNotification message={message} progress={50} />;

export default { Toast, Alert, Banner, SuccessNotification, ErrorNotification, WarningNotification, InfoNotification, ProgressNotification, AIProcessingNotification };
