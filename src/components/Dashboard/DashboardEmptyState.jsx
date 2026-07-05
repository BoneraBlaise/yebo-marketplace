import React from "react";
import { Link } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { Button } from "../ui";

const DashboardEmptyState = ({
  icon: Icon = IoSearchOutline,
  title = "Nothing here yet",
  message,
  actionLabel,
  actionTo,
  onAction,
}) => (
  <div className="flex flex-col items-center justify-center text-center py-12 lg:py-16 yebone-fade-up">
    <div className="w-16 h-16 mb-4 rounded-2xl yebone-surface flex items-center justify-center">
      <Icon size={28} className="text-yebone-primary" />
    </div>
    <h3 className="font-Poppins font-semibold text-lg mb-2 dark:text-white">{title}</h3>
    {message && (
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-6">{message}</p>
    )}
    {actionLabel && actionTo && (
      <Link to={actionTo}>
        <Button className="yebone-btn-lift">{actionLabel}</Button>
      </Link>
    )}
    {actionLabel && onAction && (
      <Button onClick={onAction} className="yebone-btn-lift">
        {actionLabel}
      </Button>
    )}
  </div>
);

export default DashboardEmptyState;
