import yeboAIService from "../../services/yeboAIService";

const stripHtml = (html = "") =>
  String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const hasMeaningfulDescription = (html = "") => stripHtml(html).length >= 10;

export const buildProductDescriptionPrompt = (values = {}) => {
  const lines = [
    `Product name: ${values.name || "Untitled product"}`,
    values.category ? `Category: ${values.category}` : null,
    values.tags ? `Tags: ${values.tags}` : null,
  ].filter(Boolean);

  if (values.hasVariants && values.optionGroups?.length) {
    for (const group of values.optionGroups) {
      const labels = (group.values || [])
        .map((value) => String(value.label || "").trim())
        .filter(Boolean);
      if (labels.length) {
        lines.push(`${group.name || "Option"}: ${labels.join(", ")}`);
      }
    }
  }

  return [
    "Write a concise, professional e-commerce product description for YEBONE marketplace.",
    "Use short HTML paragraphs and optional bullet lists.",
    "Focus on benefits, key features, and who the product is for.",
    "Do not invent specifications that were not provided.",
    "",
    ...lines,
  ].join("\n");
};

const extractGeneratedDescription = (response = {}) => {
  const payload = response?.data?.result || response?.data || response?.result || response;
  const content =
    payload?.content ||
    payload?.description ||
    payload?.text ||
    payload?.html ||
    (typeof payload === "string" ? payload : "");

  const normalized = String(content || "").trim();
  if (!normalized) {
    throw new Error("YEBO AI did not return a description.");
  }

  return normalized.startsWith("<") ? normalized : `<p>${normalized}</p>`;
};

export const generateProductDescriptionWithAI = async (values, vendorId) => {
  if (!vendorId) {
    throw new Error("Vendor session required for YEBO AI.");
  }

  const response = await yeboAIService.service({
    serviceType: "description",
    input: buildProductDescriptionPrompt(values),
    vendorId,
    options: {
      productName: values.name,
      category: values.category,
      tags: values.tags,
      optionGroups: values.optionGroups,
      hasVariants: values.hasVariants,
    },
  });

  return extractGeneratedDescription(response);
};
