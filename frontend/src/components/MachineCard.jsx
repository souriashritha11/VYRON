import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Cpu, Activity, Wrench, Zap, AlertTriangle, CheckCircle, Video, ChevronRight } from "lucide-react";

function StatusBadge({ status }) {
  const config = {
    normal:   { label: "NORMAL",   color: "var(--safe)",   bg: "var(--safe-glow)",  border: "var(--safe)",  Icon: CheckCircle },
    warning:  { label: "WARNING",  color: "var(--warn)",   bg: "var(--warn-glow)",  border: "var(--warn)",  Icon: AlertTriangle },
    critical: { label: "CRITICAL", color: "var(--danger)", bg: "var(--danger-glow)",border: "var(--danger)",Icon: Zap },
  };
  const c = config[status] || config.normal;
  return (
    <span
      className="status-badge"
      style={{ color: c.color, background: c.bg, border: `1px solid ${c.border}` }}
    >
      <motion.span
        style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: c.color, boxShadow: `0 0 6px ${c.color}` }}
        animate={ status !== "normal" ? { opacity: [1, 0.2, 1] } : {}}
        transition={{ duration: 1.1, repeat: Infinity }}
      />
      {c.label}
    </span>
  );
}

export default function MachineCard({ machine, isSelected, onClick, onOpenVideo, onOpenTroubleshoot, index }) {
  const cardRef = useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 260, damping: 26 });
  const springY = useSpring(rotateY, { stiffness: 260, damping: 26 });

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
    const dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
    rotateY.set(dx * 8);
    rotateX.set(-dy * 8);
  };

  const handleMouseLeave = () => { rotateX.set(0); rotateY.set(0); };

  return (
    <motion.div
      ref={cardRef}
      className={`machine-card-3d${isSelected ? " selected" : ""}`}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Card Header */}
      <div className="machine-card-top">
        <div className="machine-name-group">
          <span className="text-mono text-gold" style={{ fontSize: 11, fontWeight: 700 }}>
            {machine.id}
          </span>
          <h3>{machine.name}</h3>
          <p className="machine-model">{machine.model || "Industrial Unit"} · {machine.location}</p>
        </div>
        <StatusBadge status={machine.status} />
      </div>

      {/* Metrics */}
      <div className="machine-card-metrics">
        <div className="metric-pill">
          <span className="lbl">Operating Temp</span>
          <span className="val" style={{ color: machine.temperature > 75 ? "var(--warn)" : "inherit" }}>
            {machine.temperature || 68.4}°C
          </span>
        </div>
        <div className="metric-pill">
          <span className="lbl">Vibration</span>
          <span className="val">{machine.vibration || "1.2"} mm/s</span>
        </div>
      </div>

      {/* Interactive Action Buttons */}
      <div className="machine-card-actions" onClick={(e) => e.stopPropagation()}>
        <button
          className="btn-card-action primary"
          onClick={onClick}
          title="Open Machine Details"
        >
          View Details <ChevronRight size={13} />
        </button>

        <button
          className="btn-card-action"
          onClick={() => onOpenVideo(machine)}
          title="Watch 3D Maintenance Video"
        >
          <Video size={13} className="text-gold" /> Video Guide
        </button>

        <button
          className="btn-card-action"
          onClick={() => onOpenTroubleshoot(machine)}
          title="Run Hindsight AI Diagnosis"
        >
          <Wrench size={13} /> AI Repair
        </button>
      </div>
    </motion.div>
  );
}
