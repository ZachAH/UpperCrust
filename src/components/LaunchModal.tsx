import { useState, useEffect } from "react";
import logo from "../../public/logo.webp"

export default function LaunchModal() {
  const [visible, setVisible] = useState(true);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const isSmallScreen = window.innerWidth < 500;

    if (!isSmallScreen) {
      const timer = setTimeout(() => handleClose(), 4500);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "auto";
      };
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleClose = () => {
    setClosing(true);
    document.body.style.overflow = "auto";
    setTimeout(() => setVisible(false), 400);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="launch-modal-title"
      className={`fixed inset-0 z-[99999] flex items-center justify-center
        p-4 bg-black/70 backdrop-blur-sm transition-opacity
        ${closing ? "opacity-0" : "opacity-100"}
      `}
      onClick={handleClose}
    >
      <div
        className="relative bg-yellow-400 text-black font-extrabold
          px-4 py-6 rounded-xl shadow-2xl text-center
          text-lg sm:text-2xl animate-popup overflow-hidden
          max-w-[90%] w-full max-h-[75vh]
          flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Headline */}
        <h2 id="launch-modal-title" className="mb-3 leading-snug">
          {/* Desktop emojis */}
          <span className="hidden sm:inline">🍕 </span>
          New Website — Same Upper Crust!!
          <span className="hidden sm:inline"> 🍕</span>
        </h2>

        {/* MOBILE: Logo + Pizza Side-by-side */}
        <div className="flex items-center gap-2 justify-center sm:hidden mb-1">
          <img src={logo} alt="Upper Crust Logo" className="w-16" />
          <span className="text-4xl">🍕</span>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-3 text-black text-2xl font-bold
            hover:text-red-700"
          aria-label="Close popup"
        >
          ❌
        </button>

        <div className="cheese-shine absolute inset-0 pointer-events-none"></div>
      </div>
    </div>
  );
}
