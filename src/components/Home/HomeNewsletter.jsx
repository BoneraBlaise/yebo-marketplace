import React, { useState } from "react";
import { toast } from "react-toastify";
import { Container, Button } from "../ui";
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
    <section className="home-section">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-yebone-primary via-yebone-primary-dark to-gray-900 px-8 py-12 lg:px-16 lg:py-16 text-center text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yebone-gold/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

          <div className="relative max-w-xl mx-auto">
            <h2 className={`${typography.heading} text-white mb-3`}>
              Stay ahead of the curve
            </h2>
            <p className="text-white/80 mb-8">
              Get exclusive deals, AI feature updates, and new vendor launches
              delivered to your inbox.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-yebone-gold"
              />
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="shrink-0"
              >
                Subscribe
              </Button>
            </form>
            <p className="text-xs text-white/50 mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HomeNewsletter;
