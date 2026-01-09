import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Send, Shield, MessageCircle, Loader2, CheckCircle2 } from "lucide-react";
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
          setAnswered(data.feed || []);
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
        body: JSON.stringify({ recipient_id: profile.id, content: message }),
      });
      if (response.success) {
        setSent(true);
        setMessage("");
        setTimeout(() => setSent(false), 5000);
      }
    } catch (err) {
      alert("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#f59e0b] mb-4" size={24} />
        <span className="uppercase tracking-[0.3em] text-[10px] font-bold text-gray-600">Loading</span>
      </div>
    );
  }

  if (!profile) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-red-500 uppercase tracking-widest text-[10px] font-bold">
      User Not Found
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col selection:bg-[#f59e0b]/30">
      <Navbar />

      {/* Subtle Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#f59e0b]/5 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 flex-grow max-w-xl mx-auto w-full px-6 pt-24 pb-24">
        
        {/* Profile Header */}
        <section className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-[#f59e0b] rounded-[32px] blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative w-28 h-28 rounded-[30px] bg-[#0A0A0A] border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
                {profile.pfp_url ? (
                  <img src={profile.pfp_url} alt={profile.username} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-[#f59e0b]">
                    {profile.display_name?.[0] || profile.username?.[0]?.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <h1 className="text-lg font-bold tracking-tight text-white uppercase">
            {profile.display_name || profile.username}
          </h1>
          <p className="text-[10px] text-[#f59e0b] uppercase tracking-[0.2em] mt-1 font-black opacity-80">
            @{profile.username}
          </p>
          <p className="mt-4 text-[13px] text-gray-400 font-light leading-relaxed max-w-sm mx-auto">
            {profile.bio || "Welcome to my anonymous message board."}
          </p>
        </section>

        {/* Message Input Box */}
        <section className="bg-[#0A0A0A] border border-white/5 rounded-[24px] p-5 mb-20 shadow-2xl relative overflow-hidden group">
          <div className="flex items-center gap-2 mb-4">
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
            className={`w-full bg-[#050505] border border-white/5 rounded-xl px-4 py-4 text-sm text-white placeholder:text-gray-800 resize-none focus:outline-none transition-all min-h-[110px] ${
              sent ? "border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.05)]" : "focus:border-[#f59e0b]/20"
            }`}
          />

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSend}
              disabled={!message.trim() || sent || sending}
              className={`flex items-center gap-3 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                sent 
                ? "bg-green-500/10 text-green-500 border border-green-500/20" 
                : "bg-[#f59e0b] text-black hover:brightness-110 active:scale-95 shadow-lg shadow-[#f59e0b]/10"
              } disabled:opacity-30`}
            >
              {sending ? "Sending..." : sent ? <><CheckCircle2 size={14}/> Sent</> : "Send Message"}
              {!sending && !sent && <Send size={12} />}
            </button>
          </div>
        </section>

        {/* Answered Feed */}
        <div className="flex items-center gap-3 mb-10">
          <MessageCircle size={14} className="text-[#f59e0b]" />
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-black">
            The Archive
          </h2>
          <div className="h-px flex-grow bg-white/5"></div>
        </div>

        {answered.length > 0 ? (
          <section className="space-y-8">
            {answered.map((item) => (
              <div key={item.id} className="group transition-all duration-500">
                <div className="bg-[#0A0A0A] border border-white/5 rounded-[20px] p-6 hover:border-white/10 transition-colors">
                  <p className="text-gray-400 text-[14px] font-light leading-relaxed mb-6 italic">
                    "{item.content}"
                  </p>

                  <div className="relative pl-5">
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-[#f59e0b] to-transparent opacity-40" />
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[8px] uppercase tracking-[0.2em] text-[#f59e0b] font-black">
                        Reply from @{profile.username}
                      </span>
                    </div>
                    <p className="text-gray-200 text-sm font-medium leading-relaxed">
                      {item.replies?.[0]?.reply_text || "No response provided."}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </section>
        ) : (
          <div className="text-center py-20 border border-dashed border-white/5 rounded-[24px]">
            <p className="text-gray-700 text-[9px] uppercase tracking-[0.3em] font-black">
              No answers yet
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}