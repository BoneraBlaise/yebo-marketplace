import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { server } from "../../server";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import Cookies from "js-cookie";
import { MdVerified } from "react-icons/md";
import { typography } from "../../design-system/typography";
const ShopInfo = ({ isOwner }) => {
  const [data, setData] = useState({});
  const { products } = useSelector((state) => state.products);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(id));
    setIsLoading(true);
    axios
      .get(`${server}/shop/get-shop-info/${id}`)
      .then((res) => {
        setData(res.data.shop);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  const logoutHandler = async () => {
    try {
      await axios.get(`${server}/shop/logout`, {
        withCredentials: true,
      });

      Cookies.remove("seller_token");
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const totalReviewsLength =
    products &&
    products.reduce((acc, product) => acc + product.reviews.length, 0);

  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    );

  const averageRating = totalRatings / totalReviewsLength || 0;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="marketplace-shop-sidebar yebone-surface dark:bg-[#1f1f1f] overflow-hidden">
          <div className="relative bg-gradient-to-br from-yebone-primary to-yebone-primary-dark px-6 pt-8 pb-16 text-center">
            <div className="w-full flex items-center justify-center">
              <img
                src={`${data.avatar?.url}`}
                alt={data.name || "Shop avatar"}
                className="w-20 h-20 border-2 border-white/30 bg-white object-cover rounded-full shadow-lg"
              />
            </div>
            <div className="flex items-center justify-center gap-2 mt-3">
              <h3 className={`${typography.subheading} text-white text-lg`}>
                {data.name}
              </h3>
              {data.isVerified && (
                <MdVerified className="text-yebone-gold shrink-0" size={20} title="Verified seller" />
              )}
            </div>
            {data.isVerified && (
              <span className="inline-block mt-2 px-3 py-0.5 rounded-full bg-white/15 text-white text-xs font-semibold">
                Verified seller
              </span>
            )}
          </div>

          <div className="px-5 -mt-10 relative z-10">
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="marketplace-shop-stat">
                <span className="text-xs text-gray-500 dark:text-gray-400">Products</span>
                <span className="font-bold text-yebone-primary dark:text-white">
                  {products?.length || 0}
                </span>
              </div>
              <div className="marketplace-shop-stat">
                <span className="text-xs text-gray-500 dark:text-gray-400">Rating</span>
                <span className="font-bold text-yebone-primary dark:text-white">
                  {averageRating ? `${averageRating.toFixed(1)}/5` : "—"}
                </span>
              </div>
            </div>
          </div>

          {data.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 px-5 pb-4 leading-relaxed">
              {data.description}
            </p>
          )}

          <div className="px-5 pb-4 space-y-3">
            {data.paymentInfo && (
              <div className="marketplace-shop-stat">
                <h5 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Payment</h5>
                <p className="text-sm dark:text-gray-200">{data.paymentInfo}</p>
              </div>
            )}
            {data.address && (
              <div className="marketplace-shop-stat">
                <h5 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Address</h5>
                <p className="text-sm dark:text-gray-200">{data.address}</p>
              </div>
            )}
            {data.phoneNumber && (
              <div className="marketplace-shop-stat">
                <h5 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Phone</h5>
                <p className="text-sm dark:text-gray-200">{data.phoneNumber}</p>
              </div>
            )}
            {data?.createdAt && (
              <div className="marketplace-shop-stat">
                <h5 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Joined</h5>
                <p className="text-sm dark:text-gray-200">{data.createdAt.slice(0, 10)}</p>
              </div>
            )}
          </div>
          {isOwner && (
            <div className="py-3 px-4">
              <Link to="/settings">
                <div
                  className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}
                >
                  <span className="text-white">Edit Shop</span>
                </div>
              </Link>
              <div
                className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}
                onClick={logoutHandler}
              >
                <span className="text-white">Log Out</span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ShopInfo;
