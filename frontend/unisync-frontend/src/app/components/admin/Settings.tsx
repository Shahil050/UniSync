"use client";

import { useEffect, useState } from "react";
import { adminSettingsApi } from "@/src/lib/api/admin-settings";
import { ApiError } from "@/src/lib/api-client";

export default function SettingsPage() {
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(43200);
  const [maxUploadSizeMB, setMaxUploadSizeMB] = useState(20);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminSettingsApi
      .get()
      .then((res) => {
        setSessionTimeoutMinutes(res.settings.sessionTimeoutMinutes);
        setMaxUploadSizeMB(res.settings.maxUploadSizeMB);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load settings."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setError("");
    setSaving(true);
    try {
      await adminSettingsApi.update({ sessionTimeoutMinutes, maxUploadSizeMB });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">System Settings</h1>
        <p className="text-slate-500 mt-2">
          Only settings that actually affect platform behavior are listed here.
        </p>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-1">Session</h2>
            <p className="text-sm text-slate-500 mb-5">
              Applies to every new login going forward. Existing sessions keep their original expiry.
            </p>

            <div className="max-w-xs">
              <label className="block mb-2 font-medium">Session Timeout (minutes)</label>
              <input
                type="number"
                min={5}
                max={129600}
                value={sessionTimeoutMinutes}
                onChange={(e) => setSessionTimeoutMinutes(Number(e.target.value))}
                className="w-full border rounded-lg px-4 py-2"
              />
              <p className="text-xs text-slate-400 mt-1">
                {(sessionTimeoutMinutes / 60 / 24).toFixed(1)} days
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-1">Research Paper Uploads</h2>
            <p className="text-sm text-slate-500 mb-5">
              Only PDF is supported end-to-end (storage and AI indexing both assume PDF) —
              file type isn't configurable.
            </p>

            <div className="max-w-xs">
              <label className="block mb-2 font-medium">Maximum Upload Size (MB)</label>
              <input
                type="number"
                min={1}
                max={100}
                value={maxUploadSizeMB}
                onChange={(e) => setMaxUploadSizeMB(Number(e.target.value))}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <div className="flex justify-end items-center gap-5">
            {saved && <span className="text-green-600 font-semibold">Settings Saved Successfully</span>}

            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}