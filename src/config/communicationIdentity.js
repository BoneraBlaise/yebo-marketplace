import { getAuthToken, getSellerToken } from "./authStorage";

export const COMMUNICATION_IDENTITY = {
  BUYER: "buyer",
  SELLER: "seller",
};

export const getTokenForIdentity = (identity) => {
  if (identity === COMMUNICATION_IDENTITY.SELLER) {
    return getSellerToken();
  }
  return getAuthToken();
};
