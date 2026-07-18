import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { YIPConfig, YIP_PUBLIC_NAME } from "../config/yipConfig";
import { createAssistantAdapter, ASSISTANT_PROVIDER_INDICATOR, SDKAssistantAdapter } from "../providers/AssistantProviderBridge";
import { createSession } from "./YIPSession";
import { YIPConversation } from "./YIPConversation";
import { createYEBOMemoryEngine } from "../memory/YEBOMemoryEngine";
import { createYEBOShoppingContext } from "../memory/YEBOShoppingContext";
import { YEBOMemoryContext } from "../memory/YEBOMemoryContext";
import { createContextEngine } from "../context/YIPContextEngine";
import { YIPEvents, YIP_EVENT } from "./YIPEvents";
import { YIPLogger } from "./YIPLogger";
import { YIPRegistry } from "./YIPRegistry";
import { YIPPromptLibrary } from "../prompts/YIPPromptLibrary";
import { consumeStream } from "../utils/streaming";
import { YIPAnalytics } from "../utils/analytics";
import { normalizeError, YIP_ERROR } from "../utils/errors";
import { YIPGatewayClient } from "../gateway/YIPGatewayClient";
import { YIPShoppingIntelligence } from "../intelligence/YIPShoppingIntelligence";
import { createDecisionEngine } from "../decision/DecisionEngine";
import { createYEBOIntelligenceEngine } from "../intelligence/YEBOIntelligenceEngine";
import { createAIOrchestrator } from "../orchestration/AIOrchestrator";
import { createKnowledgeEngine } from "../knowledge/KnowledgeEngine";
import { createKnowledgeSnapshot } from "../knowledge/KnowledgeSnapshot";
import { createAgentPlatform } from "../agents/AgentPlatform";
import { createProviderFactory } from "../providers/ProviderFactory";
import { connectOrchestrationToSDK } from "../orchestration/OrchestrationSDKBridge";
import { YIPContext } from "./YIPContext";

const WELCOME_MESSAGE = `Hi! I'm ${YIP_PUBLIC_NAME} — your Yebone shopping companion. Ask me anything about products, styles, or deals across Africa. Powered by YIP.`;

