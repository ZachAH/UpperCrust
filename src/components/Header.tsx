import { Link } from "react-router-dom";
import { useEffect } from "react";
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
  return (
    <header className="bg-black text-white shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-3">
          <img
            src="/logo.webp"
            alt="Upper Crust Pizza Logo"
            className="w-10 h-10 md:w-12 md:h-12 object-contain"
          />
          <h1 className="text-2xl font-bold tracking-wide">
            Upper Crust Pizza
          </h1>
        </div>

        <nav className="flex space-x-6 text-sm uppercase font-medium">
          <Link to="/" className="hover:text-yellow-400 transition">
            Home
          </Link>
          <Link to="/menu" className="hover:text-yellow-400 transition">
            Menu
          </Link>
          <Link to="/hours" className="hover:text-yellow-400 transition">
            Hours
          </Link>
          <Link to="/contact" className="hover:text-yellow-400 transition">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}