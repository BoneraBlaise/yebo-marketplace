import React from "react";
import { HiOutlineSparkles } from "react-icons/hi";

const CAPABILITIES = [
  { id: "search", icon: "✨", title: "Smart Search", desc: "Find products instantly", mode: "search" },
  { id: "visual", icon: "📷", title: "Visual Search", desc: "Search with photos", mode: "visual" },
  { id: "tryon", icon: "👕", title: "Virtual Try-On", desc: "Preview before you buy", mode: "visual" },
  { id: "compare", icon: "⚖", title: "Compare Products", desc: "Side-by-side picks", mode: "compare" },
  { id: "budget", icon: "💰", title: "Budget Assistant", desc: "Shop within your range", mode: "budget" },
  { id: "property", icon: "🏠", title: "Property Assistant", desc: "Homes, land & rentals", action: "property" },
  { id: "vehicle", icon: "🚗", title: "Vehicle Finder", desc: "Cars & mobility", mode: "search" },
];

const YEBOHomeCards = ({ onSelectMode, onOpenCreate }) => (
  <div className="ai-workspace">
    <div className="ai-workspace__hero">
      <div className="ai-workspace__orb" aria-hidden="true">
        <HiOutlineSparkles className="text-yebone-gold" size={22} />
      </div>
      <h1 className="ai-workspace__brand">YEBO</h1>
      <p className="ai-workspace__tagline">Shopping Intelligence</p>
      <p className="ai-workspace__pitch">
        Your intelligent assistant for finding, comparing, and buying across Africa.
      </p>
    </div>

    <p className="ai-workspace__section-label">Capabilities</p>
    <div className="ai-workspace__grid" role="list">
      {CAPABILITIES.map((item) => (
        <button
          key={item.id}
          type="button"
          role="listitem"
          className="ai-capability"
          onClick={() => {
            if (item.action === "property") {
              onOpenCreate?.("property");
              return;
            }
            onSelectMode?.(item.mode);
          }}
        >
          <span className="ai-capability__icon-wrap" aria-hidden="true">
            {item.icon}
          </span>
          <span className="ai-capability__title">{item.title}</span>
          <span className="ai-capability__desc">{item.desc}</span>
        </button>
      ))}
    </div>
  </div>
);

export default YEBOHomeCards;
