/**
 * VINYLPLAYER.JSX — Floating Vinyl Record Player Widget
 * ─────────────────────────────────────────────────────────────────────────────
 * Widget pemutar musik yang mengambang di pojok kanan bawah layar.
 * Tetap terlihat di semua section saat user scroll.
 *
 * FITUR:
 * - Piringan hitam berputar (CSS animation, berhenti saat pause)
 * - Tombol Previous / Play-Pause / Next
 * - Progress bar interaktif (klik untuk seek)
 * - Volume slider dengan ikon mute toggle
 * - Nama track dan artis yang berjalan (marquee) jika terlalu panjang
 * - Collapse/expand: bisa diperkecil jadi ikon disc saja
 *
 * ANIMASI VINYL:
 * Piringan menggunakan CSS animation 'spin' via Tailwind.
 * State 'isPlaying' mengontrol apakah animasi berjalan (running) atau
 * dihentikan sementara (paused) — ini lebih efisien daripada
 * menambah/menghapus class karena animasi melanjutkan dari posisi terakhir,
 * bukan mulai ulang dari 0°.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ChevronDown,
  Music2,
} from "lucide-react";
import { useAudio } from "../../context/AudioContext";
import { formatTime, getProgressPercent } from "../../utils/formatTime";

// ─── Sub-komponen: Piringan Hitam ─────────────────────────────────────────────
function VinylDisc({ isPlaying, size = 80 }) {
  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: size, height: size }}
    >
      {/* ── Piringan Utama ── */}
      <div
        className="w-full h-full rounded-full"
        style={{
          // Animasi berputar: 'running' saat play, 'paused' saat pause/stop
          // Menggunakan inline style karena Tailwind tidak support animationPlayState dinamis
          animation: "vinylSpin 3s linear infinite",
          animationPlayState: isPlaying ? "running" : "paused",
          background: `
            radial-gradient(circle at 50% 50%,
              #2a2520 0%,
              #1a1817 20%,
              #2a2520 25%,
              #1a1817 30%,
              #2a2520 35%,
              #1a1817 40%,
              #2a2520 48%,
              #dcae1d 48%,
              #dcae1d 52%,
              #1a1817 52%,
              #2a2520 60%,
              #1a1817 65%,
              #2a2520 70%,
              #1a1817 75%,
              #2a2520 80%,
              #1a1817 85%,
              #2a2520 100%
            )
          `,
        }}
      >
        {/* ── Label tengah piringan (seperti stiker tengah vinyl) ── */}
        <div
          className="absolute inset-0 m-auto rounded-full flex items-center justify-center"
          style={{
            width: "38%",
            height: "38%",
            top: "31%",
            left: "31%",
            background: "linear-gradient(135deg, #7a3b2e, #4a2218)",
            boxShadow: "0 0 0 2px #dcae1d",
          }}
        >
          <Music2
            size={size * 0.12}
            className="text-amber-300 opacity-80"
          />
        </div>
      </div>

      {/* ── Indikator berputar (titik highlight) ── */}
      {isPlaying && (
        <div
          className="absolute w-1.5 h-1.5 rounded-full bg-amber-300"
          style={{ top: "12%", left: "50%", transform: "translateX(-50%)" }}
        />
      )}
    </div>
  );
}

// ─── Sub-komponen: Progress Bar ───────────────────────────────────────────────
function ProgressBar({ currentTime, duration, onSeek }) {
  const percent = getProgressPercent(currentTime, duration);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = clickX / rect.width;
    const newTime = ratio * duration;
    onSeek(newTime);
  };

  return (
    <div className="w-full group">
      {/* ── Bar kontainer (area klik) ── */}
      <div
        className="relative w-full h-1.5 rounded-full cursor-pointer group-hover:h-2 transition-all duration-150"
        style={{ backgroundColor: "#3a3028" }}
        onClick={handleClick}
        title="Klik untuk seek"
      >
        {/* ── Progress fill ── */}
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-100"
          style={{
            width: `${percent}%`,
            background: "linear-gradient(90deg, #dcae1d, #f4c842)",
          }}
        />
        {/* ── Thumb (dot) ── */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            left: `${percent}%`,
            transform: `translateX(-50%) translateY(-50%)`,
            backgroundColor: "#dcae1d",
          }}
        />
      </div>
      {/* ── Timestamp ── */}
      <div
        className="flex justify-between mt-1 text-xs"
        style={{
          fontFamily: "'Courier New', monospace",
          color: "#8a7a6a",
        }}
      >
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}

// ─── Sub-komponen: Volume Control ─────────────────────────────────────────────
function VolumeControl({ volume, isMuted, onVolumeChange, onMuteToggle }) {
  return (
    <div className="flex items-center gap-2 w-full">
      <button
        onClick={onMuteToggle}
        className="flex-shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted || volume === 0 ? (
          <VolumeX size={14} style={{ color: "#8a7a6a" }} />
        ) : (
          <Volume2 size={14} style={{ color: "#dcae1d" }} />
        )}
      </button>
      {/* ── Volume Slider ── */}
      <input
        type="range"
        min="0"
        max="1"
        step="0.02"
        value={isMuted ? 0 : volume}
        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
        className="w-full h-1 appearance-none rounded-full cursor-pointer"
        style={{
          background: `linear-gradient(90deg, #dcae1d ${(isMuted ? 0 : volume) * 100}%, #3a3028 ${(isMuted ? 0 : volume) * 100}%)`,
          // Custom thumb via CSS — lihat index.css untuk styling thumb
          accentColor: "#dcae1d",
        }}
        title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
      />
    </div>
  );
}

