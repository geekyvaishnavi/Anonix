import { useState } from "react";
import { Send, Shield, MessageCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PublicProfile() {
  const [message, setMessage] = useState("");

  // Mock public profile data (replace with API)
  const profile = {
    name: "Vaishnavi",
    username: "@geekyvaishnavi",
    bio: "Building things on the internet. Learning. Shipping. Growing.",
    avatar: null, // image URL if available
  };

  // Mock answered questions
  const answered = [
    {
      question: "How do you stay consistent with learning?",
      answer:
        "I don’t rely on motivation. I show up even on low-energy days and keep my goals small.",
    },
    {
      question: "What advice would you give beginners?",
      answer:
        "Stop waiting to feel ready. Start building early and learn in public.",
    },
  ];

  const handleSend = () => {
    console.log("Anonymous message sent:", message);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col">
      <Navbar />

      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[500px] h-[320px] bg-[#f59e0b]/5 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 flex-grow max-w-2xl mx-auto w-full px-6 pt-24 pb-16">
        {/* Profile Header */}
        <section className="text-center mb-14">
          <div className="flex justify-center mb-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#111] to-[#050505] border border-white/10 flex items-center justify-center shadow-2xl">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-3xl"
                />
              ) : (
                <span className="text-2xl font-bold text-[#f59e0b]">
                  V
                </span>
              )}
            </div>
          </div>

          <h1 className="text-xl font-bold tracking-tight">
            {profile.name}
          </h1>
          <p className="text-[11px] text-gray-500 uppercase tracking-widest mt-1">
            {profile.username}
          </p>

          <p className="mt-4 text-sm text-gray-300 font-light leading-relaxed max-w-md mx-auto">
            {profile.bio}
          </p>
        </section>

        {/* Anonymous Message Box */}
        <section className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-6 mb-16">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={14} className="text-[#f59e0b]" />
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
              Send an anonymous message
            </span>
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask anything. Stay respectful."
            className="w-full bg-black border border-white/10 rounded-2xl px-4 py-4 
              text-base font-light leading-relaxed text-white 
              placeholder:text-gray-800 resize-none focus:outline-none 
              focus:border-[#f59e0b]/30 transition min-h-[120px]"
          />

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className="flex items-center gap-3 bg-[#f59e0b] text-[#050505] 
                px-6 py-3 rounded-2xl text-[11px] font-black 
                uppercase tracking-widest hover:brightness-110 
                transition disabled:opacity-50 disabled:cursor-not-allowed 
                shadow-lg shadow-[#f59e0b]/10"
            >
              Send
              <Send size={14} />
            </button>
          </div>
        </section>

        {/* Answered Messages */}
        <section className="space-y-8">
          <div className="flex items-center gap-2">
            <MessageCircle size={16} className="text-[#f59e0b]" />
            <h2 className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">
              Answered questions
            </h2>
          </div>

          {answered.map((item, index) => (
            <div
              key={index}
              className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-6"
            >
              <p className="text-gray-200 font-light leading-relaxed mb-4">
                “{item.question}”
              </p>

              <div className="border-l-2 border-[#f59e0b]/30 pl-4">
                <p className="text-sm text-gray-300 font-light leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
