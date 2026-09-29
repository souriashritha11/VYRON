import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={18} style={{ color: "var(--safe)" }} />,
    warning: <AlertCircle size={18} style={{ color: "var(--warn)" }} />,
    info: <Info size={18} style={{ color: "var(--gold)" }} />,
  };

  return (
    <AnimatePresence>
      <motion.div
        className="toast-notification"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <div className="toast-icon">{icons[toast.type] || icons.info}</div>
        <div className="toast-content">
          <p className="toast-title">{toast.title}</p>
          {toast.message && <p className="toast-message">{toast.message}</p>}
        </div>
        <button className="toast-close" onClick={onClose}>
          <X size={14} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
