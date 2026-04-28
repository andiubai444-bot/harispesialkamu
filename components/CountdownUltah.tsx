"use client";
import { useEffect, useState } from "react";

const TARGET_WIB = new Date("2027-05-17T00:00:00+07:00");

const kalimatList = [
  "masih ada waktu buat bikin semuanya lebih berkesan.",
  "setiap detik yang berlalu, kamu makin dekat ke hari itu.",
  "waktu terus jalan, tapi aku nggak kemana-mana.",
  "banyak hal bisa terjadi dalam waktu sepanjang ini.",
  "nggak sabar nunggu ulang tahunmu yang berikutnya.",
  "semoga tahun ini penuh hal baik buat kamu.",
];

function getCountdown(target: Date) {
  const diff = Math.max(0, Math.floor((target.getTime() - Date.now()) / 1000));
  return {
    d: Math.floor(diff / 86400),
    h: Math.floor((diff % 86400) / 3600),
    m: Math.floor((diff % 3600) / 60),
    s: diff % 60,
  };
}

export default function CountdownUltah() {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [kalimatIdx, setKalimatIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(getCountdown(TARGET_WITA));
    const tick = setInterval(() => setTime(getCountdown(TARGET_WITA)), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setKalimatIdx((i) => (i + 1) % kalimatList.length);
        setFade(true);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="w-full py-14 px-4 sm:px-10 bg-white">
      <div className="max-w-lg mx-auto text-center">
        <p className="text-[11px] tracking-[0.18em] text-pink-400 uppercase mb-2">
          menuju
        </p>
        <p className="font-serif text-xl sm:text-2xl text-pink-900 font-normal mb-1">
          17 Mei 2027
        </p>
        <p className="text-sm text-pink-500 tracking-wide mb-10">
          Ameisha ke-22 ♡
        </p>

        <p className="font-serif text-[5.5rem] sm:text-[7rem] leading-none text-pink-900 font-normal tracking-tight mb-1">
          {time.d}
        </p>
        <p className="text-[11px] tracking-[0.2em] text-pink-400 uppercase mb-4">
          hari lagi
        </p>

        <div className="flex justify-center items-baseline gap-2 mb-10 text-pink-700">
          <span className="font-serif text-lg">{pad(time.h)}</span>
          <span className="text-[11px] tracking-widest uppercase text-pink-400">jam</span>
          <span className="text-pink-300 mx-1">·</span>
          <span className="font-serif text-lg">{pad(time.m)}</span>
          <span className="text-[11px] tracking-widest uppercase text-pink-400">menit</span>
          <span className="text-pink-300 mx-1">·</span>
          <span className="font-serif text-lg">{pad(time.s)}</span>
          <span className="text-[11px] tracking-widest uppercase text-pink-400">detik</span>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent max-w-[200px] mx-auto mb-7" />

        <p
          className="text-sm text-pink-600 italic leading-relaxed min-h-[2.5em] transition-opacity duration-500"
          style={{ opacity: fade ? 1 : 0 }}
        >
          {kalimatList[kalimatIdx]}
        </p>

        <p className="text-[11px] tracking-widest uppercase text-pink-300 mt-6">
          waktu kamu · wita
        </p>
      </div>
    </section>
  );
}
