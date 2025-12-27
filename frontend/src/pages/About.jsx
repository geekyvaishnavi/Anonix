import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function About() {
  return (
    <>
      <Navbar />

      <section className="bg-[#050505] min-h-screen px-6 pt-28 pb-24">
        <div className="max-w-4xl mx-auto">

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-6">
            About ANONIX
          </h1>

          {/* Intro */}
          <p className="text-gray-400 leading-relaxed mb-8">
            ANONIX is a simple platform built to let people receive
            messages without revealing who sent them. The goal is to
            make honest communication possible without unnecessary
            friction.
          </p>

          {/* Section */}
          <h2 className="text-xl font-semibold text-white mt-10 mb-4">
            Why ANONIX?
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Many people hesitate to share honest thoughts because of
            identity, judgement, or social pressure. ANONIX removes
            that layer, allowing messages to be shared freely while
            keeping the experience minimal and focused.
          </p>

          {/* Section */}
          <h2 className="text-xl font-semibold text-white mt-10 mb-4">
            What We Focus On
          </h2>
          <ul className="list-disc list-inside text-gray-400 space-y-3">
            <li>Simplicity in design and usage</li>
            <li>Anonymous message delivery</li>
            <li>Clear and minimal user experience</li>
          </ul>

      

        </div>
      </section>

      <Footer />
    </>
  );
}
