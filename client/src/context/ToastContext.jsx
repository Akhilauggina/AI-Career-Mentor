import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  if (!toasts.length) return null;

  const typeStyles = {
    success: "bg-emerald-600",
    error: "bg-red-600",
    info: "bg-indigo-600",
    warning: "bg-amber-500",
  };

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
    warning: "⚠",
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${typeStyles[toast.type] || typeStyles.success} text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-64 max-w-sm animate-[slideIn_0.3s_ease]`}
          style={{ animation: "slideIn 0.3s ease" }}
        >
          <span className="text-lg font-bold">{icons[toast.type]}</span>
          <span className="flex-1 text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-white/70 hover:text-white transition-colors ml-2"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
