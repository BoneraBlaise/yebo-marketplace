import shoppingTemplate from "./templates/shopping";
import recommendationsTemplate from "./templates/recommendations";
import comparisonTemplate from "./templates/comparison";
import outfitTemplate from "./templates/outfit";
import vendorTemplate from "./templates/vendor";
import adminTemplate from "./templates/admin";
import searchTemplate from "./templates/search";
import supportTemplate from "./templates/support";
import productSummaryTemplate from "./templates/productSummary";

const templates = new Map([
  [shoppingTemplate.id, shoppingTemplate],
  [recommendationsTemplate.id, recommendationsTemplate],
  [comparisonTemplate.id, comparisonTemplate],
  [outfitTemplate.id, outfitTemplate],
  [vendorTemplate.id, vendorTemplate],
  [adminTemplate.id, adminTemplate],
  [searchTemplate.id, searchTemplate],
  [supportTemplate.id, supportTemplate],
  [productSummaryTemplate.id, productSummaryTemplate],
]);

export const YIPPromptLibrary = {
  get(id) {
    return templates.get(id) || null;
  },

  list() {
    return Array.from(templates.values());
  },

  /** Future: render template with variables */
  render(id, _variables = {}) {
    const tpl = templates.get(id);
    if (!tpl) return null;
    return { id, rendered: null, note: "Template rendering connects when prompts are defined." };
  },
};

export default YIPPromptLibrary;
