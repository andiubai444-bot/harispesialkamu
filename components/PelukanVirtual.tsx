"use client";
import { useState, useCallback } from "react";

type Heart = {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  color: string;
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

    const newHearts: Heart[] = Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const dist = Math.random() * 60 + 60;
      return {
        id: Date.now() + i,
        x: 0,
        y: 0,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        size: Math.random() * 14 + 12,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    });

    setHearts((prev) => [...prev, ...newHearts]);
    setTimeout(() => {
      setHearts((prev) =>
        prev.filter((h) => !newHearts.find((n) => n.id === h.id))
      );
    }, 1800);
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
        <div className="flex justify-center items-center mb-6">
          <div className="relative flex justify-center items-center w-48 h-48">

            {/* Hati yang berterbangan */}
            {hearts.map((heart) => (
              <div
                key={heart.id}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  fontSize: heart.size,
                  color: heart.color,
                  pointerEvents: "none",
                  animation: "none",
                  transition: "transform 1.6s ease-out, opacity 1.6s ease-out",
                  transform: `translate(${heart.dx}px, ${heart.dy}px)`,
                  opacity: 0,
                  marginTop: -heart.size / 2,
                  marginLeft: -heart.size / 2,
                }}
              >
                ♥
              </div>
            ))}

            {/* Hati yang baru muncul (frame awal) */}
            {hearts.map((heart) => (
              <div
                key={`init-${heart.id}`}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  fontSize: heart.size,
                  color: heart.color,
                  pointerEvents: "none",
                  animation: `flyOut 1.6s ease-out forwards`,
                  marginTop: -heart.size / 2,
                  marginLeft: -heart.size / 2,
                  ["--dx" as string]: `${heart.dx}px`,
                  ["--dy" as string]: `${heart.dy}px`,
                }}
              >
                ♥
              </div>
            ))}

            {/* Tombol utama */}
            <button
              onClick={sendHug}
              style={{
                transform: clicked ? "scale(0.88)" : "scale(1)",
                transition: "transform 0.15s ease",
                position: "relative",
                zIndex: 10,
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
          <div className="inline-flex items-center gap-2 bg-white border border-pink-200 rounded-full px-5 py-2 shadow-sm">
            <span className="text-pink-400 text-sm">🤗</span>
            <p className="text-sm text-pink-700 font-serif">
              {counter === 1 ? "1 pelukan terkirim ♡" : `${counter} pelukan terkirim ♡`}
            </p>
          </div>
        )}

        {counter >= 5 && (
          <p className="text-xs text-pink-400 mt-3 italic">
            Hehe kamu suka ya dipeluk 🥺
          </p>
        )}
        {counter >= 10 && (
          <p className="text-xs text-pink-400 mt-1 italic">
            Oke oke aku peluk terus deh ♡
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes flyOut {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          80% {
            opacity: 0.8;
          }
          100% {
            transform: translate(var(--dx), var(--dy)) scale(0.3);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
