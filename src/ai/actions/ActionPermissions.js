/** Action permission checks — Phase 8C */

export const checkPermissions = (action, context = {}) => {
  const required = action?.permissions || [];
  const granted = context.permissions || {};

  if (!required.length) return { allowed: true, missing: [] };

  const missing = required.filter((perm) => {
    if (typeof granted === "object" && granted !== null) {
      return !granted[perm];
    }
    return true;
  });

  return { allowed: missing.length === 0, missing };
};

export const hasPermission = (context, permission) => {
  const granted = context?.permissions || {};
  return Boolean(granted[permission]);
};

export default { checkPermissions, hasPermission };
