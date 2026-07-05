import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate here for redirecting
import { toast } from 'react-toastify';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { addToWishlist, removeFromWishlist } from '../../../redux/actions/wishlist';
import { useMediaQuery } from 'react-responsive';
import MobileFlashSaleList from './MobileFlashSaleList';
import { server } from '../../../server';
import axios from 'axios';
const FlashSaleList = ({ flashSales }) => {
    const dispatch = useDispatch();
    const { wishlist } = useSelector((state) => state.wishlist);
    const navigate = useNavigate();  // Use navigate for redirection
    const isMobile = useMediaQuery({ query: '(max-width: 900px)' });

    // Format price with commas
    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
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

    // Handle making an offer (redirect to flash sale details page)
    const handleMakeOffer = (flashSaleId) => {
        navigate(`/flashsale/${flashSaleId}`);
    };
    if (isMobile) {
        return <MobileFlashSaleList flashSales={flashSales} />;
    }
    return (
        <div className={`p-4 w-full mx-auto ${isMobile ? 'grid grid-cols-2 gap-4' : 'flex flex-col gap-4'}`}>
            {flashSales.length === 0 ? (
                <div>No flash sales available!</div>
            ) : (
                flashSales.map((flashSale) => {
                    const isInWishlist = wishlist.some((item) => item._id === flashSale._id);

                    // Check if the flash sale is "new" (created within the last 24 hours)
                    const isNew = new Date() - new Date(flashSale.createdAt) < 24 * 60 * 60 * 1000;
                    const discount = flashSale.originalPrice - flashSale.flashSalePrice;
                    const showDiscountText = discount > 10000;

                    return (
                        <div
                            key={flashSale._id}
                            className="flex border dark:border-1 dark:border-[#2b2b2b] transition-shadow duration-300 w-full h-[270px] max-w-full mx-auto relative"
                        >
                            {isNew && (
                                <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                    New
                                </span>
                            )}
                            <Link to={`/flashsale/${flashSale._id}`} className="flex-shrink-0 flex items-center h-full">
                                <img
                                    src={flashSale.images[0]?.url}
                                    alt={flashSale.name}
                                    className="h-full w-[250px] rounded-l-lg bg-gray-200 object-cover bg-[#f1f1f1]"
                                />
                            </Link>
                            <div className="flex-grow flex flex-col justify-between p-6">
                                <div>
                                    <Link to={`/flashsale/${flashSale._id}`}>
                                        <h2 className="font-medium text-xl mb-2">
                                            {flashSale.name.length > 360 ? `${flashSale.name.slice(0, 330)}...` : flashSale.name}
                                        </h2>
                                    </Link>

                                    <div className="flex justify-between items-center mb-2">
                                        <h5 className="text-md font-semibold">
                                            RWF {formatPrice(flashSale.flashSalePrice ? flashSale.flashSalePrice : flashSale.originalPrice)}
                                        </h5>

                                    </div>
                                    <span className="font-bold text-xl mt-4 text-red-700 dark:text-red-400">
                                        {flashSale.discountPercentage}% OFF
                                    </span>
                                </div>

                                <div className="flex mt-3">
                                     <div className="flex items-center border px-3 rounded-full mr-2 dark:bg-[#2b2b2b]">
                                                     {isInWishlist ? (
                                                       <AiFillHeart
                                                         size={35}
                                                         className="cursor-pointer dark:bg-transparent p-1 rounded-full"
                                                         onClick={() => handleWishlistToggle(flashSale, true)}
                                                         color="#ffd496"
                                                         title="Remove from wishlist"
                                                       />
                                                     ) : (
                                                       <AiOutlineHeart
                                                         size={35}
                                                         className="cursor-pointer dark:bg-transparent p-1 rounded-full"
                                                         onClick={() => handleWishlistToggle(flashSale, false)}
                                                         title="Add to wishlist"
                                                       />
                                                     )}
                                                     <span className="text-sm mr-2 text-green-700 dark:text-green-500">{flashSale.likes.length}</span>
                                                   </div>
                                <button
                                    className="bg-[#29625d] text-white py-2 px-4 rounded-full transition duration-300 hover:bg-black"
                                    onClick={() => handleMakeOffer(flashSale._id)} // Trigger the offer redirection
                                    title="Make an offer"
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>
                        </div>
    );
})
            )}
        </div >
    );
};

export default FlashSaleList;
