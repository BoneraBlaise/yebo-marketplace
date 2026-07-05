import React from "react";
import classNames from "classnames";
import { AiOutlineSearch } from "react-icons/ai";

const SearchBar = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Search...",
  className,
  inputClassName,
  showIcon = true,
}) => (
  <form onSubmit={onSubmit} className={classNames("relative w-full", className)}>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={classNames(
        "h-10 w-full px-3 pr-10 rounded-md border-2 border-yebone-primary bg-white dark:bg-gray-900 dark:text-white outline-none",
        inputClassName
      )}
    />
    {showIcon && (
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-yebone-primary cursor-pointer"
      >
        <AiOutlineSearch size={24} />
      </button>
    )}
  </form>
);

export default SearchBar;
