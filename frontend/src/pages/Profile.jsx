import { useState } from "react";
import { User, Camera, ChevronLeft, Save } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Profile() {
  const [preview, setPreview] = useState(null);
  const [bio, setBio] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col">
      <Navbar />

      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-[#f59e0b]/5 rounded-full blur-[120px]" />
      </div>

      <section className="relative z-10 flex-grow flex items-center justify-center px-6 pt-24 pb-12">
        <div className="w-full max-w-sm flex flex-col">
          
          {/* Back to Dashboard Link */}
          <Link 
            to="/user/dashboard" 
            className="group flex items-center gap-2 text-gray-500 hover:text-[#f59e0b] text-[10px] font-bold uppercase tracking-[0.2em] mb-6 transition-colors"
          >
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>

          {/* Settings Card */}
          <div className="bg-[#0f0f0f] border border-white/5 rounded-[32px] p-6 sm:p-8 shadow-2xl">
            
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-xl font-bold tracking-tight text-white mb-1">
                Profile Settings
              </h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">
                Customize your identity
              </p>
            </div>

            {/* Avatar Section (Matching Dashboard) */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#111] to-[#050505] border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={32} className="text-[#f59e0b]" strokeWidth={1.5} />
                  )}
                </div>

                <label className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-[#f59e0b] flex items-center justify-center text-[#050505] cursor-pointer hover:scale-110 transition shadow-lg shadow-[#f59e0b]/20">
                  <Camera size={14} strokeWidth={3} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <p className="mt-4 text-[9px] text-gray-600 uppercase tracking-[0.2em] font-black">
                Update Image
              </p>
            </div>

            {/* Form */}
            <form className="space-y-5">
              {/* Bio Field */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">
                  Your Bio
                </label>
                <textarea
                  rows="3"
                  maxLength={160}
                  placeholder="Tell the world who you are..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-800 focus:outline-none focus:border-[#f59e0b]/30 transition-colors resize-none leading-relaxed"
                />
                <div className="mt-1.5 flex justify-end">
                  <span className="text-[9px] font-mono text-gray-700">
                    {bio.length}/160
                  </span>
                </div>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#f59e0b] text-[#050505] text-[11px] font-black uppercase tracking-widest hover:brightness-110 transition shadow-lg shadow-[#f59e0b]/10 flex items-center justify-center gap-2"
              >
                <Save size={14} strokeWidth={3} />
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}