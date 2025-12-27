import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="bg-[#050505] min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <Hero />

      {/* Footer */}
      <Footer />
    </div>
  );
}
