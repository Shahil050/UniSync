"use client";

import { Camera, LogOut } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { accountApi, AccountProfile } from "@/src/lib/api/account";
import { usersApi } from "@/src/lib/api/users";
import { authApi } from "@/src/lib/api/auth";
import { ApiError } from "@/src/lib/api-client";

export default function AdminProfile() {
  const router = useRouter();

  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [password, setPassword] = useState({ current: "", newPassword: "", confirm: "" });
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    accountApi
      .me()
      .then((res) => {
        setProfile(res.user);
        setName(res.user.fullName);
        setProfileImage(res.user.profileImage ?? "");
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  const saveProfile = async () => {
    setError("");
    setMessage("");
    if (!profile) return;

    setSaving(true);
    try {
      await usersApi.update(profile.id, {
        fullName: name.trim(),
        profileImage: profileImage.trim() || undefined,
      });
      setProfile({ ...profile, fullName: name.trim(), profileImage: profileImage.trim() || null });
      setMessage("Profile updated successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const updatePassword = async () => {
    setError("");
    setMessage("");

    if (password.newPassword !== password.confirm) {
      setError("New password and confirmation don't match.");
      return;
    }

    setPasswordSaving(true);
    try {
      await accountApi.changePassword({
        currentPassword: password.current,
        newPassword: password.newPassword,
      });
      setMessage("Password changed successfully");
      setTimeout(() => setMessage(""), 3000);
      setPassword({ current: "", newPassword: "", confirm: "" });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to change password.");
    } finally {
      setPasswordSaving(false);
    }
  };

  // const handleLogout = async () => {
  //   await authApi.logout();
  //   router.push("/admin/login");
  // };

  if (loading) return <p className="text-slate-500">Loading...</p>;
  if (!profile) return <p className="text-red-600">{error || "Could not load profile."}</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Admin Profile</h1>
          <p className="text-slate-500">Manage administrator account information</p>
        </div>

        <button
          onClick={saveProfile}
          disabled={saving}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {message && <div className="bg-blue-100 text-blue-700 p-3 rounded-lg">{message}</div>}
      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg">{error}</div>}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow border p-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              <Image
                src={profileImage || "/unisync-logo.png"}
                alt="Admin"
                width={140}
                height={140}
                className="w-36 h-36 rounded-full object-cover border-4 border-blue-500"
              />
            </div>

            <h2 className="text-2xl font-bold mt-4">{profile.fullName}</h2>
            <p className="text-slate-500">{profile.email}</p>

            <span className="mt-4 bg-green-100 text-green-700 px-4 py-1 rounded-full">Active</span>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow border p-6">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block font-medium mb-2">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Profile Image URL
                <span className="text-xs text-slate-400 font-normal ml-1">(no file upload yet — paste a link)</span>
              </label>
              <input
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                placeholder="https://..."
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Email</label>
              <input
                value={profile.email}
                disabled
                className="w-full border rounded-lg px-4 py-2 bg-slate-50 text-slate-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Role</label>
              <input
                value={profile.role === "ADMIN" ? "Admin" : "Student"}
                disabled
                className="w-full border rounded-lg px-4 py-2 bg-slate-50 text-slate-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium mb-2">Last Login</label>
              <input
                value={profile.lastLoginAt ? new Date(profile.lastLoginAt).toLocaleString() : "This is your first login"}
                disabled
                className="w-full border rounded-lg px-4 py-2 bg-slate-50 text-slate-500"
              />
            </div>
          </div>

          <hr className="my-8" />

          <h2 className="text-xl font-semibold mb-4">Change Password</h2>

          <div className="space-y-4">
            <input
              type="password"
              placeholder="Current Password"
              className="w-full border rounded-lg px-4 py-2"
              value={password.current}
              onChange={(e) => setPassword({ ...password, current: e.target.value })}
            />
            <input
              type="password"
              placeholder="New Password (min 8 characters)"
              className="w-full border rounded-lg px-4 py-2"
              value={password.newPassword}
              onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full border rounded-lg px-4 py-2"
              value={password.confirm}
              onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={updatePassword}
              disabled={passwordSaving}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg disabled:opacity-60"
            >
              {passwordSaving ? "Updating..." : "Update Password"}
            </button>

            {/* <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-5 py-2 rounded-lg flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}