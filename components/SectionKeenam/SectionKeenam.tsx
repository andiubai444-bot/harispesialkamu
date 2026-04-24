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
        {!opened ? (
          <button
            onClick={() => setOpened(true)}
            className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-7 py-3 text-sm sm:text-base font-semibold text-white shadow-md shadow-pink-300/60 hover:bg-pink-600 transition-colors"
          >
            Klik di sini buat kejutan terakhir
            <span className="text-lg">♡</span>
          </button>
        ) : (
          <div className="mt-4 rounded-3xl border border-pink-100 bg-pink-50/90 p-6 sm:p-8 shadow-md shadow-pink-100">
            <p className="text-sm sm:text-base text-pink-900 mb-3">
              Terima kasih sudah jadi kamu selama ini, dengan semua versi kamu;
              yang lagi seneng, lagi sedih, lagi cape, lagi heboh, semuanya.
            </p>
            <p className="text-sm sm:text-base text-pink-900 mb-3">
              Di umur 21 ini, aku cuma pengin kamu tahu kalau ada seseorang di
              sini yang bener-bener sayang sama kamu dan bangga sama kamu.
            </p>
            <p className="text-base sm:text-lg font-semibold text-pink-900 mt-4">
              Selamat ulang tahun yang ke-21, Sayang. Semoga tahun ini jadi tahun
              yang lebih lembut buat kamu. ♡
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
