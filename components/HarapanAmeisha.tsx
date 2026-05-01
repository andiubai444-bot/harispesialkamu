"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

type Harapan = {
  id: number;
  isi: string;
  created_at: string;
};

const PASSWORD = "ameishacantik";

const CARD_STYLES = [
  { bg: "bg-pink-50",  rotate: "rotate-1"  },
  { bg: "bg-orange-50", rotate: "-rotate-1" },
  { bg: "bg-emerald-50", rotate: "rotate-[0.8deg]" },
  { bg: "bg-purple-50", rotate: "-rotate-[1.2deg]" },
  { bg: "bg-yellow-50", rotate: "rotate-[1.8deg]" },
  { bg: "bg-sky-50",   rotate: "-rotate-[0.7deg]" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function HeartParticle({ x, y, onDone }: { x: number; y: number; onDone: () => void }) {
  const hearts = ["♡", "♡", "✦", "✿"];
  const colors = ["#f472b6", "#fb7185", "#e879a0", "#db2777"];
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    symbol: hearts[Math.floor(Math.random() * hearts.length)],
    color: colors[Math.floor(Math.random() * colors.length)],
    offsetX: -40 + Math.random() * 80,
    delay: Math.random() * 0.3,
  }));

  useEffect(() => {
    const t = setTimeout(onDone, 1600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            left: x + p.offsetX,
            top: y - 20,
            color: p.color,
            fontSize: 20,
            animationDelay: `${p.delay}s`,
          }}
          className="animate-float-up"
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
}

