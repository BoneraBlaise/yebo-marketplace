import React, { useMemo } from "react";
import { HiOutlineUserGroup } from "react-icons/hi";
import { useAgentExecution } from "../../../ai/hooks/useAgents";
import AICard from "../primitives/AICard";

/** Agent execution status for YEBO Assistant — presentation only */
const YEBOAgentHint = ({ task = "find product", className, compact = false }) => {
  const execution = useAgentExecution(task);

  const display = useMemo(() => {
    if (!execution) return null;
    return {
      agent: execution.agentName,
      task: execution.taskType,
      steps: execution.steps || [],
      knowledge: execution.knowledgeUsed || [],
      decisions: execution.decisionsUsed || [],
      confidence: execution.confidence,
    };
  }, [execution]);

  if (!display) return null;

  if (compact) {
    return (
      <p className={`text-[10px] text-gray-500 ${className || ""}`}>
        <span className="font-semibold text-yebone-gold">Agent:</span> {display.agent}
        <span className="ml-1 text-yebone-primary">· {display.confidence}%</span>
      </p>
    );
  }

  return (
    <AICard className={className} padding="sm">
      <div className="flex items-start gap-2">
        <HiOutlineUserGroup className="text-yebone-primary shrink-0 mt-0.5" size={16} />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-yebone-gold mb-1">
            {display.agent} · {display.task.replace(/_/g, " ")}
          </p>
          <p className="text-[10px] text-gray-500 mb-1">
            Steps: {display.steps.slice(0, 4).join(" → ")}
          </p>
          {display.knowledge.length > 0 && (
            <p className="text-[9px] text-gray-400">Knowledge: {display.knowledge.join(", ")}</p>
          )}
          <p className="text-[10px] text-yebone-primary mt-1">Confidence {display.confidence}%</p>
        </div>
      </div>
    </AICard>
  );
};

export default YEBOAgentHint;
