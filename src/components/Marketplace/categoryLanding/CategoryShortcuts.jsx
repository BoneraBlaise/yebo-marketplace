import React from "react";
import { Link } from "react-router-dom";
import "./categoryLanding.css";

const CategoryShortcuts = ({ shortcuts = [], activeChipId = "all", activeTitle = null }) => {
  if (!shortcuts.length) return null;

  return (
    <section className="cat-landing-shortcuts" aria-label="Shop by subcategory">
      <p className="cat-landing-shortcuts__label">Shop by type</p>
      <div className="cat-landing-shortcuts__rail hide-scrollbar">
        {shortcuts.map((shortcut) => {
          const key = shortcut.id || shortcut.label || shortcut.title;
          const label = shortcut.label || shortcut.title;
          const to =
            shortcut.to ||
            `/products?category=${encodeURIComponent(shortcut.title)}`;
          const isActive = shortcut.id
            ? activeChipId === shortcut.id
            : activeTitle === shortcut.title;

          return (
            <Link
              key={key}
              to={to}
              className={`cat-landing-shortcuts__chip${isActive ? " is-active" : ""}`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryShortcuts;
