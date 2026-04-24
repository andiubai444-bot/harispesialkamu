"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#f9a8d4","#fda4af","#fbcfe8","#fef3c7","#fde68a","#ffffff","#fcd5e3","#ff85a1"];
const SHAPES = ["circle", "heart", "star", "rect"] as const;

type Shape = typeof SHAPES[number];

interface Piece {
  x: number; y: number; vx: number; vy: number;
  size: number; color: string; shape: Shape;
  rotation: number; rotSpeed: number;
  opacity: number; wobble: number; wobbleSpeed: number;
  life: number; decay: number;
}

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save(); ctx.translate(x, y);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-size/2, -size/2, -size, size/4, 0, size);
  ctx.bezierCurveTo(size, size/4, size/2, -size/2, 0, 0);
  ctx.fill(); ctx.restore();
}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.save(); ctx.translate(x, y); ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    ctx.lineTo(Math.cos((18 + i*72)*Math.PI/180)*r, -Math.sin((18 + i*72)*Math.PI/180)*r);
    ctx.lineTo(Math.cos((54 + i*72)*Math.PI/180)*r/2, -Math.sin((54 + i*72)*Math.PI/180)*r/2);
  }
  ctx.closePath(); ctx.fill(); ctx.restore();
}

function createPiece(width: number): Piece {
  return {
    x: Math.random() * width, y: -20,
    vx: (Math.random() - 0.5) * 3,
    vy: Math.random() * 3 + 2,
    size: Math.random() * 8 + 4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.15,
    opacity: 1,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: Math.random() * 0.05 + 0.02,
    life: 1,
    decay: Math.random() * 0.005 + 0.003,
  };
}

export default function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let pieces: Piece[] = [];
    let animId: number;

    // Launch 180 confetti dengan delay
    for (let i = 0; i < 180; i++) {
      setTimeout(() => pieces.push(createPiece(canvas.width)), i * 10);
    }

    function animate() {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      pieces = pieces.filter(p => p.life > 0 && p.y < canvas!.height + 30);

      for (const p of pieces) {
        p.x += p.vx + Math.sin(p.wobble) * 1.2;
        p.y += p.vy;
        p.vy += 0.06;
        p.vx *= 0.99;
        p.rotation += p.rotSpeed;
        p.wobble += p.wobbleSpeed;
        p.life -= p.decay;
        p.opacity = Math.min(1, p.life * 3);

        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size/2, 0, Math.PI*2);
          ctx.fill();
        } else if (p.shape === "rect") {
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation);
          ctx.fillRect(-p.size/2, -p.size/4, p.size, p.size/2);
          ctx.restore();
        } else if (p.shape === "heart") {
          drawHeart(ctx, p.x, p.y, p.size/2);
        } else if (p.shape === "star") {
          drawStar(ctx, p.x, p.y, p.size/2);
        }
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(animate);
    }

    animate();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", top: 0, left: 0,
        pointerEvents: "none", zIndex: 9998,
        width: "100vw", height: "100vh",
      }}
    />
  );
}
