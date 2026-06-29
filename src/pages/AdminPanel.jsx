import { useState, useRef } from "react";
import { useAudio } from "../context/AudioContext";

const INK   = "#0a0c0f";
const INK2  = "#141720";
const INK3  = "#1c2030";
const WIRE  = "#2a2e3d";
const WIRE2 = "#363b50";
const GOLD  = "#c8a84b";
const GOLD2 = "#e0bc6a";
const GOLDD = "#4a3d1c";
const AQUA  = "#1fc8a8";
const AQUAD = "#0a3028";
const TEXT  = "#d4cfc8";
const TEXT2 = "#7a7d8a";
const TEXT3 = "#4a4d58";
const MONO  = "'Courier New', monospace";

const css = {
  shell:    { background: INK, border: `1px solid ${WIRE2}`, borderRadius: 4, display: "grid", gridTemplateColumns: "188px 1fr", minHeight: 680, fontFamily: "system-ui, sans-serif", fontSize: 13 },
  rail:     { background: INK2, borderRight: `1px solid ${WIRE}`, display: "flex", flexDirection: "column" },
  railHead: { padding: "16px 14px 12px", borderBottom: `1px solid ${WIRE}` },
  sysId:    { fontFamily: MONO, fontSize: 10, color: GOLD, letterSpacing: "0.12em" },
  sysSub:   { fontFamily: MONO, fontSize: 9, color: TEXT3, marginTop: 2, letterSpacing: "0.06em" },
  secLbl:   { fontFamily: MONO, fontSize: 9, color: TEXT3, letterSpacing: "0.1em", padding: "12px 14px 4px", textTransform: "uppercase" },
  ws:       { display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" },
  topbar:   { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 18px", borderBottom: `1px solid ${WIRE}`, background: INK2 },
  bc:       { fontFamily: MONO, fontSize: 11, color: TEXT2 },
  main:     { padding: 18, flex: 1, overflowY: "auto", overflowX: "hidden" },
  module:   { border: `1px solid ${WIRE}`, borderRadius: 2, marginBottom: 14, overflow: "hidden" },
  mHead:    { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px", background: INK2, borderBottom: `1px solid ${WIRE}` },
  mLabel:   { fontFamily: MONO, fontSize: 10, color: TEXT2, letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: 8 },
  mBody:    { padding: 14 },
  fieldGrid:{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 },
  flabel:   { fontFamily: MONO, fontSize: 9, color: TEXT3, letterSpacing: "0.1em", display: "block", marginBottom: 4 },
  input:    { background: INK, border: `1px solid ${WIRE}`, color: TEXT, fontSize: 12, fontFamily: MONO, padding: "6px 9px", borderRadius: 2, outline: "none", width: "100%", boxSizing: "border-box" },
  textarea: { background: INK, border: `1px solid ${WIRE}`, color: TEXT, fontSize: 12, fontFamily: MONO, padding: "6px 9px", borderRadius: 2, outline: "none", width: "100%", resize: "vertical", minHeight: 56, boxSizing: "border-box" },
  select:   { background: INK, border: `1px solid ${WIRE}`, color: TEXT, fontSize: 12, fontFamily: MONO, padding: "6px 9px", borderRadius: 2, outline: "none", width: "100%" },
  colorRow: { display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: `1px solid ${WIRE}` },
  colorSwatch: { width: 28, height: 22, borderRadius: 2, border: `1px solid ${WIRE2}`, cursor: "pointer", padding: 2, background: INK, flexShrink: 0 },
  colorLabel: { fontFamily: MONO, fontSize: 11, color: TEXT, flex: 1 },
  colorHex: { fontFamily: MONO, fontSize: 11, color: TEXT2, width: 64, flexShrink: 0 },
  colorPreview: { width: 18, height: 18, borderRadius: 1, flexShrink: 0 },
  trRow:    { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${WIRE}` },
  trName:   { fontSize: 12, color: TEXT },
  trSub:    { fontSize: 10, color: TEXT3, fontFamily: MONO, marginTop: 2 },
  statGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  statPair: { display: "flex", gap: 6 },
  statusbar:{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 18px", borderTop: `1px solid ${WIRE}`, background: INK2 },
  trackRow: { display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: INK, border: `1px solid ${WIRE}`, borderRadius: 2, cursor: "grab", marginBottom: 6 },
  projRow:  { display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderBottom: `1px solid ${WIRE}`, transition: "background 0.1s" },
};

function NavItem({ label, icon, active, onClick, tag }) {
  return (
    <div onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 8, padding: "8px 14px",
      fontSize: 12, fontFamily: MONO, color: active ? GOLD : TEXT2, cursor: "pointer",
      borderLeft: `2px solid ${active ? GOLD : "transparent"}`,
      background: active ? `rgba(200,168,75,0.06)` : "transparent",
      transition: "all 0.12s",
    }}>
      {icon} {label}
      {tag !== undefined && (
        <span style={{ marginLeft: "auto", fontSize: 9, padding: "1px 5px", borderRadius: 2, background: AQUAD, color: AQUA, fontFamily: MONO }}>
          {tag}
        </span>
      )}
    </div>
  );
}

function ModuleHead({ label, action }) {
  return (
    <div style={css.mHead}>
      <span style={css.mLabel}>
        <span style={{ display: "inline-block", width: 3, height: 10, background: GOLD, borderRadius: 1 }} />
        {label}
      </span>
      {action}
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <div onClick={() => onChange(!checked)} style={{ position: "relative", width: 32, height: 18, flexShrink: 0, cursor: "pointer" }}>
      <div style={{ position: "absolute", inset: 0, background: checked ? GOLDD : WIRE, borderRadius: 1, transition: "background 0.15s" }} />
      <div style={{
        position: "absolute", top: 3, left: checked ? 17 : 3,
        width: 12, height: 12, background: checked ? GOLD : TEXT3,
        borderRadius: 1, transition: "left 0.15s, background 0.15s",
      }} />
    </div>
  );
}

function ToggleRow({ label, sub, checked, onChange }) {
  return (
    <div style={{ ...css.trRow }}>
      <div><div style={css.trName}>{label}</div>{sub && <div style={css.trSub}>{sub}</div>}</div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function ColorRow({ label, value, onChange }) {
  return (
    <div style={{ ...css.colorRow }}>
      <div style={css.colorSwatch}>
        <input type="color" value={value} onChange={e => onChange(e.target.value)}
          style={{ width: "100%", height: "100%", border: "none", background: "none", cursor: "pointer", padding: 0 }} />
      </div>
      <span style={css.colorLabel}>{label}</span>
      <span style={css.colorHex}>{value}</span>
      <div style={{ ...css.colorPreview, background: value }} />
    </div>
  );
}

function TbBtn({ children, onClick, accent }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 5, padding: "5px 11px",
      fontSize: 11, fontFamily: MONO, background: accent ? `rgba(200,168,75,0.08)` : "transparent",
      border: `1px solid ${accent ? GOLDD : WIRE2}`, color: accent ? GOLD : TEXT2,
      borderRadius: 2, cursor: "pointer", letterSpacing: "0.04em", transition: "all 0.12s",
    }}>
      {children}
    </button>
  );
}

function Field({ label, children, full }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, ...(full ? { gridColumn: "1 / -1" } : {}) }}>
      <span style={css.flabel}>{label}</span>
      {children}
    </div>
  );
}

// ── Panels ──────────────────────────────────────────────────────────────────

function PanelTheme({ theme, onChange }) {
  const [anims, setAnims] = useState({ vinylSpin: true, marquee: true, particle: false, scroll: true });
  const [typo, setTypo] = useState({ headingFont: "Georgia, serif", bodyFont: "'Courier New', monospace", size: 48, tracking: 0 });

  return (
    <>
      <div style={css.module}>
        <ModuleHead label="color matrix" />
        <div style={css.mBody}>
          <ColorRow label="background primari"  value={theme.bgPrimary}   onChange={v => onChange({ ...theme, bgPrimary: v })} />
          <ColorRow label="background sekunder"  value={theme.bgSecondary} onChange={v => onChange({ ...theme, bgSecondary: v })} />
          <ColorRow label="aksen emas"           value={theme.accentGold}  onChange={v => onChange({ ...theme, accentGold: v })} />
          <ColorRow label="aksen merah / coklat" value={theme.accentRed}   onChange={v => onChange({ ...theme, accentRed: v })} />
          <ColorRow label="teks primari"         value={theme.textPrimary} onChange={v => onChange({ ...theme, textPrimary: v })} />
          <div style={{ marginTop: 12, background: theme.bgPrimary, borderRadius: 2, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid ${theme.accentGold}`, flexShrink: 0 }} />
            <div>
              <span style={{ fontFamily: "Georgia, serif", fontWeight: 700, color: theme.textPrimary, fontSize: 13 }}>Muhammad Richo Irsyad Faiz</span>
              <div style={{ fontFamily: MONO, fontSize: 9, color: theme.accentRed, marginTop: 2 }}>live preview</div>
            </div>
          </div>
        </div>
      </div>

      <div style={css.module}>
        <ModuleHead label="tipografi" />
        <div style={css.mBody}>
          <div style={css.fieldGrid}>
            <Field label="HEADING FONT">
              <select style={css.select} value={typo.headingFont} onChange={e => setTypo(t => ({ ...t, headingFont: e.target.value }))}>
                <option value="Georgia, serif">Georgia (serif)</option>
                <option value="'Playfair Display', serif">Playfair Display</option>
                <option value="'Times New Roman', serif">Times New Roman</option>
                <option value="'Courier New', monospace">Courier New (mono)</option>
              </select>
            </Field>
            <Field label="BODY FONT">
              <select style={css.select} value={typo.bodyFont} onChange={e => setTypo(t => ({ ...t, bodyFont: e.target.value }))}>
                <option value="'Courier New', monospace">Courier New</option>
                <option value="system-ui, sans-serif">System sans-serif</option>
                <option value="Georgia, serif">Georgia</option>
              </select>
            </Field>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ ...css.flabel, minWidth: 80, marginBottom: 0 }}>heading size</span>
            <input type="range" min={28} max={96} step={2} value={typo.size}
              onChange={e => setTypo(t => ({ ...t, size: +e.target.value }))}
              style={{ flex: 1, accentColor: GOLD }} />
            <span style={{ fontFamily: MONO, fontSize: 11, color: GOLD, minWidth: 40 }}>{typo.size}px</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ ...css.flabel, minWidth: 80, marginBottom: 0 }}>letter spacing</span>
            <input type="range" min={-5} max={15} step={1} value={typo.tracking}
              onChange={e => setTypo(t => ({ ...t, tracking: +e.target.value }))}
              style={{ flex: 1, accentColor: GOLD }} />
            <span style={{ fontFamily: MONO, fontSize: 11, color: GOLD, minWidth: 40 }}>{(typo.tracking / 100).toFixed(2)}em</span>
          </div>
        </div>
      </div>

      <div style={css.module}>
        <ModuleHead label="animasi" />
        <div style={css.mBody}>
          <ToggleRow label="vinyl spin" sub="piringan berputar saat audio berjalan" checked={anims.vinylSpin} onChange={v => setAnims(a => ({ ...a, vinylSpin: v }))} />
          <ToggleRow label="marquee judul" sub="teks berjalan jika overflow" checked={anims.marquee} onChange={v => setAnims(a => ({ ...a, marquee: v }))} />
          <ToggleRow label="particle ambient" sub="efek partikel di background" checked={anims.particle} onChange={v => setAnims(a => ({ ...a, particle: v }))} />
          <ToggleRow label="smooth scroll" sub="transisi scroll halus antar seksi" checked={anims.scroll} onChange={v => setAnims(a => ({ ...a, scroll: v }))} />
        </div>
      </div>
    </>
  );
}

