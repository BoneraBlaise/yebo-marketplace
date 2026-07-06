import { DECISION_SOURCE, DECISION_PRIORITY } from "./DecisionTypes";

let _seq = 0;

/** Build a normalized decision object. */
export const createDecision = ({
  id,
  type,
  title,
  description,
  confidence = 80,
  reason,
  priority = DECISION_PRIORITY.MEDIUM,
  source = DECISION_SOURCE.MOCK,
  action,
  metadata = {},
}) => ({
  id: id || `dec-${++_seq}`,
  type,
  title,
  description,
  confidence,
  reason,
  priority,
  source,
  action,
  metadata,
});

export const sortByPriority = (decisions) =>
  [...decisions].sort((a, b) => (a.priority || 99) - (b.priority || 99));

export const topDecision = (decisions) => sortByPriority(decisions)[0] || null;

export default { createDecision, sortByPriority, topDecision };
