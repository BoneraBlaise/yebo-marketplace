import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import ProductCard from "../Route/ProductCard/ProductCard";
import Ratings from "../Products/Ratings";
import { getAllEventsShop } from "../../redux/actions/event";

const ShopProfileData = ({ isOwner }) => {
  const { products } = useSelector((state) => state.products);
  const { events } = useSelector((state) => state.events);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(id));
    dispatch(getAllEventsShop(id));
  }, [dispatch, id]);

  const [active, setActive] = useState(1);

  const allReviews =
    products && products.map((product) => product.reviews).flat();

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
        {[
          { id: 1, label: "Shop Products" },
          { id: 2, label: "Running Events" },
          { id: 3, label: "Shop Reviews" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={`marketplace-section-tab ${active === tab.id ? "is-active" : ""}`}
          >
            {tab.label}
          </button>
        ))}
        {isOwner && (
          <Link to="/dashboard" className="marketplace-section-tab ml-auto">
            Dashboard
          </Link>
        )}
      </div>
      {active === 1 && (
        <div className="marketplace-product-grid mpc-grid--page mb-12">
          {products &&
            [...products]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((product) => (
                <div key={product._id} className="mpc-card-slot">
                  <ProductCard data={product} isShop={true} />
                </div>
              ))}
        </div>
      )}

      {active === 2 && (
        <div className="w-full">
          <div className="flex flex-wrap justify-center md:justify-start gap-5 sm:gap-8 md:gap-5 lg:gap-5 mb-12">
            {events &&
              // Create a shallow copy and sort it by createdAt (new to old)
              [...events]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((event, index) => (
                  <ProductCard data={event} key={index} isShop={true} isEvent={true} />
                ))}
          </div>
          {events && events.length === 0 && (
            <h5 className="w-full text-center py-5 text-lg dark:text-gray-200">
              No Events have for this shop!
            </h5>
          )}
        </div>
      )}


      {active === 3 && (
        <div className="w-full">
          {allReviews && allReviews.map((item, index) => (
            <div className="w-full flex mx-2 my-4" key={index}>
              <img
                src={item.user.avatar?.url}
                className="w-12 h-12 rounded-full shadow-md hover:scale-105 transform transition-all duration-300"
                alt="reviewer_image"
              />

              <div className="pl-2">
                <div className="flex w-full items-center">
                  <h1 className="font-semibold pr-2 dark:text-green-500">{item.user.name}</h1>
                  <Ratings rating={item.rating} />
                </div>
                <p className="font-normal mt-1 text-gray-700 dark:text-gray-400">{item?.comment}</p>
              </div>
            </div>
          ))}
          {allReviews && allReviews.length === 0 && (
            <h5 className="w-full text-center py-5 text-lg">
              No Reviews have for this shop!
            </h5>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopProfileData;
