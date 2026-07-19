import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { HiOutlineClipboardList } from "react-icons/hi";
import {
  archiveCommissionRule,
  bulkCommissionRuleAction,
  createCommissionRule,
  deleteCommissionRule,
  duplicateCommissionRule,
  fetchCommissionRules,
  restoreCommissionRule,
  simulateCommissionRule,
  updateCommissionRule,
  updateCommissionRulePriorities,
} from "../../../services/growthConfigurationService";

const STRATEGIES = ["GLOBAL", "PRODUCT", "BRAND", "CATEGORY", "VENDOR", "REFERRAL", "CAMPAIGN"];

const emptyRule = {
  name: "",
  description: "",
  strategy: "GLOBAL",
  rate: 5,
  rateType: "PERCENTAGE",
  priority: 8,
  enabled: true,
  scope: {},
  startDate: "",
  endDate: "",
  reason: "",
};

const AdminCommissionRules = () => {
  const [rules, setRules] = useState([]);
  const [meta, setMeta] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [strategy, setStrategy] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [draft, setDraft] = useState(emptyRule);
  const [editingId, setEditingId] = useState(null);
  const [simulator, setSimulator] = useState({
    price: 100000,
    vendorId: "",
    categoryId: "",
    brandId: "",
    productId: "",
    referrerId: "",
    campaignId: "",
  });
  const [simulation, setSimulation] = useState(null);

  const loadRules = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchCommissionRules({
        search,
        strategy: strategy || undefined,
        status: status || undefined,
        includeArchived: status === "archived" ? "true" : undefined,
        limit: 100,
      });
      setRules(response?.data?.items || []);
      setMeta(response?.data?.meta || { total: 0 });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to load commission rules");
    } finally {
      setLoading(false);
    }
  }, [search, strategy, status]);

  useEffect(() => {
    loadRules();
  }, [loadRules]);

  const openCreate = () => {
    setEditingId(null);
    setDraft(emptyRule);
    setEditorOpen(true);
  };

  const openEdit = (rule) => {
    setEditingId(rule.id);
    setDraft({ ...rule, reason: "" });
    setEditorOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateCommissionRule(editingId, draft);
        toast.success("Commission rule updated");
      } else {
        await createCommissionRule(draft);
        toast.success("Commission rule created");
      }
      setEditorOpen(false);
      await loadRules();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to save rule");
    }
  };

  const handleBulk = async (action) => {
    if (!selected.length) return;
    try {
      await bulkCommissionRuleAction(action, selected);
      toast.success(`Bulk ${action} completed`);
      setSelected([]);
      await loadRules();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Bulk action failed");
    }
  };

  const handlePrioritySave = async () => {
    try {
      await updateCommissionRulePriorities(
        rules.map((rule) => ({ id: rule.id, priority: Number(rule.priority) }))
      );
      toast.success("Priorities updated");
      await loadRules();
    } catch (error) {
      toast.error("Unable to update priorities");
    }
  };

  const runSimulation = async () => {
    try {
      const response = await simulateCommissionRule(simulator);
      setSimulation(response?.data || response);
    } catch (error) {
      toast.error(error?.response?.data?.data?.reason || "Simulation failed");
    }
  };

  const toggleSelected = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const scopeField = useMemo(() => {
    switch (draft.strategy) {
      case "PRODUCT":
        return "productId";
      case "BRAND":
        return "brandId";
      case "CATEGORY":
        return "categoryId";
      case "VENDOR":
        return "vendorId";
      case "REFERRAL":
        return "referrerId";
      case "CAMPAIGN":
        return "campaignId";
      default:
        return null;
    }
  }, [draft.strategy]);

  return (
    <section id="admin-commission-rules" className="space-y-6 scroll-mt-24 yebone-fade-up">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-Poppins text-xl font-semibold dark:text-white flex items-center gap-2">
            <HiOutlineClipboardList className="text-yebone-primary" size={22} />
            Commission rules
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage commission rule types, priorities, and simulation without code changes.
          </p>
        </div>
        <button type="button" className="yebone-btn-primary yebone-btn-lift" onClick={openCreate}>
          Create rule
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <input
          className="h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          placeholder="Search rules"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          value={strategy}
          onChange={(e) => setStrategy(e.target.value)}
        >
          <option value="">All types</option>
          {STRATEGIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          className="h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="enabled">Enabled</option>
          <option value="disabled">Disabled</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className="yebone-btn-lift text-sm px-3 py-2 rounded-lg border" onClick={() => handleBulk("enable")}>
          Bulk enable
        </button>
        <button type="button" className="yebone-btn-lift text-sm px-3 py-2 rounded-lg border" onClick={() => handleBulk("disable")}>
          Bulk disable
        </button>
        <button type="button" className="yebone-btn-lift text-sm px-3 py-2 rounded-lg border" onClick={() => handleBulk("delete")}>
          Bulk archive
        </button>
        <button type="button" className="yebone-btn-lift text-sm px-3 py-2 rounded-lg border" onClick={handlePrioritySave}>
          Save priorities
        </button>
      </div>

      <div className="yebone-surface rounded-2xl overflow-hidden">
        {loading ? (
          <p className="p-4 text-sm text-gray-500">Loading commission rules...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900/40">
                <tr>
                  <th className="p-3 text-left">Select</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Rate</th>
                  <th className="p-3 text-left">Priority</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule) => (
                  <tr key={rule.id} className="border-t border-gray-100 dark:border-gray-800">
                    <td className="p-3">
                      <input type="checkbox" checked={selected.includes(rule.id)} onChange={() => toggleSelected(rule.id)} />
                    </td>
                    <td className="p-3 dark:text-white">{rule.name}</td>
                    <td className="p-3">{rule.strategy}</td>
                    <td className="p-3">
                      {rule.rate}
                      {rule.rateType === "PERCENTAGE" ? "%" : ""}
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        className="w-20 h-9 px-2 rounded border dark:bg-gray-900 dark:text-white"
                        value={rule.priority}
                        onChange={(e) =>
                          setRules((prev) =>
                            prev.map((item) =>
                              item.id === rule.id ? { ...item, priority: Number(e.target.value) } : item
                            )
                          )
                        }
                      />
                    </td>
                    <td className="p-3">
                      {rule.archived ? "Archived" : rule.enabled ? "Enabled" : "Disabled"}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => openEdit(rule)} className="text-yebone-primary">
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            await duplicateCommissionRule(rule.id);
                            loadRules();
                          }}
                        >
                          Duplicate
                        </button>
                        {rule.archived ? (
                          <button type="button" onClick={async () => { await restoreCommissionRule(rule.id); loadRules(); }}>
                            Restore
                          </button>
                        ) : (
                          <button type="button" onClick={async () => { await archiveCommissionRule(rule.id); loadRules(); }}>
                            Archive
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={async () => {
                            await deleteCommissionRule(rule.id);
                            loadRules();
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="p-3 text-xs text-gray-500">{meta.total} rules</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="yebone-surface rounded-2xl p-5 space-y-3">
          <h3 className="font-semibold dark:text-white">Rule simulator</h3>
          {["price", "vendorId", "categoryId", "brandId", "productId", "referrerId", "campaignId"].map((field) => (
            <input
              key={field}
              className="w-full h-10 px-3 rounded-xl border dark:bg-gray-900 dark:text-white"
              placeholder={field}
              value={simulator[field]}
              onChange={(e) => setSimulator((prev) => ({ ...prev, [field]: e.target.value }))}
            />
          ))}
          <button type="button" className="yebone-btn-primary yebone-btn-lift" onClick={runSimulation}>
            Run simulation
          </button>
        </div>
        <div className="yebone-surface rounded-2xl p-5">
          <h3 className="font-semibold dark:text-white mb-3">Simulation result</h3>
          {simulation ? (
            <pre className="text-xs overflow-auto dark:text-gray-300">{JSON.stringify(simulation, null, 2)}</pre>
          ) : (
            <p className="text-sm text-gray-500">Run the simulator to see winning rule and calculation.</p>
          )}
        </div>
      </div>

      {editorOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-xl yebone-surface rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold dark:text-white">
              {editingId ? "Edit commission rule" : "Create commission rule"}
            </h3>
            {["name", "description", "reason"].map((field) => (
              <input
                key={field}
                className="w-full h-11 px-4 rounded-xl border dark:bg-gray-900 dark:text-white"
                placeholder={field}
                value={draft[field] || ""}
                onChange={(e) => setDraft((prev) => ({ ...prev, [field]: e.target.value }))}
              />
            ))}
            <select
              className="w-full h-11 px-4 rounded-xl border dark:bg-gray-900 dark:text-white"
              value={draft.strategy}
              onChange={(e) => setDraft((prev) => ({ ...prev, strategy: e.target.value, scope: {} }))}
            >
              {STRATEGIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                className="h-11 px-4 rounded-xl border dark:bg-gray-900 dark:text-white"
                placeholder="Rate"
                value={draft.rate}
                onChange={(e) => setDraft((prev) => ({ ...prev, rate: Number(e.target.value) }))}
              />
              <input
                type="number"
                className="h-11 px-4 rounded-xl border dark:bg-gray-900 dark:text-white"
                placeholder="Priority"
                value={draft.priority}
                onChange={(e) => setDraft((prev) => ({ ...prev, priority: Number(e.target.value) }))}
              />
            </div>
            {scopeField && (
              <input
                className="w-full h-11 px-4 rounded-xl border dark:bg-gray-900 dark:text-white"
                placeholder={scopeField}
                value={draft.scope?.[scopeField] || ""}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    scope: { ...prev.scope, [scopeField]: e.target.value },
                  }))
                }
              />
            )}
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setEditorOpen(false)}>
                Cancel
              </button>
              <button type="button" className="yebone-btn-primary yebone-btn-lift" onClick={handleSave}>
                Save rule
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminCommissionRules;
