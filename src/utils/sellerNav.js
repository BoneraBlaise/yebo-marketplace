/** Role-aware seller navigation labels and destinations */

export const SELLER_ONBOARDING_PATH = "/seller/onboarding";
export const SELLER_DASHBOARD_PATH = "/dashboard";
export const LEGACY_SHOP_LOGIN_PATH = "/shop-login";

export const resolveSellerNavAction = ({ isAuthenticated, isSeller }) => {
  if (isSeller) {
    return { label: "My Shop", to: SELLER_DASHBOARD_PATH, variant: "seller" };
  }
  if (isAuthenticated) {
    return { label: "Become a Seller", to: SELLER_ONBOARDING_PATH, variant: "onboard" };
  }
  if (!isAuthenticated) {
    return { label: "Sell with Us", to: SELLER_ONBOARDING_PATH, variant: "guest" };
  }
};

export default resolveSellerNavAction;
