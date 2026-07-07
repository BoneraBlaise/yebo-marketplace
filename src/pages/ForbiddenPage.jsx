import React from "react";
import { Container } from "../components/ui";
import PageMeta from "../components/ui/PageMeta";
import ErrorState from "../components/ui/ErrorState";

const ForbiddenPage = () => (
  <>
    <PageMeta title="Access denied" noIndex />
    <main id="main-content" className="dashboard-page yebone-premium-screen min-h-[60vh]">
      <Container>
        <ErrorState variant="403" />
      </Container>
    </main>
  </>
);

export default ForbiddenPage;
