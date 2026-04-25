export default function SpotifyPlaylist() {
  const tracks = [
    "5f9Nt75lq1MLzf5F2xJwTI",
    "1nYdkPCbHdYi4w7s2L6SHA",
    "1dGr1c8CrMLzf5F2xJwTI",
    "2KHllq5yeqjTyXnQPPUPMG",
  ];

  return (
    <section className="w-full py-14 px-4 sm:px-10 bg-pink-50">
      <div className="max-w-lg mx-auto text-center">
        <p className="text-xs tracking-widest text-pink-600 uppercase mb-2">
          ✦ lagu kita ✦
        </p>
        <p className="font-serif text-xl text-pink-900 mb-8">
          Our Playlist
        </p>

        <div className="flex flex-col gap-3">
          {tracks.map((id) => (
            <iframe
              key={id}
              src={`https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`}
              width="100%"
              height="80"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-2xl"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
