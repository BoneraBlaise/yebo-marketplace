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
      <div className="marketplace-page yebone-premium-screen min-h-screen dark:bg-gray-950 bg-yebone-light-gray">
        <Container className="py-6 lg:py-10">
          <ShopSkeleton />
        </Container>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="marketplace-page yebone-premium-screen min-h-screen flex items-center justify-center px-4">
        <p className="text-gray-600 dark:text-gray-400">{error || "Shop not found"}</p>
      </div>
    );
  }

  const accent = shop.themeAccent || "#29625d";

  return (
    <div
      className="shop-storefront marketplace-page yebone-premium-screen min-h-screen dark:bg-gray-950 bg-yebone-light-gray"
      style={{ "--shop-accent": accent }}
    >
      <Container className="py-6 lg:py-10 space-y-8">
        <ShopHero
          shop={shop}
          stats={stats}
          followState={followState}
          isOwner={isOwner}
          onFollow={handleFollow}
          onFavorite={handleFavorite}
          onChat={handleChat}
          onShare={handleShare}
          accent={accent}
        />

        <ShopStatsBar stats={stats} shop={shop} />

        {achievements.length > 0 && <ShopAchievements achievements={achievements} />}

        <nav className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-800 pb-3" aria-label="Shop sections">
          {SECTION_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                activeSection === tab.id
                  ? "bg-[var(--shop-accent)] text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => setActiveSection(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {activeSection === "products" && (
          <ShopProductGrid products={products || []} isOwner={isOwner} shopId={id} />
        )}

        {activeSection === "about" && <ShopAboutSection shop={shop} />}

        {activeSection === "reviews" && (
          <Suspense fallback={<div className="shop-skeleton h-48" aria-hidden="true" />}>
            <ShopReviewsSection products={products || []} stats={stats} />
          </Suspense>
        )}

        {activeSection === "gallery" && (
          <Suspense fallback={<div className="shop-skeleton h-48" aria-hidden="true" />}>
            <ShopGallery gallery={shop.gallery || []} />
          </Suspense>
        )}
      </Container>

      {!isOwner && (
        <ShopFloatingActions
          shop={shop}
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
