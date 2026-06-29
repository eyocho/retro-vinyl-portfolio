import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, SkipBack, SkipForward,
  Volume2, VolumeX, ChevronDown, Music2,
  Repeat, Repeat1, Shuffle, ListMusic,
} from "lucide-react";
import { useAudio } from "../../context/AudioContext";
import { formatTime, getProgressPercent } from "../../utils/formatTime";

function VinylDisc({ isPlaying, size = 80 }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <div
        className="w-full h-full rounded-full"
        style={{
          animation: "vinylSpin 3s linear infinite",
          animationPlayState: isPlaying ? "running" : "paused",
          background: `radial-gradient(circle at 50% 50%,
            #2a2520 0%, #1a1817 20%, #2a2520 25%, #1a1817 30%,
            #2a2520 35%, #1a1817 40%, #2a2520 48%,
            #dcae1d 48%, #dcae1d 52%,
            #1a1817 52%, #2a2520 60%, #1a1817 65%,
            #2a2520 70%, #1a1817 75%, #2a2520 80%,
            #1a1817 85%, #2a2520 100%)`,
        }}
      >
        <div
          className="absolute rounded-full flex items-center justify-center"
          style={{
            width: "38%", height: "38%", top: "31%", left: "31%",
            background: "linear-gradient(135deg, #7a3b2e, #4a2218)",
            boxShadow: "0 0 0 2px #dcae1d",
          }}
        >
          <Music2 size={size * 0.12} className="text-amber-300 opacity-80" />
        </div>
      </div>
      {isPlaying && (
        <div
          className="absolute w-1.5 h-1.5 rounded-full bg-amber-300"
          style={{ top: "12%", left: "50%", transform: "translateX(-50%)" }}
        />
      )}
    </div>
  );
}

function ProgressBar({ currentTime, duration, onSeek }) {
  const percent = getProgressPercent(currentTime, duration);
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onSeek((e.clientX - rect.left) / rect.width * duration);
  };
  return (
    <div className="w-full group">
      <div
        className="relative w-full h-1.5 rounded-full cursor-pointer group-hover:h-2 transition-all duration-150"
        style={{ backgroundColor: "#3a3028" }}
        onClick={handleClick}
      >
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-100"
          style={{ width: `${percent}%`, background: "linear-gradient(90deg, #dcae1d, #f4c842)" }}
        />
        <div
          className="absolute top-1/2 w-2.5 h-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `${percent}%`, transform: "translateX(-50%) translateY(-50%)", backgroundColor: "#dcae1d" }}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs" style={{ fontFamily: "'Courier New', monospace", color: "#8a7a6a" }}>
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}

