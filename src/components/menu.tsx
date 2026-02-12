import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase.ts";
import { motion } from "framer-motion";
import { popIn, staggerContainer } from "@/animations.ts";

// --- UPDATED HELPER COMPONENT: LIST ITEM ---
const MenuListItem = ({ item }: { item: any }) => (
  <motion.div
    variants={popIn}
    className="border-b border-zinc-800 pb-3 mb-4 flex items-center gap-4 group transition-all duration-300"
  >
    {item.imageURL && item.imageURL.trim() !== "" && (
      <div className="relative flex-shrink-0">
        <img
          src={item.imageURL}
          alt={item.name}
          className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover border border-zinc-700 group-hover:border-yellow-500/50 transition-colors duration-300"
        />
      </div>
    )}

    <div className="flex-grow flex flex-col justify-center">
      <div className="flex justify-between items-baseline">
        <span className="text-gray-200 font-bold group-hover:text-yellow-400 transition-colors uppercase tracking-tight text-sm md:text-base">
          {item.name}
        </span>
        <span className="text-red-500 font-black text-xs md:text-sm ml-4 whitespace-nowrap">
          {item.price}
        </span>
      </div>

      {item.desc && (
        <p className="text-zinc-500 text-[10px] md:text-[11px] leading-snug mt-1 max-w-[95%] italic line-clamp-2">
          {item.desc}
        </p>
      )}
    </div>
  </motion.div>
);

