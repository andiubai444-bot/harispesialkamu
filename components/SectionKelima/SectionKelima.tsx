const promises = [
  "Aku janji bakal terus dukung kamu ngejar hal-hal yang kamu mau di usia 21 ini dan seterusnya.",
  "Aku janji bakal jadi orang yang selalu kamu bisa ajak cerita, bahkan buat hal-hal kecil yang kelihatannya sepele.",
  "Aku janji bakal terus ngingetin kamu kalau kamu cukup, bahkan di hari-hari kamu ngerasa nggak sehebat itu.",
  "Aku janji bakal nyemangatin kamu waktu capek, dan nemenin kamu waktu kamu lagi ngerasa sendiri.",
  "Aku janji di tahun berikutnya kita ngerayain hari ulang tahun kamu sama aku lagi.",
];

export default function SectionKelima() {
  return (
    <section className="w-full py-16 px-4 sm:px-10 bg-pink-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-pink-900 mb-6">
          Janji Kecil di Usia 21
        </h2>
        <p className="text-pink-700 text-sm sm:text-base mb-6">
          Di momen ulang tahunmu ini, aku pengin nitip beberapa janji kecil yang
          semoga bisa bikin kamu ngerasa lebih aman dan lebih disayang.
        </p>
        <ul className="space-y-3">
          {promises.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-3 rounded-2xl bg-white border border-pink-100 p-4 shadow-sm shadow-pink-100"
            >
              <span className="mt-1 text-pink-500">✦</span>
              <p className="text-sm sm:text-base text-pink-900">{item}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
