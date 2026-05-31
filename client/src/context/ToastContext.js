import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type = "info", title, message }) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

      setToasts((currentToasts) => [...currentToasts, { id, type, title, message }]);
      window.setTimeout(() => dismissToast(id), 3800);
    },
    [dismissToast]
  );

  const value = useMemo(
    () => ({
      showToast,
    }),
    [showToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl border px-4 py-4 shadow-xl backdrop-blur ${
              toast.type === "success"
                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-50"
                : toast.type === "error"
                  ? "border-rose-400/30 bg-rose-400/10 text-rose-50"
                  : "border-sky-400/30 bg-sky-400/10 text-sky-50"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{toast.title}</p>
                <p className="mt-1 text-sm opacity-90">{toast.message}</p>
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="rounded-full border border-white/10 px-2 py-1 text-xs"
              >
                Close
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
