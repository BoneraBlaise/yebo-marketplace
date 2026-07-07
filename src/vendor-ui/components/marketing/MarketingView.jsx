import React from "react";
import { Card, Button, Badge, Tabs, DataTable } from "../../../design-system/components";
import { mockMarketing } from "../../data/mockVendorData";
import { logVendorUIDiagnostics } from "../../diagnostics/VendorUIDiagnostics";

export const MarketingView = ({ marketing = mockMarketing }) => {
  const [tab, setTab] = React.useState("coupons");
  logVendorUIDiagnostics("component", { name: "MarketingView", tab });

  return (
    <div aria-label="Marketing">
      <Tabs tabs={[
        { id: "coupons", label: "Coupons" },
        { id: "discounts", label: "Discounts" },
        { id: "promotions", label: "Promotions" },
        { id: "flash", label: "Flash Sales" },
        { id: "featured", label: "Featured" },
      ]} active={tab} onChange={setTab} />

      <div className="mt-4">
        {tab === "coupons" && (
          <Card>
            <div className="flex justify-between mb-3"><h3 className="font-semibold">Coupons</h3><Button size="sm">Create Coupon</Button></div>
            {marketing.coupons.map((c) => (
              <div key={c.id} className="flex justify-between py-2 border-b last:border-0">
                <span className="font-mono">{c.code}</span>
                <span>{c.discount}</span>
                <Badge variant={c.active ? "success" : "default"}>{c.active ? "Active" : "Inactive"}</Badge>
              </div>
            ))}
          </Card>
        )}
        {tab === "discounts" && (
          <DataTable columns={[{ key: "name", label: "Discount" }, { key: "value", label: "Value" }]} rows={marketing.discounts} />
        )}
        {tab === "promotions" && (
          <Card>{marketing.promotions.map((p) => (
            <div key={p.id} className="flex justify-between py-2 border-b last:border-0">
              <span>{p.title}</span><Badge>{p.status}</Badge>
            </div>
          ))}</Card>
        )}
        {tab === "flash" && (
          <Card>{marketing.flashSales.map((f) => (
            <div key={f.id} className="py-2 border-b last:border-0"><p className="font-medium">{f.name}</p><p className="text-xs text-gray-500">Ends {f.ends}</p></div>
          ))}</Card>
        )}
        {tab === "featured" && (
          <Card>{marketing.featured.map((f) => (
            <div key={f.id} className="py-2 border-b last:border-0">{f.name}</div>
          ))}</Card>
        )}
      </div>
    </div>
  );
};

export default MarketingView;
