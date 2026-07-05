import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import image1 from './1.png';
import image2 from './2.png';
import image3 from './4.png';
import image4 from './6.png';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const products = [
  {
    id: 1,
    name: 'Music',
    price: 'Starting from RWF 3000.00',
    imageUrl: image1,
  },
  {
    id: 2,
    name: 'Shoes',
    price: 'Starting from RWF 20,000',
    imageUrl: image2,
  },
  {
    id: 3,
    name: 'Skin Care',
    price: 'Starting from RWF 5000',
    imageUrl: image3,
  },
  {
    id: 4,
    name: 'Cars',
    price: 'Starting from RWF 50,000',
    imageUrl: image4,
  },
  // Add more products as needed
];

const ProductCarousel = () => {
  const { t } = useTranslation();
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // Keep slidesToShow as 1
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // Change slide every 3 seconds
    arrows: false,
    dots: false,
  };

  return (
    <div className="bg-gray-100 dark:bg-[#1f1f1f] bg-white p-4">
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id} className="flex dark:bg-[#2b2b2b] bg-white rounded-lg">
            <div className="flex flex-row w-full h-[200px]">
              {/* Left Side: Call to Action */}
              <div className="w-2/3 flex flex-col justify-center items-start p-4 text-white space-y-2 rounded-lg shadow-[rgba(129, 129, 131, 0.5)_-10px_5px_4px_0px]">
                <h3 className="text-lg font-bold dark:text-white text-gray-900">
                  {product.name}
                </h3>
                <p className="text-sm dark:text-gray-200 text-gray-600">
                  {product.price}
                </p>
                
                {/* Link with product name as a query parameter */}
                <Link to={`/products?search=${product.name}`}>
                  <button className="bg-[#29625d] hover:bg-black mt-2 text-white text-sm font-bold py-1 px-6 rounded-lg">
                    Shop Now
                  </button>
                </Link>
              </div>

              {/* Right Side: Product Image */}
              <div className="w-2/3 flex justify-center items-center overflow-hidden rounded-r-lg p-4 bg-[#fed592] relative" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }}>
                <div className="relative w-full h-full z-10">
                  {/* Product image */}
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="object-contain w-full h-full "
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductCarousel;
