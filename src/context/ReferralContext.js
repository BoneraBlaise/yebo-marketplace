import React, { createContext, useContext, useState, useEffect } from 'react';

const ReferralContext = createContext();

export const ReferralProvider = ({ children }) => {
  // Initialize from localStorage if available
  const [referralProducts, setReferralProducts] = useState(() => {
    const saved = localStorage.getItem('referralProducts');
    return saved ? new Map(Object.entries(JSON.parse(saved))) : new Map();
  });
  
  // Save to localStorage whenever referralProducts changes
  useEffect(() => {
    const referralObj = Object.fromEntries(referralProducts);
    localStorage.setItem('referralProducts', JSON.stringify(referralObj));
  }, [referralProducts]);
  
  const addReferralProduct = (productId, referralCode) => {
    setReferralProducts(prev => {
      const newMap = new Map(prev);
      newMap.set(productId, referralCode);
      return newMap;
    });
    
    // Also log this action for debugging
    console.log(`Added referral for product ${productId} with code ${referralCode}`);
  };

  const getReferralCode = (productId) => {
    return referralProducts.get(productId);
  };

  const clearReferralProduct = (productId) => {
    setReferralProducts(prev => {
      const newMap = new Map(prev);
      newMap.delete(productId);
      return newMap;
    });
  };

  const clearAllReferrals = () => {
    setReferralProducts(new Map());
    localStorage.removeItem('referralProducts');
  };

  return (
    <ReferralContext.Provider value={{
      referralProducts,
      addReferralProduct,
      getReferralCode,
      clearReferralProduct,
      clearAllReferrals
    }}>
      {children}
    </ReferralContext.Provider>
  );
};

export const useReferral = () => useContext(ReferralContext); 