export const YIPProvider = ({ children, config: configOverride }) => {
  const sessionRef = useRef(createSession());
  const memoryRef = useRef(createYEBOMemoryEngine());
  const shoppingContextRef = useRef(createYEBOShoppingContext(memoryRef.current));
  const contextEngineRef = useRef(createContextEngine());
  const decisionEngineRef = useRef(null);
  if (!decisionEngineRef.current) {
    decisionEngineRef.current = createDecisionEngine({
      memoryEngine: memoryRef.current,
      contextEngine: contextEngineRef.current,
    });
  }
  const intelligenceEngineRef = useRef(null);
  if (!intelligenceEngineRef.current) {
    intelligenceEngineRef.current = createYEBOIntelligenceEngine({
      memoryEngine: memoryRef.current,
      decisionEngine: decisionEngineRef.current,
    });
  }
  const orchestratorRef = useRef(null);
  const providerFactoryRef = useRef(null);
  if (!providerFactoryRef.current) {
    providerFactoryRef.current = createProviderFactory({
      preferredProvider: "gateway",
      streamingEnabled: true,
      offlineMode: false,
      mockMode: true,
    });
  }
  if (!orchestratorRef.current) {
    orchestratorRef.current = createAIOrchestrator({
      memoryEngine: memoryRef.current,
      decisionEngine: decisionEngineRef.current,
      intelligenceEngine: intelligenceEngineRef.current,
      config: { preferredProvider: "gateway", streamingEnabled: true },
    });
    connectOrchestrationToSDK(orchestratorRef.current);
    providerFactoryRef.current.initialize();
  }
  const [currentProviderId, setCurrentProviderId] = useState(
    () => orchestratorRef.current?.providerManager?.currentProviderId || "openrouter"
  );
  const knowledgeEngineRef = useRef(null);
  if (!knowledgeEngineRef.current) {
    knowledgeEngineRef.current = createKnowledgeEngine({
      memoryEngine: memoryRef.current,
      decisionEngine: decisionEngineRef.current,
      intelligenceEngine: intelligenceEngineRef.current,
      orchestrator: orchestratorRef.current,
    });
  }
  const agentPlatformRef = useRef(null);
  if (!agentPlatformRef.current) {
    agentPlatformRef.current = createAgentPlatform({
      memoryEngine: memoryRef.current,
      decisionEngine: decisionEngineRef.current,
      intelligenceEngine: intelligenceEngineRef.current,
      knowledgeEngine: knowledgeEngineRef.current,
      orchestrator: orchestratorRef.current,
    });
  }
  const conversationRef = useRef(
    new YIPConversation([
      { id: "welcome", role: "assistant", content: WELCOME_MESSAGE, isWelcome: true },
    ])
  );

  const [config, setConfigState] = useState(() => {
    if (configOverride) YIPConfig.set(configOverride);
    return YIPConfig.get();
  });

  const adapterRef = useRef(null);
  if (!adapterRef.current) {
    adapterRef.current = createAssistantAdapter(
      config.provider,
      providerFactoryRef.current
    );
  }
  const [assistantProviderIndicator, setAssistantProviderIndicator] = useState(
    ASSISTANT_PROVIDER_INDICATOR.OFFLINE
  );
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [messages, setMessages] = useState(conversationRef.current.getAll());
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [partialResponse, setPartialResponse] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [lastError, setLastError] = useState(null);
  const [shoppingMode, setShoppingMode] = useState("chat");
  const [smartSearchResults, setSmartSearchResults] = useState(null);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [budgetAdvice, setBudgetAdvice] = useState(null);
  const [giftResults, setGiftResults] = useState(null);

  useEffect(() => {
    const session = sessionRef.current;
    session.start({ provider: config.provider });
    memoryRef.current.seedMockSession();
    adapterRef.current = createAssistantAdapter(
      config.provider,
      providerFactoryRef.current
    );
    adapterRef.current.connect(config).then(() => {
      setAssistantProviderIndicator(
        adapterRef.current.getProviderIndicator?.() || ASSISTANT_PROVIDER_INDICATOR.OFFLINE
      );
    }).catch(() => {
      setLastError(normalizeError({ code: YIP_ERROR.PROVIDER_UNAVAILABLE }));
      setAssistantProviderIndicator(ASSISTANT_PROVIDER_INDICATOR.MOCK_FALLBACK);
    });
    return () => session.end();
  }, [config.provider]);

  const syncMessages = useCallback(() => {
    setMessages(conversationRef.current.getAll());
  }, []);

  const openPanel = useCallback(() => {
    setIsPanelOpen(true);
    YIPAnalytics.trackAssistant("panel_open");
  }, []);

  const closePanel = useCallback(() => {
    setIsPanelOpen(false);
    YIPAnalytics.trackAssistant("panel_close");
  }, []);

  const togglePanel = useCallback(() => setIsPanelOpen((v) => !v), []);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = (text || inputValue || "").trim();
      if (!trimmed) return;

      setLastError(null);
      conversationRef.current.add("user", trimmed);
      memoryRef.current.pushConversation({ title: trimmed.slice(0, 40), role: "user" });
      syncMessages();
      setInputValue("");
      setIsTyping(true);
      YIPEvents.emit(YIP_EVENT.MESSAGE_SENT, { content: trimmed });
      YIPAnalytics.trackAssistant("message_sent");

      try {
        if (
          (config.provider === "gemini" || config.provider === "openrouter") &&
          !(adapterRef.current instanceof SDKAssistantAdapter)
        ) {
          adapterRef.current = createAssistantAdapter(
            config.provider,
            providerFactoryRef.current
          );
        }

        const adapter = adapterRef.current;
        // eslint-disable-next-line no-console
        console.info("[YEBO Assistant] sendMessage", {
          provider: config.provider,
          streaming: config.streaming,
          adapter: adapter?.constructor?.name,
        });

        if (!adapter.isAvailable()) {
          throw normalizeError({ code: YIP_ERROR.PROVIDER_UNAVAILABLE });
        }

        if (config.streaming && adapter.stream) {
          setIsStreaming(true);
          setPartialResponse("");
          const reply = conversationRef.current.add("assistant", "", { partial: true });
          syncMessages();

          await consumeStream(
            adapter.stream(trimmed, { config, sessionId: sessionRef.current.id }),
            (_chunk, accumulated) => {
            reply.content = accumulated;
            setPartialResponse(accumulated);
            syncMessages();
          });

          reply.partial = false;
          reply.placeholder = true;
        } else {
          const response = await adapter.complete(trimmed, {
            config,
            sessionId: sessionRef.current.id,
          });
          conversationRef.current.add("assistant", response.content, {
            placeholder: response.placeholder,
            recommendations: response.metadata?.recommendations || [],
          });
          YIPEvents.emit(YIP_EVENT.MESSAGE_RECEIVED, { content: response.content });
        }

        memoryRef.current.pushConversation({
          title: trimmed.slice(0, 40),
          role: "assistant",
        });
        setAssistantProviderIndicator(
          adapterRef.current.getProviderIndicator?.() || ASSISTANT_PROVIDER_INDICATOR.MOCK_FALLBACK
        );
        syncMessages();
      } catch (err) {
        const yipError = normalizeError(err);
        setLastError(yipError);
        YIPEvents.emit(YIP_EVENT.ERROR, yipError);
        YIPLogger.warn("sendMessage error", yipError);
      } finally {
        setIsTyping(false);
        setIsStreaming(false);
        setPartialResponse("");
      }
    },
    [inputValue, config, syncMessages]
  );

  const setActiveContext = useCallback((scope, data) => {
    shoppingContextRef.current.activate(scope, data);
    return contextEngineRef.current.build(scope, data);
  }, []);

  const getMemorySnapshot = useCallback(() => memoryRef.current.getSnapshot(), []);
  const getWelcomeMessage = useCallback(() => memoryRef.current.getWelcomeMessage(), []);

  const getRecommendations = useCallback(
    (scope) => decisionEngineRef.current.getRecommendations(scope),
    []
  );
  const getDecisionReason = useCallback(
    (id) => decisionEngineRef.current.getDecisionReason(id),
    []
  );
  const getDecisionSnapshot = useCallback(() => decisionEngineRef.current.getSnapshot(), []);

  const getRankedRecommendations = useCallback(
    (scope) => intelligenceEngineRef.current.getRankedRecommendations(scope),
    []
  );
  const getShoppingScore = useCallback(
    (type, scope) => intelligenceEngineRef.current.getShoppingScore(type, scope),
    []
  );
  const getConfidence = useCallback(
    (id, scope) => intelligenceEngineRef.current.getConfidence(id, scope),
    []
  );
  const getRecommendationReason = useCallback(
    (id) => intelligenceEngineRef.current.getRecommendationReason(id),
    []
  );
  const getPersonalization = useCallback(
    () => intelligenceEngineRef.current.getPersonalization(),
    []
  );
  const getIntelligenceSnapshot = useCallback(
    () => intelligenceEngineRef.current.getSnapshot(),
    []
  );

  const switchProvider = useCallback((id) => {
    const provider = orchestratorRef.current.switchProvider(id);
    try {
      providerFactoryRef.current.switchProvider(id);
    } catch {
      /* orchestration-only provider ids */
    }
    setCurrentProviderId(id);
    const next = YIPConfig.set({ provider: id });
    setConfigState(next);
    adapterRef.current = createAssistantAdapter(id, providerFactoryRef.current);
    YIPEvents.emit(YIP_EVENT.PROVIDER_CHANGE, { provider: id });
    return provider;
  }, []);

  const getProvider = useCallback(
    (id) => providerFactoryRef.current.getProvider(id || currentProviderId),
    [currentProviderId]
  );

  const getAvailableProviders = useCallback(
    () => orchestratorRef.current.getAvailableProviders(),
    [currentProviderId]
  );

  const getProviderHealth = useCallback(
    (providerId) => orchestratorRef.current.getProviderHealth(providerId),
    [currentProviderId]
  );

  const currentProvider = useMemo(
    () => orchestratorRef.current?.currentProvider ?? null,
    [currentProviderId]
  );

  const searchKnowledge = useCallback(
    (query, options) => knowledgeEngineRef.current.searchKnowledge(query, options),
    []
  );

  const getKnowledge = useCallback(
    (id) => knowledgeEngineRef.current.getKnowledge(id),
    []
  );

  const getKnowledgeDomains = useCallback(
    () => knowledgeEngineRef.current.getKnowledgeDomains(),
    []
  );

  const knowledgeSnapshot = useCallback(
    () => createKnowledgeSnapshot(knowledgeEngineRef.current),
    []
  );

  const routeTask = useCallback(
    (input, options) => agentPlatformRef.current.routeTask(input, options),
    []
  );

  const getAgent = useCallback(
    (id) => agentPlatformRef.current.getAgent(id),
    []
  );

  const getAgents = useCallback(
    () => agentPlatformRef.current.getAgents(),
    []
  );

  const getAgentCapabilities = useCallback(
    (agentId) => agentPlatformRef.current.getAgentCapabilities(agentId),
    []
  );

  const executeAgent = useCallback(
    (input, options) => agentPlatformRef.current.executeAgent(input, options),
    []
  );

  const runSmartSearch = useCallback(async (query, _products = []) => {
    setIsTyping(true);
    setLastError(null);
    try {
      memoryRef.current.addRecentSearch(query);
      const response = await YIPGatewayClient.search(query);
      const payload = response?.data || {};
      const toolPayload = payload.tool || {};
      const toolData = toolPayload.data || {};
      const products = toolPayload.success ? toolData.products || [] : [];
      const result = {
        query,
        results: products.map((product) => ({
          _id: product._id,
          name: product.name,
          discountPrice: product.discountPrice,
          images: product.images,
          shop: product.shop,
          reason: payload.message,
        })),
        summary: payload.message,
        searchRequest: payload.searchRequest || null,
        meta: toolData.meta || null,
        parsedIntent: payload.searchRequest
          ? { type: "search", language: payload.searchRequest.language }
          : { type: "search" },
        tool: toolPayload,
        gateway: true,
        production: true,
      };
      setSmartSearchResults(result);
      return result;
    } catch (err) {
      setLastError(normalizeError(err));
      return null;
    } finally {
      setIsTyping(false);
    }
  }, []);

  const runComparison = useCallback(async (products = []) => {
    setIsTyping(true);
    try {
      const result = await YIPShoppingIntelligence.compareProducts(products);
      setComparisonResult(result);
      return result;
    } finally {
      setIsTyping(false);
    }
  }, []);

  const runBudgetAdvice = useCallback(async (selection) => {
    setIsTyping(true);
    try {
      const result = await YIPShoppingIntelligence.budgetAdvice(selection);
      setBudgetAdvice(result);
      return result;
    } finally {
      setIsTyping(false);
    }
  }, []);

  const runGiftFinder = useCallback(async (categoryId) => {
    setIsTyping(true);
    try {
      const result = await YIPShoppingIntelligence.giftFinder(categoryId);
      setGiftResults(result);
      return result;
    } finally {
      setIsTyping(false);
    }
  }, []);

  const proactiveSuggestions = useMemo(
    () => YIPShoppingIntelligence.getProactiveSuggestions(memoryRef.current.getSnapshot()),
    [isPanelOpen, messages]
  );

  const shoppingTips = useMemo(() => YIPShoppingIntelligence.getShoppingTips(), []);

  const memoryContextValue = useMemo(
    () => ({
      engine: memoryRef.current,
      memory: memoryRef.current,
      shoppingContext: shoppingContextRef.current,
      getSnapshot: () => memoryRef.current.getSnapshot(),
      getWelcomeMessage: () => memoryRef.current.getWelcomeMessage(),
      setActiveScope: (scope, data) => shoppingContextRef.current.activate(scope, data),
      activateShoppingContext: (scope, data) => shoppingContextRef.current.activate(scope, data),
    }),
    []
  );

  const value = useMemo(
    () => ({
      // Branding
      publicName: YIP_PUBLIC_NAME,
      platformName: config.platformName,
      // Config
      config,
      setConfig: (partial) => {
        const next = YIPConfig.set(partial);
        setConfigState(next);
        adapterRef.current = createAssistantAdapter(next.provider, providerFactoryRef.current);
        YIPEvents.emit(YIP_EVENT.PROVIDER_CHANGE, { provider: next.provider });
        return next;
      },
      // UI panel (YEBO assistant)
      isPanelOpen,
      openPanel,
      closePanel,
      togglePanel,
      // Conversation
      messages,
      isTyping,
      isStreaming,
      partialResponse,
      inputValue,
      setInputValue,
      sendMessage,
      lastError,
      assistantProviderIndicator,
      // Adapter data
      suggestedPrompts: adapterRef.current.getSuggestedPrompts?.() || [],
      quickActions: adapterRef.current.getQuickActions?.() || [],
      conversationHistory: adapterRef.current.getConversationHistory?.() || [],
      isConnected: adapterRef.current.isAvailable?.() || false,
      // Platform services
      session: sessionRef.current,
      memory: memoryRef.current,
      memoryEngine: memoryRef.current,
      shoppingContextEngine: shoppingContextRef.current,
      getMemorySnapshot,
      getWelcomeMessage,
      contextEngine: contextEngineRef.current,
      setActiveContext,
      getMemorySnapshot,
      getWelcomeMessage,
      registry: YIPRegistry,
      prompts: YIPPromptLibrary,
      analytics: YIPAnalytics,
      events: YIPEvents,
      // Shopping intelligence (Phase 7C)
      intelligence: YIPShoppingIntelligence,
      shoppingMode,
      setShoppingMode,
      smartSearchResults,
      comparisonResult,
      budgetAdvice,
      giftResults,
      proactiveSuggestions,
      shoppingTips,
      runSmartSearch,
      runComparison,
      runBudgetAdvice,
      runGiftFinder,
      // Decision engine (Phase 7E)
      decisionEngine: decisionEngineRef.current,
      decisionContext: decisionEngineRef.current.decisionContext,
      getRecommendations,
      getDecisionReason,
      getDecisionSnapshot,
      // Intelligence layer (Phase 7F)
      intelligenceEngine: intelligenceEngineRef.current,
      getRankedRecommendations,
      getShoppingScore,
      getConfidence,
      getRecommendationReason,
      getPersonalization,
      getIntelligenceSnapshot,
      // AI orchestration (Phase 7G)
      orchestrator: orchestratorRef.current,
      providerManager: orchestratorRef.current.providerManager,
      providerRegistry: orchestratorRef.current.providerRegistry,
      // Provider SDK (Phase 8A.1)
      providerFactory: providerFactoryRef.current,
      providerHealth: providerFactoryRef.current.getHealthMonitor(),
      providerUsage: providerFactoryRef.current.getUsageTracker(),
      providerConfiguration: providerFactoryRef.current.getConfiguration(),
      getProvider,
      sdkProviderRegistry: providerFactoryRef.current.registry,
      currentProvider,
      currentProviderId,
      switchProvider,
      getAvailableProviders,
      getProviderHealth,
      // Knowledge platform (Phase 7H)
      knowledgeEngine: knowledgeEngineRef.current,
      knowledgeRegistry: knowledgeEngineRef.current.registry,
      knowledgeSearch: knowledgeEngineRef.current.search,
      knowledgeSnapshot,
      searchKnowledge,
      getKnowledge,
      getKnowledgeDomains,
      // Agent platform (Phase 7I)
      agentPlatform: agentPlatformRef.current,
      agentRegistry: agentPlatformRef.current.registry,
      agentManager: agentPlatformRef.current.manager,
      routeTask,
      getAgent,
      getAgents,
      getAgentCapabilities,
      executeAgent,
      // Back-compat aliases for Phase 7A hooks
      isConnectedLegacy: adapterRef.current.isAvailable?.() || false,
    }),
    [
      config,
      isPanelOpen,
      openPanel,
      closePanel,
      togglePanel,
      messages,
      isTyping,
      isStreaming,
      partialResponse,
      inputValue,
      sendMessage,
      lastError,
      setActiveContext,
      shoppingMode,
      smartSearchResults,
      comparisonResult,
      budgetAdvice,
      giftResults,
      proactiveSuggestions,
      shoppingTips,
      runSmartSearch,
      runComparison,
      runBudgetAdvice,
      runGiftFinder,
      getMemorySnapshot,
      getWelcomeMessage,
      getRecommendations,
      getDecisionReason,
      getDecisionSnapshot,
      getRankedRecommendations,
      getShoppingScore,
      getConfidence,
      getRecommendationReason,
      getPersonalization,
      getIntelligenceSnapshot,
      assistantProviderIndicator,
      currentProvider,
      currentProviderId,
      switchProvider,
      getAvailableProviders,
      getProviderHealth,
      getProvider,
      searchKnowledge,
      getKnowledge,
      getKnowledgeDomains,
      knowledgeSnapshot,
      routeTask,
      getAgent,
      getAgents,
      getAgentCapabilities,
      executeAgent,
    ]
  );

  return (
    <YEBOMemoryContext.Provider value={memoryContextValue}>
      <YIPContext.Provider value={value}>{children}</YIPContext.Provider>
    </YEBOMemoryContext.Provider>
  );
};
