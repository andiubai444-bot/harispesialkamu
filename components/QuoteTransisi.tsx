"use client";
import { useEffect, useRef, useState } from "react";

export default function QuoteTransisi({ quote, author }: { quote: string; author?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `0ms` }}
      className={`relative z-0 w-full overflow-hidden px-6 sm:px-10 py-10 flex flex-col items-center justify-center text-center transition-all duration-1000 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="h-px w-16 bg-gradient-to-r from-transparent via-pink-300 to-transparent mb-6" />
      <p className="font-serif text-base sm:text-lg text-pink-800 italic max-w-sm w-full leading-relaxed break-words">
        "{quote}"
      </p>
      {author && (
        <p className="mt-3 text-xs tracking-widest text-pink-400 uppercase">{author}</p>
      )}
      <div className="h-px w-16 bg-gradient-to-r from-transparent via-pink-300 to-transparent mt-6" />
    </div>
  );
}
