import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, ChevronLeft, Shield, CornerDownRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AnswerMessage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [answer, setAnswer] = useState("");

  // In a real app, you'd fetch this by ID
  const originalMessage =
    "How do you manage to stay so productive every day?";

  const handleSend = () => {
    console.log("Answering message:", id, "with:", answer);
    // Save to DB here
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white font-sans flex flex-col">
      <Navbar />

      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#f59e0b]/5 rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 flex-grow max-w-2xl mx-auto w-full px-6 pt-24 pb-12">
        {/* Back Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-gray-500 hover:text-[#f59e0b] transition mb-8"
        >
          <ChevronLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
            Back to Inbox
          </span>
        </button>

        <div className="space-y-6">
          {/* Original Message */}
          <div className="bg-[#0f0f0f] border border-white/5 p-6 rounded-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={14} className="text-[#f59e0b]" />
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                Anonymous Message
              </span>
            </div>
            <p className="text-lg sm:text-xl text-gray-200 font-light leading-relaxed">
              "{originalMessage}"
            </p>
          </div>

          {/* Answer Input */}
          <div className="relative group">
            <div className="absolute -left-3 top-0 h-full w-[2px] bg-[#f59e0b]/20 group-focus-within:bg-[#f59e0b] transition-colors" />

            <div className="flex items-start gap-3 pl-4">
              <CornerDownRight size={20} className="text-[#f59e0b] mt-1" />
              <textarea
                autoFocus
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write your public response..."
                className="w-full bg-transparent border-none text-white 
                  text-base sm:text-lg font-light leading-relaxed 
                  resize-none focus:ring-0 placeholder:text-gray-800 
                  min-h-[200px] py-0"
              />
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-gray-600 uppercase tracking-widest max-w-[280px]">
              Once you post, this answer will be visible on your public profile
              link.
            </p>

            <button
              onClick={handleSend}
              disabled={!answer.trim()}
              className="w-full sm:w-auto flex items-center justify-center gap-3 
                bg-[#f59e0b] text-black px-8 py-4 rounded-2xl 
                text-[11px] font-black uppercase tracking-widest 
                hover:brightness-110 transition disabled:opacity-50 
                disabled:cursor-not-allowed shadow-lg shadow-[#f59e0b]/10"
            >
              Post Response
              <Send size={16} />
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
