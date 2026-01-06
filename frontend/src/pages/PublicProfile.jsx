import { useState, useEffect } from "react"; // Added useEffect
import { useParams } from "react-router-dom"; // Added useParams
import { Send, Shield, MessageCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiRequest } from "../utils/api"; // Added apiRequest

export default function PublicProfile() {
  const { username } = useParams(); // Grabs 'username' from the URL path /u/:username
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState(null); // Changed to null initially
  const [answered, setAnswered] = useState([]); // Changed to empty array
  const [loading, setLoading] = useState(true);
  const [sent, setSent] = useState(false);

  // --- FETCH PUBLIC DATA ---
  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        setLoading(true);
        // Your backend route: GET /u/:username
        const data = await apiRequest(`/u/${username}`);
        
        if (data && !data.error) {
          setProfile(data.user);
          setAnswered(data.answeredMessages || []);
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
    if (!message.trim() || !profile) return;

    try {
      const response = await apiRequest("/messages/send", {
        method: "POST",
        body: JSON.stringify({
          receiver_id: profile.id, // ID of the person receiving the message
          content: message,
        }),
      });

      if (response.success) {
        setSent(true);
        setMessage("");
        // Reset "sent" state after 5 seconds to allow another message
        setTimeout(() => setSent(false), 5000);
      }
    } catch (err) {
      alert("Failed to send message. Please try again.");
    }
  };

  // --- RENDER STATES ---
  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-gray-500 uppercase tracking-widest text-xs">Loading Profile...</div>;
  
  if (!profile) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-red-500 uppercase tracking-widest text-xs">User Not Found</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col">
      <Navbar />

      {/* ... Background Glow remains same ... */}

      <main className="relative z-10 flex-grow max-w-2xl mx-auto w-full px-6 pt-24 pb-16">
        
        {/* Profile Header (Updated with dynamic data) */}
        <section className="text-center mb-14">
          <div className="flex justify-center mb-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#111] to-[#050505] border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-[#f59e0b]">
                  {profile.display_name?.[0] || profile.username?.[0]?.toUpperCase()}
                </span>
              )}
            </div>
          </div>
          <h1 className="text-xl font-bold tracking-tight">{profile.display_name || profile.username}</h1>
          <p className="text-[11px] text-gray-500 uppercase tracking-widest mt-1">@{profile.username}</p>
          <p className="mt-4 text-sm text-gray-300 font-light leading-relaxed max-w-md mx-auto">{profile.bio || "No bio yet."}</p>
        </section>

        {/* Message Box */}
        <section className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-6 mb-16">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={14} className="text-[#f59e0b]" />
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
              {sent ? "Message sent successfully!" : "Send an anonymous message"}
            </span>
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={sent}
            placeholder={sent ? "Thank you for sharing!" : "Ask anything. Stay respectful."}
            className={`w-full bg-black border border-white/10 rounded-2xl px-4 py-4 text-white placeholder:text-gray-800 resize-none focus:outline-none transition min-h-[120px] ${sent ? 'border-green-500/30' : 'focus:border-[#f59e0b]/30'}`}
          />

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSend}
              disabled={!message.trim() || sent}
              className="flex items-center gap-3 bg-[#f59e0b] text-[#050505] px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:brightness-110 transition disabled:opacity-50 shadow-lg shadow-[#f59e0b]/10"
            >
              {sent ? "Sent" : "Send"}
              <Send size={14} />
            </button>
          </div>
        </section>

        {/* Answered Messages (Updated with dynamic data) */}
        {answered.length > 0 && (
          <section className="space-y-8">
            <div className="flex items-center gap-2">
              <MessageCircle size={16} className="text-[#f59e0b]" />
              <h2 className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">Answered questions</h2>
            </div>

            {answered.map((item, index) => (
              <div key={index} className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-6">
                <p className="text-gray-200 font-light leading-relaxed mb-4">“{item.content}”</p>
                <div className="border-l-2 border-[#f59e0b]/30 pl-4">
                  <p className="text-sm text-gray-300 font-light leading-relaxed">{item.answer_text}</p>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}