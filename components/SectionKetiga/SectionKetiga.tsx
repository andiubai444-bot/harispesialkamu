const thingsILove = [
  "Aku suka bagaimana kamu selalu menjadi tempat paling tenang untukku pulang.",
  "Caramu memeluk jarak antara Balikpapan dan Pontianak dengan sabar, meyakinkanku kalau hati kita gak bener bener jauh",
  "Aku suka bagaimana senyummu selalu punya cara ajaib untuk membuat duniaku yang rumit terasa jauh lebih indah.",
  "Caramu mendengarkan semua ceritaku dengan tulus, membuatku merasa menjadi orang paling beruntung didunia",
  "Fakta bahwa di umur 21 ini, kamu udah sejauh ini berjuang tapi tetap bisa senyum.",
  "Ini baru sebagian kecil dari hal-hal yang aku suka dari kamu, Wanitakuu tercantik terpinterrr terimuttt tersayangkuuu seduniaa Akhirat.",
];

export default function SectionKetiga() {
  return (
    <section className="w-full py-16 px-4 sm:px-10 bg-pink-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-pink-900 mb-6">
          Hal-hal yang Aku Suka dari Ameisha
        </h2>
        <p className="text-pink-700 text-sm sm:text-base mb-6">
          Di usia 21 tahun ini, ada banyak banget hal tentang kamu yang bikin
          aku bersyukur bisa kenal dan deket sama kamu.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {thingsILove.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white border border-pink-100 p-4 shadow-sm shadow-pink-100 flex items-start gap-3"
            >
              <span className="mt-1 text-pink-500">♡</span>
              <p className="text-sm sm:text-base text-pink-900">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
