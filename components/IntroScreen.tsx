"use client";
import { useEffect, useState } from "react";

export default function IntroScreen() {
  const [phase, setPhase] = useState<"visible" | "fadeout" | "hidden">("visible");
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [line1Done, setLine1Done] = useState(false);

  const LINE1 = "Untuk Ameisha Nadilah...";
  const LINE2 = "Ada sesuatu spesial untukmu 🎂";

  // Typing baris 1
  useEffect(() => {
    if (phase !== "visible") return;
    if (text1.length < LINE1.length) {
      const t = setTimeout(() => setText1(LINE1.slice(0, text1.length + 1)), 60);
      return () => clearTimeout(t);
    } else {
      setTimeout(() => setLine1Done(true), 300);
    }
  }, [text1, phase]);

  // Typing baris 2 setelah baris 1 selesai
  useEffect(() => {
    if (!line1Done) return;
    if (text2.length < LINE2.length) {
      const t = setTimeout(() => setText2(LINE2.slice(0, text2.length + 1)), 65);
      return () => clearTimeout(t);
    } else {
      // Setelah semua selesai, tunggu 1.5 detik lalu fadeout
      setTimeout(() => setPhase("fadeout"), 1500);
    }
  }, [line1Done, text2]);

  // Setelah fadeout selesai, hilangkan komponen
  useEffect(() => {
    if (phase === "fadeout") {
      const t = setTimeout(() => setPhase("hidden"), 900);
      return () => clearTimeout(t);
    }
  }, [phase]);

  if (phase === "hidden") return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1a0a14 0%, #2d1020 50%, #1a0a14 100%)",
        opacity: phase === "fadeout" ? 0 : 1,
        transition: "opacity 0.9s ease",
        pointerEvents: phase === "fadeout" ? "none" : "all",
      }}
    >
      {/* Lingkaran blur dekoratif */}
      <div style={{
        position: "absolute", top: "10%", left: "10%",
        width: 300, height: 300, borderRadius: "50%",
        background: "rgba(244,114,182,0.12)", filter: "blur(80px)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "10%", right: "10%",
        width: 250, height: 250, borderRadius: "50%",
        background: "rgba(251,113,133,0.1)", filter: "blur(80px)",
        pointerEvents: "none",
      }} />

      {/* Ikon hati */}
      <div style={{
        fontSize: 52,
        marginBottom: 28,
        animation: "heartbeat 1.2s ease-in-out infinite",
      }}>
        💝
      </div>

      {/* Teks typing */}
      <div style={{ textAlign: "center", padding: "0 24px" }}>
        <p style={{
          fontFamily: "Georgia, serif",
          fontSize: "clamp(1.2rem, 4vw, 1.8rem)",
          color: "#f9a8d4",
          marginBottom: 16,
          minHeight: "2rem",
          letterSpacing: "0.02em",
        }}>
          {text1}
          {text1.length < LINE1.length && (
            <span style={{ animation: "blink 0.5s step-end infinite" }}>|</span>
          )}
        </p>

        {line1Done && (
          <p style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(1rem, 3vw, 1.4rem)",
            color: "#fda4af",
            minHeight: "2rem",
            letterSpacing: "0.02em",
          }}>
            {text2}
            {text2.length < LINE2.length && (
              <span style={{ animation: "blink 0.5s step-end infinite" }}>|</span>
            )}
          </p>
        )}
      </div>

      {/* Garis bawah dekoratif */}
      {line1Done && text2.length === LINE2.length && (
        <div style={{
          marginTop: 32,
          width: 80,
          height: 1,
          background: "linear-gradient(90deg, transparent, #f9a8d4, transparent)",
          animation: "fadeIn 0.5s ease",
        }} />
      )}

      <style>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          14% { transform: scale(1.15); }
          28% { transform: scale(1); }
          42% { transform: scale(1.1); }
          70% { transform: scale(1); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; width: 0; }
          to { opacity: 1; width: 80px; }
        }
      `}</style>
    </div>
  );
}
