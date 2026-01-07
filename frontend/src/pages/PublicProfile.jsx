import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Send, Shield, MessageCircle, Loader2 } from "lucide-react";
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

  // --- FETCH PUBLIC DATA ---
  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        setLoading(true);
        // GET /u/:username fetches profile + answered messages joined with replies
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

  // --- SEND MESSAGE ---
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
        // Reset "sent" state after 5 seconds
        setTimeout(() => setSent(false), 5000);
      }
    } catch (err) {
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="animate-spin text-[#f59e0b] mb-4" size={24} />
        <span className="uppercase tracking-[0.3em] text-[10px] font-bold">Loading Profile</span>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-red-500 uppercase tracking-widest text-xs">
        User Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col">
      <Navbar />

      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#f59e0b]/5 rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 flex-grow max-w-2xl mx-auto w-full px-6 pt-24 pb-16">
        
        {/* Profile Header */}
        <section className="text-center mb-14">
          <div className="flex justify-center mb-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#111] to-[#050505] border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden">
              {profile.pfp_url ? (
                <img src={profile.pfp_url} alt={profile.username} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-[#f59e0b]">
                  {profile.display_name?.[0] || profile.username?.[0]?.toUpperCase()}
                </span>
              )}
            </div>
          </div>
          <h1 className="text-xl font-bold tracking-tight">{profile.display_name || profile.username}</h1>
          <p className="text-[11px] text-gray-500 uppercase tracking-widest mt-1">@{profile.username}</p>
          <p className="mt-4 text-sm text-gray-400 font-light leading-relaxed max-w-md mx-auto">
            {profile.bio || "No bio yet."}
          </p>
        </section>

        {/* Message Input Box */}
        <section className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-6 mb-16 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={14} className="text-[#f59e0b]" />
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
              {sent ? "Message sent successfully!" : "Send an anonymous message"}
            </span>
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={sent || sending}
            placeholder={sent ? "Thank you for sharing!" : "Ask anything. Stay respectful."}
            className={`w-full bg-black border border-white/10 rounded-2xl px-4 py-4 text-white placeholder:text-gray-800 resize-none focus:outline-none transition min-h-[120px] ${
              sent ? 'border-green-500/30' : 'focus:border-[#f59e0b]/30'
            }`}
          />

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSend}
              disabled={!message.trim() || sent || sending}
              className="flex items-center gap-3 bg-[#f59e0b] text-[#050505] px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:brightness-110 transition disabled:opacity-50 shadow-lg shadow-[#f59e0b]/10"
            >
              {sending ? "Sending..." : sent ? "Sent" : "Send"}
              {!sending && <Send size={14} />}
            </button>
          </div>
        </section>

        {/* Answered Messages Feed */}
        <div className="flex items-center gap-2 mb-8">
          <MessageCircle size={16} className="text-[#f59e0b]" />
          <h2 className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">Answered questions</h2>
        </div>

        {answered.length > 0 ? (
          <section className="space-y-6">
            {answered.map((item) => (
              <div key={item.id} className="group bg-[#0f0f0f] border border-white/5 rounded-3xl p-6 transition-all hover:border-[#f59e0b]/10">
                {/* The Anonymous Question */}
                <p className="text-gray-400 text-sm italic font-light leading-relaxed mb-6">
                  “{item.content}”
                </p>
                
                {/* The User's Response */}
                <div className="relative pl-6">
                  {/* Vertical Accent Line */}
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#f59e0b] to-transparent opacity-40" />
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#f59e0b] font-bold">Response</span>
                  </div>
                  
                  <p className="text-base text-gray-200 font-light leading-relaxed">
                    {/* Handles the nested reply from Supabase join */}
                    {item.replies?.[0]?.reply_text || "No response provided."}
                  </p>
                </div>
              </div>
            ))}
          </section>
        ) : (
          <div className="text-center py-16 bg-[#080808] rounded-3xl border border-dashed border-white/5">
            <p className="text-gray-700 text-[10px] uppercase tracking-[0.3em] font-bold">
              No questions answered yet
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}