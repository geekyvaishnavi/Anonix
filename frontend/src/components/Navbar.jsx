import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/authContext';

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { name: 'Home', href: '/', show: !isLoggedIn },
    { name: 'About Us', href: '/about', show: true },
    { name: 'Contact Us', href: '/contact', show: true },
    { name: 'Dashboard', href: '/user/dashboard', show: isLoggedIn },
    { name: 'Register', href: '/register', show: !isLoggedIn },
  ];

  const visibleLinks = navLinks.filter(link => link.show);

  return (
    <nav className="fixed top-0 w-full h-16 z-[100] bg-black/50 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto h-full px-6 md:px-12 flex items-center justify-between">
        
        <Link to="/" className="text-lg md:text-xl font-semibold italic uppercase tracking-tight text-white hover:opacity-90 transition">
          ANONIX<span className="text-[#f59e0b]">.</span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <div className="flex items-center gap-10">
            {visibleLinks.map((link) => (
              <Link key={link.name} to={link.href} className="relative text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400 hover:text-white transition group">
                {link.name}
                <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-[#f59e0b] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {isLoggedIn ? (
            <button 
              onClick={handleLogout} 
              className="text-[11px] font-semibold uppercase tracking-[0.2em] px-5 py-2 rounded-full bg-red-500/10 text-red-500 border border-red-500/40 hover:bg-red-500 hover:text-white transition-all"
            >
              Logout
            </button>
          ) : (
            <Link 
              to="/login" 
              className="text-[11px] font-semibold uppercase tracking-[0.2em] px-5 py-2 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/40 hover:bg-[#f59e0b] hover:text-black transition-all"
            >
              Login
            </Link>
          )}
        </div>

        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex flex-col gap-1.5 focus:outline-none"
        >
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-[#050505] border-b border-white/10 flex flex-col p-6 space-y-6 backdrop-blur-3xl">
          {visibleLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.href} 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xs font-medium uppercase tracking-widest text-gray-400"
            >
              {link.name}
            </Link>
          ))}
          
          {isLoggedIn ? (
            <button 
              onClick={handleLogout} 
              className="text-left text-xs font-semibold uppercase tracking-widest text-red-500"
            >
              Logout
            </button>
          ) : (
            <Link 
              to="/login" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="text-xs font-semibold uppercase tracking-widest text-[#f59e0b]"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}