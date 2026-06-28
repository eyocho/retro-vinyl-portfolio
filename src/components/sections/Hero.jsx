import { motion } from "framer-motion";
import { Disc3, PlayCircle, ChevronDown } from "lucide-react";
import { useAudio } from "../../context/AudioContext";

// ── Komponen dekoratif: Label harga sudut kanan atas (gaya toko vinyl) ──────
function PriceSticker() {
  return (
    <div
      className="absolute top-4 right-4 w-16 h-16 rounded-full flex flex-col items-center justify-center text-center rotate-12"
      style={{
        background: "linear-gradient(135deg, #dcae1d, #b8941a)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      <span style={{ fontSize: 8, color: "#1a1410", fontFamily: "monospace", fontWeight: 700, lineHeight: 1.2 }}>
        STEREO
      </span>
      <span style={{ fontSize: 11, color: "#1a1410", fontFamily: "monospace", fontWeight: 900 }}>
        33⅓
      </span>
      <span style={{ fontSize: 7, color: "#1a1410", fontFamily: "monospace" }}>
        RPM
      </span>
    </div>
  );
}

// ── Komponen dekoratif: Barcode bawah ────────────────────────────────────────
function Barcode() {
  const bars = Array.from({ length: 28 }, (_, i) => ({
    width: [1, 2, 1, 3, 1, 2, 1, 1, 2, 3, 1, 1, 2, 1][i % 14] * 2,
    gap: i % 5 === 0 ? 3 : 2,
  }));

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-end gap-0.5" style={{ height: 40 }}>
        {bars.map((bar, i) => (
          <div
            key={i}
            style={{
              width: bar.width,
              height: `${60 + Math.sin(i * 0.8) * 30}%`,
              backgroundColor: "#1a1817",
              marginRight: bar.gap - bar.width,
            }}
          />
        ))}
      </div>
      <span
        style={{
          fontSize: 9,
          fontFamily: "monospace",
          color: "#1a1817",
          letterSpacing: 3,
        }}
      >
        VNL-2024-001
      </span>
    </div>
  );
}

// ── Komponen: Piringan hitam dekoratif di sisi kanan ─────────────────────────
function DecorativeVinyl({ isPlaying }) {
  return (
    <motion.div
      animate={{ rotate: isPlaying ? 360 : 0 }}
      transition={
        isPlaying
          ? { duration: 4, ease: "linear", repeat: Infinity }
          : { duration: 0.5 }
      }
      className="w-48 h-48 md:w-64 md:h-64 rounded-full flex-shrink-0"
      style={{
        background: `
          radial-gradient(circle at 50% 50%,
            #2a2520 0%, #1a1817 22%, #2a2520 27%,
            #1a1817 32%, #2a2520 37%, #1a1817 42%,
            #2a2520 47%, #dcae1d 47%, #dcae1d 53%,
            #1a1817 53%, #2a2520 60%, #1a1817 67%,
            #2a2520 72%, #1a1817 78%, #2a2520 84%,
            #1a1817 90%, #2a2520 100%
          )
        `,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 2px #3a3028",
      }}
    >
      {/* Label tengah */}
      <div
        className="w-full h-full rounded-full flex flex-col items-center justify-center"
        style={{
          background: "radial-gradient(circle at 50%, transparent 30%, transparent 100%)",
        }}
      >
        <div
          className="w-2/5 h-2/5 rounded-full flex flex-col items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #f4ebd0, #e8d9b0)",
            boxShadow: "0 0 0 3px #dcae1d",
          }}
        >
          <span style={{ fontSize: 7, fontFamily: "monospace", color: "#7a3b2e", fontWeight: 700, textAlign: "center", lineHeight: 1.3 }}>
            SIDE A
          </span>
          <Disc3 size={14} style={{ color: "#7a3b2e", marginTop: 2 }} />
        </div>
      </div>
    </motion.div>
  );
}

