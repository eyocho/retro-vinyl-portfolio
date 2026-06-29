import { useState, useEffect } from "react";
import { AudioProvider } from "./context/AudioContext";
import VinylPlayer from "./components/layout/VinylPlayer";
import HeroSection from "./components/sections/Hero";
import AboutSection from "./components/sections/About";
import SkillsSection from "./components/sections/Skills";
import ProjectsSection from "./components/sections/Projects";
import ContactSection from "./components/sections/Contact";
import AdminPanel from "./pages/AdminPanel";

function AdminRoute({ children }) {
  const isAdmin = window.location.pathname === "/admin" ||
                  window.location.hash   === "#/admin";
  return isAdmin ? <AdminPanel /> : children;
}

export default function App() {
  return (
    <AudioProvider>
      <AdminRoute>
        <VinylPlayer />
        <main className="min-h-screen" style={{ backgroundColor: "#f4ebd0", color: "#1a1817" }}>
          <section id="hero"><HeroSection /></section>
          <section id="about"><AboutSection /></section>
          <section id="skills"><SkillsSection /></section>
          <section id="projects"><ProjectsSection /></section>
          <section id="contact"><ContactSection /></section>
        </main>
      </AdminRoute>
    </AudioProvider>
  );
}
