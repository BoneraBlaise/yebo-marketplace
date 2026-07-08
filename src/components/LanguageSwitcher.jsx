import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { MdKeyboardArrowDown } from "react-icons/md";
import HeaderDropdownPanel from "./Layout/overlays/HeaderDropdownPanel";
import useHeaderDropdown from "./Layout/overlays/useHeaderDropdown";

const LanguageSwitcher = ({ className = "" }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "rw", name: "Kinyarwanda", flag: "🇷🇼" },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  useHeaderDropdown(isOpen, () => setIsOpen(false), containerRef);

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem("i18nextLng", langCode);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="home-header__picker"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <span aria-hidden="true">{currentLanguage.flag}</span>
        <span className="hidden md:inline">{currentLanguage.name}</span>
        <MdKeyboardArrowDown size={16} aria-hidden="true" />
      </button>

      {isOpen && (
        <HeaderDropdownPanel ariaLabel="Languages">
          {languages.map((language) => (
            <button
              key={language.code}
              type="button"
              role="option"
              aria-selected={language.code === i18n.language}
              className={`yebone-header-dropdown__item${
                language.code === i18n.language ? " is-active" : ""
              }`}
              onClick={() => handleLanguageChange(language.code)}
            >
              <span className="yebone-header-dropdown__flag" aria-hidden="true">
                {language.flag}
              </span>
              <span>{language.name}</span>
            </button>
          ))}
        </HeaderDropdownPanel>
      )}
    </div>
  );
};

export default LanguageSwitcher;
