import React from "react";
import { Card, StatisticCard, DataTable, Button, Badge } from "../../../design-system/components";
import { mockFinance } from "../../data/mockVendorData";
import { useVendorExperience } from "../../hooks/useVendorExperience";
import { logVendorUIDiagnostics } from "../../diagnostics/VendorUIDiagnostics";

export const FinanceView = ({ finance = mockFinance, vendorId = "demo-vendor" }) => {
  const { getBillingSummary } = useVendorExperience(vendorId);
  const billing = getBillingSummary();
  logVendorUIDiagnostics("component", { name: "FinanceView" });

  return (
    <div aria-label="Finance" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatisticCard label="Revenue" value={`$${finance.revenue.toLocaleString()}`} />
        <StatisticCard label="Commission" value={`$${finance.commission.toLocaleString()}`} />
        <StatisticCard label="Payouts" value={`$${finance.payouts.toLocaleString()}`} />
      </div>

      <Card aria-label="Billing summary">
        <h3 className="font-semibold mb-3">Billing Summary</h3>
        <dl className="text-sm space-y-1">
          <div className="flex justify-between"><dt>Plan</dt><dd>{billing.planId || "—"}</dd></div>
          <div className="flex justify-between"><dt>Cycle</dt><dd>{billing.cycleStart || "—"} to {billing.cycleEnd || "—"}</dd></div>
        </dl>
      </Card>

      <Card aria-label="Statements">
        <h3 className="font-semibold mb-3">Statements</h3>
        <DataTable columns={[{ key: "period", label: "Period" }, { key: "amount", label: "Amount" }]} rows={finance.statements.map((s) => ({ ...s, amount: `$${s.amount}` }))} />
      </Card>

      <Card aria-label="Refunds">
        <h3 className="font-semibold mb-3">Refunds</h3>
        {finance.refunds.map((r) => (
          <div key={r.id} className="flex justify-between py-2 border-b last:border-0">
            <span>{r.orderId}</span>
            <span>${r.amount}</span>
            <Badge variant="warning">{r.status}</Badge>
          </div>
        ))}
      </Card>

      <Card aria-label="Taxes placeholder">
        <h3 className="font-semibold mb-2">Taxes</h3>
        <p className="text-sm text-gray-500 mb-3">Tax reporting placeholder — no implementation.</p>
        <Button size="sm" variant="secondary">Download Tax Summary</Button>
      </Card>
    </div>
  );
};

export default FinanceView;
