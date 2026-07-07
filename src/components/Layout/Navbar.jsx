import React from "react";
import { Link, useLocation } from "react-router-dom";
import { navItems } from "../../static/data";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const isActive = (url) => {
    const currentUrl = location.pathname + location.search;
    return currentUrl === url;
  };

  return (
    <nav className="home-nav" aria-label="Marketplace categories">
      {navItems.map((item) => {
        const active = isActive(item.url);
        return (
          <Link
            key={item.id}
            to={item.url}
            className={`home-nav__link${active ? " is-active" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            {t(`common.${item.title.toLowerCase()}`)}
          </Link>
        );
      })}
    </nav>
  );
};

export default Navbar;
