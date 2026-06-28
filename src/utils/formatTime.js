/**
 * FORMATTIME.JS — Audio Time Formatter
 * ─────────────────────────────────────────────────────────────────────────────
 * Mengubah detik mentah dari HTML5 Audio API menjadi format "menit:detik"
 * yang terbaca manusia.
 *
 * Contoh:
 *   formatTime(75)    → "1:15"
 *   formatTime(3661)  → "61:01"
 *   formatTime(NaN)   → "0:00"
 * ─────────────────────────────────────────────────────────────────────────────
 */

export function formatTime(seconds) {
  // Guard: jika nilai bukan angka valid (misal saat audio belum load)
  if (!seconds || isNaN(seconds) || !isFinite(seconds)) return "0:00";

  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  // Pad detik dengan leading zero: 3 → "03"
  const paddedSeconds = remainingSeconds.toString().padStart(2, "0");

  return `${minutes}:${paddedSeconds}`;
}

/**
 * Menghitung persentase progress untuk progress bar
 * @param {number} currentTime - Posisi pemutaran saat ini (detik)
 * @param {number} duration - Total durasi lagu (detik)
 * @returns {number} Persentase 0–100
 */
export function getProgressPercent(currentTime, duration) {
  if (!duration || duration === 0) return 0;
  return Math.min((currentTime / duration) * 100, 100);
}
