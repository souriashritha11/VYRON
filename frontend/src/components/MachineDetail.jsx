import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Brain, Loader2, AlertTriangle, CheckCircle,
  MapPin, Hash, Activity, Zap, ChevronRight, Database,
  MemoryStick, Eye, ShieldCheck, Video, FileText, Wrench
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

function MemoryCard({ memory, index }) {
  return (
    <motion.div
      className="memory-card"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <div className="memory-card-header">
        <Database size={12} />
        <span className="memory-type">{memory.type || "MEMORY"}</span>
      </div>
      <p className="memory-text">{memory.text}</p>
    </motion.div>
  );
}

function RecommendationLine({ line, index }) {
  const clean = line.trim();
  if (!clean) return <div style={{ height: 10 }} />;

  if (clean.startsWith("### ") || clean.startsWith("## ")) {
    return (
      <motion.h4 className="rec-heading" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }}>
        {clean.replace(/^#+\s*/, "")}
      </motion.h4>
    );
  }

  if (clean.includes("|---") || clean.includes("| ---")) return null;

  if (clean.startsWith("|") && clean.endsWith("|")) {
    const cells = clean.split("|").map(c => c.trim()).filter(Boolean);
    return (
      <motion.div className="rec-table-row" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.03 }}>
        {cells.map((cell, i) => <span key={i}>{cell}</span>)}
      </motion.div>
    );
  }

  if (/^\d+\./.test(clean)) {
    const match = clean.match(/^(\d+)\.\s*(.*)$/);
    return (
      <motion.div className="rec-item" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
        <span className="rec-num">{match?.[1]}</span>
        <p>{match?.[2] || clean}</p>
      </motion.div>
    );
  }

  if (clean.startsWith("- ") || clean.startsWith("* ")) {
    return (
      <motion.div className="rec-bullet" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }}>
        <ChevronRight size={12} />
        <p>{clean.slice(2)}</p>
      </motion.div>
    );
  }

  if (clean.startsWith("**") && clean.endsWith("**")) {
    return (
      <motion.p className="rec-bold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {clean.slice(2, -2)}
      </motion.p>
    );
  }

  return (
    <motion.p className="rec-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.03 }}>
      {clean}
    </motion.p>
  );
}

