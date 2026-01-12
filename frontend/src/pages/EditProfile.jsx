import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, ArrowLeft, Save } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiRequest } from "../utils/api";
import { supabase } from "../lib/supabase"; // ✅ NEW

export default function EditProfile() {
  const [displayName, setDisplayName] = useState("");
  const [avatarFile, setAvatarFile] = useState(null); // ✅ NEW
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const data = await apiRequest("/dashboard/me");
      if (data && !data.error) {
        setDisplayName(data.display_name || "");
      }
    };
    fetchUser();
  }, []);

  // ✅ NEW: upload DP to Supabase
  const uploadAvatar = async (file, userId) => {
    const ext = file.name.split(".").pop();
    const filePath = `${userId}.${ext}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (error) throw error;

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let avatarUrl = null;

      if (avatarFile) {
        // get user id from backend session
        const me = await apiRequest("/dashboard/me");
        avatarUrl = await uploadAvatar(avatarFile, me.id);
      }

      const res = await apiRequest("/user/profile/update", {
        method: "PUT",
        body: JSON.stringify({
          display_name: displayName,
          avatar_url: avatarUrl, // ✅ send DP URL
        }),
      });

      if (res.success) {
        navigate("/dashboard");
      } else {
        alert("Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <Navbar />

      <div className="flex-grow max-w-lg mx-auto w-full px-6 pt-32">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition mb-8 text-sm"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>

        <form
          onSubmit={handleSave}
          className="space-y-6 bg-white/5 p-8 rounded-3xl border border-white/10"
        >
          {/* ✅ DP Upload */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#f59e0b] font-bold mb-3">
              Profile Picture
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files[0])}
              className="w-full text-sm"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#f59e0b] font-bold mb-3">
              Display Name
            </label>

            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-[#f59e0b] outline-none transition"
              placeholder="Your Name"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-[#f59e0b] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-50 transition"
          >
            {isSaving ? "SAVING..." : (
              <>
                <Save size={18} /> SAVE CHANGES
              </>
            )}
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
}
