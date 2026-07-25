/** Normalize API list payloads that may be arrays or paginated objects */
export const normalizeListPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.items)) return payload.items;
  if (payload && Array.isArray(payload.orders)) return payload.orders;
  if (payload && Array.isArray(payload.sellers)) return payload.sellers;
  if (payload && Array.isArray(payload.users)) return payload.users;
  if (payload && Array.isArray(payload.products)) return payload.products;
  if (payload && Array.isArray(payload.listings)) return payload.listings;
  return [];
};

export default normalizeListPayload;
