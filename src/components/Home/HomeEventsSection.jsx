import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineSparkles } from "react-icons/hi";
import Events from "../Events/Events";
import { Container, SectionTitle, Button } from "../ui";

const MARKETPLACE_EVENTS = [
  "Fashion Week",
  "Shopping Festival",
  "Vendor Showcase",
  "Tech Expo",
  "Creator Festival",
  "Product Launch",
];

const HomeEventsSection = ({ isMobile }) => (
  <section className="home-section bg-white dark:bg-gray-950">
    <Container>
      <SectionTitle
        title="Marketplace events"
        subtitle="Fashion weeks, vendor showcases, and shopping festivals across the Yebone ecosystem."
        align="left"
        className="mb-6"
      />

      <div className="relative overflow-hidden rounded-2xl mb-8 min-h-[180px] bg-[#0a1211] border border-gray-100 dark:border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-r from-yebone-primary/25 via-[#0a1211] to-yebone-gold/10" />
        <div className="absolute inset-0 flex flex-wrap gap-2 p-4 opacity-30">
          {MARKETPLACE_EVENTS.map((label, i) => (
            <span
              key={label}
              className="home-glass px-3 py-1.5 rounded-full text-[10px] font-semibold text-white/80 border border-white/10"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              {label}
            </span>
          ))}
        </div>
        <div className="relative z-10 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1 text-yebone-gold text-xs font-semibold uppercase mb-2">
              <HiOutlineSparkles size={12} /> Yebone Events
            </span>
            <p className="text-white font-Poppins font-semibold text-lg">
              African Innovation Expo &amp; more
            </p>
          </div>
          <Link to="/events">
            <Button variant="secondary" size="sm" className="home-btn-lift">
              Explore events
            </Button>
          </Link>
        </div>
      </div>
    </Container>
    <Events isMobile={isMobile} />
  </section>
);

export default HomeEventsSection;
