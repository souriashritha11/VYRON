import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Scene3D from "./components/Scene3D";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./components/Dashboard";
import MachineDetail from "./components/MachineDetail";
import IncidentForm from "./components/IncidentForm";
import ActivityFeed from "./components/ActivityFeed";
import VideoModal from "./components/VideoModal";
import SettingsModal from "./components/SettingsModal";
import AIAgentView from "./components/AIAgentView";
import MemoryView from "./components/MemoryView";
import Toast from "./components/Toast";
import { translations } from "./translations";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

const DEFAULT_STATS = {
  total_machines: 4,
  normal: 2,
  warning: 1,
  critical: 1,
  total_incidents: 12,
  memory_active: true,
  uptime_percent: 99.8,
};

export default function App() {
  const [machines, setMachines] = useState([]);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");

  // New interactive states
  const [theme, setTheme] = useState("batman"); // "batman" | "dark" | "light"
  const [language, setLanguage] = useState("en");
  const [toast, setToast] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const t = translations[language] || translations.en;

  // Handle Theme Change
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Show toast notification
  const showToast = ({ type = "info", title, message }) => {
    setToast({ type, title, message });
    setTimeout(() => {
      setToast((prev) => (prev?.title === title ? null : prev));
    }, 4000);
  };

  // ============================================
  // LOAD DATA
  // ============================================
  useEffect(() => {
    const loadData = async () => {
      try {
        const [machinesRes, statsRes] = await Promise.all([
          fetch(`${API_URL}/api/machines`),
          fetch(`${API_URL}/api/stats`),
        ]);

        if (!machinesRes.ok) throw new Error("Failed to load machines");

        const machinesData = await machinesRes.json();
        setMachines(machinesData.machines || []);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.stats || DEFAULT_STATS);
        }
      } catch (err) {
        console.error("Backend connection error:", err);
        setError("Unable to connect to VYRON backend.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleMachineClick = (machine) => {
    setSelectedMachine(machine);
  };

  const handleCloseDetail = () => {
    setSelectedMachine(null);
  };

  const handleNavigate = (section) => {
    setActiveSection(section);
    setSelectedMachine(null);
    showToast({
      type: "info",
      title: `${section.toUpperCase()} View Loaded`,
      message: `Navigated to ${section} interface.`,
    });
  };

  const handleOpenVideo = (machine) => {
    setActiveVideo(machine || machines[0] || { id: "M-104", name: "Compressor Unit" });
    showToast({
      type: "info",
      title: "Video Guide Loaded",
      message: `Playing 3D walkthrough solution for ${machine?.name || "Machine"}`,
    });
  };

  // ============================================
  // RENDER: LOADING
  // ============================================
  if (loading) {
    return (
      <div className="app-loading">
        <Scene3D theme={theme} />
        <div className="vyron-watermark">VYRON</div>
        <div className="loading-content">
          <motion.div
            className="loading-orb"
            animate={{
              scale: [1, 1.2, 1],
              boxShadow: [
                "0 0 30px var(--gold-glow)",
                "0 0 70px var(--gold)",
                "0 0 30px var(--gold-glow)",
              ],
            }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            <span className="loading-orb-inner" />
          </motion.div>
          <motion.h2 className="loading-title">VYRON</motion.h2>
          <motion.p className="loading-sub">
            Initializing AI Operations & Hindsight Memory System...
          </motion.p>
          <div className="loading-bar-wrap">
            <motion.div
              className="loading-bar"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: ERROR
  // ============================================
  if (error) {
    return (
      <div className="app-loading">
        <Scene3D theme={theme} />
        <div className="vyron-watermark">VYRON</div>
        <div className="loading-content">
          <div className="error-icon">!</div>
          <h2 className="loading-title">Connection Failed</h2>
          <p className="loading-sub">{error}</p>
          <p className="loading-sub" style={{ fontSize: 12, marginTop: 8, color: "var(--text-muted)" }}>
            Make sure the VYRON backend is running on port 8000
          </p>
          <button className="error-retry-btn" onClick={() => window.location.reload()}>
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: MAIN APP
  // ============================================
  return (
    <div className="app-shell" data-theme={theme}>
      {/* Background Watermark ("VYRON") */}
      <div className="vyron-watermark">VYRON</div>

      {/* 3D Background Dust Field (No floating lines) */}
      <Scene3D theme={theme} />

      {/* Sidebar Navigation */}
      <Sidebar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenSettings={() => setShowSettings(true)}
        onOpenVideoLibrary={() => handleOpenVideo(machines[0])}
        t={t}
      />

      {/* Main App Container */}
      <main className="app-main">
        {/* Topbar Control Header */}
        <Topbar
          theme={theme}
          onThemeChange={setTheme}
          language={language}
          onLanguageChange={(lang) => {
            setLanguage(lang);
            showToast({
              type: "success",
              title: "Language Switch",
              message: `Interface language updated to ${lang.toUpperCase()}.`,
            });
          }}
          t={t}
          onOpenVideoLibrary={() => handleOpenVideo(machines[0])}
          onOpenSettings={() => setShowSettings(true)}
          onOpenNotifications={() =>
            showToast({
              type: "warning",
              title: "System Notification",
              message: "M-104 compressor temperature warning recorded 10m ago.",
            })
          }
          onOpenDiagnostics={() =>
            showToast({
              type: "success",
              title: "System Diagnostics OK",
              message: "All 12 background agents and Hindsight vector indexes operating at 99.8% uptime.",
            })
          }
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Content Body Row */}
        <div className="main-body-row">
          <div className="app-content">
            <AnimatePresence mode="wait">
              {(activeSection === "dashboard" || activeSection === "machines") && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <Dashboard
                    machines={machines}
                    stats={stats}
                    selectedMachine={selectedMachine}
                    onMachineClick={handleMachineClick}
                    onOpenVideo={handleOpenVideo}
                    onOpenTroubleshoot={(m) => {
                      setSelectedMachine(m);
                      showToast({
                        type: "info",
                        title: `Troubleshooting ${m.id}`,
                        message: "Opening Hindsight AI diagnostic panel...",
                      });
                    }}
                    onNavigate={handleNavigate}
                    showToast={showToast}
                    searchTerm={searchTerm}
                    t={t}
                  />
                </motion.div>
              )}

              {activeSection === "incidents" && (
                <motion.div
                  key="incidents"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <IncidentForm machines={machines} />
                </motion.div>
              )}

              {activeSection === "ai" && (
                <motion.div
                  key="ai"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <AIAgentView
                    machines={machines}
                    onOpenVideo={handleOpenVideo}
                    showToast={showToast}
                    t={t}
                  />
                </motion.div>
              )}

              {activeSection === "memory" && (
                <motion.div
                  key="memory"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <MemoryView showToast={showToast} t={t} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Activity Feed */}
          <aside className="app-right-panel">
            <ActivityFeed />
          </aside>
        </div>
      </main>

      {/* Machine Detail Modal */}
      <AnimatePresence>
        {selectedMachine && (
          <MachineDetail
            machine={selectedMachine}
            onClose={handleCloseDetail}
            onOpenVideo={handleOpenVideo}
            showToast={showToast}
          />
        )}
      </AnimatePresence>

      {/* Video Solutions Modal */}
      <AnimatePresence>
        {activeVideo && (
          <VideoModal
            videoData={activeVideo}
            onClose={() => setActiveVideo(null)}
            t={t}
          />
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <SettingsModal
            onClose={() => setShowSettings(false)}
            theme={theme}
            onThemeChange={setTheme}
            showToast={showToast}
            t={t}
          />
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}