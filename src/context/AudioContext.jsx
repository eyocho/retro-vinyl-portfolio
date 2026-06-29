import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { TRACKS } from "../data/tracks";

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying]               = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolumeState]                = useState(0.7);
  const [isMuted, setIsMuted]                   = useState(false);
  const [currentTime, setCurrentTime]           = useState(0);
  const [duration, setDuration]                 = useState(0);
  const [isLoading, setIsLoading]               = useState(false);
  const [isLoop, setIsLoop]                     = useState(false);
  const [isShuffle, setIsShuffle]               = useState(false);
  const [isRepeatOne, setIsRepeatOne]           = useState(false);
  const [playlist, setPlaylist]                 = useState(TRACKS);

  const currentTrack = playlist[currentTrackIndex] ?? playlist[0];

  const getNextIndex = useCallback((currentIdx, shuffleMode, loopMode, total) => {
    if (shuffleMode) {
      let next;
      do { next = Math.floor(Math.random() * total); } while (next === currentIdx && total > 1);
      return next;
    }
    const next = currentIdx + 1;
    if (next >= total) return loopMode ? 0 : null;
    return next;
  }, []);

  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audio.preload = "metadata";
    audioRef.current = audio;

    const onTimeUpdate    = () => setCurrentTime(audio.currentTime);
    const onMeta          = () => { setDuration(audio.duration); setIsLoading(false); };
    const onWaiting       = () => setIsLoading(true);
    const onCanPlay       = () => setIsLoading(false);
    const onError         = () => { setIsLoading(false); setIsPlaying(false); };

    audio.addEventListener("timeupdate",      onTimeUpdate);
    audio.addEventListener("loadedmetadata",  onMeta);
    audio.addEventListener("waiting",         onWaiting);
    audio.addEventListener("canplay",         onCanPlay);
    audio.addEventListener("error",           onError);

    return () => {
      audio.removeEventListener("timeupdate",     onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("waiting",        onWaiting);
      audio.removeEventListener("canplay",        onCanPlay);
      audio.removeEventListener("error",          onError);
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Handle track end — respects repeat-one, shuffle, loop
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      if (isRepeatOne) {
        audio.currentTime = 0;
        audio.play().catch(() => setIsPlaying(false));
        return;
      }
      const next = getNextIndex(currentTrackIndex, isShuffle, isLoop, playlist.length);
      if (next === null) { setIsPlaying(false); return; }
      setCurrentTrackIndex(next);
    };

    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, [isRepeatOne, isShuffle, isLoop, currentTrackIndex, playlist.length, getNextIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    setIsLoading(true);
    setCurrentTime(0);
    setDuration(0);
    audio.src = currentTrack.src;
    audio.load();
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.src || audio.src === window.location.href) {
      audio.src = currentTrack.src;
      audio.load();
    }
    if (isPlaying) {
      audio.pause(); setIsPlaying(false);
    } else {
      try { await audio.play(); setIsPlaying(true); }
      catch { setIsPlaying(false); }
    }
  }, [isPlaying, currentTrack]);

  const handleNextTrack = useCallback(() => {
    const next = getNextIndex(currentTrackIndex, isShuffle, isLoop, playlist.length);
    if (next !== null) setCurrentTrackIndex(next);
  }, [currentTrackIndex, isShuffle, isLoop, playlist.length, getNextIndex]);

  const handlePrevTrack = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.currentTime > 3) { audio.currentTime = 0; setCurrentTime(0); }
    else {
      const prev = (currentTrackIndex - 1 + playlist.length) % playlist.length;
      setCurrentTrackIndex(prev);
    }
  }, [currentTrackIndex, playlist.length]);

  const handleSeek          = useCallback((t) => { const a = audioRef.current; if (a) { a.currentTime = t; setCurrentTime(t); } }, []);
  const handleVolumeChange  = useCallback((v) => { const c = Math.min(Math.max(v, 0), 1); setVolumeState(c); if (isMuted && c > 0) setIsMuted(false); }, [isMuted]);
  const toggleMute          = useCallback(() => setIsMuted(p => !p), []);
  const toggleLoop          = useCallback(() => setIsLoop(p => !p), []);
  const toggleShuffle       = useCallback(() => setIsShuffle(p => !p), []);
  const toggleRepeatOne     = useCallback(() => setIsRepeatOne(p => !p), []);

  const playAndScroll = useCallback(async (targetId = "about") => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.src || audio.src === window.location.href) { audio.src = currentTrack.src; audio.load(); }
    try { await audio.play(); setIsPlaying(true); } catch {}
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentTrack]);

  const addToPlaylist = useCallback((track) => {
    setPlaylist(prev => [...prev, track]);
  }, []);

  const removeFromPlaylist = useCallback((index) => {
    setPlaylist(prev => {
      const next = prev.filter((_, i) => i !== index);
      if (currentTrackIndex >= next.length) setCurrentTrackIndex(Math.max(0, next.length - 1));
      return next;
    });
  }, [currentTrackIndex]);

  const reorderPlaylist = useCallback((from, to) => {
    setPlaylist(prev => {
      const arr = [...prev];
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      if (currentTrackIndex === from) setCurrentTrackIndex(to);
      return arr;
    });
  }, [currentTrackIndex]);

  const contextValue = {
    isPlaying, currentTrack, currentTrackIndex, volume, isMuted,
    currentTime, duration, isLoading, playlist,
    isLoop, isShuffle, isRepeatOne,
    togglePlay, handleNextTrack, handlePrevTrack, handleSeek,
    handleVolumeChange, toggleMute, toggleLoop, toggleShuffle, toggleRepeatOne,
    playAndScroll, addToPlaylist, removeFromPlaylist, reorderPlaylist,
    setCurrentTrackIndex,
  };

  return <AudioContext.Provider value={contextValue}>{children}</AudioContext.Provider>;
}

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio() harus digunakan di dalam <AudioProvider>.");
  return ctx;
}

export default AudioContext;
