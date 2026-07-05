import React from "react";
import "./loader.css";

const Loader = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-4 bg-yebone-light-gray dark:bg-gray-900">
      <div className="loader ease-linear rounded-full border-8 border-t-8 border-yebone-primary h-20 w-20 animate-spin"></div>
      <p className="font-Poppins font-semibold text-yebone-primary dark:text-white tracking-wide">
        Yebone
      </p>
      <p className="font-Roboto text-sm text-gray-600 dark:text-gray-400">
        Everything in one place
      </p>
    </div>
  );
};

export default Loader;
