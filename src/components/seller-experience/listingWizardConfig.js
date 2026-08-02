import {
  PROPERTY_CATEGORIES,
  MOBILITY_CATEGORIES,
  isPropertyCategory,
  isMobilityCategory,
} from "../PropertyMobility/propertyMobilityHelpers";

export const LISTING_WIZARD_STEPS = [
  { id: "category", label: "Category" },
  { id: "details", label: "Details" },
  { id: "pricing", label: "Pricing" },
  { id: "location", label: "Location" },
  { id: "media", label: "Photos" },
  { id: "review", label: "Review" },
];

export const LISTING_TYPES = [
  { value: "for_sale", label: "For Sale" },
  { value: "for_rent", label: "For Rent" },
  { value: "lease", label: "Lease" },
  { value: "auction", label: "Auction" },
];

export const PRICE_TYPES = [
  { value: "one_time", label: "One-time" },
  { value: "per_hour", label: "Per Hour" },
  { value: "per_day", label: "Per Day" },
  { value: "per_week", label: "Per Week" },
  { value: "per_month", label: "Per Month" },
  { value: "per_year", label: "Per Year" },
];

export const CURRENCIES = [
  { value: "RWF", label: "RWF — Rwandan Franc" },
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "KES", label: "KES — Kenyan Shilling" },
];

export const PROPERTY_AMENITIES = [
  "Parking",
  "Security",
  "Swimming Pool",
  "Gym",
  "Garden",
  "Balcony",
  "Furnished",
  "Air Conditioning",
  "Wi-Fi",
  "Pet Friendly",
];

export const VEHICLE_CONDITIONS = [
  { value: "new", label: "New" },
  { value: "used", label: "Used" },
  { value: "certified", label: "Certified Pre-owned" },
];

export const FUEL_TYPES = [
  { value: "petrol", label: "Petrol" },
  { value: "diesel", label: "Diesel" },
  { value: "electric", label: "Electric" },
  { value: "hybrid", label: "Hybrid" },
];

export const TRANSMISSION_TYPES = [
  { value: "automatic", label: "Automatic" },
  { value: "manual", label: "Manual" },
];

export const MAX_LISTING_PHOTOS = 10;

export const DEFAULT_LISTING_VALUES = {
  category: "apartments",
  listingType: "for_sale",
  title: "",
  description: "",
  price: "",
  currency: "RWF",
  priceType: "one_time",
  bedrooms: "",
  bathrooms: "",
  area: "",
  parking: "",
  amenities: [],
  brand: "",
  model: "",
  year: "",
  mileage: "",
  fuel: "petrol",
  transmission: "automatic",
  condition: "used",
  city: "",
  district: "",
  street: "",
  mapsUrl: "",
  contactPhone: "",
  contactEmail: "",
  photos: [],
  coverIndex: 0,
  videoFile: null,
  youtubeUrl: "",
};

export const suggestPriceType = (category, listingType) => {
  if (listingType === "for_sale" || listingType === "auction") return "one_time";
  if (isPropertyCategory(category)) {
    if (listingType === "lease") return "per_year";
    return "per_month";
  }
  if (category === "cars" || category === "trucks") return "per_day";
  if (category === "motorcycles" || category === "bicycles") return "per_day";
  return "one_time";
};

export const formatPriceTypeLabel = (value) =>
  PRICE_TYPES.find((item) => item.value === value)?.label || value;

export const formatListingTypeLabel = (value) =>
  LISTING_TYPES.find((item) => item.value === value)?.label || value;

export const computeListingQuality = (values) => {
  let score = 0;
  const photoCount = values.photos?.length || 0;

  if (photoCount >= 5) score += 35;
  else if (photoCount >= 3) score += 25;
  else if (photoCount >= 1) score += 12;

  if (values.title?.trim().length >= 12) score += 15;
  if (values.description?.trim().length >= 80) score += 20;
  if (values.city?.trim()) score += 10;
  if (values.district?.trim()) score += 5;
  if (values.street?.trim()) score += 5;

  if (isPropertyCategory(values.category)) {
    if (values.bedrooms) score += 4;
    if (values.bathrooms) score += 3;
    if (values.area) score += 3;
  } else if (isMobilityCategory(values.category)) {
    if (values.brand) score += 4;
    if (values.model) score += 4;
    if (values.year) score += 2;
  }

  if (values.youtubeUrl?.trim() || values.videoFile) score += 5;

  if (score >= 75) return { level: "excellent", label: "Excellent", score };
  if (score >= 50) return { level: "good", label: "Good", score };
  return { level: "needs_improvement", label: "Needs improvement", score };
};

