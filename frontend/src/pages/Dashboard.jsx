import React, { useState } from 'react';
import { Edit2, Share2, MessageCircle, Trash2, Copy, Check, User, Archive, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Dashboard() {
  const [filter, setFilter] = useState('active');
  const [copied, setCopied] = useState(false);

  // Mock User Data
  const user = {
    name: "Alex Rivera",
    username: "arivera_99",
  };

  const [messages, setMessages] = useState([
    { id: 1, text: "How do you manage to stay so productive every day?", status: "active", time: "12m ago" },
    { id: 2, text: "Your latest project looks amazing! What tech stack did you use?", status: "answered", time: "2h ago" },
    { id: 3, text: "Would you ever consider a collab?", status: "archived", time: "1d ago" },
  ]);

  const copyLink = () => {
    navigator.clipboard.writeText(`anonix.net/${user.username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleArchive = (id) => {
    setMessages(messages.map(m => m.id === id ? { ...m, status: 'archived' } : m));
  };

  const handleUnarchive = (id) => {
    setMessages(messages.map(m => m.id === id ? { ...m, status: 'active' } : m));
  };

  const handleDelete = (id) => {
    setMessages(messages.filter(m => m.id !== id));
  };

  const filteredMessages = messages.filter(m => m.status === filter);

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white font-sans flex flex-col">
      <Navbar />
      
      {/* Background Glow Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#f59e0b]/5 rounded-full blur-[120px]" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-grow max-w-2xl mx-auto w-full px-6 pt-24 pb-12">
        
        {/* 1. Profile Section */}
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
        </div>

        {/* 2. Public Link Section */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/5 p-4 sm:p-5 rounded-3xl mb-10">
          <label className="block text-[10px] uppercase tracking-[0.2em] text-[#f59e0b] font-bold mb-3">
            Your Public Link
          </label>
          <div className="flex items-center justify-between bg-[#050505] border border-white/10 rounded-2xl p-2.5 pl-4">
            <span className="text-xs sm:text-sm text-gray-400 truncate">anonix.net/{user.username}</span>
            <button 
              onClick={copyLink}
              className="flex items-center gap-2 bg-[#f59e0b] text-black px-4 py-2 rounded-xl text-[10px] font-bold hover:brightness-110 transition shrink-0"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "COPIED" : "COPY"}
            </button>
          </div>
        </div>

        {/* 3. Filters */}
        <div className="flex gap-6 mb-8 border-b border-white/5 overflow-x-auto no-scrollbar">
          {['active', 'answered', 'archived'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`pb-3 text-xs font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${
                filter === tab ? 'text-[#f59e0b]' : 'text-gray-600 hover:text-gray-400'
              }`}
            >
              {tab}
              {filter === tab && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#f59e0b] shadow-[0_0_10px_#f59e0b]" />
              )}
            </button>
          ))}
        </div>

        {/* 4. Messages List */}
        <div className="space-y-3 pb-10">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => (
              <div 
                key={msg.id} 
                className="group bg-[#0f0f0f] border border-white/5 p-5 rounded-2xl transition-all hover:border-[#f59e0b]/20"
              >
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-5 italic font-light">
                  "{msg.text}"
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.03]">
                  <span className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">
                    {msg.time}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    <button className="p-2 rounded-lg text-gray-500 hover:text-[#f59e0b] hover:bg-[#f59e0b]/10 transition" title="Answer">
                      <MessageCircle size={16} />
                    </button>
                    
                    {msg.status === 'archived' ? (
                      <button onClick={() => handleUnarchive(msg.id)} className="p-2 rounded-lg text-gray-500 hover:text-green-400 hover:bg-green-400/10 transition" title="Unarchive">
                        <RotateCcw size={16} />
                      </button>
                    ) : (
                      <button onClick={() => handleArchive(msg.id)} className="p-2 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-400/10 transition" title="Archive">
                        <Archive size={16} />
                      </button>
                    )}

                    <button className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition" title="Share">
                      <Share2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(msg.id)} className="p-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-[#080808] rounded-3xl border border-dashed border-white/5">
              <p className="text-gray-700 text-[10px] uppercase tracking-[0.3em] font-bold">No messages found</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}