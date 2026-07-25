import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SELLER_DASHBOARD_PATH } from "../utils/sellerNav";
import { clearSellerSessionSkip, tryResumeSellerSession } from "../utils/sellerSession";

const STORAGE_KEY = "yebone_marketplace_mode";

const MarketplaceModeContext = createContext(null);

export const MarketplaceModeProvider = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isSeller } = useSelector((state) => state.seller);
  const [mode, setModeState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "seller" ? "seller" : "customer";
    } catch {
      return "customer";
    }
  });

  const setMode = useCallback((nextMode) => {
    setModeState(nextMode);
    try {
      localStorage.setItem(STORAGE_KEY, nextMode);
    } catch {
      /* ignore */
    }
  }, []);

  const switchToCustomerMode = useCallback(() => {
    setMode("customer");
    navigate("/");
  }, [navigate, setMode]);

  const switchToSellerMode = useCallback(async () => {
    setMode("seller");
    clearSellerSessionSkip();
    if (!isSeller) {
      await dispatch(tryResumeSellerSession());
    }
    navigate(SELLER_DASHBOARD_PATH);
  }, [dispatch, isSeller, navigate, setMode]);

  const value = useMemo(
    () => ({
      mode,
      isCustomerMode: mode === "customer",
      isSellerMode: mode === "seller",
      setMode,
      switchToCustomerMode,
      switchToSellerMode,
    }),
    [mode, setMode, switchToCustomerMode, switchToSellerMode]
  );

  return (
    <MarketplaceModeContext.Provider value={value}>
      {children}
    </MarketplaceModeContext.Provider>
  );
};

export const useMarketplaceMode = () => {
  const ctx = useContext(MarketplaceModeContext);
  if (!ctx) {
    throw new Error("useMarketplaceMode must be used within MarketplaceModeProvider");
  }
  return ctx;
};

export default MarketplaceModeContext;
