import React, { useCallback, useEffect, useState } from "react";
import {
  fetchAdminDisputes,
  fetchAdminEscrow,
  fetchAdminFraudAlerts,
  fetchAdminPolicies,
  fetchAdminTrustDashboard,
  fetchAdminTrustScores,
  fetchAdminVerifications,
  fetchTrustAvailability,
  reviewAdminFraudAlert,
  reviewAdminVerification,
  transitionAdminDispute,
  updateAdminPolicies,
} from "../../services/trustBuyerProtectionService";

const TABS = [
  "Analytics",
  "Disputes",
  "Escrow",
  "Verification",
  "Trust Scores",
  "Fraud Alerts",
  "Policies",
];

const AdminTrustBuyerProtectionPanel = () => {
  const [tab, setTab] = useState("Analytics");
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState("");
  const [dashboard, setDashboard] = useState(null);
  const [disputes, setDisputes] = useState([]);
  const [escrows, setEscrows] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [trustScores, setTrustScores] = useState([]);
  const [fraudAlerts, setFraudAlerts] = useState([]);
  const [policies, setPolicies] = useState(null);
  const [policyDraft, setPolicyDraft] = useState({ protectionDurationDays: 30, maximumClaimPeriodDays: 14 });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const availability = await fetchTrustAvailability();
      if (availability.disabled || !availability.available) {
        setDisabled(true);
        return;
      }
      const [dash, disp, esc, ver, scores, fraud, pol] = await Promise.all([
        fetchAdminTrustDashboard(),
        fetchAdminDisputes(),
        fetchAdminEscrow(),
        fetchAdminVerifications(),
        fetchAdminTrustScores(),
        fetchAdminFraudAlerts({ status: "open" }),
        fetchAdminPolicies(),
      ]);
      setDashboard(dash?.data || null);
      setDisputes(disp?.data || []);
      setEscrows(esc?.data || []);
      setVerifications(ver?.data || []);
      setTrustScores(scores?.data || []);
      setFraudAlerts(fraud?.data || []);
      const policyData = pol?.data?.policies || {};
      setPolicies(policyData);
      setPolicyDraft({
        protectionDurationDays: policyData.protectionDurationDays || 30,
        maximumClaimPeriodDays: policyData.maximumClaimPeriodDays || 14,
        escrowReleaseDelayHours: policyData.escrowReleaseDelayHours || 48,
      });
    } catch (err) {
      setError(err?.message || "Failed to load Trust Admin");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDisputeReview = async (disputeId) => {
    await transitionAdminDispute(disputeId, { status: "UNDER_REVIEW", note: "Admin review started" });
    await load();
  };

  const handleVerify = async (verificationId, decision) => {
    await reviewAdminVerification(verificationId, decision);
    await load();
  };

  const handleFraudReview = async (alertId) => {
    await reviewAdminFraudAlert(alertId, "reviewed");
    await load();
  };

  const handleSavePolicies = async () => {
    await updateAdminPolicies({ policies: policyDraft });
    await load();
  };

  if (loading) return <div className="p-6">Loading Trust & Buyer Protection…</div>;
  if (disabled) {
    return (
      <div className="p-6 yebone-surface rounded-lg">
        Trust & Buyer Protection is disabled by platform configuration.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Trust & Buyer Protection</h1>
        <p className="text-sm text-gray-500">Phase 14 — disputes, escrow, verification, trust scores, fraud</p>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="flex flex-wrap gap-2">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`px-3 py-1.5 rounded-md text-sm ${
              tab === item ? "bg-emerald-600 text-white" : "bg-gray-100 dark:bg-neutral-800"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "Analytics" && dashboard && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="Open Disputes" value={dashboard.disputes?.open} />
          <Stat label="Held Escrow" value={dashboard.escrow?.held} />
          <Stat label="Active Protection" value={dashboard.protection?.active} />
          <Stat label="Open Fraud Alerts" value={dashboard.fraud?.openAlerts} />
          <Stat label="Pending Verification" value={dashboard.verification?.pending} />
          <Stat label="Avg Trust Score" value={dashboard.trustScore?.averageScore ?? "—"} />
        </div>
      )}

      {tab === "Disputes" && (
        <SimpleTable
          headers={["ID", "Order", "Status", "Reason", "Action"]}
          rows={disputes.map((d) => [
            d.disputeId,
            d.orderId,
            d.status,
            d.reason,
            d.status === "OPEN" ? (
              <button type="button" className="text-emerald-600 text-sm" onClick={() => handleDisputeReview(d.disputeId)}>
                Review
              </button>
            ) : "—",
          ])}
        />
      )}

      {tab === "Escrow" && (
        <SimpleTable
          headers={["ID", "Order", "Amount", "Status"]}
          rows={escrows.map((e) => [e.escrowId, e.orderId, e.amount, e.status])}
        />
      )}

      {tab === "Verification" && (
        <SimpleTable
          headers={["ID", "Subject", "Type", "Status", "Action"]}
          rows={verifications.map((v) => [
            v.verificationId,
            v.subjectId,
            v.type,
            v.status,
            v.status === "Submitted" ? (
              <span className="space-x-2">
                <button type="button" className="text-emerald-600 text-sm" onClick={() => handleVerify(v.verificationId, "approve")}>
                  Approve
                </button>
                <button type="button" className="text-red-600 text-sm" onClick={() => handleVerify(v.verificationId, "reject")}>
                  Reject
                </button>
              </span>
            ) : "—",
          ])}
        />
      )}

      {tab === "Trust Scores" && (
        <SimpleTable
          headers={["Subject", "Type", "Score", "Updated"]}
          rows={trustScores.map((t) => [t.subjectId, t.subjectType, t.score, t.computedAt])}
        />
      )}

      {tab === "Fraud Alerts" && (
        <SimpleTable
          headers={["ID", "Subject", "Risk", "Signals", "Action"]}
          rows={fraudAlerts.map((a) => [
            a.alertId,
            a.subjectId,
            a.riskLevel,
            a.signals?.length || 0,
            a.status === "open" ? (
              <button type="button" className="text-emerald-600 text-sm" onClick={() => handleFraudReview(a.alertId)}>
                Mark Reviewed
              </button>
            ) : a.status,
          ])}
        />
      )}

      {tab === "Policies" && policies && (
        <div className="yebone-surface rounded-lg p-4 space-y-3 max-w-lg">
          <label className="block text-sm">
            Protection Duration (days)
            <input
              type="number"
              className="mt-1 w-full border rounded px-2 py-1 dark:bg-neutral-900"
              value={policyDraft.protectionDurationDays}
              onChange={(e) =>
                setPolicyDraft((p) => ({ ...p, protectionDurationDays: Number(e.target.value) }))
              }
            />
          </label>
          <label className="block text-sm">
            Maximum Claim Period (days)
            <input
              type="number"
              className="mt-1 w-full border rounded px-2 py-1 dark:bg-neutral-900"
              value={policyDraft.maximumClaimPeriodDays}
              onChange={(e) =>
                setPolicyDraft((p) => ({ ...p, maximumClaimPeriodDays: Number(e.target.value) }))
              }
            />
          </label>
          <label className="block text-sm">
            Escrow Release Delay (hours)
            <input
              type="number"
              className="mt-1 w-full border rounded px-2 py-1 dark:bg-neutral-900"
              value={policyDraft.escrowReleaseDelayHours}
              onChange={(e) =>
                setPolicyDraft((p) => ({ ...p, escrowReleaseDelayHours: Number(e.target.value) }))
              }
            />
          </label>
          <button type="button" className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm" onClick={handleSavePolicies}>
            Save Policies
          </button>
        </div>
      )}
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div className="yebone-surface rounded-lg p-4">
    <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
    <p className="text-2xl font-semibold mt-1">{value ?? 0}</p>
  </div>
);

const SimpleTable = ({ headers, rows }) => (
  <div className="overflow-x-auto yebone-surface rounded-lg">
    <table className="min-w-full text-sm">
      <thead>
        <tr className="border-b">
          {headers.map((h) => (
            <th key={h} className="text-left p-3 font-medium">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={headers.length} className="p-4 text-gray-500">
              No records
            </td>
          </tr>
        ) : (
          rows.map((row, idx) => (
            <tr key={idx} className="border-b last:border-0">
              {row.map((cell, i) => (
                <td key={i} className="p-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default AdminTrustBuyerProtectionPanel;
