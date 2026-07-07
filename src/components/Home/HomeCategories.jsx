import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { categoriesData } from "../../static/data";
import { Container, SectionTitle } from "../ui";
import { typography } from "../../design-system/typography";
import CategoryImage from "./CategoryImage";
import { HOME_MARKETPLACE_CATEGORIES } from "./homeMarketplaceCategories";
import { MarketplaceCardGrid, MarketplaceCardSlot } from "../Marketplace/cards";

const HomeCategories = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const allSubcategories = categoriesData.reduce(
    (acc, category) => acc.concat(category.subcategories || []),
    []
  );

  const handleCuratedClick = (item) => {
    navigate(`/products?search=${encodeURIComponent(item.query)}`);
  };

  const handleSubcategoryClick = (subcategory) => {
    navigate(`/products?category=${encodeURIComponent(subcategory.title)}`);
    setModalOpen(false);
  };

  return (
    <section className="home-section home-surface-0">
      <Container>
        <SectionTitle
          title="Shop by category"
          subtitle="Fashion, lifestyle, tech, home, and more — everything in one marketplace on Yebone."
          align="left"
        />

        <MarketplaceCardGrid>
          {HOME_MARKETPLACE_CATEGORIES.map((category) => (
            <MarketplaceCardSlot key={category.id}>
              <button
                type="button"
                onClick={() => handleCuratedClick(category)}
                className="mpc-category-card home-card-lift group w-full"
              >
                <div className="mpc-category-card__media">
                  <CategoryImage src={null} title={category.title} />
                </div>
                <div className="mpc-category-card__body">
                  <h3
                    className={`${typography.subheading} text-xs sm:text-sm group-hover:text-yebone-primary transition line-clamp-2`}
                  >
                    {category.title}
                  </h3>
                </div>
              </button>
            </MarketplaceCardSlot>
          ))}
        </MarketplaceCardGrid>

        <div className="text-center mt-10">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="home-btn-lift home-btn-outline"
          >
            View All Categories
          </button>
        </div>

        {modalOpen && (
          <div
            className="fixed inset-0 z-[100] home-modal-overlay flex items-center justify-center p-4 home-fade-up"
            onClick={() => setModalOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="All categories"
          >
            <div
              className="home-modal-panel rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl hide-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-Poppins text-xl font-semibold mb-6 text-[var(--home-text)]">
                All categories on Yebone
              </h3>
              <MarketplaceCardGrid>
                {allSubcategories.map((subcategory) => (
                  <MarketplaceCardSlot key={subcategory.id}>
                    <button
                      type="button"
                      onClick={() => handleSubcategoryClick(subcategory)}
                      className="mpc-category-card home-card-lift group w-full"
                    >
                      <div className="mpc-category-card__media">
                        <CategoryImage
                          src={subcategory.image_Url}
                          title={subcategory.title}
                        />
                      </div>
                      <p className="mpc-category-card__body text-sm font-medium text-[var(--home-text)] group-hover:text-yebone-primary transition">
                        {subcategory.title}
                      </p>
                    </button>
                  </MarketplaceCardSlot>
                ))}
              </MarketplaceCardGrid>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
};

export default HomeCategories;
