// components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-14">
          {/* Brand */}
          <div>
            <span className="block text-xl font-semibold italic uppercase text-white mb-4">
              ANONIX<span className="text-[#f59e0b]">.</span>
            </span>

            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              Say it. Send it. Stay anonymous.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-2 grid grid-cols-2 gap-12">
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white mb-5">
                Explore
              </h4>
              <ul className="space-y-3 text-sm text-gray-500">
                {["Home", "About Us", "Contact Us", "Register", "Login"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="hover:text-[#f59e0b] transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white mb-5">
                Legal
              </h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-[#f59e0b] transition-colors"
                >
                  Privacy Policy
                </Link>
                </li>

                <li>
                <Link
                  to="/terms-conditions"
                  className="hover:text-[#f59e0b] transition-colors"
                >
                  Terms & Conditions
                </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-6 border-t border-white/5 flex items-center justify-center">
          <p className="text-[11px] text-gray-600 uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} ANONIX
          </p>
        </div>
      </div>
    </footer>
  );
}