// ─── Komponen Utama: VinylPlayer ──────────────────────────────────────────────
export default function VinylPlayer() {
  const {
    isPlaying,
    currentTrack,
    currentTime,
    duration,
    volume,
    isMuted,
    isLoading,
    togglePlay,
    handleNextTrack,
    handlePrevTrack,
    handleSeek,
    handleVolumeChange,
    toggleMute,
  } = useAudio();

  // State lokal: collapse/expand widget
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <>
      {/* ── Keyframe CSS untuk animasi vinyl ── */}
      <style>{`
        @keyframes vinylSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      {/* ── Posisi: Fixed pojok kanan bawah ── */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
        className="fixed bottom-4 right-4 z-50"
        style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.5))" }}
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            // ─────────────────────── EXPANDED VIEW ───────────────────────
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl p-4 w-72"
              style={{
                background: "linear-gradient(145deg, #2a2218, #1a1410)",
                border: "1px solid #3a3028",
                boxShadow: "inset 0 1px 0 rgba(220,174,29,0.15)",
              }}
            >
              {/* ── Header ── */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-xs font-bold tracking-widest uppercase"
                  style={{
                    color: "#dcae1d",
                    fontFamily: "'Courier New', monospace",
                  }}
                >
                  ◈ NOW PLAYING
                </span>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                  title="Minimize player"
                >
                  <ChevronDown size={14} style={{ color: "#8a7a6a" }} />
                </button>
              </div>

              {/* ── Vinyl disc + Track info ── */}
              <div className="flex items-center gap-3 mb-4">
                <VinylDisc isPlaying={isPlaying} size={72} />
                <div className="flex-1 overflow-hidden">
                  {/* Track title dengan overflow ellipsis */}
                  <p
                    className="text-sm font-semibold truncate"
                    style={{
                      color: "#f4ebd0",
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    {currentTrack?.title ?? "—"}
                  </p>
                  <p
                    className="text-xs truncate mt-0.5"
                    style={{
                      color: "#8a7a6a",
                      fontFamily: "'Courier New', monospace",
                    }}
                  >
                    {currentTrack?.artist ?? "Unknown Artist"}
                  </p>
                  {/* Loading indicator */}
                  {isLoading && (
                    <p
                      className="text-xs mt-1 animate-pulse"
                      style={{ color: "#dcae1d" }}
                    >
                      Loading...
                    </p>
                  )}
                </div>
              </div>

              {/* ── Progress Bar ── */}
              <div className="mb-3">
                <ProgressBar
                  currentTime={currentTime}
                  duration={duration}
                  onSeek={handleSeek}
                />
              </div>

              {/* ── Kontrol Utama: Prev / Play-Pause / Next ── */}
              <div className="flex items-center justify-center gap-4 mb-3">
                <button
                  onClick={handlePrevTrack}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors active:scale-95"
                  title="Lagu sebelumnya"
                >
                  <SkipBack size={18} style={{ color: "#f4ebd0" }} />
                </button>

                {/* Tombol Play/Pause — lebih besar */}
                <button
                  onClick={togglePlay}
                  disabled={isLoading}
                  className="w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90 disabled:opacity-50"
                  style={{
                    background: "linear-gradient(135deg, #dcae1d, #b8941a)",
                    boxShadow: isPlaying
                      ? "0 0 16px rgba(220,174,29,0.5)"
                      : "0 4px 12px rgba(0,0,0,0.4)",
                  }}
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause size={18} style={{ color: "#1a1410" }} />
                  ) : (
                    <Play size={18} style={{ color: "#1a1410", marginLeft: 2 }} />
                  )}
                </button>

                <button
                  onClick={handleNextTrack}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors active:scale-95"
                  title="Lagu berikutnya"
                >
                  <SkipForward size={18} style={{ color: "#f4ebd0" }} />
                </button>
              </div>

              {/* ── Volume Control ── */}
              <VolumeControl
                volume={volume}
                isMuted={isMuted}
                onVolumeChange={handleVolumeChange}
                onMuteToggle={toggleMute}
              />
            </motion.div>
          ) : (
            // ──────────────────── COLLAPSED VIEW (icon saja) ─────────────
            <motion.button
              key="collapsed"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsExpanded(true)}
              className="relative w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(145deg, #2a2218, #1a1410)",
                border: "2px solid #3a3028",
              }}
              title="Buka music player"
            >
              <VinylDisc isPlaying={isPlaying} size={48} />
              {/* Indikator playing di corner */}
              {isPlaying && (
                <span
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse"
                  style={{ backgroundColor: "#dcae1d" }}
                />
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
