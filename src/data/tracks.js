/**
 * TRACKS.JS — The Playlist / Setlist
 * ─────────────────────────────────────────────────────────────────────────────
 * Letakkan file .mp3 Anda di /public/audio/
 * Sumber audio gratis royalty-free: pixabay.com/music (filter "jazz" / "lo-fi")
 *
 * Cara menambah lagu:
 * 1. Taruh file .mp3 ke folder /public/audio/
 * 2. Tambah objek baru ke array TRACKS di bawah
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const TRACKS = [
  {
    id: 1,
    title: "Midnight at the Studio",
    artist: "Lo-Fi Collective",
    // Path relatif dari /public — Vite menyajikannya sebagai aset statis
    src: "/audio/track-01.mp3",
    // Durasi dalam detik (opsional, diisi otomatis saat audio load)
    duration: 0,
  },
  {
    id: 2,
    title: "Warm Vinyl Nights",
    artist: "Jazz Attic Sessions",
    src: "/audio/track-02.mp3",
    duration: 0,
  },
  {
    id: 3,
    title: "Analog Dreams",
    artist: "The Groove Engineers",
    src: "/audio/track-03.mp3",
    duration: 0,
  },
];

/** Durasi fallback jika metadata audio belum terbaca */
export const DEFAULT_DURATION = 180; // 3 menit dalam detik
