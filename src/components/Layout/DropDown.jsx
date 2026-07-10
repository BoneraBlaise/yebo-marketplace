import React from "react";
import { Link } from "react-router-dom";
import { IoChevronForward } from "react-icons/io5";
import { useTranslation } from "react-i18next";

const DropDown = ({ categoriesData, setDropDown }) => {
  const { t } = useTranslation();
  const close = () => setDropDown(false);

  const subKey = (title) =>
    `categories.sub.${title.toLowerCase().replace(/\s+/g, "")}`;

  return (
    <div className="home-mega-menu yebone-nav-surface" role="menu" aria-label="Browse categories">
      <div className="home-mega-menu__inner">
        <header className="yebone-nav-panel-header home-mega-menu__header">
          <div>
            <p className="home-mega-menu__eyebrow">Shop by department</p>
            <h2 className="yebone-nav-panel-title">Main categories</h2>
          </div>
          <Link to="/products" className="home-mega-menu__browse-all" onClick={close}>
            Browse all
            <IoChevronForward size={16} aria-hidden="true" />
          </Link>
        </header>

        <div className="home-mega-menu__grid">
          {categoriesData?.map((category) => (
            <section key={category.id} className="home-mega-menu__column">
              <Link
                to={category.shopAllHref || `/products?category=${encodeURIComponent(category.title)}`}
                className="home-mega-menu__title"
                onClick={close}
              >
                {category.image_Url && (
                  <span className="home-mega-menu__icon" aria-hidden="true">
                    <img src={category.image_Url} alt="" loading="lazy" />
                  </span>
                )}
                <span>{category.title}</span>
              </Link>
              {category.subcategories?.length > 0 && (
                <ul className="home-mega-menu__links">
                  {category.subcategories.slice(0, 8).map((sub) => (
                    <li key={sub.id}>
                      <Link
                        to={sub.href || `/products?category=${encodeURIComponent(sub.title)}`}
                        className="home-mega-menu__link"
                        onClick={close}
                      >
                        {t(subKey(sub.title), sub.title)}
                      </Link>
                    </li>
                  ))}
                  {category.subcategories.length > 8 && (
                    <li>
                      <Link
                        to={category.shopAllHref || `/products?category=${encodeURIComponent(category.title)}`}
                        className="home-mega-menu__link home-mega-menu__link--more"
                        onClick={close}
                      >
                        See all in {category.title}
                      </Link>
                    </li>
                  )}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DropDown;
