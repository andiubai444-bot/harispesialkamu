"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

const START_DATE = new Date("2026-01-27T00:00:00");
const FOTO_AMEISHA = "/FotoKamu.jpg";
const FOTO_ANDI = "/FotoKu.jpeg";

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

function LiveClock({ offsetHours, label }: { offsetHours: number; label: string }) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const local = new Date(utc + offsetHours * 3600000);
      setTime(local.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [offsetHours]);

  return (
    <div className="mt-1.5 text-center">
      <p className="text-[10px] text-pink-400 tracking-wide">{label}</p>
      <p
        className="text-xs font-semibold text-pink-700 tabular-nums tracking-wider"
        style={{ fontFamily: "'Courier New', Courier, monospace" }}
      >
        {time}
      </p>
    </div>
  );
}

function MovingClouds() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {[
        { top: "18%", size: 28, duration: 22, delay: 0, opacity: 0.55 },
        { top: "38%", size: 20, duration: 30, delay: 8, opacity: 0.40 },
        { top: "55%", size: 24, duration: 26, delay: 14, opacity: 0.45 },
        { top: "25%", size: 16, duration: 35, delay: 5, opacity: 0.30 },
      ].map((c, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: c.top,
            left: "-60px",
            animation: `cloudDrift ${c.duration}s linear ${c.delay}s infinite`,
            opacity: c.opacity,
          }}
        >
          <svg width={c.size * 2.5} height={c.size} viewBox="0 0 80 32" fill="none">
            <ellipse cx="40" cy="22" rx="38" ry="10" fill="#fce7f3" />
            <ellipse cx="25" cy="18" rx="18" ry="13" fill="#fce7f3" />
            <ellipse cx="50" cy="16" rx="20" ry="14" fill="#fce7f3" />
            <ellipse cx="65" cy="22" rx="15" ry="10" fill="#fce7f3" />
          </svg>
        </div>
      ))}
    </div>
  );
}

