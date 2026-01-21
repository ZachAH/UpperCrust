import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase.ts"; 
import LaunchModal from "./LaunchModal";

export default function Hero() {
  const [offset, setOffset] = useState(0);
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --- FETCH DYNAMIC CONTENT ---
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const docRef = doc(db, "site_content", "homepage");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContent(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching hero content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  // --- PARALLAX SCROLL LOGIC ---
  useEffect(() => {
    let ticking = false;
    const updateParallax = () => {
      setOffset(window.scrollY * 0.10);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Data mapping from your Firestore screenshot
  const heroImage = content?.heroImageURL;
  const heroTitle = content?.heroTitle || "Proudly serving Milwaukee’s best hand-tossed pizza — and so much more.";
  const heroSubtitle = content?.heroSubtitle || "Conveniently located where Milwaukee meets Whitefish Bay and Shorewood...";
  const modalMessage = content?.LaunchModal || "";
  
  // Logic: Use showModal from Admin, default to true if missing
  const isModalVisible = content?.showModal !== false; 

  return (
    <>
      {/* Dynamic Launch Modal */}
      {isModalVisible && modalMessage && <LaunchModal message={modalMessage} />}

      {/* Sticky Tap-To-Call (Mobile only) */}
      <a
        href="tel:+14143326820"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 
        bg-red-600 text-white font-semibold px-6 py-3 rounded-full shadow-xl 
        animate-bounce-once sm:hidden"
      >
        📞 Call Now
      </a>

      <section
        className="relative h-screen flex items-center justify-center bg-cover bg-center overflow-hidden hero-bg"
        style={{
          backgroundImage: `url('${heroImage}')`,
          backgroundPositionY: `${offset}px`, 
        }}
      >
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-animated pointer-events-none"></div>
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Hero content */}
        <div
          className={`relative z-10 text-center text-white px-4 max-w-2xl transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100 animate-fadeInUp'}`}
        >
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
            {heroTitle}
          </h2>

          <p className="text-base md:text-xl mb-10 text-gray-200 leading-relaxed whitespace-pre-line">
            {heroSubtitle}
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

        {/* Hardcoded Google Maps Card */}
        <div className="hidden md:block absolute bottom-6 right-6 z-10 bg-white/90 rounded-xl shadow-lg overflow-hidden w-64 lg:w-80 border border-zinc-200">
          <iframe
            title="Upper Crust Pizza Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2914.475373504825!2d-87.9069634!3d43.1190527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880519391d1e6797%3A0x6a05786f059c4b7!2sUpper%20Crust%20Pizza!5e0!3m2!1sen!2sus!4v1700000000000"
            width="100%"
            height="160"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>

          <div className="p-3 text-gray-800 text-center">
            <p className="font-bold text-sm">Upper Crust Pizza</p>
            <p className="text-[11px]">249 East Hampton Avenue, Whitefish Bay, WI</p>
          </div>
        </div>
      </section>
    </>
  );
}