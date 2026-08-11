const slugify = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "option";

const MAX_OPTION_GROUPS = 3;

const extractSkuToken = (variantId = "", fallbackIndex = 0) => {
  const cleaned = String(variantId).replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  if (cleaned.length >= 4) {
    return cleaned.slice(-8).padStart(8, "0").slice(0, 8);
  }
  return String(fallbackIndex + 1).padStart(8, "0");
};

export const generateVariantSku = (variantId, index = 0, usedSkus = new Set()) => {
  const token = extractSkuToken(variantId, index);
  let candidate = `YB-${token}-${String(index + 1).padStart(3, "0")}`;
  let attempt = 0;

  while (usedSkus.has(candidate.toUpperCase()) && attempt < 100) {
    attempt += 1;
    candidate = `YB-${token}-${String(index + 1).padStart(3, "0")}${attempt}`;
  }

  usedSkus.add(candidate.toUpperCase());
  return candidate;
};

export const ensureVariantSkus = (variants = []) => {
  const usedSkus = new Set();

  return variants.map((variant, index) => {
    const existing = String(variant.sku || "").trim();
    if (existing) {
      usedSkus.add(existing.toUpperCase());
      return variant;
    }

    return {
      ...variant,
      sku: generateVariantSku(variant.id, index, usedSkus),
    };
  });
};

