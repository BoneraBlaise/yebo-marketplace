import React, { useState } from "react";
import { Link } from "react-router-dom";
import CountDown from "./CountDown";
import { useDispatch, useSelector } from "react-redux";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import { Button } from "../ui";
import { resolveProductDisplayImage } from "../../utils/catalogQuality";

const EventCard = ({ active, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [hover, setHover] = useState(false);

  const title = data.title || data.name || "Marketplace event";
  const imageSrc = resolveProductDisplayImage(
    { ...data, category: "events", images: data.images },
    "card"
  );
  const soldCount = data.sold_out ?? 0;

  const addToCartHandler = (eventData) => {
    const isItemExists = cart && cart.find((i) => i._id === eventData._id);
    if (isItemExists) {
      toast.error("This event is already in your cart.");
      return;
    }
    if (eventData.stock < 1) {
      toast.error("Tickets are no longer available.");
      return;
    }
    dispatch(addTocart({ ...eventData, qty: 1 }));
    toast.success("Added to cart.");
  };

  const formatPrice = (price) =>
    (price ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <article className="yebone-card-lift group w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm flex flex-col">
      <div
        className="relative w-full aspect-[4/3] overflow-hidden bg-yebone-light-gray"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <img
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] yebone-img-fade"
          src={imageSrc}
          alt={title}
          loading="lazy"
        />
        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-lg bg-yebone-primary text-white text-[10px] font-bold uppercase">
          Event
        </span>
        {hover ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 backdrop-blur-[2px] yebone-fade-up">
            <Link to={`/product/${data._id}?isEvent=true`}>
              <Button size="sm" variant="outline" className="!text-white !border-white/40">
                View details
              </Button>
            </Link>
            <Button size="sm" onClick={() => addToCartHandler(data)}>
              Get tickets
            </Button>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col flex-grow p-4 gap-2">
        <Link to={`/product/${data._id}?isEvent=true`}>
          <h4 className="font-Poppins font-semibold text-sm line-clamp-2 dark:text-white group-hover:text-yebone-primary transition">
            {title}
          </h4>
        </Link>

        {data.location ? (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{data.location}</p>
        ) : null}

        <div className="flex items-center justify-between gap-2">
          <p className="font-bold text-yebone-primary text-sm">
            RWF {formatPrice(data.discountPrice)}
          </p>
          {soldCount > 0 ? (
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
              {soldCount} sold
            </span>
          ) : null}
        </div>

        <div className="mt-auto pt-2 border-t border-gray-100 dark:border-gray-800">
          <CountDown data={data} />
        </div>
      </div>
    </article>
  );
};

export default EventCard;
