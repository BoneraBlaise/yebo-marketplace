import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RxArrowLeft } from "react-icons/rx";
import CreateProductWizard from "./CreateProductWizard";
import CreateListingWizard from "./CreateListingWizard";
import { CREATE_ACTIONS } from "../../navigation/createActions";
import "./seller-experience.css";

const CreateExperienceModal = ({ open, onClose, onComplete, initialStep = "pick", initialCategory }) => {
  const [step, setStep] = useState(initialStep);
  const [wizardCategory, setWizardCategory] = useState(initialCategory);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setStep(initialStep);
      setWizardCategory(initialCategory);
    }
  }, [open, initialStep, initialCategory]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    document.body.classList.add("create-modal-open");
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("create-modal-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleComplete = (listing) => onComplete?.(listing);

  const handleBack = () => {
    if (step === "pick") {
      onClose();
      return;
    }
    setStep("pick");
  };

  const handleTile = (tile) => {
    if (tile.route) {
      onClose();
      navigate(tile.route);
      return;
    }
    if (tile.step === "vehicle") {
      setWizardCategory("cars");
      setStep("property");
      return;
    }
    if (tile.step === "property") {
      setWizardCategory(null);
      setStep("property");
      return;
    }
    setStep(tile.step);
  };

  return (
    <div className="seller-xp-modal-backdrop seller-xp-modal-backdrop--focus" role="presentation" onClick={onClose}>
      <div
        className={`seller-xp-modal ${step !== "pick" ? "seller-xp-modal--wizard" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-experience-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="seller-xp-modal__toolbar">
          <button type="button" className="seller-xp-modal__back" onClick={handleBack} aria-label="Go back">
            <RxArrowLeft size={18} />
            <span>Back</span>
          </button>
        </div>

        {step === "pick" && (
          <>
            <h2 id="create-experience-title" className="seller-xp-modal__title">
              What would you like to create?
            </h2>
            <p className="seller-xp-modal__subtitle">Choose a listing type to continue.</p>
            <div className="create-tiles">
              {CREATE_ACTIONS.map((tile) => (
                <button key={tile.id} type="button" className="create-tile" onClick={() => handleTile(tile)}>
                  <span className="create-tile__icon" aria-hidden="true">{tile.icon}</span>
                  <span>
                    <p className="create-tile__title">{tile.title}</p>
                    <p className="create-tile__desc">{tile.desc}</p>
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === "product" && (
          <CreateProductWizard embedded onComplete={handleComplete} onCancel={() => setStep("pick")} />
        )}

        {(step === "property" || step === "vehicle") && (
          <CreateListingWizard
            onComplete={handleComplete}
            onCancel={() => setStep("pick")}
            initialCategory={wizardCategory}
          />
        )}
      </div>
    </div>
  );
};

export default CreateExperienceModal;
