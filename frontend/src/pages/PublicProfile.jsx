import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Send,
  Shield,
  MessageCircle,
  Loader2,
  CheckCircle2,
  Quote,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiRequest } from "../utils/api";

export default function PublicProfile() {
  const { username } = useParams();

  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState(null);
  const [answered, setAnswered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        setLoading(true);
        const data = await apiRequest(`/u/${username}`);
        if (data && !data.error) {
          setProfile(data.profile);
          setAnswered((data.feed || []).filter(i => i.status === "answered"));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicData();
  }, [username]);

  const handleSend = async () => {
    if (!message.trim() || sending || !profile) return;
    setSending(true);

    try {
      const res = await apiRequest("/messages/send", {
        method: "POST",
        body: JSON.stringify({
          recipient_id: profile.id,
          content: message,
        }),
      });

      if (res.success) {
        setSent(true);
        setMessage("");
        setTimeout(() => setSent(false), 4500);
      }
    } catch {
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#f59e0b] mb-4" size={22} />
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-600">
          Loading profile
        </span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-red-500 text-[10px] uppercase tracking-widest font-bold">
        User not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col selection:bg-[#f59e0b]/30">
      <Navbar />

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[520px] h-[360px] bg-[#f59e0b]/5 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 flex-grow max-w-2xl mx-auto w-full px-5 sm:px-6 pt-28 pb-28">

        {/* PROFILE */}
        <section className="text-center mb-16">
          <div className="flex justify-center mb-5">
            <div className="relative">
              <div className="absolute -inset-1 rounded-[26px] bg-[#f59e0b]/15 blur-md" />
              <div className="relative w-24 h-24 bg-[#0A0A0A] border border-white/10 rounded-[26px] overflow-hidden shadow-lg">
                {profile.pfp_url ? (
                  <img
                    src={profile.pfp_url}
                    alt={profile.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="flex items-center justify-center h-full text-2xl font-bold text-[#f59e0b]">
                    {profile.username[0]?.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <h1 className="text-[28px] font-semibold tracking-tight">
            {profile.display_name || profile.username}
          </h1>

          <div className="inline-flex mt-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.025]">
            <span className="text-[10px] uppercase tracking-[0.28em] text-[#f59e0b] font-bold">
              @{profile.username}
            </span>
          </div>

          {/* BIO */}
          <div className="mt-5 flex justify-center">
            <div className="relative max-w-xs w-full">
              <Quote
                size={14}
                className="absolute -top-2 left-1/2 -translate-x-1/2 text-[#f59e0b]/25"
                fill="currentColor"
              />
              <div className="px-4 py-3 rounded-lg bg-white/[0.02] border border-white/5 backdrop-blur">
                <p className="text-[13px] text-gray-400 leading-relaxed italic text-center">
                  {profile.bio || "Bio unavailable"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MESSAGE BOX */}
        <section className="mb-18 bg-[#0A0A0A] border border-white/5 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={11} className="text-[#f59e0b]" />
            <span className="text-[9px] uppercase tracking-[0.25em] text-gray-500 font-bold">
              {sent ? "Message sent" : "Send anonymously"}
            </span>
          </div>

          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            disabled={sent || sending}
            placeholder={sent ? "Thank you ✨" : "Ask me anything..."}
            className={`w-full min-h-[90px] bg-[#050505] border rounded-xl px-4 py-3 text-sm resize-none focus:outline-none transition ${
              sent
                ? "border-green-500/20"
                : "border-white/5 focus:border-[#f59e0b]/30"
            }`}
          />

          <div className="flex justify-end mt-3">
            <button
              onClick={handleSend}
              disabled={!message.trim() || sent || sending}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[9px] uppercase tracking-widest font-bold transition ${
                sent
                  ? "bg-green-500/10 text-green-500 border border-green-500/20"
                  : "bg-[#f59e0b] text-black hover:brightness-110 active:scale-95"
              } disabled:opacity-30`}
            >
              {sending ? "Sending..." : sent ? (
                <>
                  <CheckCircle2 size={13} /> Sent
                </>
              ) : "Send"}
              {!sent && !sending && <Send size={11} />}
            </button>
          </div>
        </section>

        {/* ANSWERS */}
        <div className="flex items-center gap-3 mb-8">
          <MessageCircle size={14} className="text-[#f59e0b]" />
          <h2 className="text-[10px] uppercase tracking-[0.35em] text-gray-500 font-bold">
            Answers
          </h2>
          <div className="flex-grow h-px bg-white/5" />
        </div>

        {answered.length ? (
          <section className="space-y-6">
            {answered.map(item => {
              const reply = Array.isArray(item.replies)
                ? item.replies[0]
                : item.replies;

              return (
                <div
                  key={item.id}
                  className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition"
                >
                  <p className="text-gray-500 text-[13px] italic mb-3">
                    “{item.content}”
                  </p>

                  <div className="pl-4 border-l border-[#f59e0b]/30">
                    <span className="text-[8px] uppercase tracking-[0.25em] text-[#f59e0b] font-bold block mb-1">
                      Response
                    </span>
                    <p className="text-gray-200 text-sm leading-relaxed">
                      {reply?.reply_text || "No response provided."}
                    </p>
                  </div>
                </div>
              );
            })}
          </section>
        ) : (
          <div className="py-16 text-center border border-dashed border-white/5 rounded-2xl">
            <p className="text-gray-700 text-[9px] uppercase tracking-[0.4em] font-bold">
              No answers yet
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
