import React from "react";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Container } from "../ui";
import { typography } from "../../design-system/typography";
import YeboneLogo from "./YeboneLogo";

const FOOTER_COMPANY = [
  { label: "About", to: "/about" },
  { label: "Careers", to: "/careers" },
  { label: "Press", to: "/about" },
  { label: "Investors", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const FOOTER_SHOP = [
  { label: "Categories", to: "/products" },
  { label: "Trending", to: "/products" },
  { label: "Flash Sale", to: "/flash-sales" },
  { label: "New Arrivals", to: "/products" },
  { label: "Best Sellers", to: "/best-selling" },
  { label: "Deals", to: "/flash-sales" },
];

const FOOTER_SUPPORT = [
  { label: "Help Center", to: "/faq" },
  { label: "Shipping", to: "/shipping" },
  { label: "Returns", to: "/shipping" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact Support", to: "/contact" },
  { label: "Blog", to: "/blog" },
];

const FOOTER_LEGAL = [
  { label: "Terms of Service", to: "/terms" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Cookie Policy", to: "/cookie-policy" },
];

const HomeFooter = () => {
  const { t } = useTranslation();
  const linkClass = "home-footer-link";

  const renderLinks = (links) => (
    <ul className="home-footer__links">
      {links.map((link) => (
        <li key={`${link.label}-${link.to}`}>
          <Link to={link.to} className={linkClass}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <footer className="home-footer mt-auto">
      <Container className="home-footer__container">
        <div className="home-footer__brand-block">
          <YeboneLogo size="lg" className="home-footer__logo" />
          <p className={`${typography.body} home-footer-muted home-footer__tagline`}>
            {t("footer.brandSlogan")}
          </p>
          <p className="text-sm home-footer-muted home-footer__desc">
            Africa&apos;s AI-powered marketplace. Shop smarter with virtual try-on,
            intelligent search, and verified vendors.
          </p>
          <div className="home-footer__socials">
            {[AiFillFacebook, AiOutlineTwitter, AiFillInstagram, AiFillYoutube].map(
              (Icon, i) => (
                <button
                  key={i}
                  type="button"
                  className="home-footer-social active:scale-95"
                  aria-label="Social link"
                >
                  <Icon size={16} />
                </button>
              )
            )}
          </div>
        </div>

        <div className="home-footer__columns">
          <div className="home-footer__column">
            <h4 className="home-footer-heading home-footer__heading">Company</h4>
            {renderLinks(FOOTER_COMPANY)}
          </div>

          <div className="home-footer__column">
            <h4 className="home-footer-heading home-footer__heading">Shop</h4>
            {renderLinks(FOOTER_SHOP)}
          </div>

          <div className="home-footer__column">
            <h4 className="home-footer-heading home-footer__heading">Support</h4>
            {renderLinks(FOOTER_SUPPORT)}
          </div>

          <div className="home-footer__column">
            <h4 className="home-footer-heading home-footer__heading">Legal</h4>
            {renderLinks(FOOTER_LEGAL)}
          </div>
        </div>
      </Container>

      <div className="home-footer__bottom">
        <Container className="home-footer__bottom-inner">
          <span>© {new Date().getFullYear()} Yebone. All rights reserved.</span>
        </Container>
      </div>
    </footer>
  );
};

export default HomeFooter;
