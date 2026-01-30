import React, { useState, useEffect } from "react";
import {
  Edit2,
  Share2,
  MessageCircle,
  Trash2,
  Copy,
  Check,
  User,
  Archive,
  RotateCcw,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiRequest } from "../utils/api";
import { useAuth } from "../context/authContext";

export default function Dashboard() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState({
    name: null,
    username: "username",
    pfp_url: null,
    bio: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("active");
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("jwt_token");
        if (!token) {
          navigate("/login");
          return;
        }

        const userData = await apiRequest("/dashboard/me");
        if (userData && !userData.error) {
          setUser({
            name: userData.display_name,
            username: userData.username,
            pfp_url: userData.pfp_url,
            bio: userData.bio,
          });
        }

        const data = await apiRequest("/dashboard/inbox");
        if (Array.isArray(data)) {
          setMessages(data);
        } else if (data?.error === "Unauthorized") {
          handleLogout();
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const copyLink = () => {
    const url = `${window.location.origin}/u/${user.username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const previousMessages = [...messages];
      setMessages(
        messages.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
      );
      const response = await apiRequest(`/dashboard/message/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.success) {
        setMessages(previousMessages);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message permanently?")) return;
    try {
      setMessages(messages.filter((m) => m.id !== id));
      await apiRequest(`/dashboard/message/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  
  const filteredMessages = messages.filter((m) => {
    // handling array or single object for replies
    const hasReply = Array.isArray(m.replies) 
      ? m.replies.length > 0 
      : !!m.replies;

    //archived
    if (filter === "archived") {
      return m.status === "archived";
    }

    // answered tab
    if (filter === "answered") {
      return hasReply && m.status !== "archived";
    }

    // active tab
    if (filter === "active") {
      return !hasReply && m.status === "active";
    }

    return false;
  });

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white font-sans flex flex-col selection:bg-[#f59e0b]/30">
      <Navbar />

      {/* Aesthetic Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#f59e0b]/5 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 flex-grow max-w-2xl mx-auto w-full px-6 pt-24 pb-12">
        
        {/* Profile Header */}
        <section className="flex items-start justify-between mb-8 group">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#0A0A0A] border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
                {user.pfp_url ? (
                  <img src={user.pfp_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={32} strokeWidth={1.5} className="text-[#f59e0b]" />
                )}
              </div>
              <Link
                to="/user/profile/edit"
                className="absolute -bottom-1 -right-1 bg-[#f59e0b] p-1.5 rounded-xl text-[#050505] hover:scale-110 transition shadow-lg"
              >
                <Edit2 size={12} strokeWidth={3} />
              </Link>
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {user.name || user.username}
              </h2>
              <p className="text-[#f59e0b] text-xs font-black uppercase tracking-widest mt-1 opacity-80">
                @{user.username}
              </p>
              <p className="text-gray-400 text-xs font-light leading-relaxed mt-2 max-w-[280px]">
                {user.bio ? user.bio : <span className="text-gray-600 italic">Bio unavailable</span>}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition"
          >
            <LogOut size={20} />
          </button>
        </section>

        {/* Share Link Box */}
        <section className="bg-black/40 backdrop-blur-xl border border-white/5 p-4 sm:p-5 rounded-3xl mb-10">
          <label className="block text-[9px] uppercase tracking-[0.3em] text-[#f59e0b] font-black mb-3 opacity-50">
            Profile Link
          </label>
          <div className="flex items-center justify-between bg-[#050505] border border-white/10 rounded-2xl p-2 pl-4">
            <span className="text-xs text-gray-500 truncate mr-4">
              {window.location.origin}/u/{user.username}
            </span>
            <button
              onClick={copyLink}
              className="flex items-center gap-2 bg-[#f59e0b] text-black px-4 py-2 rounded-xl text-[10px] font-black hover:brightness-110 transition shrink-0"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "COPIED" : "COPY"}
            </button>
          </div>
        </section>

        {/* Tab Selection */}
        <nav className="flex gap-6 mb-8 border-b border-white/5 overflow-x-auto no-scrollbar">
          {["active", "answered", "archived"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`pb-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${
                filter === tab ? "text-[#f59e0b]" : "text-gray-600 hover:text-gray-400"
              }`}
            >
              {tab}
              {filter === tab && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#f59e0b] shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
              )}
            </button>
          ))}
        </nav>

        {/* Message Feed */}
        <div className="space-y-4 pb-10">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="animate-spin inline-block w-5 h-5 border-[2px] border-[#f59e0b] border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-600 text-[10px] uppercase tracking-widest">Refreshing Feed</p>
            </div>
          ) : filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => {
              // Extract reply text 
              const replyData = Array.isArray(msg.replies) ? msg.replies[0] : msg.replies;
              const answerText = replyData?.reply_text;

              return (
                <div key={msg.id} className="bg-[#0A0A0A] border border-white/5 rounded-2xl hover:border-white/10 transition-all overflow-hidden flex flex-col">
                  {/* Question Box */}
                  <div className="p-5">
                    <p className="text-gray-300 text-sm leading-relaxed italic font-light">
                      "{msg.content}"
                    </p>
                  </div>

                  {/* Attached Response Box */}
                  {answerText && (
                    <div className="px-5 pb-5">
                      <div className="p-4 bg-white/[0.02] border-l-2 border-[#f59e0b] rounded-r-xl">
                        <label className="block text-[8px] uppercase tracking-widest text-[#f59e0b] font-black mb-1 opacity-60">
                          Your Response
                        </label>
                        <p className="text-gray-200 text-sm font-medium">
                          {answerText}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div className="px-5 py-3 bg-white/[0.01] border-t border-white/[0.03] flex items-center justify-between">
                    <span className="text-[9px] text-gray-600 font-mono tracking-tighter">
                      {formatTime(msg.created_at)}
                    </span>
                    <div className="flex items-center gap-1">
                      {!answerText && (
                        <Link to={`/answer/${msg.id}`} className="p-2 text-gray-500 hover:text-[#f59e0b] transition" title="Answer">
                          <MessageCircle size={16} />
                        </Link>
                      )}
                      
                      <button 
                        onClick={() => handleStatusUpdate(msg.id, msg.status === "archived" ? "active" : "archived")}
                        className="p-2 text-gray-500 hover:text-white transition"
                        title={msg.status === "archived" ? "Unarchive" : "Archive"}
                      >
                        {msg.status === "archived" ? <RotateCcw size={16} /> : <Archive size={16} />}
                      </button>

                      <button 
                        onClick={() => handleDelete(msg.id)} 
                        className="p-2 text-gray-500 hover:text-red-500 transition"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 border border-dashed border-white/5 rounded-3xl">
              <p className="text-gray-700 text-[10px] uppercase tracking-[0.4em] font-black">
                No {filter} messages
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}