import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import ProductDetails from "../components/Products/ProductDetails";
import SuggestedProduct from "../components/Products/SuggestedProduct";
import { useSelector } from "react-redux";

const spinnerStyle = {
  border: '8px solid #f3f3f3',
  borderTop: '8px solid #29625d',
  borderRadius: '50%',
  width: '50px',
  height: '50px',
  animation: 'spin 1s linear infinite',
  margin: 'auto',
};

const ProductDetailsPage = () => {
  const { allProducts } = useSelector((state) => state.products);
  const { allEvents } = useSelector((state) => state.events);
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [searchParams] = useSearchParams();
  const eventData = searchParams.get("isEvent");
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    setIsLoading(true); 
    if (eventData !== null) {
      const data = allEvents && allEvents.find((i) => i._id === id);
      setData(data);
    } else {
      const data = allProducts && allProducts.find((i) => i._id === id);
      setData(data);
    }
  }, [allProducts, allEvents, id, eventData]);
  useEffect(() => {
    if (data !== null) {
      setIsLoading(false); 
    }
  }, [data]);

  return (
    <div>
      <Header />

      {/* Show custom loading spinner while data is being fetched */}
      {isLoading ? (
        <div className="flex justify-center items-center h-[80vh]">
        <div style={spinnerStyle}></div> {/* Inline style for the spinner */}
        </div>
      ) : (
        <>
          {/* Once data is loaded, show the product details */}
          <ProductDetails data={data} />

          {!eventData && data && (
            <SuggestedProduct data={data} />
          )}
        </>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
