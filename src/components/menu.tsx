import { useEffect, useState } from "react";

export default function Menu() {
  const [activeSection, setActiveSection] = useState("pizzas");

  useEffect(() => {
    // Smooth scrolling
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

    // Highlight active section
    const sections = document.querySelectorAll<HTMLElement>("section[id], div[id]");
    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
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
      <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-sm border-b border-zinc-800">
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
        <p className="text-gray-300 text-lg">
          Build your perfect pie or choose from our signature favorites — plus all your other Upper Crust classics.
        </p>
      </div>

      {/* --- PIZZAS --- */}
      <div id="pizzas" className="max-w-4xl mx-auto bg-zinc-900 rounded-xl shadow-lg p-8 mb-16 scroll-mt-28">
        <h3 className="text-2xl font-bold text-yellow-400 mb-4 text-center">
          Build Your Own Pie!
        </h3>
        <p className="text-center mb-6 text-gray-300">
          Hand-tossed or thin crust — made just the way you like it.
        </p>

        <div className="text-center mb-6">
          <p>12" — $13.49 | 14" — $14.99 | 16" — $16.49</p>
          <p className="text-gray-400 text-sm mt-1">
            +$2.30–$2.50 per additional topping
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Gluten Free available in 14" for an additional cost.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 text-left text-gray-200">
          <div>
            <h4 className="font-bold text-yellow-400 mb-2">Sauces</h4>
            <ul className="space-y-1">
              <li>Homemade Marinara</li>
              <li>Creamy Alfredo</li>
              <li>Garlic Sauce</li>
              <li>Sweet Baby Ray’s BBQ</li>
              <li>Franks Red Hot Sauce</li>
              <li>Buffalo Ranch</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-yellow-400 mb-2">Cheese</h4>
            <ul className="space-y-1">
              <li>Mozzarella</li>
              <li>Cheddar</li>
              <li>Monterey Jack</li>
              <li>Romano</li>
              <li>Feta</li>
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-8 text-left text-gray-200">
          <div>
            <h4 className="font-bold text-yellow-400 mb-2">Meats</h4>
            <ul className="space-y-1">
              <li>Italian Sausage</li>
              <li>Pepperoni</li>
              <li>Ground Beef</li>
              <li>Philly Steak</li>
              <li>Meatball</li>
              <li>Chicken</li>
              <li>Bacon</li>
              <li>Ham</li>
              <li>Anchovies</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-yellow-400 mb-2">Veggies & Fruits</h4>
            <ul className="space-y-1">
              <li>Fresh Mushrooms</li>
              <li>White or Red Onion</li>
              <li>Green Peppers</li>
              <li>Black or Green Olives</li>
              <li>Diced Tomatoes</li>
              <li>Banana Peppers</li>
              <li>Jalapeño</li>
              <li>Garlic</li>
              <li>Spinach</li>
              <li>Pineapple</li>
            </ul>
          </div>
        </div>
      </div>

      {/* --- APPETIZERS --- */}
      <div id="appetizers" className="max-w-5xl mx-auto text-center mb-16 scroll-mt-28">
        <h3 className="text-3xl font-bold text-yellow-400 mb-6">Appetizers</h3>
        <div className="grid md:grid-cols-2 gap-8 text-left">
          {[
            "Cheesy Garlic Sticks — $8.49",
            "Mozzarella Sticks — $6.49",
            "Garlic Bites — $5.49–$7.49",
            "Cheese Curds — $6.49",
            "Sampler Platter — $9.49",
            "Chicken Wings — $12.49–$22.49",
          ].map((item) => (
            <div key={item} className="bg-zinc-900 p-5 rounded-lg shadow-md">
              <p className="text-gray-200">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* --- HOAGIES & PASTA --- */}
      <div id="hoagies" className="max-w-5xl mx-auto text-center mb-16 scroll-mt-28">
        <h3 className="text-3xl font-bold text-yellow-400 mb-6">Hoagies & Pasta</h3>
        <div className="grid md:grid-cols-2 gap-8 text-left text-gray-200">
          <div>
            <h4 className="font-bold text-yellow-400 mb-2">Hoagies</h4>
            <ul className="space-y-1">
              <li>Philly Cheesesteak — $9.49</li>
              <li>Italian Cheesesteak — $9.49</li>
              <li>Meatball Hoagie — $9.49</li>
              <li>Grilled Veggie Hoagie — $8.49</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-yellow-400 mb-2">Pasta</h4>
            <ul className="space-y-1">
              <li>Classic Spaghetti — $8.49</li>
              <li>Chicken Parmesan — $10.49</li>
              <li>Spinach & Garlic Primavera — $10.49</li>
            </ul>
          </div>
        </div>
      </div>

      {/* --- BURGERS & SANDWICHES --- */}
      <div id="burgers" className="max-w-5xl mx-auto text-center mb-16 scroll-mt-28">
        <h3 className="text-3xl font-bold text-yellow-400 mb-6">Burgers & Chicken Sandwiches</h3>
        <ul className="space-y-2 text-gray-200 max-w-lg mx-auto text-left">
          <li>Classic Cheeseburger — $8.49</li>
          <li>Texas Burger — $9.49</li>
          <li>Buffalo Burger — $9.49</li>
          <li>Chicken Sandwich — $8.49</li>
          <li>Chicken Parmesan Sandwich — $8.49</li>
          <li>Texas Chicken Sandwich — $9.49</li>
          <li>Buffalo Chicken Sandwich — $9.49</li>
        </ul>
      </div>

      {/* --- SALADS --- */}
      <div id="salads" className="max-w-5xl mx-auto text-center mb-16 scroll-mt-28">
        <h3 className="text-3xl font-bold text-yellow-400 mb-6">Salads</h3>
        <ul className="space-y-2 text-gray-200 max-w-lg mx-auto text-left">
          <li>Garden — $5.99</li>
          <li>Greek — $5.99</li>
          <li>Chef — $5.99</li>
          <li>Chicken — $7.49</li>
        </ul>
      </div>

      {/* --- DESSERTS & DRINKS --- */}
      <div id="desserts" className="max-w-5xl mx-auto text-center scroll-mt-28">
        <h3 className="text-3xl font-bold text-yellow-400 mb-6">Desserts & Drinks</h3>
        <div className="grid md:grid-cols-2 gap-8 text-left text-gray-200">
          <div>
            <h4 className="font-bold text-yellow-400 mb-2">Desserts</h4>
            <ul className="space-y-1">
              <li>Maple Cinnamon Bites — $6.49</li>
              <li>Cannoli’s (1 for $3.25 | 2 for $5.50)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-yellow-400 mb-2">Drinks</h4>
            <ul className="space-y-1">
              <li>Coke, Diet Coke, Sprite, Dr. Pepper, A&W Root Beer, Mountain Dew, or Orange Crush</li>
              <li>2-Liters — $3.49</li>
              <li>Cans — $1.49</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
