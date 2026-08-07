import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineSparkles, HiOutlineCalendar } from "react-icons/hi";
import { Container, SectionTitle, Button } from "../ui";
import Events from "../Events/Events";
import { useBreakpoint } from "../../design-system/responsive/useBreakpoint";

const MARKETPLACE_EVENTS = [
  { label: "Fashion Week", accent: "from-rose-500/30 to-yebone-primary/40" },
  { label: "Shopping Festival", accent: "from-yebone-gold/30 to-orange-500/20" },
  { label: "Vendor Showcase", accent: "from-emerald-500/25 to-yebone-primary/35" },
  { label: "Creator Festival", accent: "from-violet-500/25 to-yebone-primary/30" },
  { label: "Tech Expo", accent: "from-cyan-500/20 to-yebone-primary/35" },
  { label: "African Innovation", accent: "from-yebone-gold/25 to-emerald-600/25" },
];

const HomeEventsBanner = () => {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "mobile";

  return (
    <section className="home-section home-section--compact home-surface-0">
      <Container>
        <SectionTitle
          title="Marketplace events"
          subtitle="Fashion weeks, vendor showcases, and shopping festivals across the Yebone ecosystem."
          align="left"
          className="mb-6"
        />

        <div className="home-events-panel relative overflow-hidden rounded-3xl min-h-[200px] sm:min-h-[220px] lg:min-h-[260px] shadow-yebo-lg mb-8">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-yebone-primary/10 dark:bg-yebone-primary/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-56 h-56 sm:w-72 sm:h-72 bg-yebone-gold/10 rounded-full blur-[80px]" />

            <div className="home-events-panel__mosaic absolute inset-0 p-4 sm:p-8 lg:p-10 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {MARKETPLACE_EVENTS.map((event, i) => (
                <div
                  key={event.label}
                  className={`home-events-panel__chip home-glass rounded-xl sm:rounded-2xl border bg-gradient-to-br ${event.accent} p-3 sm:p-4 flex flex-col justify-end min-h-[64px] sm:min-h-[88px] home-animate-float`}
                  style={{ animationDelay: `${i * 0.35}s` }}
                >
                  <HiOutlineSparkles className="text-yebone-primary dark:text-yebone-gold mb-1 sm:mb-2" size={14} />
                  <span className="text-[10px] sm:text-xs font-semibold leading-tight">{event.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex flex-col justify-center h-full min-h-[200px] sm:min-h-[220px] lg:min-h-[260px] px-5 sm:px-8 lg:px-12 max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-yebone-primary dark:text-yebone-gold text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2 sm:mb-3">
              <HiOutlineCalendar size={14} aria-hidden="true" />
              Yebone Events
            </span>
            <h2 className="home-events-banner__title home-events-panel__title mb-3 sm:mb-4 text-xl sm:text-2xl lg:text-3xl">
              Marketplace moments across Africa
            </h2>
            <p className="home-events-panel__copy-muted text-sm sm:text-base lg:text-lg mb-5 sm:mb-7 max-w-md">
              Fashion weeks, vendor showcases, shopping festivals, and product launches — all on Yebone.
            </p>
            <Link to="/events" className="w-fit">
              <Button variant="secondary" size="lg" className="home-btn-lift min-h-[44px]">
                Explore events
              </Button>
            </Link>
          </div>
        </div>

        <Events isMobile={isMobile} />
      </Container>
    </section>
  );
};

export default HomeEventsBanner;
