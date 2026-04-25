"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const LINE1 = "Selamat ulang tahun yang ke-21,";
const LINE2 = "Ameisha Nadilah Sayangkuu ♡";

// Delay sesuai durasi IntroScreen (sekitar 5.5 detik)
const TYPING_DELAY = 5500;

export default function HeroSection() {
  const [started, setStarted] = useState(false);
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [line1Done, setLine1Done] = useState(false);
  const [cursor1, setCursor1] = useState(true);
  const [cursor2, setCursor2] = useState(true);

  // Tunggu IntroScreen selesai dulu baru mulai typing
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), TYPING_DELAY);
    return () => clearTimeout(t);
  }, []);

  // Typing baris pertama
  useEffect(() => {
    if (!started) return;
    if (text1.length < LINE1.length) {
      const t = setTimeout(() => setText1(LINE1.slice(0, text1.length + 1)), 55);
      return () => clearTimeout(t);
    } else {
      setLine1Done(true);
    }
  }, [started, text1]);

  // Typing baris kedua
  useEffect(() => {
    if (!line1Done) return;
    if (text2.length < LINE2.length) {
      const t = setTimeout(() => setText2(LINE2.slice(0, text2.length + 1)), 65);
      return () => clearTimeout(t);
    }
  }, [line1Done, text2]);

  // Cursor kedip baris 1
  useEffect(() => {
    const id = setInterval(() => setCursor1((v) => !v), 500);
    return () => clearInterval(id);
  }, []);

  // Cursor kedip baris 2
  useEffect(() => {
    const id = setInterval(() => setCursor2((v) => !v), 500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative w-full py-20 px-4 sm:px-8 bg-gradient-to-b from-pink-50 via-rose-50 to-white overflow-hidden">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-10 h-56 w-56 rounded-full bg-pink-300/40 blur-3xl"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 right-0 h-64 w-64 rounded-full bg-rose-300/40 blur-3xl"
      />
      <div className="relative w-full max-w-6xl mx-auto flex flex-col-reverse items-center gap-10 sm:flex-row sm:items-center">
        <div className="flex-1 text-center sm:text-left animate-fade-in-up">
          <p className="inline-flex items-center gap-2 rounded-full bg-pink-100/80 px-4 py-1 text-[11px] sm:text-xs font-medium tracking-[0.25em] text-pink-500 uppercase mb-3">
            <span className="h-2 w-2 rounded-full bg-pink-400 animate-pulse" />
            happy 21th birthday
          </p>

          {/* Judul dengan efek typing */}
          <h1 className="text-4xl sm:text-5xl font-bold text-pink-900 mb-4 leading-tight min-h-[7rem] sm:min-h-[6rem]">
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

          <p className="text-base sm:text-lg text-pink-700 mb-6 max-w-xl mx-auto sm:mx-0 animate-fade-in-up animate-delay-150">
            Hari ini kamu resmi 21 tahun, dan aku pengin kasih sesuatu yang
            kecil tapi tulus buat kamu. Scroll pelan-pelan ya, ini semua aku
            bikin khusus buat kamu.
          </p>
          <button
            className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-7 py-3.5 text-sm sm:text-base font-semibold text-white shadow-md shadow-pink-300/70 hover:bg-pink-600 hover:shadow-lg hover:shadow-pink-300/90 active:scale-95 transition duration-200 ease-out"
            onClick={() => {
              const el = document.getElementById("our-story");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Mulai lihat hadiah kecil ini
            <span className="text-lg">♡</span>
          </button>
        </div>

        <div className="flex-1 flex justify-center animate-float-slow">
          <div className="relative">
            <div
              className="pointer-events-none absolute -inset-4 rounded-[2.75rem] bg-pink-200/40 blur-xl"
              aria-hidden="true"
            />
            <Image
              src="/Foto1.jpg"
              alt="Foto kamu"
              width={260}
              height={260}
              className="relative rounded-[2.5rem] border-4 border-pink-200 shadow-[0_18px_55px_rgba(244,114,182,0.7)] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
