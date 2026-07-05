import React from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineSearch,
  HiOutlineSparkles,
  HiOutlineLightBulb,
  HiOutlineUserCircle,
} from "react-icons/hi";
import { Container, SectionTitle, Badge, Card } from "../ui";
import { AISearch } from "../ai";

const AI_FEATURES = [
  {
    icon: HiOutlineSearch,
    title: "AI Search",
    description:
      "Describe what you need in plain language. Our AI finds the perfect match across millions of products.",
    tag: "Smart discovery",
  },
  {
    icon: HiOutlineSparkles,
    title: "Virtual Try-On",
    description:
      "Preview fashion, eyewear, and accessories on yourself before you commit to a purchase.",
    tag: "Visual confidence",
  },
  {
    icon: HiOutlineLightBulb,
    title: "AI Recommendations",
    description:
      "Personalized picks based on your style, browsing history, and trending products in your region.",
    tag: "Tailored for you",
  },
  {
    icon: HiOutlineUserCircle,
    title: "Personal Shopping Assistant",
    description:
      "Get styling advice, compare products, and build complete looks with an AI shopping companion.",
    tag: "Always on",
  },
];

const HomeAIExperience = () => (
  <section id="ai-experience" className="home-section bg-yebone-light-gray dark:bg-gray-900/50">
    <Container>
      <div className="text-center mb-12">
        <Badge variant="gold" className="mb-4">
          Powered by AI
        </Badge>
        <SectionTitle
          title="The future of African e-commerce"
          subtitle="Intelligent tools that make every purchase smarter, faster, and more confident."
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-12">
        <AISearch className="lg:sticky lg:top-28" />

        <div className="grid sm:grid-cols-2 gap-4">
          {AI_FEATURES.map(({ icon: Icon, title, description, tag }) => (
            <Card
              key={title}
              className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-yebone-primary/5"
              padding="md"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yebone-primary to-yebone-primary-dark flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-yebone-primary">
                {tag}
              </span>
              <h3 className="font-Poppins font-semibold text-lg mt-1 mb-2 dark:text-white">
                {title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Link
          to="#ai-picks"
          className="inline-flex items-center gap-2 text-yebone-primary font-semibold hover:underline"
        >
          Explore AI Picks below
          <span aria-hidden>→</span>
        </Link>
      </div>
    </Container>
  </section>
);

export default HomeAIExperience;
