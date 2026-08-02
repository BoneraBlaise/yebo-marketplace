import React from "react";
import { Link } from "react-router-dom";

const ProductMinimalFooter = () => (
  <footer className="pdp-minimal-footer">
    <nav className="pdp-minimal-footer__nav" aria-label="Legal and support">
      <Link to="/privacy-policy">Privacy</Link>
      <Link to="/terms">Terms</Link>
      <Link to="/contact">Support</Link>
      <Link to="/about">About</Link>
    </nav>
  </footer>
);

export default ProductMinimalFooter;
