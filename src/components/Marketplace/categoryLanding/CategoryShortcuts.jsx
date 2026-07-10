import React from "react";
import { Link } from "react-router-dom";
import "./categoryLanding.css";

const CategoryShortcuts = ({ shortcuts = [], activeTitle }) => {
  if (!shortcuts.length) return null;

  return (
    <section className="cat-landing-shortcuts" aria-label="Shop by subcategory">
      <p className="cat-landing-shortcuts__label">Shop by type</p>
      <div className="cat-landing-shortcuts__rail hide-scrollbar">
        {shortcuts.map((shortcut) => (
          <Link
            key={shortcut.id}
            to={`/products?category=${encodeURIComponent(shortcut.title)}`}
            className={`cat-landing-shortcuts__chip${
              activeTitle === shortcut.title ? " is-active" : ""
            }`}
          >
            {shortcut.title}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryShortcuts;
