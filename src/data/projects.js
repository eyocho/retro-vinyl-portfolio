export const PROJECTS = [
  {
    id: 1,
    trackNumber: "01",
    title: "E-Commerce Platform",
    genre: ["React", "Node.js", "MongoDB"],
    year: "2024",
    duration: "3:42",
    description:
      "Platform belanja online full-stack dengan fitur autentikasi JWT, keranjang belanja real-time, payment gateway Midtrans, dan dashboard admin. Dioptimalkan untuk mobile-first experience.",
    role: "Full Stack Developer",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    highlight: true,
  },
  {
    id: 2,
    trackNumber: "02",
    title: "Dashboard Analytics",
    genre: ["React", "TypeScript", "D3.js"],
    year: "2024",
    duration: "4:18",
    description:
      "Dashboard visualisasi data interaktif untuk monitoring KPI bisnis. Menampilkan grafik real-time, heatmap, dan laporan otomatis dengan export PDF.",
    role: "Frontend Developer",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    highlight: false,
  },
  {
    id: 3,
    trackNumber: "03",
    title: "Mobile Banking App",
    genre: ["React Native", "Firebase"],
    year: "2023",
    duration: "5:07",
    description:
      "Aplikasi perbankan mobile dengan fitur transfer, top-up, riwayat transaksi, dan notifikasi push. Keamanan berlapis dengan biometric authentication.",
    role: "Mobile Developer",
    liveUrl: null,
    githubUrl: "https://github.com",
    highlight: false,
  },
  {
    id: 4,
    trackNumber: "04",
    title: "AI Content Generator",
    genre: ["Next.js", "OpenAI", "Tailwind"],
    year: "2023",
    duration: "2:55",
    description:
      "Tool generasi konten berbasis AI untuk membantu content creator menulis artikel, caption media sosial, dan script video secara otomatis.",
    role: "Full Stack Developer",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    highlight: true,
  },
  {
    id: 5,
    trackNumber: "05",
    title: "Real-time Chat App",
    genre: ["React", "Socket.io", "Node.js"],
    year: "2023",
    duration: "3:21",
    description:
      "Aplikasi chat real-time dengan fitur room, direct message, berbagi file, dan indikator typing. Mendukung 1000+ concurrent users.",
    role: "Backend Developer",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    highlight: false,
  },
];

/** Semua genre unik untuk filter */
export const ALL_GENRES = [
  "All",
  ...new Set(PROJECTS.flatMap((p) => p.genre)),
];
