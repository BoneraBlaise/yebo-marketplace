import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Container } from "../ui";
import HomeProductCard from "../Home/HomeProductCard";

const SuggestedProduct = ({ data }) => {
  const { allProducts } = useSelector((state) => state.products);
  const [productData, setProductData] = useState([]);

  const checkNameSimilarity = (product, referenceProduct) => {
    const referenceNameSubstring = referenceProduct.name.slice(0, 5).toLowerCase();
    return (
      product.name.toLowerCase().includes(referenceNameSubstring) &&
      product.category === referenceProduct.category
    );
  };

  useEffect(() => {
    if (data && allProducts) {
      const filteredProducts = allProducts.filter(
        (product) => product.category === data.category && product._id !== data._id
      );

      const similarProducts = filteredProducts.filter((product) =>
        checkNameSimilarity(product, data)
      );

      if (similarProducts.length === 0) {
        setProductData(filteredProducts.slice(0, 8));
      } else {
        setProductData(similarProducts.slice(0, 8));
      }
    }
  }, [data, allProducts]);

  if (!data || !productData.length) return null;

  return (
    <section className="pdp-recommendations" aria-label="You may also like">
      <Container>
        <h2 className="pdp-recommendations__title">You may also like</h2>
        <div className="marketplace-product-grid mpc-grid--page mpc-grid--pdp-dense">
          {productData.slice(0, 8).map((product) => (
            <div key={product._id} className="mpc-card-slot">
              <HomeProductCard data={product} compact dense fluid />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default SuggestedProduct;
