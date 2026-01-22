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
  
  // Modal Data
  const modalMessage = content?.LaunchModal || "";
  const modalImage = content?.LaunchModalImage; // <--- NEW: Pulls the image field from Firestore
  
  // Logic: Use showModal from Admin, default to true if missing
  const isModalVisible = content?.showModal !== false; 

  return (
    <>
      {/* Dynamic Launch Modal - Now passing the imageUrl prop */}
      {isModalVisible && modalMessage && (
        <LaunchModal 
          message={modalMessage} 
          imageUrl={modalImage} 
        />
      )}

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
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight uppercase italic">
            {heroTitle}
          </h2>

          <p className="text-base md:text-xl mb-10 text-gray-200 leading-relaxed whitespace-pre-line font-medium">
            {heroSubtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/menu"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-extrabold px-8 py-4 rounded-full transition transform hover:scale-105 uppercase text-sm tracking-widest"
            >
              View Menu
            </Link>

            <a
              href="https://uppercrust.hungerrush.com/Order/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-8 py-4 rounded-full transition transform hover:scale-105 animate-pulse-glow uppercase text-sm tracking-widest"
            >
              Order Online
            </a>
          </div>
        </div>

        {/* Google Maps Card */}
        <div className="hidden md:block absolute bottom-6 right-6 z-10 bg-white/95 rounded-2xl shadow-2xl overflow-hidden w-64 lg:w-80 border border-zinc-200 p-1">
          <iframe
            title="Upper Crust Pizza Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2913.840748117967!2d-87.90685762343944!3d43.107849187515025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8805193910f8a927%3A0x6336e1b8b2e5927c!2sUpper%20Crust%20Pizza!5e0!3m2!1sen!2sus!4v1715800000000!5m2!1sen!2sus"
            width="100%"
            height="160"
            style={{ border: 0, borderRadius: '12px' }}
            allowFullScreen
            loading="lazy"
          ></iframe>

          <div className="p-3 text-gray-800 text-center">
            <p className="font-black text-sm uppercase italic">Upper Crust Pizza</p>
            <p className="text-[10px] font-bold text-gray-500">249 E Hampton Ave, Whitefish Bay, WI</p>
          </div>
        </div>
      </section>
    </>
  );
}