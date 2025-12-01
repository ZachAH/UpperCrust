import { useState, useEffect } from "react";

export default function LaunchModal() {
  const [visible, setVisible] = useState(true);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => handleClose(), 4500); // 4.5s then auto-close
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleClose = () => {
    setClosing(true);
    document.body.style.overflow = "auto";

    setTimeout(() => {
      setVisible(false);
    }, 400); // Matches fade-out timing
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="launch-modal-title"
      className={`fixed inset-0 z-[99999] flex items-center justify-center
        bg-black/70 backdrop-blur-sm transition-opacity
        ${closing ? "opacity-0" : "opacity-100"}
      `}
      onClick={handleClose}
    >
      <div
        className="relative bg-yellow-400 text-black font-extrabold
          px-6 py-5 rounded-xl shadow-2xl text-center
          text-xl sm:text-2xl md:text-3xl
          animate-popup overflow-hidden max-w-[90%] w-fit"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title: Helps screen readers identify the message */}
        <h2 id="launch-modal-title" className="mb-1">
          🍕 New Website — Same Upper Crust!! 🍕
        </h2>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-3 text-black text-2xl font-bold
            hover:text-red-700 focus:outline-none"
          aria-label="Close popup"
        >
          ×
        </button>

        {/* Shine Effect */}
        <div className="cheese-shine absolute inset-0 pointer-events-none"></div>
      </div>
    </div>
  );
}
