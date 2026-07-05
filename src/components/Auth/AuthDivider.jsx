import React from "react";

const AuthDivider = ({ text = "or continue with" }) => (
  <div className="auth-divider" role="separator">
    <span>{text}</span>
  </div>
);

export default AuthDivider;
