import {
  isPropertyCategory,
  isMobilityCategory,
} from "../PropertyMobility/propertyMobilityHelpers";

const stripHtml = (html = "") =>
  String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const isEmptyDescription = (html) => {
  const text = stripHtml(html);
  return !text || text.length < 3;
};

export const validateProductVariants = (values) => {
  const errors = {};

  if (!values.hasVariants) {
    return errors;
  }

  if (!values.optionGroupName?.trim()) {
    errors.optionGroupName = "Option group name is required.";
  }

  const optionValues = (values.optionValues || []).map((value) => String(value).trim()).filter(Boolean);
  if (!optionValues.length) {
    errors.optionValues = "Add at least one option value.";
  }

  if (!values.variants?.length) {
    errors.variants = "Add at least one variant row.";
    return errors;
  }

  values.variants.forEach((variant, index) => {
    if (!variant.sku?.trim()) {
      errors[`variantSku_${index}`] = "SKU is required.";
    }
    if (variant.discountPrice === "" || variant.discountPrice == null) {
      errors[`variantPrice_${index}`] = "Price is required.";
    } else if (Number(variant.discountPrice) < 0) {
      errors[`variantPrice_${index}`] = "Enter a valid price.";
    }
    if (variant.stock === "" || variant.stock == null) {
      errors[`variantStock_${index}`] = "Stock is required.";
    } else if (Number(variant.stock) < 0) {
      errors[`variantStock_${index}`] = "Stock cannot be negative.";
    }
    if (
      variant.originalPrice !== "" &&
      variant.originalPrice != null &&
      Number(variant.originalPrice) < Number(variant.discountPrice)
    ) {
      errors[`variantCompare_${index}`] = "Compare-at price must be greater than or equal to price.";
    }
  });

  if (Object.keys(errors).some((key) => key.startsWith("variant"))) {
    errors.variants = "Complete SKU, price, and stock for each variant.";
  }

  return errors;
};

export const validateProductStep = (stepIndex, values) => {
  const errors = {};

  if (stepIndex === 0) {
    if (!values.name?.trim()) errors.name = "Product name is required.";
    if (!values.category || values.category === "Choose a category") {
      errors.category = "Category is required.";
    }
    if (isEmptyDescription(values.description)) {
      errors.description = "Please enter a description.";
    }
  }

  if (stepIndex === 1) {
    if (values.hasVariants) {
      Object.assign(errors, validateProductVariants(values));
    } else {
      if (values.discountPrice === "" || values.discountPrice == null) {
        errors.discountPrice = "Price is required.";
      } else if (Number(values.discountPrice) <= 0) {
        errors.discountPrice = "Enter a valid price.";
      }
      if (values.stock === "" || values.stock == null) {
        errors.stock = "Stock is required.";
      } else if (Number(values.stock) < 0) {
        errors.stock = "Stock cannot be negative.";
      }
    }
  }

  if (stepIndex === 2) {
    if (!values.images?.length) {
      errors.images = "Upload at least one image.";
    }
  }

  return errors;
};

export const validateListingStep = (stepIndex, values) => {
  const errors = {};

  if (stepIndex === 0) {
    if (!values.category) errors.category = "Category is required.";
    if (!values.listingType) errors.listingType = "Listing type is required.";
  }

  if (stepIndex === 1) {
    if (!values.title?.trim()) errors.title = "Title is required.";
    if (!values.description?.trim()) {
      errors.description = "Description is required.";
    } else if (values.description.trim().length < 10) {
      errors.description = "Description is too short.";
    }

    if (isMobilityCategory(values.category)) {
      if (!values.brand?.trim()) errors.brand = "Brand is required.";
      if (!values.model?.trim()) errors.model = "Model is required.";
    }
  }

  if (stepIndex === 2) {
    if (!values.price && values.price !== 0) errors.price = "Price is required.";
    else if (Number(values.price) <= 0) errors.price = "Enter a valid price.";
    if (!values.currency) errors.currency = "Currency is required.";
    if (!values.priceType) errors.priceType = "Price type is required.";
  }

  if (stepIndex === 3) {
    if (!values.city?.trim()) errors.city = "City is required.";
    const mapsUrl = values.mapsUrl?.trim();
    if (mapsUrl) {
      try {
        const url = new URL(mapsUrl);
        if (url.protocol !== "http:" && url.protocol !== "https:") {
          errors.mapsUrl = "Google Maps URL is invalid.";
        }
      } catch {
        errors.mapsUrl = "Google Maps URL is invalid.";
      }
    }
  }

  if (stepIndex === 4) {
    if (!values.photos?.length) errors.photos = "Upload at least one photo.";
  }

  return errors;
};

export const isProductWizardValid = (values) => {
  for (let i = 0; i < 3; i += 1) {
    if (Object.keys(validateProductStep(i, values)).length) return false;
  }
  return true;
};

export const isListingWizardValid = (values) => {
  for (let i = 0; i < 5; i += 1) {
    if (Object.keys(validateListingStep(i, values)).length) return false;
  }
  return true;
};
