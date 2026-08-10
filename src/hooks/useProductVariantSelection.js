import { useEffect, useMemo, useState } from "react";
import {
  findVariantBySelection,
  getDefaultSelection,
  getDisplayImages,
  getResolvedOffer,
  productHasVariantSelector,
} from "../utils/productVariantSelection";

/**
 * Local PDP variant selection state — no network requests on option change.
 */
export function useProductVariantSelection(product) {
  const hasVariantSelector = useMemo(
    () => productHasVariantSelector(product),
    [product]
  );

  const [selection, setSelection] = useState(() =>
    hasVariantSelector ? getDefaultSelection(product) : {}
  );

  useEffect(() => {
    if (hasVariantSelector) {
      setSelection(getDefaultSelection(product));
    } else {
      setSelection({});
    }
  }, [
    product?._id,
    hasVariantSelector,
    product?.variants?.length,
    product?.optionGroups?.length,
  ]);

  const selectedVariant = useMemo(() => {
    if (!hasVariantSelector) return null;
    return findVariantBySelection(product, selection);
  }, [hasVariantSelector, product, selection]);

  const displayOffer = useMemo(
    () => getResolvedOffer(product, selectedVariant),
    [product, selectedVariant]
  );

  const displayImages = useMemo(
    () => getDisplayImages(product, selectedVariant),
    [product, selectedVariant]
  );

  const handleSelectionChange = (groupId, valueId) => {
    setSelection((prev) => ({ ...prev, [groupId]: valueId }));
  };

  return {
    hasVariantSelector,
    selection,
    selectedVariant,
    displayOffer,
    displayImages,
    handleSelectionChange,
  };
}
