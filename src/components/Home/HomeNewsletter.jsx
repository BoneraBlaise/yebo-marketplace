import React, { useState } from "react";
import { toast } from "react-toastify";
import { Container } from "../ui";
import { typography } from "../../design-system/typography";

const HomeNewsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.info("Please enter your email address.");
      return;
    }
    toast.success("Thanks for subscribing! (UI preview only)");
    setEmail("");
  };

  return (
    <section className="home-section home-section--emphasis home-surface-0">
      <Container>
        <div className="home-newsletter home-glass">
          <div className="home-newsletter__glass">
            <h2 className={`${typography.heading} mb-3`} style={{ color: "var(--home-newsletter-fg)" }}>
              Stay ahead of the curve
            </h2>
            <p className="text-base leading-relaxed max-w-md mx-auto" style={{ color: "color-mix(in srgb, var(--home-newsletter-fg) 82%, transparent)" }}>
              Get exclusive deals, AI feature updates, and new vendor launches
              delivered to your inbox.
            </p>

            <form onSubmit={handleSubmit} className="home-newsletter__form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                aria-label="Email address for newsletter"
                className="home-newsletter__input"
              />
              <button
                type="submit"
                className="home-btn-lift shrink-0 min-h-[3rem] px-6 rounded-xl bg-yebone-gold text-yebone-dark-text font-semibold text-sm hover:bg-white transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs mt-4" style={{ color: "color-mix(in srgb, var(--home-newsletter-fg) 55%, transparent)" }}>
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HomeNewsletter;
