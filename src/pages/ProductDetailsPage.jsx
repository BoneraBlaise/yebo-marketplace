import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ProductDetails from "../components/Products/ProductDetails";
import SuggestedProduct from "../components/Products/SuggestedProduct";
import { useSelector } from "react-redux";
import { Container, PageMeta, ErrorState } from "../components/ui";
import "../components/Products/product-details.css";

const GallerySkeleton = () => (
  <Container className="py-8">
    <div className="grid lg:grid-cols-2 gap-10 animate-pulse">
      <div className="aspect-square rounded-3xl pdp-skeleton" />
      <div className="space-y-4">
        <div className="h-6 w-3/4 rounded-lg pdp-skeleton" />
        <div className="h-4 w-1/2 rounded-lg pdp-skeleton" />
        <div className="h-24 rounded-2xl pdp-skeleton" />
        <div className="h-12 rounded-xl pdp-skeleton" />
        <div className="h-12 rounded-xl pdp-skeleton" />
      </div>
    </div>
  </Container>
);

const ProductDetailsPage = () => {
  const { allProducts } = useSelector((state) => state.products);
  const { allEvents } = useSelector((state) => state.events);
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [searchParams] = useSearchParams();
  const eventData = searchParams.get("isEvent");
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setNotFound(false);
    if (eventData !== null) {
      const found = allEvents && allEvents.find((i) => i._id === id);
      setData(found || null);
      if (allEvents?.length && !found) setNotFound(true);
    } else {
      const found = allProducts && allProducts.find((i) => i._id === id);
      setData(found || null);
      if (allProducts?.length && !found) setNotFound(true);
    }
  }, [allProducts, allEvents, id, eventData]);

  useEffect(() => {
    if (data !== null || notFound) {
      setIsLoading(false);
    }
  }, [data, notFound]);

  const metaTitle = data?.name || (notFound ? "Product not found" : "Product");
  const metaDescription =
    data?.description?.replace(/<[^>]+>/g, "").slice(0, 160) ||
    "View product details on Yebone marketplace.";

  return (
    <div className="yebone-premium-screen bg-yebone-light-gray dark:bg-gray-950 min-h-screen flex flex-col">
      <PageMeta
        title={metaTitle}
        description={metaDescription}
        ogType="product"
        ogImage={data?.images?.[0]?.url || "/favicon.svg"}
        noIndex={notFound}
        jsonLd={
          data
            ? {
                "@context": "https://schema.org",
                "@type": "Product",
                name: data.name,
                description: metaDescription,
                image: data.images?.[0]?.url,
                offers: {
                  "@type": "Offer",
                  price: data.discountPrice || data.originalPrice,
                  priceCurrency: "RWF",
                },
              }
            : undefined
        }
      />
      <main id="main-content" className="flex-1">
        {isLoading ? (
          <GallerySkeleton />
        ) : notFound ? (
          <Container>
            <ErrorState variant="404" title="Product not found" message="This product may have been removed or is unavailable." />
          </Container>
        ) : (
          <>
            <ProductDetails data={data} />
            {!eventData && data && <SuggestedProduct data={data} />}
          </>
        )}
      </main>

    </div>
  );
};

export default ProductDetailsPage;
