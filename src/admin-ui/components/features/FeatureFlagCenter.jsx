import React, { useState } from "react";
import { Card, Switch, Badge } from "../../../design-system/components";
import { mockFeatureFlags } from "../../data/mockAdminData";
import { logAdminUIDiagnostics } from "../../diagnostics/AdminUIDiagnostics";

export const FeatureFlagCenter = ({ flags = mockFeatureFlags }) => {
  const [state, setState] = useState(() => Object.fromEntries(flags.map((f) => [f.id, f.enabled])));
  logAdminUIDiagnostics("component", { name: "FeatureFlagCenter" });

  const toggle = (id) => {
    setState((s) => ({ ...s, [id]: !s[id] }));
    logAdminUIDiagnostics("component", { action: "toggle", flag: id });
  };

  return (
    <div aria-label="Feature flag center" className="space-y-3">
      <Card>
        <p className="text-sm text-gray-500 mb-4">UI-only toggles — no backend implementation.</p>
        {flags.map((flag) => (
          <div key={flag.id} className="flex items-center justify-between py-3 border-b last:border-0">
            <div>
              <p className="font-medium">{flag.label}</p>
              <p className="text-xs text-gray-400">{flag.id}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={state[flag.id] ? "success" : "default"}>{state[flag.id] ? "Enabled" : "Disabled"}</Badge>
              <Switch label="" checked={state[flag.id]} onChange={() => toggle(flag.id)} />
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
};

export default FeatureFlagCenter;
