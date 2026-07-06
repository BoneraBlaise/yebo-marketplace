import React, { useMemo } from "react";
import { HiOutlineBookOpen } from "react-icons/hi";
import { useKnowledgeDomains } from "../../../ai/hooks/useKnowledge";
import { useAI } from "../core/AIContext";
import AICard from "../primitives/AICard";

/** Mock knowledge cards for YEBO Assistant — presentation only */
const YEBOKnowledgeHint = ({ query = "shipping", className, compact = false }) => {
  const domains = useKnowledgeDomains();
  const { searchKnowledge } = useAI();

  const results = useMemo(() => {
    if (!searchKnowledge) return [];
    const res = searchKnowledge(query);
    if (res instanceof Promise) return [];
    return (res?.results || res || []).slice(0, compact ? 1 : 3);
  }, [searchKnowledge, query, compact]);

  if (!results.length && !domains.length) return null;

  if (compact) {
    const top = results[0];
    return (
      <p className={`text-[10px] text-gray-500 ${className || ""}`}>
        <span className="font-semibold text-yebone-gold">Knowledge:</span>{" "}
        {top ? top.title : `${domains.length} domains indexed`}
      </p>
    );
  }

  return (
    <AICard className={className} padding="sm">
      <div className="flex items-start gap-2">
        <HiOutlineBookOpen className="text-yebone-primary shrink-0 mt-0.5" size={16} />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-yebone-gold mb-1">
            Enterprise Knowledge · {domains.length} domains
          </p>
          {results.map((doc) => (
            <div key={doc.id} className="mb-2 last:mb-0">
              <p className="text-xs font-semibold dark:text-white">{doc.title}</p>
              <p className="text-[10px] text-gray-500 line-clamp-2">{doc.summary}</p>
              <span className="text-[9px] text-yebone-primary capitalize">{doc.domain}</span>
            </div>
          ))}
        </div>
      </div>
    </AICard>
  );
};

export default YEBOKnowledgeHint;
