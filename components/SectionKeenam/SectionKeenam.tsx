"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

/* ─── Floating Hearts Background ─────────────────────────────────────────── */
function FloatingHearts() {
  const hearts = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: 10 + Math.random() * 14,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 7 + Math.random() * 8,
    opacity: 0.08 + Math.random() * 0.14,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {hearts.map((h) => (
        <span
          key={h.id}
          style={{
            position: "absolute",
            left: `${h.left}%`,
            bottom: "-40px",
            fontSize: h.size,
            opacity: h.opacity,
            color: "#be185d",
            animationName: "floatHeart",
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
          }}
        >
          ♡
        </span>
      ))}
    </div>
  );
}

/* ─── Typewriter Hook ─────────────────────────────────────────────────────── */
function useTypewriter(text: string, speed = 38, active = false) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    if (!active) return;
    idx.current = 0;
    setDisplayed("");
    setDone(false);
    const interval = setInterval(() => {
      idx.current += 1;
      setDisplayed(text.slice(0, idx.current));
      if (idx.current >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, active]);

  return { displayed, done };
}

/* ─── Falling Petals inside Modal ────────────────────────────────────────── */
function FallingPetals() {
  const petals = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    left: 5 + Math.random() * 90,
    delay: Math.random() * 4,
    duration: 4 + Math.random() * 4,
    size: 8 + Math.random() * 10,
    symbol: ["✿", "❀", "♡", "✦"][Math.floor(Math.random() * 4)],
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
      {petals.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: "-20px",
            fontSize: p.size,
            color: "#f9a8d4",
            opacity: 0.5,
            animationName: "petalFall",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          }}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
}

/* ─── Wax Seal SVG ────────────────────────────────────────────────────────── */
function WaxSeal({ cracked }: { cracked: boolean }) {
  return (
    <div
      className="relative mx-auto mb-4"
      style={{ width: 72, height: 72 }}
    >
      <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="36" cy="36" r="33" fill="#be185d" opacity="0.92" />
        <circle cx="36" cy="36" r="27" fill="none" stroke="#fce7f3" strokeWidth="1.5" opacity="0.6" />
        <text x="36" y="41" textAnchor="middle" fontSize="20" fill="#fce7f3" fontFamily="serif">♡</text>
        {cracked && (
          <>
            <line x1="36" y1="3" x2="20" y2="36" stroke="#fff0f5" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
            <line x1="36" y1="3" x2="52" y2="36" stroke="#fff0f5" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
          </>
        )}
      </svg>
    </div>
  );
}

/* ─── Handwritten SVG Signature ──────────────────────────────────────────── */
function HandwrittenSignature({ animate }: { animate: boolean }) {
  return (
    <div className="mt-2 flex justify-end">
      <span
        style={{
          fontFamily: "'Dancing Script', cursive",
          fontSize: "1.4rem",
          color: "#9d174d",
          opacity: animate ? 1 : 0,
          transform: animate ? "translateX(0)" : "translateX(12px)",
          transition: "opacity 0.9s ease 1.8s, transform 0.9s ease 1.8s",
          display: "inline-block",
        }}
      >
        — dengan sepenuh hati ♡
      </span>
    </div>
  );
}

/* ─── Letter Lines with Typewriter ───────────────────────────────────────── */
const LINES = [
  "Haii Sayangkuu Ameishaa",
  "Kalau sayangg sudah sampai di bagian ini, berarti cintakuu sudah melihat semua hal hal manis yang aku susun di website ini hehehe. Jujur, aku sempat bingung mau nulis apa, karena rasanya nggak ada satu pun baris kode atau rangkaian kata yang bener-bener bisa mewakili gimana berartinya kamu buat aku.",
  "Makasih ya, Ameishakuu. Makasih sudah bertahan sama aku dari awal tahun kemarin. Makasih sudah mau melewati jarak yang kadang bikin rindu ini kerasa berat banget. Aku tahu hubungan kitaa itu nggak gampang, tapi setiap kali aku ingat kalau di sana ada kamu yang lagi berjuang juga.",
  "Di usiamu yang ke-21 ini, aku nggak pengen janjiin hal yang muluk muluk. Aku cuma mau janji satu hal aku bakal tetap di sini. Aku bakal jadi orang yang paling bangga bangett sama setiap pencapaian kecilmu, jadi orang yang bakal dengerin semua keluh kesahmu soal skripsi atau tugas kuliah, dan jadi tempat paling aman buat kamu pulang kalau dunia lagi berisik banget.",
  "Aku sayang banget sama kamuuu, dengan semua versi kamu. Yang lagi seneng, yang lagi capek, yang lagi manja minta peluk, sampai yang lagi heboh. Kamu itu lebih dari sekadar pacar buat aku cantiikk. kamu itu partner, sahabat, dan 'Amin' paling serius yang selalu aku sebut dalam doa",
  "Selamat ulang tahun yang ke-21, Ameishaa Sayangkuu. Semoga tahun ini lebih lembut buat kamu, semoga langkahmu selalu diringankan, dan semoga kita bisa terus bareng-bareng buat ngerayain ulang tahun tahun berikutnya.",
  "I love you, now and always",
];

