import React, { lazy, Suspense, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Container } from "../../ui";
import useShopStorefront from "../../../hooks/useShopStorefront";
import ShopSkeleton from "./ShopSkeleton";
import ShopHero from "./ShopHero";
import ShopStatsBar from "./ShopStatsBar";
import ShopAchievements from "./ShopAchievements";
import ShopAboutSection from "./ShopAboutSection";
import ShopProductGrid from "./ShopProductGrid";
import ShopFloatingActions from "./ShopFloatingActions";
import "./shopStorefront.css";

const ShopReviewsSection = lazy(() => import("./ShopReviewsSection"));
const ShopGallery = lazy(() => import("./ShopGallery"));

const SECTION_TABS = [
  { id: "products", label: "Products" },
  { id: "about", label: "About" },
  { id: "reviews", label: "Reviews" },
  { id: "gallery", label: "Gallery" },
];

const ShopStorefront = ({ isOwner = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("products");
  const {
    shop,
    stats,
    achievements,
    followState,
    products,
    loading,
    error,
    isAuthenticated,
    toggleFollow,
    toggleFavorite,
  } = useShopStorefront(id);

  const [businessStatus, setBusinessStatus] = useState(null);

  const displayShop = shop
    ? { ...shop, businessStatus: businessStatus ?? shop.businessStatus }
    : null;

  const requireAuth = () => {
    toast.info("Please sign in to continue");
    navigate("/login", { state: { from: window.location.pathname } });
  };

  const handleFollow = async () => {
    try {
      const result = await toggleFollow();
      if (result?.needsAuth) return requireAuth();
      toast.success(result.following ? "You are now following this shop" : "Unfollowed shop");
    } catch {
      toast.error("Unable to update follow status");
    }
  };

  const handleFavorite = async () => {
    try {
      const result = await toggleFavorite();
      if (result?.needsAuth) return requireAuth();
      toast.success(result.favorited ? "Shop added to favorites" : "Removed from favorites");
    } catch {
      toast.error("Unable to update favorites");
    }
  };

  const handleChat = () => {
    if (!isAuthenticated) return requireAuth();
    navigate("/profile", { state: { active: 8 } });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: shop?.name, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      toast.success("Link copied");
    }
  };

  if (loading) {
    return (
      <div className="shop-storefront marketplace-page yebone-premium-screen min-h-screen dark:bg-gray-950 bg-yebone-light-gray">
        <Container className="py-6 lg:py-8">
          <ShopSkeleton />
        </Container>
      </div>
    );
  }

  if (error || !displayShop) {
    return (
      <div className="marketplace-page yebone-premium-screen min-h-screen flex items-center justify-center px-4">
        <p className="text-gray-600 dark:text-gray-400">{error || "Shop not found"}</p>
      </div>
    );
  }

  const accent = displayShop.themeAccent || "#29625d";

  return (
    <div
      className="shop-storefront marketplace-page yebone-premium-screen min-h-screen dark:bg-gray-950 bg-yebone-light-gray"
      style={{ "--shop-accent": accent }}
    >
      <Container className="py-6 lg:py-8">
        <div className="shop-main">
          <ShopHero
            shop={displayShop}
            isOwner={isOwner}
            followState={followState}
            onFollow={handleFollow}
            onFavorite={handleFavorite}
            onChat={handleChat}
            onShare={handleShare}
            onStatusChange={setBusinessStatus}
            accent={accent}
          />

          <ShopStatsBar stats={stats} shop={displayShop} products={products || []} />

          {achievements.length > 0 && <ShopAchievements achievements={achievements} />}

          <nav className="shop-section-tabs" aria-label="Shop sections">
            {SECTION_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeSection === tab.id}
                className={`shop-section-tab ${activeSection === tab.id ? "is-active" : ""}`}
                onClick={() => setActiveSection(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div role="tabpanel" aria-label={SECTION_TABS.find((t) => t.id === activeSection)?.label}>
            {activeSection === "products" && (
              <ShopProductGrid products={products || []} isOwner={isOwner} shopId={id} />
            )}

            {activeSection === "about" && <ShopAboutSection shop={displayShop} />}

            {activeSection === "reviews" && (
              <Suspense fallback={<div className="shop-skeleton h-40" aria-hidden="true" aria-label="Loading reviews" />}>
                <ShopReviewsSection products={products || []} stats={stats} />
              </Suspense>
            )}

            {activeSection === "gallery" && (
              <Suspense fallback={<div className="shop-skeleton h-40" aria-hidden="true" aria-label="Loading gallery" />}>
                <ShopGallery gallery={displayShop.gallery || []} />
              </Suspense>
            )}
          </div>
        </div>
      </Container>

      {!isOwner && (
        <ShopFloatingActions
          shop={displayShop}
          followState={followState}
          onChat={handleChat}
          onFollow={handleFollow}
          onFavorite={handleFavorite}
          onShare={handleShare}
        />
      )}
    </div>
  );
};

export default ShopStorefront;
