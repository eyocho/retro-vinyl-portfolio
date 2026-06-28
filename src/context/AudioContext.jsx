/**
 * AUDIOCONTEXT.JSX — Global Audio State Management
 * ─────────────────────────────────────────────────────────────────────────────
 * Ini adalah "mixer room" dari seluruh aplikasi. Semua state yang berhubungan
 * dengan audio dikelola di sini agar:
 *
 * 1. Musik TIDAK ter-restart saat pengguna scroll atau komponen re-render
 * 2. Semua komponen (VinylPlayer, Hero, Navbar) bisa mengontrol audio
 *    yang SAMA tanpa prop drilling
 * 3. Satu sumber kebenaran (single source of truth) untuk status play/pause
 *
 * ARSITEKTUR:
 * ┌─────────────────────────────────────────────────────┐
 * │  AudioProvider (membungkus seluruh App)              │
 * │  ├── useRef: audioRef → instance HTMLAudioElement    │
 * │  │   (TIDAK di-state, agar tidak trigger re-render)  │
 * │  └── useState: isPlaying, currentTrack, volume,      │
 * │                currentTime, duration, isMuted        │
 * └─────────────────────────────────────────────────────┘
 *
 * Kenapa useRef untuk Audio?
 * HTMLAudioElement adalah mutable object. Jika kita simpan di useState,
 * setiap perubahan property (currentTime, dll.) akan menyebabkan re-render
 * yang tidak perlu dan berpotensi menghentikan pemutaran audio.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { TRACKS } from "../data/tracks";

// ─── 1. Buat Context ───────────────────────────────────────────────────────
// Nilai default null — komponen HARUS dibungkus AudioProvider untuk berfungsi
const AudioContext = createContext(null);

// ─── 2. Provider Component ────────────────────────────────────────────────
export function AudioProvider({ children }) {
  /**
   * audioRef: Referensi langsung ke HTMLAudioElement
   * Tidak ada nilai awal — kita instansiasi di dalam useEffect
   * untuk memastikan DOM sudah siap (penting untuk SSR compatibility)
   */
  const audioRef = useRef(null);

  // ── State Utama ──────────────────────────────────────────────────────────
  const [isPlaying, setIsPlaying]         = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolumeState]          = useState(0.7);   // 0.0 – 1.0
  const [isMuted, setIsMuted]             = useState(false);
  const [currentTime, setCurrentTime]     = useState(0);     // detik
  const [duration, setDuration]           = useState(0);     // detik
  const [isLoading, setIsLoading]         = useState(false); // buffer state

  // Track aktif saat ini (objek dari array TRACKS)
  const currentTrack = TRACKS[currentTrackIndex];

  // ── Inisialisasi Audio Element ────────────────────────────────────────────
  useEffect(() => {
    /**
     * Buat HTMLAudioElement secara programatik, bukan lewat JSX <audio>.
     * Ini memastikan elemen audio tetap hidup selama seluruh siklus hidup app,
     * tidak tergantung render cycle React.
     */
    const audio = new Audio();
    audio.volume = volume;
    audio.preload = "metadata"; // Muat metadata (durasi) tapi belum audionya

    audioRef.current = audio;

    // ── Event Listeners ──────────────────────────────────────────────────
    // Dipanggil setiap ~250ms saat audio sedang dimainkan
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    // Dipanggil saat metadata audio (durasi, dll.) sudah tersedia
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    // Dipanggil saat audio selesai dimainkan (auto-next track)
    const handleEnded = () => {
      handleNextTrack();
    };

    // Dipanggil saat audio sedang buffer/loading
    const handleWaiting = () => {
      setIsLoading(true);
    };

    // Dipanggil saat audio sudah siap dimainkan lagi setelah buffer
    const handleCanPlay = () => {
      setIsLoading(false);
    };

    // Dipanggil jika terjadi error (file tidak ditemukan, dll.)
    const handleError = (e) => {
      console.warn("Audio Error:", e.target.error);
      // Coba lanjut ke track berikutnya jika ada error
      setIsLoading(false);
      setIsPlaying(false);
    };

    // Daftarkan semua event listener
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);

    // ── Cleanup ──────────────────────────────────────────────────────────
    // Saat component unmount (biasanya tidak terjadi, tapi best practice)
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
      audio.pause();
      audio.src = ""; // Bebaskan resource memori
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Hanya run sekali saat mount

  // ── Efek: Ganti Src Saat Track Berubah ───────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setIsLoading(true);
    setCurrentTime(0);
    setDuration(0);

    // Ganti sumber audio ke track baru
    audio.src = currentTrack.src;

    // Muat metadata track baru
    audio.load();

    /**
     * Jika sedang playing saat ganti track, langsung putar yang baru.
     * Penting: audio.play() mengembalikan Promise, tangani rejection-nya
     * (bisa terjadi di browser yang belum ada interaksi user)
     */
    if (isPlaying) {
      audio.play().catch((err) => {
        console.warn("Autoplay blocked:", err);
        setIsPlaying(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex]); // Hanya trigger saat index berubah, bukan isPlaying

  // ── Efek: Sync Volume ─────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    // Jika muted, set volume ke 0 tanpa mengubah state volume
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // ─── Fungsi Kontrol ──────────────────────────────────────────────────────

  /**
   * togglePlay: Tombol Play/Pause utama
   * Menggunakan audio.play() dan audio.pause() dari Web Audio API
   */
  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    // Jika belum ada src (pertama kali), muat track pertama dulu
    if (!audio.src || audio.src === window.location.href) {
      audio.src = currentTrack.src;
      audio.load();
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        /**
         * Browser Modern Policy: audio.play() bisa diblokir jika tidak ada
         * interaksi user sebelumnya (autoplay policy).
         * Ini normal — user harus klik tombol play manual pertama kali.
         */
        console.warn("Play failed (autoplay policy):", err.message);
        setIsPlaying(false);
      }
    }
  }, [isPlaying, currentTrack]);

  /**
   * handleNextTrack: Maju ke lagu berikutnya
   * Loop kembali ke track pertama jika sudah di akhir playlist
   */
  const handleNextTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  }, []);

  /**
   * handlePrevTrack: Kembali ke lagu sebelumnya
   * Jika posisi > 3 detik, restart lagu saat ini dulu (behavior seperti Spotify)
   */
  const handlePrevTrack = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.currentTime > 3) {
      // Restart lagu saat ini
      audio.currentTime = 0;
      setCurrentTime(0);
    } else {
      // Kembali ke track sebelumnya (loop ke akhir jika di track pertama)
      setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    }
  }, []);

  /**
   * handleSeek: Klik/drag progress bar untuk seek ke posisi tertentu
   * @param {number} newTime - Waktu target dalam detik
   */
  const handleSeek = useCallback((newTime) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  }, []);

  /**
   * handleVolumeChange: Ubah volume via slider
   * @param {number} newVolume - Nilai 0.0 – 1.0
   */
  const handleVolumeChange = useCallback((newVolume) => {
    const clampedVolume = Math.min(Math.max(newVolume, 0), 1);
    setVolumeState(clampedVolume);
    if (isMuted && clampedVolume > 0) {
      setIsMuted(false); // Auto un-mute saat geser volume ke atas
    }
  }, [isMuted]);

  /**
   * toggleMute: Mute/unmute tanpa mengubah nilai slider volume
   */
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  /**
   * playAndScroll: Dipanggil oleh tombol "Drop the Needle" di Hero section
   * Memulai pemutaran DAN scroll ke bagian selanjutnya
   * @param {string} targetId - ID elemen HTML yang dituju scroll
   */
  const playAndScroll = useCallback(async (targetId = "about") => {
    const audio = audioRef.current;
    if (!audio) return;

    // Muat track jika belum
    if (!audio.src || audio.src === window.location.href) {
      audio.src = currentTrack.src;
      audio.load();
    }

    // Mulai putar
    try {
      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      console.warn("Play blocked:", err.message);
    }

    // Scroll ke target section dengan smooth behavior
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentTrack]);

  // ─── Value yang Di-expose ke Seluruh App ──────────────────────────────────
  const contextValue = {
    // State
    isPlaying,
    currentTrack,
    currentTrackIndex,
    volume,
    isMuted,
    currentTime,
    duration,
    isLoading,
    tracks: TRACKS,

    // Actions
    togglePlay,
    handleNextTrack,
    handlePrevTrack,
    handleSeek,
    handleVolumeChange,
    toggleMute,
    playAndScroll,
  };

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
}

// ─── 3. Custom Hook untuk Konsumsi Context ───────────────────────────────────
/**
 * useAudio — Hook untuk mengakses AudioContext
 *
 * Penggunaan di komponen mana pun:
 * ```jsx
 * import { useAudio } from '../context/AudioContext';
 *
 * function MyComponent() {
 *   const { isPlaying, togglePlay, currentTrack } = useAudio();
 *   ...
 * }
 * ```
 *
 * Akan throw error jika digunakan di luar AudioProvider —
 * ini membantu debugging lebih cepat.
 */
export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error(
      "useAudio() harus digunakan di dalam <AudioProvider>.\n" +
      "Pastikan AudioProvider membungkus komponen di App.jsx."
    );
  }
  return context;
}

export default AudioContext;
