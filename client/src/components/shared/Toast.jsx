import useToastStore from "../../store/useToastStore.js";

const Toast = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}
          onClick={() => removeToast(t.id)}
          style={{ cursor: "pointer" }}>
          <div className="flex items-center justify-between gap-3">
            <span>{t.message}</span>
            <span className="opacity-40 text-xs font-bold">×</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Toast;
