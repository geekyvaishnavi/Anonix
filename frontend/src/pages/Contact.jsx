import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Contact() {
  return (
    <>
      <Navbar />

      <section className="bg-[#050505] min-h-screen px-6 pt-28 pb-24">
        <div className="max-w-4xl mx-auto">

          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-6">
            Contact Us
          </h1>

          <p className="text-gray-400 leading-relaxed mb-10">
            If you have questions, feedback, or need support, you can
            reach out using the information below.
          </p>

          <div className="space-y-6">

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-2">
                Email
              </h2>
              <p className="text-gray-400">
                support@anonix.app
              </p>
            </div>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-2">
                Social
              </h2>
              <p className="text-gray-400">
                Reach us on X for updates and announcements.
              </p>
            </div>

          </div>

          

        </div>
      </section>

      <Footer />
    </>
  );
}