export const generateListingDescription = (values) => {
  const typeLabel = formatListingTypeLabel(values.listingType);
  const categoryLabel =
    [...PROPERTY_CATEGORIES, ...MOBILITY_CATEGORIES].find((c) => c.value === values.category)?.label ||
    values.category;

  if (isPropertyCategory(values.category)) {
    const parts = [
      `${values.title || categoryLabel} available ${typeLabel.toLowerCase()}.`,
      values.bedrooms ? `${values.bedrooms} bedroom${Number(values.bedrooms) !== 1 ? "s" : ""}.` : null,
      values.bathrooms ? `${values.bathrooms} bathroom${Number(values.bathrooms) !== 1 ? "s" : ""}.` : null,
      values.area ? `${values.area} m² living space.` : null,
      values.parking ? `Parking: ${values.parking}.` : null,
      values.amenities?.length ? `Amenities include ${values.amenities.join(", ")}.` : null,
      [values.street, values.district, values.city].filter(Boolean).length
        ? `Located in ${[values.street, values.district, values.city].filter(Boolean).join(", ")}.`
        : null,
    ].filter(Boolean);
    return parts.join(" ");
  }

  const parts = [
    `${values.brand || ""} ${values.model || categoryLabel}`.trim() + ` ${typeLabel.toLowerCase()}.`,
    values.year ? `Model year ${values.year}.` : null,
    values.mileage ? `${Number(values.mileage).toLocaleString()} km on the odometer.` : null,
    values.fuel ? `${values.fuel.charAt(0).toUpperCase() + values.fuel.slice(1)} engine.` : null,
    values.transmission ? `${values.transmission} transmission.` : null,
    values.condition ? `Condition: ${values.condition.replace("_", " ")}.` : null,
    values.city ? `Available in ${values.city}.` : null,
  ].filter(Boolean);
  return parts.join(" ");
};

export const buildListingPayload = (values) => {
  const quality = computeListingQuality(values);
  const orderedPhotos =
    values.coverIndex > 0 && values.photos?.length
      ? [
          values.photos[values.coverIndex],
          ...values.photos.filter((_, i) => i !== values.coverIndex),
        ]
      : values.photos || [];

  const attributes = isPropertyCategory(values.category)
    ? {
        bedrooms: values.bedrooms || null,
        bathrooms: values.bathrooms || null,
        area: values.area || null,
        parking: values.parking || null,
      }
    : {
        brand: values.brand || null,
        model: values.model || null,
        year: values.year || null,
        mileage: values.mileage || null,
        fuel: values.fuel || null,
        transmission: values.transmission || null,
        condition: values.condition || null,
      };

  const videos = [];
  if (values.youtubeUrl?.trim()) {
    videos.push({ type: "youtube", url: values.youtubeUrl.trim() });
  }
  if (values.videoFile) {
    videos.push({ type: "upload", url: values.videoFile });
  }

  return {
    category: values.category,
    title: values.title.trim(),
    description: values.description.trim(),
    price: Number(values.price),
    publish: true,
    location: {
      city: values.city.trim(),
      district: values.district?.trim() || "",
      street: values.street?.trim() || "",
      mapsUrl: values.mapsUrl?.trim() || "",
    },
    coordinates: {},
    photos: orderedPhotos,
    videos,
    amenities: values.amenities || [],
    ownerInfo: {
      listingType: values.listingType,
      priceType: values.priceType,
      currency: values.currency,
      contactPhone: values.contactPhone?.trim() || "",
      contactEmail: values.contactEmail?.trim() || "",
      attributes,
      listingQuality: quality,
    },
  };
};
