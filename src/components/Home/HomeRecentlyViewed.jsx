import React from "react";
import RecentlyViewed from "../Route/Recent/RecentlyViewed";
import { Container, SectionTitle } from "../ui";

const HomeRecentlyViewed = () => (
  <section className="home-section bg-yebone-light-gray/50 dark:bg-gray-900/30">
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
