import React, { useState, useEffect } from "react";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BottomNav from "../Layout/BottomNav";
import { Container } from "../ui";
import { typography } from "../../design-system/typography";
import YeboneLogo from "./YeboneLogo";

const FOOTER_COMPANY = [
  { label: "About", to: "/about" },
  { label: "Careers", to: "/careers" },
  { label: "Press", to: "/about" },
  { label: "Investors", to: "/about" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms of Service", to: "/terms" },
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

const HomeFooter = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 900);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isSmallScreen) {
    return <BottomNav />;
  }

  const linkClass =
    "text-gray-500 dark:text-gray-400 hover:text-yebone-primary transition-colors duration-200 text-sm leading-7 block";

  const renderLinks = (links) => (
    <ul className="space-y-1">
      {links.map((link) => (
        <li key={link.label}>
          <Link to={link.to} className={linkClass}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <footer className="bg-gray-950 text-gray-300 mt-auto">
      <Container className="py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          <div className="lg:col-span-2">
            <YeboneLogo variant="light" size="lg" className="mb-6" />
            <p className={`${typography.body} text-gray-400 max-w-sm mb-6`}>
              {t("footer.brandSlogan")}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Africa&apos;s AI-powered marketplace. Shop smarter with virtual
              try-on, intelligent search, and verified vendors.
            </p>
            <div className="flex gap-3">
              {[AiFillFacebook, AiOutlineTwitter, AiFillInstagram, AiFillYoutube].map(
                (Icon, i) => (
                  <button
                    key={i}
                    type="button"
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-yebone-primary active:scale-95 flex items-center justify-center transition-all duration-200"
                    aria-label="Social link"
                  >
                    <Icon size={18} />
                  </button>
                )
              )}
            </div>
          </div>

          <div>
            <h4 className="font-Poppins font-semibold text-white mb-4">Company</h4>
            {renderLinks(FOOTER_COMPANY)}
          </div>

          <div>
            <h4 className="font-Poppins font-semibold text-white mb-4">Shop</h4>
            {renderLinks(FOOTER_SHOP)}
          </div>

          <div>
            <h4 className="font-Poppins font-semibold text-white mb-4">Support</h4>
            {renderLinks(FOOTER_SUPPORT)}
          </div>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <span>© {new Date().getFullYear()} Yebone. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/terms" className="hover:text-white transition-colors duration-200">
              Terms
            </Link>
            <Link to="/privacy-policy" className="hover:text-white transition-colors duration-200">
              Privacy
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default HomeFooter;
