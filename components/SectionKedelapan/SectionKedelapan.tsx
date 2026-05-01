"use client";
import { useState, useEffect, useRef } from "react";

const playlist = [
  {
    title: "Prettiest Thing I've Ever Seen",
    artist: "Lany",
    albumColor: "from-violet-400 to-indigo-500",
    albumEmoji: "🎵",
    lyricQuote: "You're the prettiest thing I've ever seen.",
    reason:
      "Satu melodi yang selalu membawa pikiranku pulang ke kamu sayangg. Just like the lyrics say, you really are the prettiest thing I've ever seen.",
  },
  {
    title: "Rayuan Perempuan Gila",
    artist: "Nadin Amizah",
    albumColor: "from-rose-400 to-pink-500",
    albumEmoji: "🌸",
    lyricQuote: "Dan aku pun jatuh, dalam rayuanmu.",
    reason:
      "Lagu yang paling identik dengan suaramu saat bersenandung. Seeing you love this song makes me love it even more. Terima kasih sudah berbagi duniamu denganku yah honeyy.",
  },
  {
    title: "Lover",
    artist: "Taylor Swift",
    albumColor: "from-sky-300 to-teal-400",
    albumEmoji: "💛",
    lyricQuote: "Can I go where you go? Can we always be this close?",
    reason:
      "Satu melodi yang paling pas menggambarkan kita sayangg. In every lyric, I find a piece of our story. Terima kasih sudah menjadi sosok yang membuat lagu ini terasa begitu nyata.",
  },
  {
    title: "Amin Paling Serius",
    artist: "Sal Priadi & Nadin Amizah",
    albumColor: "from-amber-300 to-orange-400",
    albumEmoji: "🤲",
    lyricQuote: "Tuk selamanya… amin paling serius seluruh dunia.",
    reason:
      "Biar cinta kita paling kuat dan tetap mekar di antara doa-doa. Every prayer whispered feels like this song playing softly in the background.",
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

function VinylDisc({ color, emoji, spinning }: { color: string; emoji: string; spinning: boolean }) {
  return (
    <div
      className="relative flex-shrink-0 w-16 h-16 rounded-full shadow-lg"
      style={{
        animation: spinning ? "spin 3s linear infinite" : "none",
        background: `conic-gradient(#1a1a1a 0deg, #2a2a2a 30deg, #1a1a1a 60deg, #2a2a2a 90deg, #1a1a1a 120deg, #2a2a2a 150deg, #1a1a1a 180deg, #2a2a2a 210deg, #1a1a1a 240deg, #2a2a2a 270deg, #1a1a1a 300deg, #2a2a2a 330deg, #1a1a1a 360deg)`,
      }}
    >
      {/* Grooves */}
      <div className="absolute inset-[6px] rounded-full border border-gray-600/40" />
      <div className="absolute inset-[10px] rounded-full border border-gray-600/30" />
      {/* Center label */}
      <div className={`absolute inset-[14px] rounded-full bg-gradient-to-br ${color} flex items-center justify-center shadow-inner`}>
        <span className="text-sm">{emoji}</span>
      </div>
      {/* Center hole */}
      <div className="absolute inset-[28px] rounded-full bg-gray-900/80" />
    </div>
  );
}

function TrackCard({ song, index }: { song: typeof playlist[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const { ref, inView } = useInView(0.1);
  const isRight = index % 2 === 0; // alternating Z-pattern

  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-out"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView
          ? "translateX(0)"
          : `translateX(${isRight ? "-50px" : "50px"})`,
        transitionDelay: inView ? `${index * 100}ms` : "0ms",
      }}
    >
      <div
        className={[
          "relative rounded-3xl bg-white/35 backdrop-blur-md border border-white/50 overflow-hidden",
          "transition-all duration-400 ease-out",
          hovered
            ? "shadow-[0_20px_50px_rgba(244,114,182,0.28)] -translate-y-1"
            : "shadow-[0_4px_20px_rgba(244,114,182,0.10)]",
        ].join(" ")}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Big quote watermark */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-6 right-2 text-[7rem] leading-none text-pink-200/25 select-none font-serif"
        >"</span>

        {/* Inner layout — alternating direction */}
        <div className={`flex flex-col sm:flex-row ${isRight ? "" : "sm:flex-row-reverse"} gap-5 p-6 sm:p-7`}>

          {/* Left/Right: Vinyl + song info */}
          <div className="flex items-center gap-4 sm:w-56 flex-shrink-0">
            <VinylDisc color={song.albumColor} emoji={song.albumEmoji} spinning={hovered} />
            <div>
              <p className="text-[10px] text-pink-400 font-medium tracking-widest uppercase mb-1">
                Track {index + 1}
              </p>
              <p className="text-sm font-bold text-pink-900 leading-tight">{song.title}</p>
              <p className="text-xs text-pink-500 mt-0.5">{song.artist}</p>
            </div>
          </div>

          {/* Divider */}
          <div className={`hidden sm:block w-px self-stretch bg-pink-100/60 ${isRight ? "" : "order-first"}`} />

          {/* Right/Left: Quote + reason */}
          <div className="flex-1 flex flex-col justify-center gap-2">
            {/* Lyric quote — Serif, pink-800 */}
            <p
              className="text-sm sm:text-base text-pink-800 leading-relaxed"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic" }}
            >
              "{song.lyricQuote}"
            </p>
            {/* Reason — Sans-serif, smaller, muted */}
            <p className="text-xs sm:text-sm text-pink-600 leading-relaxed">
              {song.reason}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SectionKedelapan() {
  const heading = useInView(0.2);

  return (
    <section className="relative w-full py-24 px-4 sm:px-10 bg-gradient-to-b from-pink-50/40 via-white to-rose-50/30 overflow-hidden">
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* Ambient blobs */}
      <span aria-hidden="true" className="pointer-events-none absolute top-0 left-0 h-72 w-72 rounded-full bg-pink-100/30 blur-3xl" />
      <span aria-hidden="true" className="pointer-events-none absolute bottom-10 right-0 h-72 w-72 rounded-full bg-rose-100/30 blur-3xl" />

      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <div
          ref={heading.ref}
          className="mb-14 transition-all duration-700 ease-out"
          style={{ opacity: heading.inView ? 1 : 0, transform: heading.inView ? "translateY(0)" : "translateY(24px)" }}
        >
          <p className="text-pink-400 text-xs tracking-widest uppercase font-medium mb-3">our soundtrack</p>
          <h2
            className="text-3xl sm:text-5xl font-black bg-clip-text text-transparent leading-tight"
            style={{
              backgroundImage: "linear-gradient(135deg, #9f1239 0%, #e11d48 55%, #fb7185 100%)",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontStyle: "italic",
            }}
          >
            Lagu Favorit Kita
          </h2>
          <p className="mt-4 text-pink-600 text-sm sm:text-base max-w-xl leading-relaxed">
            Kumpulan lagu yang entah kenapa selalu bikin aku inget kamu dan momen-momen kita.{" "}
            <em className="text-rose-300" style={{ fontFamily: "Georgia, serif" }}>
              Every song is a memory, every lyric a piece of us.
            </em>
          </p>
        </div>

        {/* Track list — alternating Z */}
        <div className="space-y-5">
          {playlist.map((song, index) => (
            <TrackCard key={index} song={song} index={index} />
          ))}
        </div>

        {/* Spotify embed */}
        <div className="mt-16">
          <p className="text-xs sm:text-sm text-pink-500 mb-4 tracking-wide">
            🎧 Playlist lengkap kita ada di sini —
          </p>
          <div className="overflow-hidden rounded-3xl border border-pink-100/60 bg-white/30 backdrop-blur-md shadow-[0_8px_32px_rgba(244,114,182,0.12)]">
            <iframe
              className="w-full h-[352px]"
              src="https://open.spotify.com/embed/playlist/28Y1n80qNSM0uyjBCbenMs?utm_source=generator"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
