import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineSparkles } from "react-icons/hi";
import { Container, Button } from "../ui";
import { typography } from "../../design-system/typography";
import HeroAIShowcase from "./HeroAIShowcase";

const HomeHero = () => (
  <section className="home-hero">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-yebone-primary/15 dark:bg-yebone-primary/25 blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-yebone-gold/10 dark:bg-yebone-gold/15 blur-[100px]" />
    </div>

    <Container className="relative py-16 lg:py-24 xl:py-28">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="home-fade-up max-w-xl z-10">
          <span className="home-hero__badge mb-6">
            <HiOutlineSparkles size={14} />
            Africa&apos;s AI-powered shopping platform
          </span>

          <h1 className={`${typography.hero} home-hero__headline leading-[1.05] mb-6`}>
            Shop Smarter.
            <br />
            <span className="home-hero__gradient-text">Try Before You Buy.</span>
          </h1>

          <p className="home-hero__lead mb-4 max-w-md">
            Discover millions of products across Africa with AI-powered virtual try-on.
          </p>
          <p className="home-hero__tagline mb-8">Yebone. Everything in one place.</p>

          <div className="flex flex-wrap gap-4">
            <Link to="/products">
              <Button size="lg" className="home-btn-lift">Start Shopping</Button>
            </Link>
            <Link to="#ai-experience">
              <Button variant="outline" size="lg" className="home-btn-lift home-hero__outline-btn">
                Try AI Now
              </Button>
            </Link>
          </div>

          <div className="home-hero__stats flex flex-wrap gap-8 mt-12 pt-8">
            {[
              { value: "AI", label: "Virtual Try-On" },
              { value: "Fashion", label: "First" },
              { value: "100%", label: "Confidence" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="home-hero__stat-value">{stat.value}</p>
                <p className="home-hero__stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <HeroAIShowcase />
      </div>
    </Container>
  </section>
);

export default HomeHero;
