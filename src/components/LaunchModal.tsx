import { useState, useEffect } from "react";

export default function LaunchModal() {
    const [visible, setVisible] = useState(true);
    const [closing, setClosing] = useState(false);

    useEffect(() => {
        document.body.style.overflow = "hidden";

        const timer = setTimeout(() => handleClose(), 5000); // 5 seconds
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
        }, 400); // Match fade-out duration
    };

    if (!visible) return null;

    return (
        <div
            className={`
        fixed inset-0 bg-black/80 backdrop-blur-md z-[99999]
        flex items-center justify-center
        ${closing ? "animate-fadeOut" : "animate-fadeIn"}
      `}
            onClick={handleClose}
        >
            <div
                className="relative bg-yellow-400 text-black font-extrabold
        px-5 py-4 rounded-xl shadow-2xl text-center
        text-lg sm:text-2xl md:text-3xl animate-popup overflow-hidden
        tracking-wide max-w-[90%]"
                onClick={(e) => e.stopPropagation()}
            >
                🍕 New Website — Same Upper Crust!! 🍕

                {/* Close X Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-1.5 right-2 text-black text-xl font-bold hover:text-red-700"
                    aria-label="Close"
                >
                    ×
                </button>

                {/* Shiny cheese sweep */}
                <div className="cheese-shine absolute inset-0 pointer-events-none"></div>
            </div>
        </div>
    );
}
