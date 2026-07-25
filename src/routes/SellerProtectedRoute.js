import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "../components/Layout/Loader";
import { tryResumeSellerSession } from "../utils/sellerSession";
import { SELLER_ONBOARDING_PATH } from "../utils/sellerNav";

const SellerProtectedRoute = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isLoading, isSeller } = useSelector((state) => state.seller);
  const { isAuthenticated } = useSelector((state) => state.user);
  const [resumeChecked, setResumeChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const attemptResume = async () => {
      if (isSeller || !isAuthenticated || isLoading) {
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
  }, [dispatch, isAuthenticated, isLoading, isSeller]);

  if (isLoading || (isAuthenticated && !isSeller && !resumeChecked)) {
    return <Loader />;
  }

  if (!isSeller) {
    if (isAuthenticated) {
      return <Navigate to={SELLER_ONBOARDING_PATH} replace state={{ from: location.pathname }} />;
    }
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default SellerProtectedRoute;
