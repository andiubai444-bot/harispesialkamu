"use client";
import { useState, useCallback, useRef, useEffect } from "react";

type Particle = {
  id: number;
  dx: number;
  dy: number;
  size: number;
  color: string;
  isLily: boolean;
  emoji?: string;
  rotate: number;
};

const COLORS = ["#f9a8d4", "#fda4af", "#fbcfe8", "#ff85a1", "#fcd5e3", "#fde68a", "#c4b5fd"];
const LILY_EMOJIS = ["🌸", "🌷", "💮", "🌺"];

const REACTIONS = [
  { min: 1,    max: 1,         text: "Satu pelukan buat kamu ♡" },
  { min: 2,    max: 4,         text: "Hehe makasih balik ya 🥺" },
  { min: 5,    max: 7,         text: "Kamu suka banget ya dipeluk 😄" },
  { min: 8,    max: 9,         text: "Oke oke aku peluk terus deh ♡" },
  { min: 10,   max: 14,        text: "Udah 10 pelukan, masih mau lagi? 🥹" },
  { min: 15,   max: 19,        text: "Ya Allah kamu manja banget sih 😭♡" },
  { min: 20,   max: 24,        text: "Aku juga pengen dipeluk balik lho 🤭" },
  { min: 25,   max: 29,        text: "Nggak cape? Aku sih nggak 🤗" },
  { min: 30,   max: 49,        text: "30 pelukan... kamu serius?? 😂♡" },
  { min: 50,   max: 99,        text: "50 PELUKAN?? Aku ikutin terus kok! 💪♡" },
  { min: 100,  max: 199,       text: "100 pelukan! Aku nggak akan berhenti selama kamu nggak berhenti 🔥♡" },
  { min: 200,  max: 499,       text: "200?? Aku kuat kok, terus aja! Aku selalu ada 🤗♡" },
  { min: 500,  max: 999,       text: "500 pelukan... aku bakal terus di sini sampai kapanpun 💕" },
  { min: 1000, max: Infinity,  text: "1000 pelukan dan aku masih di sini. Selalu. ♡" },
];

// Returns [currentMin, nextMin] for progress bar
function getReactionBounds(count: number) {
  const idx = REACTIONS.findIndex((r) => count >= r.min && count <= r.max);
  const current = REACTIONS[idx];
  const next = REACTIONS[idx + 1];
  if (!next) return { text: current?.text ?? "", progress: 1, hint: "" };
  const range = next.min - current.min;
  const progress = (count - current.min) / range;
  const remaining = next.min - count;
  return {
    text: current?.text ?? "",
    progress: Math.min(progress, 1),
    hint: remaining <= 5 ? `${remaining} lagi menuju kejutan berikutnya ✨` : "",
  };
}

// Background gradient per milestone
function getBgStyle(counter: number): React.CSSProperties {
  if (counter >= 100) return { background: "linear-gradient(135deg, #fde68a 0%, #fda4af 50%, #f9a8d4 100%)" };
  if (counter >= 50)  return { background: "linear-gradient(135deg, #fce7f3 0%, #fda4af 60%, #fbcfe8 100%)" };
  if (counter >= 20)  return { background: "linear-gradient(135deg, #fce7f3 0%, #fde4ec 100%)" };
  return { background: "#fdf2f8" };
}

