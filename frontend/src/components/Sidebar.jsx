import { motion } from "framer-motion";
import {
  Brain, LayoutDashboard, Cpu, AlertTriangle,
  MemoryStick, Settings, Activity, Zap, Video
} from "lucide-react";

export default function Sidebar({
  activeSection,
  onNavigate,
  onOpenSettings,
  onOpenVideoLibrary,
  t,
}) {
  const navItems = [
    { icon: LayoutDashboard, label: t.dashboard || "Dashboard",  id: "dashboard" },
    { icon: Cpu,             label: t.machines || "Machines",   id: "machines"  },
    { icon: AlertTriangle,   label: t.incidents || "Incidents",  id: "incidents" },
    { icon: Brain,           label: t.aiAgent || "AI Agent",   id: "ai"        },
    { icon: MemoryStick,     label: t.memory || "Memory",     id: "memory"    },
  ];

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <motion.div
          className="sidebar-logo"
          animate={{ boxShadow: [
            "0 0 14px var(--gold-glow)",
            "0 0 32px var(--gold)",
            "0 0 14px var(--gold-glow)",
          ]}}
          transition={{ duration: 2.8, repeat: Infinity }}
        >
          <Brain size={22} />
        </motion.div>
        <div className="sidebar-brand-text">
          <span className="sidebar-name">{t.appTitle || "VYRON"}</span>
          <span className="sidebar-tagline">{t.tagline || "Intelligent Operations"}</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <p className="sidebar-section-label">Navigation</p>
        {navItems.map((item, i) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <motion.button
              key={item.id}
              className={`sidebar-nav-item${isActive ? " active" : ""}`}
              onClick={() => onNavigate(item.id)}
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="nav-icon-wrap">
                <Icon size={17} />
              </span>
              <span>{item.label}</span>
              {isActive && (
                <motion.span
                  layoutId="nav-bar"
                  style={{
                    position: "absolute", right: 0, top: "18%",
                    height: "64%", width: 3, borderRadius: 3,
                    background: "var(--gold)",
                    boxShadow: "0 0 8px var(--gold)",
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Quick Media Section */}
      <div style={{ marginTop: 16 }}>
        <p className="sidebar-section-label">Media & Guides</p>
        <button
          className="sidebar-nav-item"
          onClick={onOpenVideoLibrary}
        >
          <span className="nav-icon-wrap"><Video size={17} className="text-gold" /></span>
          <span>Video Solutions</span>
        </button>
      </div>

      {/* Footer System */}
      <div className="sidebar-footer">
        <p className="sidebar-section-label">System</p>
        <button
          className="sidebar-nav-item"
          onClick={onOpenSettings}
        >
          <span className="nav-icon-wrap"><Settings size={17} /></span>
          <span>{t.settings || "Settings"}</span>
        </button>

        <div className="sidebar-status-card">
          <div className="sidebar-status-indicator">
            <motion.span
              className="pulse-dot"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
            <span className="sidebar-status-label">{t.systemOnline || "System Online"}</span>
          </div>
          <div className="sidebar-status-sub">
            <Zap size={10} />
            <span>VYRON Core v2.4</span>
          </div>
          <div className="sidebar-status-sub">
            <Activity size={10} />
            <span>{t.memoryActive || "Hindsight Active"}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
