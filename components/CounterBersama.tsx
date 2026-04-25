"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const START_DATE = new Date("2026-01-27T00:00:00");

// Ganti nama file sesuai foto yang kamu upload ke folder public/
const FOTO_AMEISHA = "/FotoKamu.jpg"; // foto dia (Pontianak)
const FOTO_ANDI = "/FotoAku.jpeg";       // foto kamu (Balikpapan)

export default function CounterBersama() {
  const [d, setD] = useState(0);
  const [h, setH] = useState(0);
  const [m, setM] = useState(0);
  const [s, setS] = useState(0);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const tick = () => {
      let diff = Math.floor((Date.now() - START_DATE.getTime()) / 1000);
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
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="w-full py-14 px-4 sm:px-10 bg-white">
      <div className="max-w-lg mx-auto text-center">

        {/* Counter */}
        <p className="text-xs tracking-widest text-pink-600 uppercase mb-2">
          ✦ sudah bersama ✦
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
              <Image
                src={FOTO_AMEISHA}
                alt="Ameisha"
                fill
                className="object-cover"
              />
            </div>
            <p className="font-serif text-sm text-pink-900 font-semibold">Pontianak</p>
            <p className="text-xs text-pink-500 mt-0.5">Kamu di sini</p>
          </div>

          {/* Garis putus-putus */}
          <div className="flex-1 mx-3 flex flex-col items-center relative">
            <svg viewBox="0 0 200 60" className="w-full" style={{ overflow: "visible" }}>
              <path
                d="M 0,30 Q 100,5 200,30"
                fill="none"
                stroke="#f9a8d4"
                strokeWidth="2"
                strokeDasharray="6 5"
                style={{
                  strokeDashoffset: animated ? 0 : 200,
                  transition: "stroke-dashoffset 1.8s ease",
                }}
              />
              <text
                x="100"
                y="10"
                textAnchor="middle"
                fontSize="16"
                style={{
                  opacity: animated ? 1 : 0,
                  transition: "opacity 0.5s ease 1.5s",
                }}
              >
                ✈️
              </text>
            </svg>

            <div
              className="bg-pink-50 border border-pink-200 rounded-full px-3 py-1"
              style={{
                opacity: animated ? 1 : 0,
                transform: animated ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 0.5s ease 1.8s, transform 0.5s ease 1.8s",
              }}
            >
              <p className="text-xs font-semibold text-pink-700">± 892 km</p>
            </div>
          </div>

          {/* Balikpapan - Foto Andi */}
          <div className="flex flex-col items-center z-10">
            <div className="relative w-14 h-14 rounded-full border-[3px] border-rose-300 shadow-md shadow-rose-200 overflow-hidden mb-2">
              <Image
                src={FOTO_ANDI}
                alt="Andi"
                fill
                className="object-cover"
              />
            </div>
            <p className="font-serif text-sm text-pink-900 font-semibold">Balikpapan</p>
            <p className="text-xs text-pink-500 mt-0.5">Aku di sini</p>
          </div>
        </div>

        {/* Kalimat bawah */}
        <p
          className="text-sm text-pink-500 mt-8 font-serif italic"
          style={{
            opacity: animated ? 1 : 0,
            transition: "opacity 0.6s ease 2.2s",
          }}
        >
          Sejauh apapun, hati kita tetap dekat ♡
        </p>

      </div>
    </section>
  );
}