function PanelSections() {
  const [vis, setVis] = useState({ hero: true, about: true, skills: true, projects: true, contact: true });
  const [hero, setHero] = useState({ cta: "Drop the Needle", tagline: "Jokiin Tesis", desc: "Full-stack developer dari Kota Tangerang yang membangun produk digital berkualitas.", tracklist: true, stats: true });
  const toggle = k => setVis(v => ({ ...v, [k]: !v[k] }));

  return (
    <>
      <div style={css.module}>
        <ModuleHead label="visibilitas seksi" />
        <div style={css.mBody}>
          {[["hero", "album cover + cta utama"], ["about", "biografi dan deskripsi"], ["skills", "bar chart keahlian"], ["projects", "daftar karya dan proyek"], ["contact", "form kontak dan sosial"]].map(([k, sub]) => (
            <ToggleRow key={k} label={k} sub={sub} checked={vis[k]} onChange={() => toggle(k)} />
          ))}
        </div>
      </div>
      <div style={css.module}>
        <ModuleHead label="hero section" />
        <div style={css.mBody}>
          <div style={css.fieldGrid}>
            <Field label="CTA BUTTON"><input style={css.input} value={hero.cta} onChange={e => setHero(h => ({ ...h, cta: e.target.value }))} /></Field>
            <Field label="TAGLINE"><input style={css.input} value={hero.tagline} onChange={e => setHero(h => ({ ...h, tagline: e.target.value }))} /></Field>
          </div>
          <Field label="DESKRIPSI HERO"><textarea style={css.textarea} value={hero.desc} onChange={e => setHero(h => ({ ...h, desc: e.target.value }))} /></Field>
          <div style={{ marginTop: 10 }}>
            <ToggleRow label="tampilkan tracklist" sub="daftar skill bergaya vinyl" checked={hero.tracklist} onChange={v => setHero(h => ({ ...h, tracklist: v }))} />
            <ToggleRow label="stats counter" sub="years / loc / coffee / projects" checked={hero.stats} onChange={v => setHero(h => ({ ...h, stats: v }))} />
          </div>
        </div>
      </div>
      <div style={css.module}>
        <ModuleHead label="layout proyek" />
        <div style={{ ...css.mBody, ...css.fieldGrid }}>
          <Field label="GRID MODE">
            <select style={css.select}><option>list tracklist</option><option selected>grid 2 kolom</option><option>grid 3 kolom</option></select>
          </Field>
          <Field label="PER HALAMAN">
            <select style={css.select}><option>4</option><option selected>6</option><option>semua</option></select>
          </Field>
        </div>
      </div>
    </>
  );
}

