import React from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineExclamationCircle,
  HiOutlineLockClosed,
  HiOutlineWifi,
  HiOutlineRefresh,
} from "react-icons/hi";
import Button from "./Button";

const PRESETS = {
  404: {
    icon: HiOutlineExclamationCircle,
    title: "Page not found",
    message: "The page you're looking for doesn't exist or may have moved.",
    actionLabel: "Back to home",
    actionTo: "/",
  },
  403: {
    icon: HiOutlineLockClosed,
    title: "Access denied",
    message: "You don't have permission to view this page.",
    actionLabel: "Go home",
    actionTo: "/",
  },
  500: {
    icon: HiOutlineExclamationCircle,
    title: "Something went wrong",
    message: "An unexpected error occurred. Please try again.",
    actionLabel: "Retry",
  },
  offline: {
    icon: HiOutlineWifi,
    title: "You're offline",
    message: "Check your internet connection and try again.",
    actionLabel: "Retry",
  },
  network: {
    icon: HiOutlineRefresh,
    title: "Network error",
    message: "We couldn't reach the server. Please try again shortly.",
    actionLabel: "Retry",
  },
};

const ErrorState = ({
  variant = "404",
  title,
  message,
  actionLabel,
  actionTo,
  onAction,
  className = "",
}) => {
  const preset = PRESETS[variant] || PRESETS[404];
  const Icon = preset.icon;
  const resolvedTitle = title || preset.title;
  const resolvedMessage = message || preset.message;
  const resolvedLabel = actionLabel || preset.actionLabel;
  const resolvedTo = actionTo || preset.actionTo;

  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-16 lg:py-24 px-6 yebone-fade-up ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="w-16 h-16 mb-6 rounded-2xl yebone-surface flex items-center justify-center">
        <Icon size={32} className="text-yebone-primary" aria-hidden="true" />
      </div>
      <h1 className="font-Poppins text-2xl md:text-3xl font-semibold dark:text-white mb-3">
        {resolvedTitle}
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-8">
        {resolvedMessage}
      </p>
      {resolvedTo ? (
        <Link to={resolvedTo}>
          <Button className="yebone-btn-lift">{resolvedLabel}</Button>
        </Link>
      ) : (
        onAction && (
          <Button onClick={onAction} className="yebone-btn-lift">
            {resolvedLabel}
          </Button>
        )
      )}
    </div>
  );
};

export default ErrorState;
