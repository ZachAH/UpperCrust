import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Hero() {
  const [offset, setOffset] = useState(0);

  // Parallax scroll
  useEffect(() => {
    const handleScroll = () => setOffset(window.scrollY * 0.10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Sticky Tap-To-Call (Mobile only) */}
      <a
        href="tel:+14144510900"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 
        bg-red-600 text-white font-semibold px-6 py-3 rounded-full shadow-xl 
        animate-bounce-once sm:hidden"
      >
        📞 Call Now
      </a>

      <section
        className="relative h-screen flex items-center justify-center bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: "url('/pizza-hero.webp')",
          backgroundPositionY: `${offset}px`, // parallax effect
        }}
      >
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-animated pointer-events-none"></div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Hero text */}
        <div
          className="relative z-10 text-center text-white px-4 max-w-2xl 
          opacity-0 animate-fadeInUp"
        >
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
            Proudly serving Milwaukee’s best hand-tossed pizza — and so much more.
          </h2>

          <p className="text-base md:text-xl mb-10 text-gray-200 leading-relaxed">
            Conveniently located where Milwaukee meets Whitefish Bay and Shorewood,
            Upper Crust Pizza has been a local favorite for years. From our signature
            pizzas and burgers to pastas, salads, and appetizers made fresh daily —
            every meal is served with a smile and a taste of home.
            <br />
            <br />
            Come hungry, leave happy — that’s the Upper Crust way.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/menu"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 rounded-full transition"
            >
              View Menu
            </Link>

            <a
              href="https://uppercrust.hungerrush.com/Order/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-full transition animate-pulse-glow"
            >
              Order Now
            </a>
          </div>
        </div>

        {/* Google Maps card — HIDDEN ON MOBILE */}
        <div className="hidden md:block absolute bottom-6 right-6 z-10 bg-white/90 rounded-xl shadow-lg overflow-hidden w-64 lg:w-80">
          <iframe
            title="Upper Crust Pizza Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d373415.760947372!2d-88.43940570951086!3d43.01384843342477!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88051eee913a07db%3A0xba4fc47c57ac02c7!2sUpper%20Crust%20Pizza!5e0!3m2!1sen!2sus!4v1762981273321!5m2!1sen!2sus"
            width="100%"
            height="160"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            className="border-0"
          ></iframe>

          <div className="p-3 text-gray-800 text-center">
            <p className="font-semibold">Upper Crust Pizza</p>
            <p className="text-sm">249 East Hampton Avenue, Whitefish Bay, WI</p>
          </div>
        </div>
      </section>
    </>
  );
}
