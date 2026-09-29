import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Clock, AlertTriangle, CheckCircle, Zap, Brain, Hash } from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function FeedItem({ incident, index }) {
  const outcomeColor =
    incident.outcome?.toLowerCase().includes("resolved")
      ? "var(--green-bright)"
      : incident.outcome?.toLowerCase().includes("escalat")
      ? "var(--red-bright)"
      : "var(--amber-bright)";

  return (
    <motion.div
      className="feed-item"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <div className="feed-item-accent" style={{ background: outcomeColor }} />
      <div className="feed-item-body">
        <div className="feed-item-header">
          <span className="feed-item-id">{incident.id}</span>
          <span className="feed-item-machine">{incident.machine_id}</span>
          <span className="feed-item-time">
            <Clock size={10} />
            {timeAgo(incident.timestamp)}
          </span>
        </div>
        <p className="feed-item-problem">{incident.problem}</p>
        <p className="feed-item-cause">
          <Zap size={10} />
          {incident.root_cause}
        </p>
        <p className="feed-item-outcome" style={{ color: outcomeColor }}>
          <CheckCircle size={10} />
          {incident.outcome}
        </p>
      </div>
    </motion.div>
  );
}

export default function ActivityFeed() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/api/incidents?limit=15`);
        const data = await res.json();
        setIncidents(data.incidents || []);
      } catch {
        setIncidents([]);
      } finally {
        setLoading(false);
      }
    };
    load();

    // Poll every 30s
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="activity-feed">
      <div className="feed-header">
        <div className="feed-header-left">
          <motion.span
            className="pulse-dot green"
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="feed-title">Incident Log</span>
        </div>
        <span className="feed-count">{incidents.length}</span>
      </div>

      <div className="feed-body">
        {loading && (
          <div className="feed-loading">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
              <Brain size={18} style={{ color: "var(--cyan)" }} />
            </motion.div>
          </div>
        )}

        {!loading && incidents.length === 0 && (
          <div className="feed-empty">
            <Activity size={20} style={{ color: "var(--text-muted)" }} />
            <p>No incidents logged yet</p>
            <span>Use the form to teach VYRON</span>
          </div>
        )}

        <AnimatePresence>
          {incidents.map((inc, i) => (
            <FeedItem key={inc.id} incident={inc} index={i} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
