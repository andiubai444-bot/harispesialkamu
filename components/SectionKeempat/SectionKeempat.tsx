"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const memories = [
  {
    title: "Foto 1",
    captionID: "Foto yang jadi alasan kenapa aku jatuh hati begitu dalam.",
    captionEN: "Since that day, I knew you were the most beautiful view I've ever seen.",
    imageSrc: "/Foto2.jpg",
    date: "2025.12.26",
    washiColor: "bg-pink-300/50",
    rotate: "-rotate-2",
    stackRotates: ["rotate-3", "rotate-1", "-rotate-0"],
  },
  {
    title: "Foto 2",
    captionID: "Satu potret yang paling sering aku putar ulang di kepala.",
    captionEN: "Of all the memories we've shared, this one stays with me the most.",
    imageSrc: "/Foto3.jpg",
    date: "2026.02.25",
    washiColor: "bg-rose-300/50",
    rotate: "rotate-1",
    stackRotates: ["-rotate-2", "rotate-1", "rotate-0"],
  },
  {
    title: "Foto 3",
    captionID: "Di hari yang fitri, aku menemukan kemenangan kecilku pada hadirmu.",
    captionEN: "A day of celebration made even more beautiful because you were part of it.",
    imageSrc: "/Foto4.jpg",
    date: "2026.03.21",
    washiColor: "bg-pink-200/60",
    rotate: "-rotate-1",
    stackRotates: ["rotate-2", "-rotate-1", "rotate-0"],
  },
  {
    title: "Foto 4",
    captionID: "Definisi cantik yang tidak pernah bosan aku pandangi.",
    captionEN: "In my eyes, you always find a way to keep shining.",
    imageSrc: "/Foto5.jpg",
    date: "2026.03.25",
    washiColor: "bg-red-200/50",
    rotate: "rotate-2",
    stackRotates: ["-rotate-3", "rotate-1", "-rotate-0"],
  },
];

