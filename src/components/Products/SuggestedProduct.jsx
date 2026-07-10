import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container, SectionTitle, Button } from "../ui";
import HomeProductCard from "../Home/HomeProductCard";

const SuggestedProduct = ({ data }) => {
  const { allProducts } = useSelector((state) => state.products);
  const [productData, setProductData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);

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
    <section className="pdp-section bg-yebone-light-gray/50 dark:bg-gray-950">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <SectionTitle
            title="Related products"
            subtitle={`More ${data.category || "items"} you may like on Yebone.`}
            align="left"
            className="mb-0"
          />
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link to={`/products?category=${encodeURIComponent(data.category || "")}`}>
              <Button variant="outline" size="sm" className="yebone-btn-lift">
                Browse more
              </Button>
            </Link>
            <Link to="/products">
              <Button size="sm" className="yebone-btn-lift">
                View all products
              </Button>
            </Link>
          </div>
        </div>

        <div className="marketplace-product-grid mpc-grid--page yebone-fade-up">
          {productData.slice(0, visibleCount).map((product) => (
            <div key={product._id} className="mpc-card-slot mpc-card-slot--centered">
                <HomeProductCard data={product} compact fluid />
            </div>
          ))}
        </div>

        {productData.length > visibleCount && (
          <div className="text-center mt-10">
            <Button
              variant="outline"
              onClick={() => setVisibleCount((c) => c + 4)}
              className="yebone-btn-lift"
            >
              Load more
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
};

export default SuggestedProduct;
