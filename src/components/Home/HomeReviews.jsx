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
  <section className="home-section">
    <Container>
      <SectionTitle
        title="Loved by shoppers across Africa"
        subtitle="Real stories from our growing community."
      />

      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        {REVIEWS.map((review) => (
          <Card
            key={review.name}
            className="hover:shadow-lg transition-shadow"
            padding="lg"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(review.rating)].map((_, i) => (
                <span key={i} className="text-yebone-gold text-lg">
                  ★
                </span>
              ))}
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              &ldquo;{review.text}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-yebone-primary text-white flex items-center justify-center font-semibold text-sm">
                {review.avatar}
              </div>
              <div>
                <p className="font-semibold text-sm dark:text-white">
                  {review.name}
                </p>
                <p className="text-xs text-gray-500">{review.location}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  </section>
);

export default HomeReviews;
