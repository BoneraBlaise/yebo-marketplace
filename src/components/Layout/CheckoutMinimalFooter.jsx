import React from "react";
import { Link } from "react-router-dom";

const CheckoutMinimalFooter = () => (
  <footer className="checkout-minimal-footer">
    <nav className="checkout-minimal-footer__nav" aria-label="Legal and support">
      <Link to="/privacy-policy">Privacy</Link>
      <span aria-hidden="true">•</span>
      <Link to="/terms">Terms</Link>
      <span aria-hidden="true">•</span>
      <Link to="/contact">Support</Link>
    </nav>
  </footer>
);

export default CheckoutMinimalFooter;
