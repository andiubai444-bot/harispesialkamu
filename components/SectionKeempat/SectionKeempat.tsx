"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const handleScroll = () => {
      const cardWidth = el.clientWidth * 0.78 + 16;
      const idx = Math.round(el.scrollLeft / cardWidth);
      setActiveIndex(Math.min(idx, memories.length - 1));
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (carouselRef.current?.offsetLeft ?? 0);
    scrollLeft.current = carouselRef.current?.scrollLeft ?? 0;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    carouselRef.current.scrollLeft = scrollLeft.current - (x - startX.current) * 1.2;
  };

  const stopDrag = () => {
    isDragging.current = false;
  };

  const prev = () =>
    setSelected((s) =>
      s !== null ? (s - 1 + memories.length) % memories.length : null
    );

  const next = () =>
    setSelected((s) =>
      s !== null ? (s + 1) % memories.length : null
    );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const lightbox =
    selected !== null && (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
        style={{ backgroundColor: "rgba(20, 0, 10, 0.85)" }}
        onClick={() => setSelected(null)}
      >
        <div
          className="relative w-full max-w-lg flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setSelected(null)}
            className="absolute -top-10 right-0 text-white text-2xl hover:text-pink-300 transition-colors"
          >
            x
          </button>
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={memories[selected].imageSrc}
              alt={memories[selected].title}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <p className="mt-4 text-white text-sm text-center italic px-4">
            {memories[selected].caption}
          </p>
          <div className="flex gap-6 mt-5">
            <button
              onClick={prev}
              className="bg-pink-500/80 hover:bg-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg transition-colors"
            >
              &lsaquo;
            </button>
            <span className="text-pink-300 text-sm self-center">
              {selected + 1} / {memories.length}
            </span>
            <button
              onClick={next}
              className="bg-pink-500/80 hover:bg-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg transition-colors"
            >
              &rsaquo;
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
          Di sini nanti bakal keisi foto-foto momen ulang tahunmu, atau momen random lain yang bikin kamu inget kalau kamu layak dirayakan, bukan cuma hari ini, tapi setiap hari.
        </p>

        <div
          ref={carouselRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          className="flex gap-4 overflow-x-auto pb-2 cursor-grab active:cursor-grabbing select-none"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
          }}
        >
          {memories.map((memory, index) => (
            <div
              key={index}
              onClick={() => setSelected(index)}
              className="flex-none cursor-pointer rounded-2xl bg-pink-50/80 border border-pink-100 p-4 flex flex-col shadow-sm shadow-pink-100 hover:-translate-y-1 hover:shadow-pink-200 hover:shadow-md transition-all duration-300"
              style={{ width: "78%", scrollSnapAlign: "center" }}
            >
              <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-2xl bg-pink-100">
                <Image
                  src={memory.imageSrc}
                  alt={memory.title}
                  fill
                  sizes="80vw"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/20 rounded-2xl">
                  <span className="text-white text-3xl">🔍</span>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-pink-900 mb-2">
                {memory.title}
              </h3>
              <p className="text-xs sm:text-sm text-pink-800">{memory.caption}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {memories.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeIndex ? "bg-pink-500 w-4" : "bg-pink-200 w-2"
              }`}
            />
          ))}
        </div>
      </div>

      {mounted && createPortal(lightbox, document.body)}
    </section>
  );
}
