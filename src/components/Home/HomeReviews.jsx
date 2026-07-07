import React from "react";
import { Container, SectionTitle, Card } from "../ui";

const REVIEWS = [
  {
    name: "Amara Okafor",
    location: "Lagos, Nigeria",
    rating: 5,
    text: "The AI try-on feature saved me from buying the wrong size twice. Yebone feels like shopping in the future.",
    avatar: "AO",
  },
  {
    name: "Jean-Pierre N.",
    location: "Kigali, Rwanda",
    rating: 5,
    text: "Fast delivery, verified sellers, and a clean experience. Finally a marketplace that understands Africa.",
    avatar: "JN",
  },
  {
    name: "Sarah Mwangi",
    location: "Nairobi, Kenya",
    rating: 5,
    text: "I found unique local brands I never knew existed. The recommendations are scary good.",
    avatar: "SM",
  },
];

const HomeReviews = () => (
  <section className="home-section home-surface-1">
    <Container>
      <SectionTitle
        title="Loved by shoppers across Africa"
        subtitle="Real stories from our growing community."
      />

      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        {REVIEWS.map((review) => (
          <Card
            key={review.name}
            className="home-surface-card home-review-card"
            padding="lg"
          >
            <div className="flex gap-0.5 mb-4" aria-label={`${review.rating} out of 5 stars`}>
              {[...Array(review.rating)].map((_, i) => (
                <span key={i} className="text-yebone-gold text-base leading-none">
                  ★
                </span>
              ))}
            </div>
            <p className="home-review-card__quote">
              &ldquo;{review.text}&rdquo;
            </p>
            <div className="home-review-card__author">
              <div className="home-review-card__avatar bg-yebone-primary text-white flex items-center justify-center font-semibold text-sm">
                {review.avatar}
              </div>
              <div>
                <p className="font-semibold text-sm text-[var(--home-text)] leading-snug">
                  {review.name}
                </p>
                <p className="text-xs text-[var(--home-text-muted)] mt-0.5">
                  {review.location}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  </section>
);

export default HomeReviews;
