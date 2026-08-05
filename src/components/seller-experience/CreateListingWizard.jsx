import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { createOwnerListing } from "../../services/propertyMobilityService";
import { assertVendorSession, buildVendorAuthHeaders } from "../../config/vendorSession";
import useVendor from "../../hooks/useVendor";
import {
  PROPERTY_CATEGORIES,
  MOBILITY_CATEGORIES,
  FUTURE_MOBILITY_CATEGORIES,
  isPropertyCategory,
  isMobilityCategory,
  resolvePropertyMobilityErrorMessage,
  logPropertyMobilityError,
  formatCategory,
} from "../PropertyMobility/propertyMobilityHelpers";
import WizardShell from "./WizardShell";
import InlineField from "./InlineField";
import ListingMediaUploader from "./ListingMediaUploader";
import ListingPublishSuccess from "./ListingPublishSuccess";
import { PremiumSelect } from "../ui";
import {
  isListingWizardValid,
  validateListingStep,
} from "./wizardValidation";
import {
  LISTING_WIZARD_STEPS,
  LISTING_TYPES,
  PRICE_TYPES,
  CURRENCIES,
  PROPERTY_AMENITIES,
  VEHICLE_CONDITIONS,
  FUEL_TYPES,
  TRANSMISSION_TYPES,
  DEFAULT_LISTING_VALUES,
  suggestPriceType,
  formatPriceTypeLabel,
  formatListingTypeLabel,
  generateListingDescription,
  buildListingPayload,
  computeListingQuality,
} from "./listingWizardConfig";
import "./seller-experience.css";
import "./listing-publish-success.css";

