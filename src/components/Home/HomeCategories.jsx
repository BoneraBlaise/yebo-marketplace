import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, SectionTitle } from "../ui";
import { HOME_MARKETPLACE_CATEGORIES } from "./homeMarketplaceCategories";
import { buildMainCategoryUrl } from "./mainCategoryHierarchy";
import HomeCategoryCard from "./HomeCategoryCard";
import "./homeCategories.css";

const HomeCategories = () => {
  const navigate = useNavigate();

  const handleMainCategoryClick = (category) => {
    navigate(buildMainCategoryUrl(category.title));
  };

  return (
    <section className="home-section home-surface-0">
      <Container>
        <SectionTitle
          title="Shop by category"
          subtitle="Browse main categories — fashion, tech, home, groceries, and more on Yebone."
          align="left"
        />

        <div className="home-cat-grid" role="list" aria-label="Main marketplace categories">
          {HOME_MARKETPLACE_CATEGORIES.map((category) => (
            <div key={category.id} role="listitem">
              <HomeCategoryCard
                title={category.title}
                onClick={() => handleMainCategoryClick(category)}
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/products" className="home-btn-lift home-btn-outline inline-flex">
            Browse full marketplace
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default HomeCategories;
