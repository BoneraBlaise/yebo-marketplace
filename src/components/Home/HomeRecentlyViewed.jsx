import React from "react";
import RecentlyViewed from "../Route/Recent/RecentlyViewed";
import { Container, SectionTitle } from "../ui";

const HomeRecentlyViewed = () => (
  <section id="recently-viewed" className="home-section home-section--compact home-surface-3">
    <Container>
      <SectionTitle
        title="Continue browsing"
        subtitle="Pick up where you left off."
        align="left"
        className="mb-2"
      />
    </Container>
    <RecentlyViewed />
  </section>
);

export default HomeRecentlyViewed;
