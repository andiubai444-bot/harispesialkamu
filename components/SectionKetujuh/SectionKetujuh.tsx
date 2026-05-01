"use client";
import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export default function SectionKetujuh() {
  const { ref, visible } = useInView(0.25);

  const lines = [
    {
      type: "handwritten",
      text: "Selesai sudah kejutan kecilnya,",
      delay: 0,
    },
    {
      type: "handwritten",
      text: "tapi sayangku ke kamu nggak akan pernah ada selesainya.",
      delay: 150,
    },
    {
      type: "handwritten",
      text: "Makasih ya sudah lahir ke dunia dan sudah mau jadi bagian dari ceritaku.",
      delay: 300,
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&family=Lora:ital,wght@0,600;1,400&display=swap');

        @keyframes glowTitle {
          0%, 100% { text-shadow: 0 0 0px rgba(244,114,182,0); }
          50%       { text-shadow: 0 0 28px rgba(244,114,182,0.45), 0 0 8px rgba(244,114,182,0.2); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heartPulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50%       { transform: scale(1.22); opacity: 1; }
        }
        @keyframes shimmer {
          from { background-position: -200% center; }
          to   { background-position: 200% center; }
        }
      `}</style>

      <section
        style={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(ellipse 80% 70% at 50% 50%, #fff0f6 0%, #fce7f3 40%, #fecdd3 75%, #ffe4cc 100%)",
          borderTop: "1px solid rgba(249,168,212,0.3)",
          padding: "4rem 1.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle ambient circles */}
        <div style={{
          position: "absolute", top: "10%", left: "8%",
          width: 260, height: 260, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(253,164,175,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "12%", right: "6%",
          width: 200, height: 200, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,228,204,0.3) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div ref={ref} style={{ maxWidth: 600, width: "100%", textAlign: "center" }}>

          {/* Handwritten opening lines */}
          <div style={{ marginBottom: "2.5rem" }}>
            {lines.map((line, i) => (
              <p
                key={i}
                style={{
                  fontFamily: "'Caveat', cursive",
                  fontSize: "clamp(1.15rem, 3.5vw, 1.45rem)",
                  color: "#9d174d",
                  lineHeight: 1.75,
                  marginBottom: "0.25rem",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.8s ease ${line.delay + 100}ms, transform 0.8s ease ${line.delay + 100}ms`,
                }}
              >
                {line.text}
              </p>
            ))}
          </div>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: "linear-gradient(to right, transparent, rgba(244,114,182,0.5), transparent)",
              margin: "0 auto 2.5rem",
              maxWidth: 280,
              opacity: visible ? 1 : 0,
              transition: "opacity 0.8s ease 500ms",
            }}
          />

          {/* Main serif title with glow */}
          <h2
            style={{
              fontFamily: "'Lora', serif",
              fontSize: "clamp(1.4rem, 5vw, 2.1rem)",
              fontWeight: 600,
              color: "#881337",
              lineHeight: 1.4,
              marginBottom: "0.5rem",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.9s ease 650ms, transform 0.9s ease 650ms",
              animation: visible ? "glowTitle 3s ease-in-out 1.5s infinite" : "none",
            }}
          >
            Sekali lagi, selamat ulang tahun
            <br />
            <span
              style={{
                fontStyle: "italic",
                background: "linear-gradient(90deg, #be185d, #f472b6, #fb7185, #be185d)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: visible ? "shimmer 3s linear 1.8s infinite" : "none",
              }}
            >
              Ameishaa Sayangku ♡
            </span>
          </h2>

          {/* End marker */}
          <div
            style={{
              marginTop: "4rem",
              opacity: visible ? 1 : 0,
              transition: "opacity 1s ease 1.2s",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.6rem",
            }}
          >
            <span
              style={{
                fontSize: 28,
                display: "block",
                animation: "heartPulse 2s ease-in-out infinite",
                color: "#f472b6",
              }}
            >
              ♡
            </span>
            <p
              style={{
                fontFamily: "'Lora', serif",
                fontStyle: "italic",
                fontSize: "0.8rem",
                color: "#db2777",
                opacity: 0.7,
                letterSpacing: "0.03em",
              }}
            >
              Akhir dari cerita ini, tapi awal dari tahun yang hebat buatmu. ♡
            </p>
          </div>

        </div>
      </section>
    </>
  );
}
