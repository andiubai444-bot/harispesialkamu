"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type JSX,
} from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";

type AppState = "idle" | "exploding" | "covering" | "revealed";
type FlowerKind = "lily" | "rose" | "petal";

interface Particle {
  id:        number;
  kind:      FlowerKind;
  x:         number;
  y:         number;
  size:      number;
  rotation:  number;
  rotSpeed:  number;
  fallSpeed: number;
  swayAmp:   number;
  swayFreq:  number;
  swayOffset:number;
  opacity:   number;
  color:     string;
  originX:   number;
  originY:   number;
  targetX:   number;
  targetY:   number;
  progress:  number;
  launched:  boolean;
  delay:     number;
}

interface GiftBoxIntroProps {
  recipientName?: string;
  onRevealComplete?: () => void;
}

let _pid = 0;

function makeParticle(phase: "explode" | "drift", cx = 50, cy = 50): Particle {
  const roll = Math.random();
  const kind: FlowerKind = roll < 0.4 ? "lily" : roll < 0.7 ? "rose" : "petal";
  const angle = Math.random() * Math.PI * 2;
  const dist  = phase === "explode" ? 30 + Math.random() * 70 : Math.random() * 100;
  const tx    = cx + Math.cos(angle) * dist;
  const ty    = cy + Math.sin(angle) * dist * 0.85;
  const isFlower = kind !== "petal";

  return {
    id:         _pid++,
    kind,
    x:          phase === "explode" ? cx : tx,
    y:          phase === "explode" ? cy : ty,
    size:       isFlower ? 28 + Math.random() * 24 : 7 + Math.random() * 10,
    rotation:   Math.random() * Math.PI * 2,
    rotSpeed:   (Math.random() - 0.5) * (isFlower ? 0.6 : 1.4),
    fallSpeed:  isFlower ? 5 + Math.random() * 8 : 12 + Math.random() * 16,
    swayAmp:    isFlower ? 0.6 + Math.random() * 1.8 : 1.8 + Math.random() * 3.0,
    swayFreq:   0.2 + Math.random() * 0.4,
    swayOffset: Math.random() * Math.PI * 2,
    opacity:    0.55 + Math.random() * 0.4,
    color:      kind === "rose" ? "#c0112a" : kind === "lily" ? "#ffffff" : (Math.random() > 0.5 ? "#ffffff" : "#c0112a"),
    originX:    cx,
    originY:    cy,
    targetX:    tx,
    targetY:    ty,
    progress:   phase === "explode" ? 0 : 1,
    launched:   phase !== "explode",
    delay:      phase === "explode" ? Math.random() * 0.3 : 0,
  };
}

