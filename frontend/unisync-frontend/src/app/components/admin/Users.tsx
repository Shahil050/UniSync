"use client";

import { useEffect, useState, useCallback } from "react";
import { adminUsersApi, AdminUser } from "@/src/lib/api/admin-users";
import { ApiError } from "@/src/lib/api-client";

type FormState = {
  fullName: string;
  email: string;
  password: string;
  department: string;
  role: "STUDENT" | "ADMIN";
};

const EMPTY_FORM: FormState = {
  fullName: "",
  email: "",
  password: "",
  department: "",
  role: "STUDENT",
};

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [departments, setDepartments] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminUsersApi.list({
        search: search || undefined,
        department: department || undefined,
        role: (role as "STUDENT" | "ADMIN") || undefined,
        status: (status as "active" | "inactive") || undefined,
      });
      setUsers(res.users);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [search, department, role, status]);

  useEffect(() => {
    adminUsersApi
      .departments()
      .then((res) => setDepartments(res.departments))
      .catch(() => {
        // non-critical — filter just falls back to "All Departments" only
      });
  }, []);

  useEffect(() => {

    const timeout = setTimeout(loadUsers, 300); // debounce search typing
    return () => clearTimeout(timeout);
  }, [loadUsers]);

  const openAddModal = () => {
    setEditingUser(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (user: AdminUser) => {
    setEditingUser(user);
    setForm({
      fullName: user.name,
      email: user.email,
      password: "",
      department: user.department ?? "",
      role: user.role,
    });
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingUser(null);
  };

  const handleSave = async () => {
    setFormError("");

    if (!form.fullName.trim()) {
      setFormError("Name is required.");
      return;
    }

    setSaving(true);
    try {
      if (editingUser) {
        await adminUsersApi.update(editingUser.id, {
          fullName: form.fullName.trim(),
          department: form.department.trim() || undefined,
          role: form.role,
        });
      } else {
        if (!form.email.trim() || !form.password) {
          setFormError("Email and password are required.");
          setSaving(false);
          return;
        }
        await adminUsersApi.create({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          password: form.password,
          department: form.department.trim() || undefined,
          role: form.role,
        });
      }
      closeModal();
      await loadUsers();
      adminUsersApi.departments().then((res) => setDepartments(res.departments)).catch(() => {});
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (user: AdminUser) => {
    const isActive = user.status === "Active";
    const confirmMsg = isActive ? `Deactivate ${user.name}?` : `Reactivate ${user.name}?`;
    if (!confirm(confirmMsg)) return;

    try {
      if (isActive) {
        await adminUsersApi.deactivate(user.id);
      } else {
        await adminUsersApi.restore(user.id);
      }
      await loadUsers();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">User Management</h2>
          <p className="text-slate-500 mt-1">Manage all registered users</p>
        </div>

        {/* <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add User
        </button> */}
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-5 mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2"
          />

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="">All Roles</option>
            <option value="STUDENT">Student</option>
            <option value="ADMIN">Admin</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="">Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-5 text-center text-slate-500">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-5 text-center">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="p-4">{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.department ?? "—"}</td>
                  <td>{user.role === "ADMIN" ? "Admin" : "Student"}</td>
                  <td>
                    <span
                      className={
                        user.status === "Active"
                          ? "text-green-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {user.status}
                    </span>
                  </td>
                  <td>
                    {/* <button onClick={() => openEditModal(user)} className="text-blue-600 mr-3">
                      Edit
                    </button> */}
                    <button
                      onClick={() => handleToggleStatus(user)}
                      className={user.status === "Active" ? "text-red-600" : "text-green-600"}
                    >
                      {user.status === "Active" ? "Deactivate" : "Reactivate"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              {editingUser ? "Edit User" : "Add User"}
            </h3>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full name"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="border rounded-lg px-4 py-2 w-full"
              />

              {!editingUser && (
                <>
                  <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="border rounded-lg px-4 py-2 w-full"
                  />
                  <input
                    type="password"
                    placeholder="Password (min 8 characters)"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="border rounded-lg px-4 py-2 w-full"
                  />
                </>
              )}

              <input
                type="text"
                placeholder="Department"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="border rounded-lg px-4 py-2 w-full"
                list="department-suggestions"
              />
              <datalist id="department-suggestions">
                {departments.map((dept) => (
                  <option key={dept} value={dept} />
                ))}
              </datalist>


              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as "STUDENT" | "ADMIN" })}
                className="border rounded-lg px-4 py-2 w-full"
              >
                <option value="STUDENT">Student</option>
                <option value="ADMIN">Admin</option>
              </select>

              {formError && <p className="text-red-600 text-sm">{formError}</p>}
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={closeModal}
                disabled={saving}
                className="px-4 py-2 rounded-lg border text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}