export default function CounterBersama() {
  const [d, setD] = useState(0);
  const [h, setH] = useState(0);
  const [m, setM] = useState(0);
  const [s, setS] = useState(0);
  const [planeProgress, setPlaneProgress] = useState(0);
  const [planeDirection, setPlaneDirection] = useState(1);
  const closingRef = useInView(0.4);

  useEffect(() => {
    const tick = () => {
      const diff = Math.floor((Date.now() - START_DATE.getTime()) / 1000);
      setD(Math.floor(diff / 86400));
      setH(Math.floor((diff % 86400) / 3600));
      setM(Math.floor((diff % 3600) / 60));
      setS(diff % 60);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let progress = 0;
    let direction = 1;
    let animId: number;
    const animate = () => {
      progress += direction * 0.003;
      if (progress >= 1) { progress = 1; direction = -1; }
      else if (progress <= 0) { progress = 0; direction = 1; }
      setPlaneProgress(progress);
      setPlaneDirection(direction);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  const getPlane = (t: number, dir: number) => {
    const P0 = { x: 8, y: 32 };
    const P1 = { x: 100, y: 4 };
    const P2 = { x: 192, y: 32 };
    const x = (1 - t) ** 2 * P0.x + 2 * (1 - t) * t * P1.x + t ** 2 * P2.x;
    const y = (1 - t) ** 2 * P0.y + 2 * (1 - t) * t * P1.y + t ** 2 * P2.y;
    const dx = 2 * (1 - t) * (P1.x - P0.x) + 2 * t * (P2.x - P1.x);
    const dy = 2 * (1 - t) * (P1.y - P0.y) + 2 * t * (P2.y - P1.y);
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (dir === -1) angle += 180;
    return { x, y, angle };
  };

  const { x: px, y: py, angle: pAngle } = getPlane(planeProgress, planeDirection);

  // Neumorphic counter tile
  const CounterTile = ({ value, label }: { value: string | number; label: string }) => (
    <div
      className="flex flex-col items-center justify-center rounded-2xl py-5 px-2"
      style={{
        background: "#fdf2f8",
        boxShadow: "6px 6px 14px rgba(244,114,182,0.18), -4px -4px 10px rgba(255,255,255,0.9)",
      }}
    >
      <p
        className="text-3xl sm:text-4xl text-pink-900 leading-none tabular-nums"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 700 }}
      >
        {value}
      </p>
      <p className="text-[10px] tracking-widest text-pink-500 uppercase mt-2 font-light">{label}</p>
    </div>
  );

  return (
    <section className="relative w-full py-20 px-4 sm:px-10 bg-gradient-to-b from-white via-pink-50/30 to-white overflow-hidden">
      <style>{`
        @keyframes cloudDrift {
          0%   { transform: translateX(-80px); }
          100% { transform: translateX(110vw); }
        }
        @keyframes pulseRing {
          0%   { transform: scale(1);   opacity: 0.5; }
          70%  { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>

      {/* Ambient blobs */}
      <span aria-hidden="true" className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-pink-100/40 blur-3xl" />

      <div className="max-w-lg mx-auto text-center">

        {/* Header */}
        <p className="text-xs tracking-widest text-pink-500 uppercase mb-2">✦ Since We Said Yes ✦</p>
        <h2
          className="text-xl text-pink-900 mb-8"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Andi &amp; Ameisha
        </h2>

        {/* Counter — Neumorphic */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          <CounterTile value={d} label="Hari" />
          <CounterTile value={String(h).padStart(2, "0")} label="Jam" />
          <CounterTile value={String(m).padStart(2, "0")} label="Menit" />
          <CounterTile value={String(s).padStart(2, "0")} label="Detik" />
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent mb-4" />
        <p className="text-sm text-pink-500 mb-14" style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}>
          sejak 27 Januari 2026 ♡
        </p>

        {/* Distance section */}
        <p className="text-xs tracking-widest text-pink-500 uppercase mb-8">✦ jarak kita ✦</p>

        {/* Flight path container — clouds inside */}
        <div className="relative rounded-3xl bg-gradient-to-b from-sky-50/60 to-pink-50/40 border border-pink-100/40 px-4 py-8 overflow-hidden">
          <MovingClouds />

          <div className="relative flex items-end justify-between z-10">

            {/* Pontianak — Ameisha */}
            <div className="flex flex-col items-center">
              {/* Pulse ring */}
              <div className="relative mb-2">
                <span
                  className="absolute inset-0 rounded-full border-2 border-pink-300"
                  style={{ animation: "pulseRing 2s ease-out infinite" }}
                />
                <span
                  className="absolute inset-0 rounded-full border-2 border-pink-200"
                  style={{ animation: "pulseRing 2s ease-out 0.6s infinite" }}
                />
                <div className="relative w-14 h-14 rounded-full border-[3px] border-pink-300 shadow-md shadow-pink-200 overflow-hidden">
                  <Image src={FOTO_AMEISHA} alt="Ameisha" fill className="object-cover" />
                </div>
              </div>
              <p className="text-sm text-pink-900 font-semibold" style={{ fontFamily: "Georgia, serif" }}>Pontianak</p>
              <p className="text-[10px] text-pink-400 mt-0.5">Kamu di sini</p>
              <LiveClock offsetHours={7} label="WIB" />
            </div>

            {/* SVG flight path */}
            <div className="flex-1 mx-2 flex flex-col items-center gap-2">
              <svg viewBox="0 0 200 50" className="w-full" style={{ overflow: "visible" }}>
                {/* Dashed path */}
                <path d="M 8,32 Q 100,4 192,32" fill="none" stroke="#fce7f3" strokeWidth="1.5" strokeDasharray="6 5" />
                <path d="M 8,32 Q 100,4 192,32" fill="none" stroke="#f9a8d4" strokeWidth="1.5" strokeDasharray="6 5" strokeDashoffset="4" />
                {/* Plane */}
                <text
                  x={px}
                  y={py}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="15"
                  style={{
                    transform: `rotate(${pAngle}deg)`,
                    transformOrigin: `${px}px ${py}px`,
                    filter: "drop-shadow(0 1px 4px rgba(244,114,182,0.5))",
                  }}
                >
                  ✈️
                </text>
              </svg>

              {/* Distance badge — glassmorphism */}
              <div className="bg-white/30 backdrop-blur-sm border border-white/50 rounded-full px-3 py-1 shadow-sm">
                <p className="text-xs font-semibold text-pink-700">± 892 km</p>
              </div>
            </div>

            {/* Balikpapan — Andi */}
            <div className="flex flex-col items-center">
              <div className="relative mb-2">
                <span
                  className="absolute inset-0 rounded-full border-2 border-rose-300"
                  style={{ animation: "pulseRing 2s ease-out 0.3s infinite" }}
                />
                <span
                  className="absolute inset-0 rounded-full border-2 border-rose-200"
                  style={{ animation: "pulseRing 2s ease-out 0.9s infinite" }}
                />
                <div className="relative w-14 h-14 rounded-full border-[3px] border-rose-300 shadow-md shadow-rose-200 overflow-hidden">
                  <Image src={FOTO_ANDI} alt="Andi" fill className="object-cover" />
                </div>
              </div>
              <p className="text-sm text-pink-900 font-semibold" style={{ fontFamily: "Georgia, serif" }}>Balikpapan</p>
              <p className="text-[10px] text-pink-400 mt-0.5">Aku di sini</p>
              <LiveClock offsetHours={8} label="WITA" />
            </div>

          </div>
        </div>

        {/* Closing — fade in on scroll */}
        <div
          ref={closingRef.ref}
          className="mt-10 transition-all duration-1000 ease-out"
          style={{
            opacity: closingRef.inView ? 1 : 0,
            transform: closingRef.inView ? "translateY(0)" : "translateY(16px)",
          }}
        >
          <p
            className="text-sm text-pink-500 italic"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Sejauh apapun, hati kita tetap dekat ♡
          </p>
        </div>

      </div>
    </section>
  );
}
