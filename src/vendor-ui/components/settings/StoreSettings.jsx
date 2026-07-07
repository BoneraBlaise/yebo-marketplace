import React, { useState } from "react";
import { Card, Button, Input, Textarea, Tabs, Switch } from "../../../design-system/components";
import { useBrand } from "../../../design-system/brand/BrandProvider";
import { logVendorUIDiagnostics } from "../../diagnostics/VendorUIDiagnostics";

export const StoreSettings = () => {
  const [tab, setTab] = useState("profile");
  const brandCtx = useBrand();
  const brand = brandCtx?.brand || {};
  logVendorUIDiagnostics("component", { name: "StoreSettings", tab });

  return (
    <div aria-label="Store settings">
      <Tabs tabs={[
        { id: "profile", label: "Store Profile" },
        { id: "branding", label: "Branding" },
        { id: "business", label: "Business Info" },
        { id: "policies", label: "Policies" },
        { id: "notifications", label: "Notifications" },
        { id: "security", label: "Security" },
        { id: "team", label: "Team" },
      ]} active={tab} onChange={setTab} />

      <div className="mt-4 space-y-4">
        {tab === "profile" && (
          <Card>
            <h3 className="font-semibold mb-4">Store Profile</h3>
            <div className="space-y-3">
              <div><label className="text-sm text-gray-500">Store Name</label><Input defaultValue="My Store" aria-label="Store name" /></div>
              <div><label className="text-sm text-gray-500">Description</label><Textarea defaultValue="Premium products for everyone." aria-label="Store description" /></div>
              <Button size="sm">Save Profile</Button>
            </div>
          </Card>
        )}
        {tab === "branding" && (
          <Card>
            <h3 className="font-semibold mb-4">Branding</h3>
            <p className="text-sm text-gray-500 mb-3">Primary: {brand.primaryColor || "#29625d"}</p>
            <div className="space-y-3">
              <div><label className="text-sm text-gray-500">Primary Color</label><Input defaultValue={brand.primaryColor || "#29625d"} aria-label="Primary color" /></div>
              <div><label className="text-sm text-gray-500">Logo</label><div className="border border-dashed rounded-lg p-8 text-center text-gray-400">Upload logo (placeholder)</div></div>
              <Button size="sm">Save Branding</Button>
            </div>
          </Card>
        )}
        {tab === "business" && (
          <Card>
            <h3 className="font-semibold mb-4">Business Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><label className="text-sm text-gray-500">Legal Name</label><Input aria-label="Legal name" /></div>
              <div><label className="text-sm text-gray-500">Registration Number</label><Input aria-label="Registration number" /></div>
              <div><label className="text-sm text-gray-500">Tax ID</label><Input aria-label="Tax ID" /></div>
              <div><label className="text-sm text-gray-500">Contact Email</label><Input type="email" aria-label="Contact email" /></div>
            </div>
            <Button size="sm" className="mt-3">Save</Button>
          </Card>
        )}
        {tab === "policies" && (
          <Card>
            <h3 className="font-semibold mb-4">Policies</h3>
            <div className="space-y-3">
              <div><label className="text-sm text-gray-500">Return Policy</label><Textarea aria-label="Return policy" /></div>
              <div><label className="text-sm text-gray-500">Shipping Policy</label><Textarea aria-label="Shipping policy" /></div>
              <Button size="sm">Save Policies</Button>
            </div>
          </Card>
        )}
        {tab === "notifications" && (
          <Card>
            <h3 className="font-semibold mb-4">Notifications</h3>
            <div className="space-y-3">
              <Switch label="Order notifications" checked={true} onChange={() => {}} />
              <Switch label="Low stock alerts" checked={true} onChange={() => {}} />
              <Switch label="AI credit alerts" checked={true} onChange={() => {}} />
            </div>
          </Card>
        )}
        {tab === "security" && (
          <Card>
            <h3 className="font-semibold mb-4">Security</h3>
            <div className="space-y-2">
              <Button size="sm" variant="secondary">Change Password</Button>
              <Button size="sm" variant="ghost">Two-Factor Authentication</Button>
              <Button size="sm" variant="ghost">API Keys (placeholder)</Button>
            </div>
          </Card>
        )}
        {tab === "team" && (
          <Card aria-label="Team members placeholder">
            <h3 className="font-semibold mb-2">Team Members</h3>
            <p className="text-sm text-gray-500 mb-3">Team management placeholder.</p>
            <div className="p-4 border border-dashed rounded-lg text-center text-gray-400">Invite team members</div>
            <Button size="sm" className="mt-3" variant="secondary">Invite Member</Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StoreSettings;
