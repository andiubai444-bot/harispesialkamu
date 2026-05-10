"use client";

import { useEffect, useRef, useState, useCallback, type JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

type Stage = "intro" | "exploding" | "fadeout";
type Kind  = "lily" | "rose" | "petal";

interface Particle {
  id: number; kind: Kind; x: number; y: number;
  size: number; rotation: number; rotSpeed: number;
  fallSpeed: number; swayAmp: number; swayFreq: number; swayOffset: number;
  opacity: number; color: string;
  ox: number; oy: number; tx: number; ty: number;
  progress: number; launched: boolean; delay: number;
}

let _id = 0;
function makeParticle(phase: "burst" | "drift", cx = 50, cy = 50): Particle {
  const r   = Math.random();
  const kind: Kind = r < 0.38 ? "lily" : r < 0.68 ? "rose" : "petal";
  const ang = Math.random() * Math.PI * 2;
  const d   = phase === "burst" ? 28 + Math.random() * 65 : Math.random() * 100;
  const tx  = cx + Math.cos(ang) * d;
  const ty  = cy + Math.sin(ang) * d * 0.85;
  const isF = kind !== "petal";
  return {
    id: _id++, kind,
    x: phase === "burst" ? cx : tx,
    y: phase === "burst" ? cy : ty,
    size:       isF ? 24 + Math.random() * 20 : 6 + Math.random() * 9,
    rotation:   Math.random() * Math.PI * 2,
    rotSpeed:   (Math.random() - 0.5) * (isF ? 0.7 : 1.6),
    fallSpeed:  isF ? 4 + Math.random() * 7  : 10 + Math.random() * 14,
    swayAmp:    isF ? 0.5 + Math.random() * 1.5 : 1.5 + Math.random() * 2.5,
    swayFreq:   0.18 + Math.random() * 0.38,
    swayOffset: Math.random() * Math.PI * 2,
    opacity:    0.6 + Math.random() * 0.38,
    color:      kind === "rose" ? "#c0112a" : "#ffffff",
    ox: cx, oy: cy, tx, ty,
    progress: phase === "burst" ? 0 : 1,
    launched: phase !== "burst",
    delay:    phase === "burst" ? Math.random() * 0.25 : 0,
  };
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle, W: number, H: number) {
  const px = (p.x / 100) * W;
  const py = (p.y / 100) * H;
  const r  = p.size * 0.5;
  ctx.save();
  ctx.globalAlpha = p.opacity;
  ctx.translate(px, py);
  ctx.rotate(p.rotation);

  if (p.kind === "lily") {
    ctx.fillStyle = "#f5eef4";
    for (let i = 0; i < 6; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI) / 3);
      ctx.beginPath();
      ctx.ellipse(0, -r * 0.68, r * 0.21, r * 0.46, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = "#f9e87a";
    ctx.fill();
  } else if (p.kind === "rose") {
    ["#c0112a", "#a00820", "#d41830"].forEach((col, li) => {
      const rad = r * [0.88, 0.63, 0.40][li];
      const n   = 6 - li;
      ctx.fillStyle = col;
      for (let i = 0; i < n; i++) {
        ctx.save();
        ctx.rotate(i * (Math.PI * 2 / n) + li * 0.3);
        ctx.beginPath();
        ctx.ellipse(0, -rad, rad * 0.27, rad * 0.21, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.14, 0, Math.PI * 2);
    ctx.fillStyle = "#ffd080";
    ctx.fill();
  } else {
    ctx.fillStyle = p.color === "#ffffff"
      ? "rgba(255,248,255,0.82)" : "rgba(192,17,42,0.78)";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo( r*0.24, -r*0.11, r*0.27, -r*0.50, 0, -r*0.72);
    ctx.bezierCurveTo(-r*0.27, -r*0.50, -r*0.24, -r*0.11, 0, 0);
    ctx.fill();
  }
  ctx.restore();
}

// ─── Canvas ───────────────────────────────────────────────────────────────────

function FlowerCanvas({ onEnoughParticles }: { onEnoughParticles: () => void }): JSX.Element {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const psRef      = useRef<Particle[]>([]);
  const rafRef     = useRef<number>(0);
  const tsRef      = useRef<number | null>(null);
  const tRef       = useRef(0);
  const firedRef   = useRef(false);

  useEffect(() => {
    // Burst from center
    psRef.current = Array.from({ length: 75 }, () => makeParticle("burst", 50, 50));

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const loop = (ts: number) => {
      if (!tsRef.current) tsRef.current = ts;
      const dt = Math.min((ts - tsRef.current) / 1000, 0.05);
      tsRef.current = ts;
      tRef.current += dt;
      const t = tRef.current;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const ps = psRef.current;
      let visible = 0;

      for (const p of ps) {
        if (!p.launched) { if (t >= p.delay) p.launched = true; else continue; }
        if (p.progress < 1) {
          p.progress = Math.min(1, p.progress + 1.8 * dt);
          const e = 1 - Math.pow(1 - p.progress, 3);
          p.x = p.ox + (p.tx - p.ox) * e;
          p.y = p.oy + (p.ty - p.oy) * e;
        } else {
          p.x += Math.sin(t * p.swayFreq + p.swayOffset) * p.swayAmp * dt * 0.5;
          p.y += p.fallSpeed * dt;
          if (p.y >= -5 && p.y <= 112) visible++;
        }
        p.rotation += p.rotSpeed * dt;
        drawParticle(ctx, p, W, H);
      }

      // replenish drifters
      if (t > 0.5 && ps.length < 65 && Math.random() < 0.06)
        ps.push(makeParticle("drift"));

      if (!firedRef.current && visible >= 45) {
        firedRef.current = true;
        onEnoughParticles();
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, [onEnoughParticles]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden />;
}

// ─── Gift Box ─────────────────────────────────────────────────────────────────

function GiftBox(): JSX.Element {
  return (
    <svg viewBox="0 0 140 150" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="70" cy="143" rx="36" ry="7" fill="rgba(0,0,0,0.18)" />
      {/* Body */}
      <rect x="16" y="68" width="108" height="68" rx="5" fill="url(#bG)" stroke="#7a0018" strokeWidth="1.5" />
      {/* Lid */}
      <rect x="10" y="50" width="120" height="22" rx="5" fill="url(#lG)" stroke="#7a0018" strokeWidth="1.5" />
      {/* Ribbon vertical */}
      <rect x="61" y="68" width="18" height="68" fill="url(#rV)" rx="2" />
      {/* Ribbon horizontal on lid */}
      <rect x="10" y="56" width="120" height="10" fill="url(#rH)" rx="2" />
      {/* Bow loops */}
      <ellipse cx="50" cy="46" rx="20" ry="12" fill="url(#bow)" transform="rotate(-28 50 46)" stroke="#7a0018" strokeWidth="0.8" />
      <ellipse cx="90" cy="46" rx="20" ry="12" fill="url(#bow)" transform="rotate(28 90 46)"  stroke="#7a0018" strokeWidth="0.8" />
      {/* Bow knot */}
      <ellipse cx="70" cy="52" rx="11" ry="9" fill="url(#knot)" stroke="#7a0018" strokeWidth="0.8" />
      {/* Tails */}
      <path d="M62 59 Q54 72 46 86" stroke="#b8102a" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.65" />
      <path d="M78 59 Q86 72 94 86" stroke="#b8102a" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.65" />
      {/* Sparkles */}
      {([[22,42],[118,56],[28,96],[114,90]] as [number,number][]).map(([x,y],i) => (
        <g key={i} transform={`translate(${x},${y})`} opacity="0.6">
          <line x1="-5" y1="0" x2="5" y2="0" stroke="#ffd4e8" strokeWidth="1.4" />
          <line x1="0" y1="-5" x2="0" y2="5" stroke="#ffd4e8" strokeWidth="1.4" />
        </g>
      ))}
      <defs>
        <linearGradient id="bG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#cc1230" /><stop offset="100%" stopColor="#8c0018" />
        </linearGradient>
        <linearGradient id="lG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#e02244" /><stop offset="100%" stopColor="#a80c28" />
        </linearGradient>
        <linearGradient id="rV" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#f0204c" /><stop offset="50%" stopColor="#ff6080" /><stop offset="100%" stopColor="#f0204c" />
        </linearGradient>
        <linearGradient id="rH" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#ff6080" /><stop offset="50%" stopColor="#f0204c" /><stop offset="100%" stopColor="#ff6080" />
        </linearGradient>
        <radialGradient id="bow">
          <stop offset="0%"   stopColor="#ff6080" /><stop offset="100%" stopColor="#c01030" />
        </radialGradient>
        <radialGradient id="knot">
          <stop offset="0%"   stopColor="#ff8090" /><stop offset="100%" stopColor="#d01838" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function IntroScreen({ onDone }: { onDone: () => void }): JSX.Element | null {
  const [stage, setStage] = useState<Stage>("intro");

  const handleClick = useCallback(() => {
    if (stage !== "intro") return;
    setStage("exploding");
  }, [stage]);

  const handleEnough = useCallback(() => {
    // flowers covered screen → fade out intro, reveal main page
    setTimeout(() => setStage("fadeout"), 200);
    setTimeout(() => onDone(), 1000);
  }, [onDone]);

  return (
    <AnimatePresence>
      {stage !== "fadeout" ? (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "linear-gradient(135deg, #2a0008 0%, #3e000c 60%, #1a0004 100%)" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: "easeInOut" } }}
        >
          {/* Soft ambient glows */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-1/4 w-[60%] h-[45%] rounded-full opacity-20"
              style={{ background: "radial-gradient(ellipse, #ff2050 0%, transparent 70%)", filter: "blur(60px)" }} />
            <div className="absolute bottom-0 right-1/4 w-[50%] h-[40%] rounded-full opacity-15"
              style={{ background: "radial-gradient(ellipse, #cc0030 0%, transparent 70%)", filter: "blur(70px)" }} />
          </div>

          {/* Flower canvas — only when exploding */}
          {stage === "exploding" && (
            <div className="absolute inset-0">
              <FlowerCanvas onEnoughParticles={handleEnough} />
            </div>
          )}

          {/* ── Center content ── */}
          <div className="relative z-10 flex flex-col items-center gap-6 select-none">

            {/* Small eyebrow text */}
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-[10px] sm:text-xs tracking-[0.45em] uppercase"
              style={{ color: "rgba(255,180,200,0.5)", fontFamily: "'Georgia', serif" }}
            >
              untuk kamu yang istimewa
            </motion.p>

            {/* Gift box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 30 }}
              animate={stage === "exploding"
                ? { scale: [1, 1.22, 0.85, 1.3, 0], opacity: [1,1,1,1,0], rotate: [0,-8,10,-5,0],
                    transition: { duration: 0.55, ease: "easeInOut" } }
                : { opacity: 1, scale: 1, y: 0, transition: { delay: 0.2, duration: 0.7, ease: [0.22,1,0.36,1] } }
              }
              whileHover={stage === "intro" ? { scale: 1.06, transition: { duration: 0.25 } } : undefined}
              whileTap={stage === "intro" ? { scale: 0.94 } : undefined}
              onClick={handleClick}
              className="cursor-pointer"
              style={{ width: "min(200px, 48vw)", height: "min(215px, 51vw)" }}
            >
              {/* Glow under box */}
              <div aria-hidden className="absolute inset-x-4 bottom-0 h-8 rounded-full opacity-40"
                style={{ background: "radial-gradient(ellipse, #ff2050 0%, transparent 70%)", filter: "blur(12px)" }} />
              <GiftBox />
            </motion.div>

            {/* "Tap to open" hint */}
            <AnimatePresence>
              {stage === "intro" && (
                <motion.div
                  key="hint"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6, transition: { duration: 0.2 } }}
                  transition={{ delay: 0.9, duration: 0.7 }}
                  className="flex flex-col items-center gap-2"
                >
                  {/* Animated arrow */}
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 3 L10 14 M5 10 L10 15 L15 10"
                        stroke="rgba(255,180,200,0.45)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                  <p className="text-[11px] sm:text-xs tracking-[0.38em] uppercase"
                    style={{ color: "rgba(255,180,200,0.45)", fontFamily: "'Georgia', serif" }}>
                    ketuk untuk membuka
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom decorative line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 1.1, duration: 1.0 }}
            className="absolute bottom-10 left-0 right-0 flex items-center justify-center gap-4"
          >
            <div className="h-px w-16 sm:w-28" style={{ background: "linear-gradient(to right, transparent, rgba(255,180,200,0.3))" }} />
            <span style={{ color: "rgba(255,170,195,0.35)", fontSize: 14 }}>✿</span>
            <div className="h-px w-16 sm:w-28" style={{ background: "linear-gradient(to left, transparent, rgba(255,180,200,0.3))" }} />
          </motion.div>

          <style>{`
            @keyframes pulse-soft { 0%,100%{opacity:.45} 50%{opacity:.7} }
          `}</style>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
