"use client";

import { useEffect, useRef, useState, useCallback, type JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Stage = "intro" | "exploding" | "fadeout";

interface Particle {
  id:         number;
  imgIndex:   number;
  x:          number;   // % viewport width
  y:          number;   // % viewport height
  size:       number;   // px
  rotation:   number;
  rotSpeed:   number;
  fallSpeed:  number;
  swayAmp:    number;
  swayFreq:   number;
  swayOffset: number;
  opacity:    number;
  // burst phase
  ox: number; oy: number;
  tx: number; ty: number;
  progress:   number;
  launched:   boolean;
  delay:      number;
}

const FLOWER_SRCS = [
  "/flowers/LilyPink.png",
  "/flowers/LilyPutih.png",
  "/flowers/KelopakMerah.png",
  "/flowers/KelopakPutih.png",
  "/flowers/MawarMerah.png",
];

// More flowers, fewer petals
const WEIGHTS = [0.28, 0.24, 0.14, 0.12, 0.22];

function weightedRandom(): number {
  const r = Math.random();
  let acc = 0;
  for (let i = 0; i < WEIGHTS.length; i++) {
    acc += WEIGHTS[i];
    if (r < acc) return i;
  }
  return WEIGHTS.length - 1;
}

let _id = 0;

function makeParticle(phase: "burst" | "drift", cx = 50, cy = 50): Particle {
  const imgIndex = weightedRandom();
  const isFlower = imgIndex < 2 || imgIndex === 4;
  const ang  = Math.random() * Math.PI * 2;
  const dist = phase === "burst" ? 20 + Math.random() * 65 : Math.random() * 110;
  const tx   = cx + Math.cos(ang) * dist;
  const ty   = cy + Math.sin(ang) * dist * 0.8;

  return {
    id:         _id++,
    imgIndex,
    x:          phase === "burst" ? cx : Math.random() * 110 - 5,
    y:          phase === "burst" ? cy : -15 - Math.random() * 30, // spawn above screen
    size:       isFlower
                  ? 160 + Math.random() * 120  // flowers: 160–280px
                  :  55 + Math.random() * 50,  // petals:  55–105px
    rotation:   Math.random() * Math.PI * 2,
    rotSpeed:   (Math.random() - 0.5) * (isFlower ? 0.3 : 0.7),
    fallSpeed:  isFlower ? 5 + Math.random() * 6 : 9 + Math.random() * 10,
    swayAmp:    isFlower ? 0.3 + Math.random() * 1.0 : 0.8 + Math.random() * 1.6,
    swayFreq:   0.12 + Math.random() * 0.28,
    swayOffset: Math.random() * Math.PI * 2,
    opacity:    0.88 + Math.random() * 0.12,
    ox: cx, oy: cy, tx, ty,
    progress:   phase === "burst" ? 0 : 1,
    launched:   phase !== "burst",
    delay:      phase === "burst" ? Math.random() * 0.22 : 0,
  };
}

// Pre-spawn drift particles scattered across top of screen
function makeDriftParticle(): Particle {
  const imgIndex = weightedRandom();
  const isFlower = imgIndex < 2 || imgIndex === 4;
  return {
    id:         _id++,
    imgIndex,
    x:          Math.random() * 110 - 5,
    y:          -20 - Math.random() * 60,
    size:       isFlower
                  ? 160 + Math.random() * 120
                  :  55 + Math.random() * 50,
    rotation:   Math.random() * Math.PI * 2,
    rotSpeed:   (Math.random() - 0.5) * (isFlower ? 0.3 : 0.7),
    fallSpeed:  isFlower ? 5 + Math.random() * 6 : 9 + Math.random() * 10,
    swayAmp:    isFlower ? 0.3 + Math.random() * 1.0 : 0.8 + Math.random() * 1.6,
    swayFreq:   0.12 + Math.random() * 0.28,
    swayOffset: Math.random() * Math.PI * 2,
    opacity:    0.88 + Math.random() * 0.12,
    ox: 50, oy: 50, tx: 50, ty: 50,
    progress:   1,
    launched:   true,
    delay:      0,
  };
}

// ─── Canvas ───────────────────────────────────────────────────────────────────

function FlowerCanvas({ onScreenFilled }: { onScreenFilled: () => void }): JSX.Element {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const psRef      = useRef<Particle[]>([]);
  const imgsRef    = useRef<HTMLImageElement[]>([]);
  const rafRef     = useRef<number>(0);
  const tsRef      = useRef<number | null>(null);
  const tRef       = useRef(0);
  const firedRef   = useRef(false);
  const readyRef   = useRef(false);

  useEffect(() => {
    let loaded = 0;
    const imgs: HTMLImageElement[] = FLOWER_SRCS.map((src) => {
      const img = new window.Image();
      img.src = src;
      img.onload = () => {
        loaded++;
        if (loaded === FLOWER_SRCS.length) {
          imgsRef.current = imgs;
          readyRef.current = true;
          // Initial burst from center + pre-scattered drifters
          const burst  = Array.from({ length: 40 }, () => makeParticle("burst", 50, 50));
          const drifts = Array.from({ length: 35 }, () => makeDriftParticle());
          psRef.current = [...burst, ...drifts];
        }
      };
      img.onerror = () => { loaded++; };
      return img;
    });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const loop = (ts: number) => {
      if (!tsRef.current) tsRef.current = ts;
      const dt = Math.min((ts - tsRef.current) / 1000, 0.05);
      tsRef.current = ts;
      tRef.current += dt;
      const t = tRef.current;
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      if (!readyRef.current) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const ps   = psRef.current;
      const imgs = imgsRef.current;
      let onScreen = 0;

      for (const p of ps) {
        if (!p.launched) {
          if (t >= p.delay) p.launched = true;
          else continue;
        }

        // Burst phase — fly outward
        if (p.progress < 1) {
          p.progress = Math.min(1, p.progress + 1.5 * dt);
          const e = 1 - Math.pow(1 - p.progress, 3);
          p.x = p.ox + (p.tx - p.ox) * e;
          p.y = p.oy + (p.ty - p.oy) * e;
        } else {
          // Fall + sway
          p.x += Math.sin(t * p.swayFreq + p.swayOffset) * p.swayAmp * dt * 0.5;
          p.y += p.fallSpeed * dt;

          // Recycle off-screen particles back to top
          if (p.y > 115) {
            p.y = -15 - Math.random() * 20;
            p.x = Math.random() * 110 - 5;
            p.rotation = Math.random() * Math.PI * 2;
          }

          if (p.y >= -10 && p.y <= 110) onScreen++;
        }

        p.rotation += p.rotSpeed * dt;

        const img = imgs[p.imgIndex];
        if (!img || !img.complete) continue;

        const px = (p.x / 100) * W;
        const py = (p.y / 100) * H;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.globalCompositeOperation = "source-over";
        ctx.translate(px, py);
        ctx.rotate(p.rotation);
        ctx.drawImage(img, -p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }

      // Keep spawning new drifters to fill screen densely
      if (t > 0.3 && ps.length < 90 && Math.random() < 0.08)
        ps.push(makeDriftParticle());

      // Fire when enough flowers cover the screen
      if (!firedRef.current && onScreen >= 55) {
        firedRef.current = true;
        onScreenFilled();
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, [onScreenFilled]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
    />
  );
}

// ─── Gift Box ─────────────────────────────────────────────────────────────────

function GiftBox(): JSX.Element {
  return (
    <svg viewBox="0 0 140 150" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="70" cy="143" rx="36" ry="7" fill="rgba(0,0,0,0.18)" />
      <rect x="16" y="68" width="108" height="68" rx="5" fill="url(#bG)" stroke="#7a0018" strokeWidth="1.5" />
      <rect x="10" y="50" width="120" height="22" rx="5" fill="url(#lG)" stroke="#7a0018" strokeWidth="1.5" />
      <rect x="61" y="68" width="18" height="68" fill="url(#rV)" rx="2" />
      <rect x="10" y="56" width="120" height="10" fill="url(#rH)" rx="2" />
      <ellipse cx="50" cy="46" rx="20" ry="12" fill="url(#bow)" transform="rotate(-28 50 46)" stroke="#7a0018" strokeWidth="0.8" />
      <ellipse cx="90" cy="46" rx="20" ry="12" fill="url(#bow)" transform="rotate(28 90 46)" stroke="#7a0018" strokeWidth="0.8" />
      <ellipse cx="70" cy="52" rx="11" ry="9" fill="url(#knot)" stroke="#7a0018" strokeWidth="0.8" />
      <path d="M62 59 Q54 72 46 86" stroke="#b8102a" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.65" />
      <path d="M78 59 Q86 72 94 86" stroke="#b8102a" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.65" />
      {([[22,42],[118,56],[28,96],[114,90]] as [number,number][]).map(([x,y],i) => (
        <g key={i} transform={`translate(${x},${y})`} opacity="0.6">
          <line x1="-5" y1="0" x2="5" y2="0" stroke="#ffd4e8" strokeWidth="1.4" />
          <line x1="0" y1="-5" x2="0" y2="5" stroke="#ffd4e8" strokeWidth="1.4" />
        </g>
      ))}
      <defs>
        <linearGradient id="bG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#cc1230" /><stop offset="100%" stopColor="#8c0018" />
        </linearGradient>
        <linearGradient id="lG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e02244" /><stop offset="100%" stopColor="#a80c28" />
        </linearGradient>
        <linearGradient id="rV" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f0204c" /><stop offset="50%" stopColor="#ff6080" /><stop offset="100%" stopColor="#f0204c" />
        </linearGradient>
        <linearGradient id="rH" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff6080" /><stop offset="50%" stopColor="#f0204c" /><stop offset="100%" stopColor="#ff6080" />
        </linearGradient>
        <radialGradient id="bow">
          <stop offset="0%" stopColor="#ff6080" /><stop offset="100%" stopColor="#c01030" />
        </radialGradient>
        <radialGradient id="knot">
          <stop offset="0%" stopColor="#ff8090" /><stop offset="100%" stopColor="#d01838" />
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

  const handleScreenFilled = useCallback(() => {
    setTimeout(() => setStage("fadeout"), 300);
    setTimeout(() => onDone(), 1100);
  }, [onDone]);

  return (
    <AnimatePresence>
      {stage !== "fadeout" && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "linear-gradient(135deg, #2a0008 0%, #3e000c 60%, #1a0004 100%)" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.9, ease: "easeInOut" } }}
        >
          {/* Ambient glows */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-1/4 w-[60%] h-[45%] rounded-full opacity-20"
              style={{ background: "radial-gradient(ellipse, #ff2050 0%, transparent 70%)", filter: "blur(60px)" }} />
            <div className="absolute bottom-0 right-1/4 w-[50%] h-[40%] rounded-full opacity-15"
              style={{ background: "radial-gradient(ellipse, #cc0030 0%, transparent 70%)", filter: "blur(70px)" }} />
          </div>

          {/* Flower canvas — fills screen when exploding */}
          {stage === "exploding" && (
            <div className="absolute inset-0">
              <FlowerCanvas onScreenFilled={handleScreenFilled} />
            </div>
          )}

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center gap-6 select-none">

            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-[10px] sm:text-xs tracking-[0.45em] uppercase text-left w-full px-6"
              style={{ color: "rgba(255,180,200,0.5)", fontFamily: "'Georgia', serif" }}
            >
              untuk Ameisha Pacarku yang istimewa
            </motion.p>

            {/* Gift box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 30 }}
              animate={
                stage === "exploding"
                  ? { scale: [1, 1.25, 0.8, 1.35, 0], opacity: [1,1,1,1,0], rotate: [0,-10,12,-6,0],
                      transition: { duration: 0.6, ease: "easeInOut" } }
                  : { opacity: 1, scale: 1, y: 0,
                      transition: { delay: 0.2, duration: 0.7, ease: [0.22,1,0.36,1] } }
              }
              whileHover={stage === "intro" ? { scale: 1.07, transition: { duration: 0.2 } } : undefined}
              whileTap={stage === "intro"   ? { scale: 0.93 } : undefined}
              onClick={handleClick}
              className="relative cursor-pointer"
              style={{ width: "min(220px, 54vw)", height: "min(236px, 58vw)" }}
            >
              <div aria-hidden
                className="absolute inset-x-4 bottom-0 h-10 rounded-full opacity-50"
                style={{ background: "radial-gradient(ellipse, #ff2050 0%, transparent 70%)", filter: "blur(14px)" }}
              />
              <GiftBox />
            </motion.div>

            {/* Hint */}
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
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 3 L10 14 M5 10 L10 15 L15 10"
                        stroke="rgba(255,180,200,0.45)" strokeWidth="1.8"
                        strokeLinecap="round" strokeLinejoin="round" />
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

          {/* Bottom line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 1.1, duration: 1.0 }}
            className="absolute bottom-10 left-0 right-0 flex items-center justify-center gap-4"
          >
            <div className="h-px w-16 sm:w-28"
              style={{ background: "linear-gradient(to right, transparent, rgba(255,180,200,0.3))" }} />
            <span style={{ color: "rgba(255,170,195,0.35)", fontSize: 14 }}>✿</span>
            <div className="h-px w-16 sm:w-28"
              style={{ background: "linear-gradient(to left, transparent, rgba(255,180,200,0.3))" }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
