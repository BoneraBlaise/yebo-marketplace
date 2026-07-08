import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import { IoChevronBack, IoChevronForward, IoSearchOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

const MobileCategoriesPanel = ({ open, onClose, categoriesData = [] }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        if (activeCategory) setActiveCategory(null);
        else onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose, activeCategory]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveCategory(null);
    }
  }, [open]);

  const filteredCategories = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return categoriesData;

    return categoriesData
      .map((category) => {
        const parentMatch = category.title.toLowerCase().includes(term);
        const matchingSubs = category.subcategories?.filter((sub) =>
          sub.title.toLowerCase().includes(term)
        );
        if (parentMatch || matchingSubs?.length) {
          return {
            ...category,
            subcategories: parentMatch ? category.subcategories : matchingSubs,
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [categoriesData, query]);

  const subKey = (title) =>
    `categories.sub.${title.toLowerCase().replace(/\s+/g, "")}`;

  if (!open) return null;

  return (
    <div className="yebone-nav-drawer lg:hidden" role="dialog" aria-modal="true" aria-label="Browse categories">
      <button
        type="button"
        className="yebone-nav-drawer__backdrop"
        onClick={onClose}
        aria-label="Close categories"
      />

      <div className="yebone-nav-drawer__panel">
        <div className="yebone-nav-drawer__sticky-top">
          <header className="yebone-nav-panel-header">
            {activeCategory ? (
              <button
                type="button"
                className="yebone-nav-item home-mobile-categories__back"
                onClick={() => setActiveCategory(null)}
                aria-label="Back to categories"
              >
                <IoChevronBack size={20} aria-hidden="true" />
                <span>Categories</span>
              </button>
            ) : (
              <div>
                <p className="home-mobile-categories__eyebrow">Browse</p>
                <h2 className="yebone-nav-panel-title">Categories</h2>
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="yebone-nav-icon-btn"
              aria-label="Close"
            >
              <RxCross1 size={20} />
            </button>
          </header>

          {!activeCategory && (
            <div className="yebone-nav-search">
              <IoSearchOutline size={18} className="yebone-nav-search__icon" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search categories"
                className="yebone-nav-search__input"
                aria-label="Search categories"
              />
            </div>
          )}

          {activeCategory && (
            <div className="home-mobile-categories__sub-header">
              <h3 className="yebone-nav-panel-title">{activeCategory.title}</h3>
              <span className="yebone-nav-panel-badge">
                {activeCategory.subcategories?.length || 0} items
              </span>
            </div>
          )}
        </div>

        <div className="yebone-nav-drawer__scroll">
          {!activeCategory ? (
            <nav className="home-mobile-categories__list" aria-label="Category list">
              {filteredCategories.length === 0 ? (
                <p className="home-mobile-categories__empty">No categories match your search.</p>
              ) : (
                filteredCategories.map((category) => (
                  <div key={category.id} className="home-mobile-categories__row-item">
                    <Link
                      to={`/products?category=${encodeURIComponent(category.title)}`}
                      className="yebone-nav-item home-mobile-categories__row-link"
                      onClick={onClose}
                    >
                      {category.image_Url && (
                        <span className="home-mobile-categories__thumb">
                          <img src={category.image_Url} alt="" loading="lazy" />
                        </span>
                      )}
                      <span className="home-mobile-categories__row-label">{category.title}</span>
                    </Link>
                    {category.subcategories?.length > 0 && (
                      <button
                        type="button"
                        className="yebone-nav-icon-btn home-mobile-categories__drill"
                        onClick={() => setActiveCategory(category)}
                        aria-label={`Open ${category.title} subcategories`}
                      >
                        <IoChevronForward size={20} />
                      </button>
                    )}
                  </div>
                ))
              )}
            </nav>
          ) : (
            <nav className="home-mobile-categories__list" aria-label={`${activeCategory.title} subcategories`}>
              <Link
                to={`/products?category=${encodeURIComponent(activeCategory.title)}`}
                className="home-mobile-categories__shop-all yebone-nav-item"
                onClick={onClose}
              >
                Shop all {activeCategory.title}
                <IoChevronForward size={16} className="ml-auto" aria-hidden="true" />
              </Link>
              {activeCategory.subcategories?.map((sub) => (
                <Link
                  key={sub.id}
                  to={`/products?category=${encodeURIComponent(sub.title)}`}
                  className="yebone-nav-item home-mobile-categories__sub-link"
                  onClick={onClose}
                >
                  {sub.image_Url && (
                    <span className="home-mobile-categories__thumb home-mobile-categories__thumb--sm">
                      <img src={sub.image_Url} alt="" loading="lazy" />
                    </span>
                  )}
                  <span>{t(subKey(sub.title), sub.title)}</span>
                  <IoChevronForward size={16} className="ml-auto opacity-40" aria-hidden="true" />
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileCategoriesPanel;
