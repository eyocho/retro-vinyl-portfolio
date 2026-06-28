/**
 * APP.JSX — Root Component & Penggabungan Semua Seksi
 * ─────────────────────────────────────────────────────────────────────────────
 * Ini adalah "master tape" — tempat semua track/komponen digabung jadi
 * satu album utuh.
 *
 * STRUKTUR RENDER:
 * <AudioProvider>          ← Membungkus SEMUA agar context tersedia
 *   <VinylPlayer />        ← Floating widget, selalu tampil
 *   <main>
 *     <Hero />             ← Album Cover + CTA "Drop the Needle"
 *     <About />            ← Liner Notes / Artist Biography
 *     <Skills />           ← Audio Mixer / Equalizer
 *     <Projects />         ← Discography / Tracklist
 *     <Contact />          ← Booking Sheet
 *   </main>
 * </AudioProvider>
 *
 * KENAPA AudioProvider di sini (bukan di main.jsx)?
 * Agar App.jsx sendiri tidak bisa mengakses audio context (tidak perlu).
 * Semua komponen anak bisa akses via useAudio() hook.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { AudioProvider } from "./context/AudioContext";
import VinylPlayer from "./components/layout/VinylPlayer";

// ─── Section Placeholders ─────────────────────────────────────────────────────
// Ganti import ini dengan komponen nyata di Langkah 4 nanti
import HeroSection from "./components/sections/Hero";
import AboutSection from "./components/sections/About";
import SkillsSection from "./components/sections/Skills";
import ProjectsSection from "./components/sections/Projects";
import ContactSection from "./components/sections/Contact";

export default function App() {
  return (
    <AudioProvider>
      {/*
       * AudioProvider membungkus SELURUH tree komponen.
       * Ini memastikan VinylPlayer dan semua section bisa
       * berkomunikasi satu sama lain via useAudio().
       */}

      {/* ── Floating Vinyl Player — selalu tampil di pojok kanan bawah ── */}
      <VinylPlayer />

      {/* ── Konten Utama ── */}
      <main
        className="min-h-screen"
        style={{ backgroundColor: "#f4ebd0", color: "#1a1817" }}
      >
        {/* Setiap section punya id untuk scrollIntoView dari Hero */}
        <section id="hero">
          <HeroSection />
        </section>

        <section id="about">
          <AboutSection />
        </section>

        <section id="skills">
          <SkillsSection />
        </section>

        <section id="projects">
          <ProjectsSection />
        </section>

        <section id="contact">
          <ContactSection />
        </section>
      </main>
    </AudioProvider>
  );
}
