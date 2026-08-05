import { useSelector } from "react-redux";
import { hasValidVendorToken, isVendorSessionReady } from "../config/vendorSession";

/**
 * Unified vendor identity hook — single decision point for all create flows.
 */
const useVendor = () => {
  const { isAuthenticated, user, loading: userLoading } = useSelector((state) => state.user);
  const { seller: vendor, isSeller: isVendor, isLoading: vendorLoading } = useSelector(
    (state) => state.seller
  );

  const authFlags = {
    isAuthenticated: Boolean(isAuthenticated),
    isVendor: Boolean(isVendor),
  };

  const hasToken = hasValidVendorToken();
  const isVendorReady = isVendorSessionReady(authFlags);

  return {
    user,
    vendor,
    vendorId: vendor?._id || null,
    isAuthenticated: authFlags.isAuthenticated,
    isVendor: authFlags.isVendor,
    hasValidToken: hasToken,
    isVendorReady,
    loading: Boolean(userLoading || vendorLoading),
    seller: vendor,
    isSeller: authFlags.isVendor,
    shopId: vendor?._id || null,
  };
};

export default useVendor;
