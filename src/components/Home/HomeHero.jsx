import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineSparkles,
  HiOutlineShoppingBag,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineShieldCheck,
  HiOutlineTruck,
  HiOutlineRefresh,
  HiOutlineBadgeCheck,
} from "react-icons/hi";
import { Container, Button } from "../ui";
import HeroAIShowcase from "./HeroAIShowcase";
import "./heroPixel.css";

const TRUST_AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&h=80&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80",
];

const HERO_FEATURES = [
  { icon: HiOutlineShieldCheck, title: "Secure Payments", description: "100% secure checkout" },
  { icon: HiOutlineTruck, title: "Fast Delivery", description: "Across Rwanda & beyond" },
  { icon: HiOutlineSparkles, title: "AI Try-On", description: "See before you buy" },
  { icon: HiOutlineRefresh, title: "Easy Returns", description: "Hassle-free returns" },
  { icon: HiOutlineBadgeCheck, title: "Verified Vendors", description: "Trusted & verified shops" },
];

const SLIDES = [{ id: "ai-hero-main" }];

const HomeHero = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const goPrev = () => setActiveSlide((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  const goNext = () => setActiveSlide((i) => (i + 1) % SLIDES.length);

  const slide = useMemo(() => SLIDES[activeSlide], [activeSlide]);

  return (
    <section className="home-hero home-hero--ref" aria-labelledby="home-hero-heading">
      <Container className="home-hero--ref__outer">
        <div className="home-hero--ref__shell home-fade-up">
          <button
            type="button"
            className="home-hero--ref__nav home-hero--ref__nav--prev"
            aria-label="Previous hero slide"
            onClick={goPrev}
          >
            <HiOutlineChevronLeft size={22} aria-hidden />
          </button>

          <div className="home-hero--ref__slide" key={slide.id}>
            <div className="home-hero--ref__main">
              <div className="home-hero--ref__copy">
                <span className="home-hero--ref__badge">
                  <HiOutlineSparkles size={14} aria-hidden />
                  AI Powered Experience
                </span>

                <h1 id="home-hero-heading" className="home-hero--ref__headline">
                  <span className="home-hero--ref__headline-green">Shop Smarter.</span>
                  <br />
                  <span className="home-hero--ref__headline-gold">Try</span>{" "}
                  <span className="home-hero--ref__headline-green">Before You Buy.</span>
                </h1>

                <p className="home-hero--ref__lead">
                  Discover millions of products across Africa with AI-powered virtual try-on.
                </p>

                <div className="home-hero--ref__actions">
                  <Link to="/products">
                    <Button size="lg" className="home-hero--ref__btn home-hero--ref__btn--primary">
                      <HiOutlineShoppingBag size={18} aria-hidden />
                      Shop Now
                    </Button>
                  </Link>
                  <Link to="/ai-experience">
                    <Button
                      variant="outline"
                      size="lg"
                      className="home-hero--ref__btn home-hero--ref__btn--secondary"
                    >
                      <HiOutlineSparkles size={18} aria-hidden />
                      Try AI Now
                    </Button>
                  </Link>
                </div>

                <div className="home-hero--ref__trust" aria-label="Customer rating">
                  <div className="home-hero--ref__avatars" aria-hidden>
                    {TRUST_AVATARS.map((src) => (
                      <img key={src} src={src} alt="" className="home-hero--ref__avatar" loading="lazy" />
                    ))}
                  </div>
                  <div className="home-hero--ref__trust-meta">
                    <div className="home-hero--ref__trust-row">
                      <span className="home-hero--ref__trust-stars" aria-hidden>
                        ★
                      </span>
                      <span className="home-hero--ref__trust-score">4.9/5</span>
                    </div>
                    <p className="home-hero--ref__trust-copy">
                      Trusted by 50,000+ customers across Africa
                    </p>
                  </div>
                </div>
              </div>

              <HeroAIShowcase className="home-hero--ref__visual" />
            </div>

            <div className="home-hero--ref__dots" role="tablist" aria-label="Hero slides">
              {SLIDES.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={index === activeSlide}
                  aria-label={`Slide ${index + 1}`}
                  className={`home-hero--ref__dot${index === activeSlide ? " home-hero--ref__dot--active" : ""}`}
                  onClick={() => setActiveSlide(index)}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            className="home-hero--ref__nav home-hero--ref__nav--next"
            aria-label="Next hero slide"
            onClick={goNext}
          >
            <HiOutlineChevronRight size={22} aria-hidden />
          </button>

          <div className="home-hero--ref__features">
            {HERO_FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="home-hero--ref__feature">
                <div className="home-hero--ref__feature-icon">
                  <Icon size={22} aria-hidden />
                </div>
                <div>
                  <p className="home-hero--ref__feature-title">{title}</p>
                  <p className="home-hero--ref__feature-desc">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HomeHero;
