import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Container } from "../ui";
import ErrorState from "../ui/ErrorState";
import PageMeta from "../ui/PageMeta";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (process.env.NODE_ENV !== "production") {
      console.error("ErrorBoundary caught:", error, info);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <>
          <PageMeta title="Something went wrong" noIndex />
          <Header />
          <main id="main-content" className="dashboard-page min-h-[60vh]">
            <Container>
              <ErrorState variant="500" onAction={this.handleRetry} />
            </Container>
          </main>
          <Footer />
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
