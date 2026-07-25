import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  ControlCenterCard,
  ControlCenterEmpty,
  ControlCenterShell,
  ControlCenterSkeleton,
  DataTable,
} from "../shell/ControlCenterShell";
import {
  fetchConfigurationHistory,
  rollbackConfiguration,
} from "../../../services/platformConfigurationService";

const MODULES = [
  "commission",
  "referral",
  "ai",
  "delivery",
  "platform",
  "feature-flags",
  "banners",
  "coupons",
  "commission-rules",
  "growth",
];

const ConfigurationHistoryCenter = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ total: 0 });
  const [search, setSearch] = useState("");
  const [module, setModule] = useState("");
  const [changedBy, setChangedBy] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rollbackId, setRollbackId] = useState(null);
  const [rollbackNote, setRollbackNote] = useState("");
  const [restoring, setRestoring] = useState(false);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchConfigurationHistory({
        search: search || undefined,
        module: module || undefined,
        changedBy: changedBy || undefined,
        from: from || undefined,
        to: to || undefined,
        limit: 100,
      });
      setItems(response?.data?.items || []);
      setMeta(response?.data?.meta || { total: 0 });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to load configuration history");
    } finally {
      setLoading(false);
    }
  }, [search, module, changedBy, from, to]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const timeline = useMemo(
    () =>
      items.map((entry) => ({
        ...entry,
        id: entry.historyId,
        summary: `${entry.module} · ${entry.section || "all"} · ${entry.action}`,
      })),
    [items]
  );

  const handleRollback = async () => {
    if (!rollbackId) return;
    setRestoring(true);
    try {
      await rollbackConfiguration(rollbackId, rollbackNote.trim());
      toast.success("Configuration restored from history");
      setRollbackId(null);
      setRollbackNote("");
      await loadHistory();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Rollback failed");
    } finally {
      setRestoring(false);
    }
  };

  return (
    <ControlCenterShell
      title="Configuration History"
      subtitle="Immutable audit timeline for every control center change — search, filter, and restore."
    >
      <ControlCenterCard className="mb-4">
        <div className="admin-cc-grid admin-cc-grid--3 gap-3">
          <div className="admin-cc-field">
            <label>Search</label>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Module, section, note…" />
          </div>
          <div className="admin-cc-field">
            <label>Module</label>
            <select value={module} onChange={(e) => setModule(e.target.value)}>
              <option value="">All modules</option>
              {MODULES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="admin-cc-field">
            <label>Changed by</label>
            <input value={changedBy} onChange={(e) => setChangedBy(e.target.value)} placeholder="User ID or email" />
          </div>
          <div className="admin-cc-field">
            <label>From</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="admin-cc-field">
            <label>To</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </div>
      </ControlCenterCard>

      {loading ? (
        <ControlCenterSkeleton rows={4} />
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-3">{meta.total || 0} history entries</p>
          <div className="space-y-3 mb-6">
            {timeline.length ? (
              timeline.map((entry) => (
                <ControlCenterCard key={entry.historyId} className="flex flex-wrap gap-3 justify-between items-start">
                  <div>
                    <p className="font-semibold dark:text-white">{entry.summary}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : "—"} · {entry.changedBy}
                    </p>
                    {entry.note ? <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{entry.note}</p> : null}
                    <span className="inline-block mt-2 text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600">
                      {entry.status}
                    </span>
                  </div>
                  {entry.action === "publish" || entry.status === "published" ? (
                    <button
                      type="button"
                      className="admin-cc-btn admin-cc-btn--ghost"
                      onClick={() => setRollbackId(entry.historyId)}
                    >
                      Restore
                    </button>
                  ) : null}
                </ControlCenterCard>
              ))
            ) : (
              <ControlCenterEmpty title="No history yet" description="Configuration changes will appear here." />
            )}
          </div>

          <DataTable
            columns={[
              { key: "module", label: "Module" },
              { key: "section", label: "Section" },
              { key: "action", label: "Action" },
              { key: "status", label: "Status" },
              { key: "changedBy", label: "Changed by" },
              {
                key: "timestamp",
                label: "Timestamp",
                render: (row) => (row.timestamp ? new Date(row.timestamp).toLocaleString() : "—"),
              },
            ]}
            rows={timeline}
            emptyMessage="No records"
          />
        </>
      )}

      {rollbackId ? (
        <div className="admin-cc-sticky-save mt-4" role="dialog" aria-label="Confirm rollback">
          <div className="flex-1">
            <p className="font-medium dark:text-white">Restore this configuration version?</p>
            <input
              className="mt-2 w-full max-w-md h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-sm"
              value={rollbackNote}
              onChange={(e) => setRollbackNote(e.target.value)}
              placeholder="Optional rollback note"
            />
          </div>
          <div className="flex gap-2">
            <button type="button" className="admin-cc-btn admin-cc-btn--ghost" onClick={() => setRollbackId(null)}>
              Cancel
            </button>
            <button type="button" className="admin-cc-btn admin-cc-btn--primary" disabled={restoring} onClick={handleRollback}>
              {restoring ? "Restoring…" : "Confirm restore"}
            </button>
          </div>
        </div>
      ) : null}
    </ControlCenterShell>
  );
};

export default ConfigurationHistoryCenter;
