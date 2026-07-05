import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineSparkles } from "react-icons/hi";
import { Container, Button } from "../ui";
import { typography } from "../../design-system/typography";
import HeroAIShowcase from "./HeroAIShowcase";

const HomeHero = () => (
  <section className="relative overflow-hidden bg-[#0a1211] text-white">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-yebone-primary/25 blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-yebone-gold/15 blur-[100px]" />
    </div>

    <Container className="relative py-16 lg:py-24 xl:py-28">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="home-fade-up max-w-xl z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yebone-gold/20 text-yebone-gold text-xs font-semibold uppercase tracking-wider mb-6 border border-yebone-gold/30">
            <HiOutlineSparkles size={14} />
            Africa&apos;s AI-powered shopping platform
          </span>

          <h1 className={`${typography.hero} text-white leading-[1.05] mb-6`}>
            Shop Smarter.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yebone-gold to-emerald-300">
              Try Before You Buy.
            </span>
          </h1>

          <p className="text-lg text-gray-400 mb-4 leading-relaxed max-w-md">
            Discover millions of products across Africa with AI-powered virtual try-on.
          </p>
          <p className="text-sm text-yebone-gold/90 font-medium mb-8">
            Yebone. Everything in one place.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/products">
              <Button size="lg" className="home-btn-lift">Start Shopping</Button>
            </Link>
            <Link to="#ai-experience">
              <Button
                variant="outline"
                size="lg"
                className="home-btn-lift border-white/30 text-white hover:bg-white hover:text-yebone-primary-dark"
              >
                Try AI Now
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/10">
            {[
              { value: "AI", label: "Virtual Try-On" },
              { value: "Fashion", label: "First" },
              { value: "100%", label: "Confidence" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-Poppins text-2xl font-bold text-yebone-gold">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500">{stat.label}</p>
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