function LetterLine({ text, active, onDone, delay = 0 }: {
  text: string; active: boolean; onDone: () => void; delay?: number;
}) {
  const [started, setStarted] = useState(false);
  const { displayed, done } = useTypewriter(text, 32, started);

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [active, delay]);

  useEffect(() => { if (done) onDone(); }, [done, onDone]);

  return (
    <p
      style={{
        fontFamily: "'Lora', serif",
        fontSize: "0.92rem",
        lineHeight: 1.85,
        color: "#831843",
        minHeight: "1.85em",
        marginBottom: "0.85rem",
      }}
    >
      {displayed}
      {started && !done && (
        <span style={{ borderRight: "1.5px solid #f472b6", marginLeft: 1, animation: "blink 0.7s infinite" }} />
      )}
    </p>
  );
}

/* ─── Modal ───────────────────────────────────────────────────────────────── */
function LetterModal({ onClose }: { onClose: () => void }) {
  const [lineIdx, setLineIdx] = useState(0);
  const [sigReady, setSigReady] = useState(false);
  const [sealCracked, setSealCracked] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSealCracked(true), 350);
    return () => clearTimeout(t);
  }, []);

  const advanceLine = useCallback(() => {
    setLineIdx((i) => {
      const next = i + 1;
      if (next >= LINES.length) setSigReady(true);
      return next;
    });
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(40, 2, 16, 0.72)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          background: "linear-gradient(145deg, #fff8fb 0%, #fce7f3 60%, #fff0f7 100%)",
          border: "1px solid rgba(249,168,212,0.4)",
          borderRadius: 28,
          padding: "2.5rem 2rem",
          maxWidth: 500,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 32px 80px rgba(190,24,93,0.22), 0 4px 24px rgba(190,24,93,0.12)",
          animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        <FallingPetals />

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 18,
            background: "none", border: "none", cursor: "pointer",
            color: "#f9a8d4", fontSize: 18, transition: "color 0.2s",
            fontFamily: "serif",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#be185d")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#f9a8d4")}
        >✕</button>

        {/* Wax Seal */}
        <WaxSeal cracked={sealCracked} />

        {/* Title */}
        <p
          style={{
            fontFamily: "'Lora', serif",
            fontSize: "1.05rem",
            fontWeight: 600,
            color: "#9d174d",
            textAlign: "center",
            marginBottom: "0.5rem",
            opacity: sealCracked ? 1 : 0,
            transition: "opacity 0.6s ease 0.4s",
          }}
        >
          Untuk Ameisha Nadilah Sayangkuu
        </p>
        <div style={{ height: 1, background: "linear-gradient(to right, transparent, #f9a8d4, transparent)", margin: "1rem 0 1.25rem" }} />

        {/* Letter lines */}
        <div style={{ textAlign: "left", position: "relative", zIndex: 1 }}>
          {LINES.map((line, i) => (
            <LetterLine
              key={i}
              text={line}
              active={sealCracked && lineIdx >= i}
              onDone={i === lineIdx ? advanceLine : () => {}}
              delay={i === 0 ? 300 : 0}
            />
          ))}
        </div>

        <div style={{ height: 1, background: "linear-gradient(to right, transparent, #f9a8d4, transparent)", margin: "1.25rem 0 0.5rem" }} />

        {/* Closing */}
        <div style={{ textAlign: "right", position: "relative", zIndex: 1 }}>
          <p
            style={{
              fontFamily: "'Lora', serif",
              fontSize: "0.9rem",
              color: "#be185d",
              fontStyle: "italic",
              opacity: sigReady ? 1 : 0,
              transition: "opacity 0.8s ease",
              lineHeight: 1.8,
            }}
          >
            Selamat ulang tahun yang ke-21, Sayang.<br />
            Semoga tahun ini lebih lembut buat kamu. ♡
          </p>
          <HandwrittenSignature animate={sigReady} />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            marginTop: "1.5rem",
            width: "100%",
            borderRadius: 999,
            border: "1px solid rgba(249,168,212,0.5)",
            color: "#be185d",
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(6px)",
            padding: "0.6rem",
            fontSize: "0.85rem",
            cursor: "pointer",
            fontFamily: "'Lora', serif",
            transition: "background 0.2s",
            position: "relative",
            zIndex: 1,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(252,231,243,0.9)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.6)")}
        >
          Tutup ✕
        </button>
      </div>
    </div>
  );
}

