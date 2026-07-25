import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import {
  ControlCenterCard,
  ControlCenterEmpty,
  ControlCenterShell,
  ControlCenterSkeleton,
  DataTable,
  StickySaveBar,
  ToggleSwitch,
} from "../shell/ControlCenterShell";
import { BANNER_TYPES } from "../constants/platformCatalog";
import {
  deletePlatformBanner,
  fetchPlatformConfiguration,
  upsertPlatformBanner,
} from "../../../services/platformConfigurationService";
import { server } from "../../../config/serverConfig";

const emptyBanner = {
  type: "homepage_hero",
  title: "",
  image: "",
  buttonText: "Shop now",
  target: "/",
  priority: 0,
  enabled: true,
  schedule: { start: "", end: "" },
};

const BannerManagementCenter = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [banners, setBanners] = useState([]);
  const [draft, setDraft] = useState(emptyBanner);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchPlatformConfiguration();
      setBanners(response?.data?.platform?.businessValues?.banners || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to load banners");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      const dataUrl = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const { data } = await axios.post(
        `${server}/marketplace/integration/platform-configuration/upload/banner`,
        { image: dataUrl },
        { withCredentials: true }
      );
      const url = data?.data?.url;
      if (!url) throw new Error("Upload failed");
      setDraft((prev) => ({ ...prev, image: url }));
      toast.success("Banner image uploaded to Cloudinary");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await upsertPlatformBanner({ ...draft, id: editingId || draft.id });
      toast.success(editingId ? "Banner updated" : "Banner created");
      setDraft(emptyBanner);
      setEditingId(null);
      await loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to save banner");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (banner) => {
    setDraft({
      ...banner,
      schedule: {
        start: banner.schedule?.start ? banner.schedule.start.slice(0, 16) : "",
        end: banner.schedule?.end ? banner.schedule.end.slice(0, 16) : "",
      },
    });
    setEditingId(banner.id);
  };

  const handleDelete = async (id) => {
    try {
      await deletePlatformBanner(id);
      toast.success("Banner deleted");
      await loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to delete banner");
    }
  };

  return (
    <ControlCenterShell
      title="Banner Management"
      subtitle="Homepage, property, events, flash sale, popup, category, and auction banners with scheduling."
    >
      {loading ? (
        <ControlCenterSkeleton rows={4} />
      ) : (
        <div className="admin-cc-grid admin-cc-grid--2 gap-4">
          <ControlCenterCard>
            <h3 className="font-semibold mb-3 dark:text-white">{editingId ? "Edit banner" : "Create banner"}</h3>
            <div className="space-y-3">
              <div className="admin-cc-field">
                <label>Type</label>
                <select value={draft.type} onChange={(e) => setDraft((prev) => ({ ...prev, type: e.target.value }))}>
                  {BANNER_TYPES.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-cc-field">
                <label>Title</label>
                <input value={draft.title} onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))} />
              </div>
              <div className="admin-cc-field">
                <label>Image URL</label>
                <input value={draft.image} onChange={(e) => setDraft((prev) => ({ ...prev, image: e.target.value }))} />
                <input type="file" accept="image/*" className="mt-2 text-sm" onChange={handleImageUpload} aria-label="Upload banner image" />
                {uploading ? <p className="text-xs text-gray-500 mt-1">Uploading…</p> : null}
              </div>
              <div className="admin-cc-grid admin-cc-grid--2 gap-2">
                <div className="admin-cc-field">
                  <label>Button text</label>
                  <input value={draft.buttonText} onChange={(e) => setDraft((prev) => ({ ...prev, buttonText: e.target.value }))} />
                </div>
                <div className="admin-cc-field">
                  <label>Target URL</label>
                  <input value={draft.target} onChange={(e) => setDraft((prev) => ({ ...prev, target: e.target.value }))} />
                </div>
              </div>
              <div className="admin-cc-grid admin-cc-grid--2 gap-2">
                <div className="admin-cc-field">
                  <label>Start schedule</label>
                  <input
                    type="datetime-local"
                    value={draft.schedule?.start || ""}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, schedule: { ...prev.schedule, start: e.target.value } }))
                    }
                  />
                </div>
                <div className="admin-cc-field">
                  <label>End schedule</label>
                  <input
                    type="datetime-local"
                    value={draft.schedule?.end || ""}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, schedule: { ...prev.schedule, end: e.target.value } }))
                    }
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="admin-cc-field !mb-0 w-24">
                  <label>Priority</label>
                  <input
                    type="number"
                    value={draft.priority ?? 0}
                    onChange={(e) => setDraft((prev) => ({ ...prev, priority: Number(e.target.value) }))}
                  />
                </div>
                <ToggleSwitch
                  enabled={draft.enabled !== false}
                  onChange={(enabled) => setDraft((prev) => ({ ...prev, enabled }))}
                  label="Toggle banner"
                />
              </div>
              {draft.image ? (
                <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                  <img src={draft.image} alt={draft.title || "Banner preview"} className="w-full h-36 object-cover" />
                </div>
              ) : (
                <ControlCenterEmpty title="Preview unavailable" description="Add an image to preview the banner." />
              )}
              <button type="button" className="admin-cc-btn admin-cc-btn--primary w-full" disabled={saving} onClick={handleSave}>
                {saving ? "Saving…" : editingId ? "Update banner" : "Create banner"}
              </button>
            </div>
          </ControlCenterCard>

          <div>
            <DataTable
              columns={[
                { key: "type", label: "Type" },
                { key: "title", label: "Title" },
                { key: "priority", label: "Priority" },
                {
                  key: "enabled",
                  label: "Status",
                  render: (row) => (row.enabled ? "Enabled" : "Disabled"),
                },
                {
                  key: "actions",
                  label: "Actions",
                  render: (row) => (
                    <div className="flex gap-2">
                      <button type="button" className="text-yebone-primary text-sm" onClick={() => handleEdit(row)}>
                        Edit
                      </button>
                      <button type="button" className="text-red-500 text-sm" onClick={() => handleDelete(row.id)}>
                        Delete
                      </button>
                    </div>
                  ),
                },
              ]}
              rows={banners}
              emptyMessage="No banners configured"
            />
          </div>
        </div>
      )}
    </ControlCenterShell>
  );
};

export default BannerManagementCenter;
