import { useEffect, useState } from "react";
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from "../services/applicationService";
import { getJobs } from "../services/jobService";
import { getResumes } from "../services/resumeService";
import { useToast } from "../context/ToastContext";
import { Spinner } from "../components/Loading";
import ApplicationCard from "../components/ApplicationCard";
import EmptyState from "../components/EmptyState";
import SearchBar from "../components/SearchBar";
import ConfirmModal from "../components/ConfirmModal";
import { Plus, X, ChevronDown, BarChart3 } from "lucide-react";
import { applicationStatuses } from "../utils/helpers";

const EMPTY_FORM = { jobId: "", resumeId: "", status: "Applied", notes: "" };

const FormModal = ({ form, onChange, onSubmit, onClose, saving, jobs, resumes }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h2 className="text-lg font-semibold text-slate-800">Add Application</h2>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
      </div>

      <div className="px-6 py-4 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Job</label>
          <div className="relative">
            <select name="jobId" value={form.jobId} onChange={onChange}
              className="w-full appearance-none pl-3 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30">
              <option value="">Select a job</option>
              {jobs.map((j) => (
                <option key={j._id} value={j._id}>{j.title} — {j.company}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Resume</label>
          <div className="relative">
            <select name="resumeId" value={form.resumeId} onChange={onChange}
              className="w-full appearance-none pl-3 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30">
              <option value="">Select a resume</option>
              {resumes.map((r) => (
                <option key={r._id} value={r._id}>{r.title} (ATS: {r.atsScore ?? "—"})</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Status</label>
          <div className="relative">
            <select name="status" value={form.status} onChange={onChange}
              className="w-full appearance-none pl-3 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30">
              {applicationStatuses.map((s) => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Notes</label>
          <textarea name="notes" value={form.notes} onChange={onChange} rows={3}
            placeholder="Interview date, referral details..."
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
        </div>
      </div>

      <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50">Cancel</button>
        <button onClick={onSubmit} disabled={saving}
          className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-70">
          {saving ? "Adding…" : "Add Application"}
        </button>
      </div>
    </div>
  </div>
);

const Applications = () => {
  const { addToast } = useToast();
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [appRes, jobRes, resumeRes] = await Promise.all([
        getApplications(),
        getJobs(),
        getResumes(),
      ]);
      setApplications(appRes.applications || appRes || []);
      setJobs(jobRes.jobs || jobRes || []);
      setResumes(resumeRes.resumes || resumeRes || []);
    } catch (err) {
      addToast(err.userMessage || "Failed to load data. Check your connection.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.jobId || !form.resumeId) {
      addToast("Please select a job and resume", "error");
      return;
    }
    setSaving(true);
    try {
      await createApplication({ job: form.jobId, resume: form.resumeId, status: form.status, notes: form.notes });
      addToast("Application added!", "success");
      setShowModal(false);
      setForm(EMPTY_FORM);
      fetchAll();
    } catch (err) {
      addToast(err.userMessage || "Failed to add application. Please try again.", "error");
      // Modal stays open so user doesn't lose their form data
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateApplication(id, { status });
      setApplications((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
      addToast("Status updated!", "success");
    } catch (err) {
      addToast(err.userMessage || "Failed to update status. Please try again.", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteApplication(confirmId);
      addToast("Application deleted", "info");
      fetchAll();
    } catch (err) {
      addToast(err.userMessage || "Failed to delete application.", "error");
    } finally {
      setConfirmId(null);
    }
  };

  const filtered = applications.filter((a) => {
    const matchSearch =
      a.job?.title?.toLowerCase().includes(search.toLowerCase()) ||
      a.job?.company?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Stats
  const total = applications.length;
  const offers = applications.filter((a) => a.status === "Offer" || a.status === "Accepted").length;
  const interviews = applications.filter((a) => a.status?.includes("Interview")).length;

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Applications</h2>
          <p className="text-slate-500 text-sm mt-0.5">Track your job applications</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/30"
        >
          <Plus size={16} /> Add Application
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: total, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Interviews", value: interviews, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Offers", value: offers, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-48">
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
            placeholder="Search applications..."
          />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          >
            <option value="All">All Statuses</option>
            {applicationStatuses.map((s) => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          message={search || filterStatus !== "All" ? "No matching applications" : "No applications yet"}
          description={!search && filterStatus === "All" ? "Start tracking your job applications" : undefined}
          action={!search && filterStatus === "All" ? { label: "Add Application", onClick: () => setShowModal(true) } : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((app) => (
            <ApplicationCard
              key={app._id}
              application={app}
              onDelete={(id) => setConfirmId(id)}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {showModal && (
        <FormModal
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onClose={() => { setShowModal(false); setForm(EMPTY_FORM); }}
          saving={saving}
          jobs={jobs}
          resumes={resumes}
        />
      )}

      {confirmId && (
        <ConfirmModal
          message="Delete this application?"
          description="This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  );
};

export default Applications;
