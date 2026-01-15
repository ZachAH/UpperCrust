import { useEffect, useState } from "react";
//import { motion } from "framer-motion";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from '../lib/firebase.ts';
// import { seedSignaturePizzas } from '../lib/seedMenu';

// --- HELPER COMPONENT: LIST ITEM ---
const MenuListItem = ({ item }: { item: any }) => (
  <div className="border-b border-zinc-700 pb-2 flex justify-between group">
    <span className="text-gray-300 group-hover:text-yellow-400 transition-colors">
      {item.name} — {item.price}
    </span>
  </div>
);

export default function Menu() {
  const [activeSection, setActiveSection] = useState("pizzas");
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [menuData, setMenuData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchAllData = async () => {
      // Added "hoagies_pasta" to match your Firestore structure
      const categories = ["signature_pizzas","pizzas", "appetizers", "hoagies", "burgers_chicken", "salads", "desserts_drinks"];
      const fetchedData: any = {};

      for (const cat of categories) {
        const q = query(collection(db, "menu", cat, "items"), orderBy("order", "asc"));
        const snapshot = await getDocs(q);
        fetchedData[cat] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
      setMenuData(fetchedData);
      setLoading(false);
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
        if (rect.top <= 140 && rect.bottom >= 140) setActiveSection(section.id);
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) return <div className="h-screen bg-black flex items-center justify-center text-yellow-500 font-bold">LOADING MENU...</div>;

  return (
    <section id="menu" className="bg-black text-white py-20 px-6">

      {/* Sticky Subnav */}
      <div className={`sticky top-16 z-40 bg-black/90 backdrop-blur-sm border-b border-zinc-800 transition-transform duration-300 ${isScrollingDown ? "-translate-y-full" : "translate-y-0"}`}>
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-4 py-3 text-sm font-semibold uppercase">
          {["pizzas", "appetizers", "hoagies", "burgers", "salads", "desserts"].map((id) => (
            <a key={id} href={`#${id}`} className={`transition-colors ${activeSection === id ? "text-yellow-400" : "text-gray-300 hover:text-yellow-400"}`}>
              {id === "hoagies" ? "HOAGIES & PASTA" : id.toUpperCase()}
            </a>
          ))}
        </div>
      </div>

      {/* <button
        onClick={() => seedSignaturePizzas()}
        className="bg-blue-500 p-2 fixed top-0 left-0 z-[9999]"
      >
        DEBUG: Seed Database
      </button> */}

      {/* ================= HEADER SECTION ================= */}
      <div className="max-w-6xl mx-auto text-center mb-12 mt-8">
        <h2 className="text-4xl font-extrabold text-yellow-500 mb-4">Our Menu</h2>
        <p className="text-gray-300 text-lg mb-8">
          Build your perfect pie or choose from our signature favorites —
          plus all your other Upper Crust classics. All made fresh per order!
        </p>

        <div className="pizza-line-container overflow-hidden rounded-xl w-full mb-8 shadow-lg border border-zinc-800">
          <img
            loading="lazy"
            src="/images/pizza_line.webp"
            alt="Pizza Line"
            className="pizza-line-image w-full h-full object-cover"
          />
        </div>

        <div className="flex justify-center">
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

      {/* ================= PIZZAS ================= */}
          {/* ================= PIZZAS SECTION ================= */}
<div id="pizzas" className="max-w-5xl mx-auto mb-24 scroll-mt-28">
  
  {/* Static "Build Your Own" Header Card */}
  <div className="bg-zinc-900/50 rounded-xl shadow-lg p-8 mb-12 border border-zinc-800 backdrop-blur-sm">
    <h3 className="text-3xl font-extrabold text-yellow-500 mb-4 text-center">
      Build Your Own Pie
    </h3>
    <p className="text-center text-gray-300 mb-6">
      Hand-tossed or thin crust — made just the way you like it.
    </p>
    <div className="text-center space-y-1">
      <p className="text-xl font-bold">12" — $13.49 | 14" — $14.99 | 16" — $16.49</p>
      <p className="text-gray-400 text-sm">+$2.30–$2.50 per additional topping</p>
      <p className="text-gray-400 text-sm italic">Gluten Free available in 14" for $17.99.</p>
    </div>
  </div>

  {/* Signature Label */}
  <div className="flex items-center gap-4 mb-8">
    <div className="h-px bg-zinc-800 flex-grow"></div>
    <h3 className="text-2xl font-black text-yellow-500 uppercase tracking-tighter">
      Signature Specialties
    </h3>
    <div className="h-px bg-zinc-800 flex-grow"></div>
  </div>

  {/* Dynamic Grid */}
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {menuData.signature_pizzas?.map((pizza: any) => (
      <div 
        key={pizza.id} 
        className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-yellow-500/50 transition-all group shadow-xl"
      >
        <div className="relative overflow-hidden h-48">
          <img
            loading="lazy"
            src={pizza.imageURL}
            alt={pizza.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </div>
        <div className="p-6">
          <h4 className="text-xl font-bold text-yellow-400 mb-2">{pizza.name}</h4>
          <p className="text-gray-400 text-xs leading-relaxed mb-4 min-h-[40px]">
            {pizza.desc}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-white font-bold">{pizza.price}</span>
            <a
              href="https://uppercrust.hungerrush.com/Order/"
              target="_blank"
              className="bg-red-600 hover:bg-red-700 text-white text-[10px] uppercase font-black px-4 py-2 rounded-full transition-colors"
            >
              Order Now
            </a>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>


      <div id="pizzas" className="max-w-5xl mx-auto mb-24 scroll-mt-28">
        <h2 className="text-3xl font-bold text-yellow-500 text-center mb-12">More Pizzas</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuData.pizzas?.map((item: any) => (
            <div key={item.id} className="bg-zinc-900 rounded-xl p-5 border border-zinc-800 hover:border-yellow-400 transition">
              {item.imageURL && <img src={item.imageURL} className="w-full h-40 object-cover rounded-lg mb-4" alt={item.name} />}
              <h4 className="text-xl font-bold text-yellow-400">{item.name}</h4>
              <p className="text-gray-300 text-sm">{item.desc}</p>
              <p className="text-gray-400 text-sm mt-2 font-semibold">{item.price}</p>
              <a href="https://uppercrust.hungerrush.com/Order/" target="_blank" className="mt-4 inline-block bg-red-600 text-white px-4 py-2 rounded-full text-xs font-bold">Order • Customize →</a>
            </div>
          ))}
        </div>
      </div>

      {/* ================= APPETIZERS ================= */}
      <section id="appetizers" className="max-w-4xl mx-auto mb-24 scroll-mt-28">
        <h2 className="text-3xl font-extrabold text-yellow-400 text-center mb-10">Appetizers</h2>
        <div className="relative rounded-xl overflow-hidden mb-12 border border-zinc-800">
          <img src="/images/appetizers/sticks.webp" className="w-full h-64 object-cover" alt="Appetizers" />
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4">
            <h3 className="text-2xl font-bold text-yellow-400">Cheesy Garlic Sticks</h3>
            <p className="text-white">$9.99</p>
            <a href="https://uppercrust.hungerrush.com/Order/" className="mt-4 bg-red-600 px-6 py-2 rounded-full text-sm font-bold">Order • Customize →</a>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-4">
          {menuData.appetizers?.map((item: any) => (
            <MenuListItem key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* ================= HOAGIES & PASTA ================= */}
<div id="hoagies" className="max-w-5xl mx-auto mb-24 scroll-mt-28">
  <div className="relative z-0 hot-glow rounded-xl w-full md:w-[80%] mx-auto mb-16 p-10 bg-zinc-900 border border-zinc-700 text-center">
    <div className="steam steam-1"></div><div className="steam steam-2"></div>
    <h4 className="text-3xl font-extrabold text-yellow-400">Hoagies & Pasta</h4>
    <p className="text-gray-300 italic">Hot and Savory. Made Fresh to order!</p>
  </div>

  <div className="grid sm:grid-cols-2 gap-10 text-left text-gray-300 text-sm px-4">
    <div>
      <h4 className="text-lg font-bold text-yellow-400 mb-4 uppercase tracking-widest">Hoagies</h4>
      <div className="space-y-2">
        {menuData.hoagies?.filter((i: any) => i.subcategory === "Hoagies").map((item: any) => (
          <MenuListItem key={item.id} item={item} />
        ))}
      </div>
    </div>
    <div>
      <h4 className="text-lg font-bold text-yellow-400 mb-4 uppercase tracking-widest">Pasta</h4>
      <div className="space-y-2">
        {menuData.hoagies?.filter((i: any) => i.subcategory === "Pasta").map((item: any) => (
          <MenuListItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  </div>
</div>

      {/* ================= BURGERS & CHICKEN ================= */}
      <div id="burgers" className="max-w-5xl mx-auto mb-24 scroll-mt-28">
        <div className="relative z-0 hot-glow rounded-xl w-full md:w-[80%] mx-auto mb-16 p-10 bg-zinc-900 border border-zinc-700 text-center">
          <div className="steam steam-1"></div><div className="steam steam-2"></div>
          <h4 className="text-3xl font-extrabold text-yellow-400">Burgers & Chicken Sandwiches</h4>
          <p className="text-gray-300 italic">Fresh off the grill & stacked with flavor.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-4">
          <div>
            <h4 className="text-lg font-bold text-yellow-400 mb-4 uppercase">Burgers</h4>
            {menuData.burgers_chicken?.filter((i: any) => i.subcategory === "Burgers").map((item: any) => (
              <MenuListItem key={item.id} item={item} />
            ))}
          </div>
          <div>
            <h4 className="text-lg font-bold text-yellow-400 mb-4 uppercase">Chicken Sandwiches</h4>
            {menuData.burgers_chicken?.filter((i: any) => i.subcategory === "Chicken Sandwiches").map((item: any) => (
              <MenuListItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* ================= SALADS ================= */}
      <div id="salads" className="max-w-4xl mx-auto mb-24 scroll-mt-28">
        <div className="relative z-0 fresh-glow rounded-xl w-full md:w-[80%] mx-auto mb-12 p-10 bg-zinc-900 border border-zinc-700 text-center">
          <div className="mist mist-1"></div><div className="leaf-sparkle sparkle-1"></div>
          <h4 className="text-3xl font-extrabold text-yellow-400">Salads</h4>
          <p className="text-gray-300 italic">Crisp. Cool. Refreshing.</p>
        </div>
        <div className="max-w-xl mx-auto space-y-4">
          {menuData.salads?.map((item: any) => (
            <MenuListItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* ================= DESSERTS & DRINKS ================= */}
      <div id="desserts" className="max-w-5xl mx-auto mb-32 scroll-mt-28">
        <div className="relative z-0 dessert-glow rounded-xl w-full md:w-[80%] mx-auto mb-12 p-10 bg-zinc-900 border border-zinc-700 text-center">
          <div className="drip drip-1"></div>
          <h4 className="text-3xl font-extrabold text-yellow-400">Desserts & Drinks</h4>
          <p className="text-gray-300 italic">Sweet treats & chilled drinks.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-4">
          <div>
            <h4 className="text-lg font-bold text-yellow-400 mb-4 uppercase">Desserts</h4>
            {menuData.desserts_drinks?.filter((i: any) => i.subcategory === "Desserts").map((item: any) => (
              <MenuListItem key={item.id} item={item} />
            ))}
          </div>
          <div>
            <h4 className="text-lg font-bold text-yellow-400 mb-4 uppercase">Drinks</h4>
            {menuData.desserts_drinks?.filter((i: any) => i.subcategory === "Drinks").map((item: any) => (
              <MenuListItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}