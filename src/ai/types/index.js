/**
 * @typedef {'user' | 'assistant' | 'system'} YIPMessageRole
 */

/**
 * @typedef {Object} YIPMessage
 * @property {string} id
 * @property {YIPMessageRole} role
 * @property {string} content
 * @property {string} [timestamp]
 * @property {boolean} [placeholder]
 * @property {boolean} [isWelcome]
 * @property {boolean} [partial]
 */

/**
 * @typedef {Object} YIPAdapterResponse
 * @property {string} content
 * @property {boolean} [placeholder]
 * @property {Record<string, unknown>} [metadata]
 */

/**
 * @typedef {'openai' | 'gemini' | 'claude' | 'local' | 'mock'} YIPProviderId
 */

/**
 * @typedef {Object} YIPConfigShape
 * @property {string} publicName
 * @property {string} platformName
 * @property {YIPProviderId} provider
 * @property {string} model
 * @property {number} temperature
 * @property {boolean} streaming
 * @property {string} language
 * @property {string} region
 * @property {boolean} mockMode
 * @property {string} environment
 * @property {Record<string, boolean>} featureFlags
 */

/**
 * @typedef {Object} YIPFeatureModule
 * @property {string} id
 * @property {string} label
 * @property {string} [description]
 * @property {'planned' | 'beta' | 'active' | 'disabled'} status
 */

/**
 * @typedef {Object} YIPContextPayload
 * @property {string} scope
 * @property {number} timestamp
 * @property {Record<string, unknown>} [data]
 */

/**
 * @typedef {'provider_unavailable' | 'rate_limit' | 'timeout' | 'network' | 'unknown'} YIPErrorCode
 */

/**
 * @typedef {Object} YIPError
 * @property {YIPErrorCode} code
 * @property {string} message
 * @property {boolean} recoverable
 */

/**
 * @typedef {Object} YIPAnalyticsEvent
 * @property {string} type
 * @property {string} [featureId]
 * @property {Record<string, unknown>} [payload]
 * @property {number} timestamp
 */

export {};
