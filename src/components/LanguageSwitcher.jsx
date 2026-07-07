import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { MdKeyboardArrowDown } from "react-icons/md";

const LanguageSwitcher = ({ className = "" }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "rw", name: "Kinyarwanda", flag: "🇷🇼" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem("i18nextLng", langCode);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="home-header__picker"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <span>{currentLanguage.flag}</span>
        <span className="hidden md:inline">{currentLanguage.name}</span>
        <MdKeyboardArrowDown size={16} />
      </button>

      {isOpen && (
        <div
          className="home-lang-switcher__menu absolute right-0 mt-2 w-48 rounded-xl overflow-hidden z-50"
          role="listbox"
          aria-label="Languages"
        >
          <ul>
            {languages.map((language) => (
              <li key={language.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={language.code === i18n.language}
                  className={`home-lang-switcher__item w-full text-left flex items-center gap-2 ${
                    language.code === i18n.language ? "is-active" : ""
                  }`}
                  onClick={() => handleLanguageChange(language.code)}
                >
                  <span>{language.flag}</span>
                  <span>{language.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
