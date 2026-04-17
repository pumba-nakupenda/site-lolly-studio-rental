"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface VideoPlayerProps {
  src: string;
  caption?: string;
  poster?: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function VideoPlayer({ src, caption, poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [buffered, setBuffered] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
      setHasStarted(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  }, []);

  function handleProgressClick(e: React.MouseEvent<HTMLDivElement>) {
    const v = videoRef.current;
    const bar = progressRef.current;
    if (!v || !bar) return;
    const rect = bar.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    v.currentTime = x * v.duration;
  }

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = videoRef.current;
    if (!v) return;
    const val = parseFloat(e.target.value);
    v.volume = val;
    setVolume(val);
    if (val === 0) { v.muted = true; setMuted(true); }
    else if (v.muted) { v.muted = false; setMuted(false); }
  }

  function resetHideTimer() {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (playing) {
      hideTimer.current = setTimeout(() => setShowControls(false), 2500);
    }
  }

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setCurrentTime(v.currentTime);
    const onDuration = () => setDuration(v.duration);
    const onEnded = () => { setPlaying(false); setHasStarted(false); };
    const onProgress = () => {
      if (v.buffered.length > 0) setBuffered((v.buffered.end(v.buffered.length - 1) / v.duration) * 100);
    };
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onDuration);
    v.addEventListener("ended", onEnded);
    v.addEventListener("progress", onProgress);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onDuration);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("progress", onProgress);
    };
  }, []);

  useEffect(() => {
    const onFs = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  return (
    <div className="space-y-0">
      <div
        ref={containerRef}
        className="relative bg-[#0a0a0a] overflow-hidden cursor-pointer"
        onMouseMove={resetHideTimer}
        onMouseLeave={() => playing && setShowControls(false)}
        onClick={hasStarted ? togglePlay : undefined}
      >
        {/* Video */}
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className="w-full aspect-video"
          playsInline
          preload="metadata"
        />

        {/* Initial play — minimal circle */}
        {!hasStarted && (
          <button
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            className="absolute inset-0 flex items-center justify-center group/play"
          >
            <div className="w-16 h-16 rounded-full border-2 border-white/80 flex items-center justify-center backdrop-blur-sm bg-black/20 group-hover/play:bg-primary-fixed group-hover/play:border-primary-fixed transition-all duration-300">
              <span className="material-symbols-outlined text-white group-hover/play:text-on-primary-fixed text-2xl ml-0.5 transition-colors">
                play_arrow
              </span>
            </div>
          </button>
        )}

        {/* Controls — only after first play */}
        {hasStarted && (
          <div
            className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 ${
              showControls || !playing ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Progress bar */}
            <div
              ref={progressRef}
              onClick={(e) => { e.stopPropagation(); handleProgressClick(e); }}
              className="h-6 flex items-end cursor-pointer px-0 group/prog"
            >
              <div className="w-full h-[3px] group-hover/prog:h-[5px] bg-white/15 relative transition-all">
                <div className="absolute top-0 left-0 h-full bg-white/15" style={{ width: `${buffered}%` }} />
                <div className="absolute top-0 left-0 h-full bg-primary-fixed" style={{ width: `${progress}%` }} />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-[13px] h-[13px] bg-primary-fixed rounded-full opacity-0 group-hover/prog:opacity-100 transition-opacity shadow-[0_0_4px_rgba(0,0,0,0.5)]"
                  style={{ left: `${progress}%`, marginLeft: "-6px" }}
                />
              </div>
            </div>

            {/* Bottom bar */}
            <div className="bg-gradient-to-t from-black/70 to-transparent">
              <div className="flex items-center justify-between px-4 py-2.5" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-4">
                  <button onClick={togglePlay} className="text-white/90 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[20px]">
                      {playing ? "pause" : "play_arrow"}
                    </span>
                  </button>

                  <div className="flex items-center gap-2 group/vol">
                    <button onClick={toggleMute} className="text-white/90 hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[20px]">
                        {muted || volume === 0 ? "volume_off" : volume < 0.5 ? "volume_down" : "volume_up"}
                      </span>
                    </button>
                    <input
                      type="range"
                      min="0" max="1" step="0.05"
                      value={muted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-0 group-hover/vol:w-16 transition-all opacity-0 group-hover/vol:opacity-100 accent-white h-[3px] cursor-pointer"
                    />
                  </div>

                  <span className="text-[11px] text-white/50 font-mono tabular-nums">
                    {formatTime(currentTime)}<span className="text-white/25 mx-1">/</span>{formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <button onClick={toggleFullscreen} className="text-white/90 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[20px]">
                      {fullscreen ? "fullscreen_exit" : "fullscreen"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pause indicator — center */}
        {hasStarted && !playing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
              <span className="material-symbols-outlined text-white/90 text-2xl ml-0.5">play_arrow</span>
            </div>
          </div>
        )}
      </div>

      {/* Caption bar — outside video */}
      {caption && (
        <div className="bg-[#0a0a0a] px-4 py-3 flex justify-between items-center">
          <span className="text-[11px] text-white/40 tracking-wide">{caption}</span>
          <span className="text-[9px] font-black text-white/15 uppercase tracking-[0.2em]">LOLLY</span>
        </div>
      )}
    </div>
  );
}
