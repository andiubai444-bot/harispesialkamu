import Image from "next/image";

const memories = [
  {
    title: "Foto 1",
    caption:
      "Foto pertama yang ngebuat aku kecantol sama kamu.",
    imageSrc: "/Foto2.jpg",
  },
  {
    title: "Foto 2",
    caption:
      "Ini Foto yang palingg aku ingattt.",
    imageSrc: "/Foto3.jpg",
  },
  {
    title: "Foto 3",
    caption:
      "Momen Idul Fitri.",
    imageSrc: "/Foto4.jpg",
  },
  {
    title: "Foto 4",
    caption: "Ini foto yang menurut aku kamu cantik banget banget banget",
    imageSrc: "/Foto5.jpg",
  },
];

export default function SectionKeempat() {
  return (
    <section className="w-full py-16 px-4 sm:px-10 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-pink-900 mb-6">
          Potongan Kenangan Ulang Tahun
        </h2>
        <p className="text-pink-700 text-sm sm:text-base mb-6">
          Di sini nanti bakal keisi foto-foto momen ulang tahunmu, atau momen
          random lain yang bikin kamu inget kalau kamu layak dirayakan, bukan
          cuma hari ini, tapi setiap hari.
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          {memories.map((memory, index) => (
            <div
              key={index}
              className="rounded-2xl bg-pink-50/80 border border-pink-100 p-4 flex flex-col justify-between min-h-[220px] shadow-sm shadow-pink-100"
            >
              <div>
                <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-2xl bg-pink-100">
                  <Image
                    src={memory.imageSrc}
                    alt={memory.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="text-sm font-semibold text-pink-900 mb-2">
                  {memory.title}
                </h3>
                <p className="text-xs sm:text-sm text-pink-800">
                  {memory.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
