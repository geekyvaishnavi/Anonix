import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, User as UserIcon, Camera } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiRequest } from "../utils/api";
import { supabase } from "../lib/supabase";

export default function EditProfile() {
  const [displayName, setDisplayName] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // ✅ For UI preview
  const [userId, setUserId] = useState(null); // ✅ Store ID for upload
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const data = await apiRequest("/dashboard/me");
      if (data && !data.error) {
        setDisplayName(data.display_name || "");
        setPreviewUrl(data.avatar_url || null);
        setUserId(data.id || data._id);
      }
    };
    fetchUser();
  }, []);

  // ✅ Handle file selection and local preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Create temp URL for preview
    }
  };

  const uploadAvatar = async (file, id) => {
    const ext = file.name.split(".").pop();
    const filePath = `${id}.${ext}`;

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
      let avatarUrl = previewUrl; // Keep existing if no new file

      if (avatarFile && userId) {
        avatarUrl = await uploadAvatar(avatarFile, userId);
      }

      const res = await apiRequest("/user/profile/update", {
        method: "PUT",
        body: JSON.stringify({
          display_name: displayName,
          avatar_url: avatarUrl, 
        }),
      });

      if (res.success) {
        navigate("/dashboard");
      } else {
        alert(res.error || "Failed to update profile");
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
          {/* ✅ Improved Avatar Upload with Preview */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-black border border-white/10 flex items-center justify-center">
              {previewUrl ? (
                <img src={previewUrl} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                <UserIcon size={40} className="text-gray-600" />
              )}
              <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer transition">
                <Camera size={20} />
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
            <label className="text-[10px] uppercase tracking-widest text-[#f59e0b] font-bold">
              Profile Picture
            </label>
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