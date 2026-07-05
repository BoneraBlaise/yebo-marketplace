import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navItems } from '../../static/data';
import { useTranslation } from 'react-i18next';

const Navbar = ({ active }) => {
  const { t } = useTranslation();
  const location = useLocation();  // Get the current location (path + query parameters)

  // Function to check if the current link matches the active URL including query parameters
  const getLinkClass = (url) => {
    // Split URL into base path and query params (if any)
    const [baseUrl, queryParams] = url.split('?');

    // Construct the full URL from current location (path + search query)
    const currentUrl = location.pathname + location.search;

    // Check if the base URL and query parameters match
    const isActive = currentUrl === url;

    return isActive ? "text-[#29625d] text-sm" : "text-[#313131] text-sm 800px:dark:text-gray-200";
  };

  return (
    <div className="block flex items-center z-40">
      {navItems.map((i, index) => (
        <div key={i.id} className="flex justify-center">
          <Link
            to={i.url}
            className={`${getLinkClass(i.url)} pb-[30px] 800px:pb-0 px-4 cursor-pointer`}
          >
            {t(`common.${i.title.toLowerCase()}`)}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Navbar;
