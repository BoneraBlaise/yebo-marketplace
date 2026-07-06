export const defaultAgentConfig = {
  collaborationEnabled: true,
  planningEnabled: true,
  maxCollaborators: 3,
  defaultScope: "homepage",
  mockMode: true,
};

export const mergeAgentConfig = (partial = {}) => ({
  ...defaultAgentConfig,
  ...partial,
});

export default defaultAgentConfig;
