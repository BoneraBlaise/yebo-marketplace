import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { server } from "../server";
import { getAllProductsShop } from "../redux/actions/product";
import { getAllEventsShop } from "../redux/actions/event";

const STATUS_EVENT = "yebone:shop-status-updated";

export const emitShopStatusUpdate = (shopId, businessStatus) => {
  window.dispatchEvent(
    new CustomEvent(STATUS_EVENT, { detail: { shopId, businessStatus } })
  );
};

export const useShopStorefront = (shopId) => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [shop, setShop] = useState(null);
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [followState, setFollowState] = useState({ following: false, favorited: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStorefront = useCallback(async () => {
    if (!shopId) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${server}/shop/get-shop-info/${shopId}`, {
        withCredentials: true,
      });
      setShop(data.shop);
      setStats(data.stats);
      setAchievements(data.achievements || []);
      setFollowState(data.followState || { following: false, favorited: false });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load shop");
    } finally {
      setLoading(false);
    }
  }, [shopId]);

  useEffect(() => {
    fetchStorefront();
    dispatch(getAllProductsShop(shopId));
    dispatch(getAllEventsShop(shopId));
  }, [shopId, dispatch, fetchStorefront]);

  useEffect(() => {
    const onStatus = (e) => {
      if (String(e.detail?.shopId) === String(shopId)) {
        setShop((prev) => (prev ? { ...prev, businessStatus: e.detail.businessStatus } : prev));
      }
    };
    window.addEventListener(STATUS_EVENT, onStatus);
    return () => window.removeEventListener(STATUS_EVENT, onStatus);
  }, [shopId]);

  const toggleFollow = async () => {
    if (!isAuthenticated) return { needsAuth: true };
    const { data } = await axios.post(`${server}/shop/${shopId}/follow`, {}, { withCredentials: true });
    setFollowState((prev) => ({ ...prev, following: data.following }));
    setShop((prev) => (prev ? { ...prev, followerCount: data.followerCount } : prev));
    return data;
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) return { needsAuth: true };
    const { data } = await axios.post(`${server}/shop/${shopId}/favorite`, {}, { withCredentials: true });
    setFollowState((prev) => ({ ...prev, favorited: data.favorited }));
    setShop((prev) => (prev ? { ...prev, favoriteCount: data.favoriteCount } : prev));
    return data;
  };

  return {
    shop,
    stats,
    achievements,
    followState,
    products,
    loading,
    error,
    isAuthenticated,
    user,
    refresh: fetchStorefront,
    toggleFollow,
    toggleFavorite,
  };
};

export default useShopStorefront;
