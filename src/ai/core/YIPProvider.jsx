import React, { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect } from "react";
import { YIPConfig, YIP_PUBLIC_NAME } from "../config/yipConfig";
import { createProviderAdapter } from "../providers/providerFactory";
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
import { YIPShoppingIntelligence } from "../intelligence/YIPShoppingIntelligence";
import { createDecisionEngine } from "../decision/DecisionEngine";
import { createYEBOIntelligenceEngine } from "../intelligence/YEBOIntelligenceEngine";

const YIPContext = createContext(null);

const WELCOME_MESSAGE = `Hi! I'm ${YIP_PUBLIC_NAME} — your Yebone shopping companion. Ask me anything about products, styles, or deals across Africa. Powered by YIP.`;

export const useYIP = () => {
  const ctx = useContext(YIPContext);
  if (!ctx) throw new Error("useYIP must be used within YIPProvider");
  return ctx;
};

export const useYIPOptional = () => useContext(YIPContext);

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
  const conversationRef = useRef(
    new YIPConversation([
      { id: "welcome", role: "assistant", content: WELCOME_MESSAGE, isWelcome: true },
    ])
  );

  const [config, setConfigState] = useState(() => {
    if (configOverride) YIPConfig.set(configOverride);
    return YIPConfig.get();
  });

  const adapterRef = useRef(createProviderAdapter(config.provider));
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
    adapterRef.current.connect(config).catch(() => {
      setLastError(normalizeError({ code: YIP_ERROR.PROVIDER_UNAVAILABLE }));
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
        const adapter = adapterRef.current;
        if (!adapter.isAvailable()) {
          throw normalizeError({ code: YIP_ERROR.PROVIDER_UNAVAILABLE });
        }

        if (config.streaming && adapter.stream) {
          setIsStreaming(true);
          setPartialResponse("");
          const reply = conversationRef.current.add("assistant", "", { partial: true });
          syncMessages();

          await consumeStream(adapter.stream(trimmed, { config }), (_chunk, accumulated) => {
            reply.content = accumulated;
            setPartialResponse(accumulated);
            syncMessages();
          });

          reply.partial = false;
          reply.placeholder = true;
        } else {
          const response = await adapter.complete(trimmed, { config });
          conversationRef.current.add("assistant", response.content, {
            placeholder: response.placeholder,
          });
          YIPEvents.emit(YIP_EVENT.MESSAGE_RECEIVED, { content: response.content });
        }

        memoryRef.current.pushConversation({
          title: trimmed.slice(0, 40),
          role: "assistant",
        });
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

  const runSmartSearch = useCallback(async (query, products = []) => {
    setIsTyping(true);
    setLastError(null);
    try {
      memoryRef.current.addRecentSearch(query);
      const result = await YIPShoppingIntelligence.smartSearch(query, products);
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
        adapterRef.current = createProviderAdapter(next.provider);
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
    ]
  );

  return (
    <YEBOMemoryContext.Provider value={memoryContextValue}>
      <YIPContext.Provider value={value}>{children}</YIPContext.Provider>
    </YEBOMemoryContext.Provider>
  );
};

export default YIPContext;
