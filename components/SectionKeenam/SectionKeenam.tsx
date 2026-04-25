"use client";
import { useState } from "react";

export default function SectionKeenam() {
  const [opened, setOpened] = useState(false);

  return (
    <section className="w-full py-16 px-4 sm:px-10 bg-white">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-pink-900 mb-4">
          Ucapan yang Sedikit Lebih Serius
        </h2>
        <p className="text-pink-700 text-sm sm:text-base mb-6">
          Kalau kamu udah baca sampai bagian ini, berarti kamu bener-bener niat
          nerima kejutan kecil ini di hari ulang tahunmu. Jadi, ada beberapa
          kata yang pengin aku titip di sini.
        </p>

        <button
          onClick={() => setOpened(true)}
          className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-7 py-3 text-sm sm:text-base font-semibold text-white shadow-md shadow-pink-300/60 hover:bg-pink-600 transition-colors"
        >
          Klik di sini buat kejutan terakhir
          <span className="text-lg">♡</span>
        </button>
      </div>

      {/* OVERLAY */}
      {opened && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ backgroundColor: "rgba(50, 5, 20, 0.65)" }}
          onClick={() => setOpened(false)}
        >
          {/* MODAL CARD */}
          <div
            className="relative bg-pink-50 border border-pink-200 rounded-3xl p-8 sm:p-10 max-w-lg w-full text-center shadow-2xl"
            style={{
              animation: "popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tombol close */}
            <button
              onClick={() => setOpened(false)}
              className="absolute top-4 right-5 text-pink-400 hover:text-pink-700 text-xl transition-colors"
            >
              ✕
            </button>

            {/* Ikon */}
            <div className="text-4xl mb-3">💌</div>

            <p className="font-serif text-lg font-semibold text-pink-900 mb-4">
              Untuk Ameisha Nadilah Sayangkuu
            </p>

            {/* Garis pembatas */}
            <div className="h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent mb-5" />

            <div className="space-y-3 text-left">
              <p className="text-sm sm:text-base text-pink-900 leading-relaxed">
                Terima kasih sudah jadi kamu selama ini, dengan semua versi kamu
                yang lagi seneng, lagi sedih, lagi cape, lagi heboh semuanya.
              </p>
              <p className="text-sm sm:text-base text-pink-900 leading-relaxed">
                Di umur 21 ini, aku cuma pengin kamu tahu kalau ada seseorang di
                sini yang bener-bener sayang sama kamu dan bangga sama kamu.
              </p>
              <p className="text-sm sm:text-base text-pink-900 leading-relaxed">
                Makasih udah ada, makasih udah mau dikenal, makasih udah jadi kamu
                yang aku kenal dan sayangin. Kamu layak bahagia, bukan cuma hari
                ini tapi setiap harinya.
              </p>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent my-5" />

            <p className="font-serif text-sm sm:text-base text-pink-700 text-right">
              Selamat ulang tahun yang ke-21, Sayang.<br />
              Semoga tahun ini lebih lembut buat kamu. ♡
            </p>

            <button
              onClick={() => setOpened(false)}
              className="mt-6 w-full rounded-full border border-pink-300 text-pink-700 py-2.5 text-sm hover:bg-pink-100 transition-colors"
            >
              Tutup ✕
            </button>
          </div>
        </div>
      )}

      {/* Animasi pop-in */}
      <style jsx>{`
        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.85) translateY(24px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
