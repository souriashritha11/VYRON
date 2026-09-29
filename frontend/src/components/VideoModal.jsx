import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Play, Pause, RotateCcw, Volume2, VolumeX, Shield, CheckCircle,
  Video, Sparkles, ChevronRight, Download, Share2, Layers
} from "lucide-react";

export default function VideoModal({ videoData, onClose, t }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const steps = [
    {
      title: t.step1 || "Step 1: Safety & Power Isolation",
      desc: "Ensure lock-out tag-out (LOTO) procedures are strictly followed. De-energize primary breaker and vent hydraulic pressure.",
      duration: "0:45",
    },
    {
      title: t.step2 || "Step 2: Component Disassembly & Cleaning",
      desc: "Remove retaining bolts on the primary housing. Inspect mesh filter intake for particle clogging or debris build-up.",
      duration: "1:20",
    },
    {
      title: t.step3 || "Step 3: Replacement & Thermal Paste Application",
      desc: "Swap with verified OEM replacement part. Apply high-temp synthetic lubricant to bearing seals.",
      duration: "1:10",
    },
    {
      title: t.step4 || "Step 4: Calibration & Hindsight Verification",
      desc: "Power on system in diagnostic mode. Run VYRON automated test sequence to confirm zero abnormal vibration or heat.",
      duration: "1:00",
    },
  ];

  // Simulated video playback timer
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          const next = prev + 1.2 * playbackSpeed;
          // Step sync
          if (next > 75) setCurrentStep(3);
          else if (next > 45) setCurrentStep(2);
          else if (next > 20) setCurrentStep(1);
          else setCurrentStep(0);
          return next;
        });
      }, 300);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed]);

  const machineName = videoData?.machine_name || videoData?.name || "M-104 Compressor Unit";
  const title = videoData?.title || `${machineName} — Air Filter & Cooling Overhaul`;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div
        className="video-modal-card"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {/* Header */}
        <div className="video-modal-header">
          <div className="video-modal-title-group">
            <span className="badge-gold">
              <Video size={13} style={{ marginRight: 5 }} /> VIDEO SOLUTION
            </span>
            <h3>{title}</h3>
          </div>
          <button className="icon-btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body grid */}
        <div className="video-modal-body">
          {/* Main Video Viewport (Simulated 3D Canvas) */}
          <div className="video-viewport-wrap">
            <div className={`video-screen-simulation step-active-${currentStep}`}>
              {/* 3D Animated Graphics Mesh overlay */}
              <div className="video-3d-scene">
                <div className="video-machine-hologram">
                  <div className="holo-core-ring" />
                  <div className="holo-part-mesh" />
                  <div className="holo-glow-point" />
                </div>
                <div className="video-watermark-overlay">VYRON 3D SIMULATION</div>
                <div className="video-telemetry-hud">
                  <span className="hud-badge">RPM: 3,450</span>
                  <span className="hud-badge">TEMP: 42.1°C</span>
                  <span className="hud-badge">STEP {currentStep + 1}/4</span>
                </div>
              </div>

              {/* Play Pause Center Overlay */}
              {!isPlaying && (
                <button
                  className="video-center-play"
                  onClick={() => {
                    if (progress >= 100) setProgress(0);
                    setIsPlaying(true);
                  }}
                >
                  <Play size={36} style={{ marginLeft: 4 }} />
                </button>
              )}

              {/* Bottom Video Controls Bar */}
              <div className="video-controls-bar">
                <div
                  className="video-progress-track"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const newProgress = (clickX / rect.width) * 100;
                    setProgress(newProgress);
                  }}
                >
                  <div className="video-progress-fill" style={{ width: `${progress}%` }} />
                </div>

                <div className="video-controls-row">
                  <div className="controls-left">
                    <button
                      className="v-control-btn"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button
                      className="v-control-btn"
                      onClick={() => {
                        setProgress(0);
                        setCurrentStep(0);
                        setIsPlaying(true);
                      }}
                    >
                      <RotateCcw size={16} />
                    </button>
                    <button
                      className="v-control-btn"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    <span className="v-time-display">
                      0:{Math.floor((progress / 100) * 45).toString().padStart(2, "0")} / 4:15
                    </span>
                  </div>

                  <div className="controls-right">
                    <button
                      className="v-speed-btn"
                      onClick={() =>
                        setPlaybackSpeed((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1))
                      }
                    >
                      {playbackSpeed}x SPEED
                    </button>
                    <span className="v-quality-tag">1080p 60FPS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Step Description Card */}
            <div className="video-step-card">
              <div className="step-card-header">
                <span className="step-num-pill">{currentStep + 1}</span>
                <h4>{steps[currentStep].title}</h4>
              </div>
              <p className="step-card-desc">{steps[currentStep].desc}</p>
            </div>
          </div>

          {/* Steps Timeline Sidebar */}
          <div className="video-steps-sidebar">
            <h4 className="sidebar-steps-title">
              <Layers size={15} style={{ marginRight: 6 }} /> Maintenance Sequence
            </h4>
            <div className="steps-list">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`step-item ${idx === currentStep ? "active" : ""}`}
                  onClick={() => {
                    setCurrentStep(idx);
                    setProgress(idx * 25 + 5);
                    setIsPlaying(true);
                  }}
                >
                  <div className="step-item-status">
                    {idx < currentStep ? (
                      <CheckCircle size={16} className="text-safe" />
                    ) : idx === currentStep ? (
                      <span className="step-pulse-ring" />
                    ) : (
                      <span className="step-num">{idx + 1}</span>
                    )}
                  </div>
                  <div className="step-item-content">
                    <p className="step-item-title">{step.title}</p>
                    <span className="step-item-dur">{step.duration}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Video Quick Actions */}
            <div className="video-actions">
              <button
                className="btn-secondary full-w"
                onClick={() => alert("Downloading 3D Maintenance Video Pack (.mp4)...")}
              >
                <Download size={14} style={{ marginRight: 6 }} /> Download Video Guide
              </button>
              <button
                className="btn-secondary full-w"
                onClick={() => alert("Video solution link copied to clipboard!")}
              >
                <Share2 size={14} style={{ marginRight: 6 }} /> Share with Team
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
