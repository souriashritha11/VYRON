import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, CheckCircle, AlertTriangle, Loader2,
  ChevronDown, Cpu, Zap,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

const OUTCOMES = [
  "Problem resolved — machine back to normal",
  "Temporary fix applied — monitoring required",
  "Parts replaced — awaiting confirmation",
  "Root cause unclear — escalated",
  "Preventive action taken",
];

export default function IncidentForm({ machines }) {
  const [form, setForm] = useState({
    machine_id: "",
    problem: "",
    root_cause: "",
    action_taken: "",
    outcome: OUTCOMES[0],
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (field, value) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.machine_id || !form.problem || !form.root_cause || !form.action_taken) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    setSuccess(null);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/incidents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to log incident.");
      setSuccess(data.incident?.id || "INC-XXXX");
      setForm({ machine_id: "", problem: "", root_cause: "", action_taken: "", outcome: OUTCOMES[0] });
    } catch (err) {
      setError(err.message || "Unable to connect to VYRON backend.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="incident-form-wrap">
      {/* Header */}
      <div className="section-header">
        <div>
          <p className="section-eyebrow">MACHINE LEARNING</p>
          <h2 className="section-title">Teach VYRON</h2>
          <p className="section-sub">
            Log an incident so VYRON can remember it and improve future recommendations.
          </p>
        </div>
        <div className="incident-brain-icon">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            style={{ position: "absolute", inset: -6, borderRadius: "50%", border: "1px dashed rgba(0,212,255,0.3)" }}
          />
          <Brain size={28} />
        </div>
      </div>

      <form className="incident-form" onSubmit={handleSubmit}>
        {/* Machine Select */}
        <div className="form-group">
          <label className="form-label">
            <Cpu size={12} />
            Machine *
          </label>
          <div className="form-select-wrap">
            <select
              className="form-select"
              value={form.machine_id}
              onChange={(e) => handleChange("machine_id", e.target.value)}
              required
            >
              <option value="">Select machine...</option>
              {machines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.id} — {m.name}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="form-select-icon" />
          </div>
        </div>

        {/* Problem */}
        <div className="form-group">
          <label className="form-label">
            <AlertTriangle size={12} />
            Problem Description *
          </label>
          <textarea
            className="form-textarea"
            rows={3}
            placeholder="Describe the problem that occurred..."
            value={form.problem}
            onChange={(e) => handleChange("problem", e.target.value)}
            required
          />
        </div>

        {/* Root Cause */}
        <div className="form-group">
          <label className="form-label">
            <Zap size={12} />
            Root Cause *
          </label>
          <textarea
            className="form-textarea"
            rows={2}
            placeholder="What caused this problem?"
            value={form.root_cause}
            onChange={(e) => handleChange("root_cause", e.target.value)}
            required
          />
        </div>

        {/* Action Taken */}
        <div className="form-group">
          <label className="form-label">
            Action Taken *
          </label>
          <textarea
            className="form-textarea"
            rows={2}
            placeholder="What repair or action was performed?"
            value={form.action_taken}
            onChange={(e) => handleChange("action_taken", e.target.value)}
            required
          />
        </div>

        {/* Outcome */}
        <div className="form-group">
          <label className="form-label">Outcome</label>
          <div className="form-select-wrap">
            <select
              className="form-select"
              value={form.outcome}
              onChange={(e) => handleChange("outcome", e.target.value)}
            >
              {OUTCOMES.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            <ChevronDown size={14} className="form-select-icon" />
          </div>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="form-error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <AlertTriangle size={14} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success */}
        <AnimatePresence>
          {success && (
            <motion.div
              className="form-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <CheckCircle size={16} />
              <div>
                <strong>Incident {success} stored in VYRON memory</strong>
                <p>VYRON will remember this and use it for future recommendations.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <motion.button
          type="submit"
          className="form-submit"
          disabled={submitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          {submitting ? (
            <>
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <Loader2 size={16} />
              </motion.span>
              Storing in memory...
            </>
          ) : (
            <>
              <Brain size={16} />
              Save to VYRON Memory
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}
