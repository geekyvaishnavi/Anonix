import { useState, useEffect } from "react";
import { User, Camera, ChevronLeft, Save, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiRequest } from "../utils/api";

export default function Profile() {
  const [preview, setPreview] = useState(null);
  const [bio, setBio] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  // 1. Fetch existing profile data on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiRequest("/dashboard/me"); // Reusing your existing me route
        if (data && !data.error) {
          setDisplayName(data.display_name || "");
          setBio(data.bio || "");
          setPreview(data.pfp_url || null);
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // For now, we handle the preview. 
      // Note: Real image upload usually requires Cloudinary or Supabase Storage.
      setPreview(URL.createObjectURL(file));
    }
  };

  // 2. Handle API Call
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await apiRequest("/user/profile/update", {
        method: "PUT",
        body: JSON.stringify({
          display_name: displayName || "User", // Fallback
          bio: bio,
          avatar_url: preview, // Sending the URL/base64 string
        }),
      });

      if (response.success) {
        alert("Profile updated successfully!");
        navigate("/user/dashboard");
      } else {
        alert(response.error || "Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <Loader2 className="animate-spin text-[#f59e0b]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col">
      <Navbar />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-[#f59e0b]/5 rounded-full blur-[120px]" />
      </div>

      <section className="relative z-10 flex-grow flex items-center justify-center px-6 pt-24 pb-12">
        <div className="w-full max-w-sm flex flex-col">
          <Link to="/user/dashboard" className="group flex items-center gap-2 text-gray-500 hover:text-[#f59e0b] text-[10px] font-bold uppercase tracking-[0.2em] mb-6 transition-colors">
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>

          <div className="bg-[#0f0f0f] border border-white/5 rounded-[32px] p-6 sm:p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-xl font-bold tracking-tight text-white mb-1">Profile Settings</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">Customize your identity</p>
            </div>

            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#111] to-[#050505] border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
                  {preview ? <img src={preview} alt="Profile" className="w-full h-full object-cover" /> : <User size={32} className="text-[#f59e0b]" strokeWidth={1.5} />}
                </div>
                <label className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-[#f59e0b] flex items-center justify-center text-[#050505] cursor-pointer hover:scale-110 transition shadow-lg">
                  <Camera size={14} strokeWidth={3} />
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Display Name</label>
                <input 
                   type="text"
                   value={displayName}
                   onChange={(e) => setDisplayName(e.target.value)}
                   className="w-full bg-black border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:border-[#f59e0b]/30 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Your Bio</label>
                <textarea
                  rows="3"
                  maxLength={160}
                  placeholder="Tell the world who you are..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:border-[#f59e0b]/30 transition-colors resize-none"
                />
                <div className="mt-1.5 flex justify-end">
                  <span className="text-[9px] font-mono text-gray-700">{bio.length}/160</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3.5 rounded-2xl bg-[#f59e0b] text-[#050505] text-[11px] font-black uppercase tracking-widest hover:brightness-110 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} strokeWidth={3} />}
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}