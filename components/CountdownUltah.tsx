"use client";
import { useEffect, useState } from "react";

const TARGET_WIB = new Date("2027-05-17T00:00:00+07:00");
const TARGET_WITA = new Date("2027-05-17T00:00:00+08:00");

function getCountdown(target: Date) {
  const diff = Math.max(0, Math.floor((target.getTime() - Date.now()) / 1000));
  const d = Math.floor(diff / 86400);
  const h = Math.floor((diff % 86400) / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;
  return { d, h, m, s };
}

function CountdownBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-pink-50 rounded-2xl py-5 px-2 flex flex-col items-center">
      <p className="font-serif text-3xl sm:text-4xl text-pink-900 leading-none">
        {String(value).padStart(2, "0")}
      </p>
      <p className="text-xs tracking-widest text-pink-600 uppercase mt-2">{label}</p>
    </div>
  );
}

export default function CountdownUltah() {
  const [wib, setWib] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [wita, setWita] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tick = () => {
      setWib(getCountdown(TARGET_WIB));
      setWita(getCountdown(TARGET_WITA));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!mounted) return null;

  return (
    <section className="w-full py-14 px-4 sm:px-10 bg-white">
      <div className="max-w-lg mx-auto text-center">
        <p className="text-xs tracking-widest text-pink-600 uppercase mb-2">
          ✦ menuju ulang tahun berikutnya ✦
        </p>
        <p className="font-serif text-xl text-pink-900 mb-8">
          17 Mei 2027 — Ameisha ke-22
        </p>

        {/* WIB */}
        <p className="text-xs font-semibold tracking-widest text-pink-500 uppercase mb-3">
          Waktu Pontianak (WIB)
        </p>
        <div className="grid grid-cols-4 gap-3 mb-8">
          <CountdownBox label="Hari" value={wib.d} />
          <CountdownBox label="Jam" value={wib.h} />
          <CountdownBox label="Menit" value={wib.m} />
          <CountdownBox label="Detik" value={wib.s} />
        </div>

        {/* WITA */}
        <p className="text-xs font-semibold tracking-widest text-pink-500 uppercase mb-3">
          Waktu Balikpapan (WITA)
        </p>
        <div className="grid grid-cols-4 gap-3 mb-7">
          <CountdownBox label="Hari" value={wita.d} />
          <CountdownBox label="Jam" value={wita.h} />
          <CountdownBox label="Menit" value={wita.m} />
          <CountdownBox label="Detik" value={wita.s} />
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent mb-5" />
        <p className="text-sm text-pink-600">
          masih ada waktu buat bikin momennya lebih spesial ♡
        </p>
      </div>
    </section>
  );
}
