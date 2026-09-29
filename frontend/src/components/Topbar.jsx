import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun, Moon, Shield, Globe, Video, Bell, Settings, Search,
  Zap, ChevronDown, Check, Activity
} from "lucide-react";

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "hi", label: "हिंदी", flag: "🇮🇳" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
];

const themes = [
  { id: "batman", label: "Batman Gold", icon: Shield, color: "#F5C518" },
  { id: "dark", label: "Dark Tech", icon: Moon, color: "#00d4ff" },
  { id: "light", label: "Light Clean", icon: Sun, color: "#2563eb" },
];

export default function Topbar({
  theme,
  onThemeChange,
  language,
  onLanguageChange,
  t,
  onOpenVideoLibrary,
  onOpenSettings,
  onOpenNotifications,
  onOpenDiagnostics,
  searchTerm,
  onSearchChange,
}) {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  const currentLangObj = languages.find((l) => l.code === language) || languages[0];
  const currentThemeObj = themes.find((th) => th.id === theme) || themes[0];

  return (
    <header className="topbar">
      {/* Search Input */}
      <div className="topbar-search-wrap">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          className="topbar-search-input"
          placeholder={t.searchPlaceholder || "Search machines, models, locations..."}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button className="search-clear-btn" onClick={() => onSearchChange("")}>
            ✕
          </button>
        )}
      </div>

      {/* Topbar Action Items */}
      <div className="topbar-actions">
        {/* Video Solutions Library Quick Button */}
        <button
          className="topbar-btn video-library-btn"
          onClick={onOpenVideoLibrary}
          title={t.videoSolution || "Video Solutions"}
        >
          <Video size={16} className="btn-icon-pulse" />
          <span className="btn-text">{t.videoSolution || "Video Solutions"}</span>
          <span className="topbar-pill-badge">5 NEW</span>
        </button>

        {/* System Diagnostics Status */}
        <button
          className="topbar-btn status-btn"
          onClick={onOpenDiagnostics}
          title="System Telemetry Status"
        >
          <Activity size={16} style={{ color: "var(--safe)" }} />
          <span className="btn-text">VYRON v2.4</span>
        </button>

        {/* Theme Switcher Dropdown */}
        <div className="topbar-dropdown-wrap">
          <button
            className="topbar-btn theme-btn"
            onClick={() => {
              setThemeMenuOpen(!themeMenuOpen);
              setLangMenuOpen(false);
            }}
          >
            <currentThemeObj.icon size={16} style={{ color: currentThemeObj.color }} />
            <span className="btn-text">{currentThemeObj.label}</span>
            <ChevronDown size={13} className={`chevron ${themeMenuOpen ? "open" : ""}`} />
          </button>

          <AnimatePresence>
            {themeMenuOpen && (
              <motion.div
                className="topbar-dropdown-menu"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.18 }}
              >
                <div className="dropdown-label">Select Color Theme</div>
                {themes.map((th) => {
                  const Icon = th.icon;
                  const isSel = th.id === theme;
                  return (
                    <button
                      key={th.id}
                      className={`dropdown-item ${isSel ? "selected" : ""}`}
                      onClick={() => {
                        onThemeChange(th.id);
                        setThemeMenuOpen(false);
                      }}
                    >
                      <Icon size={15} style={{ color: th.color }} />
                      <span>{th.label}</span>
                      {isSel && <Check size={14} className="check-icon" />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Language Selector Dropdown */}
        <div className="topbar-dropdown-wrap">
          <button
            className="topbar-btn lang-btn"
            onClick={() => {
              setLangMenuOpen(!langMenuOpen);
              setThemeMenuOpen(false);
            }}
          >
            <span className="flag-emoji">{currentLangObj.flag}</span>
            <span className="btn-text">{currentLangObj.label}</span>
            <ChevronDown size={13} className={`chevron ${langMenuOpen ? "open" : ""}`} />
          </button>

          <AnimatePresence>
            {langMenuOpen && (
              <motion.div
                className="topbar-dropdown-menu"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.18 }}
              >
                <div className="dropdown-label">Select UI Language</div>
                {languages.map((lang) => {
                  const isSel = lang.code === language;
                  return (
                    <button
                      key={lang.code}
                      className={`dropdown-item ${isSel ? "selected" : ""}`}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setLangMenuOpen(false);
                      }}
                    >
                      <span className="flag-emoji">{lang.flag}</span>
                      <span>{lang.label}</span>
                      {isSel && <Check size={14} className="check-icon" />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <button
          className="topbar-icon-btn"
          onClick={onOpenNotifications}
          title="Notifications"
        >
          <Bell size={17} />
          <span className="icon-badge-dot" />
        </button>

        {/* Settings Button */}
        <button
          className="topbar-icon-btn"
          onClick={onOpenSettings}
          title="Settings"
        >
          <Settings size={17} />
        </button>
      </div>
    </header>
  );
}
