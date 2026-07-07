import { YIPPromptLibrary } from "../prompts/YIPPromptLibrary";
import { YIP_PUBLIC_NAME, YIP_PLATFORM_NAME, YIPConfig } from "../config/yipConfig";

/** Organizes existing system prompt sources — no new prompt content */
export class SystemPromptManager {
  constructor({ promptLibrary = YIPPromptLibrary, templateId = "support" } = {}) {
    this.promptLibrary = promptLibrary;
    this.templateId = templateId;
  }

  loadSystemPrompt({ provider = null, organization = {} } = {}) {
    const config = YIPConfig.get();
    const template = this.promptLibrary?.get?.(this.templateId) || null;

    return {
      instruction: `You are ${YIP_PUBLIC_NAME}, the ${YIP_PLATFORM_NAME} shopping assistant for Yebone across Africa.`,
      templateId: template?.id || this.templateId,
      templateDescription: template?.description || null,
      templateCategory: template?.category || null,
      organization: {
        publicName: organization.publicName || config.publicName || YIP_PUBLIC_NAME,
        platformName: organization.platformName || config.platformName || YIP_PLATFORM_NAME,
        region: organization.region || config.region || null,
        language: organization.language || config.language || null,
      },
      provider: provider
        ? {
            id: provider.id || null,
            name: provider.name || null,
            model: provider.configuration?.config?.textProvider || provider.configuration?.activeProvider || null,
          }
        : null,
    };
  }

  listTemplates() {
    return this.promptLibrary?.list?.() || [];
  }
}

export const createSystemPromptManager = (options) => new SystemPromptManager(options);

export default SystemPromptManager;
