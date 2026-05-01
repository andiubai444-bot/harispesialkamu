const promises = [
  "Aku janji bakal tetap di sini jadi orang pertama yang dengerin semua keluh kesahmu, bahkan saat kamu cuma pengen marah-marah ke dunia tanpa alasan yang jelas.",
  "Aku janji sejauh apa pun jarak Balikpapan ke Pontianak, aku nggak akan pernah bosen buat cari cara supaya kamu selalu ngerasa kalau aku ada tepat di sebelahmu sayang.",
  "Aku janji bakal terus mengusahakan 'kita' supaya 'Amin' yang paling serius itu beneran kejadian, dan tahun-tahun depan kita masih ngerayain ulang tahun kamu sambil ketawa bareng lagi.",
  "Aku janji bakal jadi tempat paling aman buat kamu jadi diri sendiri. Kamu nggak perlu pura-pura kuat di depanku Okeyy. kalau capek, bilang ya? Kita istirahat bareng-bareng.",
  "Aku janji bakal terus semangatin kamu, termasuk waktu kamu lagi pusing sama judul skripsi atau tugas-tugas kuliahmu nanti. Aku bakal ada di barisan paling depan buat bangga sama kamu.",
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
