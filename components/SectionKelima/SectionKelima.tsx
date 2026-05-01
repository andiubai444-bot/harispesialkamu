"use client";
import { useState, useEffect, useRef } from "react";

const promises = [
  {
    text: "Aku janji bakal tetap di sini jadi orang pertama yang dengerin semua keluh kesahmu, bahkan saat kamu cuma pengen marah-marah ke dunia tanpa alasan yang jelas.",
    color: "bg-pink-100/70",
    washi: "bg-pink-300/50",
    rotate: "rotate-[-1.2deg]",
    washiRotate: "-rotate-2",
  },
  {
    text: "Aku janji sejauh apa pun jarak Balikpapan ke Pontianak, aku nggak akan pernah bosen buat cari cara supaya kamu selalu ngerasa kalau aku ada tepat di sebelahmu sayang.",
    color: "bg-rose-100/70",
    washi: "bg-rose-300/50",
    rotate: "rotate-[1.4deg]",
    washiRotate: "rotate-1",
  },
  {
    text: "Aku janji bakal terus mengusahakan 'kita' supaya 'Amin' yang paling serius itu beneran kejadian, dan tahun-tahun depan kita masih ngerayain ulang tahun kamu sambil ketawa bareng lagi.",
    color: "bg-pink-50/80",
    washi: "bg-pink-400/40",
    rotate: "rotate-[-0.8deg]",
    washiRotate: "rotate-3",
  },
  {
    text: "Aku janji bakal jadi tempat paling aman buat kamu jadi diri sendiri. Kamu nggak perlu pura-pura kuat di depanku Okeyy. Kalau capek, bilang ya? Kita istirahat bareng-bareng.",
    color: "bg-red-50/70",
    washi: "bg-red-200/60",
    rotate: "rotate-[0.9deg]",
    washiRotate: "-rotate-1",
  },
  {
    text: "Aku janji bakal terus semangatin kamu, termasuk waktu kamu lagi pusing sama judul skripsi atau tugas-tugas kuliahmu nanti. Aku bakal ada di barisan paling depan buat bangga sama kamu.",
    color: "bg-rose-50/80",
    washi: "bg-rose-400/40",
    rotate: "rotate-[-1.6deg]",
    washiRotate: "rotate-2",
  },
];

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLLIElement>(null);
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