export default function PelukanVirtual() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [clicked, setClicked] = useState(false);
  const [counter, setCounter] = useState(0);
  const [combo, setCombo] = useState(0);
  const [reactionKey, setReactionKey] = useState(0);
  const [prevReactionText, setPrevReactionText] = useState("");
  const [showComboFlash, setShowComboFlash] = useState(false);

  const comboTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const counterRef = useRef(0);

  const sendHug = useCallback(() => {
    setClicked(true);
    setTimeout(() => setClicked(false), 200);

    // Combo logic
    if (comboTimer.current) clearTimeout(comboTimer.current);
    setCombo((c) => {
      const next = c + 1;
      if (next >= 10) {
        setShowComboFlash(true);
        setTimeout(() => setShowComboFlash(false), 700);
      }
      return next;
    });
    comboTimer.current = setTimeout(() => setCombo(0), 800);

    const newCounter = counterRef.current + 1;
    counterRef.current = newCounter;
    setCounter(newCounter);

    // Check reaction change
    const prev = getReactionBounds(newCounter - 1).text;
    const next = getReactionBounds(newCounter).text;
    if (next !== prev) {
      setPrevReactionText(next);
      setReactionKey((k) => k + 1);
    }

    // Particle burst — more particles at high combo
    const count = combo >= 10 ? 20 : combo >= 5 ? 16 : 12;
    const sizeBoost = Math.min(combo * 1.4, 16);

    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
      const dist = Math.random() * 70 + 55;
      const isLily = i % 4 === 0;
      return {
        id: Date.now() + i + Math.random(),
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        size: Math.random() * 12 + 12 + sizeBoost,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        isLily,
        emoji: isLily ? LILY_EMOJIS[Math.floor(Math.random() * LILY_EMOJIS.length)] : undefined,
        rotate: Math.random() * 360,
      };
    });

    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((n) => n.id === p.id)));
    }, 1800);
  }, [combo]);

  const { text: reactionText, progress, hint } = getReactionBounds(counter);
  const bgStyle = getBgStyle(counter);

  // Orbit dash params
  const R = 88;
  const circumference = 2 * Math.PI * R;

  return (
    <section
      className="w-full min-h-[60vh] py-16 px-4 sm:px-10 flex items-center"
      style={{ ...bgStyle, transition: "background 1.2s ease" }}
    >
      <style>{`
        @keyframes flyOut {
          0%   { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
          80%  { opacity: 0.75; }
          100% { transform: translate(var(--dx), var(--dy)) rotate(var(--rot)) scale(0.25); opacity: 0; }
        }
        @keyframes reactionBounce {
          0%   { transform: scale(0.7) translateY(6px); opacity: 0; }
          60%  { transform: scale(1.08) translateY(-2px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes comboFlash {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.25); }
          100% { transform: scale(1); }
        }
        @keyframes orbitSpin {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: ${-circumference}px; }
        }
        @keyframes hintSlide {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="max-w-lg mx-auto text-center w-full">
        {/* Header */}
        <p className="text-xs tracking-widest text-pink-600 uppercase mb-2 font-mono">
          ✦ untuk kamu ✦
        </p>
        <p className="font-serif text-xl text-pink-900 mb-2">Pelukan Virtual</p>
        <p className="text-sm text-pink-500 mb-10">
          Karena aku ga bisa peluk kamu langsung, ini buat gantinya 🤗
        </p>

        {/* Combo badge */}
        <div className="h-7 flex justify-center items-center mb-4">
          {combo >= 3 && (
            <span
              style={{
                background: combo >= 10 ? "linear-gradient(135deg,#f472b6,#fb7185)" : "rgba(244,114,182,0.15)",
                color: combo >= 10 ? "white" : "#be185d",
                borderRadius: 999,
                padding: "2px 14px",
                fontSize: "0.78rem",
                fontWeight: 600,
                letterSpacing: "0.06em",
                fontFamily: "monospace",
                animation: showComboFlash ? "comboFlash 0.4s ease" : "none",
                display: "inline-block",
                transition: "background 0.4s",
              }}
            >
              {combo >= 10 ? `🔥 COMBO ×${combo}` : `×${combo} combo`}
            </span>
          )}
        </div>

        {/* Orbit + Button area */}
        <div className="flex justify-center items-center mb-8">
          <div className="relative flex justify-center items-center" style={{ width: 210, height: 210 }}>

            {/* Orbit ring SVG */}
            <svg
              width="210" height="210"
              style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
            >
              <circle
                cx="105" cy="105" r={R}
                fill="none"
                stroke="rgba(244,114,182,0.18)"
                strokeWidth="1.5"
                strokeDasharray="5 7"
              />
              {/* Animated moving dot on orbit */}
              <circle r="4" fill="#f9a8d4" opacity="0.7">
                <animateMotion
                  dur="4s"
                  repeatCount="indefinite"
                  path={`M ${105 + R} 105 A ${R} ${R} 0 1 1 ${105 + R - 0.001} 105`}
                />
              </circle>
            </svg>

            {/* Particles */}
            {particles.map((p) => (
              <div
                key={p.id}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  fontSize: p.size,
                  color: p.color,
                  pointerEvents: "none",
                  animation: "flyOut 1.6s ease-out forwards",
                  marginTop: -p.size / 2,
                  marginLeft: -p.size / 2,
                  ["--dx" as string]: `${p.dx}px`,
                  ["--dy" as string]: `${p.dy}px`,
                  ["--rot" as string]: `${p.rotate}deg`,
                  filter: combo >= 10 ? "drop-shadow(0 0 4px rgba(244,114,182,0.7))" : "none",
                }}
              >
                {p.isLily ? p.emoji : "♥"}
              </div>
            ))}

            {/* Main button */}
            <button
              onClick={sendHug}
              style={{
                transform: clicked ? "scale(0.86)" : combo >= 10 ? "scale(1.06)" : "scale(1)",
                transition: "transform 0.15s cubic-bezier(0.34,1.56,0.64,1)",
                position: "relative",
                zIndex: 10,
                boxShadow: combo >= 10
                  ? "0 0 0 6px rgba(244,114,182,0.2), 0 8px 32px rgba(244,114,182,0.5)"
                  : "0 8px 24px rgba(244,114,182,0.4)",
              }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 flex flex-col items-center justify-center text-white border-4 border-white"
            >
              <span
                style={{
                  fontSize: combo >= 10 ? 36 : 30,
                  transition: "font-size 0.3s ease",
                  display: "block",
                }}
              >
                🤗
              </span>
              <span className="text-[10px] font-semibold mt-1 tracking-wide">Peluk!</span>
            </button>
          </div>
        </div>

        {/* Counter pill */}
        {counter > 0 && (
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-pink-200 rounded-full px-5 py-2 shadow-sm mb-4">
            <span className="text-pink-400 text-sm">🤗</span>
            <p className="text-sm text-pink-700 font-serif">
              {counter.toLocaleString("id-ID")} pelukan terkirim ♡
            </p>
          </div>
        )}

        {/* Progress bar */}
        {counter > 0 && progress < 1 && (
          <div className="max-w-[220px] mx-auto mb-4">
            <div
              style={{
                height: 3,
                borderRadius: 999,
                background: "rgba(244,114,182,0.15)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress * 100}%`,
                  background: "linear-gradient(to right, #f9a8d4, #f472b6)",
                  borderRadius: 999,
                  transition: "width 0.4s ease",
                }}
              />
            </div>
            {hint && (
              <p
                style={{
                  fontSize: "0.7rem",
                  color: "#f472b6",
                  marginTop: 5,
                  fontFamily: "monospace",
                  letterSpacing: "0.04em",
                  animation: "hintSlide 0.4s ease",
                }}
              >
                {hint}
              </p>
            )}
          </div>
        )}

        {/* Reaction text */}
        {counter > 0 && (
          <p
            key={reactionKey}
            style={{
              fontSize: "0.82rem",
              color: "#be185d",
              fontStyle: "italic",
              fontFamily: "serif",
              animation: "reactionBounce 0.45s cubic-bezier(0.34,1.56,0.64,1) both",
              minHeight: "1.4em",
            }}
          >
            {reactionText}
          </p>
        )}
      </div>
    </section>
  );
}
