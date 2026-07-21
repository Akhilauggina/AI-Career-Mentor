import { ExternalLink, Trash2, Star, FileText, TrendingUp } from "lucide-react";

const AtsRing = ({ score }) => {
  const color =
    score >= 80 ? "text-emerald-600" : score >= 60 ? "text-amber-500" : "text-red-500";
  const bg =
    score >= 80 ? "bg-emerald-50" : score >= 60 ? "bg-amber-50" : "bg-red-50";
  return (
    <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl ${bg}`}>
      <TrendingUp size={14} className={color} />
      <span className={`text-lg font-bold ${color}`}>{score ?? "—"}</span>
      <span className="text-xs text-slate-400 leading-none">ATS</span>
    </div>
  );
};

const ResumeCard = ({ resume, onDelete }) => {
  const uploadDate = resume.createdAt
    ? new Date(resume.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-all duration-200 flex gap-4 items-start">
      {/* File Icon */}
      <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
        <FileText size={22} className="text-indigo-600" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-800 truncate">{resume.title}</h3>
            {uploadDate && (
              <p className="text-xs text-slate-400 mt-0.5">Uploaded {uploadDate}</p>
            )}
          </div>
          <AtsRing score={resume.atsScore} />
        </div>

        {resume.isActive && (
          <div className="flex items-center gap-1 mt-2">
            <Star size={13} className="text-amber-500 fill-amber-500" />
            <span className="text-xs font-medium text-amber-600">Active Resume</span>
          </div>
        )}

        <div className="flex items-center gap-2 mt-3">
          <a
            href={resume.pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
          >
            <ExternalLink size={13} />
            View PDF
          </a>
          <button
            onClick={() => onDelete(resume._id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors ml-auto"
          >
            <Trash2 size={13} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeCard;
