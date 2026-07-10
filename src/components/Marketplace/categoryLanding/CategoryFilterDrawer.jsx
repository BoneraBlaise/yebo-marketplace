import React, { useEffect } from "react";
import { RxCross1 } from "react-icons/rx";
import CategoryFilterSidebar from "./CategoryFilterSidebar";
import "./categoryLanding.css";

const CategoryFilterDrawer = ({ open, onClose, filterProps }) => {
  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={`cat-filter-drawer is-open`} role="dialog" aria-modal="true" aria-label="Filters">
      <button
        type="button"
        className="cat-filter-drawer__backdrop"
        onClick={onClose}
        aria-label="Close filters"
      />
      <div className="cat-filter-drawer__panel">
        <div className="cat-filter-drawer__handle" aria-hidden="true" />
        <header className="cat-filter-drawer__header">
          <h3>Filters</h3>
          <button type="button" className="cat-filter-drawer__close" onClick={onClose} aria-label="Close">
            <RxCross1 size={20} />
          </button>
        </header>
        <div className="cat-filter-drawer__body">
          <CategoryFilterSidebar {...filterProps} embedded />
        </div>
        <footer className="cat-filter-drawer__footer">
          <button type="button" className="cat-filter__btn" onClick={onClose}>
            Show results
          </button>
        </footer>
      </div>
    </div>
  );
};

export default CategoryFilterDrawer;
