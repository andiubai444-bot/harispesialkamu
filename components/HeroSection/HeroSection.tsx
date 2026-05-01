"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const LINE1 = "Selamat ulang tahun yang ke-21,";
const LINE2 = "Ameisha Nadilah Sayangkuu ♡";

const TYPING_DELAY = 5500;

export default function HeroSection() {
  const [started, setStarted] = useState(false);
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [line1Done, setLine1Done] = useState(false);
  const [cursor1, setCursor1] = useState(true);
  const [cursor2, setCursor2] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), TYPING_DELAY);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!started) return;
    if (text1.length < LINE1.length) {
      const t = setTimeout(() => setText1(LINE1.slice(0, text1.length + 1)), 55);
      return () => clearTimeout(t);
    } else {
      setLine1Done(true);
    }
  }, [started, text1]);

  useEffect(() => {
    if (!line1Done) return;
    if (text2.length < LINE2.length) {
      const t = setTimeout(() => setText2(LINE2.slice(0, text2.length + 1)), 65);
      return () => clearTimeout(t);
    }
  }, [line1Done, text2]);

  useEffect(() => {
    const id = setInterval(() => setCursor1((v) => !v), 500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setCursor2((v) => !v), 500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative w-full min-h-screen px-4 sm:px-10 bg-gradient-to-br from-pink-50 via-rose-50 to-white overflow-hidden">

      {/* Ambient blobs */}
      <span aria-hidden="true" className="pointer-events-none absolute -top-24 -left-10 h-72 w-72 rounded-full bg-pink-300/30 blur-3xl" />
      <span aria-hidden="true" className="pointer-events-none absolute top-1/3 right-0 h-80 w-80 rounded-full bg-rose-200/40 blur-3xl" />
      <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-pink-200/30 blur-3xl" />

      {/* ── Z-PATTERN GRID ─────────────────────────────────────────────── */}
      <div className="relative w-full max-w-6xl mx-auto pt-16 pb-24">

        {/* ── ROW 1: Z kiri-atas (Sapaan) ←→ kanan-atas (Foto) ─────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 sm:gap-0">

          {/* Z-POINT 1 — Kiri atas: Badge + Sapaan */}
          <div className="flex-1 z-10 animate-fade-in-up">
            <p className="inline-flex items-center gap-2 rounded-full bg-pink-100/80 px-4 py-1 text-[11px] sm:text-xs font-medium tracking-[0.25em] text-pink-500 uppercase mb-4">
              <span className="h-2 w-2 rounded-full bg-pink-400 animate-pulse" />
              happy 21th birthday
            </p>

            <h1 className="text-4xl sm:text-5xl font-bold text-pink-900 leading-tight min-h-[7rem] sm:min-h-[6rem]">
              {text1}
              {started && !line1Done && (
                <span style={{ opacity: cursor1 ? 1 : 0, transition: "opacity 0.1s" }}>|</span>
              )}
              {line1Done && (
                <>
                  <br />
                  <span className="text-pink-600">
                    {text2}
                    {text2.length < LINE2.length && (
                      <span style={{ opacity: cursor2 ? 1 : 0, transition: "opacity 0.1s" }}>|</span>
                    )}
                  </span>
                </>
              )}
            </h1>
          </div>

          {/* Z-POINT 2 — Kanan atas: Foto besar + judul tumpang tindih */}
          <div className="flex-1 flex justify-center sm:justify-end relative animate-float-slow">

            {/* "Twenty One" — menumpuk di atas foto dengan transparansi */}
            <div
              className="absolute -top-8 left-1/2 sm:left-auto sm:-left-10 -translate-x-1/2 sm:translate-x-0 z-20 pointer-events-none select-none whitespace-nowrap"
            >
              <span
                className="text-5xl sm:text-7xl font-black tracking-tighter text-pink-300/55 drop-shadow-sm"
                style={{ fontStyle: "italic", letterSpacing: "-0.04em" }}
              >
                Twenty One
              </span>
            </div>

            {/* Foto dengan rotasi 2.5 derajat seperti foto fisik di meja */}
            <div className="relative mt-6" style={{ transform: "rotate(2.5deg)" }}>
              <div
                className="pointer-events-none absolute -inset-5 rounded-[2.75rem] bg-pink-200/50 blur-2xl"
                aria-hidden="true"
              />
              {/* Border putih tebal seperti foto cetak */}
              <div className="relative rounded-[2rem] border-[10px] border-white shadow-[0_24px_60px_rgba(244,114,182,0.55),0_6px_20px_rgba(0,0,0,0.08)] overflow-hidden">
                <Image
                  src="/Foto1.jpg"
                  alt="Foto Ameisha"
                  width={300}
                  height={340}
                  className="object-cover block"
                  style={{ width: 300, height: 340 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── ROW 2: Z turun ke kiri (Pesan) ←→ kanan bawah (Tombol) ───── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 mt-12 sm:mt-16">

          {/* Z-POINT 3 — Kiri bawah: Pesan puitis dengan Glassmorphism */}
          <div className="flex-1 z-10">
            <div className="rounded-3xl bg-white/30 backdrop-blur-md border border-white/40 px-7 py-6 shadow-[0_8px_32px_rgba(244,114,182,0.15)]">
              <span className="text-5xl text-pink-300/70 font-serif leading-none select-none">"</span>
              <p className="text-base sm:text-lg text-pink-800/90 mt-1 leading-relaxed">
                Aku merakit baris‑baris kode ini satu demi satu, untuk menunjukkan kalau kamu
                layak dirayakan dengan cara yang paling istimewa.
                <br />
                <span className="text-pink-500 font-medium">Lihat pelan‑pelan yahh sayanggg</span>,
                semua ini hanya untukmu. 🌸
              </p>
              <span className="text-5xl text-pink-300/70 font-serif leading-none select-none float-right -mt-2">"</span>
            </div>
          </div>

          {/* Z-POINT 4 — Kanan bawah: Tombol aksi utama */}
          <div className="flex-shrink-0 flex justify-center sm:justify-end w-full sm:w-auto pb-1">
            <button
              className="inline-flex items-center gap-2 rounded-2xl bg-pink-500 px-7 py-3.5 text-sm sm:text-base font-semibold text-white shadow-[0_0_15px_rgba(244,114,182,0.4)] hover:bg-pink-600 hover:shadow-[0_0_22px_rgba(244,114,182,0.65)] hover:scale-105 active:scale-95 transition-all duration-200 ease-out"
              onClick={() => {
                const el = document.getElementById("our-story");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Masuk ke Dunia Ameisha ✨
              <span className="text-lg">♡</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
