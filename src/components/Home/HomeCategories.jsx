import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, SectionTitle } from "../ui";
import { HOME_MARKETPLACE_CATEGORIES } from "./homeMarketplaceCategories";
import HomeCategoryCard from "./HomeCategoryCard";
import "./homeCategories.css";

const HomeCategories = () => {
  const navigate = useNavigate();

  return (
    <section className="home-section home-section--compact home-surface-0">
      <Container>
        <SectionTitle
          title="Shop by category"
          subtitle="Phones, fashion, property, mobility, groceries, and more — curated for Yebone."
          align="left"
        />

        <div className="home-cat-grid" role="list" aria-label="Main marketplace categories">
          {HOME_MARKETPLACE_CATEGORIES.map((category) => (
            <div key={category.id} role="listitem">
              <HomeCategoryCard
                title={category.title}
                onClick={() => navigate(category.href)}
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
