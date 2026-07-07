/** Standard Action Framework context — Phase 8B.4 */

export const createActionContext = (partial = {}) => ({
  conversation: partial.conversation ?? null,
  session: partial.session ?? null,
  provider: partial.provider ?? null,
  user: partial.user ?? null,
  organization: partial.organization ?? {},
  permissions: partial.permissions ?? {},
  metadata: partial.metadata ?? {},
});

export default createActionContext;
