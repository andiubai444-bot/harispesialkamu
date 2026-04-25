"use client";
import { useEffect, useRef } from "react";

type Particle = {
  x: number; y: number;
  vx: number; vy: number;
  size: number; opacity: number;
  type: "star" | "heart";
  color: string;
  rotation: number;
  rotSpeed: number;
};

const COLORS = ["#f9a8d4", "#fda4af", "#fbcfe8", "#fcd5e3", "#ff85a1", "#ffffff"];

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    ctx.lineTo(
      x + r * Math.cos((18 + i * 72) * Math.PI / 180),
     -r * Math.sin((18 + i * 72) * Math.PI / 180) + y
    );
    ctx.lineTo(
      x + (r / 2) * Math.cos((54 + i * 72) * Math.PI / 180),
      y - (r / 2) * Math.sin((54 + i * 72) * Math.PI / 180)
    );
  }
  ctx.closePath();
  ctx.fill();
}

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-size / 2, -size / 2, -size, size / 4, 0, size);
  ctx.bezierCurveTo(size, size / 4, size / 2, -size / 2, 0, 0);
  ctx.fill();
  ctx.restore();
}

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Buat 60 partikel
    const particles: Particle[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.4 - 0.1,
      size: Math.random() * 6 + 3,
      opacity: Math.random() * 0.5 + 0.1,
      type: Math.random() > 0.5 ? "star" : "heart",
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.01,
    }));

    let animId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        // Fade in/out perlahan
        p.opacity += (Math.random() - 0.5) * 0.005;
        p.opacity = Math.max(0.05, Math.min(0.6, p.opacity));

        // Loop balik ke bawah kalau udah keluar atas
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.translate(-p.x, -p.y);

        if (p.type === "star") {
          drawStar(ctx, p.x, p.y, p.size);
        } else {
          drawHeart(ctx, p.x, p.y, p.size);
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
