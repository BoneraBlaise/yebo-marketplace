import React, { useState, useEffect } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addTocart } from "../../../redux/actions/cart";
import { formatDistanceToNow } from "date-fns"; // For the timer
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";

const FlashSaleCard = ({ data }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(formatDistanceToNow(new Date(data.endTime), { addSuffix: true }));
    }, 1000);

    return () => clearInterval(interval);
  }, [data.endTime]);

  const addToCartHandler = (id) => {
    if (data.stockAvailable < 1) {
      toast.error("Product stock limited!");
    } else {
      const cartData = { ...data, qty: 1 };
      dispatch(addTocart(cartData));
      toast.success("Item added to cart successfully!");
    }
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="bg-white dark:bg-[#2b2b2b] w-[260px] h-[450px] rounded-lg shadow-lg p-3 relative cursor-pointer hover:shadow-gray-300 dark:hover:shadow-black overflow-hidden">
      <Link to={`/product/${data._id}`}>
        <img
          src={`${data.images && data.images[0]?.url}`}
          alt={data.name}
          className="w-full h-[310px] object-cover transition-transform duration-300 ease-in-out hover:scale-105"
          style={{ backgroundColor: "#f1f1f1" }}
        />
      </Link>

      <div className="mt-3">
        <Link to={`/product/${data._id}`}>
          <h4 className="font-[500] text-[14px] dark:text-gray-200">
            {data.name.length > 40 ? data.name.slice(0, 40) + "..." : data.name}
          </h4>
          <div className="py-1 flex items-center justify-between">
            <div className="flex">
              <h6 className="text-[16px] font-[600] dark:text-[#29625d] dark:font-bold">
                RWF {formatPrice(data.flashSalePrice)}
              </h6>
              {data.originalPrice > data.flashSalePrice && (
                <span className="line-through text-[12px] text-gray-500 ml-2">
                  RWF {formatPrice(data.originalPrice)}
                </span>
              )}
            </div>
            <span className="font-[400] text-[13px] text-[#68d284]">
              {data.stockAvailable} available
            </span>
          </div>
        </Link>
        <p className="text-[12px] text-gray-500 mt-2">
          {timeLeft} left in sale
        </p>
      </div>

      <div className="bg-[#29625d] shadow-md absolute bottom-[20px] left-0 w-full p-2 flex justify-center items-center opacity-80">
        <AiOutlineShoppingCart
          size={30}
          className="cursor-pointer text-xl bg-white p-1 rounded-full"
          onClick={() => addToCartHandler(data._id)}
          color="black"
          title="Add to cart"
        />
      </div>
    </div>
  );
};

export default FlashSaleCard;
