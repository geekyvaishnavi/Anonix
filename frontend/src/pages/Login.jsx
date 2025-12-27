import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-[#050505] flex items-center justify-center px-6 pt-20">
        <div className="relative w-full max-w-sm">

          {/* Card */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">

            {/* Heading */}
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-semibold text-white mb-2">
                Login
              </h1>
              <p className="text-sm text-gray-400">
                Access your ANONIX account
              </p>
            </div>

            {/* Form */}
            <form className="space-y-4">

              {/* Username */}
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="your_username"
                  autoComplete="username"
                  className="w-full bg-black/60 border border-white/10
                    rounded-lg px-4 py-2.5 text-white placeholder-gray-500
                    focus:outline-none focus:border-[#f59e0b] transition"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-black/60 border border-white/10
                    rounded-lg px-4 py-2.5 text-white placeholder-gray-500
                    focus:outline-none focus:border-[#f59e0b] transition"
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full mt-3 py-2.5 rounded-full
                  bg-[#f59e0b] text-black font-semibold tracking-wide
                  hover:brightness-110 transition shadow-lg shadow-[#f59e0b]/20"
              >
                Login
              </button>
            </form>

            {/* Footer text */}
            <p className="mt-6 text-sm text-gray-500 text-center">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-[#f59e0b] hover:underline"
              >
                Register
              </Link>
            </p>
          </div>

          {/* Subtle glow */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2
              -translate-x-1/2 -translate-y-1/2
              w-[360px] h-[260px]
              bg-[#f59e0b]/10 blur-[120px]" />
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}
