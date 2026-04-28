"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Harapan = {
  id: number;
  isi: string;
  created_at: string;
};

const PASSWORD = "ameishacantik"; // ganti sesuka hati

export default function HarapanAmeisha() {
  const [harapanList, setHarapanList] = useState<Harapan[]>([]);
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [wrongPass, setWrongPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Ambil harapan dari Supabase
  const fetchHarapan = async () => {
    const { data } = await supabase
      .from("harapan")
      .select("*")
      .order("created_at", { ascending: true });
    if (data) setHarapanList(data);
  };

  useEffect(() => {
    fetchHarapan();
  }, []);

  const handleUnlock = () => {
    if (password === PASSWORD) {
      setUnlocked(true);
      setWrongPass(false);
      setShowForm(true);
    } else {
      setWrongPass(true);
    }
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    await supabase.from("harapan").insert([{ isi: input.trim() }]);
    setInput("");
    await fetchHarapan();
    setLoading(false);
    setShowForm(false);
    setUnlocked(false);
    setPassword("");
  };

  const handleDelete = async (id: number) => {
    await supabase.from("harapan").delete().eq("id", id);
    await fetchHarapan();
  };

  return (
    <section className="w-full py-14 px-4 sm:px-10 bg-pink-50">
      <div className="max-w-lg mx-auto text-center">

        {/* Header */}
        <p className="text-xs tracking-widest text-pink-600 uppercase mb-2">
          ✦ Harapan Kita ✦
        </p>
        <p className="font-serif text-xl text-pink-900 mb-2">
          Impian &amp; Doa untuk Tahun Ini
        </p>
        <p className="text-sm text-pink-400 mb-8 font-serif italic">
          — ditulis dengan cinta, oleh Ameisha —
        </p>

        {/* Kartu Harapan */}
        {harapanList.length === 0 ? (
          <div className="bg-white border border-pink-100 rounded-2xl py-10 px-6 mb-8">
            <p className="text-pink-300 font-serif italic text-sm">
              Belum ada harapan yang ditulis... ♡
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left">
            {harapanList.map((h, i) => (
              <div
                key={h.id}
                className="bg-white border border-pink-100 rounded-2xl p-5 shadow-sm shadow-pink-100 relative group"
              >
                <p className="text-pink-400 text-xs mb-2 tracking-widest">✦ Harapan #{i + 1}</p>
                <p className="font-serif text-pink-900 text-sm leading-relaxed italic">
                  &ldquo;{h.isi}&rdquo;
                </p>
                {/* Tombol hapus — hanya muncul kalau unlocked */}
                {unlocked && (
                  <button
                    onClick={() => handleDelete(h.id)}
                    className="absolute top-3 right-3 text-pink-300 hover:text-pink-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent mb-8" />

        {/* Form tambah harapan */}
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="text-xs tracking-widest text-pink-500 uppercase hover:text-pink-700 transition-colors"
          >
            + Tulis Harapan Baru
          </button>
        ) : !unlocked ? (
          /* Input password */
          <div className="bg-white border border-pink-100 rounded-2xl p-6 shadow-sm">
            <p className="font-serif text-pink-800 text-sm mb-4">
              Masukkan password kamu, Ameisha ♡
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
              placeholder="password..."
              className="w-full border border-pink-200 rounded-xl px-4 py-2 text-sm text-pink-900 placeholder-pink-300 focus:outline-none focus:border-pink-400 mb-3"
            />
            {wrongPass && (
              <p className="text-xs text-rose-400 mb-3">Password salah, coba lagi ♡</p>
            )}
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleUnlock}
                className="bg-pink-400 hover:bg-pink-500 text-white text-xs tracking-widest uppercase rounded-full px-5 py-2 transition-colors"
              >
                Masuk
              </button>
              <button
                onClick={() => { setShowForm(false); setPassword(""); setWrongPass(false); }}
                className="text-xs text-pink-400 hover:text-pink-600 px-3 py-2"
              >
                Batal
              </button>
            </div>
          </div>
        ) : (
          /* Input harapan */
          <div className="bg-white border border-pink-100 rounded-2xl p-6 shadow-sm">
            <p className="font-serif text-pink-800 text-sm mb-4">
              Apa harapanmu untuk tahun ini? ✨
            </p>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tulis harapanmu di sini..."
              rows={3}
              className="w-full border border-pink-200 rounded-xl px-4 py-3 text-sm text-pink-900 placeholder-pink-300 focus:outline-none focus:border-pink-400 resize-none mb-3 font-serif italic"
            />
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleSubmit}
                disabled={loading || !input.trim()}
                className="bg-pink-400 hover:bg-pink-500 disabled:bg-pink-200 text-white text-xs tracking-widest uppercase rounded-full px-5 py-2 transition-colors"
              >
                {loading ? "Menyimpan..." : "Simpan ♡"}
              </button>
              <button
                onClick={() => { setShowForm(false); setUnlocked(false); setPassword(""); setInput(""); }}
                className="text-xs text-pink-400 hover:text-pink-600 px-3 py-2"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
