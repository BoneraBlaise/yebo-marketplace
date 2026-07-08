import React, { useRef, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import HeaderDropdownPanel from "./HeaderDropdownPanel";
import useHeaderDropdown from "./useHeaderDropdown";

const COUNTRIES = [
  { code: "RW", label: "Rwanda", flag: "🇷🇼" },
  { code: "KE", label: "Kenya", flag: "🇰🇪" },
  { code: "UG", label: "Uganda", flag: "🇺🇬" },
  { code: "NG", label: "Nigeria", flag: "🇳🇬" },
];

const CountrySwitcher = () => {
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useHeaderDropdown(isOpen, () => setIsOpen(false), containerRef);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="home-header__picker"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select country"
      >
        <span aria-hidden="true">{country.flag}</span>
        <span>{country.label}</span>
        <MdKeyboardArrowDown size={16} aria-hidden="true" />
      </button>

      {isOpen && (
        <HeaderDropdownPanel ariaLabel="Countries">
          {COUNTRIES.map((item) => (
            <button
              key={item.code}
              type="button"
              role="option"
              aria-selected={item.code === country.code}
              className={`yebone-header-dropdown__item${
                item.code === country.code ? " is-active" : ""
              }`}
              onClick={() => {
                setCountry(item);
                setIsOpen(false);
              }}
            >
              <span className="yebone-header-dropdown__flag" aria-hidden="true">
                {item.flag}
              </span>
              {item.label}
            </button>
          ))}
        </HeaderDropdownPanel>
      )}
    </div>
  );
};

export default CountrySwitcher;
