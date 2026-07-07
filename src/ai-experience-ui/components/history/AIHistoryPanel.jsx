import React, { useState } from "react";
import { Card, Tabs, Input, Select, EmptyState } from "../../../design-system/components";
import { AIHistoryCard } from "../../../design-system/ai";
import { useAIExperiencePlatform } from "../../hooks/useAIExperiencePlatform";
import { YEBOAIBrand } from "../status/AIStatusComponents";
import { logAIExperienceDiagnostics } from "../../diagnostics/AIExperienceDiagnostics";

export const AIHistoryPanel = ({ userId = "demo-user" }) => {
  const [tab, setTab] = useState("recent");
  const [search, setSearch] = useState("");
  const [groupBy, setGroupBy] = useState("date");
  const { getHistory } = useAIExperiencePlatform(userId);
  const items = getHistory()?.viewModel?.items || [];

  logAIExperienceDiagnostics("history", { count: items.length, tab, groupBy });

  const filtered = items.filter((i) => !search || (i.previewType || i.type || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <section aria-label="AI history">
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <Input placeholder="Search history..." value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search history" className="flex-1" />
        <Select value={groupBy} onChange={(e) => setGroupBy(e.target.value)} aria-label="Group by">
          <option value="date">Group by Date</option>
          <option value="product">Group by Product</option>
          <option value="vendor">Group by Vendor</option>
        </Select>
      </div>
      <Tabs tabs={[
        { id: "recent", label: "Recent" },
        { id: "completed", label: "Completed" },
        { id: "failed", label: "Failed" },
        { id: "cancelled", label: "Cancelled" },
      ]} active={tab} onChange={setTab} />
      <div className="mt-4">
        {filtered.length ? (
          <Card>
            <YEBOAIBrand />
            <div className="mt-3">
              <AIHistoryCard items={filtered.map((i, idx) => ({ id: i.id || idx, label: i.previewType || i.type || "Preview" }))} />
            </div>
          </Card>
        ) : (
          <EmptyState title="No history" description="Your AI preview history will appear here." />
        )}
      </div>
    </section>
  );
};

export default AIHistoryPanel;
