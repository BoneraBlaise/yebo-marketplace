import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineHeart } from "react-icons/ai";

import { resolveProductDisplayImage } from "../../utils/catalogQuality";
import { handleProductImageError } from "../../utils/productImageUtils";
import "./heroAiShowcase.css";

/** Placeholder cards — replace later from Super Admin dashboard */
const PLACEHOLDER_CARDS = [
  {
    id: "sunglasses",
    name: "Sunglasses",
    price: 6000,
    slot: "ai-showcase__float--tl",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=160&h=160&q=80",
    delay: "0s",
  },
  {
    id: "handbag",
    name: "Handbag",
    price: 20000,
    slot: "ai-showcase__float--bl",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=160&h=160&q=80",
    delay: "0.5s",
  },
  {
    id: "jacket",
    name: "Jacket",
    price: 15000,
    slot: "ai-showcase__float--tr",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=160&h=160&q=80",
    delay: "1s",
  },
  {
    id: "watch",
    name: "Watch",
    price: 10000,
    slot: "ai-showcase__float--mr",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=160&h=160&q=80",
    delay: "1.5s",
  },
  {
    id: "sneakers",
    name: "Sneakers",
    price: 30000,
    slot: "ai-showcase__float--br",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=160&h=160&q=80",
    delay: "2s",
  },
];

const formatPrice = (price) =>
  (price ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const isShirtProduct = (product) => {
  const haystack = `${product?.category || ""} ${product?.subCategory || product?.subcategory || ""} ${product?.name || ""}`.toLowerCase();
  return /\bt-?shirts?\b|\btee\b|\bpolo\b|\boversized casual t-shirt\b/.test(haystack);
};

const PlaceholderCard = ({ card }) => (
  <div
    className={`ai-showcase__float ${card.slot}`}
    style={{ animationDelay: card.delay }}
    aria-label={`${card.name}, RWF ${formatPrice(card.price)}`}
  >
    <div className="ai-showcase__float-img-wrap">
      <img
        src={card.image}
        alt={card.name}
        className="ai-showcase__float-img"
        loading="lazy"
        decoding="async"
        width={72}
        height={72}
      />
    </div>
    <div className="ai-showcase__float-body">
      <div className="ai-showcase__float-top">
        <p className="ai-showcase__float-name">{card.name}</p>
        <span className="ai-showcase__float-wish" aria-hidden>
          <AiOutlineHeart size={15} />
        </span>
      </div>
      <p className="ai-showcase__float-price">RWF {formatPrice(card.price)}</p>
    </div>
  </div>
);

const HeroAIShowcase = ({ className = "" }) => {
  const { allProducts } = useSelector((state) => state.products);

  const shirtProduct = useMemo(() => {
    const products = allProducts || [];
    return products.find(isShirtProduct) || null;
  }, [allProducts]);

  const shirtImage = shirtProduct ? resolveProductDisplayImage(shirtProduct, "card") : null;
  const shirtRawUrl = shirtProduct?.images?.[0]?.url;
  const shirtHref = shirtProduct ? `/product/${shirtProduct._id}` : "/products";

  return (
    <div className={`ai-showcase ${className}`} aria-label="AI virtual try-on preview">
      <div className="ai-showcase__stage">
        <div className="ai-showcase__curves" aria-hidden>
          <svg className="ai-showcase__curve ai-showcase__curve--arc1" viewBox="0 0 420 320" fill="none">
            <path
              d="M30 280 C 120 240, 180 80, 360 40"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <svg className="ai-showcase__curve ai-showcase__curve--arc2" viewBox="0 0 380 280" fill="none">
            <path
              d="M20 240 C 100 200, 160 60, 340 30"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
          </svg>
          <svg className="ai-showcase__curve ai-showcase__curve--arc3" viewBox="0 0 300 200" fill="none">
            <path
              d="M10 170 C 80 130, 140 40, 260 20"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.6"
            />
          </svg>
          <span className="ai-showcase__story-text">See it on you</span>
        </div>

        <div className="ai-showcase__featured-wrap">
          {shirtProduct ? (
            <Link to={shirtHref} className="ai-showcase__featured-link" aria-label={shirtProduct.name}>
              <img
                src={shirtImage}
                alt={shirtProduct.name}
                className="ai-showcase__featured"
                loading="eager"
                decoding="async"
                width={520}
                height={640}
                onError={(e) => handleProductImageError(e, shirtRawUrl)}
              />
            </Link>
          ) : (
            <div className="ai-showcase__featured-placeholder" aria-hidden />
          )}
        </div>

        {PLACEHOLDER_CARDS.map((card) => (
          <PlaceholderCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
};

export default HeroAIShowcase;
