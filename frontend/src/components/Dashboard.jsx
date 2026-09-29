import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { Cpu, AlertTriangle, ShieldCheck, Brain, Activity, TrendingUp, Plus, Download, Filter, Video } from "lucide-react";
import MachineCard from "./MachineCard";

function AnimatedCounter({ value, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || !ref.current) return;
    gsap.fromTo(
      ref.current,
      { textContent: 0 },
      {
        textContent: value,
        duration: 1.8,
        ease: "power2.out",
        snap: { textContent: 1 },
        onUpdate() {
          ref.current.textContent =
            Math.round(parseFloat(ref.current.textContent)) + suffix;
        },
      }
    );
  }, [inView, value, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

export default function Dashboard({
  machines,
  stats,
  selectedMachine,
  onMachineClick,
  onOpenVideo,
  onOpenTroubleshoot,
  onNavigate,
  showToast,
  searchTerm,
  t,
}) {
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "normal" | "warning" | "critical"

  const filteredMachines = machines.filter((m) => {
    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    const matchesSearch =
      !searchTerm ||
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const normalCount = machines.filter((m) => m.status === "normal").length;
  const warningCount = machines.filter((m) => m.status === "warning").length;
  const criticalCount = machines.filter((m) => m.status === "critical").length;

  const cards = [
    { label: t.totalMachines || "Total Machines", value: stats.total_machines || machines.length, suffix: "", icon: Cpu, color: "var(--gold)", bg: "var(--gold-glow)" },
    { label: t.warnings || "Warnings", value: warningCount || stats.warning, suffix: "", icon: AlertTriangle, color: "var(--warn)", bg: "var(--warn-glow)" },
    { label: t.normal || "Normal", value: normalCount || stats.normal, suffix: "", icon: ShieldCheck, color: "var(--safe)", bg: "var(--safe-glow)" },
    { label: t.uptime || "Uptime", value: stats.uptime_percent || 99.8, suffix: "%", icon: TrendingUp, color: "var(--gold-bright)", bg: "var(--gold-trace)" },
    { label: t.memory || "Memory Active", value: t.memoryActive || "ACTIVE", isText: true, icon: Brain, color: "var(--gold)", bg: "var(--gold-glow)" },
  ];

  return (
    <div className="dashboard">
      {/* Header */}
      <motion.header
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <p className="section-eyebrow">{t.tagline || "AI Operations Center"}</p>
          <h1 className="dashboard-title">
            VYRON <span className="text-gold">{t.dashboard || "Operations Center"}</span>
          </h1>
          <p className="dashboard-sub">
            Monitor fleet status & let VYRON learn from every operational incident.
          </p>
        </div>

        {/* Quick Actions Header Buttons */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            className="btn-secondary"
            onClick={() => onNavigate("incidents")}
          >
            <Plus size={15} style={{ marginRight: 6 }} /> {t.logIncident || "Log Incident"}
          </button>
          <button
            className="btn-secondary"
            onClick={() =>
              showToast({
                type: "success",
                title: "Report Exported",
                message: "Fleet Diagnostic summary PDF downloaded.",
              })
            }
          >
            <Download size={15} style={{ marginRight: 6 }} /> {t.exportReport || "Export Report"}
          </button>
          <button
            className="btn-primary"
            onClick={() => onOpenVideo(machines[0])}
          >
            <Video size={15} style={{ marginRight: 6 }} /> {t.videoGuide || "Video Guides"}
          </button>
        </div>
      </motion.header>

      {/* Stats Cards Grid */}
      <div className="stats-grid">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              className="stat-card-3d"
              style={{ "--card-color": card.color, "--card-bg": card.bg }}
              initial={{ opacity: 0, y: 20, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              whileHover={{ y: -4 }}
              onClick={() => {
                showToast({
                  type: "info",
                  title: card.label,
                  message: `${card.value} metric telemetry value verified.`,
                });
              }}
            >
              <div className="stat-card-3d-icon"><Icon size={20} /></div>
              <div className="stat-card-3d-info">
                <p className="stat-card-3d-label">{card.label}</p>
                {card.isText ? (
                  <span className="stat-card-3d-value" style={{ color: card.color }}>
                    {card.value}
                  </span>
                ) : (
                  <span className="stat-card-3d-value" style={{ color: card.color }}>
                    <AnimatedCounter value={card.value} suffix={card.suffix} />
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Machine Fleet Section */}
      <motion.section
        className="machine-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="machine-section-header">
          <div>
            <h2 className="machine-section-title">{t.machineFleet || "Machine Fleet"}</h2>
            <p className="machine-section-sub">
              Showing {filteredMachines.length} of {machines.length} active units — Select any card for Hindsight analysis
            </p>
          </div>

          {/* Interactive Filter Pills */}
          <div className="machine-section-legend">
            {[
              { id: "all", label: t.filterAll || "All", color: "var(--text-primary)" },
              { id: "normal", label: `${t.filterNormal || "Normal"} (${normalCount})`, color: "var(--safe)" },
              { id: "warning", label: `${t.filterWarning || "Warning"} (${warningCount})`, color: "var(--warn)" },
              { id: "critical", label: `${t.filterCritical || "Critical"} (${criticalCount})`, color: "var(--danger)" },
            ].map((f) => (
              <button
                key={f.id}
                className={`filter-pill-btn ${statusFilter === f.id ? "active" : ""}`}
                onClick={() => setStatusFilter(f.id)}
                style={{
                  padding: "5px 12px",
                  borderRadius: "var(--radius-full)",
                  fontSize: 12,
                  fontWeight: 600,
                  background: statusFilter === f.id ? "var(--gold-glow)" : "var(--steel)",
                  border: statusFilter === f.id ? "1px solid var(--gold)" : "1px solid var(--border-dim)",
                  color: f.color,
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Machine Cards Grid */}
        {filteredMachines.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", background: "var(--bg-card)", borderRadius: "var(--radius-xl)" }}>
            <h3>No machines match filter criteria</h3>
            <button className="btn-secondary" style={{ marginTop: 12 }} onClick={() => setStatusFilter("all")}>
              Clear Filter
            </button>
          </div>
        ) : (
          <div className="machine-grid-3d">
            {filteredMachines.map((machine, i) => (
              <MachineCard
                key={machine.id}
                machine={machine}
                isSelected={selectedMachine?.id === machine.id}
                onClick={() => onMachineClick(machine)}
                onOpenVideo={onOpenVideo}
                onOpenTroubleshoot={onOpenTroubleshoot}
                index={i}
              />
            ))}
          </div>
        )}
      </motion.section>
    </div>
  );
}
