import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import { IoChevronForward } from "react-icons/io5";
import { useTranslation } from "react-i18next";

const MobileCategoriesPanel = ({ open, onClose, categoriesData = [] }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="home-mobile-categories lg:hidden" role="dialog" aria-modal="true" aria-label="Browse categories">
      <button
        type="button"
        className="home-mobile-categories__overlay"
        onClick={onClose}
        aria-label="Close categories"
      />
      <div className="home-mobile-categories__panel">
        <div className="home-mobile-categories__header">
          <div>
            <p className="text-xs uppercase tracking-wider opacity-60">Browse</p>
            <h2 className="font-Poppins font-semibold text-lg mt-0.5">Categories</h2>
          </div>
          <button type="button" onClick={onClose} className="home-header__icon-btn" aria-label="Close">
            <RxCross1 size={20} />
          </button>
        </div>

        <nav className="home-mobile-categories__nav">
          {categoriesData.map((category) => (
            <section key={category.id} className="home-mobile-categories__group">
              <Link
                to={`/products?category=${encodeURIComponent(category.title)}`}
                className="home-mobile-categories__parent"
                onClick={onClose}
              >
                <span>{category.title}</span>
                <IoChevronForward size={16} aria-hidden />
              </Link>
              {category.subcategories?.length > 0 && (
                <ul className="home-mobile-categories__children">
                  {category.subcategories.map((sub) => (
                    <li key={sub.id}>
                      <Link
                        to={`/products?category=${encodeURIComponent(sub.title)}`}
                        className="home-mobile-categories__child"
                        onClick={onClose}
                      >
                        {t(
                          `categories.sub.${sub.title.toLowerCase().replace(/\s+/g, "")}`,
                          sub.title
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default MobileCategoriesPanel;