function PhotoStack({ memory, index, onClick }: {
  memory: typeof memories[0];
  index: number;
  onClick: () => void;
}) {
  const [lifted, setLifted] = useState(false);

  return (
    <div
      className="flex-none"
      style={{ width: "78%", scrollSnapAlign: "center" }}
    >
      {/* Outer wrapper for the whole card */}
      <div
        className="relative cursor-pointer select-none"
        onClick={onClick}
        onMouseEnter={() => setLifted(true)}
        onMouseLeave={() => setLifted(false)}
        style={{ paddingTop: "1.5rem", paddingBottom: "0.5rem" }}
      >
        {/* Stack layers behind — fake photos */}
        {memory.stackRotates.map((rot, si) => (
          <div
            key={si}
            className={[
              "absolute inset-0 top-3 rounded-2xl border-[10px] border-white bg-pink-50",
              rot,
              "transition-all duration-500 ease-out",
            ].join(" ")}
            style={{
              zIndex: si,
              boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
              transform: lifted
                ? `rotate(${si % 2 === 0 ? si * 3 : -(si * 2)}deg) translateY(${si * 4}px)`
                : undefined,
            }}
          />
        ))}

        {/* Top photo card */}
        <div
          className={[
            "relative z-10 rounded-2xl border-[10px] border-white overflow-hidden",
            memory.rotate,
            "transition-all duration-500 ease-out",
            "shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(244,114,182,0.2)]",
            lifted
              ? "shadow-[0_24px_60px_rgba(0,0,0,0.18),0_4px_20px_rgba(244,114,182,0.35)] -translate-y-3 scale-[1.02] rotate-0"
              : "",
          ].join(" ")}
        >
          {/* Washi tape top */}
          <div className={[
            "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20",
            "w-14 h-5 rounded-sm opacity-80",
            memory.washiColor,
            "backdrop-blur-sm border border-white/30",
          ].join(" ")}
            style={{ transform: "translateX(-50%) translateY(-40%) rotate(-2deg)" }}
          />

          {/* Photo */}
          <div className="relative aspect-[4/5] w-full bg-pink-100">
            <Image
              src={memory.imageSrc}
              alt={memory.title}
              fill
              sizes="80vw"
              className={[
                "object-cover transition-transform duration-700",
                lifted ? "scale-105" : "scale-100",
              ].join(" ")}
            />
            {/* Dreamy overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-pink-900/20 via-transparent to-transparent" />

            {/* Date stamp — bottom left, monospace */}
            <div
              className="absolute bottom-3 left-3 z-10 text-white/80 text-[10px] tracking-widest"
              style={{ fontFamily: "'Courier New', Courier, monospace" }}
            >
              {memory.date}
            </div>

            {/* Zoom hint */}
            <div className={[
              "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
              lifted ? "opacity-100" : "opacity-0",
            ].join(" ")}>
              <span className="text-white/90 text-4xl drop-shadow-lg">🔍</span>
            </div>
          </div>

          {/* Caption area — below photo, inside the white border */}
          <div className="bg-white px-4 pt-3 pb-4">
            {/* Indonesian — pink-900, serif */}
            <p
              className="text-sm text-pink-900 leading-relaxed mb-1"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              {memory.captionID}
            </p>
            {/* English — italic, muted rose, serif */}
            <p
              className="text-xs text-rose-300 italic leading-relaxed"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              {memory.captionEN}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SectionKeempat() {
  const [selected, setSelected] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => { setMounted(true); }, []);

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
  const stopDrag = () => { isDragging.current = false; };

  const prev = () => setSelected((s) => s !== null ? (s - 1 + memories.length) % memories.length : null);
  const next = () => setSelected((s) => s !== null ? (s + 1) % memories.length : null);

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
      style={{ backgroundColor: "rgba(20, 0, 10, 0.88)", backdropFilter: "blur(8px)" }}
      onClick={() => setSelected(null)}
    >
      <div
        className="relative w-full max-w-lg flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setSelected(null)}
          className="absolute -top-10 right-0 text-white/70 hover:text-pink-300 transition-colors text-2xl"
        >✕</button>

        {/* Lightbox photo — with washi tape */}
        <div className="relative w-full">
          <div className={[
            "rounded-2xl border-[12px] border-white overflow-hidden",
            memories[selected].rotate,
            "shadow-[0_20px_60px_rgba(0,0,0,0.4)]",
          ].join(" ")}>
            {/* Washi tape */}
            <div className={[
              "absolute top-0 left-1/2 z-20 w-16 h-6 rounded-sm opacity-80",
              memories[selected].washiColor,
            ].join(" ")}
              style={{ transform: "translateX(-50%) translateY(-45%) rotate(-1deg)" }}
            />
            <div className="relative aspect-square w-full bg-pink-50">
              <Image
                src={memories[selected].imageSrc}
                alt={memories[selected].title}
                fill sizes="100vw"
                className="object-cover"
              />
              <div
                className="absolute bottom-3 left-3 text-white/80 text-[10px] tracking-widest"
                style={{ fontFamily: "'Courier New', monospace" }}
              >
                {memories[selected].date}
              </div>
            </div>
            <div className="bg-white px-5 pt-3 pb-4 text-center">
              <p className="text-sm text-pink-900" style={{ fontFamily: "Georgia, serif" }}>
                {memories[selected].captionID}
              </p>
              <p className="text-xs text-rose-300 italic mt-1" style={{ fontFamily: "Georgia, serif" }}>
                {memories[selected].captionEN}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-6 mt-6">
          <button onClick={prev} className="bg-pink-500/80 hover:bg-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl transition-all hover:scale-110">
            ‹
          </button>
          <span className="text-pink-300 text-sm self-center font-mono">{selected + 1} / {memories.length}</span>
          <button onClick={next} className="bg-pink-500/80 hover:bg-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl transition-all hover:scale-110">
            ›
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <section className="relative w-full py-20 px-4 sm:px-10 bg-gradient-to-b from-rose-50/30 via-white to-pink-50/40 overflow-hidden">
      {/* Ambient blobs */}
      <span aria-hidden="true" className="pointer-events-none absolute -top-10 right-0 h-72 w-72 rounded-full bg-pink-100/40 blur-3xl" />
      <span aria-hidden="true" className="pointer-events-none absolute bottom-0 -left-10 h-64 w-64 rounded-full bg-rose-100/30 blur-3xl" />

      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="mb-10">
          <p className="text-pink-400 text-xs tracking-widest uppercase font-medium mb-2">kenangan kita</p>
          <h2
            className="text-3xl sm:text-5xl font-black bg-clip-text text-transparent leading-tight"
            style={{
              backgroundImage: "linear-gradient(135deg, #9f1239 0%, #e11d48 55%, #fb7185 100%)",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontStyle: "italic",
            }}
          >
            Our Little Archive
            <br />
            <span className="not-italic text-2xl sm:text-3xl text-pink-800 font-bold">of Joy</span>
          </h2>
          <p className="mt-3 text-pink-600 text-sm sm:text-base max-w-xl leading-relaxed">
            Ruang ini aku siapkan untuk menyimpan semua binar matamu.{" "}
            <em className="text-rose-300 not-italic" style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}>
              May these moments remind you that you are worth celebrating not just today, but every single day.
            </em>
          </p>
        </div>

        {/* Carousel */}
        <div
          ref={carouselRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          className="flex gap-5 overflow-x-auto pb-4 cursor-grab active:cursor-grabbing select-none"
          style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
        >
          {memories.map((memory, index) => (
            <PhotoStack
              key={index}
              memory={memory}
              index={index}
              onClick={() => setSelected(index)}
            />
          ))}
        </div>

        {/* Dot indicators — capsule style */}
        <div className="flex justify-center gap-2 mt-5">
          {memories.map((_, i) => (
            <div
              key={i}
              className={[
                "h-2 rounded-full transition-all duration-400",
                i === activeIndex
                  ? "bg-pink-500 w-6"
                  : "bg-pink-200 w-2 hover:bg-pink-300",
              ].join(" ")}
            />
          ))}
        </div>
      </div>

      {mounted && createPortal(lightbox, document.body)}
    </section>
  );
}
