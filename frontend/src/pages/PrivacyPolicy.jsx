import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />

      <section className="bg-[#050505] min-h-screen px-6 pt-28 pb-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-semibold text-white mb-6">
            Privacy Policy
          </h1>

          <p className="text-gray-400 mb-6 leading-relaxed">
            This Privacy Policy explains how ANONIX collects, uses,
            and protects information when you use our platform.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">
            Information We Collect
          </h2>
          <p className="text-gray-400 leading-relaxed">
            We collect only the information necessary to provide the
            service. Messages are submitted without requiring personal
            identity information.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">
            Use of Information
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Information is used solely to operate and improve the
            platform.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
