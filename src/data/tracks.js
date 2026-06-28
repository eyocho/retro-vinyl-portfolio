// ⚠️ File ini sekarang hanya re-export dari JSON agar kompatibel mundur.
// Edit data melalui Admin Panel di /admin
import tracksData from "./tracks.json";

export const TRACKS = tracksData.tracks;
export const DEFAULT_DURATION = tracksData.defaultDuration || 180;
