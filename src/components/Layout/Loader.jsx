import React from "react";
import './loader.css'
const Loader = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="loader ease-linear rounded-full border-8 border-t-8 border-[#29625d] h-20 w-20 animate-spin"></div>
    </div>
  );
};

export default Loader;
