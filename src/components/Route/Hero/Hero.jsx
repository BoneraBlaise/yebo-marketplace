import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import image1 from './4.png';
import image2 from './2.png';
import image3 from './3.png';
import image4 from './6.png';
import Slider from "react-slick"; // Import react-slick
import MobileHero from './MobileHero'
import { useTranslation } from "react-i18next";
const Hero = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const {t} = useTranslation();
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 900);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isSmallScreen) {
    return <MobileHero />;
  }

  const settings = {
    infinite: true,
    speed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 10000,
    fade: true,
    arrows: true,
    dots: true,
  };

  return (
    <div className="max-w-screen bg-transparent dark:bg-[#1f1f1f] overflow-hidden">
      <div className="bg-transparent px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
        <div className="flex flex-col items-center justify-between w-full mb-10 lg:flex-row">
          <div className="mb-16 lg:mb-0 lg:max-w-lg lg:pr-5">
            <div className="max-w-xl mb-6">
              <div>
                <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider uppercase bg-teal-accent-400 text-teal-900 rounded-full">
                  Guriraline.com
                </p>
              </div>
              <h2 className="font-sans text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-200 sm:text-6xl sm:leading-none max-w-lg mb-6">
               {t("hero.tagline")} !<br className="hidden md:block" />
              <span className="inline-block text-[#fed592] font-extrabold">{t("hero.subtagline")}.</span>
              </h2>
              <p className="text-gray-700 dark:text-gray-200 text-base md:text-lg mb-6">
              {t("hero.subtitle")}
              </p>
            </div>
            <div className="flex items-center space-x-3 mb-6">
              <Link to="/login">
                <button className="bg-[#29625d] hover:bg-black text-white font-bold py-2 px-6 rounded-lg transition duration-300 transform hover:scale-110">
                 {t("hero.shopNow")}
                </button>
              </Link>
              <a href="/" className="w-32 transition duration-300 hover:shadow-lg">
                <img src="https://kitwind.io/assets/kometa/app-store.png" className="object-cover object-top w-full h-auto mx-auto" alt="App Store" />
              </a>
              <a href="/" className="w-32 transition duration-300 hover:shadow-lg">
                <img src="https://kitwind.io/assets/kometa/google-play.png" className="object-cover object-top w-full h-auto mx-auto" alt="Google Play" />
              </a>
            </div>
          </div>

          <div className="flex items-center justify-center lg:w-1/2 relative">
            <div className="absolute inset-0 top-[-80px] left-[-80px] h-[640px] rounded-l-full bg-gradient-to-r from-[#29625d] dark:to-[#1f1f1f] to-[#f9f7f4] opacity-60 z-0"></div>

            <div className="w-full h-80 relative z-[9]">
              <Slider {...settings}>
                <div>
                  <img className="object-cover w-full h-full outline-none border-none" src={image1} alt="guriraline-slider1" />
                </div>
                <div>
                  <img className="object-cover w-full h-full outline-none border-none" src={image2} alt="guriraline-slider2" />
                </div>
                <div>
                  <img className="object-cover w-full h-full outline-none border-none" src={image3} alt="guriraline-slider3" />
                </div>
                <div>
                  <img className="object-contain w-full h-full outline-none border-none" src={image4} alt="guriraline-slider4" />
                </div>
              </Slider>
            </div>

            <div className="absolute top-2/4 left-1/2 transform -translate-x-1/2 text-[#fed592] font-extrabold text-8xl z-0 opacity-30">
              <h1 className="tracking-widest">Guriraline</h1>
            </div>
          </div>

        </div>

        <a href="/" aria-label="Scroll down" className="flex items-center justify-center w-10 h-10 mx-auto text-gray-600 hover:text-deep-purple-accent-400 hover:border-deep-purple-accent-400 duration-300 transform border border-gray-400 rounded-full hover:shadow hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M10.293,3.293,6,7.586,1.707,3.293A1,1,0,0,0,.293,4.707l5,5a1,1,0,0,0,1.414,0l5-5a1,1,0,1,0-1.414-1.414Z" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default Hero;
