import React from "react";
import { Link } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { Button } from "../ui";

const DashboardEmptyState = ({
  icon: Icon = IoSearchOutline,
  title = "Nothing here yet",
  message,
  actionLabel,
  secondaryLabel,
  actionTo,
  secondaryTo,
  onAction,
  onSecondary,
}) => (
  <div className="flex flex-col items-center justify-center text-center py-16 lg:py-20 px-6 yebone-fade-up rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/40 dark:bg-gray-900/30">
    <div className="w-20 h-20 mb-6 rounded-2xl yebone-surface flex items-center justify-center shadow-yebo">
      <Icon size={32} className="text-yebone-primary" aria-hidden="true" />
    </div>
    <h3 className="yebone-h3 mb-2">{title}</h3>
    {message && (
      <p className="yebone-caption max-w-md mb-8">{message}</p>
    )}
    <div className="flex flex-col sm:flex-row gap-3">
      {actionLabel && actionTo && (
        <Link to={actionTo}>
          <Button className="yebone-btn-lift">{actionLabel}</Button>
        </Link>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="yebone-btn-lift">{actionLabel}</Button>
      )}
      {secondaryLabel && secondaryTo && (
        <Link to={secondaryTo}>
          <Button variant="outline">{secondaryLabel}</Button>
        </Link>
      )}
      {secondaryLabel && onSecondary && (
        <Button variant="outline" onClick={onSecondary}>{secondaryLabel}</Button>
      )}
    </div>
  </div>
);

export default DashboardEmptyState;
