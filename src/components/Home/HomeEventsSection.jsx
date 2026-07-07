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
  <section className="home-section home-surface-1">
    <Container>
      <SectionTitle
        title="Marketplace events"
        subtitle="Fashion weeks, vendor showcases, and shopping festivals across the Yebone ecosystem."
        align="left"
        className="mb-6"
      />

      <div className="home-events-panel relative overflow-hidden rounded-2xl mb-8 min-h-[180px]">
        <div className="absolute inset-0 bg-yebone-primary/5 dark:bg-yebone-primary/10" />
        <div className="absolute inset-0 flex flex-wrap gap-2 p-4 home-events-panel__mosaic">
          {MARKETPLACE_EVENTS.map((label, i) => (
            <span
              key={label}
              className="home-events-panel__chip home-glass px-3 py-1.5 rounded-full text-[10px] font-semibold border"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              {label}
            </span>
          ))}
        </div>
        <div className="relative z-10 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1 text-yebone-primary dark:text-yebone-gold text-xs font-semibold uppercase mb-2">
              <HiOutlineSparkles size={12} /> Yebone Events
            </span>
            <p className="yebone-section-title home-events-panel__title text-base sm:text-lg">
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
