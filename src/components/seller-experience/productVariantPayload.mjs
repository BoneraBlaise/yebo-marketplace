const slugify = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "option";

export const createVariantRow = (overrides = {}) => ({
  id: overrides.id || `var_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  optionValueId: overrides.optionValueId || "",
  label: overrides.label || "",
  sku: overrides.sku || "",
  discountPrice: overrides.discountPrice ?? "",
  originalPrice: overrides.originalPrice ?? "",
  stock: overrides.stock ?? "",
  isAvailable: overrides.isAvailable !== false,
  images: Array.isArray(overrides.images) ? overrides.images : [],
});

export const createEmptyProductWizardValues = () => ({
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
  hasVariants: false,
  optionGroupId: "",
  optionGroupName: "Package",
  optionValues: [],
  optionValueIds: [],
  variants: [],
});

export const createOptionValueId = (label, index = 0) =>
  `val_${slugify(label)}_${index}_${Math.random().toString(36).slice(2, 6)}`;

export const syncVariantsWithOptionValues = ({
  optionValues = [],
  optionValueIds = [],
  variants = [],
} = {}) => {
  const nextIds = optionValues.map(
    (label, index) => optionValueIds[index] || createOptionValueId(label, index)
  );

  const nextVariants = optionValues.map((label, index) => {
    const existing =
      variants.find((variant) => variant.optionValueId === nextIds[index]) ||
      variants[index];

    return createVariantRow({
      ...existing,
      label,
      optionValueId: nextIds[index],
    });
  });

  return {
    optionValueIds: nextIds,
    variants: nextVariants,
  };
};

export const productToWizardValues = (product = {}) => {
  const base = {
    ...createEmptyProductWizardValues(),
    name: product.name || "",
    description: product.description || "",
    category: product.category || "",
    tags: product.tags || "",
    originalPrice:
      product.originalPrice === undefined || product.originalPrice === null
        ? ""
        : String(product.originalPrice),
    discountPrice:
      product.discountPrice === undefined || product.discountPrice === null
        ? ""
        : String(product.discountPrice),
    stock: product.stock === undefined || product.stock === null ? "" : String(product.stock),
    productType: product.productType || "normal",
    condition: product.condition || "new",
    location: product.location || "Kigali-Rwanda",
    images: Array.isArray(product.images) ? product.images.map((image) => image.url) : [],
    coverIndex: 0,
    hasVariants: Boolean(product.hasVariants),
  };

  if (!product.hasVariants) {
    return base;
  }

  const group = product.optionGroups?.[0] || { id: "", name: "Package", values: [] };
  const optionValues = (group.values || []).map((value) => value.label);
  const optionValueIds = (group.values || []).map((value) => value.id);

  const variants = (product.variants || []).map((variant) => {
    const label =
      group.values?.find((value) => value.id === variant.optionValueIds?.[0])?.label ||
      variant.title ||
      "";

    return createVariantRow({
      id: variant.id,
      optionValueId: variant.optionValueIds?.[0] || "",
      label,
      sku: variant.sku || "",
      discountPrice:
        variant.discountPrice === undefined || variant.discountPrice === null
          ? ""
          : String(variant.discountPrice),
      originalPrice:
        variant.originalPrice === undefined || variant.originalPrice === null
          ? ""
          : String(variant.originalPrice),
      stock: variant.stock === undefined || variant.stock === null ? "" : String(variant.stock),
      isAvailable: variant.isAvailable !== false,
      images: Array.isArray(variant.images) ? variant.images.map((image) => image.url) : [],
    });
  });

  return {
    ...base,
    optionGroupId: group.id || `opt_${slugify(group.name || "package")}`,
    optionGroupName: group.name || "Package",
    optionValues,
    optionValueIds,
    variants,
  };
};

export const buildProductApiPayload = (values, shopId, orderedImages = []) => {
  const payload = {
    name: values.name,
    description: values.description,
    category: values.category,
    tags: values.tags,
    shopId,
    images: orderedImages,
    productType: values.productType,
    condition: values.condition,
    location: values.location,
    hasVariants: Boolean(values.hasVariants),
  };

  if (!values.hasVariants) {
    return {
      ...payload,
      originalPrice: values.originalPrice === "" ? undefined : Number(values.originalPrice),
      discountPrice: Number(values.discountPrice),
      stock: Number(values.stock),
      optionGroups: [],
      variants: [],
    };
  }

  const groupId = values.optionGroupId || `opt_${slugify(values.optionGroupName || "package")}`;
  const optionGroups = [
    {
      id: groupId,
      name: values.optionGroupName?.trim() || "Package",
      position: 0,
      values: (values.optionValues || []).map((label, index) => ({
        id: values.optionValueIds?.[index] || createOptionValueId(label, index),
        label: String(label).trim(),
        position: index,
      })),
    },
  ];

  const variants = (values.variants || []).map((variant, index) => ({
    id: variant.id,
    sku: String(variant.sku || "").trim(),
    optionValueIds: [optionGroups[0].values[index]?.id || variant.optionValueId].filter(Boolean),
    title: optionGroups[0].values[index]?.label || variant.label || undefined,
    discountPrice: Number(variant.discountPrice),
    originalPrice:
      variant.originalPrice === "" || variant.originalPrice == null
        ? undefined
        : Number(variant.originalPrice),
    stock: Number(variant.stock),
    isAvailable: variant.isAvailable !== false,
    images: variant.images || [],
  }));

  const prices = variants
    .filter((variant) => variant.isAvailable !== false)
    .map((variant) => variant.discountPrice)
    .filter((price) => Number.isFinite(price));
  const totalStock = variants.reduce(
    (sum, variant) => sum + Math.max(0, Number(variant.stock) || 0),
    0
  );

  return {
    ...payload,
    optionGroups,
    variants,
    discountPrice: prices.length ? Math.min(...prices) : 0,
    originalPrice: undefined,
    stock: totalStock,
  };
};

export const getVariantSummary = (values = {}) => {
  if (!values.hasVariants) {
    return {
      priceLabel: values.discountPrice ? `${values.discountPrice} RWF` : "—",
      stockLabel: values.stock === "" ? "—" : String(values.stock),
      variantCount: 0,
    };
  }

  const prices = (values.variants || [])
    .map((variant) => Number(variant.discountPrice))
    .filter((price) => Number.isFinite(price) && price >= 0);
  const stock = (values.variants || []).reduce(
    (sum, variant) => sum + Math.max(0, Number(variant.stock) || 0),
    0
  );

  return {
    priceLabel: prices.length ? `From ${Math.min(...prices)} RWF` : "—",
    stockLabel: String(stock),
    variantCount: values.variants?.length || 0,
  };
};
