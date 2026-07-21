import StatusBadge from "./StatusBadge";
import { formatDate } from "../utils/helpers";

const RecentApplications = ({ applications }) => {
  if (!applications?.length) return null;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            <th className="text-left px-4 py-3 text-slate-500 font-medium">Role</th>
            <th className="text-left px-4 py-3 text-slate-500 font-medium">Company</th>
            <th className="text-left px-4 py-3 text-slate-500 font-medium">Resume</th>
            <th className="text-left px-4 py-3 text-slate-500 font-medium">Status</th>
            <th className="text-left px-4 py-3 text-slate-500 font-medium">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {applications.slice(0, 8).map((app) => (
            <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-4 py-3 font-medium text-slate-800">
                {app.job?.title || "—"}
              </td>
              <td className="px-4 py-3 text-slate-500">{app.job?.company || "—"}</td>
              <td className="px-4 py-3 text-slate-500">{app.resume?.title || "—"}</td>
              <td className="px-4 py-3">
                <StatusBadge status={app.status} />
              </td>
              <td className="px-4 py-3 text-slate-400">{formatDate(app.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentApplications;
