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
  <section id="ai-experience" className="home-section home-section--emphasis home-surface-2">
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
              className="home-surface-card border-yebone-primary/5"
              padding="md"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yebone-primary to-yebone-primary-dark flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-yebone-primary px-2 py-0.5 rounded-md bg-yebone-primary/8 border border-yebone-primary/12">
                {tag}
              </span>
              <h3 className="yebone-section-title mt-1.5 mb-2 text-[var(--home-text)]">
                {title}
              </h3>
              <p className="text-sm text-[var(--home-text-muted)] leading-relaxed">
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
