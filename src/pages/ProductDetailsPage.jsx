import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useLocation } from "react-router-dom";
import ProductDetails from "../components/Products/ProductDetails";
import SuggestedProduct from "../components/Products/SuggestedProduct";
import { useSelector } from "react-redux";
import { getProductById } from "../redux/actions/product";
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
  const location = useLocation();
  const previewProduct = location.state?.product;
  const [data, setData] = useState(null);
  const [searchParams] = useSearchParams();
  const eventData = searchParams.get("isEvent");
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const resolveProduct = async () => {
      setIsLoading(true);
      setNotFound(false);

      if (eventData !== null) {
        const found = allEvents && allEvents.find((item) => item._id === id);
        if (cancelled) return;
        setData(found || null);
        if (allEvents?.length && !found) setNotFound(true);
        setIsLoading(false);
        return;
      }

      const listProduct = allProducts && allProducts.find((item) => item._id === id);
      const candidate = previewProduct?._id === id ? previewProduct : listProduct;

      if (candidate?.hasVariants) {
        const result = await getProductById(id)();
        if (cancelled) return;
        if (result?.success && result.product) {
          setData(result.product);
        } else {
          setData(candidate);
          if (!candidate) setNotFound(true);
        }
        setIsLoading(false);
        return;
      }

      if (candidate) {
        setData(candidate);
        setIsLoading(false);
        return;
      }

      if (allProducts?.length) {
        const result = await getProductById(id)();
        if (cancelled) return;
        if (result?.success && result.product) {
          setData(result.product);
        } else {
          setNotFound(true);
          setData(null);
        }
        setIsLoading(false);
        return;
      }

      if (cancelled) return;
      setData(null);
      setIsLoading(true);
    };

    resolveProduct();

    return () => {
      cancelled = true;
    };
  }, [allProducts, allEvents, id, eventData, previewProduct]);

  const metaTitle = data?.name || (notFound ? "Product not found" : "Product");
  const metaDescription =
    data?.description?.replace(/<[^>]+>/g, "").slice(0, 160) ||
    "View product details on Yebone marketplace.";

  return (
    <div className="yebone-premium-screen pdp-page-shell min-h-screen flex flex-col">
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
