import React from "react";
import { Card, Badge, Button, SearchInput } from "../../../design-system/components";
import { SectionHeader, PremiumCard } from "../../../ui-polish";
import { polishClasses } from "../../../ui-polish/polishClasses";
import { AI_POWERED_BY, MARKETPLACE_NAME } from "../../../ui-polish/brandConstants";
import { logCustomerUIDiagnostics } from "../../diagnostics/CustomerUIDiagnostics";

export const HeroSection = ({ title = `Shop Smarter on ${MARKETPLACE_NAME}`, subtitle = "Africa's premium AI-powered marketplace — discover, compare, and preview products with confidence." }) => {
  logCustomerUIDiagnostics("component", { name: "HeroSection" });
  return (
    <section aria-label="Hero" className={`relative overflow-hidden rounded-2xl md:rounded-3xl ${polishClasses.heroGradient} p-8 md:p-12 lg:p-16 mb-8 md:mb-10 shadow-yebo-lg`}>
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,rgba(254,213,146,0.4),transparent_50%)]" aria-hidden="true" />
      <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <Badge variant="warning" className="mb-4 bg-yebone-gold/20 text-yebone-gold border-0">{AI_POWERED_BY}</Badge>
          <h1 className="text-3xl md:text-5xl font-Poppins font-bold mb-3 tracking-tight">{title}</h1>
          <p className="text-white/85 mb-8 text-base md:text-lg leading-relaxed">{subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <SearchInput placeholder="Search products, brands, categories..." className="max-w-md text-gray-900 shadow-yebo-gold flex-1" aria-label="Search marketplace" />
            <Button variant="secondary" className="bg-white/95 text-yebone-primary shrink-0">Explore Deals</Button>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-white/75">
            <span>✓ Verified sellers</span>
            <span>✓ Secure checkout</span>
            <span>✓ AI product previews</span>
          </div>
        </div>
        <div className="hidden lg:flex items-center justify-center">
          <div className="w-full max-w-sm aspect-square rounded-3xl bg-white/10 backdrop-blur border border-white/20 flex flex-col items-center justify-center p-8 text-center">
            <span className="text-5xl mb-4" aria-hidden="true">✨</span>
            <p className="font-Poppins font-semibold text-lg">Preview before you buy</p>
            <p className="text-sm text-white/75 mt-2">{AI_POWERED_BY}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export const SearchEntry = ({ onSearch }) => (
  <div className="mb-6">
    <SearchInput placeholder="What are you looking for?" onChange={(e) => onSearch?.(e.target.value)} aria-label="Search products" />
  </div>
);

export const CategoryGrid = ({ categories = [] }) => (
  <section aria-label="Categories" className="mb-8 md:mb-10">
    <SectionHeader title="Shop by Category" subtitle="Browse curated collections" />
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
      {categories.map((cat) => (
        <Card key={cat.id} className="text-center cursor-pointer yebone-card-lift !p-4" role="button" tabIndex={0} aria-label={`Browse ${cat.name}`}>
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-yebone-primary/10 flex items-center justify-center text-xl">📦</div>
          <p className="text-sm font-semibold">{cat.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">{cat.count} items</p>
        </Card>
      ))}
    </div>
  </section>
);

export const FeaturedProducts = ({ products = [], title = "Featured Products" }) => (
  <section aria-label={title} className="mb-8 md:mb-10">
    <SectionHeader title={title} subtitle="Handpicked for you" action={<Button variant="ghost" size="sm">View All</Button>} />
    <div className={`${polishClasses.contentGrid}`}>
      {products.slice(0, 4).map((p) => (
        <Card key={p.id} className="cursor-pointer yebone-card-lift !p-4" role="article" aria-label={p.name}>
          <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl mb-4 flex items-center justify-center text-4xl">🛍️</div>
          <p className="text-sm font-semibold truncate">{p.name}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-yebone-primary font-bold text-lg">${p.price}</p>
            {p.originalPrice && <p className="text-xs text-gray-400 line-through">${p.originalPrice}</p>}
          </div>
        </Card>
      ))}
    </div>
  </section>
);

export const FeaturedVendors = ({ vendors = [] }) => (
  <section aria-label="Featured Vendors" className="mb-8 md:mb-10">
    <SectionHeader title="Featured Vendors" subtitle={`Trusted sellers on ${MARKETPLACE_NAME}`} />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {vendors.map((v) => (
        <PremiumCard key={v.id} className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-yebone-primary/10 flex items-center justify-center font-bold text-yebone-primary text-lg shrink-0">{v.name[0]}</div>
          <div className="min-w-0">
            <p className="font-semibold truncate">{v.name} {v.verified && <Badge variant="success">Verified</Badge>}</p>
            <p className="text-xs text-gray-500 mt-1">⭐ {v.rating} · {v.products} products</p>
          </div>
        </PremiumCard>
      ))}
    </div>
  </section>
);

export const PromotionsBanner = ({ promotions = [] }) => (
  <section aria-label="Promotions" className="mb-8 md:mb-10">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {promotions.map((promo) => (
        <PremiumCard key={promo.id} accent className="bg-gradient-to-br from-yebone-gold/10 to-transparent">
          <Badge variant="warning">{promo.badge}</Badge>
          <h3 className="font-Poppins font-semibold text-lg mt-3">{promo.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{promo.description}</p>
        </PremiumCard>
      ))}
    </div>
  </section>
);

export const AIValueSection = () => (
  <section aria-label="YEBO AI benefits" className="mb-8 md:mb-10">
    <PremiumCard accent className="yebone-surface">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <Badge variant="warning">{AI_POWERED_BY}</Badge>
          <h2 className="font-Poppins text-2xl md:text-3xl font-bold mt-4 mb-3">Shop with intelligence</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
            {MARKETPLACE_NAME} combines verified marketplace commerce with {AI_POWERED_BY}. Preview products, get smart recommendations, and make confident purchase decisions.
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2"><span aria-hidden="true">✨</span> AI product previews — try before you buy</li>
            <li className="flex gap-2"><span aria-hidden="true">🎯</span> Personalized recommendations</li>
            <li className="flex gap-2"><span aria-hidden="true">🔍</span> Natural language search</li>
          </ul>
          <Button className="mt-6">Try AI Preview</Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {["Preview", "Compare", "Recommend", "Discover"].map((label) => (
            <Card key={label} className="text-center !p-4 yebone-card-lift">
              <span className="text-2xl block mb-2" aria-hidden="true">✨</span>
              <p className="text-sm font-semibold">{label}</p>
            </Card>
          ))}
        </div>
      </div>
    </PremiumCard>
  </section>
);

export const FlashDealsSection = ({ products = [] }) => (
  <section aria-label="Flash deals" className="mb-8 md:mb-10">
    <SectionHeader title="Flash Deals" subtitle="Limited-time offers" action={<Badge variant="error">Ends soon</Badge>} />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.slice(0, 4).map((p) => (
        <Card key={p.id} className="relative yebone-card-lift !p-4 overflow-hidden">
          <Badge variant="error" className="absolute top-3 left-3">-{Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100 || 15)}%</Badge>
          <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl mb-3 flex items-center justify-center text-3xl">⚡</div>
          <p className="text-sm font-semibold truncate">{p.name}</p>
          <p className="text-yebone-primary font-bold">${p.price}</p>
        </Card>
      ))}
    </div>
  </section>
);

export const TrendingProducts = ({ products = [], title = "Trending Now" }) => (
  <FeaturedProducts products={products} title={title} />
);

export const PopularBrandsSection = () => (
  <section aria-label="Popular brands" className="mb-8 md:mb-10">
    <SectionHeader title="Popular Brands" subtitle="Shop your favorites" />
    <div className="flex flex-wrap gap-3">
      {["TechHub", "StyleCo", "GreenLiving", "FitGear", "GlowUp", "NovaWear"].map((brand) => (
        <Button key={brand} variant="secondary" size="sm">{brand}</Button>
      ))}
    </div>
  </section>
);

export const StatsSection = () => (
  <section aria-label="Platform statistics" className="mb-8 md:mb-10">
    <div className={polishClasses.statGrid}>
      {[
        { label: "Products", value: "50K+" },
        { label: "Verified Vendors", value: "2,400+" },
        { label: "Happy Customers", value: "180K+" },
        { label: "AI Previews", value: "1.2M+" },
      ].map((s) => (
        <PremiumCard key={s.label} className="text-center">
          <p className="text-2xl md:text-3xl font-bold font-Poppins text-yebone-primary">{s.value}</p>
          <p className="text-xs uppercase tracking-wide text-gray-500 mt-1">{s.label}</p>
        </PremiumCard>
      ))}
    </div>
  </section>
);

export const TrustBadgesSection = () => (
  <section aria-label="Trust badges" className="mb-8 md:mb-10">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { icon: "🛡️", title: "Buyer Protection", desc: "Secure transactions" },
        { icon: "✅", title: "Verified Sellers", desc: "Trusted vendors only" },
        { icon: "🚚", title: "Fast Delivery", desc: "Nationwide shipping" },
        { icon: "✨", title: AI_POWERED_BY, desc: "Smart shopping tools" },
      ].map((b) => (
        <Card key={b.title} className="text-center !p-5">
          <span className="text-2xl block mb-2" aria-hidden="true">{b.icon}</span>
          <p className="font-semibold text-sm">{b.title}</p>
          <p className="text-xs text-gray-500 mt-1">{b.desc}</p>
        </Card>
      ))}
    </div>
  </section>
);

