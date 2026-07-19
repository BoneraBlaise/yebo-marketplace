import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container } from "../ui";
import HomeProductCard from "./HomeProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { fetchGrowthCommerceAvailability, fetchPublicHomepage } from "../../services/growthCommerceService";

const SECTION_ORDER = [
  "heroBanner",
  "campaignBanner",
  "flashSaleSection",
  "featuredProducts",
  "trendingProducts",
  "newArrivals",
  "bestSellers",
  "topVendors",
];

const HomeGrowthCommerce = () => {
  const { products } = useSelector((state) => state.products);
  const [homepage, setHomepage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadHomepage = async () => {
      try {
        const availability = await fetchGrowthCommerceAvailability();
        if (!availability.available || availability.disabled) {
          if (mounted) setHomepage(null);
          return;
        }

        const data = await fetchPublicHomepage();
        if (mounted) setHomepage(data);
      } catch (_error) {
        if (mounted) setHomepage(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadHomepage();
    return () => {
      mounted = false;
    };
  }, []);

  const productPool = useMemo(() => products || [], [products]);

  const resolveProducts = (section) => {
    if (!section?.enabled) return [];
    if (section.productIds?.length) {
      return productPool.filter((product) => section.productIds.includes(String(product._id)));
    }
    if (section.campaign?.targetProducts?.length) {
      return productPool.filter((product) =>
        section.campaign.targetProducts.includes(String(product._id))
      );
    }
    const limit = section.limit || 8;
    return productPool.slice(0, limit);
  };

  if (loading) {
    return (
      <div className="home-section home-section-enter">
        <Container>
          <ProductCardSkeleton count={4} />
        </Container>
      </div>
    );
  }

  if (!homepage?.sections) return null;

  return (
    <>
      {SECTION_ORDER.map((sectionKey) => {
        const section = homepage.sections[sectionKey];
        if (!section?.enabled) return null;

        if (sectionKey === "heroBanner") {
          return (
            <section key={sectionKey} className="home-section home-section-enter">
              <Container>
                <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-yebone-primary/90 to-yebone-primary p-6 md:p-10 text-white">
                  <p className="text-sm uppercase tracking-wider opacity-90">Campaign spotlight</p>
                  <h2 className="text-2xl md:text-4xl font-semibold mt-2">
                    {section.title || section.campaign?.name || "Shop the latest deals"}
                  </h2>
                  {section.subtitle && <p className="mt-3 max-w-2xl opacity-90">{section.subtitle}</p>}
                  <Link
                    to={section.ctaLink || "/products"}
                    className="inline-flex mt-5 px-5 py-3 rounded-xl bg-white text-yebone-primary font-medium"
                  >
                    Shop now
                  </Link>
                </div>
              </Container>
            </section>
          );
        }

        if (sectionKey === "campaignBanner" && section.campaign) {
          return (
            <section key={sectionKey} className="home-section home-section-enter">
              <Container>
                <div className="yebone-surface rounded-2xl p-5 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-yebone-primary">Active campaign</p>
                    <h3 className="text-xl md:text-2xl font-semibold dark:text-white mt-1">
                      {section.title || section.campaign.name}
                    </h3>
                  </div>
                  <Link to="/products" className="yebone-btn-primary yebone-btn-lift">
                    View deals
                  </Link>
                </div>
              </Container>
            </section>
          );
        }

        const sectionProducts = resolveProducts(section);
        if (sectionProducts.length === 0 && sectionKey !== "topVendors") return null;

        const titles = {
          flashSaleSection: "Flash Sale",
          featuredProducts: "Featured Products",
          trendingProducts: "Trending Products",
          newArrivals: "New Arrivals",
          bestSellers: "Best Sellers",
          topVendors: "Top Vendors",
        };

        if (sectionKey === "topVendors") {
          return (
            <section key={sectionKey} className="home-section home-section-enter">
              <Container>
                <h3 className="text-xl font-semibold dark:text-white mb-4">{titles[sectionKey]}</h3>
                <p className="text-sm text-gray-500">
                  Discover trusted sellers driving marketplace growth this week.
                </p>
              </Container>
            </section>
          );
        }

        return (
          <section key={sectionKey} className="home-section home-section-enter">
            <Container>
              <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="text-xl font-semibold dark:text-white">{titles[sectionKey]}</h3>
                {section.campaign?.discountValue ? (
                  <span className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700">
                    Up to {section.campaign.discountValue}
                    {section.campaign.discountType === "percentage" ? "%" : ""} off
                  </span>
                ) : null}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {sectionProducts.map((product) => (
                  <HomeProductCard key={`${sectionKey}-${product._id}`} data={product} compact />
                ))}
              </div>
            </Container>
          </section>
        );
      })}
    </>
  );
};

export default HomeGrowthCommerce;