export default function MachineDetail({ machine, onClose, onOpenVideo, showToast }) {
  const [troubleshooting, setTroubleshooting] = useState(false);
  const [recommendation, setRecommendation] = useState("");
  const [memories, setMemories] = useState([]);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("analysis");

  const troubleshoot = async () => {
    setTroubleshooting(true);
    setRecommendation("");
    setMemories([]);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/troubleshoot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          machine_id: machine.id,
          problem: machine.status === "warning"
            ? `Machine ${machine.id} is showing a warning status and may be overheating or malfunctioning.`
            : `Please analyze machine ${machine.id} and check for any previous incidents or patterns.`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Troubleshooting failed");

      setRecommendation(data.recommendation || "No recommendation returned.");
      setMemories(data.memories || []);

      if (showToast) {
        showToast({
          type: "success",
          title: "Hindsight AI Analysis Complete",
          message: `Retrieved historical memory vector match for ${machine.id}`,
        });
      }
    } catch (err) {
      setError(err.message || "Unable to connect to VYRON AI.");
    } finally {
      setTroubleshooting(false);
    }
  };

  const statusConfig = {
    normal:   { color: "var(--safe)",   label: "NORMAL",   icon: ShieldCheck },
    warning:  { color: "var(--warn)",   label: "WARNING",  icon: AlertTriangle },
    critical: { color: "var(--danger)", label: "CRITICAL", icon: Zap },
  };
  const sc = statusConfig[machine.status] || statusConfig.normal;
  const StatusIcon = sc.icon;

  return (
    <motion.div
      className="machine-detail-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="machine-detail-panel"
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 60, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
      >
        {/* Header */}
        <div className="detail-panel-header">
          <div className="detail-panel-title">
            <div className="detail-panel-id-badge">{machine.id}</div>
            <div>
              <h2 className="detail-panel-name">{machine.name}</h2>
              <div className="detail-panel-meta">
                <MapPin size={11} />
                <span>{machine.location}</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span className="detail-status-badge" style={{ color: sc.color, borderColor: sc.color + "40", background: sc.color + "12" }}>
              <StatusIcon size={12} />
              {sc.label}
            </span>
            <motion.button
              className="detail-close-btn"
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={16} />
            </motion.button>
          </div>
        </div>

        {/* Info grid */}
        <div className="detail-info-grid">
          {[
            { label: "ASSET ID",   value: machine.id,       icon: Hash },
            { label: "STATUS",     value: machine.status.toUpperCase(), icon: Activity, valueColor: sc.color },
            { label: "LOCATION",   value: machine.location, icon: MapPin },
            { label: "MEMORY",     value: "HINDSIGHT ACTIVE", icon: MemoryStick, valueColor: "var(--gold)" },
          ].map(({ label, value, icon: Icon, valueColor }) => (
            <div key={label} className="detail-info-card">
              <div className="detail-info-label">
                <Icon size={10} />
                {label}
              </div>
              <div className="detail-info-value" style={{ color: valueColor }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Video & Quick Actions Bar */}
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button
            className="btn-secondary full-w"
            onClick={() => onOpenVideo(machine)}
            style={{ borderColor: "var(--gold-border)" }}
          >
            <Video size={15} className="text-gold" style={{ marginRight: 6 }} /> Watch Video Solution
          </button>
          <button
            className="btn-secondary full-w"
            onClick={() => {
              if (showToast) {
                showToast({
                  type: "info",
                  title: "Diagnostic PDF Exported",
                  message: `Downloaded diagnostic summary for ${machine.name}`,
                });
              }
            }}
          >
            <FileText size={15} style={{ marginRight: 6 }} /> PDF Diagnostic
          </button>
        </div>

        {/* AI Troubleshoot CTA */}
        <div className="detail-ai-cta" style={{ marginTop: 16 }}>
          <div className="detail-ai-cta-left">
            <motion.div
              className="detail-ai-orb"
              animate={{ boxShadow: [
                "0 0 18px rgba(245,197,24,0.3)",
                "0 0 38px rgba(245,140,0,0.55)",
                "0 0 18px rgba(245,197,24,0.3)",
              ]}}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Brain size={22} />
            </motion.div>
            <div>
              <p className="detail-ai-title">VYRON AI Analysis</p>
              <p className="detail-ai-sub">Search Hindsight memory for past incidents</p>
            </div>
          </div>

          <motion.button
            className="detail-ai-btn"
            onClick={troubleshoot}
            disabled={troubleshooting}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            {troubleshooting ? (
              <>
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                  <Loader2 size={15} />
                </motion.span>
                Thinking...
              </>
            ) : (
              <>
                <Zap size={15} />
                Analyze
              </>
            )}
          </motion.button>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="detail-error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AlertTriangle size={16} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {(recommendation || memories.length > 0) && (
            <motion.div
              className="detail-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Tabs */}
              <div className="detail-result-tabs">
                <button
                  className={`detail-tab${tab === "analysis" ? " active" : ""}`}
                  onClick={() => setTab("analysis")}
                >
                  <Eye size={13} />
                  Analysis
                </button>
                <button
                  className={`detail-tab${tab === "memories" ? " active" : ""}`}
                  onClick={() => setTab("memories")}
                >
                  <MemoryStick size={13} />
                  Memories ({memories.length})
                </button>
              </div>

              {tab === "analysis" && recommendation && (
                <div className="detail-recommendation">
                  <div className="detail-rec-label">
                    <Brain size={13} />
                    VYRON ANALYSIS · POWERED BY HINDSIGHT
                  </div>
                  <div className="detail-rec-body">
                    {recommendation.split("\n").map((line, i) => (
                      <RecommendationLine key={i} line={line} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {tab === "memories" && (
                <div className="detail-memories">
                  {memories.length === 0 ? (
                    <p className="detail-no-memories">No memory evidence found for this query.</p>
                  ) : (
                    memories.map((mem, i) => <MemoryCard key={i} memory={mem} index={i} />)
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
