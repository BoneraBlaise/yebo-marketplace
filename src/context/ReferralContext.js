import React, { createContext, useContext, useState } from "react";

const ReferralContext = createContext();

export const ReferralProvider = ({ children }) => {
  const [referralProducts, setReferralProducts] = useState(new Map());

  const addReferralProduct = (productId, referralCode, attributionToken = null) => {
    if (!productId || !referralCode) return;
    setReferralProducts((prev) => {
      const next = new Map(prev);
      next.set(String(productId), { referralCode, attributionToken });
      return next;
    });
  };

  const getReferralCode = (productId) => referralProducts.get(String(productId))?.referralCode;

  const getAttributionToken = (productId) =>
    referralProducts.get(String(productId))?.attributionToken;

  const getAttributionTokens = () =>
    [...referralProducts.values()].map((entry) => entry.attributionToken).filter(Boolean);

  const getReferralPayload = () => ({
    referralProducts: new Map(
      [...referralProducts.entries()].map(([productId, entry]) => [productId, entry.referralCode])
    ),
    attributionTokens: getAttributionTokens(),
  });

  const clearReferralProduct = (productId) => {
    setReferralProducts((prev) => {
      const next = new Map(prev);
      next.delete(String(productId));
      return next;
    });
  };

  const clearAllReferrals = () => {
    setReferralProducts(new Map());
  };

  return (
    <ReferralContext.Provider
      value={{
        referralProducts: new Map(
          [...referralProducts.entries()].map(([productId, entry]) => [productId, entry.referralCode])
        ),
        addReferralProduct,
        getReferralCode,
        getAttributionToken,
        getAttributionTokens,
        getReferralPayload,
        clearReferralProduct,
        clearAllReferrals,
      }}
    >
      {children}
    </ReferralContext.Provider>
  );
};

export const useReferral = () => useContext(ReferralContext);
