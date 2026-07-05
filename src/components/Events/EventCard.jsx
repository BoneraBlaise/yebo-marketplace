import React, { useState } from "react";
import styles from "../../styles/styles"; // If you're using any custom styles
import CountDown from "./CountDown";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";

const EventCard = ({ active, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [hover, setHover] = useState(false);

  const addToCartHandler = (data) => {
    const isItemExists = cart && cart.find((i) => i._id === data._id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="w-full max-w-xs h-96 bg-white dark:bg-[#2b2b2b] dark:text-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col">
      <div
        className="relative w-full h-64 overflow-hidden"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <img
          className="w-full h-full object-cover object-center transition-transform duration-300 transform hover:scale-110"
          src={`${data.images[0]?.url}`}
          alt={data.name}
        />
        {hover && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-50">
            <Link to={`/product/${data._id}?isEvent=true`}>
              <button className="text-white py-2 px-4 rounded mb-2 hover:bg-[#29625d] transition-colors">
                See Details
              </button>
            </Link>
            <button
              className="bg-[#fdd69d] text-[#29625d] font-bold py-2 px-4 rounded hover:bg-black hover:text-white transition-colors"
              onClick={() => addToCartHandler(data)}
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-col flex-grow p-4">
        <Link to={`/product/${data._id}?isEvent=true`}>
          <h4 className="text-base font-bold mb-2 truncate">{data.name}</h4>
        </Link>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h5 className="font-bold text-sm text-gray-500 dark:text-red-200">
              RWF {formatPrice(data.discountPrice)}
            </h5>
          </div>
          <span className="text-sm text-green-600">
            {data.sold_out} sold
          </span>
        </div>
        <CountDown data={data} />
      </div>
    </div>
  );
};

export default EventCard;
