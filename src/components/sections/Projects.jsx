import { AnimatePresence, motion } from "framer-motion";
import { Disc, ExternalLink, GitBranch, Play, X } from "lucide-react";
import { useState } from "react";
import { ALL_GENRES, PROJECTS } from "../../data/projects";

// ── Sub: Modal detail proyek ──────────────────────────────────────────────────
function ProjectModal({ project, onClose }) {
  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 40 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-lg rounded-sm p-8"
          style={{
            background: "linear-gradient(160deg, #f0e4c4, #e8d5a0)",
            border: "2px solid #c4a96a",
            boxShadow: "8px 8px 0 #1a1817",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded hover:bg-black/10 transition-colors"
          >
            <X size={18} style={{ color: "#1a1817" }} />
          </button>

          {/* Header label */}
          <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 5, color: "#7a3b2e", marginBottom: 4, fontWeight: 700 }}>
            ◈ TRACK PREVIEW
          </p>
          <div className="flex items-baseline gap-3 mb-4">
            <span style={{ fontFamily: "monospace", fontSize: "2rem", fontWeight: 900, color: "#c4a96a" }}>
              {project.trackNumber}
            </span>
            <h3
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "1.4rem",
                fontWeight: 900,
                color: "#1a1817",
                lineHeight: 1.2,
              }}
            >
              {project.title}
            </h3>
          </div>

          {/* Divider */}
          <div style={{ height: 1, backgroundColor: "#c4a96a", marginBottom: 16 }} />

          {/* Meta */}
          <div className="flex flex-wrap gap-4 mb-4" style={{ fontFamily: "monospace", fontSize: 11 }}>
            <span style={{ color: "#6a5a4a" }}>ROLE: <span style={{ color: "#1a1817", fontWeight: 700 }}>{project.role}</span></span>
            <span style={{ color: "#6a5a4a" }}>YEAR: <span style={{ color: "#1a1817", fontWeight: 700 }}>{project.year}</span></span>
            <span style={{ color: "#6a5a4a" }}>RUNTIME: <span style={{ color: "#1a1817", fontWeight: 700 }}>{project.duration}</span></span>
          </div>

          {/* Genre tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {project.genre.map((g) => (
              <span
                key={g}
                style={{
                  fontFamily: "monospace",
                  fontSize: 10,
                  letterSpacing: 2,
                  color: "#7a3b2e",
                  border: "1px solid #7a3b2e",
                  padding: "2px 8px",
                  borderRadius: 2,
                }}
              >
                {g}
              </span>
            ))}
          </div>

          {/* Deskripsi */}
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.9rem",
              color: "#3a2a18",
              lineHeight: 1.8,
              marginBottom: 20,
            }}
          >
            {project.description}
          </p>

          {/* Action buttons */}
          <div className="flex gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 transition-all"
                style={{
                  fontFamily: "monospace",
                  fontSize: 11,
                  letterSpacing: 2,
                  fontWeight: 700,
                  color: "#dcae1d",
                  backgroundColor: "#1a1817",
                  border: "2px solid #1a1817",
                  textTransform: "uppercase",
                }}
              >
                <ExternalLink size={13} />
                Live Demo
              </a>
            )}
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 transition-all"
              style={{
                fontFamily: "monospace",
                fontSize: 11,
                letterSpacing: 2,
                fontWeight: 700,
                color: "#1a1817",
                border: "2px solid #1a1817",
                textTransform: "uppercase",
              }}
            >
              <GitBranch size={13} />
              Source Code
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );``
}

