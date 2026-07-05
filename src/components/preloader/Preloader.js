import React from 'react';
import './preloader.css';

const Preloader = () => {
  return (
    <div className="preloader dark:bg-gray-900 bg-white">
      <div className="flex flex-col items-center gap-4">
        <p className="font-Poppins font-bold text-2xl text-yebone-primary dark:text-white">
          Yebone
        </p>
        <div className="spinner">
          <div className="bounce1"></div>
          <div className="bounce2"></div>
          <div className="bounce3"></div>
        </div>
        <p className="font-Roboto text-sm text-gray-500 dark:text-gray-400">
          Everything in one place
        </p>
      </div>
    </div>
  );
};

export default Preloader;
