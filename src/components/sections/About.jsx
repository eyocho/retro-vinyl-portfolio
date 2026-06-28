import { motion } from "framer-motion";
import { User, MapPin, Coffee, Code2, Calendar } from "lucide-react";

const STATS = [
  { icon: Calendar, label: "Years of Experience", value: "4+", unit: "tahun" },
  { icon: Code2,    label: "Lines of Code",       value: "200K+", unit: "baris" },
  { icon: Coffee,   label: "Cups of Coffee",       value: "1,842", unit: "cangkir" },
  { icon: User,     label: "Projects Delivered",   value: "30+", unit: "proyek" },
];

function StatCard({ icon: Icon, label, value, unit, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="flex flex-col items-center p-5 rounded-sm"
      style={{
        background: "#1a1817",
        border: "1px solid #3a3028",
        boxShadow: "3px 3px 0 #dcae1d",
      }}
    >
      <Icon size={20} style={{ color: "#dcae1d", marginBottom: 8 }} />
      <span
        style={{
          fontFamily: "Georgia, serif",
          fontSize: "1.8rem",
          fontWeight: 900,
          color: "#f4ebd0",
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <span style={{ fontFamily: "monospace", fontSize: 10, color: "#8a7a6a", letterSpacing: 2, marginTop: 4, textAlign: "center", textTransform: "uppercase" }}>
        {unit}
      </span>
    </motion.div>
  );
}

export default function AboutSection() {
  return (
    <section
      id="about"
      className="py-20 px-4"
      style={{ backgroundColor: "#ede4c8" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-12"
        >
          <div style={{ flex: 1, height: 1, backgroundColor: "#c4a96a" }} />
          <h2
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              letterSpacing: 8,
              color: "#7a3b2e",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            ◈ LINER NOTES
          </h2>
          <div style={{ flex: 1, height: 1, backgroundColor: "#c4a96a" }} />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* ── Kiri: Teks biografi ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "2rem",
                fontWeight: 900,
                color: "#1a1817",
                marginBottom: 16,
                lineHeight: 1.2,
              }}
            >
              Artist Biography
            </h3>

            {/* Teks biografi bergaya liner notes */}
            {[
              `Lahir dan besar di lingkungan yang penuh rasa ingin tahu, Arya Pratama memulai perjalanannya di dunia digital sejak usia 16 tahun — jauh sebelum "full stack developer" menjadi istilah yang populer di Indonesia.`,
              `Seperti seorang musisi yang menghabiskan ribuan jam di ruang latihan sebelum naik panggung, Arya menempa keahliannya lewat proyek demi proyek: dari website sederhana untuk UMKM lokal, hingga platform skala enterprise yang melayani ratusan ribu pengguna.`,
              `Filosofinya sederhana namun kuat: kode yang baik adalah kode yang bisa dibaca oleh manusia, bukan hanya mesin. Setiap baris yang ditulis adalah not musik dalam simfoni yang lebih besar — sistem yang harmonis, indah, dan fungsional.`,
            ].map((para, i) => (
              <p
                key={i}
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "0.95rem",
                  color: "#3a2a18",
                  lineHeight: 1.9,
                  marginBottom: 16,
                  textAlign: "justify",
                }}
              >
                {para}
              </p>
            ))}

            {/* Lokasi */}
            <div className="flex items-center gap-2 mt-6">
              <MapPin size={14} style={{ color: "#7a3b2e" }} />
              <span style={{ fontFamily: "monospace", fontSize: 12, color: "#6a5a4a", letterSpacing: 2 }}>
                JAKARTA, INDONESIA
              </span>
            </div>
          </motion.div>

          {/* ── Kanan: Stats ── */}
          <div>
            <p
              style={{
                fontFamily: "monospace",
                fontSize: 10,
                letterSpacing: 4,
                color: "#7a3b2e",
                textTransform: "uppercase",
                marginBottom: 16,
                fontWeight: 700,
              }}
            >
              ◈ Wrapped Statistics
            </p>
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((stat, i) => (
                <StatCard key={stat.label} {...stat} index={i} />
              ))}
            </div>

            {/* Top Skills badge */}
            <div className="mt-6 p-4 rounded-sm" style={{ border: "1px dashed #c4a96a" }}>
              <p style={{ fontFamily: "monospace", fontSize: 10, color: "#7a3b2e", letterSpacing: 3, marginBottom: 10, fontWeight: 700 }}>
                TOP SKILLS THIS YEAR
              </p>
              {["React.js", "Node.js", "TypeScript", "UI/UX Design", "PostgreSQL"].map((skill, i) => (
                <div key={skill} className="flex items-center gap-2 mb-2">
                  <span style={{ fontFamily: "monospace", fontSize: 10, color: "#8a7a6a", minWidth: 16 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div style={{ flex: 1, height: 1, backgroundColor: "#c4a96a", opacity: 0.5 }} />
                  <span style={{ fontFamily: "monospace", fontSize: 11, color: "#1a1817", letterSpacing: 1 }}>
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
