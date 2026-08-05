import React from "react";

const WizardShell = ({
  title,
  subtitle,
  steps,
  currentStep,
  children,
  onBack,
  onFirstBack,
  onNext,
  onPublish,
  isFirstStep,
  isLastStep,
  canProceed,
  isSubmitting,
  nextLabel = "Continue",
  publishLabel = "Publish",
}) => (
  <div className="seller-xp-wizard">
    <div className="seller-xp-wizard__header">
      <h2 className="seller-xp-wizard__title dark:text-white">{title}</h2>
      {subtitle && <p className="seller-xp-wizard__subtitle">{subtitle}</p>}
      <div className="seller-xp-wizard__progress" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={steps.length}>
        <div className="seller-xp-wizard__progress-track">
          <div
            className="seller-xp-wizard__progress-fill"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        <span className="seller-xp-wizard__progress-label">
          Step {currentStep + 1} of {steps.length}
        </span>
      </div>
      <p className="seller-xp-wizard__step-name">{steps[currentStep]?.label}</p>
    </div>

    <div key={currentStep} className="seller-xp-wizard__body seller-xp-wizard__body--animate">{children}</div>

    <div className="seller-xp-actions">
      <button
        type="button"
        className="seller-xp-btn seller-xp-btn--ghost"
        onClick={isFirstStep && onFirstBack ? onFirstBack : onBack}
        disabled={isSubmitting || (isFirstStep && !onFirstBack)}
      >
        Back
      </button>
      {!isLastStep ? (
        <button
          type="button"
          className="seller-xp-btn seller-xp-btn--primary"
          onClick={onNext}
          disabled={!canProceed || isSubmitting}
        >
          {nextLabel}
        </button>
      ) : (
        <button
          type="button"
          className="seller-xp-btn seller-xp-btn--primary"
          onClick={onPublish}
          disabled={!canProceed || isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="seller-xp-spinner" aria-hidden="true" />
              Publishing listing...
            </>
          ) : (
            publishLabel
          )}
        </button>
      )}
    </div>
  </div>
);

export default WizardShell;
