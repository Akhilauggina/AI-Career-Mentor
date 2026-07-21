import { FolderOpen } from "lucide-react";

const EmptyState = ({ message = "Nothing here yet", description, action }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-12 text-center flex flex-col items-center">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
        <FolderOpen size={28} className="text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-1">{message}</h3>
      {description && (
        <p className="text-slate-500 text-sm mb-4">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
