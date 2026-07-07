import React, { useState } from "react";
import { Card, Tabs, Button, EmptyState } from "../../../design-system/components";
import { useAIExperiencePlatform } from "../../hooks/useAIExperiencePlatform";
import { sanitizeAsset, YEBO_AI_BRAND } from "../../utils/providerTransparency";
import { YEBOAIBrand } from "../status/AIStatusComponents";
import { logAIExperienceDiagnostics } from "../../diagnostics/AIExperienceDiagnostics";

const ASSET_TYPES = ["all", "image", "video", "background_removal", "document"];

export const AssetManager = ({ userId = "demo-user" }) => {
  const [tab, setTab] = useState("all");
  const { getAssets, getDownload, getSharing } = useAIExperiencePlatform(userId);
  const assets = (getAssets()?.assets || []).map(sanitizeAsset);

  logAIExperienceDiagnostics("assets", { count: assets.length });

  const filtered = tab === "all" ? assets : assets.filter((a) => a.assetType === tab);

  return (
    <section aria-label="AI asset manager">
      <Tabs tabs={ASSET_TYPES.map((t) => ({ id: t, label: t === "all" ? "All Assets" : t.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()) }))} active={tab} onChange={setTab} />
      <div className="mt-4">
        {filtered.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filtered.map((asset) => (
              <Card key={asset.assetId}>
                <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-2 flex items-center justify-center text-2xl" role="img" aria-label={`${asset.assetType} asset`}>
                  {asset.assetType === "video" ? "🎬" : asset.assetType === "document" ? "📄" : "🖼️"}
                </div>
                <p className="text-sm font-medium truncate">{asset.assetType}</p>
                <YEBOAIBrand />
                <div className="flex flex-wrap gap-1 mt-2">
                  <Button size="sm" variant="ghost" onClick={() => getDownload(asset.assetId)} aria-label="Download">Download</Button>
                  <Button size="sm" variant="ghost" onClick={() => getSharing(asset.assetId)} aria-label="Share">Share</Button>
                  <Button size="sm" variant="ghost" aria-label="Favorite">Favorite</Button>
                  <Button size="sm" variant="ghost" aria-label="Delete">Delete</Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState title="No assets" description={`Generated assets will appear here. ${YEBO_AI_BRAND}`} />
        )}
      </div>
    </section>
  );
};

export default AssetManager;
