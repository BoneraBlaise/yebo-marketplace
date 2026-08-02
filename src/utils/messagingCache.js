/** In-memory messaging cache — instant UI, background refresh. Frontend only. */

const conversationStore = new Map();
const threadStore = new Map();
const inflightThreads = new Map();

const STALE_MS = 5 * 60 * 1000;

const conversationKey = (identity, search, archived) =>
  `${identity}|${search || ""}|${archived ? "1" : "0"}`;

const threadKey = (identity, conversationId) => `${identity}|${conversationId}`;

export const getCachedConversations = (identity, search, archived) => {
  const entry = conversationStore.get(conversationKey(identity, search, archived));
  if (!entry) return null;
  return entry.data;
};

export const setCachedConversations = (identity, search, archived, data) => {
  conversationStore.set(conversationKey(identity, search, archived), {
    data,
    at: Date.now(),
  });
};

export const getCachedThread = (identity, conversationId) => {
  const entry = threadStore.get(threadKey(identity, conversationId));
  if (!entry) return null;
  return { messages: entry.messages, offers: entry.offers, at: entry.at };
};

export const setCachedThread = (identity, conversationId, messages, offers) => {
  threadStore.set(threadKey(identity, conversationId), {
    messages,
    offers,
    at: Date.now(),
  });
};

export const isThreadStale = (identity, conversationId) => {
  const entry = threadStore.get(threadKey(identity, conversationId));
  if (!entry) return true;
  return Date.now() - entry.at > STALE_MS;
};

/** Prefetch thread messages in background (deduped). */
export const prefetchThread = (identity, conversationId, loader) => {
  const key = threadKey(identity, conversationId);
  if (threadStore.has(key) || inflightThreads.has(key)) return inflightThreads.get(key);
  const promise = loader()
    .then(({ messages, offers }) => {
      setCachedThread(identity, conversationId, messages, offers);
      return { messages, offers };
    })
    .finally(() => inflightThreads.delete(key));
  inflightThreads.set(key, promise);
  return promise;
};

export const invalidateThread = (identity, conversationId) => {
  threadStore.delete(threadKey(identity, conversationId));
};
