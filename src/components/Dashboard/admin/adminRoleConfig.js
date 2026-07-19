/**
 * Presentation-only role configuration for admin navigation.
 * Does NOT enforce permissions — backend auth remains unchanged.
 */

export const ASSISTANT_ADMIN_HIDDEN_IDS = [
  20, // Payment Center
  21, // Commission
  22, // Referrals
  23, // AI Control
  24, // System Settings
  25, // Reports (executive)
  27, // Delivery Settings
];

export const resolveAdminTier = (user) =>
  user?.adminTier === "assistant" ? "assistant" : "super";

export const isNavVisible = (itemId, tier) => {
  if (tier === "super") return true;
  return !ASSISTANT_ADMIN_HIDDEN_IDS.includes(itemId);
};