export const createVariantRow = (overrides = {}) => {
  const optionValueIds = Array.isArray(overrides.optionValueIds)
    ? overrides.optionValueIds.filter(Boolean)
    : overrides.optionValueId
      ? [overrides.optionValueId]
      : [];

  const combinationKey =
    overrides.combinationKey || buildCombinationKey(optionValueIds);

  return {
    id: overrides.id || `var_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    optionValueIds,
    optionValueId: optionValueIds[0] || "",
    combinationKey,
    label: overrides.label || "",
    sku: overrides.sku || "",
    discountPrice: overrides.discountPrice ?? "",
    originalPrice: overrides.originalPrice ?? "",
    stock: overrides.stock ?? "",
    isAvailable: overrides.isAvailable !== false,
    images: Array.isArray(overrides.images) ? overrides.images : [],
  };
};

export const createEmptyOptionGroup = (name = "Option") => ({
  id: `opt_${slugify(name)}_${Date.now()}`,
  name,
  values: [{ id: createOptionValueId(name, 0), label: "" }],
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
  optionGroups: [],
  excludedCombinationKeys: [],
  variants: [],
});

export const createOptionValueId = (label, index = 0) =>
  `val_${slugify(label)}_${index}_${Math.random().toString(36).slice(2, 6)}`;

export const buildCombinationKey = (optionValueIds = []) =>
  [...optionValueIds].filter(Boolean).sort().join("|");

export const sortOptionGroups = (optionGroups = []) =>
  [...optionGroups].sort((a, b) => (Number(a.position) || 0) - (Number(b.position) || 0));

export const buildVariantLabel = (optionGroups = [], optionValueIds = []) => {
  const groups = sortOptionGroups(optionGroups);
  const labels = optionValueIds
    .map((valueId) => {
      for (const group of groups) {
        const value = (group.values || []).find((entry) => entry.id === valueId);
        if (value?.label) return String(value.label).trim();
      }
      return null;
    })
    .filter(Boolean);

  return labels.join(" · ");
};

export const generateVariantCombinations = (optionGroups = []) => {
  const groups = sortOptionGroups(optionGroups)
    .map((group) => ({
      ...group,
      values: (group.values || []).filter((value) => String(value.label || "").trim()),
    }))
    .filter((group) => group.values.length > 0);

  if (!groups.length) return [];

  return groups.reduce((acc, group) => {
    if (!acc.length) {
      return group.values.map((value) => [value.id]);
    }

    const next = [];
    for (const combo of acc) {
      for (const value of group.values) {
        next.push([...combo, value.id]);
      }
    }
    return next;
  }, []);
};

export const normalizeWizardOptionGroups = (values = {}) => {
  if (Array.isArray(values.optionGroups) && values.optionGroups.length > 0) {
    return values.optionGroups.map((group, index) => ({
      id: group.id || `opt_${slugify(group.name || "option")}_${index}`,
      name: group.name || "Option",
      position: Number.isFinite(Number(group.position)) ? Number(group.position) : index,
      values: (group.values || []).map((value, valueIndex) => ({
        id: value.id || createOptionValueId(value.label || "option", valueIndex),
        label: String(value.label ?? "").trim(),
      })),
    }));
  }

  if ((values.optionValues || []).length > 0 || values.optionGroupName) {
    return [
      {
        id: values.optionGroupId || `opt_${slugify(values.optionGroupName || "package")}`,
        name: values.optionGroupName || "Package",
        position: 0,
        values: (values.optionValues || []).map((label, index) => ({
          id: values.optionValueIds?.[index] || createOptionValueId(label, index),
          label: String(label ?? "").trim(),
        })),
      },
    ];
  }

  return [];
};

const migrateLegacyVariants = (variants = []) =>
  variants.map((variant) => {
    const optionValueIds = Array.isArray(variant.optionValueIds)
      ? variant.optionValueIds.filter(Boolean)
      : variant.optionValueId
        ? [variant.optionValueId]
        : [];

    return {
      ...variant,
      optionValueIds,
      combinationKey: variant.combinationKey || buildCombinationKey(optionValueIds),
    };
  });

export const syncVariantsWithOptionGroups = ({
  optionGroups = [],
  variants = [],
  excludedCombinationKeys = [],
} = {}) => {
  const excluded = new Set(excludedCombinationKeys || []);
  const normalizedGroups = sortOptionGroups(optionGroups);
  const combinations = generateVariantCombinations(normalizedGroups);
  const existingByKey = new Map();

  for (const variant of migrateLegacyVariants(variants)) {
    const key =
      variant.combinationKey ||
      buildCombinationKey(variant.optionValueIds || []);
    if (key) existingByKey.set(key, variant);
  }

  const nextVariants = combinations
    .map((optionValueIds) => {
      const combinationKey = buildCombinationKey(optionValueIds);
      if (excluded.has(combinationKey)) return null;

      const existing = existingByKey.get(combinationKey);
      return createVariantRow({
        ...existing,
        optionValueIds,
        combinationKey,
        label: buildVariantLabel(normalizedGroups, optionValueIds),
      });
    })
    .filter(Boolean);

  return {
    optionGroups: normalizedGroups,
    variants: ensureVariantSkus(nextVariants),
    excludedCombinationKeys: [...excluded],
  };
};

export const syncVariantsWithOptionValues = ({
  optionValues = [],
  optionValueIds = [],
  variants = [],
  optionGroupId = "",
  optionGroupName = "Package",
  excludedCombinationKeys = [],
} = {}) =>
  syncVariantsWithOptionGroups({
    optionGroups: [
      {
        id: optionGroupId || `opt_${slugify(optionGroupName || "package")}`,
        name: optionGroupName || "Package",
        position: 0,
        values: optionValues.map((label, index) => ({
          id: optionValueIds[index] || createOptionValueId(label, index),
          label: String(label ?? "").trim(),
        })),
      },
    ],
    variants,
    excludedCombinationKeys,
  });

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

  const optionGroups = (product.optionGroups || []).map((group, index) => ({
    id: group.id || `opt_${slugify(group.name || "option")}_${index}`,
    name: group.name || "Option",
    position: Number.isFinite(Number(group.position)) ? Number(group.position) : index,
    values: (group.values || []).map((value, valueIndex) => ({
      id: value.id || createOptionValueId(value.label, valueIndex),
      label: value.label || "",
    })),
  }));

  const variants = (product.variants || []).map((variant) => {
    const optionValueIds = Array.isArray(variant.optionValueIds)
      ? variant.optionValueIds.filter(Boolean)
      : [];

    return createVariantRow({
      id: variant.id,
      optionValueIds,
      label: buildVariantLabel(optionGroups, optionValueIds) || variant.title || "",
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
    optionGroups,
    variants,
    excludedCombinationKeys: [],
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

  const normalizedGroups = normalizeWizardOptionGroups(values);
  const optionGroups = normalizedGroups.map((group, index) => ({
    id: group.id,
    name: String(group.name || "Option").trim() || "Option",
    position: index,
    values: (group.values || [])
      .map((value, valueIndex) => ({
        id: value.id,
        label: String(value.label || "").trim(),
        position: valueIndex,
      }))
      .filter((value) => value.label),
  }));

  const variantsWithSkus = ensureVariantSkus(values.variants || []);
  const variants = variantsWithSkus.map((variant) => ({
    id: variant.id,
    sku: String(variant.sku || "").trim(),
    optionValueIds: variant.optionValueIds || [],
    title: variant.label || undefined,
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

export const MAX_VENDOR_OPTION_GROUPS = MAX_OPTION_GROUPS;
