"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type JSX,
} from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// INTERFACES & TYPES
// ─────────────────────────────────────────────────────────────────────────────

type AppState = "idle" | "exploding" | "covering" | "revealed";
type FlowerKind = "lily" | "rose" | "petal-white" | "petal-red" | "bud";
type DepthLayer = 0 | 1 | 2;

interface FlowerPalette {
  outerPetal: string;
  midPetal:   string;
  innerPetal: string;
  vein:       string;
  pistil:     string;
  stamen:     string;
}

interface ExplosionParticle {
  id:         number;
  kind:       FlowerKind;
  /** Starting position (viewport %) */
  originX:    number;
  originY:    number;
  /** Target position after explosion (viewport %) */
  targetX:    number;
  targetY:    number;
  /** Current canvas position (%) */
  x:          number;
  y:          number;
  size:       number;
  rotation:   number;
  rotSpeed:   number;
  fallSpeed:  number;
  swayAmp:    number;
  swayFreq:   number;
  swayOffset: number;
  opacity:    number;
  layer:      DepthLayer;
  variant:    number;
  /** 0–1: how far along the explosion trajectory */
  progress:   number;
  /** speed of progress (0–1 per second) */
  launchSpeed:number;
  launched:   boolean;
  delay:      number;   // seconds before this particle launches
}

interface GiftBoxIntroProps {
  recipientName?: string;
  onRevealComplete?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// FLOWER PALETTES
// ─────────────────────────────────────────────────────────────────────────────

const LILY_PALETTES: FlowerPalette[] = [
  { outerPetal:"#ffffff", midPetal:"#f8eff6", innerPetal:"#f0dcea",
    vein:"#d4a0c0", pistil:"#fffaf8", stamen:"#f9e87a" },
  { outerPetal:"#fdf4f8", midPetal:"#f4e2ef", innerPetal:"#eacede",
    vein:"#c490b4", pistil:"#fff6fa", stamen:"#f5e060" },
  { outerPetal:"#f8f0f6", midPetal:"#eedde8", innerPetal:"#e4ccda",
    vein:"#b880a6", pistil:"#fef0f8", stamen:"#fde870" },
];

const ROSE_PALETTES: FlowerPalette[] = [
  { outerPetal:"#c0112a", midPetal:"#a00820", innerPetal:"#840016",
    vein:"#60000e", pistil:"#e01830", stamen:"#ffd080" },
  { outerPetal:"#d41830", midPetal:"#b80e24", innerPetal:"#9c0418",
    vein:"#70000e", pistil:"#e82840", stamen:"#ffcd70" },
  { outerPetal:"#aa0820", midPetal:"#8c0018", innerPetal:"#720010",
    vein:"#4e0008", pistil:"#cc1828", stamen:"#ffc860" },
];

// ─────────────────────────────────────────────────────────────────────────────
// CANVAS DRAWING — WHITE LILY
// ─────────────────────────────────────────────────────────────────────────────

function drawLily(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  sz: number, rot: number,
  op: number, variant: number
): void {
  const p = LILY_PALETTES[variant % LILY_PALETTES.length];
  const r = sz * 0.5;

  ctx.save();
  ctx.globalAlpha = op;
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.shadowColor = "rgba(200,150,180,0.2)";
  ctx.shadowBlur  = sz * 0.25;

  for (let i = 0; i < 6; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI) / 3);

    const g = ctx.createLinearGradient(0, r * 0.08, 0, -r * 1.05);
    g.addColorStop(0,    p.pistil);
    g.addColorStop(0.18, p.innerPetal);
    g.addColorStop(0.58, p.midPetal);
    g.addColorStop(1,    p.outerPetal);

    // Kelopak melengkung alami
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo( r*0.40, -r*0.18,  r*0.46, -r*0.68,  r*0.15, -r*1.02);
    ctx.bezierCurveTo( 0,      -r*1.08, -r*0.15, -r*1.02, -r*0.15, -r*1.02);
    ctx.bezierCurveTo(-r*0.46, -r*0.68, -r*0.40, -r*0.18,  0,       0);
    ctx.fillStyle = g;
    ctx.fill();

