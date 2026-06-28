import { useState } from "react";
import { motion } from "framer-motion";
import { SKILL_CHANNELS } from "../../data/skills";

// ── Sub: Satu fader/slider mixer ─────────────────────────────────────────────
function MixerFader({ name, level, color, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
      className="flex flex-col items-center gap-2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Level display */}
      <div
        className="text-center transition-all duration-300"
        style={{
          fontFamily: "monospace",
          fontSize: hovered ? 13 : 11,
          color: hovered ? color : "#8a7a6a",
          fontWeight: 700,
        }}
      >
        {level}
      </div>

      {/* Track fader vertikal */}
      <div
        className="relative rounded-full flex flex-col justify-end"
        style={{
          width: 28,
          height: 120,
          backgroundColor: "#0f0d0c",
          border: "1px solid #3a3028",
          padding: "4px",
          boxShadow: "inset 0 2px 8px rgba(0,0,0,0.6)",
        }}
      >
        {/* Tick marks */}
        {[0, 25, 50, 75, 100].map((tick) => (
          <div
            key={tick}
            className="absolute right-0 w-1.5"
            style={{
              height: 1,
              backgroundColor: "#3a3028",
              bottom: `${tick}%`,
              right: -6,
            }}
          />
        ))}

        {/* Fill bar */}
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: `${level}%` }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.07 + 0.3, duration: 0.8, ease: "easeOut" }}
          className="w-full rounded-full relative"
          style={{
            background: `linear-gradient(to top, ${color}, ${color}99)`,
            boxShadow: hovered ? `0 0 12px ${color}66` : "none",
          }}
        />

        {/* Fader knob handle */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-6 h-4 rounded-sm transition-all duration-300"
          style={{
            bottom: `calc(${level}% - 8px)`,
            backgroundColor: hovered ? "#f4ebd0" : "#c4b090",
            border: `2px solid ${hovered ? color : "#8a7a6a"}`,
            boxShadow: hovered ? `0 0 8px ${color}88` : "2px 2px 4px rgba(0,0,0,0.5)",
            cursor: "default",
          }}
        >
          {/* Garis tengah fader */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3"
            style={{ height: 1, backgroundColor: "#6a5a4a" }}
          />
        </div>
      </div>

      {/* Nama skill */}
      <div
        className="text-center"
        style={{
          fontFamily: "monospace",
          fontSize: 9,
          color: hovered ? "#f4ebd0" : "#8a7a6a",
          letterSpacing: 1,
          textTransform: "uppercase",
          maxWidth: 48,
          lineHeight: 1.3,
          transition: "color 0.2s",
          wordBreak: "break-word",
        }}
      >
        {name}
      </div>

      {/* LED indicator bawah */}
      <div
        className="w-2 h-2 rounded-full transition-all duration-300"
        style={{
          backgroundColor: hovered ? color : "#2a2520",
          boxShadow: hovered ? `0 0 8px ${color}` : "none",
        }}
      />
    </motion.div>
  );
}

// ── Sub: Satu channel (kategori) mixer ───────────────────────────────────────
function MixerChannel({ category, skills, color, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      className="rounded-sm p-5"
      style={{
        background: "linear-gradient(160deg, #1e1b17, #151210)",
        border: "1px solid #3a3028",
        borderTop: `3px solid ${color}`,
      }}
    >
      {/* Channel label */}
      <div className="mb-5 text-center">
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 10,
            letterSpacing: 4,
            color,
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          {category}
        </span>
      </div>

      {/* Fader group */}
      <div className="flex justify-center gap-4 flex-wrap">
        {skills.map((skill, i) => (
          <MixerFader
            key={skill.name}
            name={skill.name}
            level={skill.level}
            color={color}
            index={i}
          />
        ))}
      </div>

      {/* Channel master knob dekoratif */}
      <div className="flex justify-center mt-5">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: "radial-gradient(circle at 35% 35%, #4a4038, #1a1510)",
            border: `2px solid ${color}44`,
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.6)",
          }}
        >
          <div
            className="w-1 h-3 rounded-full"
            style={{ backgroundColor: color, transform: "rotate(-30deg)", transformOrigin: "bottom" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ── Komponen Utama: Skills ────────────────────────────────────────────────────
export default function SkillsSection() {
  return (
    <section
      id="skills"
      className="py-20 px-4"
      style={{ backgroundColor: "#1a1817" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 8, color: "#7a3b2e", textTransform: "uppercase", marginBottom: 8 }}>
            ◈ Studio Equipment
          </p>
          <h2
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 900,
              color: "#f4ebd0",
              marginBottom: 8,
            }}
          >
            The Mixing Board
          </h2>
          <p style={{ fontFamily: "monospace", fontSize: 11, color: "#6a5a4a", letterSpacing: 2 }}>
            TECHNICAL SKILLS · ANALOG STUDIO SERIES
          </p>
        </motion.div>

        {/* ── Mixer channels grid ── */}
        <div className="grid md:grid-cols-3 gap-6">
          {SKILL_CHANNELS.map((channel, i) => (
            <MixerChannel key={channel.category} {...channel} index={i} />
          ))}
        </div>

        {/* ── Dekorasi bawah: VU Meter ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex justify-center gap-1"
        >
          {Array.from({ length: 32 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ height: [8, Math.random() * 32 + 8, 8] }}
              transition={{
                duration: 0.8 + Math.random() * 0.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 0.5,
              }}
              style={{
                width: 4,
                borderRadius: 2,
                backgroundColor:
                  i < 20
                    ? "#dcae1d"
                    : i < 28
                    ? "#e07820"
                    : "#c0392b",
              }}
            />
          ))}
        </motion.div>
        <p className="text-center mt-2" style={{ fontFamily: "monospace", fontSize: 9, color: "#4a3a2a", letterSpacing: 3 }}>
          VU METER · MASTER OUTPUT
        </p>
      </div>
    </section>
  );
}
