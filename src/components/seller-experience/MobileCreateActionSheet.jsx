import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import { useCreateExperience } from "./CreateExperienceContext";
import { CREATE_ACTIONS } from "../../navigation/createActions";
import "./seller-experience.css";

const MobileCreateActionSheet = ({ open, onClose }) => {
  const { openCreate } = useCreateExperience();
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handlePick = (item) => {
    onClose();
    if (item.route) {
      navigate(item.route);
      return;
    }
    window.requestAnimationFrame(() => openCreate(item.step));
  };

  return (
    <div className="mobile-create-sheet-backdrop" role="presentation" onClick={onClose}>
      <div
        className="mobile-create-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-create-sheet-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mobile-create-sheet__handle" aria-hidden="true" />
        <div className="mobile-create-sheet__header">
          <h2 id="mobile-create-sheet-title" className="mobile-create-sheet__title">
            Create
          </h2>
          <button type="button" className="mobile-create-sheet__close" onClick={onClose} aria-label="Close">
            <RxCross1 size={18} />
          </button>
        </div>
        <div className="mobile-create-sheet__list">
          {CREATE_ACTIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              className="mobile-create-sheet__row"
              onClick={() => handlePick(item)}
            >
              <span className="mobile-create-sheet__icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="mobile-create-sheet__copy">
                <span className="mobile-create-sheet__row-title">{item.title}</span>
                <span className="mobile-create-sheet__row-desc">{item.desc}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileCreateActionSheet;
