"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const memories = [
  {
    title: "Foto 1",
    caption: "Foto pertama yang ngebuat aku kecantol sama kamu.",
    imageSrc: "/Foto2.jpg",
  },
  {
    title: "Foto 2",
    caption: "Ini Foto yang palingg aku ingattt.",
    imageSrc: "/Foto3.jpg",
  },
  {
    title: "Foto 3",
    caption: "Momen Idul Fitri.",
    imageSrc: "/Foto4.jpg",
  },
  {
    title: "Foto 4",
    caption: "Ini foto yang menurut aku kamu cantik banget banget banget",
    imageSrc: "/Foto5.jpg",
  },
];

export default function SectionKeempat() {
  const [selected, setSelected] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const prev = () => setSelected((s) => (s !== null ? (s - 1 + memories.length) % memories.length : null));
  const next = () => setSelected((s) => (s !== null ? (s + 1) % memories.length : null));

  // tutup dengan keyboard ESC, navigasi dengan arrow
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const lightbox = selected !== null && (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(20, 0, 10, 0.85)" }}
      onClick={() => setSelected(null)}
    >
      <div
        className="relative w-full max-w-lg flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol close */}
        <button
          onClick={() => setSelected(null)}
          className="absolute -top-10 right-0 text-white text-2xl hover:text-pink-300 transition-colors"
        >
          ✕
        </button>

        {/* Foto */}
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src={memories[selected].imageSrc}
            alt={memories[selected].title}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* Caption */}
        <p className="mt-4 text-white text-sm text-center italic px-4">
          {memories[selected].caption}
        </p>

        {/* Navigasi */}
        <div className="flex gap-6 mt-5">
          <button
            onClick={prev}
            className="bg-pink-500/80 hover:bg-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg transition-colors"
          >
            ‹
          </button>
          <span className="text-pink-300 text-sm self-center">
            {selected + 1} / {memories.length}
          </span>
          <button
            onClick={next}
            className="bg-pink-500/80 hover:bg-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg transition-colors"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <section className="w-full py-16 px-4 sm:px-10 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-pink-900 mb-6">
          Potongan Kenangan Ulang Tahun
        </h2>
        <p className="text-pink-700 text-sm sm:text-base mb-6">
          Di sini nanti bakal keisi foto-foto momen ulang tahunmu, atau momen
          random lain yang bikin kamu inget kalau kamu layak dirayakan, bukan
          cuma hari ini, tapi setiap hari.
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          {memories.map((memory, index) => (
            <div
              key={index}
              onClick={() => setSelected(index)}
              className="cursor-pointer rounded-2xl bg-pink-50/80 border border-pink-100 p-4 flex flex-col justify-between min-h-[220px] shadow-sm shadow-pink-100 hover:-translate-y-1 hover:shadow-pink-200 hover:shadow-md transition-all duration-300"
            >
              <div>
                <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-2xl bg-pink-100">
                  <Image
                    src={memory.imageSrc}
                    alt={memory.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/20 rounded-2xl">
                    <span className="text-white text-3xl">🔍</span>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-pink-900 mb-2">
                  {memory.title}
                </h3>
                <p className="text-xs sm:text-sm text-pink-800">
                  {memory.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {mounted && createPortal(lightbox, document.body)}
    </section>
  );
}
