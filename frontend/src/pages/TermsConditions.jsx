import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Terms() {
  return (
    <>
      <Navbar />

      <section className="bg-[#050505] min-h-screen px-6 pt-28 pb-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-semibold text-white mb-6">
            Terms & Conditions
          </h1>

          <p className="text-gray-400 mb-6 leading-relaxed">
            By accessing or using ANONIX, you agree to be bound by
            these Terms and Conditions.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">
            Use of Service
          </h2>
          <p className="text-gray-400 leading-relaxed">
            You agree not to misuse the service or use it for
            unlawful activities.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">
            Limitation of Liability
          </h2>
          <p className="text-gray-400 leading-relaxed">
            ANONIX is provided "as is" without warranties of any kind.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
