"use client";

import { useEffect, useState, useCallback } from "react";
import { adminMessagesApi, AdminMessage } from "@/src/lib/api/admin-messages";
import { ApiError } from "@/src/lib/api-client";

export default function Messages() {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<"project" | "direct" | "">("");

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminMessagesApi.list({
        search: search || undefined,
        date: date || undefined,
        type: type || undefined,
      });
      setMessages(res.messages);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load messages.");
    } finally {
      setLoading(false);
    }
  }, [search, date, type]);

  useEffect(() => {
    const timeout = setTimeout(loadMessages, 300);
    return () => clearTimeout(timeout);
  }, [loadMessages]);

  const handleView = (item: AdminMessage) => {
    alert(
      `Sender: ${item.sender}\nReceiver: ${item.receiver}\nType: ${item.type}\nMessage: ${item.content}\nDate: ${new Date(
        item.createdAt
      ).toLocaleString()}`
    );
  };

  const handleDelete = async (item: AdminMessage) => {
    if (!confirm("Delete this message?")) return;
    try {
      await adminMessagesApi.remove(item.id);
      await loadMessages();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    }
  };

  const handleExport = () => {
    const csvData = [
      ["Sender", "Receiver", "Type", "Message", "Date"],
      ...messages.map((item) => [
        item.sender,
        item.receiver,
        item.type,
        item.content.replace(/"/g, '""'),
        new Date(item.createdAt).toLocaleString(),
      ]),
    ];

    const csv = csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "messages.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Messages Management</h2>
          <p className="text-slate-500 mt-1">Monitor conversations between users.</p>
        </div>

        <button
          onClick={handleExport}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          Export Messages
        </button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-5 mb-6">
        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search sender, receiver, or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded-lg px-4 py-2"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value as "project" | "direct" | "")}
            className="border rounded-lg px-4 py-2"
          >
            <option value="">All Types</option>
            <option value="direct">Direct</option>
            <option value="project">Project</option>
          </select>
        </div>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Sender</th>
              <th>Receiver</th>
              <th>Message</th>
              <th>Type</th>
              <th>Date</th>
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
            ) : messages.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-5 text-center">
                  No messages found
                </td>
              </tr>
            ) : (
              messages.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-4">{item.sender}</td>
                  <td>{item.receiver}</td>
                  <td className="max-w-xs truncate">{item.content}</td>
                  <td>
                    <span
                      className={
                        item.type === "Direct"
                          ? "bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                          : "bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                      }
                    >
                      {item.type}
                    </span>
                  </td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleView(item)} className="text-blue-600 mr-3">
                      View
                    </button>
                    <button onClick={() => handleDelete(item)} className="text-red-600">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}