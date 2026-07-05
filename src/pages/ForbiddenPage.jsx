import React from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { Container } from "../components/ui";
import PageMeta from "../components/ui/PageMeta";
import ErrorState from "../components/ui/ErrorState";

const ForbiddenPage = () => (
  <>
    <PageMeta title="Access denied" noIndex />
    <Header />
    <main id="main-content" className="dashboard-page min-h-[60vh]">
      <Container>
        <ErrorState variant="403" />
      </Container>
    </main>
    <Footer />
  </>
);

export default ForbiddenPage;
