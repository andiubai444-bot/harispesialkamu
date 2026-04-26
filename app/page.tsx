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

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-pink-100 via-white to-pink-50 text-pink-900 font-sans">
      <IntroScreen />
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col">
        <Particles />
        <HeroSection />
        <SectionKedua />
        <SectionKetiga />
        <SectionKeempat />
        <SpotifySection />
        <CounterBersama />
        <SectionKelima />
        <SectionKeenam />
        <SectionKedelapan />
        <PelukanVirtual />
        <SectionKetujuh />
        <MusicPlayer />
        <Confetti />
      </main>
    </div>
  );
}
