import { MapPin, Briefcase, Clock, ExternalLink, Pencil, Trash2, DollarSign } from "lucide-react";
import StatusBadge from "./StatusBadge";

const JobCard = ({ job, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-all duration-200 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-slate-800 truncate">{job.title}</h3>
          <p className="text-sm text-slate-500 font-medium mt-0.5">{job.company}</p>
        </div>
        <StatusBadge status={job.status} />
      </div>

      {/* Details */}
      <div className="flex flex-wrap gap-3 text-sm text-slate-500">
        {job.location && (
          <span className="flex items-center gap-1.5">
            <MapPin size={14} className="text-slate-400" />
            {job.location}
          </span>
        )}
        {job.type && (
          <span className="flex items-center gap-1.5">
            <Briefcase size={14} className="text-slate-400" />
            {job.type}
          </span>
        )}
        {job.experience && (
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-slate-400" />
            {job.experience}
          </span>
        )}
        {job.salary && (
          <span className="flex items-center gap-1.5">
            <DollarSign size={14} className="text-slate-400" />
            {job.salary}
          </span>
        )}
      </div>

      {/* Skills */}
      {job.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {job.skills.slice(0, 5).map((skill, i) => (
            <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-lg font-medium">
              {skill}
            </span>
          ))}
          {job.skills.length > 5 && (
            <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-xs rounded-lg">
              +{job.skills.length - 5}
            </span>
          )}
        </div>
      )}

      {/* Description */}
      {job.description && (
        <p className="text-sm text-slate-500 line-clamp-2">{job.description}</p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        {job.applicationLink && (
          <a
            href={job.applicationLink}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
          >
            <ExternalLink size={13} />
            Apply
          </a>
        )}
        <button
          onClick={() => onEdit(job)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 transition-colors"
        >
          <Pencil size={13} />
          Edit
        </button>
        <button
          onClick={() => onDelete(job._id)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors ml-auto"
        >
          <Trash2 size={13} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default JobCard;
