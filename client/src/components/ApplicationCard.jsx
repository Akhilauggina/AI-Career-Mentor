import StatusBadge from "./StatusBadge";
import { Trash2, Briefcase, FileText, ChevronDown } from "lucide-react";
import { applicationStatuses } from "../utils/helpers";

const statusTimeline = [
  "Applied",
  "Interview Scheduled",
  "Interview Completed",
  "Offer",
  "Accepted",
];

const ApplicationCard = ({ application, onDelete, onStatusChange }) => {
  const currentStep = statusTimeline.indexOf(application.status);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-slate-800 truncate">
            {application.job?.title || "Unknown Role"}
          </h3>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            {application.job?.company || "—"}
          </p>
        </div>
        <StatusBadge status={application.status} />
      </div>

      {/* Meta */}
      <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">
        {application.resume?.title && (
          <span className="flex items-center gap-1.5">
            <FileText size={13} className="text-slate-400" />
            {application.resume.title}
            {application.resume.atsScore != null && (
              <span className="text-xs text-indigo-600 font-medium">
                (ATS: {application.resume.atsScore})
              </span>
            )}
          </span>
        )}
        {application.job?.location && (
          <span className="flex items-center gap-1.5">
            <Briefcase size={13} className="text-slate-400" />
            {application.job.location}
          </span>
        )}
      </div>

      {/* Timeline */}
      {application.status !== "Rejected" && (
        <div className="mt-4 flex items-center gap-0">
          {statusTimeline.map((step, idx) => {
            const done = currentStep >= idx;
            const active = currentStep === idx;
            return (
              <div key={step} className="flex items-center flex-1">
                <div
                  title={step}
                  className={`w-2.5 h-2.5 rounded-full shrink-0 transition-all ${
                    active
                      ? "w-3 h-3 bg-indigo-600 ring-2 ring-indigo-200"
                      : done
                      ? "bg-indigo-400"
                      : "bg-slate-200"
                  }`}
                />
                {idx < statusTimeline.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 ${
                      currentStep > idx ? "bg-indigo-400" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
        <div className="relative flex-1">
          <select
            value={application.status}
            onChange={(e) => onStatusChange(application._id, e.target.value)}
            className="w-full appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 cursor-pointer"
          >
            {applicationStatuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        <button
          onClick={() => onDelete(application._id)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors shrink-0"
        >
          <Trash2 size={13} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default ApplicationCard;
