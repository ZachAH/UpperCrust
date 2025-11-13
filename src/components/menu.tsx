import { useEffect, useState } from "react";

export default function Menu() {
  const [activeSection, setActiveSection] = useState("pizzas");

  useEffect(() => {
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
      <div id="pizzas" className="max-w-5xl mx-auto bg-zinc-900 rounded-xl shadow-lg p-8 mb-16 scroll-mt-28">
        <h3 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
          Build Your Own Pie
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
          <div className="mt-10 bg-zinc-800 rounded-lg p-6 text-center border border-zinc-700">
            <h4 className="text-2xl font-bold text-yellow-400 mb-3">
              Make it a Double Decker
            </h4>
            <p className="text-gray-200 mb-2">
              Two layers of crust, cheese, and toppings — the ultimate Upper Crust upgrade.
            </p>

            <div className="flex justify-center mt-4">
              <table className="text-gray-300 text-sm md:text-base">
                <thead>
                  <tr className="text-yellow-400">
                    <th className="px-4">Size</th>
                    <th className="px-4">12"</th>
                    <th className="px-4">14"</th>
                    <th className="px-4">16"</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-1 font-semibold">Price</td>
                    <td className="px-4 py-1">$21.49</td>
                    <td className="px-4 py-1">$24.99</td>
                    <td className="px-4 py-1">$27.49</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-1 font-semibold">Add. Toppings</td>
                    <td className="px-4 py-1">$4.10</td>
                    <td className="px-4 py-1">$4.30</td>
                    <td className="px-4 py-1">$4.50</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-gray-400 text-xs mt-3 italic">
              *Cost per additional topping*
            </p>
          </div>
        </div>

        {/* Toppings */}
        <div className="grid md:grid-cols-2 gap-8 text-left text-gray-200">
          <div>
            <h4 className="font-bold text-yellow-400 mb-2">Sauces</h4>
            <ul className="space-y-1">
              <li>Homemade Marinara</li>
              <li>Creamy Alfredo</li>
              <li>Garlic Sauce</li>
              <li>Sweet Baby Ray’s BBQ</li>
              <li>Franks Red Hot</li>
              <li>Buffalo Ranch</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-yellow-400 mb-2">Cheeses</h4>
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

        {/* Signature Pies */}
        <div className="mt-12">
          <h3 className="text-3xl font-bold text-yellow-400 mb-6 text-center">Signature Pies</h3>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            {[
              { name: "Upper Crust Special", desc: "Italian Sausage, Fresh Mushrooms, and White Onions.", price: "$17.49–$21.49" },
              { name: "Deluxe", desc: "Sausage, Pepperoni, Mushrooms, Onions, and Green Peppers.", price: "$19.49–$23.49" },
              { name: "Carne", desc: "Sausage, Pepperoni, Bacon, and Ham.", price: "$19.49–$23.49" },
              { name: "Pepperoni Plus", desc: "Double the Pepperoni and Mozzarella.", price: "$18.49–$22.49" },
              { name: "Buffalo Chicken", desc: "Buffalo Ranch sauce, Chicken, Bacon, Red Onion, and Jalapeño.", price: "$19.49–$23.49" },
              { name: "BBQ Chicken", desc: "Sweet Baby Ray’s BBQ sauce, Chicken, Bacon, and Red Onion.", price: "$19.49–$23.49" },
              { name: "Chicken Alfredo", desc: "Alfredo sauce, Chicken, Mushrooms, Spinach, Bacon, and Red Onion.", price: "$19.49–$23.49" },
              { name: "Chicken Bacon Ranch", desc: "Chicken, Bacon, and Ranch sauce.", price: "$18.49–$20.49" },
              { name: "Mediterranean", desc: "Chicken, Black & Green Olives, Red Onions, and Feta.", price: "$19.49–$23.49" },
              { name: "Hawaiian", desc: "Ham and Pineapple.", price: "$17.99–$21.99" },
              { name: "Veggie", desc: "Mushrooms, Onions, Green Peppers, and Black Olives.", price: "$17.99–$21.99" },
              { name: "Garden", desc: "Mushrooms, Spinach, Red Onion, Tomato, and Garlic.", price: "$18.49–$22.49" },
              { name: "GSM", desc: "Garlic Sauce, Spinach, and Fresh Mushrooms.", price: "$17.99–$21.99" },
              { name: "BLT", desc: "Bacon, Lettuce, Tomato, and Mayo.", price: "$18.49–$23.49" },
              { name: "Philly Cheese Steak", desc: "Philly Steak, Mushrooms, Onion, and Green Peppers.", price: "$19.49–$23.49" },
            ].map((pizza) => (
              <div key={pizza.name} className="bg-zinc-900 p-5 rounded-lg shadow-md">
                <h4 className="text-xl font-semibold text-yellow-400">{pizza.name}</h4>
                <p className="text-gray-300">{pizza.desc}</p>
                <p className="text-gray-400 mt-1">{pizza.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- APPETIZERS --- */}
      <div id="appetizers" className="max-w-5xl mx-auto text-center mb-16 scroll-mt-28">
        <h3 className="text-3xl font-bold text-yellow-400 mb-6">Appetizers</h3>
        <div className="grid md:grid-cols-2 gap-8 text-left text-gray-200">
          {[
            "Cheesy Garlic Sticks — $8.49",
            "Mozzarella Sticks — $6.49",
            "Garlic Bites (S $5.49 | M $6.49 | L $7.49)",
            "Garlic Bread — $3.99",
            "Cheesy Garlic Bread — $5.99",
            "Pizza Bread (2 toppings) — $8.49 (+$0.99 per extra topping)",
            "French Fries (S $4.49 | L $6.49)",
            "Tater Tots (S $4.49 | L $6.49)",
            "Cheese Curds — $6.49",
            "Breaded Mushrooms — $6.49",
            "Jalapeño Poppers — $6.49",
            "Sampler Platter — $9.49",
            "Chicken Tenders (4pc $7.49 | 8pc $13.99)",
            "Chicken Wings (10pc $12.49 | 15pc $17.49 | 20pc $22.49)",
          ].map((item) => (
            <div key={item} className="bg-zinc-900 p-5 rounded-lg shadow-md">
              <p>{item}</p>
            </div>
          ))}
        </div>

        <p className="text-gray-400 mt-6">
          Wing Sauces: Mango Habanero, Franks Red Hot, Nashville Hot, Buffalo Ranch, Sweet Baby Ray’s, Kickin’ Bourbon, Lemon Pepper.
        </p>
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
              <li>Sausage Hoagie — $9.49</li>
              <li>Grilled Veggie Hoagie — $8.49</li>
              <li>BLT Hoagie — $8.49</li>
            </ul>
            <p className="text-gray-400 text-sm mt-2">
              Fries, Onion Rings, or Tater Tots for an additional cost.
            </p>
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

      {/* --- BURGERS & CHICKEN SANDWICHES --- */}
      <div id="burgers" className="max-w-5xl mx-auto text-center mb-16 scroll-mt-28">
        <h3 className="text-3xl font-bold text-yellow-400 mb-6">Burgers & Chicken Sandwiches</h3>
        <ul className="space-y-2 text-gray-200 max-w-lg mx-auto text-left">
          <li>Classic Cheeseburger — $8.49</li>
          <li>Texas Burger — $9.49</li>
          <li>Buffalo Burger — $9.49</li>
        </ul>
        <div className="mt-6 text-left max-w-lg mx-auto">
          <h4 className="text-xl font-semibold text-yellow-400 mb-2">Chicken Sandwiches</h4>
          <ul className="space-y-1">
            <li>Chicken Sandwich — $8.49</li>
            <li>Chicken Parmesan — $8.49</li>
            <li>Texas Chicken — $9.49</li>
            <li>Buffalo Chicken — $9.49</li>
          </ul>
          <p className="text-gray-400 text-sm mt-2">
            Fries, Onion Rings, or Tater Tots for an additional cost.
          </p>
        </div>
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
              <li>Cans — $2</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