export default function HarapanAmeisha() {
  const [harapanList, setHarapanList] = useState<Harapan[]>([]);
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [wrongPass, setWrongPass] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [hearts, setHearts] = useState<{ x: number; y: number; id: number } | null>(null);
  const saveBtnRef = useRef<HTMLButtonElement>(null);

  const fetchHarapan = async () => {
    const { data } = await supabase
      .from("harapan")
      .select("*")
      .order("created_at", { ascending: true });
    if (data) setHarapanList(data);
    setLoading(false);
  };

  useEffect(() => { fetchHarapan(); }, []);

  const handleUnlock = () => {
    if (password === PASSWORD) {
      setUnlocked(true);
      setWrongPass(false);
    } else {
      setWrongPass(true);
      setShaking(false);
      requestAnimationFrame(() => setShaking(true));
      setTimeout(() => setShaking(false), 500);
    }
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setSaving(true);

    // spawn hearts
    if (saveBtnRef.current) {
      const rect = saveBtnRef.current.getBoundingClientRect();
      setHearts({ x: rect.left + rect.width / 2, y: rect.top, id: Date.now() });
    }

    await supabase.from("harapan").insert([{ isi: input.trim() }]);
    setInput("");
    await fetchHarapan();
    setSaving(false);
    setShowForm(false);
    setUnlocked(false);
    setPassword("");
  };

  const handleDelete = async (id: number) => {
    await supabase.from("harapan").delete().eq("id", id);
    await fetchHarapan();
  };

  return (
    <>
      {/* Global animation styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&family=Lora:ital,wght@0,400;1,400&family=DM+Mono:wght@300;400&display=swap');

        .font-caveat { font-family: 'Caveat', cursive; }
        .font-lora   { font-family: 'Lora', serif; }
        .font-mono-dm { font-family: 'DM Mono', monospace; }

        @keyframes float-up {
          0%   { transform: translateY(0) scale(0.5); opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(-140px) scale(1.2); opacity: 0; }
        }
        .animate-float-up { animation: float-up 1.2s ease forwards; }

        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-6px); }
          40%      { transform: translateX(6px); }
          60%      { transform: translateX(-4px); }
          80%      { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.4s ease; }

        @keyframes skeleton-pulse {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.4; }
        }
        .animate-skeleton { animation: skeleton-pulse 1.5s ease infinite; }

        .pw-input-focus:focus {
          outline: none;
          border-color: #f472b6;
          box-shadow: 0 0 0 3px rgba(244,114,182,0.18);
        }
        .textarea-focus:focus {
          outline: none;
          border-color: #f472b6;
          box-shadow: 0 0 0 3px rgba(244,114,182,0.18);
        }

        /* Masonry */
        .masonry-grid {
          columns: 2;
          column-gap: 1rem;
        }
        @media (max-width: 480px) {
          .masonry-grid { columns: 1; }
        }
        .masonry-item {
          break-inside: avoid;
          margin-bottom: 1rem;
          display: inline-block;
          width: 100%;
        }

        /* Card pin */
        .sticky-card::before {
          content: '';
          position: absolute;
          top: -7px; left: 50%; transform: translateX(-50%);
          width: 22px; height: 11px;
          background: rgba(249,168,212,0.55);
          border-radius: 2px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.08);
        }
      `}</style>

      {/* Heart Particles */}
      {hearts && (
        <HeartParticle
          key={hearts.id}
          x={hearts.x}
          y={hearts.y}
          onDone={() => setHearts(null)}
        />
      )}

      <section className="w-full py-14 px-4 sm:px-10 bg-pink-50">
        <div className="max-w-lg mx-auto text-center">

          {/* Header */}
          <p className="font-mono-dm text-[11px] tracking-[0.2em] text-pink-500 uppercase mb-2">
            ✦ Harapan Kita ✦
          </p>
          <p className="font-lora text-xl italic text-pink-900 mb-2">
            Impian &amp; Doa untuk Tahun Ini
          </p>
          <p className="font-lora text-sm italic text-pink-300 mb-10">
            — ditulis dengan cinta, oleh Ameisha —
          </p>

          {/* Cards */}
          {loading ? (
            /* Skeleton */
            <div className="masonry-grid mb-8 text-left">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="masonry-item">
                  <div
                    className={`bg-pink-50 rounded-sm p-5 ${i % 2 === 0 ? "rotate-1" : "-rotate-1"}`}
                    style={{ boxShadow: "3px 3px 10px rgba(219,112,147,0.12)" }}
                  >
                    <div className="animate-skeleton h-2.5 bg-pink-200 rounded-full w-2/5 mb-3" />
                    <div className="animate-skeleton h-2.5 bg-pink-100 rounded-full w-full mb-2" />
                    <div className="animate-skeleton h-2.5 bg-pink-100 rounded-full w-4/5 mb-2" />
                    <div className="animate-skeleton h-2 bg-pink-100 rounded-full w-2/5 mt-4 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : harapanList.length === 0 ? (
            <div className="border border-dashed border-pink-200 rounded-2xl py-10 px-6 mb-8">
              <p className="font-caveat text-lg text-pink-300">
                Belum ada harapan yang ditulis... ♡
              </p>
            </div>
          ) : (
            <div className="masonry-grid mb-8 text-left">
              {harapanList.map((h, i) => {
                const style = CARD_STYLES[i % CARD_STYLES.length];
                return (
                  <div key={h.id} className="masonry-item group">
                    <div
                      className={`sticky-card relative ${style.bg} ${style.rotate} rounded-sm p-5 transition-transform duration-200 hover:rotate-0 hover:scale-[1.02]`}
                      style={{ boxShadow: "3px 3px 10px rgba(219,112,147,0.15), 0 1px 0 rgba(219,112,147,0.06)" }}
                    >
                      <p className="font-mono-dm text-[10px] text-pink-400 mb-2 tracking-widest">
                        ✦ Harapan #{i + 1}
                      </p>
                      <p className="font-caveat text-[1.1rem] text-pink-900 leading-relaxed">
                        &ldquo;{h.isi}&rdquo;
                      </p>
                      <p className="font-mono-dm text-[10px] text-pink-300 mt-3 text-right">
                        {formatDate(h.created_at)}
                      </p>
                      {unlocked && (
                        <button
                          onClick={() => handleDelete(h.id)}
                          className="absolute top-2 right-2 text-pink-300 hover:text-pink-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent mb-8" />

          {/* Form area */}
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="font-mono-dm text-[11px] tracking-[0.2em] text-pink-500 uppercase hover:text-pink-700 hover:tracking-[0.3em] transition-all"
            >
              + Tulis Harapan Baru
            </button>
          ) : !unlocked ? (
            /* Password form */
            <div className="bg-white border border-pink-100 rounded-2xl p-6 shadow-sm shadow-pink-100">
              <p className="font-lora text-sm text-pink-800 mb-4">
                Masukkan password kamu, Ameisha ♡
              </p>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setWrongPass(false); }}
                onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                placeholder="password..."
                className={`pw-input-focus w-full border border-pink-200 rounded-xl px-4 py-2 text-sm text-pink-900 placeholder-pink-300 bg-pink-50 font-mono-dm mb-3 transition-all ${shaking ? "animate-shake border-rose-300" : ""}`}
              />
              {wrongPass && (
                <p className="font-mono-dm text-xs text-rose-400 mb-3">
                  Password salah, coba lagi ♡
                </p>
              )}
              <div className="flex gap-2 justify-center">
                <button
                  onClick={handleUnlock}
                  className="bg-pink-400 hover:bg-pink-500 text-white font-mono-dm text-[11px] tracking-widest uppercase rounded-full px-5 py-2 transition-colors"
                >
                  Masuk
                </button>
                <button
                  onClick={() => { setShowForm(false); setPassword(""); setWrongPass(false); }}
                  className="font-mono-dm text-xs text-pink-400 hover:text-pink-600 px-3 py-2"
                >
                  Batal
                </button>
              </div>
            </div>
          ) : (
            /* Textarea form */
            <div className="bg-white border border-pink-100 rounded-2xl p-6 shadow-sm shadow-pink-100">
              <p className="font-lora text-sm text-pink-800 mb-4">
                Apa harapanmu untuk tahun ini? ✨
              </p>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tulis harapanmu di sini..."
                rows={3}
                className="textarea-focus font-caveat w-full border border-pink-200 rounded-xl px-4 py-3 text-[1.05rem] text-pink-900 placeholder-pink-300 bg-pink-50 resize-none mb-3 transition-all"
              />
              <div className="flex gap-2 justify-center">
                <button
                  ref={saveBtnRef}
                  onClick={handleSubmit}
                  disabled={saving || !input.trim()}
                  className="bg-pink-400 hover:bg-pink-500 disabled:bg-pink-200 text-white font-mono-dm text-[11px] tracking-widest uppercase rounded-full px-5 py-2 transition-colors"
                >
                  {saving ? "Menyimpan..." : "Simpan ♡"}
                </button>
                <button
                  onClick={() => { setShowForm(false); setUnlocked(false); setPassword(""); setInput(""); }}
                  className="font-mono-dm text-xs text-pink-400 hover:text-pink-600 px-3 py-2"
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