export const TestimonialsSection = () => (
  <section aria-label="Customer testimonials" className="mb-8 md:mb-10">
    <SectionHeader title="What customers say" subtitle={`Real stories from ${MARKETPLACE_NAME} shoppers`} />
    <div className="grid md:grid-cols-3 gap-4">
      {[
        { name: "Thandi M.", text: "The AI preview helped me choose the perfect headphones. Shopping on YEBONE feels premium.", rating: 5 },
        { name: "James K.", text: "Verified vendors and fast delivery. Best marketplace experience I've had.", rating: 5 },
        { name: "Aisha R.", text: "Love the smart recommendations — found products I didn't know I needed!", rating: 4 },
      ].map((t) => (
        <PremiumCard key={t.name}>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
          <p className="font-semibold text-sm">{t.name}</p>
          <p className="text-xs text-yebone-gold mt-1" aria-label={`${t.rating} out of 5 stars`}>{"⭐".repeat(t.rating)}</p>
        </PremiumCard>
      ))}
    </div>
  </section>
);

export const NewsletterSection = () => (
  <section aria-label="Newsletter signup" className="mb-8 md:mb-10">
    <PremiumCard className="bg-gradient-to-r from-yebone-primary/5 to-yebone-gold/10 text-center">
      <h2 className="font-Poppins text-xl md:text-2xl font-bold mb-2">Stay in the loop</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">Get exclusive deals, AI shopping tips, and new vendor announcements from {MARKETPLACE_NAME}.</p>
      <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
        <SearchInput placeholder="Your email address" type="email" aria-label="Email for newsletter" className="flex-1" />
        <Button>Subscribe</Button>
      </div>
    </PremiumCard>
  </section>
);