/* ─── Main Section ────────────────────────────────────────────────────────── */
export default function SectionKeenam() {
  const [opened, setOpened] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [hovering, setHovering] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  // Typewriter subtitle
  const subtitle = "Makasih ya sudah mau meluangkan waktu buat baca setiap detail kecil yang aku susun di sini.";
  const { displayed: twText } = useTypewriter(subtitle, 36, inView);

  useEffect(() => {
    setMounted(true);
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.35 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const handleOpen = () => {
    setFadeOut(true);
    setTimeout(() => {
      setFadeOut(false);
      setOpened(true);
    }, 600);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Dancing+Script:wght@600&display=swap');

        @keyframes floatHeart {
          0%   { transform: translateY(0) rotate(0deg); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(-110vh) rotate(25deg); opacity: 0; }
        }
        @keyframes petalFall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.5; }
          90%  { opacity: 0.4; }
          100% { transform: translateY(110%) rotate(40deg); opacity: 0; }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.82) translateY(28px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes pulse-aura {
          0%, 100% { box-shadow: 0 0 0 0 rgba(244,114,182,0.5), 0 8px 32px rgba(190,24,93,0.25); }
          50%       { box-shadow: 0 0 0 12px rgba(244,114,182,0), 0 8px 32px rgba(190,24,93,0.35); }
        }
        @keyframes fadeWhite {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .btn-heartbeat { animation: pulse-aura 2s ease-in-out infinite; }
      `}</style>

      {/* Fade-to-white overlay on click */}
      {fadeOut && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 99998,
            background: "#fff5f7",
            animation: "fadeWhite 0.6s ease forwards",
            pointerEvents: "none",
          }}
        />
      )}

      <section
        ref={sectionRef}
        style={{
          position: "relative",
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: inView
            ? "linear-gradient(160deg, #1a0010 0%, #4c0026 40%, #7f1d3f 80%, #be185d22 100%)"
            : "linear-gradient(160deg, #fff0f6 0%, #fce7f3 100%)",
          transition: "background 1.4s ease",
          padding: "5rem 1.5rem",
          overflow: "hidden",
        }}
      >
        <FloatingHearts />

        {/* Grain texture overlay */}
        <div
          style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
            opacity: 0.35,
          }}
        />

        <div style={{ maxWidth: 580, width: "100%", textAlign: "center", position: "relative", zIndex: 1 }}>

          {/* Eyebrow */}
          <p
            style={{
              fontFamily: "'Lora', serif",
              fontSize: "0.75rem",
              letterSpacing: "0.25em",
              color: "#f9a8d4",
              textTransform: "uppercase",
              marginBottom: "1.25rem",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s",
            }}
          >
            ✦ &nbsp; A Little Closer to My Heart &nbsp; ✦
          </p>

          {/* Main heading */}
          <h2
            style={{
              fontFamily: "'Lora', serif",
              fontSize: "clamp(2rem, 6vw, 3.25rem)",
              fontWeight: 600,
              color: "#fce7f3",
              lineHeight: 1.2,
              marginBottom: "1.75rem",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(18px)",
              transition: "opacity 0.9s ease 0.25s, transform 0.9s ease 0.25s",
            }}
          >
            Ini buat kamu,<br />
            <span style={{ color: "#f9a8d4", fontStyle: "italic" }}>hanya kamu.</span>
          </h2>

          {/* Typewriter subtitle */}
          <div
            style={{
              background: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(249,168,212,0.18)",
              borderRadius: 16,
              padding: "1.25rem 1.5rem",
              marginBottom: "2.5rem",
              minHeight: 72,
              opacity: inView ? 1 : 0,
              transition: "opacity 0.8s ease 0.5s",
            }}
          >
            <p
              style={{
                fontFamily: "'Lora', serif",
                fontSize: "0.95rem",
                color: "#fce7f3",
                lineHeight: 1.8,
                opacity: 0.88,
              }}
            >
              {twText}
              {twText.length < subtitle.length && twText.length > 0 && (
                <span style={{ borderRight: "1.5px solid #f472b6", marginLeft: 1, animation: "blink 0.7s infinite" }} />
              )}
            </p>
          </div>

          {/* CTA Button */}
          <div
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.8s ease 0.7s, transform 0.8s ease 0.7s",
            }}
          >
            <button
              onClick={handleOpen}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              className="btn-heartbeat"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                borderRadius: 999,
                background: "linear-gradient(135deg, #f472b6 0%, #be185d 100%)",
                padding: "0.85rem 2rem",
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "white",
                fontFamily: "'Lora', serif",
                border: "none",
                cursor: "pointer",
                transform: hovering ? "scale(1.06)" : "scale(1)",
                transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                letterSpacing: "0.02em",
              }}
            >
              <span>{hovering ? "Siap? ♡" : "Ini Pesan dari aku sayangg"}</span>
              <span style={{ fontSize: 18 }}>♡</span>
            </button>
          </div>

          {/* Small note */}
          <p
            style={{
              fontFamily: "'Lora', serif",
              fontSize: "0.75rem",
              color: "#f9a8d4",
              opacity: inView ? 0.55 : 0,
              marginTop: "1.25rem",
              fontStyle: "italic",
              transition: "opacity 0.8s ease 1s",
            }}
          >
            klik saat kamu siap ya ♡
          </p>
        </div>
      </section>

      {mounted && opened && createPortal(
        <LetterModal onClose={() => setOpened(false)} />,
        document.body
      )}
    </>
  );
}
