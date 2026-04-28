"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const START_DATE = new Date("2026-01-27T00:00:00");
const FOTO_AMEISHA = "/FotoKamu.jpg";
const FOTO_ANDI = "/FotoKu.jpeg";

export default function CounterBersama() {
  const [d, setD] = useState(0);
  const [h, setH] = useState(0);
  const [m, setM] = useState(0);
  const [s, setS] = useState(0);
  const [planeProgress, setPlaneProgress] = useState(0);
  const [planeDirection, setPlaneDirection] = useState(1); // 1 = kiri ke kanan, -1 = kanan ke kiri

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

  // Animasi pesawat bolak-balik
  useEffect(() => {
    let progress = 0;
    let direction = 1;
    let animId: number;

    const animate = () => {
      progress += direction * 0.004; // kecepatan pesawat

      if (progress >= 1) {
        progress = 1;
        direction = -1;
      } else if (progress <= 0) {
        progress = 0;
        direction = 1;
      }

      setPlaneProgress(progress);
      setPlaneDirection(direction);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Hitung posisi & rotasi pesawat di sepanjang kurva Bezier
  // Path: M 0,30 Q 100,5 200,30
  const getPlaneTransform = (t: number, dir: number) => {
    // Titik di kurva quadratic bezier: P = (1-t)²*P0 + 2(1-t)t*P1 + t²*P2
    const P0 = { x: 0, y: 30 };
    const P1 = { x: 100, y: 5 };
    const P2 = { x: 200, y: 30 };

    const x = (1 - t) ** 2 * P0.x + 2 * (1 - t) * t * P1.x + t ** 2 * P2.x;
    const y = (1 - t) ** 2 * P0.y + 2 * (1 - t) * t * P1.y + t ** 2 * P2.y;

    // Turunan untuk mendapat sudut tangent
    const dx = 2 * (1 - t) * (P1.x - P0.x) + 2 * t * (P2.x - P1.x);
    const dy = 2 * (1 - t) * (P1.y - P0.y) + 2 * t * (P2.y - P1.y);
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);

    // Kalau balik arah, flip pesawat
    if (dir === -1) {
      angle += 180;
    }

    return { x, y, angle };
  };

  const { x: px, y: py, angle: pAngle } = getPlaneTransform(planeProgress, planeDirection);

  return (
    <section className="w-full py-14 px-4 sm:px-10 bg-white">
      <div className="max-w-lg mx-auto text-center">

        {/* Counter */}
        <p className="text-xs tracking-widest text-pink-600 uppercase mb-2">
          ✦ Since We Said Yes ✦
        </p>
        <p className="font-serif text-xl text-pink-900 mb-8">
          Andi &amp; Ameisha
        </p>
        <div className="grid grid-cols-4 gap-3 mb-7">
          <div className="bg-pink-50 rounded-2xl py-5 px-2">
            <p className="font-serif text-3xl sm:text-4xl text-pink-900 leading-none">{d}</p>
            <p className="text-xs tracking-widest text-pink-600 uppercase mt-2">Hari</p>
          </div>
          <div className="bg-pink-50 rounded-2xl py-5 px-2">
            <p className="font-serif text-3xl sm:text-4xl text-pink-900 leading-none">{String(h).padStart(2, "0")}</p>
            <p className="text-xs tracking-widest text-pink-600 uppercase mt-2">Jam</p>
          </div>
          <div className="bg-pink-50 rounded-2xl py-5 px-2">
            <p className="font-serif text-3xl sm:text-4xl text-pink-900 leading-none">{String(m).padStart(2, "0")}</p>
            <p className="text-xs tracking-widest text-pink-600 uppercase mt-2">Menit</p>
          </div>
          <div className="bg-pink-50 rounded-2xl py-5 px-2">
            <p className="font-serif text-3xl sm:text-4xl text-pink-900 leading-none">{String(s).padStart(2, "0")}</p>
            <p className="text-xs tracking-widest text-pink-600 uppercase mt-2">Detik</p>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent mb-5" />
        <p className="text-sm text-pink-600 mb-12">sejak 27 Januari 2026 ♡</p>

        {/* Jarak Kota */}
        <p className="text-xs tracking-widest text-pink-600 uppercase mb-8">
          ✦ jarak kita ✦
        </p>

        <div className="relative flex items-center justify-between px-2">

          {/* Pontianak - Foto Ameisha */}
          <div className="flex flex-col items-center z-10">
            <div className="relative w-14 h-14 rounded-full border-[3px] border-pink-300 shadow-md shadow-pink-200 overflow-hidden mb-2">
              <Image src={FOTO_AMEISHA} alt="Ameisha" fill className="object-cover" />
            </div>
            <p className="font-serif text-sm text-pink-900 font-semibold">Pontianak</p>
            <p className="text-xs text-pink-500 mt-0.5">Kamu di sini</p>
          </div>

          {/* Garis & Pesawat */}
          <div className="flex-1 mx-3 flex flex-col items-center gap-2">
            <svg
              viewBox="0 0 200 50"
              className="w-full"
              style={{ overflow: "visible" }}
            >
              {/* Garis latar */}
              <path
                d="M 0,30 Q 100,5 200,30"
                fill="none"
                stroke="#fce7f3"
                strokeWidth="2"
                strokeDasharray="6 5"
              />
              {/* Garis pink */}
              <path
                d="M 0,30 Q 100,5 200,30"
                fill="none"
                stroke="#f9a8d4"
                strokeWidth="2"
                strokeDasharray="6 5"
              />

              {/* Pesawat bolak-balik */}
              <text
                x={px}
                y={py}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="14"
                style={{
                  transform: `rotate(${pAngle}deg)`,
                  transformOrigin: `${px}px ${py}px`,
                  transition: "none",
                }}
              >
                ✈️
              </text>
            </svg>

            <div className="bg-pink-50 border border-pink-200 rounded-full px-3 py-1">
              <p className="text-xs font-semibold text-pink-700">± 892 km</p>
            </div>
          </div>

          {/* Balikpapan - Foto Andi */}
          <div className="flex flex-col items-center z-10">
            <div className="relative w-14 h-14 rounded-full border-[3px] border-rose-300 shadow-md shadow-rose-200 overflow-hidden mb-2">
              <Image src={FOTO_ANDI} alt="Andi" fill className="object-cover" />
            </div>
            <p className="font-serif text-sm text-pink-900 font-semibold">Balikpapan</p>
            <p className="text-xs text-pink-500 mt-0.5">Aku di sini</p>
          </div>
        </di
