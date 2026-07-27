const stripHtml = (html = "") =>
  String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const isEmptyDescription = (html) => {
  const text = stripHtml(html);
  return !text || text.length < 3;
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
  }

  if (stepIndex === 1) {
    if (!values.title?.trim()) errors.title = "Title is required.";
    if (!values.description?.trim()) errors.description = "Description is required.";
    if (!values.price && values.price !== 0) errors.price = "Price is required.";
    else if (Number(values.price) <= 0) errors.price = "Enter a valid price.";
  }

  if (stepIndex === 2) {
    if (!values.city?.trim()) errors.city = "City is required.";
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
  for (let i = 0; i < 3; i += 1) {
    if (Object.keys(validateListingStep(i, values)).length) return false;
  }
  return true;
};
