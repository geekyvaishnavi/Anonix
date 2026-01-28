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
          // Only show messages that have a status of 'answered'
          const feed = data.feed || [];
          setAnswered(feed.filter(item => item.status === 'answered'));
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicData();
  }, [username]);

  const handleSend = async () => {
    if (!message.trim() || !profile || sending) return;

    setSending(true);
    try {
      const response = await apiRequest("/messages/send", {
        method: "POST",
        body: JSON.stringify({
          recipient_id: profile.id,
          content: message,
        }),
      });

      if (response.success) {
        setSent(true);
        setMessage("");
        setTimeout(() => setSent(false), 5000);
      }
    } catch {
      alert("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#f59e0b] mb-4" size={22} />
        <span className="uppercase tracking-[0.3em] text-[10px] font-bold text-gray-600">
          Loading
        </span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-red-500 uppercase tracking-widest text-[10px] font-bold">
        User Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col selection:bg-[#f59e0b]/30">
      <Navbar />

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-[520px] h-[360px] bg-[#f59e0b]/5 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 flex-grow max-w-2xl mx-auto w-full px-5 sm:px-6 pt-24 sm:pt-28 pb-24 scroll-smooth">
        {/* Profile Header */}
        <section className="text-center mb-14">
          <div className="flex justify-center mb-5">
            <div className="relative group">
              <div className="absolute -inset-1 bg-[#f59e0b] rounded-[28px] blur-md opacity-20 group-hover:opacity-40 transition duration-500" />
              <div
                className="relative w-24 h-24 sm:w-28 sm:h-28 bg-[#0A0A0A] border border-white/10 flex items-center justify-center overflow-hidden shadow-xl transition-transform duration-500 group-hover:scale-[1.02]"
                style={{ borderRadius: "28px" }}
              >
                {profile.pfp_url ? (
                  <img
                    src={profile.pfp_url}
                    alt={profile.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-[#f59e0b]">
                    {profile.username?.[0]?.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="inline-block px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-sm mb-6">
            <p className="text-[10px] text-[#f59e0b] uppercase tracking-[0.3em] font-black">
              @{profile.username}
            </p>
          </div>

          {profile.bio && (
            <div className="mt-6 flex justify-center">
              <div className="relative max-w-md w-full group">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[#f59e0b]/25 group-hover:text-[#f59e0b]/40 transition-all">
                  <Quote size={20} fill="currentColor" />
                </div>
                <div className="bg-white/[0.025] backdrop-blur-lg border border-white/5 rounded-2xl px-6 py-5 shadow-xl">
                  <p className="text-[13px] text-gray-400 font-light leading-relaxed italic text-center">
                    {profile.bio}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Message Input Box */}
        <section className="bg-[#0A0A0A] border border-white/5 rounded-[20px] p-4 mb-16 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={12} className="text-[#f59e0b]" />
            <span className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-black">
              {sent ? "Message Delivered" : "Send Anonymous Message"}
            </span>
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={sent || sending}
            placeholder={sent ? "Thank you for the message!" : "Ask me anything..."}
            className={`w-full bg-[#050505] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-800 resize-none focus:outline-none transition-all min-h-[90px] ${
              sent
                ? "border-green-500/20 shadow-[0_0_18px_rgba(34,197,94,0.05)]"
                : "focus:border-[#f59e0b]/20"
            }`}
          />

          <div className="mt-3 flex justify-end">
            <button
              onClick={handleSend}
              disabled={!message.trim() || sent || sending}
              className={`flex items-center gap-3 px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                sent
                  ? "bg-green-500/10 text-green-500 border border-green-500/20"
                  : "bg-[#f59e0b] text-black hover:brightness-110 active:scale-95 shadow-lg shadow-[#f59e0b]/10"
              } disabled:opacity-30`}
            >
              {sending ? "Sending..." : sent ? (
                <>
                  <CheckCircle2 size={14} /> Sent
                </>
              ) : "Send Message"}
              {!sending && !sent && <Send size={12} />}
            </button>
          </div>
        </section>

        {/* Public Feed / Answers */}
        <div className="flex items-center gap-3 mb-8">
          <MessageCircle size={14} className="text-[#f59e0b]" />
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-black">
            Answers
          </h2>
          <div className="h-px flex-grow bg-white/5" />
        </div>

        {answered.length > 0 ? (
          <section className="space-y-6">
            {answered.map((item) => {
              // EXTRACT RESPONSE TEXT FROM NESTED ARRAY
              const responseText = item.replies?.reply_text;


              // array obj reply change

              
              console.log(answered); 
              console.log(item);
              return (
                <div key={item.id}>
                  <div className="bg-[#0A0A0A] border border-white/5 rounded-[18px] p-5 hover:border-white/10 transition-colors">
                    <p className="text-gray-500 text-[13px] font-light leading-relaxed mb-4 italic">
                      “{item.content}”
                    </p>

                    <div className="relative pl-4 border-l-2 border-[#f59e0b]/30">
                      <span className="text-[8px] uppercase tracking-[0.2em] text-[#f59e0b] font-black block mb-1">
                        Response
                      </span>
                      <p className="text-gray-200 text-sm font-medium leading-relaxed tracking-[0.01em]">
                        {responseText || "No response provided."}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        ) : (
          <div className="text-center py-14 border border-dashed border-white/5 rounded-[20px]">
            <p className="text-gray-700 text-[9px] uppercase tracking-[0.4em] font-black">
              No answers yet
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}