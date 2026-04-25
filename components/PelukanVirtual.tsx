"use client";
import { useState, useCallback } from "react";

type Heart = {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  angle: number;
  speed: number;
};

const COLORS = ["#f9a8d4", "#fda4af", "#fbcfe8", "#ff85a1", "#fcd5e3", "#fde68a"];

export default function PelukanVirtual() {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [clicked, setClicked] = useState(false);
  const [counter, setCounter] = useState(0);

  const sendHug = useCallback(() => {
    setClicked(true);
    setCounter((c) => c + 1);
    setTimeout(() => setClicked(false), 300);

    const newHearts: Heart[] = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: 50 + (Math.random() - 0.5) * 10,
      y: 50 + (Math.random() - 0.5) * 10,
      size: Math.random() * 20 + 14,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      angle: (i / 12) * 360 + Math.random() * 20,
      speed: Math.random() * 0.8 + 0.6,
    }));

    setHearts((prev) => [...prev, ...newHearts]);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => !newHearts.find((n) => n.id === h.id)));
    }, 2000);
  }, []);

  return (
    <section className="w-full py-14 px-4 sm:px-10 bg-pink-50">
      <div className="max-w-lg mx-auto text-center">
        <p className="text-xs tracking-widest text-pink-600 uppercase mb-2">
          ✦ untuk kamu ✦
        </p>
        <p className="font-serif text-xl text-pink-900 mb-2">
          Pelukan Virtual
        </p>
        <p className="text-sm text-pink-500 mb-8">
          Karena aku ga bisa peluk kamu langsung, ini buat gantinya 🤗
        </p>

        {/* Area hati terbang */}
        <div className="relative flex justify-center items-center mb-6">
          <div className="relative w-48 h-48">
            {/* Hati yang berterbangan */}
            {hearts.map((heart) => (
              <div
                key={heart.id}
                style={{
                  position: "absolute",
                  left: `${heart.x}%`,
                  top: `${heart.y}%`,
                  fontSize: heart.size,
                  color: heart.color,
                  animation: `flyHeart ${heart.speed * 1.5}s ease-out forwards`,
                  transform: `rotate(${heart.angle}deg)`,
                  pointerEvents: "none",
                }}
              >
                ♥
              </div>
            ))}

            {/* Tombol utama */}
            <button
              onClick={sendHug}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${clicked ? 0.88 : 1})`,
                transition: "transform 0.15s ease",
              }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 shadow-lg shadow-pink-300/60 flex flex-col items-center justify-center text-white border-4 border-white hover:shadow-xl hover:shadow-pink-300/80 transition-shadow"
            >
              <span className="text-3xl">🤗</span>
              <span className="text-[10px] font-semibold mt-1 tracking-wide">Peluk!</span>
            </button>
          </div>
        </div>

        {/* Counter pelukan */}
        {counter > 0 && (
          <div
            className="inline-flex items-center gap-2 bg-white border border-pink-200 rounded-full px-5 py-2 shadow-sm"
            style={{ animation: "fadeIn 0.3s ease" }}
          >
            <span className="text-pink-400 text-sm">🤗</span>
            <p className="text-sm text-pink-700 font-serif">
              {counter === 1
                ? "1 pelukan terkirim ♡"
                : `${counter} pelukan terkirim ♡`}
            </p>
          </div>
        )}

        {/* Pesan setelah beberapa kali */}
        {counter >= 5 && (
          <p
            className="text-xs text-pink-400 mt-3 italic"
            style={{ animation: "fadeIn 0.5s ease" }}
          >
            Hehe kamu suka ya dipeluk 🥺
          </p>
        )}
        {counter >= 10 && (
          <p
            className="text-xs text-pink-400 mt-1 italic"
            style={{ animation: "fadeIn 0.5s ease" }}
          >
            Oke oke aku peluk terus deh ♡
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes flyHeart {
          0% {
            opacity: 1;
            transform: rotate(var(--angle)) translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: rotate(var(--angle)) translate(0, -120px) scale(0.4);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