    // Urat tengah
    ctx.beginPath();
    ctx.moveTo(0, -r*0.04);
    ctx.quadraticCurveTo(r*0.035, -r*0.52, 0, -r*0.96);
    ctx.strokeStyle = p.vein;
    ctx.globalAlpha = op * 0.24;
    ctx.lineWidth   = r * 0.038;
    ctx.stroke();

    // Bintik lily (spots)
    ctx.globalAlpha = op * 0.52;
    for (let d = 0; d < 7; d++) {
      const spread = Math.sin(d * 1.4 + i * 0.9) * r * 0.16;
      ctx.beginPath();
      ctx.arc(spread, -r * (0.24 + d * 0.09), r * 0.022 + (d%3)*r*0.007, 0, Math.PI*2);
      ctx.fillStyle = p.vein;
      ctx.fill();
    }

    ctx.globalAlpha = op;
    ctx.restore();
  }

  // Pistil
  ctx.shadowBlur = 0;
  const cg = ctx.createRadialGradient(0,0,0, 0,0,r*0.25);
  cg.addColorStop(0,   p.stamen);
  cg.addColorStop(0.6, p.pistil);
  cg.addColorStop(1,   p.innerPetal);
  ctx.beginPath();
  ctx.arc(0, 0, r*0.25, 0, Math.PI*2);
  ctx.fillStyle = cg;
  ctx.fill();

  // 6 Benang sari
  for (let i = 0; i < 6; i++) {
    ctx.save();
    ctx.rotate(i*(Math.PI/3) + Math.PI/6);
    ctx.beginPath();
    ctx.moveTo(0, -r*0.06);
    ctx.lineTo(r*0.025, -r*0.43);
    ctx.strokeStyle = p.vein;
    ctx.globalAlpha = op * 0.55;
    ctx.lineWidth   = r * 0.02;
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(r*0.025, -r*0.46, r*0.048, r*0.026, 0.4, 0, Math.PI*2);
    ctx.fillStyle   = p.stamen;
    ctx.globalAlpha = op * 0.9;
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────────────────
// CANVAS DRAWING — RED ROSE
// ─────────────────────────────────────────────────────────────────────────────

function drawRose(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  sz: number, rot: number,
  op: number, variant: number
): void {
  const p = ROSE_PALETTES[variant % ROSE_PALETTES.length];
  const r = sz * 0.48;

  ctx.save();
  ctx.globalAlpha = op;
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.shadowColor = "rgba(80,0,20,0.22)";
  ctx.shadowBlur  = sz * 0.2;

  const layers = [
    { n:8, rad:r*0.94, pw:0.30, ph:0.27, col:p.outerPetal, a:0.87 },
    { n:7, rad:r*0.70, pw:0.26, ph:0.24, col:p.midPetal,   a:0.90 },
    { n:6, rad:r*0.50, pw:0.22, ph:0.20, col:p.innerPetal, a:0.93 },
    { n:5, rad:r*0.33, pw:0.18, ph:0.17, col:p.midPetal,   a:0.95 },
  ];

  layers.forEach(({ n, rad, pw, ph, col, a }, li) => {
    for (let i = 0; i < n; i++) {
      ctx.save();
      ctx.rotate(i*(Math.PI*2/n) + li*0.22);
      const g = ctx.createRadialGradient(0,-rad*0.5,0, 0,-rad*0.5,rad*0.58);
      g.addColorStop(0, col);
      g.addColorStop(1, p.pistil);
      ctx.beginPath();
      ctx.ellipse(0, -rad, rad*pw, rad*ph, 0, 0, Math.PI*2);
      ctx.fillStyle   = g;
      ctx.globalAlpha = op * a;
      ctx.fill();
      ctx.restore();
    }
  });

  ctx.shadowBlur = 0;
  const cg = ctx.createRadialGradient(0,0,0, 0,0,r*0.17);
  cg.addColorStop(0, p.stamen);
  cg.addColorStop(1, p.innerPetal);
  ctx.beginPath();
  ctx.arc(0, 0, r*0.17, 0, Math.PI*2);
  ctx.fillStyle   = cg;
  ctx.globalAlpha = op;
  ctx.fill();

  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────────────────
// CANVAS DRAWING — LOOSE PETAL
// ─────────────────────────────────────────────────────────────────────────────

function drawPetal(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  sz: number, rot: number,
  op: number, white: boolean
): void {
  const baseCol = white
    ? `rgba(255,252,255,0.88)`
    : `rgba(${180 + Math.random()*30|0},${10+Math.random()*20|0},${30+Math.random()*20|0},0.82)`;

  ctx.save();
  ctx.globalAlpha = op * 0.68;
  ctx.translate(cx, cy);
  ctx.rotate(rot);

  const g = ctx.createLinearGradient(0, -sz*0.62, 0, sz*0.08);
  g.addColorStop(0, baseCol);
  g.addColorStop(1, white ? "rgba(255,240,250,0.05)" : "rgba(120,0,10,0.06)");

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo( sz*0.28, -sz*0.14,  sz*0.32, -sz*0.58,  0, -sz*0.82);
  ctx.bezierCurveTo(-sz*0.32, -sz*0.58, -sz*0.28, -sz*0.14,  0,  0);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────────────────
// CANVAS DRAWING — BUD
// ─────────────────────────────────────────────────────────────────────────────

function drawBud(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  sz: number, rot: number, op: number
): void {
  ctx.save();
  ctx.globalAlpha = op * 0.72;
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.beginPath();
  ctx.ellipse(0, -sz*0.42, sz*0.15, sz*0.38, 0, 0, Math.PI*2);
  ctx.fillStyle = "rgba(248,220,238,0.9)";
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(0, -sz*0.40, sz*0.08, sz*0.28, 0, 0, Math.PI*2);
  ctx.fillStyle = "rgba(220,160,190,0.8)";
  ctx.fill();
  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────────────────
// PARTICLE FACTORY
// ─────────────────────────────────────────────────────────────────────────────

let _pid = 0;

function makeExplosionParticle(
  phase: "explode" | "drift",
  centerX = 50,
  centerY = 50
): ExplosionParticle {
  const roll = Math.random();
  const kind: FlowerKind =
    roll < 0.40 ? "lily" :
    roll < 0.62 ? "rose" :
    roll < 0.76 ? "petal-white" :
    roll < 0.88 ? "petal-red"   : "bud";

  const angle   = Math.random() * Math.PI * 2;
  const dist    = phase === "explode"
    ? 35 + Math.random() * 80   // fly far out
    : Math.random() * 100;      // already scattered

  const targetX = centerX + Math.cos(angle) * dist;
  const targetY = centerY + Math.sin(angle) * dist * 0.85;

  const isFlower = kind === "lily" || kind === "rose";

  return {
    id:          _pid++,
    kind,
    originX:     centerX,
    originY:     centerY,
    targetX,
    targetY,
    x:           phase === "explode" ? centerX : targetX,
    y:           phase === "explode" ? centerY : targetY,
    size:        isFlower
                   ? (kind === "lily" ? 42 + Math.random()*50 : 32 + Math.random()*38)
                   : 9  + Math.random()*16,
    rotation:    Math.random() * Math.PI * 2,
    rotSpeed:    (Math.random() - 0.5) * (isFlower ? 0.8 : 1.8),
    fallSpeed:   isFlower ? 6 + Math.random()*10 : 14 + Math.random()*20,
    swayAmp:     isFlower ? 0.8 + Math.random()*2.4 : 2.2 + Math.random()*4.0,
    swayFreq:    0.22 + Math.random()*0.46,
    swayOffset:  Math.random() * Math.PI * 2,
    opacity:     0.50 + Math.random()*0.48,
    layer:       Math.floor(Math.random()*3) as DepthLayer,
    variant:     Math.floor(Math.random()*3),
    progress:    phase === "explode" ? 0 : 1,
    launchSpeed: 1.2 + Math.random()*1.8,
    launched:    phase !== "explode",
    delay:       phase === "explode" ? Math.random()*0.35 : 0,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// CANVAS COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface FlowerCanvasProps {
  particles:    ExplosionParticle[];
  onCoverDone:  () => void;
  isExploding:  boolean;
}

function FlowerCanvas({ particles, onCoverDone, isExploding }: FlowerCanvasProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pRef      = useRef<ExplosionParticle[]>(particles);
  const rafRef    = useRef<number>(0);
  const lastTsRef = useRef<number | null>(null);
  const tRef      = useRef(0);
  const coveredRef= useRef(false);
  const coverFiredRef = useRef(false);

  // sync particles from outside
  useEffect(() => { pRef.current = particles; }, [particles]);

  const renderOne = useCallback(
    (p: ExplosionParticle, ctx: CanvasRenderingContext2D, W: number, H: number) => {
      const px = (p.x / 100) * W;
      const py = (p.y / 100) * H;

      const blur   = p.layer === 0 ? 3.0 : p.layer === 1 ? 0.9 : 0;
      const bright = p.layer === 0 ? 0.46 : p.layer === 1 ? 0.70 : 1.0;
      const opMul  = p.layer === 0 ? 0.46 : p.layer === 1 ? 0.73 : 1.0;

      ctx.filter = blur > 0
        ? `blur(${blur}px) brightness(${bright})`
        : bright < 1 ? `brightness(${bright})` : "none";

      const op = p.opacity * opMul;

      switch (p.kind) {
        case "lily":        drawLily(ctx, px, py, p.size, p.rotation, op, p.variant); break;
        case "rose":        drawRose(ctx, px, py, p.size, p.rotation, op, p.variant); break;
        case "petal-white": drawPetal(ctx, px, py, p.size, p.rotation, op, true);     break;
        case "petal-red":   drawPetal(ctx, px, py, p.size, p.rotation, op, false);    break;
        case "bud":         drawBud(ctx, px, py, p.size, p.rotation, op);             break;
      }
    }, []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      canvas!.width  = canvas!.offsetWidth;
      canvas!.height = canvas!.offsetHeight;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function loop(ts: number) {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.05);
      lastTsRef.current = ts;
      tRef.current += dt;
      const t  = tRef.current;
      const W  = canvas!.width;
      const H  = canvas!.height;

      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      const ps = pRef.current;
      ps.sort((a, b) => a.layer - b.layer);

      let coveredCount = 0;

      for (const p of ps) {
        // Explosion launch phase
        if (!p.launched) {
          if (t >= p.delay) {
            p.launched = true;
          } else {
            continue;
          }
        }

        if (p.progress < 1) {
          p.progress = Math.min(1, p.progress + p.launchSpeed * dt);
          // Ease out cubic for natural arc
          const ease = 1 - Math.pow(1 - p.progress, 3);
          p.x = p.originX + (p.targetX - p.originX) * ease;
          p.y = p.originY + (p.targetY - p.originY) * ease;
        } else {
          // Normal drift / fall after explosion
          const sway = Math.sin(t * p.swayFreq + p.swayOffset) * p.swayAmp;
          p.x += sway * dt * 0.5;
          p.y += p.fallSpeed * dt;

          // Count particles that "cover" the screen
          if (p.y >= -5 && p.y <= 110 && p.x >= -5 && p.x <= 105) {
            coveredCount++;
          }
        }

        p.rotation += p.rotSpeed * dt;
        renderOne(p, ctx, W, H);
      }

      ctx.filter = "none";

      // Spawn new drifting particles once explosion is done
      if (isExploding && t > 0.8 && ps.length < 160 && Math.random() < 0.06) {
        ps.push(makeExplosionParticle("drift"));
      }

      // Detect full cover: enough particles on screen
      if (!coverFiredRef.current && coveredCount >= 80) {
        coverFiredRef.current = true;
        coveredRef.current    = true;
        onCoverDone();
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, [isExploding, onCoverDone, renderOne]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GIFT BOX SVG
// ─────────────────────────────────────────────────────────────────────────────

function GiftBoxSVG(): JSX.Element {
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="60" cy="112" rx="30" ry="6" fill="rgba(0,0,0,0.25)" />

      {/* Box body */}
      <rect x="18" y="58" width="84" height="52" rx="4"
        fill="url(#bodyGrad)" stroke="#8b0020" strokeWidth="1.5" />

      {/* Lid */}
      <rect x="14" y="44" width="92" height="18" rx="4"
        fill="url(#lidGrad)" stroke="#8b0020" strokeWidth="1.5" />

      {/* Vertical ribbon on body */}
      <rect x="53" y="58" width="14" height="52"
        fill="url(#ribbonV)" rx="2" />

      {/* Horizontal ribbon on lid */}
      <rect x="14" y="49" width="92" height="8"
        fill="url(#ribbonH)" rx="2" />

      {/* Bow left loop */}
      <ellipse cx="44" cy="40" rx="16" ry="10" fill="url(#bowGrad)"
        transform="rotate(-30 44 40)" stroke="#8b0020" strokeWidth="0.8" />
      {/* Bow right loop */}
      <ellipse cx="76" cy="40" rx="16" ry="10" fill="url(#bowGrad)"
        transform="rotate(30 76 40)" stroke="#8b0020" strokeWidth="0.8" />
      {/* Bow center knot */}
      <ellipse cx="60" cy="44" rx="9" ry="7" fill="url(#knotGrad)"
        stroke="#8b0020" strokeWidth="0.8" />

      {/* Ribbon tails */}
      <path d="M52 50 Q46 60 40 70" stroke="#c0102e" strokeWidth="4"
        strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M68 50 Q74 60 80 70" stroke="#c0102e" strokeWidth="4"
        strokeLinecap="round" fill="none" opacity="0.7" />

      {/* Small star sparkles */}
      {[[25,38],[95,50],[30,75],[92,72]].map(([x,y],i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          <line x1="-4" y1="0" x2="4" y2="0"  stroke="#ffd4e8" strokeWidth="1.2" opacity="0.7" />
          <line x1="0" y1="-4" x2="0" y2="4"  stroke="#ffd4e8" strokeWidth="1.2" opacity="0.7" />
          <line x1="-3" y1="-3" x2="3" y2="3" stroke="#ffd4e8" strokeWidth="0.8" opacity="0.5" />
          <line x1="3" y1="-3" x2="-3" y2="3" stroke="#ffd4e8" strokeWidth="0.8" opacity="0.5" />
        </g>
      ))}

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

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function GiftBoxIntro({
  recipientName    = "Ameisha Nadilah",
  onRevealComplete,
}: GiftBoxIntroProps): JSX.Element | null {
  const [appState,  setAppState]  = useState<AppState>("idle");
  const [particles, setParticles] = useState<ExplosionParticle[]>([]);
  const boxControls = useAnimation();

  // Idle pulse for the gift box
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

    // Box shake then shrink
    await boxControls.start({
      scale:  [1, 1.18, 0.9, 1.22, 0.0],
      rotate: [0, -8, 10, -5, 0],
      transition: { duration: 0.55, ease: "easeInOut" },
    });

    // Spawn explosion particles from center (50%, 50%)
    const burst: ExplosionParticle[] = Array.from(
      { length: 180 },
      () => makeExplosionParticle("explode", 50, 50)
    );
    setParticles(burst);
  }, [appState, boxControls]);

  const handleCoverDone = useCallback(() => {
    if (appState !== "exploding") return;
    setAppState("covering");
    // Small delay then reveal
    setTimeout(() => setAppState("revealed"), 600);
  }, [appState]);

  const handleRevealComplete = useCallback(() => {
    onRevealComplete?.();
  }, [onRevealComplete]);

  if (appState === "revealed") {
    return (
      <RevealScreen
        recipientName={recipientName}
        particles={particles}
        onAnimationComplete={handleRevealComplete}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[99999] overflow-hidden bg-[#3a0008] flex items-center justify-center">
      {/* Ambient glow */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[5%] left-[5%] w-[50%] h-[50%] rounded-full
          bg-[radial-gradient(ellipse,rgba(180,10,40,0.15)_0%,transparent_70%)] blur-[70px]" />
        <div className="absolute bottom-[5%] right-[5%] w-[45%] h-[45%] rounded-full
          bg-[radial-gradient(ellipse,rgba(160,5,30,0.12)_0%,transparent_70%)] blur-[80px]" />
      </div>

      {/* Canvas — only visible after click */}
      <AnimatePresence>
        {appState === "exploding" && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            <FlowerCanvas
              particles={particles}
              onCoverDone={handleCoverDone}
              isExploding={appState === "exploding"}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gift box */}
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

      {/* Click hint */}
      <AnimatePresence>
        {appState === "idle" && (
          <motion.p
            key="hint"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
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

// ─────────────────────────────────────────────────────────────────────────────
// REVEAL SCREEN
// ─────────────────────────────────────────────────────────────────────────────

interface RevealScreenProps {
  recipientName:       string;
  particles:           ExplosionParticle[];
  onAnimationComplete: () => void;
}

function RevealScreen({ recipientName, particles, onAnimationComplete }: RevealScreenProps): JSX.Element {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const pRef       = useRef<ExplosionParticle[]>(particles);
  const rafRef     = useRef<number>(0);
  const lastTsRef  = useRef<number | null>(null);
  const tRef       = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      canvas!.width  = canvas!.offsetWidth;
      canvas!.height = canvas!.offsetHeight;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function loop(ts: number) {
      if (!ctx) return; // ← PERBAIKAN: tambah null check di sini
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.05);
      lastTsRef.current = ts;
      tRef.current += dt;
      const t = tRef.current;
      const W = canvas!.width;
      const H = canvas!.height;

      ctx.clearRect(0, 0, W, H);

      const ps = pRef.current;
      ps.sort((a, b) => a.layer - b.layer);

      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        const sway = Math.sin(t * p.swayFreq + p.swayOffset) * p.swayAmp;
        p.x        += sway * dt * 0.4;
        p.y        += p.fallSpeed * dt;
        p.rotation += p.rotSpeed  * dt;

        if (p.y > 120) {
          // Recycle: re-spawn at top
          p.y        = -8;
          p.x        = Math.random() * 100;
          p.rotation = Math.random() * Math.PI * 2;
        }

        const blur   = p.layer === 0 ? 2.8 : p.layer === 1 ? 0.8 : 0;
        const bright = p.layer === 0 ? 0.46 : p.layer === 1 ? 0.70 : 1.0;
        const opMul  = p.layer === 0 ? 0.46 : p.layer === 1 ? 0.72 : 1.0;

        ctx.filter = blur > 0
          ? `blur(${blur}px) brightness(${bright})`
          : bright < 1 ? `brightness(${bright})` : "none";

        const op = p.opacity * opMul;

        switch (p.kind) {
          case "lily":        drawLily(ctx, (p.x/100)*W, (p.y/100)*H, p.size, p.rotation, op, p.variant); break;
          case "rose":        drawRose(ctx, (p.x/100)*W, (p.y/100)*H, p.size, p.rotation, op, p.variant); break;
          case "petal-white": drawPetal(ctx, (p.x/100)*W, (p.y/100)*H, p.size, p.rotation, op, true);     break;
          case "petal-red":   drawPetal(ctx, (p.x/100)*W, (p.y/100)*H, p.size, p.rotation, op, false);    break;
          case "bud":         drawBud(ctx, (p.x/100)*W, (p.y/100)*H, p.size, p.rotation, op);             break;
        }
      }

      ctx.filter = "none";

      // Maintain count
      if (ps.length < 120 && Math.random() < 0.05) {
        ps.push(makeExplosionParticle("drift"));
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, []);

  // Google Fonts loaded via link in _document / layout, or fallback to Georgia
  const displayFont = `'Cormorant Garamond', 'Playfair Display', 'Georgia', serif`;

  return (
    <motion.div
      className="fixed inset-0 z-[99999] overflow-hidden bg-[#3a0008] flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      onAnimationComplete={onAnimationComplete}
    >
      {/* Drifting flowers */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Vignette */}
      <div aria-hidden className="absolute inset-0 pointer-events-none
        bg-[radial-gradient(ellipse_at_50%_50%,transparent_22%,rgba(4,0,2,0.42)_62%,rgba(2,0,1,0.72)_100%)]" />
      <div aria-hidden className="absolute bottom-0 left-0 right-0 h-[55%] pointer-events-none
        bg-gradient-to-t from-[rgba(8,0,3,0.88)] via-[rgba(18,0,6,0.44)] to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-8 gap-0">

        {/* Decorative top line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.1, ease: "easeOut" }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-[rgba(255,180,200,0.45)]" />
          <svg width="18" height="18" viewBox="0 0 18 18" className="text-[rgba(255,180,200,0.5)]">
            <path d="M9 1 L10.2 6.8 L16 6.8 L11.4 10.2 L13.1 16 L9 12.4 L4.9 16 L6.6 10.2 L2 6.8 L7.8 6.8 Z"
              fill="currentColor" />
          </svg>
          <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-[rgba(255,180,200,0.45)]" />
        </motion.div>

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.9 }}
          className="text-[rgba(255,190,210,0.52)] text-[0.58rem] sm:text-[0.64rem]
            tracking-[0.42em] uppercase mb-4"
          style={{ fontFamily: displayFont }}
        >
          dengan sepenuh hati
        </motion.p>

        {/* "For" */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 1.0 }}
          className="text-[rgba(255,170,195,0.65)] text-[clamp(0.9rem,2.5vw,1.2rem)]
            tracking-[0.12em] mb-2"
          style={{ fontFamily: displayFont, fontStyle: "italic" }}
        >
          Untuk
        </motion.p>

        {/* Recipient name */}
        <motion.h1
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.1, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(2.2rem,7vw,5rem)] font-light
            text-[rgba(255,240,245,0.96)] leading-none mb-6"
          style={{
            fontFamily: displayFont,
            fontStyle: "italic",
            letterSpacing: "0.04em",
            textShadow: "0 2px 40px rgba(220,80,110,0.32), 0 0 80px rgba(160,30,60,0.18)",
          }}
        >
          {recipientName}
        </motion.h1>

        {/* Divider with lily motif */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 1.5, duration: 1.0 }}
          className="flex items-center gap-3 mb-7"
        >
          <div className="h-px w-8 sm:w-14 bg-gradient-to-r from-transparent to-[rgba(255,180,200,0.35)]" />
          <span className="text-[rgba(255,170,195,0.5)] text-lg" aria-hidden>✿</span>
          <div className="h-px w-8 sm:w-14 bg-gradient-to-l from-transparent to-[rgba(255,180,200,0.35)]" />
        </motion.div>

        {/* Poetic subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 1.0 }}
          className="text-[rgba(255,210,222,0.62)] text-[clamp(0.82rem,2vw,1rem)]
            leading-[2.1] tracking-[0.04em] max-w-[340px]"
          style={{ fontFamily: displayFont, fontStyle: "italic" }}
        >
          Seperti lily putih yang mekar di pagi hari,<br />
          kehadiranmu selalu menjadi cahaya.
        </motion.p>

      </div>

      {/* Google Fonts hint (add to _document or layout.tsx) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');
      `}</style>
    </motion.div>
  );
}
