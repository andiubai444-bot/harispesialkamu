"use client";

import { useEffect, useRef, useState } from "react";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Autoplay setelah user pertama kali klik/touch di halaman
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        audioRef.current?.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {});
      }
    };

    document.addEventListener("click", handleFirstInteraction, { once: true });
    document.addEventListener("touchstart", handleFirstInteraction, { once: true });

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, [hasInteracted]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/music.mp3" loop />

      {/* Tombol musik floating di pojok kanan bawah */}
      <button
        onClick={togglePlay}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9999,
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.3)",
          borderRadius: "50%",
          width: "52px",
          height: "52px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          transition: "transform 0.2s",
        }}
        title={isPlaying ? "Pause musik" : "Play musik"}
      >
        {isPlaying ? "🎵" : "🔇"}
      </button>

      {/* Notif kecil saat belum ada interaksi */}
      {!hasInteracted && (
        <div
          style={{
            position: "fixed",
            bottom: "84px",
            right: "16px",
            background: "rgba(0,0,0,0.6)",
            color: "white",
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          Tap untuk nyalain musik 🎶
        </div>
      )}
    </>
  );
}