export default function Menu() {
  const [activeSection, setActiveSection] = useState("pizzas");
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [menuData, setMenuData] = useState<any>({});
  // New state for the dynamic page headers/images
  const [pageContent, setPageContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 1. Fetch Dynamic Page Layout (Titles/Images)
        const pageSnap = await getDoc(doc(db, "site_content", "menu-page"));
        if (pageSnap.exists()) {
          setPageContent(pageSnap.data());
        }

        // 2. Fetch Menu Items
        const categories = [
          "signature_pizzas",
          "pizzas",
          "appetizers",
          "hoagies",
          "burgers_chicken",
          "salads",
          "desserts_drinks",
        ];
        const fetchedData: any = {};

        for (const cat of categories) {
          const q = query(
            collection(db, "menu", cat, "items"),
            orderBy("order", "asc")
          );
          const snapshot = await getDocs(q);
          fetchedData[cat] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        }

        setMenuData(fetchedData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // --- SCROLL LOGIC ---
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrollingDown(currentY > lastScrollY + 5);
      lastScrollY = currentY;

      const sections = document.querySelectorAll("section[id], div[id]");
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 140 && rect.bottom >= 140) {
          setActiveSection(section.id);
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-yellow-500 font-bold tracking-widest uppercase">
        Loading Fresh Ingredients...
      </div>
    );
  }

  const onlyAvailable = (item: any) => item.available ?? true;

  return (
    <section id="menu" className="bg-black text-white py-20 px-6">
      {/* Sticky Subnav */}
      <div
        className={`sticky top-16 z-40 bg-black/95 backdrop-blur-md border-b border-zinc-800 transition-transform duration-300 ${isScrollingDown ? "-translate-y-full" : "translate-y-0"
          }`}
      >
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-4 py-4 text-[10px] md:text-xs font-black uppercase tracking-widest">
          {["pizzas", "appetizers", "hoagies", "burgers", "salads", "desserts"].map(
            (id) => (
              <a
                key={id}
                href={`#${id}`}
                className={`transition-colors ${activeSection === id
                  ? "text-yellow-400"
                  : "text-gray-400 hover:text-yellow-400"
                  }`}
              >
                {id === "hoagies" ? "HOAGIES & PASTA" : id.toUpperCase()}
              </a>
            )
          )}
        </div>
      </div>

      {/* Sticky Order Now Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://uppercrust.hungerrush.com/Order/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest px-10 py-4 rounded-full transition shadow-2xl shadow-red-900/50 hover:scale-105 transform duration-300 block"
        >
          Order Now
        </a>
      </div>

      {/* HEADER SECTION - NOW DYNAMIC */}
      <div className="max-w-6xl mx-auto text-center mb-16 mt-8">
        <h2 className="text-5xl font-black text-yellow-500 mb-4 tracking-tighter uppercase italic">
          {pageContent?.menuTitle || "Our Menu"}
        </h2>
        <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          {pageContent?.menuSubtitle}
        </p>

        <div className="pizza-line-container overflow-hidden rounded-[40px] w-full mb-10 shadow-2xl border border-zinc-800">
          <img
            loading="lazy"
            src={pageContent?.menuImageURL || "/images/pizza_line.webp"}
            alt="Upper Crust Prep"
            className="pizza-line-image w-full h-[300px] md:h-[450px] object-cover"
          />
        </div>
      </div>

      {/* PIZZAS */}
      <div id="pizzas" className="max-w-5xl mx-auto mb-24 scroll-mt-28">

        {/* BUILD YOUR OWN PIE - NOW DYNAMIC */}
        <div className="bg-zinc-900/30 rounded-[40px] p-10 mb-16 border border-zinc-800 backdrop-blur-sm text-center">
          <h3 className="text-3xl font-black text-yellow-500 mb-4 uppercase italic">
            {pageContent?.buildTitle || "Build Your Own Pie"}
          </h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            {pageContent?.buildSubtitle}
          </p>
          <div className="space-y-2">
            <p className="text-xl font-black text-white">
              {pageContent?.buildPricing}
            </p>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
              {pageContent?.buildPricingSubtext}
            </p>
            <p className="text-red-500 text-xs font-black italic mt-2">
              {pageContent?.BuildPricingRedText}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 mb-12">
          <div className="h-px bg-zinc-800 flex-grow" />
          <h3 className="text-2xl font-black text-yellow-500 uppercase italic tracking-tighter">Signature Pizzas</h3>
          <div className="h-px bg-zinc-800 flex-grow" />
        </div>

        {/* Signature Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuData.signature_pizzas?.filter(onlyAvailable).map((pizza: any) => (
            <div key={pizza.id} className="bg-zinc-900/50 rounded-[32px] overflow-hidden border border-zinc-800 group transition-all duration-500 hover:border-yellow-500/40">
              {pizza.imageURL && (
                <div className="relative overflow-hidden h-52">
                  <img
                    src={pizza.imageURL}
                    alt={pizza.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              )}

              <div className="p-7">
                <h4 className="text-xl font-black text-yellow-400 mb-2 uppercase tracking-tight">{pizza.name}</h4>
                <p className="text-zinc-400 text-xs leading-relaxed mb-6 min-h-[48px] italic">{pizza.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-white font-black">{pizza.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* APPETIZERS */}
      <section id="appetizers" className="max-w-4xl mx-auto mb-24 scroll-mt-28">
        <h2 className="text-3xl font-black text-yellow-400 text-center mb-12 uppercase italic tracking-tighter">Appetizers</h2>
        <div className="grid sm:grid-cols-2 gap-x-16 gap-y-2">
          {menuData.appetizers?.filter(onlyAvailable).map((item: any) => (
            <MenuListItem key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* HOAGIES & PASTA */}
      <div id="hoagies" className="max-w-5xl mx-auto mb-24 scroll-mt-28">
        <h4 className="text-3xl font-black text-yellow-400 text-center mb-12 uppercase italic tracking-tighter">Hoagies & Pasta</h4>
        <div className="grid sm:grid-cols-2 gap-x-16 gap-y-12 px-4">
          <div>
            <h4 className="text-sm font-black text-zinc-600 mb-6 uppercase tracking-[0.2em] border-l-2 border-red-600 pl-4">Hoagies</h4>
            <div className="space-y-2">
              {menuData.hoagies?.filter(onlyAvailable).filter((i: any) => i.subcategory === "Hoagies").map((item: any) => (
                <MenuListItem key={item.id} item={item} />
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-black text-zinc-600 mb-6 uppercase tracking-[0.2em] border-l-2 border-red-600 pl-4">Pasta</h4>
            <div className="space-y-2">
              {menuData.hoagies?.filter(onlyAvailable).filter((i: any) => i.subcategory === "Pasta").map((item: any) => (
                <MenuListItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BURGERS & CHICKEN */}
      <div id="burgers" className="max-w-5xl mx-auto mb-24 scroll-mt-28">
        <h4 className="text-3xl font-black text-yellow-400 text-center mb-12 uppercase italic tracking-tighter">Burgers & Chicken</h4>
        <div className="grid sm:grid-cols-2 gap-x-16 gap-y-12 px-4">
          <div>
            <h4 className="text-sm font-black text-zinc-600 mb-6 uppercase tracking-[0.2em] border-l-2 border-red-600 pl-4">Burgers</h4>
            {menuData.burgers_chicken?.filter(onlyAvailable).filter((i: any) => i.subcategory === "Burgers").map((item: any) => (
              <MenuListItem key={item.id} item={item} />
            ))}
          </div>
          <div>
            <h4 className="text-sm font-black text-zinc-600 mb-6 uppercase tracking-[0.2em] border-l-2 border-red-600 pl-4">Chicken Sandwiches</h4>
            {menuData.burgers_chicken?.filter(onlyAvailable).filter((i: any) => i.subcategory === "Chicken Sandwiches").map((item: any) => (
              <MenuListItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* SALADS */}
      <div id="salads" className="max-w-4xl mx-auto mb-24 scroll-mt-28">
        <h4 className="text-3xl font-black text-yellow-400 text-center mb-12 uppercase italic tracking-tighter">Salads</h4>
        <div className="max-w-2xl mx-auto">
          {menuData.salads?.filter(onlyAvailable).map((item: any) => (
            <MenuListItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* DESSERTS & DRINKS */}
      <div id="desserts" className="max-w-5xl mx-auto mb-32 scroll-mt-28">
        <h4 className="text-3xl font-black text-yellow-400 text-center mb-12 uppercase italic tracking-tighter">Desserts & Drinks</h4>
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="grid sm:grid-cols-2 gap-x-16 gap-y-12 px-4">
          <motion.div variants={popIn}>
            <h4 className="text-sm font-black text-zinc-600 mb-6 uppercase tracking-[0.2em] border-l-2 border-red-600 pl-4">Desserts</h4>
            {menuData.desserts_drinks?.filter(onlyAvailable).filter((i: any) => i.subcategory === "Desserts").map((item: any) => (
              <MenuListItem key={item.id} item={item} />
            ))}
          </motion.div>
          <motion.div variants={popIn}>
            <h4 className="text-sm font-black text-zinc-600 mb-6 uppercase tracking-[0.2em] border-l-2 border-red-600 pl-4">Drinks</h4>
            {menuData.desserts_drinks?.filter(onlyAvailable).filter((i: any) => i.subcategory === "Drinks").map((item: any) => (
              <MenuListItem key={item.id} item={item} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}