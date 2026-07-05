import React from "react";
import { Link } from "react-router-dom";
import { Container, Button } from "../ui";
import { HiOutlineSparkles } from "react-icons/hi";

const MARKETPLACE_EVENTS = [
  { label: "Fashion Week", accent: "from-rose-500/30 to-yebone-primary/40" },
  { label: "Shopping Festival", accent: "from-yebone-gold/30 to-orange-500/20" },
  { label: "Vendor Showcase", accent: "from-emerald-500/25 to-yebone-primary/35" },
  { label: "Creator Festival", accent: "from-violet-500/25 to-yebone-primary/30" },
  { label: "Tech Expo", accent: "from-cyan-500/20 to-yebone-primary/35" },
  { label: "African Innovation", accent: "from-yebone-gold/25 to-emerald-600/25" },
];

const HomeEventsBanner = () => (
  <section className="home-section">
    <Container>
      <div className="relative overflow-hidden rounded-3xl min-h-[320px] lg:min-h-[420px] shadow-2xl shadow-yebone-primary/10 border border-gray-100 dark:border-gray-800 bg-[#0a1211]">
        {/* Marketplace visual mosaic — no unrelated stock photos */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-yebone-primary/30 via-[#0a1211] to-yebone-gold/10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-yebone-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-yebone-gold/15 rounded-full blur-[80px]" />

          <div className="absolute inset-0 p-6 sm:p-10 lg:p-12 grid grid-cols-2 sm:grid-cols-3 gap-3 opacity-40 lg:opacity-50">
            {MARKETPLACE_EVENTS.map((event, i) => (
              <div
                key={event.label}
                className={`home-glass rounded-2xl border border-white/10 bg-gradient-to-br ${event.accent} p-4 flex flex-col justify-end min-h-[80px] sm:min-h-[100px] home-animate-float`}
                style={{ animationDelay: `${i * 0.4}s` }}
              >
                <HiOutlineSparkles className="text-yebone-gold mb-2" size={16} />
                <span className="text-[11px] sm:text-xs font-semibold text-white/90">
                  {event.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex flex-col justify-center h-full min-h-[320px] lg:min-h-[420px] px-8 lg:px-16 max-w-xl">
          <span className="text-yebone-gold text-sm font-semibold uppercase tracking-wider mb-3">
            Yebone Events
          </span>
          <h2 className="font-Poppins text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Marketplace moments across Africa
          </h2>
          <p className="text-white/75 text-lg mb-8">
            Fashion weeks, vendor showcases, shopping festivals, and product launches — all on Yebone.
          </p>
          <Link to="/events">
            <Button variant="secondary" size="lg" className="home-btn-lift w-fit">
              Explore events
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  </section>
);

export default HomeEventsBanner;
