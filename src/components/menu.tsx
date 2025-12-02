import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { popIn } from "../animations";
import { staggerContainer } from "../animations";
import { useInView } from "framer-motion";

export default function Menu() {
  const [activeSection, setActiveSection] = useState("pizzas");
  const [isScrollingDown, setIsScrollingDown] = useState(false);

  // Smooth scroll + active nav tracker + hide-on-scroll
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("section[id], div[id]");
    let ticking = false;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;

      // Hide sticky nav when scrolling down, show when scrolling up
      if (currentY > lastScrollY + 5) {
        setIsScrollingDown(true);
      } else if (currentY < lastScrollY - 5) {
        setIsScrollingDown(false);
      }
      lastScrollY = currentY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          sections.forEach((section) => {
            const rect = section.getBoundingClientRect();

            if (rect.top <= 140 && rect.bottom >= 140) {
              setActiveSection(section.id);
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    // Smooth scroll behavior for nav links
    const links = document.querySelectorAll<HTMLAnchorElement>("a[href^='#']");
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const href = link.getAttribute("href");
        if (!href) return;
        const target = document.querySelector(href) as HTMLElement | null;
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 120,
            behavior: "smooth",
          });
        }
      });
    });

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
              className={`transition-colors ${activeSection === cat.id
                ? "text-yellow-400"
                : "text-gray-300 hover:text-yellow-400"
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
          Build your perfect pie or choose from our signature favorites —
          plus all your other Upper Crust classics. All made fresh per order!
        </p>

        {/* Cinematic Pizza Line Zoom-Out */}
        <div className="pizza-line-container overflow-hidden rounded-xl w-full mb-8 shadow-lg border border-zinc-800">
          <img
            loading="lazy"
            src="/images/pizza_line.webp"
            alt="Pizza Line"
            className="pizza-line-image w-full h-full object-cover"
          />
        </div>

        {/* Order CTA */}
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
      <div id="pizzas" className="max-w-5xl mx-auto bg-zinc-900 rounded-xl shadow-lg p-8 mb-24 scroll-mt-28">
        <h3 className="text-3xl font-bold text-yellow-400 mb-8 text-center">
          Build Your Own Pie
        </h3>
        <p className="text-center text-gray-300 mb-6">
          Hand-tossed or thin crust — made just the way you like it.
        </p>

        {/* Base Pricing */}
        <div className="text-center mb-10">
          <p>12" — $13.49 | 14" — $14.99 | 16" — $16.49</p>
          <p className="text-gray-400 text-sm mt-1">
            +$2.30–$2.50 per additional topping
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Gluten Free available in 14" for $17.99.
          </p>
        </div>

        {/* Signature Pies – Stagger Animation */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {[
            {
              name: "Super",
              desc: "Italian Sausage, Pepperoni, Anchovies, Mushrooms, Onions, Green Peppers, Black Olives",
              price: "$18.49–$36.99",
              img: "/images/pizzas/super.webp",
            },
            {
              name: "Deluxe",
              desc: "Sausage, Pepperoni, Mushrooms, Onions, and Green Peppers.",
              price: "$19.99–$36.99",
              img: "/images/pizzas/Deluxe.webp",
            },
            {
              name: "Carne",
              desc: "Sausage, Pepperoni, Bacon, and Ham.",
              price: "$19.99–$39.99",
              img: "/images/pizzas/carne.jpg",
            },
            {
              name: "Classic Pepperoni",
              desc: "Pepperoni and Mozzarella.",
              price: "$18.49–$38.99",
              img: "/images/pizzas/pepperoni.webp",
            },
            {
              name: "CBR",
              desc: "Chicken, Bacon, Mozzarella, with ranch drizzle.",
              price: "$19.49–$39.99",
              img: "/images/pizzas/CBR.webp",
            },
            {
              name: "Veggie",
              desc: "Onions, Peppers, Olives, and Mushrooms.",
              price: "$19.49–$39.99",
              img: "/images/pizzas/veggie.webp",
            },
          ].map((pizza) => {
            const ref = useRef(null);
            const inView = useInView(ref, { amount: 0.55 });
            const isMobile =
              typeof window !== "undefined" && window.innerWidth < 768;

            return (
              <motion.div
                ref={ref}
                key={pizza.name}
                variants={popIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false }}
                className={`bg-zinc-900 rounded-xl overflow-hidden shadow-md border transition duration-300 will-change-transform ${inView && isMobile
                  ? "border-yellow-400 shadow-yellow-400/30 scale-[1.03] brightness-105 z-20"
                  : "border-zinc-800 opacity-95"
                  } hover:shadow-yellow-400/30 hover:border-yellow-400`}
              >
                <img
                  loading="lazy"
                  src={pizza.img}
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
          })}
        </motion.div>
      </div>

      {/* ================= APPETIZERS ================= */}
      <section id="appetizers" className="max-w-6xl mx-auto mb-24 scroll-mt-28">
        <h2 className="text-3xl font-extrabold text-yellow-400 text-center mb-10 tracking-wider">
          Appetizers
        </h2>

        {/* Feature Item */}
        <motion.div
          variants={popIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="relative rounded-md overflow-hidden shadow-lg"
        >
          <img
            loading="lazy"
            src="/images/appetizers/sticks.webp"
            alt="Cheesy Garlic Sticks appetizer from Upper Crust Pizza"
            className="w-full h-64 md:h-80 object-cover brightness-90"
          />

          <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 text-center">
            <h3 className="text-xl font-bold text-yellow-400">
              Cheesy Garlic Sticks
            </h3>
            <p className="text-gray-200 text-sm">$9.99</p>

            <a
              href="https://uppercrust.hungerrush.com/Order/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
            >
              Order • Customize →
            </a>
          </div>
        </motion.div>

        {/* Quick List */}
        <div className="mt-12 text-left text-gray-300 space-y-2 max-w-lg mx-auto">
          {[
            "Fried Dough Bombs — S $5.49 | M $6.49 | L $7.49",
            "Garlic Bread — $4.49",
            "Cheesy Garlic Bread — $5.99",
            "Pizza Bread (2 toppings) — $9.99",
            "French Fries — S $4.99 | L $6.99",
            "Tater Tots — S $4.99 | L $6.99",
            "Cheese Nuggets — $7.99",
            "Jalapeño Poppers — $7.99",
            "Sampler Platter — S $10.99 | L $13.99",
            "Chicken Tenders — 4pc $7.49 | 8pc $13.99",
          ].map((item) => (
            <p key={item} className="border-b border-zinc-700 pb-2">
              {item}
            </p>
          ))}
        </div>

        <p className="text-gray-500 mt-6 text-center text-sm italic">
          Wing Sauces: Mango Habanero, Frank’s Hot, Nashville, Buffalo Ranch,
          BBQ, Kickin’ Bourbon, Lemon Pepper.
        </p>
      </section>


      {/* ================= HOAGIES & PASTA ================= */}
      <div id="hoagies" className="max-w-6xl mx-auto mb-24 scroll-mt-28">

        {/* Feature Hero */}
        <div className="relative z-0 hot-glow rounded-xl w-full md:w-[80%] mx-auto mb-16 p-10 bg-zinc-900 shadow-lg border border-zinc-700 overflow-visible">

          <div className="steam steam-1"></div>
          <div className="steam steam-2"></div>
          <div className="steam steam-3"></div>

          <div className="text-center relative z-10">
            <h4 className="text-3xl font-extrabold text-yellow-400 drop-shadow-lg mb-2">
              Hoagies & Pasta
            </h4>
            <p className="text-gray-300 text-lg italic">
              Hot and Savory. Made Fresh to order!
            </p>
          </div>
        </div>

        {/* Quick List */}
        <div className="grid sm:grid-cols-2 gap-10 text-left text-gray-300 text-sm">
          <div>
            <h4 className="text-lg font-bold text-yellow-400 mb-2">Hoagies</h4>
            <ul className="space-y-2">
              <li className="border-b border-zinc-700 pb-2">Philly Cheesesteak — $9.99</li>
              <li className="border-b border-zinc-700 pb-2">Italian Chicken Cheesesteak — $9.99</li>
              <li className="border-b border-zinc-700 pb-2">Meatball — $9.99</li>
              <li className="border-b border-zinc-700 pb-2">Sausage Hoagie — $9.99</li>
              <li className="border-b border-zinc-700 pb-2">Grilled Veggie — $8.99</li>
              <li className="border-b border-zinc-700 pb-2">BLT Hoagie — $9.99</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold text-yellow-400 mb-2">Pasta</h4>
            <ul className="space-y-2">
              <li className="border-b border-zinc-700 pb-2">Classic Spaghetti — $8.99</li>
              <li className="border-b border-zinc-700 pb-2">Chicken Alfredo — $10.99</li>
              <li className="border-b border-zinc-700 pb-2">Chicken Parm — $11.99</li>
              <li className="border-b border-zinc-700 pb-2">Spinach & Garlic — $10.99</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ================= BURGERS & CHICKEN ================= */}
      <div id="burgers" className="max-w-6xl mx-auto mb-24 scroll-mt-28">

        <div className="relative z-0 hot-glow rounded-xl w-full md:w-[80%] mx-auto mb-16 p-10 bg-zinc-900 shadow-lg border border-zinc-700 overflow-visible">
          <div className="steam steam-1"></div>
          <div className="steam steam-2"></div>
          <div className="steam steam-3"></div>

          <div className="text-center relative z-10">
            <h4 className="text-3xl font-extrabold text-yellow-400 drop-shadow-lg mb-2">
              Burgers & Chicken Sandwiches
            </h4>
            <p className="text-gray-300 text-lg italic">
              Fresh off the grill & stacked with flavor.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-10 text-left text-gray-300 text-sm">
          <div>
            <h4 className="text-lg font-bold text-yellow-400 mb-2">Burgers</h4>
            <ul className="space-y-2">
              <li className="border-b border-zinc-700 pb-2">Classic 1/4 lb — $8.99</li>
              <li className="border-b border-zinc-700 pb-2">Texas — $9.99</li>
              <li className="border-b border-zinc-700 pb-2">Buffalo Burger — $9.99</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold text-yellow-400 mb-2">Chicken Sandwiches</h4>
            <ul className="space-y-2">
              <li className="border-b border-zinc-700 pb-2">Classic Chicken — $8.99</li>
              <li className="border-b border-zinc-700 pb-2">Chicken Parm — $8.99</li>
              <li className="border-b border-zinc-700 pb-2">Texas Chicken — $9.99</li>
              <li className="border-b border-zinc-700 pb-2">Buffalo Chicken — $9.99</li>
              <li className="border-b border-zinc-700 pb-2">Nashville Chicken — $9.99</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ================= SALADS ================= */}
      <div id="salads" className="max-w-6xl mx-auto mb-24 scroll-mt-28">

        <div className="relative z-0 fresh-glow rounded-xl w-full md:w-[80%] mx-auto mb-12 p-10 bg-zinc-900 shadow-lg border border-zinc-700 overflow-visible">

          <div className="mist mist-1"></div>
          <div className="mist mist-2"></div>

          {/* 3 Leaves */}
          <div className="leaf-sparkle sparkle-1"></div>
          <div className="leaf-sparkle sparkle-2"></div>
          <div className="leaf-sparkle sparkle-3"></div>

          <div className="text-center relative z-10">
            <h4 className="text-3xl font-extrabold text-yellow-400 drop-shadow-lg mb-2">
              Salads
            </h4>
            <p className="text-gray-300 text-lg italic">
              Crisp. Cool. Refreshing.
            </p>
          </div>
        </div>

        <div className="max-w-lg mx-auto text-left text-gray-300 space-y-2">
          {["Garden — $6.99", "Greek — $6.99", "Chef — $7.99", "Grilled Chicken — $7.99"].map(
            (item) => (
              <p key={item} className="border-b border-zinc-700 pb-2">
                {item}
              </p>
            )
          )}
        </div>
      </div>

      {/* ================= DESSERTS & DRINKS ================= */}
      <div id="desserts" className="max-w-6xl mx-auto mb-32 scroll-mt-28">

        <div className="relative z-0 dessert-glow rounded-xl w-full md:w-[80%] mx-auto mb-12 p-10 bg-zinc-900 shadow-lg border border-zinc-700 overflow-visible">

          <div className="dessert-sparkle sparkle-d1"></div>
          <div className="dessert-sparkle sparkle-d2"></div>

          <div className="drip drip-1"></div>
          <div className="drip drip-2"></div>

          <div className="text-center relative z-10">
            <h4 className="text-3xl font-extrabold text-yellow-400 drop-shadow-lg mb-2">
              Desserts & Drinks
            </h4>
            <p className="text-gray-300 text-lg italic">
              Sweet treats & chilled drinks.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-10 text-left text-gray-300 text-sm">
          <div>
            <h4 className="text-lg font-bold text-yellow-400 mb-2">Desserts</h4>
            <ul className="space-y-2">
              <li className="border-b border-zinc-700 pb-2">Maple Cinnamon Bites — $6.49</li>
              <li className="border-b border-zinc-700 pb-2">Cannolis — $3.50</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-yellow-400 mb-2">Drinks</h4>
            <ul className="space-y-2">
              <li className="border-b border-zinc-700 pb-2">
                Coke, Diet Coke, Sprite, Lemonade, Dr. Pepper, Root Beer
              </li>
              <li className="border-b border-zinc-700 pb-2">2-Liters — $3.99</li>
              <li className="border-b border-zinc-700 pb-2">Cans — $1.49</li>
              <li className="border-b border-zinc-700 pb-2">Water — $1.49</li>
            </ul>
          </div>
        </div>
      </div>

      {/* End CTA */}
      <div className="max-w-6xl mx-auto text-center mt-10">
        <a
          href="https://uppercrust.hungerrush.com/Order/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-10 py-4 rounded-full transition text-lg animate-soft-glow"
        >
          Order Online Now
        </a>
      </div>
    </section >
  );
}
