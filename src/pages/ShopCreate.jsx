import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { SELLER_DASHBOARD_PATH, SELLER_ONBOARDING_PATH } from "../utils/sellerNav";

const ShopCreatePage = () => {
  const navigate = useNavigate();
  const { isSeller, seller } = useSelector((state) => state.seller);

  useEffect(() => {
    if (isSeller === true && seller?._id) {
      navigate(SELLER_DASHBOARD_PATH, { replace: true });
    }
  }, [isSeller, seller, navigate]);

  return (
    <>
      <Helmet>
        <title>Sell on Yebone</title>
      </Helmet>
      <Navigate to={SELLER_ONBOARDING_PATH} replace />
    </>
  );
};

export default ShopCreatePage;
