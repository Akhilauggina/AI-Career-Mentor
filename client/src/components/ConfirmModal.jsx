import { AlertTriangle } from "lucide-react";

const ConfirmModal = ({ message, description, onConfirm, onCancel, danger = true }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-[fadeIn_0.2s_ease]">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
          danger ? "bg-red-100" : "bg-amber-100"
        }`}>
          <AlertTriangle size={22} className={danger ? "text-red-600" : "text-amber-600"} />
        </div>
        <h2 className="text-lg font-semibold text-slate-800 mb-1">{message}</h2>
        {description && (
          <p className="text-slate-500 text-sm mb-5">{description}</p>
        )}
        <div className="flex gap-3 mt-5">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-colors ${
              danger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