// ── Komponen Utama: Hero ──────────────────────────────────────────────────────
export default function HeroSection() {
  const { isPlaying, playAndScroll } = useAudio();

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden"
      style={{ backgroundColor: "#f4ebd0" }}
    >
      {/* ── Background texture (noise grain effect) ── */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
        }}
      />

      {/* ── Garis dekoratif atas & bawah ── */}
      <div className="absolute top-0 left-0 right-0 h-2" style={{ background: "linear-gradient(90deg, #7a3b2e, #dcae1d, #7a3b2e)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-2" style={{ background: "linear-gradient(90deg, #7a3b2e, #dcae1d, #7a3b2e)" }} />

      {/* ── Album jacket (kartu utama) ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-3xl rounded-sm overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #f0e4c4, #e8d5a0)",
          border: "2px solid #c4a96a",
          boxShadow: "8px 8px 0 #1a1817, 12px 12px 0 #3a3028, 16px 16px 0 rgba(0,0,0,0.1)",
        }}
      >
        <PriceSticker />

        {/* ── Label rilis atas ── */}
        <div
          className="w-full py-2 px-6 flex justify-between items-center"
          style={{ borderBottom: "1px solid #c4a96a", backgroundColor: "#1a1817" }}
        >
          <span style={{ color: "#dcae1d", fontFamily: "monospace", fontSize: 10, letterSpacing: 4, fontWeight: 700 }}>
            VINYL RECORDS ◈ STEREO
          </span>
          <span style={{ color: "#8a7a6a", fontFamily: "monospace", fontSize: 10 }}>
            ℗ 2024
          </span>
        </div>

        {/* ── Konten utama ── */}
        <div className="flex flex-col md:flex-row items-center gap-8 p-8 md:p-12">
          {/* ── Kiri: Teks album ── */}
          <div className="flex-1 text-center md:text-left">
            {/* Eyebrow label */}
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                fontFamily: "monospace",
                fontSize: 11,
                letterSpacing: 6,
                color: "#7a3b2e",
                fontWeight: 700,
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              ◈ Main Artist
            </motion.p>

            {/* Nama utama */}
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "clamp(2.4rem, 6vw, 4rem)",
                fontWeight: 900,
                color: "#1a1817",
                lineHeight: 1.1,
                marginBottom: 8,
              }}
            >
              {/* ⬇ GANTI dengan nama Anda */}
              Arya Pratama
            </motion.h1>

            {/* Divider garis emas */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="origin-left"
              style={{
                height: 3,
                background: "linear-gradient(90deg, #dcae1d, transparent)",
                marginBottom: 12,
                maxWidth: 200,
              }}
            />

            {/* Album title / role */}
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                fontFamily: "monospace",
                fontSize: 12,
                letterSpacing: 4,
                color: "#7a3b2e",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Album:
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(1.1rem, 3vw, 1.6rem)",
                fontWeight: 700,
                color: "#3a2a18",
                fontStyle: "italic",
                marginBottom: 24,
              }}
            >
              {/* ⬇ GANTI dengan role/pekerjaan Anda */}
              "Full Stack Developer & UI Designer"
            </motion.h2>

            {/* Tracklist preview kecil */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mb-8"
              style={{
                fontFamily: "monospace",
                fontSize: 11,
                color: "#6a5a4a",
                lineHeight: 1.8,
              }}
            >
              <div>A1. React.js &amp; TypeScript ............. 5★</div>
              <div>A2. Node.js &amp; REST API ................. 5★</div>
              <div>A3. UI/UX Design ......................... 4★</div>
            </motion.div>

            {/* ── CTA Button: Drop the Needle ── */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => playAndScroll("about")}
              className="flex items-center gap-3 px-8 py-4 rounded-sm font-bold transition-all"
              style={{
                background: isPlaying
                  ? "linear-gradient(135deg, #7a3b2e, #5a2b1e)"
                  : "linear-gradient(135deg, #1a1817, #2a2218)",
                color: "#dcae1d",
                fontFamily: "monospace",
                fontSize: 14,
                letterSpacing: 3,
                textTransform: "uppercase",
                border: "2px solid #dcae1d",
                boxShadow: isPlaying
                  ? "0 0 20px rgba(220,174,29,0.3)"
                  : "4px 4px 0 #dcae1d",
              }}
            >
              <PlayCircle size={20} />
              {isPlaying ? "▶ Now Playing..." : "Drop the Needle"}
            </motion.button>
          </div>

          {/* ── Kanan: Piringan vinyl dekoratif ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
          >
            <DecorativeVinyl isPlaying={isPlaying} />
          </motion.div>
        </div>

        {/* ── Footer barcode ── */}
        <div
          className="flex justify-between items-end px-8 py-4"
          style={{ borderTop: "1px solid #c4a96a" }}
        >
          <div style={{ fontFamily: "monospace", fontSize: 9, color: "#8a7a6a", lineHeight: 1.6 }}>
            <div>MANUFACTURED BY VINYL RECORDS INT'L</div>
            <div>ALL RIGHTS RESERVED · PORTFOLIO EDITION</div>
          </div>
          <Barcode />
        </div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 flex flex-col items-center gap-1"
        style={{ color: "#8a7a6a" }}
      >
        <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 3 }}>SIDE B</span>
        <ChevronDown size={18} />
      </motion.div>
    </section>
  );
}
