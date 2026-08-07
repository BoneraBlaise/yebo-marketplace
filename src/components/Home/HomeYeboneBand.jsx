import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineSparkles, HiOutlineSearch } from "react-icons/hi";
import { Container, SectionTitle, Badge, Button } from "../ui";
import { AISearch } from "../ai";
import { useAIOptional } from "../ai/core/AIContext";

const HIGHLIGHTS = [
  {
    title: "Virtual Try-On",
    description: "Preview fashion and accessories with AI before you buy.",
    href: "/products",
    cta: "Try it on",
  },
  {
    title: "Smart Recommendations",
    description: "Personalized picks based on your style and browsing history.",
    href: "#discover-products",
    cta: "See picks",
  },
];

const QUICK_PROMPTS = [
  "Summer dresses under RWF 50k",
  "Verified fashion sellers",
  "Gift ideas for her",
];

const HomeYeboneBand = () => {
  const ai = useAIOptional();

  const handleOpenYEBO = (query) => {
    ai?.openPanel?.();
    if (query) ai?.sendMessage?.(query);
  };

  return (
    <section
      id="ai-experience"
      className="home-section home-section--compact home-surface-2"
      aria-label="YEBO Intelligence"
    >
      <Container>
        <div className="text-center mb-8">
          <Badge variant="gold" className="mb-3">
            YEBO Intelligence
          </Badge>
          <SectionTitle
            title="Shop smarter with AI"
            subtitle="Search in plain language, try before you buy, and get picks tailored to you."
            className="mb-0"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start mb-8">
          <AISearch className="lg:sticky lg:top-24" />

          <div className="space-y-4">
            {HIGHLIGHTS.map(({ title, description, href, cta }) => (
              <div
                key={title}
                className="home-surface-card rounded-2xl border border-yebone-primary/10 p-5 md:p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-yebone-primary to-yebone-primary-dark flex items-center justify-center shrink-0">
                    <HiOutlineSparkles className="w-5 h-5 text-white" aria-hidden />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="yebone-section-title text-[var(--home-text)] mb-1">{title}</h3>
                    <p className="text-sm text-[var(--home-text-muted)] leading-relaxed mb-3">
                      {description}
                    </p>
                    <Link
                      to={href}
                      className="text-sm font-semibold text-yebone-primary hover:underline"
                    >
                      {cta} →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t border-[var(--home-border)]">
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="home-tab home-tab--idle text-xs sm:text-sm"
                onClick={() => handleOpenYEBO(prompt)}
              >
                <HiOutlineSearch className="inline mr-1 opacity-60" size={14} aria-hidden />
                {prompt}
              </button>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="md"
            className="home-btn-lift shrink-0"
            onClick={() => handleOpenYEBO()}
          >
            Open YEBO assistant
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default HomeYeboneBand;
