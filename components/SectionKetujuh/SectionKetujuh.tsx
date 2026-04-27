"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type HeartBurst = {
  id: number;
  left: number;
  size: number;
  duration: number;
};

const memories = [
  {
    title: "Kenangan 1",
    caption: "Foto ini nanti bisa kita ganti sama momen kita yang paling kamu suka.",
    imageSrc: "/Foto2.jpg",
  },
  {
    title: "Kenangan 2",
    caption: "Di sini mungkin waktu kita pertama kali ketemu mungkin.",
    imageSrc: "/Foto3.jpg",
  },
  {
    title: "Kenangan 3",
    caption: "Momen random tapi berkesan, yang keliatannya kecil tapi kerasa hangat.",
    imageSrc: "/Foto4.jpg",
  },
  {
    title: "Kenangan 4",
    caption: "Nanti kita isi lagi sama memori baru.",
    imageSrc: "/Foto5.jpg",
  },
];

export default function SectionKetujuh() {
  const [hearts, setHearts] = useState<HeartBurst[]>([]);
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!isSlideshowOpen) return;
    const intervalId = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % memories.length);
    }, 2500);
    return () => window.clearInterval(intervalId);
  }, [isSlideshowOpen]);

  useEffect(() => {
    if (isSlideshowOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isSlideshowOpen]);

  const handleClaimHug = () => {
    const burst = Array.from({ length: 8 }, (_, index) => ({
      id: Date.now() + index,
      left: Math.random() * 90 + 5,
      size: Math.floor(Math.random() * 8) + 14,
      duration: 900 + Math.floor(Math.random() * 600),
    }));
    setHearts((prev) => [...prev, ...burst]);
    window.setTimeout(() => {
      setHearts((prev) => prev.filter((heart) => !burst.some((b) => b.id === heart.id)));
    }, 1800);
    setCurrentSlide(0);
    setIsSlideshowOpen(true);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + memories.length) % memories.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % memories.length);
  };

  const modal = (
    <div
      className="fixed inset-0 bg-pink-950/55 px-4 py-6 sm:p-8 flex items-center justify-center"
      style={{ zIndex: 99999 }}
      onClick={() => setIsSlideshowOpen(false)}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-pink-100 bg-white p-4 sm:p-5 shadow-xl shadow-pink-900/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-pink-100">
          <Image
            src={memories[currentSlide].imageSrc}
            alt={memories[currentSlide].title}
            fill
            sizes="(max-width: 640px) 92vw, 420px"
            className="object-cover"
          />
        </div>
        <p className="mt-3 text-sm text-pink-500 font-medium">
          {currentSlide + 1} / {memories.length}
        </p>
        <h3 className="text-lg font-semibold text-pink-900">
          {memories[currentSlide].title}
        </h3>
        <p className="mt-1 text-sm text-pink-700">
          {memories[currentSlide].caption}
        </p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handlePrevSlide}
            className="rounded-full border border-pink-200 px-4 py-2 text-sm font-medium text-pink-700 hover:bg-pink-50 transition-colors"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => setIsSlideshowOpen(false)}
            className="rounded-full bg-pink-500 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-600 transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleNextSlide}
            className="rounded-full border border-pink-200 px-4 py-2 text-sm font-medium text-pink-700 hover:bg-pink-50 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <section className="w-full py-14 px-4 sm:px-10 bg-pink-50 border-t border-pink-100">
        <div className="max-w-5xl mx-auto text-center text-pink-900">
          <p className="text-sm sm:text-base mb-2">
            Makasih ya sudah mau baca sampai habis, dan sudah ngelihatin hadiah
            kecil ini di hari ulang tahunmu.
          </p>
          <p className="text-base sm:text-lg font-semibold mb-4">
            Sekali lagi, selamat ulang tahun yang ke-21, Ameishaa Sayangku
          </p>
          <p className="text-xs sm:text-sm text-pink-600">
            (Tombol ini nggak ngapa-ngapain, tapi anggap aja ini pelukan virtual
            dari aku buat kamu yang lagi ulang tahun hari ini.)
          </p>
          <div className="mt-3 relative inline-flex justify-center">
            {hearts.map((heart) => (
              <span
                key={heart.id}
                className="pointer-events-none absolute -top-2 text-pink-400 animate-love-burst"
                style={{
                  left: `${heart.left}%`,
                  fontSize: `${heart.size}px`,
                  animationDuration: `${heart.duration}ms`,
                }}
              >
                ❤
              </span>
            ))}
            <button
              onClick={handleClaimHug}
              type="button"
              className="relative z-10 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2 text-sm font-medium text-pink-700 border border-pink-200 shadow-sm shadow-pink-100 hover:bg-pink-50 active:scale-95 transition"
            >
              Claim a hug ♡
            </button>
          </div>
        </div>
      </section>

      {mounted && isSlideshowOpen && createPortal(modal, document.body)}
    </>
  );
}
