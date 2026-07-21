import { useEffect, useState } from "react";
import { getJobs, createJob, updateJob, deleteJob } from "../services/jobService";
import { useToast } from "../context/ToastContext";
import { Spinner } from "../components/Loading";
import JobCard from "../components/JobCard";
import EmptyState from "../components/EmptyState";
import SearchBar from "../components/SearchBar";
import ConfirmModal from "../components/ConfirmModal";
import { Plus, X, Briefcase, ChevronDown } from "lucide-react";
import { jobStatuses, jobTypes, experienceLevels } from "../utils/helpers";

const EMPTY_FORM = {
  title: "",
  company: "",
  location: "",
  salary: "",
  type: "",
  experience: "",
  status: "Saved",
  description: "",
  skills: "",
  applicationLink: "",
  deadline: "",
};

const FormModal = ({ form, onChange, onSubmit, onClose, editing, saving }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h2 className="text-lg font-semibold text-slate-800">
          {editing ? "Edit Job" : "Add New Job"}
        </h2>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Job Title *</label>
            <input name="title" value={form.title} onChange={onChange} placeholder="Software Engineer"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Company *</label>
            <input name="company" value={form.company} onChange={onChange} placeholder="Google"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Location</label>
            <input name="location" value={form.location} onChange={onChange} placeholder="Bangalore, India"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Salary</label>
            <input name="salary" value={form.salary} onChange={onChange} placeholder="₹12 LPA"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Type</label>
            <select name="type" value={form.type} onChange={onChange}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-white">
              <option value="">Select</option>
              {jobTypes.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Experience</label>
            <select name="experience" value={form.experience} onChange={onChange}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-white">
              <option value="">Select</option>
              {experienceLevels.map((e) => <option key={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Status</label>
            <select name="status" value={form.status} onChange={onChange}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-white">
              {jobStatuses.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Skills (comma-separated)</label>
          <input name="skills" value={form.skills} onChange={onChange} placeholder="React, Node.js, MongoDB"
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Application Link</label>
          <input name="applicationLink" value={form.applicationLink} onChange={onChange} placeholder="https://..."
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Description</label>
          <textarea name="description" value={form.description} onChange={onChange} rows={3}
            placeholder="Job description..."
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 resize-none" />
        </div>
      </div>

      <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
        <button onClick={onClose}
          className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors">
          Cancel
        </button>
        <button onClick={onSubmit} disabled={saving}
          className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70">
          {saving ? "Saving…" : editing ? "Update Job" : "Add Job"}
        </button>
      </div>
    </div>
  </div>
);

const Jobs = () => {
  const { addToast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      const res = await getJobs();
      setJobs(res.jobs || res || []);
    } catch (err) {
      addToast(err.userMessage || "Failed to load jobs. Check your connection.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.title || !form.company) {
      addToast("Title and company are required", "error");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        skills: form.skills
          ? form.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };
      if (editingId) {
        await updateJob(editingId, payload);
        addToast("Job updated!", "success");
      } else {
        await createJob(payload);
        addToast("Job added!", "success");
      }
      setShowModal(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      fetchJobs();
    } catch (err) {
      addToast(err.userMessage || "Failed to save job. Please try again.", "error");
      // Modal stays open so user doesn't lose their form data
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (job) => {
    setEditingId(job._id);
    setForm({
      title: job.title || "",
      company: job.company || "",
      location: job.location || "",
      salary: job.salary || "",
      type: job.type || "",
      experience: job.experience || "",
      status: job.status || "Saved",
      description: job.description || "",
      skills: Array.isArray(job.skills) ? job.skills.join(", ") : job.skills || "",
      applicationLink: job.applicationLink || "",
      deadline: job.deadline || "",
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteJob(confirmId);
      addToast("Job deleted", "info");
      fetchJobs();
    } catch (err) {
      addToast(err.userMessage || "Failed to delete job. Please try again.", "error");
    } finally {
      setConfirmId(null);
    }
  };

  const filtered = jobs.filter((j) => {
    const matchSearch =
      j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.company?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || j.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Jobs</h2>
          <p className="text-slate-500 text-sm mt-0.5">{jobs.length} saved positions</p>
        </div>
        <button
          onClick={() => { setEditingId(null); setForm(EMPTY_FORM); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/30"
        >
          <Plus size={16} /> Add Job
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-48">
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
            placeholder="Search jobs..."
          />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          >
            <option value="All">All Status</option>
            {jobStatuses.map((s) => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          message={search || filterStatus !== "All" ? "No matching jobs" : "No jobs yet"}
          description={!search && filterStatus === "All" ? "Add your first job to start tracking" : undefined}
          action={!search && filterStatus === "All" ? { label: "Add Job", onClick: () => setShowModal(true) } : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onEdit={handleEdit}
              onDelete={(id) => setConfirmId(id)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <FormModal
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onClose={() => { setShowModal(false); setEditingId(null); setForm(EMPTY_FORM); }}
          editing={!!editingId}
          saving={saving}
        />
      )}

      {/* Confirm delete */}
      {confirmId && (
        <ConfirmModal
          message="Delete this job?"
          description="This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  );
};

export default Jobs;