export default function VinylPlayer() {
  const {
    isPlaying, currentTrack, currentTrackIndex, currentTime, duration,
    volume, isMuted, isLoading, playlist,
    isLoop, isShuffle, isRepeatOne,
    togglePlay, handleNextTrack, handlePrevTrack, handleSeek,
    handleVolumeChange, toggleMute, toggleLoop, toggleShuffle, toggleRepeatOne,
    setCurrentTrackIndex, addToPlaylist,
  } = useAudio();

  const [isExpanded, setIsExpanded] = useState(true);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const fileRef = useRef(null);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("audio/"));
    files.forEach(f => {
      const url = URL.createObjectURL(f);
      const raw = f.name.replace(/\.[^/.]+$/, "");
      const parts = raw.split(" - ");
      addToPlaylist({ title: parts.length > 1 ? parts.slice(1).join(" - ") : raw, artist: parts.length > 1 ? parts[0] : "Unknown Artist", src: url });
    });
  };

  const handleFileInput = (e) => {
    Array.from(e.target.files).filter(f => f.type.startsWith("audio/")).forEach(f => {
      const url = URL.createObjectURL(f);
      const raw = f.name.replace(/\.[^/.]+$/, "");
      const parts = raw.split(" - ");
      addToPlaylist({ title: parts.length > 1 ? parts.slice(1).join(" - ") : raw, artist: parts.length > 1 ? parts[0] : "Unknown Artist", src: url });
    });
  };

  const modeBtn = (active, onClick, Icon, label) => (
    <button
      onClick={onClick}
      className="p-1.5 rounded transition-colors"
      style={{ color: active ? "#dcae1d" : "#4a4030", backgroundColor: active ? "rgba(220,174,29,0.12)" : "transparent" }}
      title={label}
    >
      <Icon size={13} />
    </button>
  );

  return (
    <>
      <style>{`@keyframes vinylSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
        className="fixed bottom-4 right-4 z-50"
        style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.5))" }}
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
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
              onDragOver={e => e.preventDefault()}
              onDrop={handleFileDrop}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#dcae1d", fontFamily: "'Courier New', monospace" }}>
                  NOW PLAYING
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setShowPlaylist(p => !p)} className="p-1 rounded hover:bg-white/10 transition-colors" title="Playlist">
                    <ListMusic size={13} style={{ color: showPlaylist ? "#dcae1d" : "#8a7a6a" }} />
                  </button>
                  <button onClick={() => setIsExpanded(false)} className="p-1 rounded hover:bg-white/10 transition-colors" title="Minimize">
                    <ChevronDown size={14} style={{ color: "#8a7a6a" }} />
                  </button>
                </div>
              </div>

              {/* Playlist view */}
              <AnimatePresence>
                {showPlaylist && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden mb-3"
                  >
                    <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #3a3028", maxHeight: 160, overflowY: "auto" }}>
                      {playlist.map((track, i) => (
                        <div
                          key={i}
                          onClick={() => setCurrentTrackIndex(i)}
                          className="flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors"
                          style={{
                            backgroundColor: i === currentTrackIndex ? "rgba(220,174,29,0.12)" : "transparent",
                            borderBottom: "1px solid #2a2218",
                          }}
                        >
                          <span className="text-xs" style={{ fontFamily: "'Courier New', monospace", color: i === currentTrackIndex ? "#dcae1d" : "#4a4030", minWidth: 16 }}>
                            {i === currentTrackIndex && isPlaying ? "▶" : String(i + 1).padStart(2, "0")}
                          </span>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-xs truncate" style={{ color: i === currentTrackIndex ? "#f4ebd0" : "#8a7a6a" }}>{track.title}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Drag-to-add hint */}
                    <div
                      className="mt-2 rounded-lg py-2 text-center cursor-pointer transition-colors hover:bg-white/5"
                      style={{ border: "1px dashed #3a3028" }}
                      onClick={() => fileRef.current?.click()}
                    >
                      <p className="text-xs" style={{ color: "#4a4030", fontFamily: "'Courier New', monospace" }}>
                        + drag audio / klik untuk tambah
                      </p>
                    </div>
                    <input ref={fileRef} type="file" accept="audio/*" multiple style={{ display: "none" }} onChange={handleFileInput} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Disc + track info */}
              <div className="flex items-center gap-3 mb-4">
                <VinylDisc isPlaying={isPlaying} size={72} />
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-semibold truncate" style={{ color: "#f4ebd0", fontFamily: "Georgia, serif" }}>
                    {currentTrack?.title ?? "—"}
                  </p>
                  <p className="text-xs truncate mt-0.5" style={{ color: "#8a7a6a", fontFamily: "'Courier New', monospace" }}>
                    {currentTrack?.artist ?? "Unknown Artist"}
                  </p>
                  {isLoading && <p className="text-xs mt-1 animate-pulse" style={{ color: "#dcae1d" }}>Loading...</p>}
                </div>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <ProgressBar currentTime={currentTime} duration={duration} onSeek={handleSeek} />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 mb-3">
                <button onClick={handlePrevTrack} className="p-2 rounded-full hover:bg-white/10 transition-colors active:scale-95" title="Sebelumnya">
                  <SkipBack size={18} style={{ color: "#f4ebd0" }} />
                </button>
                <button
                  onClick={togglePlay}
                  disabled={isLoading}
                  className="w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90 disabled:opacity-50"
                  style={{
                    background: "linear-gradient(135deg, #dcae1d, #b8941a)",
                    boxShadow: isPlaying ? "0 0 16px rgba(220,174,29,0.5)" : "0 4px 12px rgba(0,0,0,0.4)",
                  }}
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause size={18} style={{ color: "#1a1410" }} /> : <Play size={18} style={{ color: "#1a1410", marginLeft: 2 }} />}
                </button>
                <button onClick={handleNextTrack} className="p-2 rounded-full hover:bg-white/10 transition-colors active:scale-95" title="Berikutnya">
                  <SkipForward size={18} style={{ color: "#f4ebd0" }} />
                </button>
              </div>

              {/* Loop / Shuffle / Repeat mode buttons */}
              <div className="flex items-center justify-center gap-1 mb-3">
                {modeBtn(isLoop,      toggleLoop,      Repeat,   "Loop playlist")}
                {modeBtn(isShuffle,   toggleShuffle,   Shuffle,  "Acak lagu")}
                {modeBtn(isRepeatOne, toggleRepeatOne, Repeat1,  "Ulangi 1 lagu")}
              </div>

              {/* Volume */}
              <div className="flex items-center gap-2 w-full">
                <button onClick={toggleMute} className="flex-shrink-0 p-1 rounded hover:bg-white/10 transition-colors" title={isMuted ? "Unmute" : "Mute"}>
                  {isMuted || volume === 0
                    ? <VolumeX size={14} style={{ color: "#8a7a6a" }} />
                    : <Volume2 size={14} style={{ color: "#dcae1d" }} />}
                </button>
                <input
                  type="range" min="0" max="1" step="0.02"
                  value={isMuted ? 0 : volume}
                  onChange={e => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full h-1 appearance-none rounded-full cursor-pointer"
                  style={{
                    background: `linear-gradient(90deg, #dcae1d ${(isMuted ? 0 : volume) * 100}%, #3a3028 ${(isMuted ? 0 : volume) * 100}%)`,
                    accentColor: "#dcae1d",
                  }}
                />
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="collapsed"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsExpanded(true)}
              className="relative w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(145deg, #2a2218, #1a1410)", border: "2px solid #3a3028" }}
              title="Buka music player"
            >
              <VinylDisc isPlaying={isPlaying} size={48} />
              {isPlaying && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: "#dcae1d" }} />
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
