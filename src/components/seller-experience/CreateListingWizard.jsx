import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { createOwnerListing } from "../../services/propertyMobilityService";
import {
  LISTING_CATEGORIES,
  resolvePropertyMobilityErrorMessage,
} from "../PropertyMobility/propertyMobilityHelpers";
import WizardShell from "./WizardShell";
import InlineField from "./InlineField";
import { PremiumSelect } from "../ui";
import {
  isListingWizardValid,
  validateListingStep,
} from "./wizardValidation";
import "./seller-experience.css";

const STEPS = [
  { id: "category", label: "Category" },
  { id: "details", label: "Details" },
  { id: "location", label: "Location" },
  { id: "review", label: "Review" },
];

const CreateListingWizard = ({ onComplete, onCancel }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [values, setValues] = useState({
    category: "apartments",
    title: "",
    description: "",
    price: "",
    city: "",
    lat: "",
    lng: "",
  });

  const stepErrors = useMemo(() => validateListingStep(stepIndex, values), [stepIndex, values]);
  const showError = (field) => (touched[field] ? stepErrors[field] : undefined);

  const setField = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleNext = () => {
    const errors = validateListingStep(stepIndex, values);
    setTouched((prev) => ({
      ...prev,
      ...Object.fromEntries(Object.keys(errors).map((k) => [k, true])),
    }));
    if (Object.keys(errors).length) return;
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    if (stepIndex === 0 && onCancel) {
      onCancel();
      return;
    }
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const handlePublish = async () => {
    if (!isListingWizardValid(values)) return;
    setSubmitting(true);
    try {
      await createOwnerListing({
        category: values.category,
        title: values.title,
        description: values.description,
        price: Number(values.price),
        location: { city: values.city },
        coordinates: {
          lat: values.lat ? Number(values.lat) : 0,
          lng: values.lng ? Number(values.lng) : 0,
        },
        photos: [],
        amenities: [],
      });
      toast.success("Listing published.");
      onComplete?.();
    } catch (error) {
      toast.error(resolvePropertyMobilityErrorMessage(error, "Unable to create listing"));
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed =
    stepIndex === STEPS.length - 1
      ? isListingWizardValid(values)
      : Object.keys(validateListingStep(stepIndex, values)).length === 0;

  return (
    <WizardShell
      title="Create Property Listing"
      subtitle="List real estate or mobility in focused steps."
      steps={STEPS}
      currentStep={stepIndex}
      isFirstStep={stepIndex === 0}
      isLastStep={stepIndex === STEPS.length - 1}
      canProceed={canProceed}
      isSubmitting={submitting}
      onBack={handleBack}
      onFirstBack={onCancel}
      onNext={handleNext}
      onPublish={handlePublish}
      publishLabel="Publish listing"
    >
      {stepIndex === 0 && (
        <InlineField label="Listing category" required error={showError("category")}>
          <PremiumSelect
            value={values.category}
            onChange={(v) => setField("category", v)}
            options={LISTING_CATEGORIES.map((item) => ({ value: item.value, label: item.label }))}
            searchable
          />
        </InlineField>
      )}

      {stepIndex === 1 && (
        <>
          <InlineField label="Title" required error={showError("title")} htmlFor="listing-title">
            <input
              id="listing-title"
              className={`seller-xp-input dark:text-white ${showError("title") ? "has-error" : ""}`}
              value={values.title}
              onChange={(e) => setField("title", e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, title: true }))}
              placeholder="e.g. Modern 2-bedroom apartment"
            />
          </InlineField>
          <InlineField label="Price (RWF)" required error={showError("price")} htmlFor="listing-price">
            <input
              id="listing-price"
              type="number"
              className={`seller-xp-input dark:text-white ${showError("price") ? "has-error" : ""}`}
              value={values.price}
              onChange={(e) => setField("price", e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, price: true }))}
            />
          </InlineField>
          <InlineField label="Description" required error={showError("description")} htmlFor="listing-desc">
            <textarea
              id="listing-desc"
              rows={4}
              className={`seller-xp-input dark:text-white min-h-[120px] py-3 ${showError("description") ? "has-error" : ""}`}
              value={values.description}
              onChange={(e) => setField("description", e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, description: true }))}
              placeholder="Describe the property or vehicle…"
            />
          </InlineField>
        </>
      )}

      {stepIndex === 2 && (
        <>
          <InlineField label="City" required error={showError("city")} htmlFor="listing-city">
            <input
              id="listing-city"
              className={`seller-xp-input dark:text-white ${showError("city") ? "has-error" : ""}`}
              value={values.city}
              onChange={(e) => setField("city", e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, city: true }))}
              placeholder="e.g. Kigali"
            />
          </InlineField>
          <div className="grid grid-cols-2 gap-3">
            <InlineField label="Latitude" hint="Optional">
              <input
                className="seller-xp-input dark:text-white"
                value={values.lat}
                onChange={(e) => setField("lat", e.target.value)}
                placeholder="Optional"
              />
            </InlineField>
            <InlineField label="Longitude" hint="Optional">
              <input
                className="seller-xp-input dark:text-white"
                value={values.lng}
                onChange={(e) => setField("lng", e.target.value)}
                placeholder="Optional"
              />
            </InlineField>
          </div>
        </>
      )}

      {stepIndex === 3 && (
        <div>
          <p className="text-sm text-gray-500 mb-4">Review before publishing.</p>
          {[
            ["Category", LISTING_CATEGORIES.find((c) => c.value === values.category)?.label],
            ["Title", values.title],
            ["Price", `${values.price} RWF`],
            ["City", values.city],
          ].map(([label, val]) => (
            <div key={label} className="seller-xp-review-row dark:text-gray-200">
              <span className="text-gray-500">{label}</span>
              <span className="font-medium">{val}</span>
            </div>
          ))}
        </div>
      )}
    </WizardShell>
  );
};

export default CreateListingWizard;
