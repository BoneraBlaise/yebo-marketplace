import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { HiOutlineSparkles } from "react-icons/hi";

const FASHION_PATTERN =
  /fashion|cloth|shoe|dress|wear|beauty|accessori|bag|jewel|sneaker|blazer|watch|outfit/i;

const TRACKING_POINTS = [
  { top: "18%", left: "50%" },
  { top: "28%", left: "38%" },
  { top: "28%", left: "62%" },
  { top: "42%", left: "50%" },
  { top: "55%", left: "42%" },
  { top: "55%", left: "58%" },
  { top: "68%", left: "48%" },
  { top: "68%", left: "52%" },
];

const ScanCorner = ({ className }) => (
  <span className={`absolute w-6 h-6 border-yebone-gold/80 ${className}`} />
);

const ShowcasePanel = ({ children, className = "" }) => (
  <div
    className={`home-hero-showcase__panel home-glass rounded-2xl border shadow-xl backdrop-blur-xl ${className}`}
  >
    {children}
  </div>
);

const HeroAIShowcase = () => {
  const { allProducts } = useSelector((state) => state.products);

  const fashionProducts = useMemo(() => {
    const filtered = (allProducts || []).filter((p) =>
      FASHION_PATTERN.test(`${p.category || ""} ${p.name || ""}`)
    );
    const source = filtered.length >= 4 ? filtered : allProducts || [];
    return source.slice(0, 5);
  }, [allProducts]);

  const beforeProduct = fashionProducts[0];
  const afterProduct = fashionProducts[1] || fashionProducts[0];
  const suggestions = fashionProducts.slice(2, 5);

  return (
    <div className="relative w-full min-h-[380px] sm:min-h-[440px] lg:min-h-[540px] home-fade-up">
      <div className="home-hero-showcase__frame absolute inset-0 rounded-[2rem] overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-yebone-primary/15 dark:bg-yebone-primary/20 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yebone-gold/10 rounded-full blur-[70px]" />

        <div className="home-hero-showcase__chrome absolute top-0 inset-x-0 z-20 flex items-center justify-between px-4 sm:px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 home-pulse-dot" />
            <span className="home-hero-showcase__chrome-text text-[11px] font-semibold tracking-wide">
              Yebone Virtual Try-On
            </span>
          </div>
          <span className="text-[10px] text-yebone-primary dark:text-yebone-gold font-medium px-2 py-0.5 rounded-full bg-yebone-primary/10 dark:bg-yebone-gold/10 border border-yebone-primary/15 dark:border-yebone-gold/20">
            Africa · AI-first
          </span>
        </div>

        <div className="absolute inset-4 sm:inset-6 top-14 sm:top-16 rounded-2xl pointer-events-none z-10">
          <ScanCorner className="top-0 left-0 border-t-2 border-l-2 rounded-tl-lg" />
          <ScanCorner className="top-0 right-0 border-t-2 border-r-2 rounded-tr-lg" />
          <ScanCorner className="bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg" />
          <ScanCorner className="bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg" />
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-yebone-gold/60 to-transparent home-scan-line" />
        </div>

        <div className="relative z-[5] flex flex-col items-center justify-center h-full min-h-[380px] sm:min-h-[440px] lg:min-h-[540px] pt-12 pb-6 px-4 sm:px-6">
          <div className="relative w-[140px] sm:w-[170px] lg:w-[190px] aspect-[3/4] mb-4">
            <div className="absolute inset-0 rounded-[40%] bg-gradient-to-b from-yebone-gold/25 via-yebone-primary/20 to-transparent blur-sm" />
            <svg viewBox="0 0 120 160" className="relative w-full h-full drop-shadow-2xl" aria-hidden>
              <defs>
                <linearGradient id="figureGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fed592" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#29625d" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#1a4c47" stopOpacity="0.7" />
                </linearGradient>
              </defs>
              <ellipse cx="60" cy="28" rx="22" ry="26" fill="url(#figureGrad)" opacity="0.95" />
              <path d="M35 58 Q60 48 85 58 L92 120 Q60 132 28 120 Z" fill="url(#figureGrad)" opacity="0.9" />
              <path d="M28 120 Q20 145 35 155 L85 155 Q100 145 92 120" fill="url(#figureGrad)" opacity="0.75" />
            </svg>
            {TRACKING_POINTS.map((pt, i) => (
              <span
                key={i}
                className="absolute w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yebone-gold shadow-[0_0_8px_rgba(254,213,146,0.8)] home-pulse-dot"
                style={{ top: pt.top, left: pt.left, animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>

          <div className="flex gap-2 sm:gap-3 w-full max-w-md">
            <ShowcasePanel className="flex-1 p-2 sm:p-3">
              <p className="home-hero-showcase__label text-[9px] uppercase tracking-wider mb-1.5">Before</p>
              <div className="home-hero-showcase__media-bg aspect-square rounded-xl overflow-hidden">
                {beforeProduct?.images?.[0]?.url ? (
                  <img
                    src={beforeProduct.images[0].url}
                    alt=""
                    className="w-full h-full object-cover opacity-80 home-img-fade"
                  />
                ) : (
                  <div className="w-full h-full home-skeleton" />
                )}
              </div>
            </ShowcasePanel>
            <ShowcasePanel className="flex-1 p-2 sm:p-3 ring-1 ring-yebone-gold/30">
              <p className="text-[9px] uppercase tracking-wider text-yebone-primary dark:text-yebone-gold mb-1.5 flex items-center gap-1">
                <HiOutlineSparkles size={10} /> After · AI
              </p>
              <div className="home-hero-showcase__media-bg aspect-square rounded-xl overflow-hidden relative">
                {afterProduct?.images?.[0]?.url ? (
                  <img
                    src={afterProduct.images[0].url}
                    alt=""
                    className="w-full h-full object-cover home-img-fade"
                  />
                ) : (
                  <div className="w-full h-full home-skeleton" />
                )}
                <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-yebone-primary/90 text-[8px] text-white font-bold">
                  AI Match
                </span>
              </div>
            </ShowcasePanel>
          </div>
        </div>

        {suggestions.map((product, i) => (
          <ShowcasePanel
            key={product?._id || i}
            className={`absolute hidden sm:block p-2 w-[100px] lg:w-[110px] home-animate-float ${
              i === 0
                ? "top-[22%] -left-1 lg:-left-4 home-animate-float-delay"
                : i === 1
                  ? "top-[45%] -right-1 lg:-right-5 home-animate-float-delay-2"
                  : "bottom-[18%] left-[8%]"
            }`}
          >
            <p className="text-[8px] font-bold text-yebone-primary dark:text-yebone-gold uppercase mb-1">
              {i === 0 ? "Suggested" : i === 1 ? "Trending" : "Outfit"}
            </p>
            {product?.images?.[0]?.url && (
              <img
                src={product.images[0].url}
                alt=""
                className="w-full aspect-square rounded-lg object-cover mb-1 home-img-fade"
              />
            )}
            <p className="home-hero-showcase__chrome-text text-[9px] opacity-80 line-clamp-1">
              {product?.name}
            </p>
          </ShowcasePanel>
        ))}

        <div className="absolute bottom-4 sm:bottom-5 inset-x-4 sm:inset-x-5 z-20">
          <ShowcasePanel className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3">
            <div>
              <p className="home-hero-showcase__label text-[9px] uppercase tracking-wider">Confidence</p>
              <p className="text-lg sm:text-xl font-bold text-yebone-primary dark:text-yebone-gold">94%</p>
            </div>
            <div className="h-8 w-px bg-[var(--home-border)]" />
            <div className="text-center">
              <p className="home-hero-showcase__label text-[9px] uppercase tracking-wider">AI Match</p>
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Excellent</p>
            </div>
            <div className="h-8 w-px bg-[var(--home-border)] hidden sm:block" />
            <div className="hidden sm:block text-right">
              <p className="home-hero-showcase__label text-[9px] uppercase tracking-wider">Platform</p>
              <p className="home-hero-showcase__chrome-text text-sm font-semibold">Yebone AI</p>
            </div>
          </ShowcasePanel>
        </div>
      </div>
    </div>
  );
};

export default HeroAIShowcase;