// ── Sub: Satu baris tracklist ─────────────────────────────────────────────────
function TrackRow({ project, index, onPreview }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-4 px-5 py-4 rounded-sm transition-all duration-200 cursor-default group"
      style={{
        backgroundColor: hovered ? "#f0e4c4" : "transparent",
        borderBottom: "1px dashed #c4a96a",
      }}
    >
      {/* Track number / play icon */}
      <div className="w-8 flex-shrink-0 text-center">
        {hovered ? (
          <Play size={14} style={{ color: "#7a3b2e", margin: "0 auto" }} />
        ) : (
          <span style={{ fontFamily: "monospace", fontSize: 12, color: "#8a7a6a", fontWeight: 700 }}>
            {project.trackNumber}
          </span>
        )}
      </div>

      {/* Disc icon */}
      <Disc size={14} style={{ color: hovered ? "#7a3b2e" : "#c4a96a", flexShrink: 0 }} />

      {/* Title + genre */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.95rem",
              fontWeight: hovered ? 700 : 600,
              color: "#1a1817",
            }}
          >
            {project.title}
          </span>
          {project.highlight && (
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 8,
                letterSpacing: 2,
                color: "#dcae1d",
                backgroundColor: "#1a1817",
                padding: "1px 5px",
                borderRadius: 2,
              }}
            >
              FEATURED
            </span>
          )}
        </div>
        <div className="flex gap-2 mt-1 flex-wrap">
          {project.genre.map((g) => (
            <span key={g} style={{ fontFamily: "monospace", fontSize: 9, color: "#8a7a6a", letterSpacing: 1 }}>
              {g}
            </span>
          ))}
        </div>
      </div>

      {/* Duration */}
      <span style={{ fontFamily: "monospace", fontSize: 12, color: "#8a7a6a", flexShrink: 0 }}>
        {project.duration}
      </span>

      {/* Action buttons (hanya tampil saat hover) */}
      <div
        className="flex items-center gap-2 transition-all duration-200"
        style={{ opacity: hovered ? 1 : 0 }}
      >
        <button
          onClick={() => onPreview(project)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-sm transition-colors"
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            letterSpacing: 2,
            color: "#f4ebd0",
            backgroundColor: "#1a1817",
            textTransform: "uppercase",
          }}
        >
          <Play size={9} />
          Preview
        </button>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-sm hover:bg-black/10"
          >
            <ExternalLink size={13} style={{ color: "#7a3b2e" }} />
          </a>
        )}
      </div>
    </motion.div>
  );
}

// ── Komponen Utama: Projects ──────────────────────────────────────────────────
export default function ProjectsSection() {
  const [activeGenre, setActiveGenre] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);

  const filtered =
    activeGenre === "All"
      ? PROJECTS
      : PROJECTS.filter((p) => p.genre.includes(activeGenre));

  return (
    <section id="projects" className="py-20 px-4" style={{ backgroundColor: "#f4ebd0" }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 8, color: "#7a3b2e", textTransform: "uppercase", marginBottom: 8 }}>
            ◈ Catalog
          </p>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, color: "#1a1817" }}>
            The Discography
          </h2>
        </motion.div>

        {/* Filter genre */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {ALL_GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => setActiveGenre(genre)}
              className="px-4 py-1.5 rounded-sm transition-all"
              style={{
                fontFamily: "monospace",
                fontSize: 10,
                letterSpacing: 2,
                textTransform: "uppercase",
                fontWeight: activeGenre === genre ? 700 : 400,
                color: activeGenre === genre ? "#f4ebd0" : "#6a5a4a",
                backgroundColor: activeGenre === genre ? "#1a1817" : "transparent",
                border: `1px solid ${activeGenre === genre ? "#1a1817" : "#c4a96a"}`,
              }}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Tracklist album */}
        <div
          className="rounded-sm overflow-hidden"
          style={{
            border: "2px solid #c4a96a",
            boxShadow: "6px 6px 0 #1a1817",
          }}
        >
          {/* Album header */}
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{ backgroundColor: "#1a1817", borderBottom: "1px solid #3a3028" }}
          >
            <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 4, color: "#dcae1d", fontWeight: 700 }}>
              TRACK
            </span>
            <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 4, color: "#dcae1d", fontWeight: 700 }}>
              TITLE
            </span>
            <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 4, color: "#dcae1d", fontWeight: 700 }}>
              TIME
            </span>
          </div>

          {/* Rows */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeGenre}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {filtered.length > 0 ? (
                filtered.map((project, i) => (
                  <TrackRow
                    key={project.id}
                    project={project}
                    index={i}
                    onPreview={setSelectedProject}
                  />
                ))
              ) : (
                <div className="py-12 text-center" style={{ fontFamily: "monospace", fontSize: 12, color: "#8a7a6a", letterSpacing: 2 }}>
                  NO TRACKS FOUND FOR THIS GENRE
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Album footer */}
          <div
            className="px-5 py-3 flex justify-between"
            style={{ backgroundColor: "#f0e4c4", borderTop: "1px dashed #c4a96a" }}
          >
            <span style={{ fontFamily: "monospace", fontSize: 9, color: "#8a7a6a", letterSpacing: 2 }}>
              {filtered.length} TRACKS
            </span>
            <span style={{ fontFamily: "monospace", fontSize: 9, color: "#8a7a6a", letterSpacing: 2 }}>
              VINYL RECORDS INTL.
            </span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  );
}
