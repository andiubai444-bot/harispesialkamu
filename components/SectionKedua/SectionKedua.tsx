"use client";
import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.15) {
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

export default function SectionKedua() {
  const heading = useInView(0.2);
  const card1 = useInView(0.2);
  const card2 = useInView(0.2);
  const closing = useInView(0.2);

  return (
    <section
      id="our-story"
      className="relative w-full py-24 px-4 sm:px-10 bg-gradient-to-b from-white via-pink-50/40 to-white overflow-hidden"
    >
      {/* Ambient background blobs */}
      <span aria-hidden="true" className="pointer-events-none absolute top-10 -left-20 h-72 w-72 rounded-full bg-pink-200/20 blur-3xl" />
      <span aria-hidden="true" className="pointer-events-none absolute bottom-20 -right-20 h-72 w-72 rounded-full bg-rose-200/20 blur-3xl" />

      <div className="max-w-5xl mx-auto">

        {/* ── Heading ───────────────────────────────────────────────────── */}
        <div
          ref={heading.ref}
          className="mb-16 transition-all duration-700 ease-out"
          style={{
            opacity: heading.inView ? 1 : 0,
            transform: heading.inView ? "translateY(0)" : "translateY(28px)",
          }}
        >
          <p className="text-pink-400 text-xs sm:text-sm font-medium tracking-widest uppercase mb-3">
            Tentang kamuu, doa doaku, dan masa depan kamuu.
          </p>

          {/* Judul dengan Serif italic + gradient */}
          <h2
            className="text-3xl sm:text-5xl font-black leading-tight bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(135deg, #9f1239 0%, #e11d48 50%, #fb7185 100%)",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontStyle: "italic",
            }}
          >
            Twenty One:<br />
            <span className="not-italic font-bold text-2xl sm:text-3xl text-pink-800" style={{ fontFamily: "inherit" }}>
              Growing &amp; Glowing
            </span>
          </h2>

          {/* Body paragraph — sans-serif, airy */}
          <p className="mt-5 text-pink-700 text-sm sm:text-base max-w-2xl leading-relaxed">
            Twenty One Years of being wonderful. Melihatmu sampai di titik ini
            membuatku sadar betapa hebatnya kamu melewati prosesnya. Teruslah
            tumbuh dengan caramu sendiri yah sayangku. Keep shining, because the
            world is a better place with you in it.
          </p>
        </div>

        {/* ── Cards ─────────────────────────────────────────────────────── */}
        <div className="space-y-8">

          {/* CARD 1 — slide from left, shifted left */}
          <div
            ref={card1.ref}
            className="sm:-ml-4 transition-all duration-700 ease-out"
            style={{
              opacity: card1.inView ? 1 : 0,
              transform: card1.inView ? "translateX(0)" : "translateX(-60px)",
            }}
          >
            <div className="relative rounded-3xl bg-white/40 backdrop-blur-md border border-white/60 p-6 sm:p-8 shadow-[0_8px_32px_rgba(244,114,182,0.18)] hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(244,114,182,0.30)] transition-all duration-300 overflow-hidden">

              {/* Big quote mark watermark */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-4 -left-2 text-[8rem] leading-none text-pink-200/40 select-none font-serif"
              >"</span>

              {/* Badge */}
              <span className="inline-flex items-center rounded-full bg-pink-500 px-3 py-1 text-xs font-semibold text-white shadow-sm mb-4">
                Babak Baru: 21 Tahun
              </span>

              <p className="text-[11px] text-pink-400 font-medium mb-3 tracking-wide uppercase">
                Usia: 21 tahun
              </p>

              <p className="text-sm sm:text-base text-pink-900 leading-relaxed">
                Di umur ke-21 ini, aku ngeliat kamu bukan cuma sebagai seseorang
                yang lagi bertambah usia, tapi juga seseorang yang pelan-pelan
                tumbuh, belajar, jatuh, bangkit lagi, dan tetap jadi kamu yang aku
                banggakan.
              </p>
            </div>
          </div>

          {/* CARD 2 — slide from right, shifted right, with lily */}
          <div
            ref={card2.ref}
            className="sm:-mr-4 sm:ml-4 transition-all duration-700 ease-out delay-150"
            style={{
              opacity: card2.inView ? 1 : 0,
              transform: card2.inView ? "translateX(0)" : "translateX(60px)",
              transitionDelay: card2.inView ? "150ms" : "0ms",
            }}
          >
            <div className="relative rounded-3xl bg-white/40 backdrop-blur-md border border-white/60 p-6 sm:p-8 shadow-[0_8px_32px_rgba(244,114,182,0.18)] hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(244,114,182,0.30)] transition-all duration-300 overflow-hidden">

              {/* Big quote mark watermark */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-4 -left-2 text-[8rem] leading-none text-pink-200/40 select-none font-serif"
              >"</span>

              {/* Floating lily — pojok kanan atas */}
              <span
                aria-hidden="true"
                className="absolute top-4 right-5 text-3xl select-none pointer-events-none"
                style={{ filter: "drop-shadow(0 2px 6px rgba(244,114,182,0.4))" }}
              >
                🌸
              </span>

              {/* Badge */}
              <span className="inline-flex items-center rounded-full bg-rose-400 px-3 py-1 text-xs font-semibold text-white shadow-sm mb-4">
                Harapan Tahun Ini
              </span>

              <p className="text-[11px] text-pink-400 font-medium mb-3 tracking-wide uppercase">
                Untuk: Ameisha Nadilah
              </p>

              <p className="text-sm sm:text-base text-pink-900 leading-relaxed">
                Untuk kamu sayangku, di usia baru ini, aku ingin kamu lebih banyak tersenyum
                untuk dirimu sendiri.{" "}
                <em
                  className="not-italic text-rose-500 font-medium"
                  style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}
                >
                  May your heart be light, your soul be brave, and your dreams find their way home.
                </em>{" "}
                Aku akan selalu di sini, menjadi tempatmu pulang.{" "}
                <em style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }} className="text-rose-500">
                  I'm always in your corner, today and always.
                </em>
              </p>
            </div>
          </div>
        </div>

        {/* ── Closing — generous whitespace, dashed memo border ─────────── */}
        <div
          ref={closing.ref}
          className="mt-20 transition-all duration-700 ease-out"
          style={{
            opacity: closing.inView ? 1 : 0,
            transform: closing.inView ? "translateY(0)" : "translateY(24px)",
            transitionDelay: closing.inView ? "200ms" : "0ms",
          }}
        >
          <div className="rounded-2xl border border-dashed border-pink-300/70 bg-pink-50/40 px-8 py-8 text-center">
            <p className="text-sm sm:text-base text-pink-600 leading-relaxed">
              Semoga di tiap halamannya, kamu selalu
              <br className="hidden sm:block" />
              nemuin alasan buat senyum yah sayang. 🌷
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
