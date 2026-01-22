import { useState, useEffect } from "react";

interface LaunchModalProps {
  message?: string;
  imageUrl?: string; // This will receive the LaunchModalImage URL from Firebase
}

export default function LaunchModal({ message, imageUrl }: LaunchModalProps) {
  const [visible, setVisible] = useState(true);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return;
    }

    document.body.style.overflow = "hidden";
    const isSmallScreen = window.innerWidth < 500;

    if (!isSmallScreen) {
      // Increased timer slightly so users can actually see the image
      const timer = setTimeout(() => handleClose(), 5000);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "auto";
      };
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [message]);

  const handleClose = () => {
    setClosing(true);
    document.body.style.overflow = "auto";
    setTimeout(() => setVisible(false), 400);
  };

  if (!visible || !message) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 z-[99999] flex items-center justify-center
        p-4 bg-black/70 backdrop-blur-sm transition-opacity duration-400
        ${closing ? "opacity-0" : "opacity-100"}
      `}
      onClick={handleClose}
    >
      <div
        className="relative bg-yellow-400 text-black font-extrabold
          px-4 py-8 rounded-2xl shadow-2xl text-center
          animate-popup overflow-hidden
          max-w-[90%] sm:max-w-md w-full max-h-[90vh]
          flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-4 text-black text-3xl font-bold
            hover:text-red-700 transition-colors z-10"
          aria-label="Close"
        >
          ×
        </button>

        {/* Firebase Image Rendering */}
        {imageUrl && (
          <div className="w-full mb-4 flex justify-center">
            <img 
              src={imageUrl} 
              alt="Launch Special" 
              className="max-h-[300px] w-auto object-contain rounded-lg border-4 border-black/10 shadow-lg"
            />
          </div>
        )}

        <h2 className="text-xl sm:text-3xl leading-tight uppercase italic mb-2">
          {message}
        </h2>

        <div className="flex items-center gap-2 justify-center mt-2">
        </div>

        <div className="cheese-shine absolute inset-0 pointer-events-none opacity-30"></div>
      </div>
    </div>
  );
}