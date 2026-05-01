"use client";
import { useEffect, useRef, useState } from "react";

const thingsILove = [
  {
    id: 0,
    size: "wide", // spans 2 cols on desktop
    rotate: "rotate-[-0.8deg]",
    icon: "🏡",
    text: "Aku suka bagaimana kamu selalu menjadi tempat paling tenang untukku pulang.",
    sub: "Home is wherever you are.",
  },
  {
    id: 1,
    size: "tall", // taller card
    rotate: "rotate-[1.2deg]",
    icon: "✈️",
    text: "Caramu memeluk jarak antara Balikpapan dan Pontianak dengan sabar, meyakinkanku kalau hati kita gak bener-bener jauh.",
    sub: "You taught me that distance is just a test to see how far love can travel.",
  },
  {
    id: 2,
    size: "normal",
    rotate: "rotate-[-1.4deg]",
    icon: "🌸",
    text: "Aku suka bagaimana senyummu selalu punya cara ajaib untuk membuat duniaku yang rumit terasa jauh lebih indah.",
    sub: "Your smile is my favorite piece of art.",
  },
  {
    id: 3,
    size: "normal",
    rotate: "rotate-[0.9deg]",
    icon: "🫶",
    text: "Caramu mendengarkan semua ceritaku dengan tulus, membuatku merasa menjadi orang paling beruntung di dunia.",
    sub: "You listen like the world can wait.",
  },
  {
    id: 4,
    size: "normal",
    rotate: "rotate-[-0.6deg]",
    icon: "⭐",
    text: "Fakta bahwa di umur 21 ini, kamu udah sejauh ini berjuang tapi tetap bisa senyum.",
    sub: "Still standing. Still glowing.",
  },
  {
    id: 5,
    size: "wide",
    rotate: "rotate-[0.5deg]",
    icon: "💌",
    text: "Ini baru sebagian kecil dari hal-hal yang aku suka dari kamu, Wanitaku tercantik, terpinter, terimut, tersayangku sedunia akhirat.",
    sub: "Every word here is just the beginning.",
  },
];

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

function LoveCard({ item, delay }: { item: typeof thingsILove[0]; delay: number }) {
  const [hovered, setHovered] = useState(false);
  const { ref, inView } = useInView(0.1);

  return (
    <div
      ref={ref}
      className={[
        item.size === "wide" ? "sm:col-span-2" : "",
        item.size === "tall" ? "sm:row-span-2" : "",
        "transition-all duration-700 ease-out",
      ].join(" ")}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0) scale(1)" : "translateY(32px) scale(0.97)",
        transitionDelay: inView ? `${delay}ms` : "0ms",
      }}
    >
      <div
        className={[
          item.rotate,
          "relative h-full rounded-2xl bg-white/40 backdrop-blur-md border border-white/50",
          "p-5 sm:p-6 flex flex-col gap-3 cursor-default overflow-hidden",
          "transition-all duration-300 ease-out",
          hovered
            ? "shadow-[0_20px_50px_rgba(244,114,182,0.35)] scale-[1.03] rotate-0 border-pink-200/60"
            : "shadow-[0_4px_20px_rgba(244,114,182,0.12)]",
        ].join(" ")}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Quote mark watermark */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-3 -right-1 text-[6rem] leading-none text-pink-200/30 select-none font-serif"
        >"</span>

        {/* Floating icon with pulse on hover */}
        <span
          className={[
            "text-2xl transition-all duration-300 w-fit",
            hovered ? "scale-125 drop-shadow-[0_0_8px_rgba(244,114,182,0.7)]" : "scale-100",
          ].join(" ")}
        >
          {item.icon}
        </span>

        {/* Main text — serif */}
        <p
          className="text-sm sm:text-base text-pink-900 leading-relaxed flex-1"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {item.text}
        </p>

        {/* Sub text — italic english, reveal on hover */}
        <p
          className={[
            "text-xs sm:text-sm text-rose-400 font-medium italic transition-all duration-300",
            hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
          ].join(" ")}
          style={{ fontFamily: "Georgia, serif" }}
        >
          {item.sub}
        </p>

        {/* Animated heart dot bottom-right */}
        <span
          className={[
            "absolute bottom-4 right-5 text-pink-300 text-lg transition-all duration-300 select-none",
            hovered ? "text-pink-500 scale-125" : "scale-100",
          ].join(" ")}
          style={{ animation: hovered ? "heartbeat 0.8s ease-in-out infinite" : "none" }}
        >
          ♡
        </span>
      </div>
    </div>
  );
}

export default function SectionKetiga() {
  const heading = useInView(0.2);

  return (
    <section className="relative w-full py-24 px-4 sm:px-10 bg-gradient-to-b from-white via-pink-50/60 to-rose-50/30 overflow-hidden">
      <style>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1.25); }
          50% { transform: scale(1.45); }
        }
      `}</style>

      {/* Ambient blobs */}
      <span aria-hidden="true" className="pointer-events-none absolute top-0 right-0 h-80 w-80 rounded-full bg-rose-100/40 blur-3xl" />
      <span aria-hidden="true" className="pointer-events-none absolute bottom-10 left-0 h-72 w-72 rounded-full bg-pink-100/40 blur-3xl" />

      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <div
          ref={heading.ref}
          className="mb-14 transition-all duration-700 ease-out"
          style={{
            opacity: heading.inView ? 1 : 0,
            transform: heading.inView ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <p className="text-pink-400 text-xs tracking-widest uppercase font-medium mb-3">
            untukmu, dari hatiku
          </p>
          <h2
            className="text-3xl sm:text-5xl font-black bg-clip-text text-transparent leading-tight"
            style={{
              backgroundImage: "linear-gradient(135deg, #9f1239 0%, #e11d48 55%, #fb7185 100%)",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontStyle: "italic",
            }}
          >
            Hal‑hal yang Aku Suka
            <br />
            <span className="not-italic text-2xl sm:text-3xl text-pink-800 font-bold">
              dari Ameisha
            </span>
          </h2>
          <p className="mt-4 text-pink-600 text-sm sm:text-base max-w-xl leading-relaxed">
            Di usia 21 tahun ini, ada banyak banget hal tentang kamu yang bikin
            aku bersyukur bisa kenal dan deket sama kamu. Hover tiap kartu yah sayang 🌸
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 auto-rows-auto">
          {thingsILove.map((item, i) => (
            <LoveCard key={item.id} item={item} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}
