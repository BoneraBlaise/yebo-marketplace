import React from "react";
import { Card, StatisticCard, DataTable, Button, Input } from "../../../design-system/components";
import { mockAffiliate } from "../../data/mockVendorData";
import { logVendorUIDiagnostics } from "../../diagnostics/VendorUIDiagnostics";

export const AffiliateCenter = ({ affiliate = mockAffiliate }) => {
  logVendorUIDiagnostics("component", { name: "AffiliateCenter" });

  return (
    <div aria-label="Affiliate center" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatisticCard label="Affiliate Sales" value={affiliate.sales} />
        <StatisticCard label="Commission Total" value={`$${affiliate.commissionTotal}`} />
      </div>

      <Card aria-label="Affiliate links">
        <h3 className="font-semibold mb-3">Affiliate Links</h3>
        {affiliate.links.map((l) => (
          <div key={l.id} className="flex justify-between py-2 border-b last:border-0 text-sm">
            <span className="truncate mr-2">{l.url}</span>
            <span>{l.clicks} clicks</span>
          </div>
        ))}
        <Button size="sm" className="mt-3" variant="secondary">Create Link</Button>
      </Card>

      <Card aria-label="Referral links">
        <h3 className="font-semibold mb-3">Referral Links</h3>
        {affiliate.referrals.map((r) => (
          <div key={r.id} className="flex justify-between py-2 border-b last:border-0">
            <span className="font-mono">{r.code}</span>
            <span>{r.signups} signups</span>
          </div>
        ))}
      </Card>

      <Card aria-label="Coupon codes">
        <h3 className="font-semibold mb-3">Affiliate Coupon Codes</h3>
        {affiliate.couponCodes.map((c) => (
          <div key={c.id} className="flex justify-between py-2 border-b last:border-0">
            <span className="font-mono">{c.code}</span>
            <span>{c.commission} commission</span>
          </div>
        ))}
        <div className="flex gap-2 mt-3">
          <Input placeholder="New coupon code" aria-label="New coupon code" />
          <Button size="sm">Create</Button>
        </div>
      </Card>

      <Card aria-label="Top affiliates">
        <h3 className="font-semibold mb-3">Top Affiliates</h3>
        <DataTable
          columns={[{ key: "name", label: "Affiliate" }, { key: "sales", label: "Sales" }, { key: "commission", label: "Commission" }]}
          rows={affiliate.topAffiliates.map((a) => ({ ...a, commission: `$${a.commission}` }))}
        />
      </Card>
    </div>
  );
};

export default AffiliateCenter;
