import React from "react";
import { HiOutlineSparkles, HiOutlineTrendingUp, HiOutlineLocationMarker } from "react-icons/hi";
import { Container, SectionTitle, Badge } from "../ui";

const AI_INSIGHTS = [
  { label: "Recommended Size", value: "Best fit for this category", icon: "✓" },
  { label: "Recommended Color", value: "Matches trending palettes", icon: "✓" },
  { label: "Matching Outfit", value: "Pairs with accessories", icon: "✓" },
  { label: "Similar Style", value: "Curated alternatives", icon: "✓" },
];

const AI_METRICS = [
  { label: "Match Score", value: "94%", highlight: true },
  { label: "Region Popularity", value: "High in East Africa" },
  { label: "Trend", value: "Rising", icon: HiOutlineTrendingUp },
  { label: "Confidence", value: "Excellent" },
];

const ProductAISections = ({ category }) => (
  <>
    <section className="pdp-section bg-gradient-to-b from-yebone-light-gray/50 to-transparent dark:from-gray-900/30">
      <Container>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="gold">AI Powered</Badge>
          <span className="text-xs font-semibold text-yebone-primary uppercase tracking-wider flex items-center gap-1">
            <HiOutlineSparkles size={14} />
            Yebone AI
          </span>
        </div>
        <SectionTitle
          title="AI Shopping Assistant"
          subtitle="Personalized insights to help you buy with confidence — presentation placeholders until AI backend connects."
          align="left"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-5">
          {AI_INSIGHTS.map((item) => (
            <div
              key={item.label}
              className="yebone-card-lift yebone-glass rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 p-4 lg:p-5"
            >
              <span className="text-yebone-gold text-base font-bold">{item.icon}</span>
              <p className="font-Poppins font-semibold text-xs lg:text-sm mt-2 dark:text-white leading-snug">
                {item.label}
              </p>
              <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-4 lg:gap-5">
          <div className="lg:col-span-2 yebone-surface rounded-3xl p-6 lg:p-8">
            <p className="text-sm font-semibold text-yebone-primary mb-2 flex items-center gap-1">
              <HiOutlineSparkles size={16} /> Why AI selected this product
            </p>
            <p className="font-Poppins text-lg font-semibold dark:text-white mb-3">
              Strong recommendation for {category || "marketplace"} shoppers
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              {category
                ? `Yebone AI surfaces this ${category} item based on seller trust, competitive pricing, and buyer satisfaction patterns across Africa.`
                : "Yebone AI surfaces this item based on seller trust, competitive pricing, and buyer satisfaction patterns."}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-yebone-primary/10 text-yebone-primary font-semibold">
                <HiOutlineLocationMarker size={14} /> Popular in your region
              </span>
              <span className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-yebone-gold/20 text-yebone-dark-text font-semibold">
                <HiOutlineTrendingUp size={14} /> Trending now
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
            {AI_METRICS.map(({ label, value, highlight, icon: Icon }) => (
              <div
                key={label}
                className={`rounded-2xl p-4 border text-center lg:text-left ${
                  highlight
                    ? "bg-gradient-to-br from-yebone-primary to-yebone-primary-dark text-white border-transparent shadow-lg"
                    : "yebone-glass border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80"
                }`}
              >
                <p className={`text-[10px] uppercase tracking-wider mb-1 ${highlight ? "text-white/70" : "text-gray-500"}`}>
                  {label}
                </p>
                <p className={`font-Poppins font-bold text-lg flex items-center justify-center lg:justify-start gap-1 ${highlight ? "text-yebone-gold" : "dark:text-white"}`}>
                  {Icon && <Icon size={16} />}
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>

    <section className="pdp-section">
      <Container>
        <div className="relative overflow-hidden rounded-[1.75rem] bg-[#0a1211] border border-white/10 min-h-[300px] lg:min-h-[340px] shadow-2xl shadow-yebone-primary/10">
          <div className="absolute inset-0 bg-gradient-to-br from-yebone-primary/30 via-[#0a1211] to-yebone-gold/15" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-80 border border-yebone-gold/25 rounded-[2rem] yebone-scan-line pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-yebone-primary/20 rounded-full blur-[100px]" />

          <div className="relative z-10 p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="flex-1 text-center lg:text-left">
              <Badge variant="gold" className="mb-4">Coming Soon</Badge>
              <h3 className="font-Poppins text-2xl lg:text-3xl font-bold text-white mb-3">
                Virtual Try-On
              </h3>
              <p className="text-gray-400 max-w-md leading-relaxed text-sm lg:text-base">
                Preview before purchase — Yebone&apos;s AI-powered virtual try-on for fashion and
                beauty launches soon across Africa.
              </p>
            </div>

            <div className="yebone-glass rounded-3xl border border-white/15 p-8 w-full max-w-[280px] text-center shadow-xl">
              <div className="relative w-24 h-32 mx-auto mb-5">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-yebone-gold/40 to-yebone-primary/40 blur-sm" />
                <div className="relative w-full h-full rounded-2xl border border-yebone-gold/30 flex items-center justify-center bg-black/30">
                  <HiOutlineSparkles className="text-yebone-gold" size={36} />
                </div>
                <span className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-emerald-400 yebone-pulse-dot" />
              </div>
              <p className="text-white font-Poppins font-semibold">AI Scan Preview</p>
              <p className="text-gray-500 text-xs mt-2">Future capability · Placeholder only</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  </>
);

export default ProductAISections;
