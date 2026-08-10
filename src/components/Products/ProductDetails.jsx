import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useProductVariantSelection } from "../../hooks/useProductVariantSelection";
import { getAvailableStock, isVariantPurchasable } from "../../utils/productVariantSelection";
import { getAllProductsShop } from "../../redux/actions/product";
import { server } from "../../server";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
import { buildVariantCartItem } from "../../utils/cartLineIdentity";
import { toast } from "react-toastify";
import axios from "axios";
import { startProductConversation } from "../../services/communicationService";
import ReactQuill from "react-quill";
import { useReferral } from "../../context/ReferralContext";
import {
  createReferralAttribution,
  trackReferralClickApi,
} from "../../services/growthConfigurationService";
import { trackCommissionClick } from "../../redux/actions/order";
import "./product-details.css";
import { Container } from "../ui";
import ProductGallery from "./ProductGallery";
import ProductPurchasePanel from "./ProductPurchasePanel";
import ProductAISections from "./ProductAISections";
import ProductSellerCard from "./ProductSellerCard";
import ProductDetailsTabs from "./ProductDetailsTabs";
import ProductTryOnModal from "./ProductTryOnModal";
import ProductTryOnUnavailableModal from "./ProductTryOnUnavailableModal";
import { isVendorTryOnSubscribed } from "./resolveVendorTryOn";

