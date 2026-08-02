import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import { AiOutlineLogin } from "react-icons/ai";
import { HiOutlineUserAdd } from "react-icons/hi";
import "./auth-guest-modal.css";

const AuthGuestModal = ({ open, onClose }) => {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="auth-guest-modal__backdrop" role="presentation" onClick={onClose}>
      <div
        className="auth-guest-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Sign in to Yebone"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="auth-guest-modal__close" onClick={onClose} aria-label="Close">
          <RxCross1 size={18} />
        </button>
        <p className="auth-guest-modal__eyebrow">Account</p>
        <h2 className="auth-guest-modal__title">Welcome to Yebone</h2>
        <p className="auth-guest-modal__desc">Sign in to access messages, orders, and your saved items.</p>
        <div className="auth-guest-modal__actions">
          <Link to="/login" className="auth-guest-modal__btn auth-guest-modal__btn--primary" onClick={onClose}>
            <AiOutlineLogin size={18} aria-hidden="true" />
            Log in
          </Link>
          <Link to="/sign-up" className="auth-guest-modal__btn auth-guest-modal__btn--secondary" onClick={onClose}>
            <HiOutlineUserAdd size={18} aria-hidden="true" />
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthGuestModal;
