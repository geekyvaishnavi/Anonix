import { Link } from 'react-router-dom';

export default function Navbar() {
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Register', href: '/register' },
  ];

  return (
    <nav className="fixed top-0 w-full h-16 z-[100]
      bg-black/50 backdrop-blur-xl border-b border-white/5">
      
      <div className="max-w-7xl mx-auto h-full px-6 md:px-12
        flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-lg md:text-xl font-semibold italic uppercase
            tracking-tight text-white hover:opacity-90 transition"
        >
          ANONIX<span className="text-[#f59e0b]">.</span>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-6">

          {/* Links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative text-[11px] font-medium uppercase
                  tracking-[0.18em] text-gray-400
                  hover:text-white transition group"
              >
                {link.name}
                <span
                  className="absolute left-0 -bottom-1 w-0 h-[1px]
                  bg-[#f59e0b] transition-all duration-300
                  group-hover:w-full"
                />
              </a>
            ))}
          </div>

          {/* Login CTA */}
          <a
            href="/login"
            className="text-[11px] font-semibold uppercase tracking-[0.2em]
              px-5 py-2 rounded-full
              bg-[#f59e0b]/10 text-[#f59e0b]
              border border-[#f59e0b]/40
              hover:bg-[#f59e0b] hover:text-black
              transition-all"
          >
            Login
          </a>
        </div>
      </div>
    </nav>
  );
}
