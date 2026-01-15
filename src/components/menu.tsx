import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { popIn, staggerContainer } from "../animations";
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  where 
} from "firebase/firestore";
import { db } from '../lib/firebase.ts';

/**
 * 1. SUB-COMPONENT: PizzaCard
 * This fixes the "Rules of Hooks" error. Hooks like useInView
 * must be called at the top level of a component, not inside a loop.
 */
function PizzaCard({ pizza, isMobile }: { pizza: any; isMobile: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      variants={popIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
      className={`bg-zinc-900 rounded-xl overflow-hidden shadow-md border transition duration-300 will-change-transform ${
        isInView && isMobile
          ? "border-yellow-400 shadow-yellow-400/30 scale-[1.03] brightness-105 z-20"
          : "border-zinc-800 opacity-95"
      } hover:shadow-yellow-400/30 hover:border-yellow-400`}
    >
      <img
        loading="lazy"
        src={pizza.imageURL}
        alt={pizza.name}
        className="h-44 w-full object-cover"
      />

      <div className="p-5 text-left">
        <h4 className="text-xl font-bold text-yellow-400">{pizza.name}</h4>
        <p className="text-gray-300 text-sm">{pizza.desc}</p>
        <p className="text-gray-400 text-sm mt-1">{pizza.price}</p>

        <div className="mt-4">
          <a
            href="https://uppercrust.hungerrush.com/Order/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition"
          >
            Order • Customize →
          </a>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * 2. MAIN COMPONENT: Menu
 */
export default function Menu() {
  const [activeSection, setActiveSection] = useState("pizzas");
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  
  // Firebase State
  const [pizzas, setPizzas] = useState<any[]>([]);
  const [loadingPizzas, setLoadingPizzas] = useState(true);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // --- FETCH PIZZAS FROM FIRESTORE ---
  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        // Path matches your screenshot: menu > pizzas > items
        const q = query(
          collection(db, "menu", "pizzas", "items"),
          where("available", "==", true),
          orderBy("order", "asc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPizzas(data);
      } catch (err) {
        console.error("Error fetching pizzas:", err);
      } finally {
        setLoadingPizzas(false);
      }
    };
    fetchPizzas();
  }, []);

  // --- SCROLL LOGIC ---
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("section[id], div[id]");
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY + 5) setIsScrollingDown(true);
      else if (currentY < lastScrollY - 5) setIsScrollingDown(false);
      lastScrollY = currentY;

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

  const categories = [
    { name: "Pizzas", id: "pizzas" },
    { name: "Appetizers", id: "appetizers" },
    { name: "Hoagies & Pasta", id: "hoagies" },
    { name: "Burgers & Sandwiches", id: "burgers" },
    { name: "Salads", id: "salads" },
    { name: "Desserts & Drinks", id: "desserts" },
  ];

  return (
    <section id="menu" className="bg-black text-white py-20 px-6">
      {/* Sticky Subnav */}
      <div
        className={`sticky top-16 z-40 bg-black/90 backdrop-blur-sm border-b border-zinc-800
          transition-transform duration-300
          ${isScrollingDown ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-4 py-3 text-sm font-semibold uppercase">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className={`transition-colors ${
                activeSection === cat.id ? "text-yellow-400" : "text-gray-300 hover:text-yellow-400"
              }`}
            >
              {cat.name}
            </a>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-12 mt-8">
        <h2 className="text-4xl font-extrabold text-yellow-500 mb-4">Our Menu</h2>
        <p className="text-gray-300 text-lg mb-8">
          Build your perfect pie or choose from our signature favorites.
        </p>
        <div className="flex justify-center">
          <a
            href="https://uppercrust.hungerrush.com/Order/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-full transition"
          >
            Order Now
          </a>
        </div>
      </div>

      {/* ================= PIZZAS SECTION ================= */}
      <div id="pizzas" className="max-w-5xl mx-auto bg-zinc-900 rounded-xl shadow-lg p-8 mb-24 scroll-mt-28">
        <h3 className="text-3xl font-bold text-yellow-400 mb-8 text-center">
          Specialty Pies
        </h3>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {loadingPizzas ? (
            // Simple Skeleton Loader
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-zinc-800 h-80 rounded-xl animate-pulse" />
            ))
          ) : (
            pizzas.map((pizza) => (
              <PizzaCard key={pizza.id} pizza={pizza} isMobile={isMobile} />
            ))
          )}
        </motion.div>
      </div>

      {/* Note: You can follow the same pattern (Sub-components) 
         for Appetizers, Hoagies, etc., if you move those to Firestore later!
      */}

      {/* ================= APPETIZERS ================= */}
      <section id="appetizers" className="max-w-6xl mx-auto mb-24 scroll-mt-28">
        <h2 className="text-3xl font-extrabold text-yellow-400 text-center mb-10">Appetizers</h2>
        <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto text-gray-300">
           {["Garlic Bread — $4.49", "Cheese Nuggets — $7.99", "Fried Dough Bombs — $5.49"].map(item => (
             <p key={item} className="border-b border-zinc-700 pb-2">{item}</p>
           ))}
        </div>
      </section>

      {/* Rest of sections (Hoagies, Burgers, etc) follow here... */}

    </section>
  );
}