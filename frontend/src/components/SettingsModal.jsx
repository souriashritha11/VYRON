import { useState } from "react";
import { motion } from "framer-motion";
import { X, Settings, Shield, Sliders, Bell, Database, RefreshCw, Check } from "lucide-react";

export default function SettingsModal({ onClose, theme, onThemeChange, showToast, t }) {
  const [pollInterval, setPollInterval] = useState("5");
  const [aiConfidence, setAiConfidence] = useState("85");
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);

  const handleSave = () => {
    showToast({
      type: "success",
      title: "Settings Saved",
      message: `Telemetry poll: ${pollInterval}s, AI Confidence threshold: ${aiConfidence}%`,
    });
    onClose();
  };

  const handleClearMemory = async () => {
    try {
      showToast({
        type: "info",
        title: "Optimizing Memory",
        message: "Hindsight vector index defragmented.",
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div
        className="settings-modal-card"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="settings-header">
          <div className="title-wrap">
            <Settings size={20} className="text-gold" />
            <h3>{t.settings || "VYRON System Preferences"}</h3>
          </div>
          <button className="icon-btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="settings-body">
          {/* AI Settings */}
          <div className="settings-section">
            <h4 className="section-title">
              <Shield size={16} className="text-gold" /> AI & Hindsight Memory
            </h4>
            <div className="setting-row">
              <div className="setting-info">
                <label>Hindsight AI Confidence Threshold</label>
                <p>Minimum match score to trigger persistent memory recall</p>
              </div>
              <div className="setting-control">
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={aiConfidence}
                  onChange={(e) => setAiConfidence(e.target.value)}
                />
                <span className="setting-value">{aiConfidence}%</span>
              </div>
            </div>

            <div className="setting-row">
              <div className="setting-info">
                <label>Telemetry Refresh Interval</label>
                <p>Frequency of background sensor data sync</p>
              </div>
              <select
                className="setting-select"
                value={pollInterval}
                onChange={(e) => setPollInterval(e.target.value)}
              >
                <option value="2">2 seconds (Real-time)</option>
                <option value="5">5 seconds (Standard)</option>
                <option value="10">10 seconds (Eco mode)</option>
              </select>
            </div>
          </div>

          {/* System Notifications */}
          <div className="settings-section">
            <h4 className="section-title">
              <Bell size={16} className="text-gold" /> Alerts & Notifications
            </h4>
            <div className="setting-row">
              <div className="setting-info">
                <label>Audible Incident Warnings</label>
                <p>Play chime sound when machine switches to Critical status</p>
              </div>
              <input
                type="checkbox"
                className="toggle-checkbox"
                checked={soundAlerts}
                onChange={(e) => setSoundAlerts(e.target.checked)}
              />
            </div>
            <div className="setting-row">
              <div className="setting-info">
                <label>Automatic Cloud Sync</label>
                <p>Backup incident logs to persistent hindsight database</p>
              </div>
              <input
                type="checkbox"
                className="toggle-checkbox"
                checked={autoBackup}
                onChange={(e) => setAutoBackup(e.target.checked)}
              />
            </div>
          </div>

          {/* Database & Memory */}
          <div className="settings-section">
            <h4 className="section-title">
              <Database size={16} className="text-gold" /> Memory Index Maintenance
            </h4>
            <div className="setting-row">
              <div className="setting-info">
                <label>Defragment Hindsight Vector Database</label>
                <p>Optimize search speed across historical failure cases</p>
              </div>
              <button className="btn-secondary" onClick={handleClearMemory}>
                <RefreshCw size={14} style={{ marginRight: 6 }} /> Optimize Index
              </button>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave}>
            <Check size={16} style={{ marginRight: 6 }} /> Save Preferences
          </button>
        </div>
      </motion.div>
    </div>
  );
}
