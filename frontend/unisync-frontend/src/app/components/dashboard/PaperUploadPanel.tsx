"use client";
import { useState, useRef } from "react";
import { Upload, FileText, Link as LinkIcon, CheckCircle2, AlertCircle, X } from "lucide-react";
import { papersApi } from "@/src/lib/api/papers";
import { ApiError } from "@/src/lib/api-client";

type UploadedPaper = {
  id: string;
  title: string;
  authors: string | null;
  url: string | null;
  indexed: boolean;
};

export function PaperUploadPanel({ onUploaded }: { onUploaded?: () => void } = {}) {
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [recent, setRecent] = useState<UploadedPaper[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const pickFile = (f: File | undefined | null) => {
    if (!f) return;
    if (f.type !== "application/pdf") {
      setError("Please choose a PDF file.");
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setError("PDF must be under 20MB.");
      return;
    }
    setError("");
    setFile(f);
  };

  const resetForm = () => {
    setTitle("");
    setAuthors("");
    setUrl("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNotice("");

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!file) {
      setError("Please attach a PDF file.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await papersApi.create({
        title: title.trim(),
        authors: authors.trim() || undefined,
        url: url.trim() || undefined,
        pdf: file,
      });

      setRecent((prev) => [
        {
          id: res.paper.id,
          title: res.paper.title,
          authors: res.paper.authors,
          url: res.paper.url,
          indexed: res.indexed,
        },
        ...prev,
      ]);

      if (res.indexed) {
        setNotice(`"${res.paper.title}" uploaded and indexed for recommendations.`);
      } else {
        setNotice(`"${res.paper.title}" was saved, but indexing failed — it won't show up in recommendations yet.`);
      }
      resetForm();
      onUploaded?.();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="font-bold text-slate-800 text-lg">Upload Paper</h2>
        <p className="text-sm text-slate-500 mt-1">
          Add a paper to the library. It'll be indexed automatically so it can be recommended to students based on their project descriptions.
        </p>
      </div>

      {notice && (
        <div className="flex items-start gap-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-sm">
          <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
          <span>{notice}</span>
        </div>
      )}
      {error && (
        <div className="flex items-start gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Attention Is All You Need"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Authors</label>
            <input
              type="text"
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
              placeholder="Vaswani et al."
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Source URL</label>
            <div className="relative">
              <LinkIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://arxiv.org/abs/..."
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">PDF File *</label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              pickFile(e.dataTransfer.files?.[0]);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`flex items-center gap-3 border-2 border-dashed rounded-xl px-4 py-6 cursor-pointer transition-colors ${
              dragOver ? "border-blue-400 bg-blue-50" : "border-blue-200 hover:border-blue-300 hover:bg-blue-50/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => pickFile(e.target.files?.[0])}
            />
            {file ? (
              <>
                <FileText size={20} className="text-blue-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
                  <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  className="text-slate-400 hover:text-red-500 flex-shrink-0"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <>
                <Upload size={20} className="text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Click to upload or drag a PDF here</p>
                  <p className="text-xs text-slate-400">Max 20MB</p>
                </div>
              </>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <>Upload Paper</>
          )}
        </button>
      </form>

      {recent.length > 0 && (
        <div>
          <h3 className="font-bold text-slate-800 text-sm mb-3">Recently Uploaded</h3>
          <div className="space-y-2">
            {recent.map((p) => (
              <div key={p.id} className="flex items-center gap-3 bg-white rounded-xl border border-blue-100 px-4 py-3">
                <FileText size={16} className="text-blue-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800 truncate">{p.title}</p>
                  {p.authors && <p className="text-xs text-slate-400 truncate">{p.authors}</p>}
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-lg flex-shrink-0 ${
                    p.indexed ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {p.indexed ? "Indexed" : "Not indexed"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}