export const LandingFooter = () => (
  <footer className="border-t border-gray-200 dark:border-gray-700 pt-10 pb-24 lg:pb-10 mt-4" role="contentinfo">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
      <div className="col-span-2 md:col-span-1">
        <p className="font-Poppins font-bold text-lg text-yebone-primary tracking-wide">{MARKETPLACE_NAME}</p>
        <p className="text-xs text-gray-500 mt-2">{AI_POWERED_BY}</p>
      </div>
      {[
        { title: "Shop", links: ["Categories", "Flash Deals", "Brands", "Vendors"] },
        { title: "Account", links: ["Orders", "Wishlist", "Profile", "Help"] },
        { title: "Company", links: ["About", "Sell on YEBONE", "Careers", "Contact"] },
      ].map((col) => (
        <div key={col.title}>
          <p className="font-semibold text-sm mb-3">{col.title}</p>
          <ul className="space-y-2 text-sm text-gray-500">
            {col.links.map((link) => <li key={link}><button type="button" className="hover:text-yebone-primary transition-colors">{link}</button></li>)}
          </ul>
        </div>
      ))}
    </div>
    <p className="text-xs text-gray-400 text-center">© {new Date().getFullYear()} {MARKETPLACE_NAME}. All rights reserved.</p>
  </footer>
);

export default {
  HeroSection, SearchEntry, CategoryGrid, FeaturedProducts, FeaturedVendors, PromotionsBanner,
  AIValueSection, FlashDealsSection, TrendingProducts, PopularBrandsSection, StatsSection,
  TrustBadgesSection, TestimonialsSection, NewsletterSection, LandingFooter,
};
