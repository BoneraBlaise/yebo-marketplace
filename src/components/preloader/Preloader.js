import React from 'react';
import './preloader.css';

const Preloader = () => {
  return (
    <div className="preloader dark:bg-[#1f1f1f] bg-white">
      <div className="spinner">
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
      </div>
    </div>
  );
};

export default Preloader;
