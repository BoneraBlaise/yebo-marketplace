import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "../components/Layout/Loader";
import { tryResumeSellerSession } from "../utils/sellerSession";
import { SELLER_ONBOARDING_PATH } from "../utils/sellerNav";
import { isVendorSessionReady } from "../config/vendorSession";

/**
 * Unified vendor route guard — one login, one token, one vendor profile.
 */
const SellerProtectedRoute = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isLoading, isSeller: isVendor } = useSelector((state) => state.seller);
  const { isAuthenticated } = useSelector((state) => state.user);
  const [resumeChecked, setResumeChecked] = useState(false);

  const vendorReady = isVendorSessionReady({ isAuthenticated, isVendor });

  useEffect(() => {
    let cancelled = false;

    const attemptResume = async () => {
      if (isVendor || !isAuthenticated || isLoading) {
        if (!cancelled) setResumeChecked(true);
        return;
      }
      await dispatch(tryResumeSellerSession());
      if (!cancelled) setResumeChecked(true);
    };

    attemptResume();
    return () => {
      cancelled = true;
    };
  }, [dispatch, isAuthenticated, isLoading, isVendor]);

  if (isLoading || (isAuthenticated && !isVendor && !resumeChecked)) {
    return <Loader />;
  }

  if (!isVendor) {
    if (isAuthenticated) {
      return <Navigate to={SELLER_ONBOARDING_PATH} replace state={{ from: location.pathname }} />;
    }
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!vendorReady) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default SellerProtectedRoute;
