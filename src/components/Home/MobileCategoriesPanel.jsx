import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import { IoChevronBack, IoChevronForward, IoSearchOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import "./mobileCategoriesNav.css";

const SCROLL_LOCK_CLASS = "mc-nav-open";
const CLOSE_MS = 340;

const CategoryIcon = ({ imageUrl, title, size = "md" }) => {
  const sizeClass = size === "sm" ? "mc-nav__icon mc-nav__icon--sm" : "mc-nav__icon";

  if (imageUrl) {
    return (
      <span className={sizeClass} aria-hidden="true">
        <img src={imageUrl} alt="" loading="lazy" />
      </span>
    );
  }

  return (
    <span className={`${sizeClass} mc-nav__icon--fallback`} aria-hidden="true">
      {title.charAt(0)}
    </span>
  );
};

const CategoryRow = ({ imageUrl, title, label, hasChildren, onPress, href, onNavigate }) => {
  const showChevron = Boolean(hasChildren || href);

  const content = (
    <>
      <CategoryIcon imageUrl={imageUrl} title={title} size={hasChildren ? "md" : "sm"} />
      <span className="mc-nav__row-text">
        <span className="mc-nav__row-label">{label}</span>
      </span>
      {showChevron && (
        <span className="mc-nav__row-trail" aria-hidden="true">
          <IoChevronForward size={hasChildren ? 18 : 16} />
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link to={href} className="mc-nav__row" onClick={onNavigate}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className="mc-nav__row" onClick={onPress}>
      {content}
    </button>
  );
};

const MobileCategoriesPanel = ({ open, onClose, categoriesData = [] }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [isMounted, setIsMounted] = useState(open);
  const [isPresented, setIsPresented] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeRef = useRef(null);
  const subBodyRef = useRef(null);
  const closeTimerRef = useRef(null);

  const handleClose = useCallback(() => {
    if (!open || isClosing) return;
    onClose();
  }, [open, isClosing, onClose]);

  const handleBack = useCallback(() => {
    setActiveCategory(null);
  }, []);

  const openSubcategory = useCallback((category) => {
    setActiveCategory(category);
    requestAnimationFrame(() => {
      subBodyRef.current?.scrollTo({ top: 0, behavior: "auto" });
    });
  }, []);

  useEffect(() => {
    if (open) {
      setIsMounted(true);
      setIsClosing(false);
      return undefined;
    }

    if (!isMounted) return undefined;

    setIsClosing(true);
    setIsPresented(false);
    closeTimerRef.current = window.setTimeout(() => {
      setIsClosing(false);
      setIsMounted(false);
    }, CLOSE_MS);

    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, [open, isMounted]);

  useEffect(() => {
    if (!isMounted || isClosing) {
      setIsPresented(false);
      return undefined;
    }

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsPresented(true));
    });

    return () => cancelAnimationFrame(frame);
  }, [isMounted, isClosing]);

  useEffect(() => {
    if (!isMounted) return undefined;

    const scrollY = window.scrollY;
    const root = document.getElementById("root");

    document.documentElement.classList.add(SCROLL_LOCK_CLASS);
    document.body.classList.add(SCROLL_LOCK_CLASS);
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";
    document.body.style.width = "100%";
    if (root) root.inert = true;

    return () => {
      document.documentElement.classList.remove(SCROLL_LOCK_CLASS);
      document.body.classList.remove(SCROLL_LOCK_CLASS);
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      document.body.style.width = "";
      if (root) root.inert = false;
      window.scrollTo(0, scrollY);
    };
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return undefined;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        if (activeCategory) handleBack();
        else handleClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    if (!activeCategory) {
      requestAnimationFrame(() => closeRef.current?.focus());
    }

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isMounted, activeCategory, handleBack, handleClose]);

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

  const handleCategoryPress = (category) => {
    if (category.subcategories?.length > 0) {
      openSubcategory(category);
      return;
    }
    navigate(`/products?category=${encodeURIComponent(category.title)}`);
    handleClose();
  };

  if (!isMounted) return null;

  const shellClass = [
    "mc-nav",
    "lg:hidden",
    isPresented && "is-open",
    isClosing && "is-closing",
  ]
    .filter(Boolean)
    .join(" ");

  const nav = (
    <div
      className={shellClass}
      role="dialog"
      aria-modal="true"
      aria-label="Browse categories"
    >
      <button
        type="button"
        className="mc-nav__backdrop"
        onClick={handleClose}
        aria-label="Close categories"
        tabIndex={-1}
      />

      <div className="mc-nav__shell">
        <div className="mc-nav__viewport">
          <div className={`mc-nav__track${activeCategory ? " is-sub" : ""}`}>
            {/* Root — all categories */}
            <section className="mc-nav__screen mc-nav__screen--root" aria-label="All categories">
              <div className="mc-nav__chrome">
                <header className="mc-nav__header">
                  <div className="mc-nav__header-leading" aria-hidden="true" />
                  <div className="mc-nav__header-main">
                    <h2 className="mc-nav__title">Categories</h2>
                  </div>
                  <div className="mc-nav__header-trailing">
                    <button
                      type="button"
                      ref={closeRef}
                      onClick={handleClose}
                      className="mc-nav__icon-btn"
                      aria-label="Close categories"
                    >
                      <RxCross1 size={22} />
                    </button>
                  </div>
                </header>

                <div className="mc-nav__search-wrap">
                  <label className="mc-nav__search">
                    <IoSearchOutline size={20} className="mc-nav__search-icon" aria-hidden="true" />
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search categories..."
                      className="mc-nav__search-input"
                      aria-label="Search categories"
                      autoComplete="off"
                      enterKeyHint="search"
                    />
                  </label>
                </div>
              </div>

              <div className="mc-nav__screen-body">
                {filteredCategories.length === 0 ? (
                  <div className="mc-nav__empty">
                    <span className="mc-nav__empty-icon" aria-hidden="true">
                      <IoSearchOutline size={24} />
                    </span>
                    <p className="mc-nav__empty-title">No categories found</p>
                    <p className="mc-nav__empty-text">Try a different search term.</p>
                  </div>
                ) : (
                  <ul className="mc-nav__list">
                    {filteredCategories.map((category) => (
                      <li key={category.id} className="mc-nav__item">
                        <CategoryRow
                          imageUrl={category.image_Url}
                          title={category.title}
                          label={category.title}
                          hasChildren={category.subcategories?.length > 0}
                          onPress={() => handleCategoryPress(category)}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            {/* Sub — category drill-in */}
            <section
              className="mc-nav__screen mc-nav__screen--sub"
              aria-label={activeCategory ? `${activeCategory.title} subcategories` : "Subcategories"}
              aria-hidden={!activeCategory}
            >
              <div className="mc-nav__chrome">
                <header className="mc-nav__header">
                  <div className="mc-nav__header-leading">
                    <button
                      type="button"
                      className="mc-nav__back-btn"
                      onClick={handleBack}
                      aria-label="Back to all categories"
                    >
                      <IoChevronBack size={20} aria-hidden="true" />
                      <span>Back</span>
                    </button>
                  </div>
                  <div className="mc-nav__header-main">
                    <h2 className="mc-nav__title">{activeCategory?.title ?? "Categories"}</h2>
                  </div>
                  <div className="mc-nav__header-trailing">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="mc-nav__icon-btn"
                      aria-label="Close categories"
                    >
                      <RxCross1 size={22} />
                    </button>
                  </div>
                </header>
              </div>

              {activeCategory && (
                <div className="mc-nav__screen-body" ref={subBodyRef}>
                  <Link
                    to={`/products?category=${encodeURIComponent(activeCategory.title)}`}
                    className="mc-nav__shop-all"
                    onClick={handleClose}
                  >
                    <span className="mc-nav__shop-all-label">Shop all {activeCategory.title}</span>
                    <span className="mc-nav__shop-all-badge">
                      {activeCategory.subcategories?.length || 0}
                    </span>
                    <IoChevronForward size={18} className="mc-nav__shop-all-chevron" aria-hidden="true" />
                  </Link>

                  <p className="mc-nav__section-label">Subcategories</p>

                  <ul className="mc-nav__list mc-nav__list--sub">
                    {activeCategory.subcategories?.map((sub) => (
                      <li key={sub.id} className="mc-nav__item">
                        <CategoryRow
                          imageUrl={sub.image_Url}
                          title={sub.title}
                          label={t(subKey(sub.title), sub.title)}
                          hasChildren={false}
                          href={`/products?category=${encodeURIComponent(sub.title)}`}
                          onNavigate={handleClose}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(nav, document.body);
};

export default MobileCategoriesPanel;
