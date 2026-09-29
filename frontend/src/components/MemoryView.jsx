import { useState } from "react";
import { motion } from "framer-motion";
import { MemoryStick, Database, Search, FileText, CheckCircle, RefreshCw, Trash2, ArrowRight } from "lucide-react";

export default function MemoryView({ showToast, t }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [memoryLogs, setMemoryLogs] = useState([
    {
      id: "MEM-902",
      machine: "M-104 (Compressor Unit)",
      issue: "Air filter clogged causing temperature rise to 88°C",
      resolution: "Cleaned mesh intake, reset thermal threshold",
      timestamp: "2026-09-24 14:20",
      confidence: "98%",
      source: "Manual Technician Log",
    },
    {
      id: "MEM-884",
      machine: "M-102 (CNC Milling Station)",
      issue: "Spindle vibration spike at 4,000 RPM",
      resolution: "Re-aligned bearing assembly & lubricated shaft",
      timestamp: "2026-09-21 09:45",
      confidence: "95%",
      source: "Auto Telemetry Trigger",
    },
    {
      id: "MEM-812",
      machine: "M-101 (Hydraulic Press)",
      issue: "Fluid pressure dropped to 45 PSI",
      resolution: "Replaced worn rubber seal on valve 3",
      timestamp: "2026-09-18 16:30",
      confidence: "92%",
      source: "Manual Technician Log",
    },
    {
      id: "MEM-740",
      machine: "M-103 (Conveyor System)",
      issue: "Belt alignment slip on drive motor",
      resolution: "Adjusted tensioning bolt by +2.5mm",
      timestamp: "2026-09-12 11:15",
      confidence: "96%",
      source: "Auto Telemetry Trigger",
    },
  ]);

  const filtered = memoryLogs.filter(
    (log) =>
      log.machine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resolution.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="memory-view">
      <div className="memory-header">
        <div className="title-group">
          <div className="memory-icon-wrap">
            <MemoryStick size={24} className="text-gold" />
          </div>
          <div>
            <h2>VYRON Hindsight Memory Vector Storage</h2>
            <p>Persistent case memory database used for AI recommendations.</p>
          </div>
        </div>

        <button
          className="btn-secondary"
          onClick={() =>
            showToast({
              type: "success",
              title: "Memory Synced",
              message: "124 vector embeddings validated against cloud registry.",
            })
          }
        >
          <RefreshCw size={14} style={{ marginRight: 6 }} /> Sync Memory State
        </button>
      </div>

      <div className="memory-search-bar">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Search failure history, machine IDs, resolutions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="memory-grid">
        {filtered.map((log, i) => (
          <motion.div
            key={log.id}
            className="memory-card-3d"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <div className="memory-card-top">
              <span className="memory-id-badge">{log.id}</span>
              <span className="memory-conf-badge">{log.confidence} Match Weight</span>
            </div>

            <h4 className="memory-machine-title">{log.machine}</h4>

            <div className="memory-detail-block">
              <span className="label">Failure Symptom:</span>
              <p className="val">{log.issue}</p>
            </div>

            <div className="memory-detail-block highlight">
              <span className="label">Learned Resolution:</span>
              <p className="val">{log.resolution}</p>
            </div>

            <div className="memory-card-footer">
              <span className="timestamp">{log.timestamp}</span>
              <button
                className="btn-text-gold"
                onClick={() =>
                  showToast({
                    type: "info",
                    title: `Vector Details: ${log.id}`,
                    message: `Cosine distance: 0.042, Embeddings: [0.12, -0.45, 0.88...]`,
                  })
                }
              >
                Inspect Embeddings <ArrowRight size={13} style={{ marginLeft: 4 }} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
