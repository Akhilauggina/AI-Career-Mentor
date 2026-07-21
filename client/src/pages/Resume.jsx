import { useEffect, useState, useRef } from "react";
import { getResumes, uploadResume, deleteResume } from "../services/resumeService";
import { useToast } from "../context/ToastContext";
import { Spinner } from "../components/Loading";
import ResumeCard from "../components/ResumeCard";
import EmptyState from "../components/EmptyState";
import ConfirmModal from "../components/ConfirmModal";
import { Upload, CloudUpload, FileText, X, Loader2 } from "lucide-react";

const Resume = () => {
  const { addToast } = useToast();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const inputRef = useRef();

  useEffect(() => { fetchResumes(); }, []);

  const fetchResumes = async () => {
    try {
      const res = await getResumes();
      setResumes(res.resumes || res || []);
    } catch {
      addToast("Failed to load resumes", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e?.preventDefault();
    if (!title.trim() || !file) {
      addToast("Please enter a title and select a PDF", "error");
      return;
    }
    setUploading(true);
    setProgress(0);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("resume", file);
      // Simulate progress
      const interval = setInterval(() => {
        setProgress((p) => (p < 85 ? p + 15 : p));
      }, 300);
      await uploadResume(formData);
      clearInterval(interval);
      setProgress(100);
      addToast("Resume uploaded successfully!", "success");
      setTitle("");
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      fetchResumes();
    } catch (err) {
      addToast(err?.response?.data?.message || "Upload failed", "error");
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteResume(confirmId);
      addToast("Resume deleted", "info");
      fetchResumes();
    } catch {
      addToast("Failed to delete", "error");
    } finally {
      setConfirmId(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") setFile(dropped);
    else addToast("Please drop a PDF file", "error");
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Resume Manager</h2>
        <p className="text-slate-500 text-sm mt-0.5">Upload and manage your resumes with ATS scoring</p>
      </div>

      {/* Upload Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Upload size={16} className="text-indigo-600" /> Upload Resume
        </h3>

        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Resume Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Software Engineer Resume 2025"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
            />
          </div>

          {/* Drag & Drop */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
              dragging
                ? "border-indigo-400 bg-indigo-50"
                : file
                ? "border-emerald-300 bg-emerald-50"
                : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
            }`}
          >
            {file ? (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <FileText size={22} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-700">{file.name}</p>
                  <p className="text-xs text-emerald-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="ml-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <CloudUpload size={32} className="text-slate-400 mb-2" />
                <p className="text-sm font-medium text-slate-600">
                  Drag & drop your PDF here, or <span className="text-indigo-600">browse</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">PDF files only, max 10MB</p>
              </>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />

          {/* Progress */}
          {uploading && progress > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Uploading…</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70 shadow-md shadow-indigo-500/30"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? "Uploading…" : "Upload Resume"}
          </button>
        </form>
      </div>

      {/* Resume List */}
      <div>
        <h3 className="text-base font-semibold text-slate-800 mb-3">Your Resumes ({resumes.length})</h3>
        {resumes.length === 0 ? (
          <EmptyState
            message="No resumes uploaded"
            description="Upload your resume to get started with ATS scoring"
          />
        ) : (
          <div className="space-y-3">
            {resumes.map((resume) => (
              <ResumeCard key={resume._id} resume={resume} onDelete={(id) => setConfirmId(id)} />
            ))}
          </div>
        )}
      </div>

      {confirmId && (
        <ConfirmModal
          message="Delete this resume?"
          description="This cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  );
};

export default Resume;
