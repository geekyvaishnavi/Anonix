import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiRequest } from "../utils/api";
import { useAuth } from "../context/authContext";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const dummyEmail = `${username}@anonix.com`;

      const data = await apiRequest("/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email: dummyEmail,
          username,
          password,
        }),
      });

      if (data && data.token) {
        login(data.token); 
        navigate("/user/dashboard"); 
      } else if (data && data.message === "Account created!") {
        // Fallback if your API creates account but doesn't return token immediately
        alert("Account created! Please login.");
        navigate("/login");
      } else {
        setError(data?.error || "Registration failed");
      }
    } catch (err) {
      setError("Server connection failed. Please try again later.");
    }
  };

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-[#050505] flex items-center justify-center px-6 pt-20">
        <div className="relative w-full max-w-sm">
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-semibold text-white mb-2">
                Create Account
              </h1>
              <p className="text-sm text-gray-400">
                Join ANONIX to receive anonymous messages
              </p>
              
              {error && (
                <div className="mt-4 p-2 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-xs font-medium">
                  {error}
                </div>
              )}
            </div>

            <form className="space-y-4" onSubmit={handleRegister}>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="your_username"
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#f59e0b] transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#f59e0b] transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#f59e0b] transition"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-3 py-2.5 rounded-full bg-[#f59e0b] text-black font-semibold tracking-wide hover:brightness-110 transition shadow-lg shadow-[#f59e0b]/20"
              >
                Register
              </button>
            </form>

            <p className="mt-6 text-sm text-gray-500 text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-[#f59e0b] hover:underline">
                Login
              </Link>
            </p>
          </div>

          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[260px] bg-[#f59e0b]/10 blur-[120px]" />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}