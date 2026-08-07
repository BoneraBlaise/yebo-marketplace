import React from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineShoppingBag,
  HiOutlineHome,
  HiOutlineTruck,
  HiOutlineArrowRight,
} from "react-icons/hi";
import { Container, SectionTitle } from "../ui";
import {
  MOBILITY_CATEGORIES,
  PROPERTY_CATEGORIES,
} from "../PropertyMobility/propertyMobilityHelpers";

const PILLARS = [
  {
    id: "shopping",
    title: "Shopping",
    description: "Fashion, tech, home essentials, and everyday deals from verified sellers.",
    icon: HiOutlineShoppingBag,
    to: "/products",
    cta: "Browse products",
    chips: ["Fashion", "Electronics", "Home", "Beauty"],
    chipTo: (label) => `/products?search=${encodeURIComponent(label)}`,
    theme: "home-hub-card--shopping",
  },
  {
    id: "property",
    title: "Property",
    description: "Apartments, houses, land, and commercial spaces listed across Africa.",
    icon: HiOutlineHome,
    to: "/property-mobility?listingType=property",
    cta: "Explore property",
    chips: PROPERTY_CATEGORIES.slice(0, 4).map((item) => item.label),
    chipTo: (label) => {
      const match = PROPERTY_CATEGORIES.find((item) => item.label === label);
      return match
        ? `/property-mobility?listingType=property&category=${match.value}`
        : "/property-mobility?listingType=property";
    },
    theme: "home-hub-card--property",
  },
  {
    id: "mobility",
    title: "Mobility",
    description: "Cars, motorcycles, trucks, and mobility listings from trusted sellers.",
    icon: HiOutlineTruck,
    to: "/property-mobility?listingType=vehicle",
    cta: "Explore vehicles",
    chips: MOBILITY_CATEGORIES.slice(0, 4).map((item) => item.label),
    chipTo: (label) => {
      const match = MOBILITY_CATEGORIES.find((item) => item.label === label);
      return match
        ? `/property-mobility?listingType=vehicle&category=${match.value}`
        : "/property-mobility?listingType=vehicle";
    },
    theme: "home-hub-card--mobility",
  },
];

const HomeMarketplaceHub = () => (
  <section className="home-section home-section--compact home-surface-0" aria-label="Marketplace hub">
    <Container>
      <SectionTitle
        title="One marketplace, three worlds"
        subtitle="Shop products, find property, and browse vehicles — equally at home on Yebone."
        align="left"
      />

      <div className="home-hub-grid">
        {PILLARS.map(({ id, title, description, icon: Icon, to, cta, chips, chipTo, theme }) => (
          <article key={id} className={`home-hub-card ${theme}`}>
            <div className="home-hub-card__header">
              <div className="home-hub-card__icon" aria-hidden="true">
                <Icon size={22} />
              </div>
              <div>
                <h3 className="home-hub-card__title">{title}</h3>
                <p className="home-hub-card__desc">{description}</p>
              </div>
            </div>

            <div className="home-hub-card__chips">
              {chips.map((label) => (
                <Link key={label} to={chipTo(label)} className="home-hub-card__chip">
                  {label}
                </Link>
              ))}
            </div>

            <Link to={to} className="home-hub-card__cta">
              {cta}
              <HiOutlineArrowRight size={16} aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>
    </Container>
  </section>
);

export default HomeMarketplaceHub;
