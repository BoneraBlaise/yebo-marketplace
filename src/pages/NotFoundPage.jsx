import React from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { Container } from "../components/ui";
import PageMeta from "../components/ui/PageMeta";
import ErrorState from "../components/ui/ErrorState";

const NotFoundPage = () => (
  <>
    <PageMeta
      title="Page not found"
      description="The requested page could not be found on Yebone."
      noIndex
    />
    <Header />
    <main id="main-content" className="dashboard-page min-h-[60vh]">
      <Container>
        <ErrorState variant="404" />
      </Container>
    </main>
    <Footer />
  </>
);

export default NotFoundPage;
