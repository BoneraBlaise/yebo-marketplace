import React from "react";
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
    <main id="main-content" className="dashboard-page yebone-premium-screen min-h-[60vh]">
      <Container>
        <ErrorState variant="404" />
      </Container>
    </main>
  </>
);

export default NotFoundPage;
