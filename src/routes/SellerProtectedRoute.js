import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "../components/Layout/Loader";
import { LEGACY_SHOP_LOGIN_PATH, SELLER_ONBOARDING_PATH } from "../utils/sellerNav";

const SellerProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isLoading, isSeller } = useSelector((state) => state.seller);
  const { isAuthenticated } = useSelector((state) => state.user);

  if (isLoading === true) {
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

export { LEGACY_SHOP_LOGIN_PATH };

export default SellerProtectedRoute;