function PanelProfile() {
  const [name, setName] = useState("Muhammad Richo Irsyad Faiz");
  const [stats, setStats] = useState([["4+","Years of Experience"],["200K+","Lines of Code"],["1,842","Cups of Coffee"],["30+","Projects Delivered"]]);
  const [paras, setParas] = useState(["Lahir dan besar di lingkungan yang penuh rasa ingin tahu, Arya Pratama memulai perjalanannya di dunia digital sejak usia 16 tahun.", "Seperti seorang musisi yang menghabiskan ribuan jam di ruang latihan sebelum naik panggung, Arya menempa keahliannya lewat proyek demi proyek."]);
  const [photo, setPhoto] = useState(null);
  const fileRef = useRef();

  const initials = name.trim().split(" ").filter(Boolean).reduce((a, w, i, arr) => i === 0 || i === arr.length - 1 ? a + w[0] : a, "").toUpperCase().slice(0, 2);

  const loadPhoto = (e) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader(); r.onload = ev => setPhoto(ev.target.result); r.readAsDataURL(f);
  };

  return (
    <>
      <div style={css.module}>
        <ModuleHead label="identitas" />
        <div style={css.mBody}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
            <div
              onClick={() => fileRef.current?.click()}
              style={{ width: 52, height: 52, borderRadius: 2, background: INK2, border: `1px solid ${WIRE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontFamily: MONO, color: GOLD, flexShrink: 0, cursor: "pointer", overflow: "hidden" }}
            >
              {photo ? <img src={photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="foto" /> : initials}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={loadPhoto} />
            <div style={{ flex: 1 }}>
              <div style={css.fieldGrid}>
                <Field label="NAMA LENGKAP"><input style={css.input} value={name} onChange={e => setName(e.target.value)} /></Field>
                <Field label="ROLE"><input style={css.input} defaultValue="Jokiin Tesis" /></Field>
              </div>
            </div>
          </div>
          <div style={css.fieldGrid}>
            <Field label="EMAIL"><input style={css.input} type="email" defaultValue="richoirsyad07@gmail.com" /></Field>
            <Field label="LOKASI"><input style={css.input} defaultValue="Kota Tangerang, Indonesia" /></Field>
          </div>
        </div>
      </div>

      <div style={css.module}>
        <ModuleHead label="statistik"
          action={<TbBtn onClick={() => setStats(s => [...s, ["0", "Label Baru"]])}>+ stat</TbBtn>}
        />
        <div style={{ ...css.mBody, ...css.statGrid }}>
          {stats.map(([val, lbl], i) => (
            <div key={i} style={css.statPair}>
              <input style={{ ...css.input, flex: "0 0 56px" }} value={val} onChange={e => setStats(s => s.map((r, j) => j === i ? [e.target.value, r[1]] : r))} />
              <input style={{ ...css.input, flex: 1 }} value={lbl} onChange={e => setStats(s => s.map((r, j) => j === i ? [r[0], e.target.value] : r))} />
            </div>
          ))}
        </div>
      </div>

      <div style={css.module}>
        <ModuleHead label="sosial media" />
        <div style={css.mBody}>
          <div style={css.fieldGrid}>
            <Field label="GITHUB"><input style={css.input} type="url" defaultValue="https://github.com" /></Field>
            <Field label="LINKEDIN"><input style={css.input} type="url" defaultValue="https://linkedin.com" /></Field>
          </div>
          <Field label="INSTAGRAM"><input style={css.input} type="url" placeholder="https://instagram.com/username" /></Field>
        </div>
      </div>

      <div style={css.module}>
        <ModuleHead label="bio / liner notes"
          action={<TbBtn onClick={() => setParas(p => [...p, ""])}>+ paragraf</TbBtn>}
        />
        <div style={css.mBody}>
          {paras.map((p, i) => (
            <Field key={i} label={`PARAGRAF ${String(i + 1).padStart(2, "0")}`}>
              <textarea style={{ ...css.textarea, marginBottom: 8 }} value={p} onChange={e => setParas(arr => arr.map((x, j) => j === i ? e.target.value : x))} />
            </Field>
          ))}
        </div>
      </div>
    </>
  );
}

function PanelProjects() {
  const [projects, setProjects] = useState([
    { id: 1, num: "01", name: "E-Commerce Platform",    tech: ["React","Node.js","MongoDB"], year: "2024", feat: true  },
    { id: 2, num: "02", name: "Dashboard Analytics",    tech: ["React","TypeScript","D3.js"], year: "2024", feat: false },
    { id: 3, num: "03", name: "Mobile Banking App",     tech: ["React Native","Firebase"],   year: "2023", feat: false },
    { id: 4, num: "04", name: "AI Content Generator",   tech: ["Next.js","OpenAI"],          year: "2023", feat: true  },
  ]);

  const add  = () => setProjects(p => [...p, { id: Date.now(), num: String(p.length + 1).padStart(2, "0"), name: "Proyek baru", tech: ["React"], year: "2024", feat: false }]);
  const del  = id => setProjects(p => p.filter(x => x.id !== id));
  const feat = id => setProjects(p => p.map(x => x.id === id ? { ...x, feat: !x.feat } : x));
  const addTech = id => { const t = prompt("Tambah teknologi:"); if (t) setProjects(p => p.map(x => x.id === id ? { ...x, tech: [...x.tech, t] } : x)); };
  const rename  = (id, v) => setProjects(p => p.map(x => x.id === id ? { ...x, name: v } : x));

  return (
    <div style={css.module}>
      <ModuleHead label="daftar proyek" action={<TbBtn onClick={add}>+ tambah</TbBtn>} />
      <div>
        {projects.map(p => (
          <div key={p.id} style={{ ...css.projRow }} onMouseEnter={e => e.currentTarget.style.background = INK3} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <span style={{ fontFamily: MONO, fontSize: 10, color: GOLD, minWidth: 22 }}>{p.num}</span>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <input
                value={p.name}
                onChange={e => rename(p.id, e.target.value)}
                style={{ background: "transparent", border: "none", borderBottom: `1px solid transparent`, color: TEXT, fontSize: 13, fontFamily: "inherit", outline: "none", width: "100%", transition: "border-color 0.12s" }}
                onFocus={e => e.target.style.borderBottomColor = WIRE2}
                onBlur={e => e.target.style.borderBottomColor = "transparent"}
              />
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 4 }}>
                {p.tech.map(t => (
                  <span key={t} style={{ fontSize: 9, padding: "1px 6px", borderRadius: 1, background: INK2, border: `1px solid ${WIRE}`, color: TEXT3, fontFamily: MONO }}>{t}</span>
                ))}
                <span onClick={() => addTech(p.id)} style={{ fontSize: 9, padding: "1px 6px", borderRadius: 1, background: AQUAD, border: `1px solid ${AQUAD}`, color: AQUA, fontFamily: MONO, cursor: "pointer" }}>+</span>
              </div>
            </div>
            <span style={{ fontFamily: MONO, fontSize: 10, color: TEXT3, minWidth: 36 }}>{p.year}</span>
            <div
              onClick={() => feat(p.id)}
              title={p.feat ? "featured" : "jadikan featured"}
              style={{ width: 6, height: 6, borderRadius: "50%", background: p.feat ? GOLD : GOLDD, border: `1px solid ${p.feat ? GOLD : WIRE2}`, cursor: "pointer", flexShrink: 0 }}
            />
            <div
              onClick={() => del(p.id)}
              style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid transparent`, borderRadius: 2, cursor: "pointer", color: TEXT3, fontSize: 13, transition: "all 0.12s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = WIRE2; e.currentTarget.style.color = "#e05555"; e.currentTarget.style.background = "rgba(224,85,85,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.color = TEXT3; e.currentTarget.style.background = "transparent"; }}
            >
              ×
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PanelPlaylist() {
  const { playlist, isPlaying, currentTrackIndex, addToPlaylist, removeFromPlaylist, reorderPlaylist, setCurrentTrackIndex, isLoop, isShuffle, isRepeatOne, toggleLoop, toggleShuffle, toggleRepeatOne } = useAudio();
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);
  const fileRef = useRef();

  const processFiles = (files) => {
    Array.from(files).filter(f => f.type.startsWith("audio/")).forEach(f => {
      const url = URL.createObjectURL(f);
      const raw = f.name.replace(/\.[^/.]+$/, "");
      const parts = raw.split(" - ");
      addToPlaylist({ title: parts.length > 1 ? parts.slice(1).join(" - ") : raw, artist: parts.length > 1 ? parts[0] : "Unknown Artist", src: url });
    });
  };

  const ModeBtn = ({ active, onClick, label }) => (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 5, padding: "5px 12px",
      fontSize: 11, fontFamily: MONO, background: active ? AQUAD : INK,
      border: `1px solid ${active ? AQUA : WIRE}`, color: active ? AQUA : TEXT3,
      borderRadius: 2, cursor: "pointer", letterSpacing: "0.04em", transition: "all 0.12s",
    }}>{label}</button>
  );

  return (
    <>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        <ModeBtn active={isLoop}      onClick={toggleLoop}      label="loop" />
        <ModeBtn active={isShuffle}   onClick={toggleShuffle}   label="shuffle" />
        <ModeBtn active={isRepeatOne} onClick={toggleRepeatOne} label="repeat 1" />
      </div>

      <div
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); processFiles(e.dataTransfer.files); }}
        onClick={() => fileRef.current?.click()}
        style={{
          border: `1px dashed ${WIRE2}`, padding: 24, textAlign: "center",
          cursor: "pointer", borderRadius: 2, background: INK, marginBottom: 12,
          transition: "all 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = AQUA; e.currentTarget.style.background = AQUAD; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = WIRE2; e.currentTarget.style.background = INK; }}
      >
        <div style={{ fontSize: 11, fontFamily: MONO, color: TEXT2, marginBottom: 4 }}>drag & drop file audio ke sini</div>
        <div style={{ fontSize: 10, fontFamily: MONO, color: TEXT3 }}>mp3 / wav / ogg / flac — atau klik untuk pilih</div>
      </div>
      <input ref={fileRef} type="file" accept="audio/*" multiple style={{ display: "none" }} onChange={e => processFiles(e.target.files)} />

      <div>
        {playlist.length === 0 && (
          <div style={{ textAlign: "center", padding: 28, color: TEXT3, fontFamily: MONO, fontSize: 11 }}>belum ada lagu. drag file audio di atas.</div>
        )}
        {playlist.map((t, i) => (
          <div
            key={i}
            draggable
            onDragStart={() => setDragIdx(i)}
            onDragOver={e => { e.preventDefault(); setOverIdx(i); }}
            onDrop={e => { e.preventDefault(); if (dragIdx !== null && dragIdx !== i) reorderPlaylist(dragIdx, i); setDragIdx(null); setOverIdx(null); }}
            onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
            style={{
              ...css.trackRow,
              opacity: dragIdx === i ? 0.35 : 1,
              borderColor: overIdx === i && dragIdx !== i ? AQUA : WIRE,
            }}
          >
            <span style={{ fontFamily: MONO, fontSize: 12, color: TEXT3 }}>⠿</span>
            <span style={{ fontFamily: MONO, fontSize: 10, color: TEXT3, minWidth: 22 }}>{String(i + 1).padStart(2, "0")}</span>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ fontSize: 12, color: i === currentTrackIndex ? GOLD2 : TEXT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {t.title}
                {!t.src.startsWith("/") && <span style={{ fontSize: 9, color: AQUA, fontFamily: MONO, marginLeft: 6 }}>local</span>}
              </div>
              <div style={{ fontSize: 10, color: TEXT3, fontFamily: MONO, marginTop: 2 }}>{t.artist}</div>
            </div>
            <div style={{ display: "flex", gap: 3 }}>
              <div
                onClick={() => setCurrentTrackIndex(i)}
                style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 2, cursor: "pointer", color: i === currentTrackIndex ? GOLD : TEXT3, fontSize: 12, border: `1px solid transparent`, transition: "all 0.12s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = WIRE2; e.currentTarget.style.background = INK2; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.background = "transparent"; }}
              >{i === currentTrackIndex && isPlaying ? "▶" : "▷"}</div>
              <div
                onClick={() => removeFromPlaylist(i)}
                style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 2, cursor: "pointer", color: TEXT3, fontSize: 13, border: `1px solid transparent`, transition: "all 0.12s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = WIRE2; e.currentTarget.style.color = "#e05555"; e.currentTarget.style.background = "rgba(224,85,85,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.color = TEXT3; e.currentTarget.style.background = "transparent"; }}
              >×</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function PanelPlayer() {
  const [opts, setOpts] = useState({ volume: true, progress: true, artist: true, autoCollapse: false });
  const [discSize, setDiscSize] = useState(72);
  const [colors, setColors] = useState({ bg: "#2a2218", discBorder: "#dcae1d", playBtn: "#dcae1d" });

  return (
    <>
      <div style={css.module}>
        <ModuleHead label="posisi player" />
        <div style={{ ...css.mBody, ...css.fieldGrid }}>
          <Field label="HORIZONTAL"><select style={css.select}><option>kanan</option><option>kiri</option></select></Field>
          <Field label="VERTIKAL"><select style={css.select}><option>bawah</option><option>atas</option></select></Field>
        </div>
      </div>
      <div style={css.module}>
        <ModuleHead label="ukuran disc" />
        <div style={css.mBody}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ ...css.flabel, minWidth: 80, marginBottom: 0 }}>diameter</span>
            <input type="range" min={48} max={120} step={4} value={discSize} onChange={e => setDiscSize(+e.target.value)} style={{ flex: 1, accentColor: GOLD }} />
            <span style={{ fontFamily: MONO, fontSize: 11, color: GOLD, minWidth: 40 }}>{discSize}px</span>
          </div>
        </div>
      </div>
      <div style={css.module}>
        <ModuleHead label="opsi tampilan" />
        <div style={css.mBody}>
          <ToggleRow label="volume slider"            checked={opts.volume}       onChange={v => setOpts(o => ({ ...o, volume: v }))} />
          <ToggleRow label="progress bar"             checked={opts.progress}     onChange={v => setOpts(o => ({ ...o, progress: v }))} />
          <ToggleRow label="nama artis"               checked={opts.artist}       onChange={v => setOpts(o => ({ ...o, artist: v }))} />
          <ToggleRow label="auto-collapse 5 detik"    checked={opts.autoCollapse} onChange={v => setOpts(o => ({ ...o, autoCollapse: v }))} />
        </div>
      </div>
      <div style={css.module}>
        <ModuleHead label="warna player" />
        <div style={css.mBody}>
          <ColorRow label="background player"  value={colors.bg}         onChange={v => setColors(c => ({ ...c, bg: v }))} />
          <ColorRow label="warna disc border"  value={colors.discBorder} onChange={v => setColors(c => ({ ...c, discBorder: v }))} />
          <ColorRow label="warna tombol play"  value={colors.playBtn}    onChange={v => setColors(c => ({ ...c, playBtn: v }))} />
        </div>
      </div>
    </>
  );
}

// ── Main Admin Panel ──────────────────────────────────────────────────────────

const PANELS = ["theme", "sections", "profile", "projects", "playlist", "player"];
const PANEL_LABELS = { theme: "tema & warna", sections: "seksi tampilan", profile: "profil", projects: "proyek", playlist: "playlist", player: "player ui" };

export default function AdminPanel() {
  const { playlist } = useAudio();
  const [active, setActive] = useState("theme");
  const [theme, setTheme] = useState({ bgPrimary: "#f4ebd0", bgSecondary: "#ede4c8", accentGold: "#dcae1d", accentRed: "#7a3b2e", textPrimary: "#1a1817" });
  const [statusMsg, setStatusMsg] = useState("perubahan belum disimpan");
  const [statusChanged, setStatusChanged] = useState(true);
  const [ts, setTs] = useState("");

  const [tick, setTick] = useState(0);

  const buildConfig = () => ({ theme, copyrightYear: new Date().getFullYear() });

  const save = () => {
    try { localStorage.setItem("vinyl-cfg", JSON.stringify(buildConfig())); } catch {}
    const n = new Date();
    setTs(`${String(n.getHours()).padStart(2,"0")}:${String(n.getMinutes()).padStart(2,"0")}:${String(n.getSeconds()).padStart(2,"0")}`);
    setStatusMsg("tersimpan");
    setStatusChanged(false);
  };

  const exportCfg = () => {
    const blob = new Blob([JSON.stringify(buildConfig(), null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "retro-vinyl-config.json"; a.click();
  };

  const pulseStyle = {
    display: "inline-block", width: 5, height: 5, borderRadius: "50%",
    background: AQUA, marginRight: 6,
    animation: "pulse 2s ease-in-out infinite",
  };

  return (
    <div style={{ padding: "1rem 0" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
      <div style={css.shell}>
        {/* Sidebar */}
        <div style={css.rail}>
          <div style={css.railHead}>
            <div style={css.sysId}><span style={pulseStyle} />VINYL·OS v2.4</div>
            <div style={css.sysSub}>CONTROL INTERFACE</div>
          </div>
          <div style={css.secLbl}>// content</div>
          {["theme","sections","profile","projects"].map(k => (
            <NavItem key={k} label={PANEL_LABELS[k]} active={active === k} onClick={() => setActive(k)}
              tag={k === "projects" ? 4 : undefined}
              icon={<span style={{ fontSize: 13, color: "inherit" }}>{["theme","sections","profile","projects"].indexOf(k) === 0 ? "⬡" : ["theme","sections","profile","projects"].indexOf(k) === 1 ? "⊟" : ["theme","sections","profile","projects"].indexOf(k) === 2 ? "◎" : "⌗"}</span>}
            />
          ))}
          <div style={css.secLbl}>// audio</div>
          {["playlist","player"].map(k => (
            <NavItem key={k} label={PANEL_LABELS[k]} active={active === k} onClick={() => setActive(k)}
              tag={k === "playlist" ? playlist.length : undefined}
              icon={<span style={{ fontSize: 13, color: "inherit" }}>{k === "playlist" ? "♫" : "⊙"}</span>}
            />
          ))}
        </div>

        {/* Workspace */}
        <div style={css.ws}>
          <div style={css.topbar}>
            <span style={css.bc}>vinyl-os / <span style={{ color: GOLD }}>{active}</span></span>
            <div style={{ display: "flex", gap: 6 }}>
              <TbBtn onClick={exportCfg}>↓ export</TbBtn>
              <TbBtn onClick={save} accent>⊕ commit</TbBtn>
            </div>
          </div>

          <div style={css.main}>
            {active === "theme"    && <PanelTheme theme={theme} onChange={setTheme} />}
            {active === "sections" && <PanelSections />}
            {active === "profile"  && <PanelProfile />}
            {active === "projects" && <PanelProjects />}
            {active === "playlist" && <PanelPlaylist />}
            {active === "player"   && <PanelPlayer />}
          </div>

          <div style={css.statusbar}>
            <span style={{ fontFamily: MONO, fontSize: 10, color: statusChanged ? "#c8962a" : TEXT3 }}>
              // {statusMsg}
            </span>
            <span style={{ fontFamily: MONO, fontSize: 10, color: TEXT3 }}>{ts}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
