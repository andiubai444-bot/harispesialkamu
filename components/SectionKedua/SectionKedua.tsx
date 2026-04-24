export default function SectionKedua() {
  return (
    <section
      id="our-story"
      className="w-full py-16 px-4 sm:px-10 bg-gradient-to-b from-white via-pink-50/40 to-white"
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-pink-900 mb-2">
          21 Tahun Ameishakuu
        </h2>
        <p className="text-pink-500 text-xs sm:text-sm font-medium mb-2">
          Bab kecil tentang kamu dan usiamu yang baru ✨
        </p>
        <p className="text-pink-700 text-sm sm:text-base mb-8 max-w-2xl">
          Ulang tahun ke-21 kamu itu momen yang kerasa spesial banget buat aku.
          Di sini aku kumpulin sedikit hal tentangmu dan tentang rasa syukurku
          karena bisa nemenin kamu sejauh ini.
        </p>
        <div className="space-y-6">
          <div className="relative rounded-2xl border border-pink-100 bg-pink-50/80 p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(244,114,182,0.35)] hover:border-pink-200">
            <span className="absolute -top-3 left-4 inline-flex items-center rounded-full bg-pink-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
              Babak Baru: 21 Tahun
            </span>
            <p className="mt-3 text-xs text-pink-500 font-medium">
              Usia: 21 tahun
            </p>
            <p className="mt-3 text-sm sm:text-base text-pink-900">
              Di umur ke-21 ini, aku ngeliat kamu bukan cuma sebagai seseorang
              yang lagi bertambah usia, tapi juga seseorang yang pelan-pelan
              tumbuh, belajar, jatuh, bangkit lagi, dan tetap jadi kamu yang aku
              banggakan.
            </p>
          </div>

          <div className="relative rounded-2xl border border-pink-100 bg-pink-50/80 p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(244,114,182,0.35)] hover:border-pink-200">
            <span className="absolute -top-3 left-4 inline-flex items-center rounded-full bg-pink-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
              Harapan Tahun Ini
            </span>
            <p className="mt-3 text-xs text-pink-500 font-medium">
              Untuk: Ameisha Nadilah
            </p>
            <p className="mt-3 text-sm sm:text-base text-pink-900">
              Di usia baru ini, aku cuma pengen kamu lebih bahagia, lebih tenang
              sama diri sendiri, dikelilingi orang-orang baik, dan selalu
              ngerasa cukup, apapun yang lagi kamu jalanin.
            </p>
          </div>

          <div className="rounded-2xl border border-dashed border-pink-200 bg-pink-50/40 p-5 sm:p-6 text-center transition-colors duration-300 hover:bg-pink-50/80">
            <p className="text-sm sm:text-base text-pink-700">
              Semoga di tiap halamannya, kamu selalu
              nemuin alasan buat senyum.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
