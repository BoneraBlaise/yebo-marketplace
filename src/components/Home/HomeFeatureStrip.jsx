import React from "react";
import {
  HiOutlineShieldCheck,
  HiOutlineTruck,
  HiOutlineSparkles,
  HiOutlineRefresh,
  HiOutlineBadgeCheck,
} from "react-icons/hi";
import { Container } from "../ui";

const FEATURES = [
  {
    icon: HiOutlineShieldCheck,
    title: "Secure Payments",
    description: "100% protected checkout",
  },
  {
    icon: HiOutlineTruck,
    title: "Fast Delivery",
    description: "Across Africa",
  },
  {
    icon: HiOutlineSparkles,
    title: "AI Try-On",
    description: "See before you buy",
  },
  {
    icon: HiOutlineRefresh,
    title: "Easy Returns",
    description: "Hassle-free policy",
  },
  {
    icon: HiOutlineBadgeCheck,
    title: "Verified Vendors",
    description: "Trusted sellers only",
  },
];

const HomeFeatureStrip = () => (
  <section className="home-section home-section--tight home-feature-strip">
    <Container className="py-6 lg:py-7">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <div key={title} className="home-feature-item flex items-center gap-3 p-3 lg:p-4 group">
            <div className="home-feature-item__icon">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="home-feature-item__title">{title}</p>
              <p className="home-feature-item__desc">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

export default HomeFeatureStrip;