function PromiseCard({
  item,
  index,
  locked,
  onToggle,
}: {
  item: typeof promises[0];
  index: number;
  locked: boolean;
  onToggle: () => void;
}) {
  const { ref, inView } = useInView(0.1);

  return (
    <li
      ref={ref}
      className="transition-all duration-700 ease-out"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0) scale(1)" : "translateY(28px) scale(0.97)",
        transitionDelay: inView ? `${index * 90}ms` : "0ms",
        listStyle: "none",
      }}
    >
      <div
        className={[
          item.rotate,
          item.color,
          "relative rounded-2xl backdrop-blur-md border border-white/50 p-5 sm:p-6",
          "shadow-[0_4px_18px_rgba(244,114,182,0.12)]",
          "hover:shadow-[0_12px_35px_rgba(244,114,182,0.25)] hover:-translate-y-1 hover:rotate-0",
          "transition-all duration-300 ease-out overflow-visible",
          locked ? "opacity-80" : "",
        ].join(" ")}
      >
        {/* Washi tape top-center */}
        <div
          className={[
            "absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-5 rounded-sm",
            item.washi,
            item.washiRotate,
            "backdrop-blur-sm border border-white/30 shadow-sm",
          ].join(" ")}
          aria-hidden="true"
        />

        {/* Star toggle + promise number */}
        <div className="flex items-start gap-3">
          <button
            onClick={onToggle}
            aria-label={locked ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
            className="mt-1 flex-shrink-0 text-lg transition-all duration-300 hover:scale-125 focus:outline-none"
            title={locked ? "Klik untuk buka kunci" : "Klik untuk kunci janji ini"}
          >
            {locked ? (
              <span className="text-pink-500 drop-shadow-[0_0_6px_rgba(244,114,182,0.8)]">✦</span>
            ) : (
              <span className="text-pink-300">✦</span>
            )}
          </button>

          <div className="flex-1">
            <p className="text-[10px] text-pink-400 tracking-widest uppercase mb-2">
              Janji #{index + 1}
            </p>

            {/* Promise text — handwritten font */}
            <div className="relative">
              <p
                className={[
                  "text-base sm:text-lg text-pink-900 leading-relaxed transition-all duration-500",
                  locked ? "text-pink-400" : "",
                ].join(" ")}
                style={{ fontFamily: "'Caveat', 'Indie Flower', cursive", fontSize: "1.1rem" }}
              >
                {item.text}
              </p>

              {/* Hand-drawn strikethrough — only when locked */}
              {locked && (
                <div
                  className="absolute inset-0 flex items-center pointer-events-none"
                  aria-hidden="true"
                >
                  <svg
                    className="w-full"
                    height="18"
                    viewBox="0 0 400 18"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2,9 Q50,5 100,10 Q150,15 200,8 Q250,3 300,11 Q350,15 398,9"
                      stroke="#f9a8d4"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                      style={{
                        strokeDasharray: 500,
                        strokeDashoffset: 0,
                        animation: "drawLine 0.5s ease-out forwards",
                      }}
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Timestamp */}
            <p
              className="mt-3 text-[10px] text-pink-400/70 tracking-wide"
              style={{ fontFamily: "'Courier New', monospace" }}
            >
              {locked ? "✓ Sudah dikunci — " : ""}Ditulis dengan tulus dari Balikpapan
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}

export default function SectionKelima() {
  const [locked, setLocked] = useState<boolean[]>(Array(promises.length).fill(false));
  const headingRef = useRef<HTMLDivElement>(null);
  const [headingVisible, setHeadingVisible] = useState(false);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setHeadingVisible(true); }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const toggle = (i: number) =>
    setLocked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  const lockedCount = locked.filter(Boolean).length;

  return (
    <section className="relative w-full py-24 px-4 sm:px-10 bg-gradient-to-b from-rose-50/30 via-pink-50/50 to-white overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&display=swap');
        @keyframes drawLine {
          from { stroke-dashoffset: 500; }
          to   { stroke-dashoffset: 0; }
        }
      `}</style>

      {/* Ambient */}
      <span aria-hidden="true" className="pointer-events-none absolute top-0 right-0 h-72 w-72 rounded-full bg-pink-100/40 blur-3xl" />
      <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-rose-100/30 blur-3xl" />

      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <div
          ref={headingRef}
          className="mb-14 transition-all duration-700 ease-out"
          style={{ opacity: headingVisible ? 1 : 0, transform: headingVisible ? "translateY(0)" : "translateY(24px)" }}
        >
          <p className="text-pink-400 text-xs tracking-widest uppercase font-medium mb-3">untuk kamu</p>
          <h2
            className="text-3xl sm:text-5xl font-black bg-clip-text text-transparent leading-tight"
            style={{
              backgroundImage: "linear-gradient(135deg, #9f1239 0%, #e11d48 55%, #fb7185 100%)",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontStyle: "italic",
            }}
          >
            Janji Kecil
            <br />
            <span className="not-italic text-2xl sm:text-3xl text-pink-800 font-bold">di Usia 21</span>
          </h2>
          <p className="mt-4 text-pink-600 text-sm sm:text-base max-w-xl leading-relaxed">
            Di momen ulang tahunmu ini, aku pengin nitip beberapa janji kecil yang
            semoga bisa bikin kamu ngerasa lebih aman dan lebih disayang.{" "}
            <em className="text-rose-300" style={{ fontFamily: "Georgia, serif" }}>
              Tap the star to lock each promise.
            </em>
          </p>

          {/* Progress indicator */}
          {lockedCount > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-pink-100/80 px-4 py-1.5 text-xs text-pink-600">
              <span className="text-pink-500">✦</span>
              {lockedCount} dari {promises.length} janji sudah dikunci
            </div>
          )}
        </div>

        {/* Promise cards */}
        <ul className="space-y-7" style={{ paddingTop: "1rem" }}>
          {promises.map((item, index) => (
            <PromiseCard
              key={index}
              item={item}
              index={index}
              locked={locked[index]}
              onToggle={() => toggle(index)}
            />
          ))}
        </ul>

        {/* All locked celebration */}
        {lockedCount === promises.length && (
          <div className="mt-12 text-center transition-all duration-700 animate-fade-in">
            <p
              className="text-lg text-pink-500 italic"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Semua janji sudah terkunci di hatimu 🌸
              <br />
              <span className="text-sm text-pink-400">Aku akan menepatinya satu per satu, sayangku.</span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
