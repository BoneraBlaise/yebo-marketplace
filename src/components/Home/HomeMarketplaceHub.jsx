import React from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineShoppingBag,
  HiOutlineHome,
  HiOutlineTruck,
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
    description: "Products, fashion, tech, groceries, and everyday marketplace deals.",
    icon: HiOutlineShoppingBag,
    to: "/products",
    accent: "from-yebone-primary to-yebone-primary-dark",
  },
  {
    id: "property",
    title: "Property & Real Estate",
    description: "Apartments, houses, land, and commercial property across Africa.",
    icon: HiOutlineHome,
    to: "/property-mobility?listingType=property",
    accent: "from-emerald-600 to-teal-700",
  },
  {
    id: "mobility",
    title: "Vehicles & Mobility",
    description: "Cars, motorcycles, trucks, and verified mobility listings.",
    icon: HiOutlineTruck,
    to: "/property-mobility?listingType=vehicle",
    accent: "from-blue-600 to-indigo-700",
  },
];

const HomeMarketplaceHub = () => (
  <section className="home-section home-surface-0">
    <Container>
      <SectionTitle
        title="Everything in one marketplace"
        subtitle="Shop products, browse real estate, and explore vehicles — all on Yebone with one account."
        align="left"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {PILLARS.map(({ id, title, description, icon: Icon, to, accent }) => (
          <article
            key={id}
            className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition"
          >
            <div className={`inline-flex w-12 h-12 rounded-xl items-center justify-center text-white bg-gradient-to-br ${accent}`}>
              <Icon size={24} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">{description}</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-auto">
              {id === "shopping" ? (
                <Link to="/products" className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200">
                  Browse products
                </Link>
              ) : null}
              {id === "property"
                ? PROPERTY_CATEGORIES.map((item) => (
                    <Link
                      key={item.value}
                      to={`/property-mobility?listingType=property&category=${item.value}`}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200"
                    >
                      {item.label}
                    </Link>
                  ))
                : null}
              {id === "mobility"
                ? MOBILITY_CATEGORIES.map((item) => (
                    <Link
                      key={item.value}
                      to={`/property-mobility?listingType=vehicle&category=${item.value}`}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200"
                    >
                      {item.label}
                    </Link>
                  ))
                : null}
            </div>
            <Link to={to} className="text-sm font-semibold text-yebone-primary hover:underline">
              Explore {id === "shopping" ? "shopping" : id === "property" ? "property" : "mobility"} →
            </Link>
          </article>
        ))}
      </div>
    </Container>
  </section>
);

export default HomeMarketplaceHub;