// Modal Component
const Modal = ({ show, onClose, description }) => {
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[200] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto hide-scrollbar shadow-2xl border border-gray-100 dark:border-gray-800 pdp-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-Poppins text-xl font-semibold dark:text-white mb-4">Full Description</h2>
        <ReactQuill value={description} readOnly theme="bubble" className="dark:text-white" />
        <button
          type="button"
          onClick={onClose}
          className="mt-6 px-6 py-2.5 rounded-xl bg-yebone-primary text-white font-semibold hover:bg-yebone-primary-dark transition pdp-btn-lift"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const ProductDetails = ({ data }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.products);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const [shopVerify, setShopVerify] = useState(Boolean(data?.shop?.isVerified));
  const [shopInfo, setShopInfo] = useState(null);
  const [tryOnOpen, setTryOnOpen] = useState(false);
  const [tryOnUnavailableOpen, setTryOnUnavailableOpen] = useState(false);
  const location = useLocation();
  const { addReferralProduct } = useReferral();

  const {
    hasVariantSelector,
    selection: variantSelection,
    selectedVariant,
    displayOffer,
    displayImages,
    handleSelectionChange,
  } = useProductVariantSelection(data);

  useEffect(() => {
    setSelect(0);
  }, [selectedVariant?.id, displayImages]);

  useEffect(() => {
    if (!hasVariantSelector) return;
    const maxStock = getAvailableStock(selectedVariant);
    if (maxStock > 0 && count > maxStock) {
      setCount(maxStock);
    }
  }, [hasVariantSelector, selectedVariant, count]);

  const activeOffer = useMemo(() => {
    if (!hasVariantSelector) {
      return {
        discountPrice: data?.discountPrice,
        originalPrice: data?.originalPrice,
        stock: data?.stock,
      };
    }
    return displayOffer;
  }, [hasVariantSelector, data, displayOffer]);

  const discountPct = useMemo(() => {
    const original = Number(activeOffer?.originalPrice);
    const discount = Number(activeOffer?.discountPrice);
    if (!Number.isFinite(original) || !Number.isFinite(discount) || original <= discount) {
      return 0;
    }
    return Math.round(((original - discount) / original) * 100);
  }, [activeOffer]);

  const moneySaved = useMemo(() => {
    const original = Number(activeOffer?.originalPrice);
    const discount = Number(activeOffer?.discountPrice);
    if (!Number.isFinite(original) || !Number.isFinite(discount) || original <= discount) {
      return 0;
    }
    return original - discount;
  }, [activeOffer]);

  const canPurchase = hasVariantSelector
    ? Boolean(selectedVariant && displayOffer?.isAvailable !== false && getAvailableStock(selectedVariant) > 0)
    : Number(data?.stock) > 0;

  // Slice the description to 200 characters
  const shortDescription = data?.description?.slice(0, 350);
  const isDescriptionLong = data?.description?.length > 350;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  useEffect(() => {
    if (!data?.shop?._id) return;
    setClick(wishlist.some((i) => i._id === data._id));
    const hasShopProducts = products?.some(
      (p) => String(p.shopId) === String(data.shop._id)
    );
    if (!hasShopProducts) {
      dispatch(getAllProductsShop(data.shop._id));
    }
  }, [data?._id, data?.shop?._id, wishlist, dispatch, products]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const refCode = params.get("ref");
    const attToken = params.get("att");

    if (!refCode || !data?._id) return;

    const applyReferral = async () => {
      let attributionToken = attToken;
      try {
        if (!attributionToken) {
          const response = await createReferralAttribution({
            referralCode: refCode,
            productId: data._id,
            shopId: data.shop?._id,
          });
          attributionToken = response?.data?.attributionToken;
        }
        addReferralProduct(data._id, refCode, attributionToken);
        await trackReferralClickApi(refCode);
        dispatch(trackCommissionClick(refCode));
      } catch (error) {
        addReferralProduct(data._id, refCode, attributionToken);
        dispatch(trackCommissionClick(refCode));
      }

      const newUrl =
        window.location.pathname +
        (window.location.search
          ? window.location.search.replace(/(\?|&)ref=[^&]*(&|$)/, "$1").replace(/(\?|&)att=[^&]*(&|$)/, "$1").replace(/\?$|&$/, "")
          : "");
      window.history.replaceState({}, "", newUrl);
    };

    applyReferral();
  }, [location, data, addReferralProduct, dispatch]);

  const incrementCount = () => setCount((prev) => prev + 1);
  const decrementCount = () => count > 1 && setCount((prev) => prev - 1);

  const toggleWishlist = () => {
    setClick((prev) => !prev);
    click ? dispatch(removeFromWishlist(data)) : dispatch(addToWishlist(data));
  };

  const addToCartHandler = (id) => {
    if (!data) return;

    if (hasVariantSelector) {
      if (!selectedVariant) {
        toast.error("Select a product option before adding to cart.");
        return;
      }
      if (!isVariantPurchasable(selectedVariant)) {
        toast.error("Selected option is unavailable.");
        return;
      }
      const availableStock = getAvailableStock(selectedVariant);
      if (count > availableStock) {
        toast.error("Product stock limited!");
        return;
      }

      dispatch(addTocart(buildVariantCartItem(data, selectedVariant, count)));
      toast.success("Item added to cart successfully!");
      return;
    }

    const isItemExists = cart && cart.find((i) => i._id === id && !i.variantId);
    if (isItemExists) {
      toast.error("Item already in cart!");
      return;
    }

    if (data.stock < count) {
      toast.error("Product stock limited!");
      return;
    }

    const cartItem = {
      ...data,
      qty: count,
    };

    dispatch(addTocart(cartItem));
    toast.success("Item added to cart successfully!");
  };

  const buyNowHandler = () => {
    if (!data) return;

    if (hasVariantSelector) {
      if (!selectedVariant) {
        toast.error("Select a product option before checkout.");
        return;
      }
      if (!isVariantPurchasable(selectedVariant)) {
        toast.error("Selected option is unavailable.");
        return;
      }
      if (getAvailableStock(selectedVariant) < count) {
        toast.error("Product stock limited!");
        return;
      }

      const lineKey = `${data._id}:${selectedVariant.id}`;
      const isItemExists = cart && cart.find(
        (item) => (item.cartLineKey || `${item._id}:${item.variantId || ""}`) === lineKey
      );
      if (!isItemExists) {
        dispatch(addTocart(buildVariantCartItem(data, selectedVariant, count)));
      }
      navigate("/checkout");
      return;
    }

    const isItemExists = cart && cart.find((i) => i._id === data._id && !i.variantId);
    if (!isItemExists) {
      if (data.stock < count) {
        toast.error("Product stock limited!");
        return;
      }
      dispatch(addTocart({ ...data, qty: count }));
    }
    navigate("/checkout");
  };
  // Refresh shop details in background (verify badge, business status, try-on flags)
  useEffect(() => {
    if (!data?.shop?._id) return undefined;

    if (data.shop.isVerified !== undefined) {
      setShopVerify(Boolean(data.shop.isVerified));
    }
    const controller = new AbortController();
    axios
      .get(`${server}/shop/get-shop-info/${data.shop._id}`, {
        signal: controller.signal,
      })
      .then((response) => {
        const shop = response.data.shop;
        setShopInfo(shop);
        setShopVerify(Boolean(shop?.isVerified));
      })
      .catch((error) => {
        if (error.name !== "CanceledError" && error.code !== "ERR_CANCELED") {
          console.error("Error fetching shop details:", error);
        }
      });

    return () => controller.abort();
  }, [data?.shop?._id, data?.shop?.isVerified]);
  const handleMessageSubmit = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to create a conversation");
      return;
    }

    const sellerId = data.shop?._id || data.shopId;
    if (!sellerId) {
      toast.error("Seller information unavailable");
      return;
    }

    try {
      const productSnapshot = {
        productId: String(data._id),
        name: data.name,
        price: Number(data.discountPrice || data.originalPrice),
        image: data.images?.[0]?.url || data.images?.url || null,
        shopId: String(sellerId),
      };

      const conversation = await startProductConversation({
        productId: String(data._id),
        sellerId: String(sellerId),
        productSnapshot,
        initialMessage: `Hi, I'm interested in ${data.name} (${data.discountPrice} RWF). Can you share more details?`,
      });

      navigate(`/inbox?conversation=${conversation._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating conversation");
    }
  };
  const handleTryOn = () => {
    const vendorId = data.shop?._id || data.shopId;
    const subscribed = isVendorTryOnSubscribed(
      vendorId,
      shopInfo || data.shop,
      data
    );
    if (subscribed) {
      setTryOnOpen(true);
    } else {
      setTryOnUnavailableOpen(true);
    }
  };

  const handleNotifySeller = () => {
    setTryOnUnavailableOpen(false);
    handleMessageSubmit();
  };

  const formatPrice = (price) =>
    price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const totalReviewsLength = products?.reduce(
    (acc, product) => acc + product.reviews.length,
    0
  );

  const totalRatings = products?.reduce(
    (acc, product) =>
      acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
    0
  );

  const averageRating = (totalRatings / totalReviewsLength || 0).toFixed(2);

  return (
    <div className="pdp-page">
      {data ? (
        <>
          <Container className="pdp-page__hero">
            <div className="pdp-hero-grid">
              <ProductGallery images={displayImages} select={select} setSelect={setSelect} />
              <ProductPurchasePanel
                data={data}
                offer={displayOffer}
                hasVariantSelector={hasVariantSelector}
                selectedVariant={selectedVariant}
                variantSelection={variantSelection}
                onVariantSelect={handleSelectionChange}
                count={count}
                incrementCount={incrementCount}
                decrementCount={decrementCount}
                addToCartHandler={addToCartHandler}
                buyNowHandler={buyNowHandler}
                click={click}
                toggleWishlist={toggleWishlist}
                formatPrice={formatPrice}
                discountPct={discountPct}
                moneySaved={moneySaved}
                reviewCount={data.reviews?.length || 0}
                showRating={(data.reviews?.length || 0) > 0 && (data.ratings || 0) > 0}
                shortDescription={shortDescription}
                isDescriptionLong={isDescriptionLong}
                onShowMore={toggleModal}
              />
            </div>
          </Container>

          <Container className="pdp-page__block">
            <ProductSellerCard
              shop={data.shop}
              shopVerify={shopVerify}
              shopRating={Number(averageRating) || data.ratings || 0}
              reviewCount={totalReviewsLength || data.reviews?.length || 0}
              onMessage={handleMessageSubmit}
            />
          </Container>

          <Container className="pdp-page__block">
            <ProductDetailsTabs
              data={data}
              products={products}
              totalReviewsLength={totalReviewsLength}
              averageRating={averageRating}
              shopVerify={shopVerify}
              handleMessageSubmit={handleMessageSubmit}
            />
          </Container>

          <ProductAISections category={data.category} onTryOn={handleTryOn} />

          <div className="pdp-mobile-bar">
            <p className="pdp-mobile-bar__price">
              RWF {formatPrice(activeOffer?.discountPrice ?? data.discountPrice)}
            </p>
            <button
              type="button"
              className="pdp-mobile-bar__cart"
              onClick={() => addToCartHandler(data._id)}
              disabled={!canPurchase}
            >
              Add to Cart
            </button>
            <button
              type="button"
              className="pdp-mobile-bar__buy"
              onClick={buyNowHandler}
              disabled={!canPurchase}
            >
              Buy Now
            </button>
          </div>
        </>
      ) : (
        <div className="pdp-page__empty">No product details available.</div>
      )}

      <Modal show={isModalOpen} onClose={toggleModal} description={data?.description} />
      <ProductTryOnModal
        open={tryOnOpen}
        onClose={() => setTryOnOpen(false)}
        productId={data?._id}
        productName={data?.name}
        userId={user?._id}
        vendorId={data?.shop?._id || data?.shopId}
      />
      <ProductTryOnUnavailableModal
        open={tryOnUnavailableOpen}
        onClose={() => setTryOnUnavailableOpen(false)}
        shopId={data?.shop?._id || data?.shopId}
        shopName={data?.shop?.name}
        onNotifySeller={handleNotifySeller}
      />
    </div>
  );
};

export default ProductDetails;
