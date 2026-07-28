import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import { createProduct, getAllProducts, getAllProductsShop } from "../../redux/actions/product";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";
import WizardShell from "./WizardShell";
import InlineField from "./InlineField";
import { PremiumSelect } from "../ui";
import {
  isProductWizardValid,
  validateProductStep,
} from "./wizardValidation";
import "./seller-experience.css";

const STEPS = [
  { id: "basics", label: "Basic Information" },
  { id: "pricing", label: "Pricing" },
  { id: "images", label: "Media" },
  { id: "review", label: "Review & Publish" },
];

const CreateProductWizard = ({ embedded = false, onComplete, onCancel }) => {
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [stepIndex, setStepIndex] = useState(0);
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const [values, setValues] = useState({
    name: "",
    description: "",
    category: "",
    tags: "",
    originalPrice: "",
    discountPrice: "",
    stock: "",
    productType: "normal",
    condition: "new",
    location: "Kigali-Rwanda",
    images: [],
    coverIndex: 0,
  });

  const categoryOptions = useMemo(
    () =>
      categoriesData.flatMap((cat) =>
        cat.subcategories.map((sub) => ({ value: sub.title, label: sub.title }))
      ),
    []
  );

  const stepErrors = useMemo(() => validateProductStep(stepIndex, values), [stepIndex, values]);
  const showError = (field) => (touched[field] ? stepErrors[field] : undefined);

  const setField = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const reorderImages = (from, to) => {
    setValues((prev) => {
      const next = [...prev.images];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      let coverIndex = prev.coverIndex;
      if (from === prev.coverIndex) coverIndex = to;
      else if (from < prev.coverIndex && to >= prev.coverIndex) coverIndex -= 1;
      else if (from > prev.coverIndex && to <= prev.coverIndex) coverIndex += 1;
      return { ...prev, images: next, coverIndex };
    });
  };

  const addFiles = (files) => {
    const list = Array.from(files || []);
    if (values.images.length + list.length > 5) {
      setTouched((prev) => ({ ...prev, images: true }));
      return;
    }
    list.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setValues((prev) => ({ ...prev, images: [...prev.images, reader.result] }));
        }
      };
      reader.readAsDataURL(file);
    });
    setTouched((prev) => ({ ...prev, images: true }));
  };

  const handleNext = () => {
    const errors = validateProductStep(stepIndex, values);
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
    if (!isProductWizardValid(values)) return;
    if (!seller?._id) {
      toast.error("Seller session not found. Please sign in again.");
      return;
    }
    setSubmitting(true);
    const orderedImages =
      values.coverIndex > 0
        ? [
            values.images[values.coverIndex],
            ...values.images.filter((_, i) => i !== values.coverIndex),
          ]
        : values.images;

    try {
      const result = await dispatch(
        createProduct(
          values.name,
          values.description,
          values.category,
          values.tags,
          values.originalPrice,
          values.discountPrice,
          values.stock,
          seller._id,
          orderedImages
        )
      );

      if (result?.success) {
        toast.success("Product published successfully!");
        dispatch(getAllProductsShop(seller._id));
        dispatch(getAllProducts());
        if (embedded && onComplete) {
          onComplete();
        }
        if (result.product?._id) {
          navigate(`/product/${result.product._id}`, {
            state: { product: result.product },
          });
        } else if (!embedded) {
          navigate("/dashboard-products");
        }
      } else if (result?.message) {
        toast.error(result.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed =
    stepIndex === STEPS.length - 1
      ? isProductWizardValid(values)
      : Object.keys(validateProductStep(stepIndex, values)).length === 0;

  return (
    <WizardShell
      title="Create Product"
      subtitle="A guided flow — publish when everything looks right."
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
      publishLabel="Publish product"
    >
      {stepIndex === 0 && (
        <>
          <InlineField label="Product name" required error={showError("name")} htmlFor="product-name">
            <input
              id="product-name"
              className={`seller-xp-input dark:text-white ${showError("name") ? "has-error" : ""}`}
              value={values.name}
              onChange={(e) => setField("name", e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, name: true }))}
              placeholder="e.g. Wireless earbuds"
              aria-invalid={Boolean(showError("name"))}
              aria-describedby={showError("name") ? "product-name-error" : undefined}
            />
          </InlineField>
          <InlineField label="Category" required error={showError("category")}>
            <PremiumSelect
              value={values.category === "Choose a category" ? "" : values.category}
              onChange={(v) => setField("category", v)}
              options={categoryOptions}
              placeholder="Choose a category"
              searchable
            />
          </InlineField>
          <InlineField label="Description" required error={showError("description")}>
            <ReactQuill
              value={values.description}
              onChange={(v) => setField("description", v)}
              onBlur={() => setTouched((p) => ({ ...p, description: true }))}
              placeholder="Describe your product…"
              className="mt-1 bg-white dark:bg-gray-900 rounded-xl"
            />
          </InlineField>
          <InlineField label="Tags" hint="Optional — comma separated">
            <input
              className="seller-xp-input dark:text-white"
              value={values.tags}
              onChange={(e) => setField("tags", e.target.value)}
              placeholder="e.g. electronics, audio"
            />
          </InlineField>
        </>
      )}

      {stepIndex === 1 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InlineField label="Original price" htmlFor="original-price">
              <input
                id="original-price"
                type="number"
                className="seller-xp-input dark:text-white"
                value={values.originalPrice}
                onChange={(e) => setField("originalPrice", e.target.value)}
                placeholder="RWF"
              />
            </InlineField>
            <InlineField label="Selling price" required error={showError("discountPrice")} htmlFor="discount-price">
              <input
                id="discount-price"
                type="number"
                className={`seller-xp-input dark:text-white ${showError("discountPrice") ? "has-error" : ""}`}
                value={values.discountPrice}
                onChange={(e) => setField("discountPrice", e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, discountPrice: true }))}
                placeholder="RWF"
              />
            </InlineField>
          </div>
          <InlineField label="Stock" required error={showError("stock")} htmlFor="product-stock">
            <input
              id="product-stock"
              type="number"
              className={`seller-xp-input dark:text-white ${showError("stock") ? "has-error" : ""}`}
              value={values.stock}
              onChange={(e) => setField("stock", e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, stock: true }))}
              min="0"
            />
          </InlineField>
          <details className="mt-4 text-sm">
            <summary className="cursor-pointer text-gray-500 font-medium">Additional options</summary>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              <InlineField label="Product type">
                <PremiumSelect
                  value={values.productType}
                  onChange={(v) => setField("productType", v)}
                  options={[
                    { value: "normal", label: "Normal" },
                    { value: "flashsale", label: "Flash Sale" },
                    { value: "wholesale", label: "Wholesale" },
                    { value: "daily deal", label: "Daily Deal" },
                    { value: "Pay Later", label: "Pay Later" },
                  ]}
                />
              </InlineField>
              <InlineField label="Condition">
                <PremiumSelect
                  value={values.condition}
                  onChange={(v) => setField("condition", v)}
                  options={[
                    { value: "new", label: "New" },
                    { value: "used", label: "Used" },
                  ]}
                />
              </InlineField>
              <InlineField label="Location">
                <input
                  className="seller-xp-input dark:text-white"
                  value={values.location}
                  onChange={(e) => setField("location", e.target.value)}
                />
              </InlineField>
            </div>
          </details>
        </>
      )}

      {stepIndex === 2 && (
        <>
          <InlineField label="Product images" required error={showError("images")}>
            <div
              className={`seller-xp-dropzone ${dragOver ? "is-dragover" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                addFiles(e.dataTransfer.files);
              }}
              onClick={() => document.getElementById("product-images-input")?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") document.getElementById("product-images-input")?.click();
              }}
            >
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Drag & drop images here</p>
              <p className="text-xs text-gray-400 mt-1">Up to 5 images · Click to browse</p>
            </div>
            <input
              id="product-images-input"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
            />
          </InlineField>
          {values.images.length > 0 && (
            <div className="seller-xp-image-grid">
              {values.images.map((src, index) => (
                <div
                  key={`${index}-${String(src).slice(0, 24)}`}
                  className={`seller-xp-image-thumb ${values.coverIndex === index ? "is-cover" : ""}`}
                  onClick={() => setField("coverIndex", index)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight" && index < values.images.length - 1) reorderImages(index, index + 1);
                    if (e.key === "ArrowLeft" && index > 0) reorderImages(index, index - 1);
                  }}
                  role="button"
                  tabIndex={0}
                  title={values.coverIndex === index ? "Cover image" : "Set as cover"}
                >
                  <img src={src} alt="" />
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-400 mt-2">Tap an image to set as cover. Use arrow keys to reorder focus.</p>
        </>
      )}

      {stepIndex === 3 && (
        <div>
          <p className="text-sm text-gray-500 mb-4">Review your listing before publishing.</p>
          {[
            ["Name", values.name],
            ["Category", values.category],
            ["Price", `${values.discountPrice} RWF`],
            ["Stock", values.stock],
            ["Images", `${values.images.length} uploaded`],
            ["Type", values.productType],
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

export default CreateProductWizard;
