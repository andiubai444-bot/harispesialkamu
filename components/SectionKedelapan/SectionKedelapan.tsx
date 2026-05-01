const playlist = [
  {
    title: "Lagu 1",
    artist: "Prettiest Thing I've Ever Seen - Lany",
    reason:
      "Satu melodi yang selalu membawa pikiranku pulang ke kamu sayangg. Just like the lyrics say, you really are the prettiest thing I’ve ever seen.",
  },
  {
    title: "Lagu 2",
    artist: "Rayuan Perempuan Gila - Nadin Amizah",
    reason:
      "Lagu yang paling identik dengan suaramu saat bersenandung. Seeing you love this song makes me love it even more. Terima kasih sudah berbagi duniamu denganku yah honeyy.",
  },
  {
    title: "Lagu 3",
    artist: "Lover - Taylor Swift",
    reason: "Satu melodi yang paling pas menggambarkan kita sayangg. In every lyric, I find a piece of our story. Terima kasih sudah menjadi sosok yang membuat lagu ini terasa begitu nyata dan penuh makna dalam hidupkuuu.",
  },
  {
    title: "Lagu 4",
    artist: "Amin Paling Serius - Sal Priadi & Nadin Amizah",
    reason: "Tuk selamanya... Amin paling serius seluruh dunia. Biar cinta kita paling kuat dan tetap mekar di antara doa-doa",
  },
];

export default function SectionKedelapan() {
  return (
    <section className="w-full py-16 px-4 sm:px-10 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-pink-900 mb-6">
          Lagu Favorit Kita
        </h2>
        <p className="text-pink-700 text-sm sm:text-base mb-6">
          Ini kumpulan lagu-lagu yang entah kenapa selalu bikin aku inget kamu
          atau momen-momen kita.
        </p>
        <div className="space-y-4">
          {playlist.map((song, index) => (
            <div
              key={index}
              className="rounded-2xl border border-pink-100 bg-pink-50/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 shadow-sm shadow-pink-100"
            >
              <div>
                <p className="text-xs text-pink-500 font-medium mb-1">
                  Track {index + 1}
                </p>
                <p className="text-sm sm:text-base font-semibold text-pink-900">
                  {song.title}
                </p>
                <p className="text-xs sm:text-sm text-pink-700">
                  {song.artist}
                </p>
              </div>
              <p className="text-xs sm:text-sm text-pink-800 sm:max-w-xs">
                {song.reason}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8 space-y-3">
          <p className="text-xs sm:text-sm text-pink-700">
            Di bawah ini adalah Playlist Spotify kita.
          </p>
          <div className="overflow-hidden rounded-2xl border border-pink-100 bg-pink-50/60 shadow-sm shadow-pink-100">
            <iframe
              className="w-full h-[352px]"
              src="https://open.spotify.com/embed/playlist/28Y1n80qNSM0uyjBCbenMs?utm_source=generator"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
