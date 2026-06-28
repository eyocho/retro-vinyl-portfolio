// ⚠️ File ini sekarang hanya re-export dari JSON agar kompatibel mundur.
// Edit data melalui Admin Panel di /admin
import projectsData from "./projects.json";

export const PROJECTS = projectsData.projects;

export const ALL_GENRES = [
  "All",
  ...new Set(PROJECTS.flatMap((p) => p.genre)),
];
