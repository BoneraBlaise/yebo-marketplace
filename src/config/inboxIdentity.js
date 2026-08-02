import { COMMUNICATION_IDENTITY } from "./communicationIdentity";

/** Resolve which JWT identity drives inbox badges for the current route. */
export const resolveInboxIdentity = (pathname = "", isSeller = false) => {
  if (pathname.startsWith("/inbox")) {
    return COMMUNICATION_IDENTITY.BUYER;
  }
  if (pathname.startsWith("/dashboard-messages") || (isSeller && pathname.startsWith("/dashboard"))) {
    return COMMUNICATION_IDENTITY.SELLER;
  }
  return isSeller ? COMMUNICATION_IDENTITY.SELLER : COMMUNICATION_IDENTITY.BUYER;
};

export const inboxPathForIdentity = (identity) =>
  identity === COMMUNICATION_IDENTITY.SELLER ? "/dashboard-messages" : "/inbox";
