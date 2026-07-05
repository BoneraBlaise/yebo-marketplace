import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { addToWishlist, removeFromWishlist } from '../../../redux/actions/wishlist';
import { toast } from 'react-toastify';
import axios from 'axios';
import { server } from '../../../server';
const MobileFlashSaleList = ({ flashSales = [] }) => {
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.wishlist);

  // Format price with commas for better readability
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Handle adding/removing from wishlist
  const handleWishlistToggle = async (flashSale) => {
    const isInWishlist = wishlist.some((item) => item._id === flashSale._id);

    try {
        // Debugging: Check the flashSaleId before sending
        console.log("Sending flashSaleId: ", flashSale._id);

        // Send request to backend to handle like/unlike
        const response = await axios.put(
            `${server}/flashsale/like-flashsale`,
            { flashSaleId: flashSale._id }, // Send flashSaleId to handle like/unlike
            {
                withCredentials: true,  // Ensure cookies are sent with the request
            }
        );

        if (response.data.success) {
            // If the response is successful, update the UI
            if (isInWishlist) {
                dispatch(removeFromWishlist(flashSale)); // Dispatch action to remove from wishlist
                toast.info('Removed from wishlist!');
            } else {
                dispatch(addToWishlist(flashSale)); // Dispatch action to add to wishlist
                toast.success('Added to wishlist!');
            }
        } else {
            toast.error("Something went wrong!");
        }
    } catch (error) {
        toast.error("Can not watch this product at the moment!");
        console.error("Error during request:", error); // Log error for debugging
    }
};

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
      {flashSales.length === 0 ? (
        <div>No flash sales available!</div>
      ) : (
        flashSales.map((flashSale) => {
          const isInWishlist = wishlist.some((item) => item._id === flashSale._id);

          return (
            <div
              key={flashSale._id}
              className="flex flex-col border dark:border-1 dark:border-[#2b2b2b] relative"
            >
              {/* Image Section */}
              <Link to={`/flashsale/${flashSale._id}`} className="flex-shrink-0 flex items-center">
                <img
                  src={flashSale.images[0]?.url}
                  alt={flashSale.name}
                  className="w-full h-[120px] sm:h-[90px] rounded-t-lg bg-gray-200 object-cover"
                />
              </Link>

              {/* Content Section */}
              <div className="flex-grow flex flex-col justify-between p-4">
                <div>
                  <Link to={`/flashsale/${flashSale._id}`}>
                    <h2 className="font-medium text-lg mb-2 truncate">{flashSale.name}</h2>
                  </Link>

                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-md font-semibold">
                      RWF {formatPrice(flashSale.flashSalePrice ? flashSale.flashSalePrice : flashSale.originalPrice)}
                    </h5>
                    <span className="font-medium text-sm mt-4 text-red-700">
                      {flashSale.discountPercentage} OFF
                    </span>
                  </div>
                </div>

                {/* Wishlist and Button Section */}
                <div className="flex gap-3 mt-3 justify-between items-center">
                  {isInWishlist ? (
                    <AiFillHeart
                      size={32}
                      className="cursor-pointer  p-1 rounded-full"
                      onClick={() => handleWishlistToggle(flashSale)}
                      color="red"
                      title="Remove from wishlist"
                    />
                  ) : (
                    <AiOutlineHeart
                      size={32}
                      className="cursor-pointer p-1 rounded-full"
                      onClick={() => handleWishlistToggle(flashSale)}
                      title="Add to wishlist"
                    />
                  )}
                  <Link
                    to={`/flashsale/${flashSale._id}`}
                    className="bg-[#29625d] text-white py-2 px-4 rounded-full text-center transition duration-300 hover:bg-black w-full sm:w-auto"
                    title="Make an offer"
                  >
                    Make an offer
                  </Link>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MobileFlashSaleList;
