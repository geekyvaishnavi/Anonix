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
  const [user, setUser] = useState({ name: "User", username: "username" });
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
            name: userData.display_name || "User",
            username: userData.username || "username",
          });
        }

        const data = await apiRequest("/dashboard/inbox");
        if (Array.isArray(data)) {
          setMessages(data);
        } else if (data?.error === "Unauthorized") {
          handleLogout();
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
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
      setMessages(messages.map((m) => (m.id === id ? { ...m, status: newStatus } : m)));
      const response = await apiRequest(`/dashboard/message/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.success) {
        setMessages(previousMessages);
        alert("Failed to update status");
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

  const filteredMessages = messages.filter((m) => m.status === filter);
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white font-sans flex flex-col">
      <Navbar />

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#f59e0b]/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex-grow max-w-2xl mx-auto w-full px-6 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8 group">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-[#111] to-[#050505] border border-white/10 flex items-center justify-center text-[#f59e0b] shadow-2xl">
                <User size={32} strokeWidth={1.5} />
              </div>
              <Link
                to="/user/profile/edit"
                className="absolute -bottom-1 -right-1 bg-[#f59e0b] p-1.5 rounded-xl text-[#050505] hover:scale-110 transition shadow-lg"
              >
                <Edit2 size={12} strokeWidth={3} />
              </Link>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">{user.name}</h2>
              <p className="text-gray-500 text-sm italic">@{user.username}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/5 p-4 sm:p-5 rounded-3xl mb-10">
          <label className="block text-[10px] uppercase tracking-[0.2em] text-[#f59e0b] font-bold mb-3">
            Your Public Link
          </label>
          <div className="flex items-center justify-between bg-[#050505] border border-white/10 rounded-2xl p-2.5 pl-4">
            <span className="text-xs sm:text-sm text-gray-400 truncate">
              {window.location.origin}/u/{user.username}
            </span>
            <button
              onClick={copyLink}
              className="flex items-center gap-2 bg-[#f59e0b] text-black px-4 py-2 rounded-xl text-[10px] font-bold hover:brightness-110 transition shrink-0"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "COPIED" : "COPY"}
            </button>
          </div>
        </div>

        <div className="flex gap-6 mb-8 border-b border-white/5 overflow-x-auto no-scrollbar">
          {["active", "answered", "archived"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`pb-3 text-xs font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${
                filter === tab ? "text-[#f59e0b]" : "text-gray-600 hover:text-gray-400"
              }`}
            >
              {tab}
              {filter === tab && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#f59e0b] shadow-[0_0_10px_#f59e0b]" />
              )}
            </button>
          ))}
        </div>

        <div className="space-y-3 pb-10">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="animate-spin inline-block w-6 h-6 border-[3px] border-[#f59e0b] border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-500 text-xs uppercase tracking-widest">Loading messages...</p>
            </div>
          ) : filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className="group bg-[#0f0f0f] border border-white/5 p-5 rounded-2xl transition-all hover:border-[#f59e0b]/20"
              >
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-5 italic font-light">
                  "{msg.content}"
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-white/[0.03]">
                  <span className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">
                    {formatTime(msg.created_at)}
                  </span>

                  <div className="flex items-center gap-1">
                    <Link
                      to={`/answer/${msg.id}`}
                      className="p-2 rounded-lg text-gray-500 hover:text-[#f59e0b] hover:bg-[#f59e0b]/10 transition"
                      title="Answer"
                    >
                      <MessageCircle size={16} />
                    </Link>
                    
                    {msg.status === "archived" ? (
                      <button
                        onClick={() => handleStatusUpdate(msg.id, "active")}
                        className="p-2 rounded-lg text-gray-500 hover:text-green-400 hover:bg-green-400/10 transition"
                        title="Unarchive"
                      >
                        <RotateCcw size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusUpdate(msg.id, "archived")}
                        className="p-2 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-400/10 transition"
                        title="Archive"
                      >
                        <Archive size={16} />
                      </button>
                    )}
                    <button className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition" title="Share">
                      <Share2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="p-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-[#080808] rounded-3xl border border-dashed border-white/5">
              <p className="text-gray-700 text-[10px] uppercase tracking-[0.3em] font-bold">
                No {filter} messages found
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}