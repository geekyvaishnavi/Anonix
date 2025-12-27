import { useState } from "react";
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
    <>
      <Navbar />

      <section className="min-h-screen bg-[#050505] px-4 sm:px-6 pt-24 pb-20">
        <div className="mx-auto w-full max-w-md sm:max-w-lg">

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-1.5">
              Profile Settings
            </h1>
            <p className="text-sm text-gray-400">
              Manage how your profile looks.
            </p>
          </div>

          {/* Card */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10
            rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-xl">

            {/* Avatar */}
            <div className="flex flex-col items-center mb-7">
              <div className="relative">

                <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-full
                  overflow-hidden border border-white/10 bg-white/5
                  flex items-center justify-center">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 text-xs">
                      No photo
                    </span>
                  )}
                </div>

                <label className="absolute -bottom-1 -right-1
                  w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#f59e0b]
                  flex items-center justify-center text-black
                  text-sm font-bold cursor-pointer
                  hover:brightness-110 transition">
                  +
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <p className="mt-2.5 text-xs text-gray-500">
                Change photo
              </p>
            </div>

            {/* Form */}
            <form className="space-y-4">

              {/* Bio */}
              <div>
                <label className="block text-[10px] font-semibold uppercase
                  tracking-widest text-gray-400 mb-1.5">
                  Bio
                </label>
                <textarea
                  rows="3"
                  maxLength={160}
                  placeholder="Short bio (optional)"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-black/60 border border-white/10
                    rounded-lg px-3.5 py-2.5 text-sm text-white
                    placeholder-gray-500 focus:outline-none
                    focus:border-[#f59e0b] transition resize-none"
                />
                <div className="mt-1 text-right text-[11px] text-gray-500">
                  {bio.length}/160
                </div>
              </div>

              {/* Save */}
              <button
                type="submit"
                className="w-full mt-2.5 py-2.5 rounded-full
                  bg-[#f59e0b] text-black text-sm font-semibold
                  tracking-wide hover:brightness-110 transition
                  shadow-sm shadow-[#f59e0b]/25"
              >
                Save Changes
              </button>

            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