function drawFlower(ctx: CanvasRenderingContext2D, p: Particle, W: number, H: number) {
  const px = (p.x / 100) * W;
  const py = (p.y / 100) * H;
  const r  = p.size * 0.5;

  ctx.save();
  ctx.globalAlpha = p.opacity;
  ctx.translate(px, py);
  ctx.rotate(p.rotation);

  if (p.kind === "lily") {
    ctx.fillStyle = "#f8f0f6";
    for (let i = 0; i < 6; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI) / 3);
      ctx.beginPath();
      ctx.ellipse(0, -r * 0.7, r * 0.22, r * 0.48, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = "#f9e87a";
    ctx.fill();

  } else if (p.kind === "rose") {
    const cols = ["#c0112a", "#a00820", "#d41830"];
    [r * 0.9, r * 0.65, r * 0.42].forEach((rad, li) => {
      ctx.fillStyle = cols[li];
      const n = 6 - li;
      for (let i = 0; i < n; i++) {
        ctx.save();
        ctx.rotate(i * (Math.PI * 2 / n) + li * 0.3);
        ctx.beginPath();
        ctx.ellipse(0, -rad, rad * 0.28, rad * 0.22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.15, 0, Math.PI * 2);
    ctx.fillStyle = "#ffd080";
    ctx.fill();

  } else {
    ctx.fillStyle = p.color === "#ffffff" ? "rgba(255,252,255,0.85)" : "rgba(192,17,42,0.8)";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo( r*0.25, -r*0.12, r*0.28, -r*0.52, 0, -r*0.75);
    ctx.bezierCurveTo(-r*0.28, -r*0.52, -r*0.25, -r*0.12, 0, 0);
    ctx.fill();
  }

  ctx.restore();
}

// ─── Canvas ──────────────────────────────────────────────────────────────────

function FlowerCanvas({ particles, onCoverDone, isExploding }: {
  particles: Particle[];
  onCoverDone: () => void;
  isExploding: boolean;
}): JSX.Element {
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const pRef          = useRef<Particle[]>(particles);
  const rafRef        = useRef<number>(0);
  const lastTsRef     = useRef<number | null>(null);
  const tRef          = useRef(0);
  const coverFiredRef = useRef(false);

  useEffect(() => { pRef.current = particles; }, [particles]);

  useEffect(() => {
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
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.05);
      lastTsRef.current = ts;
      tRef.current += dt;
      const t = tRef.current;
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      const ps = pRef.current;
      let covered = 0;

      for (const p of ps) {
        if (!p.launched) {
          if (t >= p.delay) p.launched = true;
          else continue;
        }
        if (p.progress < 1) {
          p.progress = Math.min(1, p.progress + 1.6 * dt);
          const ease = 1 - Math.pow(1 - p.progress, 3);
          p.x = p.originX + (p.targetX - p.originX) * ease;
          p.y = p.originY + (p.targetY - p.originY) * ease;
        } else {
          p.x += Math.sin(t * p.swayFreq + p.swayOffset) * p.swayAmp * dt * 0.5;
          p.y += p.fallSpeed * dt;
          if (p.y >= -5 && p.y <= 110) covered++;
        }
        p.rotation += p.rotSpeed * dt;
        drawFlower(ctx, p, W, H);
      }

      if (isExploding && t > 0.6 && ps.length < 70 && Math.random() < 0.05) {
        ps.push(makeParticle("drift"));
      }

      if (!coverFiredRef.current && covered >= 50) {
        coverFiredRef.current = true;
        onCoverDone();
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, [isExploding, onCoverDone]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />;
}

// ─── Gift Box SVG ─────────────────────────────────────────────────────────────

function GiftBoxSVG(): JSX.Element {
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="112" rx="30" ry="6" fill="rgba(0,0,0,0.25)" />
      <rect x="18" y="58" width="84" height="52" rx="4" fill="url(#bodyGrad)" stroke="#8b0020" strokeWidth="1.5" />
      <rect x="14" y="44" width="92" height="18" rx="4" fill="url(#lidGrad)"  stroke="#8b0020" strokeWidth="1.5" />
      <rect x="53" y="58" width="14" height="52" fill="url(#ribbonV)" rx="2" />
      <rect x="14" y="49" width="92" height="8"  fill="url(#ribbonH)" rx="2" />
      <ellipse cx="44" cy="40" rx="16" ry="10" fill="url(#bowGrad)" transform="rotate(-30 44 40)" stroke="#8b0020" strokeWidth="0.8" />
      <ellipse cx="76" cy="40" rx="16" ry="10" fill="url(#bowGrad)" transform="rotate(30 76 40)"  stroke="#8b0020" strokeWidth="0.8" />
      <ellipse cx="60" cy="44" rx="9"  ry="7"  fill="url(#knotGrad)" stroke="#8b0020" strokeWidth="0.8" />
      <path d="M52 50 Q46 60 40 70" stroke="#c0102e" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M68 50 Q74 60 80 70" stroke="#c0102e" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7" />
      <defs>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#c0102e" />
          <stop offset="100%" stopColor="#880018" />
        </linearGradient>
        <linearGradient id="lidGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#d42040" />
          <stop offset="100%" stopColor="#a00824" />
        </linearGradient>
        <linearGradient id="ribbonV" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#f0204c" />
          <stop offset="50%"  stopColor="#ff6080" />
          <stop offset="100%" stopColor="#f0204c" />
        </linearGradient>
        <linearGradient id="ribbonH" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#ff6080" />
          <stop offset="50%"  stopColor="#f0204c" />
          <stop offset="100%" stopColor="#ff6080" />
        </linearGradient>
        <radialGradient id="bowGrad">
          <stop offset="0%"   stopColor="#ff6080" />
          <stop offset="100%" stopColor="#c01030" />
        </radialGradient>
        <radialGradient id="knotGrad">
          <stop offset="0%"   stopColor="#ff8090" />
          <stop offset="100%" stopColor="#d01838" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function GiftBoxIntro({
  recipientName    = "Ameisha Nadilah",
  onRevealComplete,
}: GiftBoxIntroProps): JSX.Element | null {
  const [appState,  setAppState]  = useState<AppState>("idle");
  const [particles, setParticles] = useState<Particle[]>([]);
  const boxControls = useAnimation();

  useEffect(() => {
    if (appState !== "idle") return;
    boxControls.start({
      scale: [1, 1.06, 1],
      transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
    });
  }, [appState, boxControls]);

  const handleBoxClick = useCallback(async () => {
    if (appState !== "idle") return;
    setAppState("exploding");
    await boxControls.start({
      scale:  [1, 1.18, 0.9, 1.22, 0.0],
      rotate: [0, -8, 10, -5, 0],
      transition: { duration: 0.55, ease: "easeInOut" },
    });
    setParticles(Array.from({ length: 80 }, () => makeParticle("explode", 50, 50)));
  }, [appState, boxControls]);

  const handleCoverDone = useCallback(() => {
    if (appState !== "exploding") return;
    setAppState("covering");
    setTimeout(() => setAppState("revealed"), 600);
  }, [appState]);

  if (appState === "revealed") {
    return <RevealScreen recipientName={recipientName} onAnimationComplete={() => onRevealComplete?.()} />;
  }

  return (
    <div className="fixed inset-0 z-[99999] overflow-hidden bg-[#3a0008] flex items-center justify-center">
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[5%] left-[5%] w-[50%] h-[50%] rounded-full
          bg-[radial-gradient(ellipse,rgba(180,10,40,0.15)_0%,transparent_70%)] blur-[70px]" />
        <div className="absolute bottom-[5%] right-[5%] w-[45%] h-[45%] rounded-full
          bg-[radial-gradient(ellipse,rgba(160,5,30,0.12)_0%,transparent_70%)] blur-[80px]" />
      </div>

      <AnimatePresence>
        {appState === "exploding" && (
          <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
            <FlowerCanvas particles={particles} onCoverDone={handleCoverDone} isExploding={true} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(appState === "idle" || appState === "exploding") && (
          <motion.div
            key="giftbox"
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={boxControls}
            exit={{ opacity: 0, scale: 0, transition: { duration: 0.25 } }}
            className="relative z-10 cursor-pointer select-none"
            style={{ width: "min(180px, 42vw)", height: "min(180px, 42vw)" }}
            onClick={handleBoxClick}
            whileTap={{ scale: 0.92 }}
          >
            <GiftBoxSVG />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {appState === "idle" && (
          <motion.p
            key="hint"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.3 } }}
            transition={{ delay: 1.2, duration: 0.7 }}
            className="absolute bottom-[18%] left-0 right-0 text-center pointer-events-none
              text-[rgba(255,180,200,0.55)] text-xs sm:text-sm tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            ketuk untuk membuka
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Reveal Screen ────────────────────────────────────────────────────────────

function RevealScreen({ recipientName, onAnimationComplete }: {
  recipientName: string;
  onAnimationComplete: () => void;
}): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const psRef     = useRef<Particle[]>(Array.from({ length: 55 }, () => makeParticle("drift")));
  const rafRef    = useRef<number>(0);
  const lastTsRef = useRef<number | null>(null);
  const tRef      = useRef(0);

  useEffect(() => {
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
      if (!ctx) return;
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.05);
      lastTsRef.current = ts;
      tRef.current += dt;
      const t = tRef.current;
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      for (const p of psRef.current) {
        p.x += Math.sin(t * p.swayFreq + p.swayOffset) * p.swayAmp * dt * 0.4;
        p.y += p.fallSpeed * dt;
        p.rotation += p.rotSpeed * dt;
        if (p.y > 120) {
          p.y = -8;
          p.x = Math.random() * 100;
          p.rotation = Math.random() * Math.PI * 2;
        }
        drawFlower(ctx, p, W, H);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, []);

  const font = `'Cormorant Garamond', 'Georgia', serif`;

  return (
    <motion.div
      className="fixed inset-0 z-[99999] overflow-hidden bg-[#3a0008] flex flex-col items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      onAnimationComplete={onAnimationComplete}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />

      <div aria-hidden className="absolute inset-0 pointer-events-none
        bg-[radial-gradient(ellipse_at_50%_50%,transparent_22%,rgba(4,0,2,0.42)_62%,rgba(2,0,1,0.72)_100%)]" />
      <div aria-hidden className="absolute bottom-0 left-0 right-0 h-[55%] pointer-events-none
        bg-gradient-to-t from-[rgba(8,0,3,0.88)] via-[rgba(18,0,6,0.44)] to-transparent" />

      <div className="relative z-10 flex flex-col items-center text-center px-8 gap-0">

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.1 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-[rgba(255,180,200,0.45)]" />
          <svg width="18" height="18" viewBox="0 0 18 18" className="text-[rgba(255,180,200,0.5)]">
            <path d="M9 1 L10.2 6.8 L16 6.8 L11.4 10.2 L13.1 16 L9 12.4 L4.9 16 L6.6 10.2 L2 6.8 L7.8 6.8 Z" fill="currentColor" />
          </svg>
          <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-[rgba(255,180,200,0.45)]" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.9 }}
          className="text-[rgba(255,190,210,0.52)] text-[0.58rem] sm:text-[0.64rem] tracking-[0.42em] uppercase mb-4"
          style={{ fontFamily: font }}
        >
          dengan sepenuh hati
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 1.0 }}
          className="text-[rgba(255,170,195,0.65)] text-[clamp(0.9rem,2.5vw,1.2rem)] tracking-[0.12em] mb-2"
          style={{ fontFamily: font, fontStyle: "italic" }}
        >
          Untuk
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.1, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(2.2rem,7vw,5rem)] font-light text-[rgba(255,240,245,0.96)] leading-none mb-6"
          style={{
            fontFamily: font,
            fontStyle: "italic",
            letterSpacing: "0.04em",
            textShadow: "0 2px 40px rgba(220,80,110,0.32), 0 0 80px rgba(160,30,60,0.18)",
          }}
        >
          {recipientName}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 1.5, duration: 1.0 }}
          className="flex items-center gap-3 mb-7"
        >
          <div className="h-px w-8 sm:w-14 bg-gradient-to-r from-transparent to-[rgba(255,180,200,0.35)]" />
          <span className="text-[rgba(255,170,195,0.5)] text-lg" aria-hidden>✿</span>
          <div className="h-px w-8 sm:w-14 bg-gradient-to-l from-transparent to-[rgba(255,180,200,0.35)]" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 1.0 }}
          className="text-[rgba(255,210,222,0.62)] text-[clamp(0.82rem,2vw,1rem)] leading-[2.1] tracking-[0.04em] max-w-[340px]"
          style={{ fontFamily: font, fontStyle: "italic" }}
        >
          Seperti lily putih yang mekar di pagi hari,<br />
          kehadiranmu selalu menjadi cahaya.
        </motion.p>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');
      `}</style>
    </motion.div>
  );
}
