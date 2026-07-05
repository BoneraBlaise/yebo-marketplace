import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { categoriesData } from "../../static/data";
import { Container, SectionTitle } from "../ui";
import { typography } from "../../design-system/typography";
import CategoryImage from "./CategoryImage";
import { HOME_MARKETPLACE_CATEGORIES } from "./homeMarketplaceCategories";

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
    <section className="home-section">
      <Container>
        <SectionTitle
          title="Shop by category"
          subtitle="Fashion, lifestyle, tech, home, and more — everything in one marketplace on Yebone."
          align="left"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-5">
          {HOME_MARKETPLACE_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCuratedClick(category)}
              className="home-card-lift group text-left rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
            >
              <div className="aspect-square overflow-hidden p-3 sm:p-4 bg-yebone-light-gray/50 dark:bg-gray-800/50">
                <CategoryImage src={null} title={category.title} />
              </div>
              <div className="px-3 py-3 sm:px-4 sm:py-4">
                <h3
                  className={`${typography.subheading} text-xs sm:text-sm group-hover:text-yebone-primary transition line-clamp-2`}
                >
                  {category.title}
                </h3>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="home-btn-lift inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-yebone-primary text-yebone-primary font-semibold hover:bg-yebone-primary hover:text-white transition"
          >
            View All Categories
          </button>
        </div>

        {modalOpen && (
          <div
            className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 home-fade-up"
            onClick={() => setModalOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="All categories"
          >
            <div
              className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl hide-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-Poppins text-xl font-semibold mb-6 dark:text-white">
                All categories on Yebone
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {allSubcategories.map((subcategory) => (
                  <button
                    key={subcategory.id}
                    type="button"
                    onClick={() => handleSubcategoryClick(subcategory)}
                    className="home-card-lift group rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 text-left"
                  >
                    <div className="aspect-square p-3 bg-yebone-light-gray/50 dark:bg-gray-800/50">
                      <CategoryImage
                        src={subcategory.image_Url}
                        title={subcategory.title}
                      />
                    </div>
                    <p className="p-3 text-sm font-medium dark:text-white group-hover:text-yebone-primary transition">
                      {subcategory.title}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
};

export default HomeCategories;