const CreateListingWizard = ({ onComplete, onCancel, initialCategory }) => {
  const { isVendorReady, user } = useVendor();
  const [stepIndex, setStepIndex] = useState(0);
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [publishError, setPublishError] = useState(null);
  const [publishedListing, setPublishedListing] = useState(null);
  const [navigatingAway, setNavigatingAway] = useState(false);
  const [generatingDesc, setGeneratingDesc] = useState(false);
  const [values, setValues] = useState({
    ...DEFAULT_LISTING_VALUES,
    category: initialCategory || DEFAULT_LISTING_VALUES.category,
    contactPhone: user?.phoneNumber || "",
    contactEmail: user?.email || "",
  });

  useEffect(() => {
    if (user?.phoneNumber && !values.contactPhone) {
      setValues((prev) => ({ ...prev, contactPhone: user.phoneNumber }));
    }
    if (user?.email && !values.contactEmail) {
      setValues((prev) => ({ ...prev, contactEmail: user.email }));
    }
  }, [user, values.contactPhone, values.contactEmail]);

  const stepErrors = useMemo(() => validateListingStep(stepIndex, values), [stepIndex, values]);
  const showError = (field) => (touched[field] ? stepErrors[field] : undefined);
  const quality = useMemo(() => computeListingQuality(values), [values]);
  const isSaleType = values.listingType === "for_sale" || values.listingType === "auction";

  const setField = (field, value) => {
    setValues((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "category" || field === "listingType") {
        next.priceType = suggestPriceType(
          field === "category" ? value : prev.category,
          field === "listingType" ? value : prev.listingType
        );
      }
      return next;
    });
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const setValuesDirect = (updater) => {
    setValues(updater);
    setTouched((prev) => ({ ...prev, photos: true }));
  };

  const toggleAmenity = (name) => {
    setValues((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(name)
        ? prev.amenities.filter((a) => a !== name)
        : [...prev.amenities, name],
    }));
  };

  const handleGenerateDescription = () => {
    setGeneratingDesc(true);
    window.setTimeout(() => {
      setField("description", generateListingDescription(values));
      setGeneratingDesc(false);
      toast.success("Description generated — review and edit as needed.");
    }, 600);
  };

  const handleNext = () => {
    const errors = validateListingStep(stepIndex, values);
    setTouched((prev) => ({
      ...prev,
      ...Object.fromEntries(Object.keys(errors).map((k) => [k, true])),
    }));
    if (Object.keys(errors).length) return;
    setStepIndex((i) => Math.min(i + 1, LISTING_WIZARD_STEPS.length - 1));
  };

  const handleBack = () => {
    if (stepIndex === 0 && onCancel) {
      onCancel();
      return;
    }
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const handlePublish = async () => {
    if (!isVendorReady) {
      toast.error("Login required. Your session may have expired — please sign in again.");
      return;
    }
    if (!isListingWizardValid(values)) {
      const errors = validateListingStep(LISTING_WIZARD_STEPS.length - 1, values);
      setTouched((prev) => ({
        ...prev,
        ...Object.fromEntries(Object.keys(errors).map((k) => [k, true])),
      }));
      const firstError = Object.values(errors)[0];
      toast.error(firstError || "Please complete all required fields.");
      return;
    }

    setSubmitting(true);
    setPublishError(null);

    try {
      assertVendorSession();
    } catch (authError) {
      setSubmitting(false);
      setPublishError(authError.message);
      toast.error(authError.message);
      return;
    }

    if (process.env.NODE_ENV !== "production") {
      console.info("[ListingWizard] Auth headers", buildVendorAuthHeaders());
    }

    const payload = buildListingPayload(values);
    console.info("[ListingWizard] Publishing", {
      category: payload.category,
      photoCount: payload.photos?.length,
      title: payload.title,
    });

    try {
      const response = await createOwnerListing(payload);
      const listing = response?.data;
      if (!listing?.listingId) {
        throw new Error("Server did not return a listing ID.");
      }
      setPublishedListing(listing);
      toast.success("✓ Property published successfully.");
    } catch (error) {
      logPropertyMobilityError("handlePublish", error, { stepIndex, category: values.category });
      const message = resolvePropertyMobilityErrorMessage(error, "Unable to create listing.");
      setPublishError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!publishedListing || navigatingAway) return undefined;
    const timer = window.setTimeout(() => {
      setNavigatingAway(true);
      onComplete?.(publishedListing);
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [publishedListing, navigatingAway, onComplete]);

  const handleCreateAnother = () => {
    setPublishedListing(null);
    setNavigatingAway(false);
    setPublishError(null);
    setStepIndex(0);
    setTouched({});
    setValues({
      ...DEFAULT_LISTING_VALUES,
      category: initialCategory || DEFAULT_LISTING_VALUES.category,
      contactPhone: user?.phoneNumber || "",
      contactEmail: user?.email || "",
    });
  };

  const canProceed =
    stepIndex === LISTING_WIZARD_STEPS.length - 1
      ? isListingWizardValid(values)
      : Object.keys(validateListingStep(stepIndex, values)).length === 0;

  const mapsLink = values.mapsUrl?.trim();

  if (publishedListing) {
    return (
      <ListingPublishSuccess
        listing={publishedListing}
        onCreateAnother={handleCreateAnother}
        onClose={onCancel}
        autoRedirect
      />
    );
  }

  return (
    <WizardShell
      title="Property & Mobility"
      subtitle="List real estate or vehicles in a guided, premium flow."
      steps={LISTING_WIZARD_STEPS}
      currentStep={stepIndex}
      isFirstStep={stepIndex === 0}
      isLastStep={stepIndex === LISTING_WIZARD_STEPS.length - 1}
      canProceed={canProceed}
      isSubmitting={submitting}
      onBack={handleBack}
      onFirstBack={onCancel}
      onNext={handleNext}
      onPublish={handlePublish}
      publishLabel={publishError ? "Retry publish" : "Publish listing"}
    >
      {publishError && stepIndex === LISTING_WIZARD_STEPS.length - 1 && (
        <div className="listing-publish-error" role="alert">
          <p className="listing-publish-error__title">Publish failed</p>
          <p className="listing-publish-error__message">{publishError}</p>
          <p className="listing-publish-error__hint">Your entered data is saved. Fix the issue above and tap Retry.</p>
        </div>
      )}
      {stepIndex === 0 && (
        <>
          <InlineField label="Category" required error={showError("category")}>
            <div className="listing-category-grid">
              {[...PROPERTY_CATEGORIES, ...MOBILITY_CATEGORIES].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`listing-category-chip${values.category === item.value ? " is-selected" : ""}`}
                  onClick={() => setField("category", item.value)}
                >
                  {item.label}
                </button>
              ))}
              {FUTURE_MOBILITY_CATEGORIES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className="listing-category-chip is-disabled"
                  disabled
                  title="Coming soon"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </InlineField>

          <InlineField label="Listing type" required error={showError("listingType")}>
            <div className="listing-type-row">
              {LISTING_TYPES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`listing-type-chip${values.listingType === item.value ? " is-selected" : ""}`}
                  onClick={() => setField("listingType", item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </InlineField>
        </>
      )}

      {stepIndex === 1 && (
        <>
          {isPropertyCategory(values.category) && (
            <div className="listing-fields-block">
              <p className="listing-fields-block__title">Property details</p>
              <div className="listing-fields-grid">
                {values.category !== "land" && (
                  <>
                    <InlineField label="Bedrooms" htmlFor="bedrooms">
                      <input
                        id="bedrooms"
                        type="number"
                        min="0"
                        className="seller-xp-input dark:text-white"
                        value={values.bedrooms}
                        onChange={(e) => setField("bedrooms", e.target.value)}
                      />
                    </InlineField>
                    <InlineField label="Bathrooms" htmlFor="bathrooms">
                      <input
                        id="bathrooms"
                        type="number"
                        min="0"
                        className="seller-xp-input dark:text-white"
                        value={values.bathrooms}
                        onChange={(e) => setField("bathrooms", e.target.value)}
                      />
                    </InlineField>
                  </>
                )}
                <InlineField label="Area (m²)" htmlFor="area">
                  <input
                    id="area"
                    type="number"
                    min="0"
                    className="seller-xp-input dark:text-white"
                    value={values.area}
                    onChange={(e) => setField("area", e.target.value)}
                  />
                </InlineField>
                <InlineField label="Parking" htmlFor="parking">
                  <input
                    id="parking"
                    className="seller-xp-input dark:text-white"
                    value={values.parking}
                    onChange={(e) => setField("parking", e.target.value)}
                    placeholder="e.g. 2 spaces"
                  />
                </InlineField>
              </div>
              <InlineField label="Amenities">
                <div className="listing-amenities">
                  {PROPERTY_AMENITIES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={`listing-amenity-chip${values.amenities.includes(item) ? " is-selected" : ""}`}
                      onClick={() => toggleAmenity(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </InlineField>
            </div>
          )}

          {isMobilityCategory(values.category) && (
            <div className="listing-fields-block">
              <p className="listing-fields-block__title">Vehicle details</p>
              <div className="listing-fields-grid">
                <InlineField label="Brand" required error={showError("brand")} htmlFor="brand">
                  <input
                    id="brand"
                    className={`seller-xp-input dark:text-white ${showError("brand") ? "has-error" : ""}`}
                    value={values.brand}
                    onChange={(e) => setField("brand", e.target.value)}
                    placeholder="e.g. Toyota"
                  />
                </InlineField>
                <InlineField label="Model" required error={showError("model")} htmlFor="model">
                  <input
                    id="model"
                    className={`seller-xp-input dark:text-white ${showError("model") ? "has-error" : ""}`}
                    value={values.model}
                    onChange={(e) => setField("model", e.target.value)}
                    placeholder="e.g. RAV4"
                  />
                </InlineField>
                <InlineField label="Year" htmlFor="year">
                  <input
                    id="year"
                    type="number"
                    className="seller-xp-input dark:text-white"
                    value={values.year}
                    onChange={(e) => setField("year", e.target.value)}
                  />
                </InlineField>
                <InlineField label="Mileage (km)" htmlFor="mileage">
                  <input
                    id="mileage"
                    type="number"
                    className="seller-xp-input dark:text-white"
                    value={values.mileage}
                    onChange={(e) => setField("mileage", e.target.value)}
                  />
                </InlineField>
                <InlineField label="Fuel">
                  <PremiumSelect
                    value={values.fuel}
                    onChange={(v) => setField("fuel", v)}
                    options={FUEL_TYPES}
                  />
                </InlineField>
                <InlineField label="Transmission">
                  <PremiumSelect
                    value={values.transmission}
                    onChange={(v) => setField("transmission", v)}
                    options={TRANSMISSION_TYPES}
                  />
                </InlineField>
                <InlineField label="Condition">
                  <PremiumSelect
                    value={values.condition}
                    onChange={(v) => setField("condition", v)}
                    options={VEHICLE_CONDITIONS}
                  />
                </InlineField>
              </div>
            </div>
          )}

          <InlineField label="Title" required error={showError("title")} htmlFor="listing-title">
            <input
              id="listing-title"
              className={`seller-xp-input dark:text-white ${showError("title") ? "has-error" : ""}`}
              value={values.title}
              onChange={(e) => setField("title", e.target.value)}
              placeholder={
                isPropertyCategory(values.category)
                  ? "e.g. Modern 2-bedroom apartment in Kigali"
                  : "e.g. 2022 Toyota RAV4 — low mileage"
              }
            />
          </InlineField>

          <InlineField label="Description" required error={showError("description")} htmlFor="listing-desc">
            <textarea
              id="listing-desc"
              rows={4}
              className={`seller-xp-input dark:text-white min-h-[100px] py-3 ${showError("description") ? "has-error" : ""}`}
              value={values.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Describe your listing…"
            />
            <button
              type="button"
              className="listing-ai-desc-btn"
              onClick={handleGenerateDescription}
              disabled={generatingDesc}
            >
              {generatingDesc ? "Generating…" : "✨ Generate Description"}
            </button>
          </InlineField>
        </>
      )}

      {stepIndex === 2 && (
        <>
          <div className="listing-fields-grid">
            <InlineField label="Price" required error={showError("price")} htmlFor="listing-price">
              <input
                id="listing-price"
                type="number"
                min="0"
                className={`seller-xp-input dark:text-white ${showError("price") ? "has-error" : ""}`}
                value={values.price}
                onChange={(e) => setField("price", e.target.value)}
              />
            </InlineField>
            <InlineField label="Currency" required error={showError("currency")}>
              <PremiumSelect
                value={values.currency}
                onChange={(v) => setField("currency", v)}
                options={CURRENCIES}
              />
            </InlineField>
          </div>

          {!isSaleType && (
            <InlineField label="Price type" required error={showError("priceType")} hint="Suggested based on your category">
              <PremiumSelect
                value={values.priceType}
                onChange={(v) => setField("priceType", v)}
                options={PRICE_TYPES.filter((p) => p.value !== "one_time")}
              />
            </InlineField>
          )}

          {isSaleType && (
            <p className="listing-price-hint">One-time pricing applies to {formatListingTypeLabel(values.listingType).toLowerCase()} listings.</p>
          )}
        </>
      )}

      {stepIndex === 3 && (
        <>
          <div className="listing-fields-grid">
            <InlineField label="City" required error={showError("city")} htmlFor="listing-city">
              <input
                id="listing-city"
                className={`seller-xp-input dark:text-white ${showError("city") ? "has-error" : ""}`}
                value={values.city}
                onChange={(e) => setField("city", e.target.value)}
                placeholder="e.g. Kigali"
              />
            </InlineField>
            <InlineField label="District" htmlFor="listing-district">
              <input
                id="listing-district"
                className="seller-xp-input dark:text-white"
                value={values.district}
                onChange={(e) => setField("district", e.target.value)}
                placeholder="e.g. Gasabo"
              />
            </InlineField>
            <div className="listing-field-full">
              <InlineField label="Street" htmlFor="listing-street">
                <input
                  id="listing-street"
                  className="seller-xp-input dark:text-white"
                  value={values.street}
                  onChange={(e) => setField("street", e.target.value)}
                  placeholder="Street address"
                />
              </InlineField>
            </div>
          </div>

          <InlineField label="Google Maps URL" hint="Optional — paste a maps link for buyers" error={showError("mapsUrl")}>
            <input
              type="url"
              className={`seller-xp-input dark:text-white ${showError("mapsUrl") ? "has-error" : ""}`}
              value={values.mapsUrl}
              onChange={(e) => setField("mapsUrl", e.target.value)}
              placeholder="https://maps.google.com/…"
            />
          </InlineField>

          {mapsLink && (
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="listing-maps-link"
            >
              Open location on Google Maps
            </a>
          )}

          <div className="listing-fields-grid mt-3">
            <InlineField label="Contact phone" htmlFor="contact-phone">
              <input
                id="contact-phone"
                type="tel"
                className="seller-xp-input dark:text-white"
                value={values.contactPhone}
                onChange={(e) => setField("contactPhone", e.target.value)}
              />
            </InlineField>
            <InlineField label="Contact email" htmlFor="contact-email">
              <input
                id="contact-email"
                type="email"
                className="seller-xp-input dark:text-white"
                value={values.contactEmail}
                onChange={(e) => setField("contactEmail", e.target.value)}
              />
            </InlineField>
          </div>
        </>
      )}

      {stepIndex === 4 && (
        <ListingMediaUploader
          values={values}
          setField={setField}
          setValues={setValuesDirect}
          showError={showError}
        />
      )}

      {stepIndex === 5 && (
        <div className="listing-review">
          <div className={`listing-media__quality listing-media__quality--${quality.level} mb-4`}>
            <span className="listing-media__quality-label">Listing quality</span>
            <strong>{quality.label}</strong>
            <span className="listing-media__quality-score">{quality.score}/100</span>
          </div>

          {values.photos?.length > 0 && (
            <div className="listing-review__photos">
              {values.photos.slice(0, 4).map((src, i) => (
                <img key={i} src={src} alt="" />
              ))}
              {values.photos.length > 4 && (
                <span className="listing-review__photos-more">+{values.photos.length - 4}</span>
              )}
            </div>
          )}

          {[
            ["Category", formatCategory(values.category)],
            ["Type", formatListingTypeLabel(values.listingType)],
            ["Title", values.title],
            [
              "Price",
              `${values.price} ${values.currency}${!isSaleType ? ` / ${formatPriceTypeLabel(values.priceType)}` : ""}`,
            ],
            ["Location", [values.street, values.district, values.city].filter(Boolean).join(", ") || values.city],
            ["Contact", values.contactPhone || values.contactEmail],
            ["Photos", `${values.photos?.length || 0} uploaded`],
            ...(values.amenities?.length ? [["Amenities", values.amenities.join(", ")]] : []),
          ].map(([label, val]) => (
            <div key={label} className="seller-xp-review-row dark:text-gray-200">
              <span className="text-gray-500">{label}</span>
              <span className="font-medium text-right max-w-[60%]">{val}</span>
            </div>
          ))}

          {values.description && (
            <div className="listing-review__desc">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Description</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-4">{values.description}</p>
            </div>
          )}
        </div>
      )}
    </WizardShell>
  );
};

export default CreateListingWizard;
