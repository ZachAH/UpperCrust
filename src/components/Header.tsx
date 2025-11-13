import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [hash]);

  return null;
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  // Close mobile menu on nav click or page change
  const { pathname } = useLocation();
  useEffect(() => setIsOpen(false), [pathname]);

  return (
    <header className="bg-black text-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4 gap-4">

        {/* Logo + Title */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <img
            src="/logo.webp"
            alt="Upper Crust Pizza Logo"
            className="w-9 h-9 md:w-11 md:h-11 object-contain"
          />

          <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-wide whitespace-nowrap">
            Upper Crust Pizza
          </h1>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 text-sm uppercase font-medium">
          <Link to="/" className="hover:text-yellow-400 transition">Home</Link>
          <Link to="/menu" className="hover:text-yellow-400 transition">Menu</Link>
          <Link to="/hours" className="hover:text-yellow-400 transition">Hours</Link>
          <Link to="/contact" className="hover:text-yellow-400 transition">Contact</Link>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black border-t border-zinc-800 px-6 py-4 space-y-4 text-sm uppercase font-medium animate-slideDown">
          <Link to="/" className="block hover:text-yellow-400 transition">Home</Link>
          <Link to="/menu" className="block hover:text-yellow-400 transition">Menu</Link>
          <Link to="/hours" className="block hover:text-yellow-400 transition">Hours</Link>
          <Link to="/contact" className="block hover:text-yellow-400 transition">Contact</Link>
        </div>
      )}
    </header>
  );
}
