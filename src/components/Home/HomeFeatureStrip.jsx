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
  <section className="home-section border-y border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
    <Container className="py-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="flex items-center gap-3 p-3 lg:p-4 rounded-2xl hover:bg-yebone-light-gray dark:hover:bg-gray-900 transition group"
          >
            <div className="w-11 h-11 rounded-xl bg-yebone-primary/10 flex items-center justify-center shrink-0 group-hover:bg-yebone-primary group-hover:text-white transition">
              <Icon className="w-5 h-5 text-yebone-primary group-hover:text-white" />
            </div>
            <div>
              <p className="font-Poppins font-semibold text-sm text-yebone-dark-text dark:text-white">
                {title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

export default HomeFeatureStrip;
