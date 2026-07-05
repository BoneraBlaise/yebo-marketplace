import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ShopCreate from "../components/Shop/ShopCreate";
import { Helmet } from 'react-helmet';
const ShopCreatePage = () => {
  const navigate = useNavigate();
  const { isSeller, seller } = useSelector((state) => state.seller);

  useEffect(() => {
    if (isSeller === true) {
      navigate(`/shop/${seller._id}`);
    }
  }, [])
  return (
    <div>
      <Helmet>
        <title>Sell on Yebone</title>
        <meta name="description" content="Become a seller on Yebone and reach thousands of potential buyers. Start selling today!" />
        <meta property="og:title" content="Sell on Yebone" />
        <meta property="og:description" content="Start your own online store with Yebone. List your products and start making sales now." />
      </Helmet>
      <ShopCreate />
    </div>
  )
}

export default ShopCreatePage