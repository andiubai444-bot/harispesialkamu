import HeroSection from "../components/HeroSection/HeroSection";
import SectionKedua from "../components/SectionKedua/SectionKedua";
import SectionKetiga from "../components/SectionKetiga/SectionKetiga";
import SectionKeempat from "../components/SectionKeempat/SectionKeempat";
import SectionKelima from "../components/SectionKelima/SectionKelima";
import SectionKeenam from "../components/SectionKeenam/SectionKeenam";
import SectionKetujuh from "../components/SectionKetujuh/SectionKetujuh";
import SectionKedelapan from "../components/SectionKedelapan/SectionKedelapan";
import MusicPlayer from "../components/MusicPlayer";
import Confetti from "../components/Confetti";
import CounterBersama from "../components/CounterBersama";
import Particles from "../components/Particles";
import IntroScreen from "../components/IntroScreen";
import PelukanVirtual from "../components/PelukanVirtual";
import QuoteTransisi from "../components/QuoteTransisi";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-pink-100 via-white to-pink-50 text-pink-900 font-sans">
      <IntroScreen />
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col">
        <Particles />
        <HeroSection />

        <QuoteTransisi quote="Kamu bukan cuma ulang tahun. Kamu tumbuh, dan aku beruntung bisa nonton prosesnya dari dekat." />
        <SectionKedua />

        <QuoteTransisi quote="Ada hal-hal kecil dari kamu yang tanpa sadar bikin hariku lebih berwarna." />
        <SectionKetiga />

        <QuoteTransisi quote="Setiap foto adalah bukti kalau kita punya cerita yang layak dikenang." />
        <SectionKeempat />

        <QuoteTransisi quote="Detik demi detik, aku bersyukur bisa ngitung semuanya bareng kamu." />
        <CounterBersama />

        <QuoteTransisi quote="Jarak itu nyata, tapi rasa ini lebih nyata." />
        <SectionKelima />

        <QuoteTransisi quote="Janji bukan cuma kata-kata, tapi pilihan yang aku perbarui tiap hari." />
        <SectionKeenam />

        <QuoteTransisi quote="Kalau kamu udah baca sampai sini, berarti kamu tahu betapa seriusnya ini." />
        <SectionKedelapan />

        <PelukanVirtual />

        <QuoteTransisi quote="Sampai tahun depan, dan tahun-tahun berikutnya. Selalu." />
        <SectionKetujuh />

        <MusicPlayer />
        <Confetti />
      </main>
    </div>
  );
}
