import { useEffect, useState } from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { popIn } from "../animations";
import { staggerContainer } from "../animations";



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
        <p className="text-gray-300 text-lg mb-8">
          Build your perfect pie or choose from our signature favorites — plus all your other Upper Crust classics.
        </p>

        {/* Order Now button */}
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
            Gluten Free available in 14" for $17.99.
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
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-yellow-400 mb-10 text-center">
            Signature Pies
          </h3>

          {/* Animation Stagger Container */}
          <motion.div
            variants={staggerContainer}
            initial="visable"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                name: "Upper Crust Special",
                desc: "Italian Sausage, Fresh Mushrooms, and White Onions.",
                price: "$18.49-$36.99",
                img: "/images/pizzas/1.jpg",
              },
              {
                name: "Deluxe",
                desc: "Sausage, Pepperoni, Mushrooms, Onions, and Green Peppers.",
                price: "$19.99-$36.99",
                img: "/images/pizzas/2.jpg",
              },
              {
                name: "Carne",
                desc: "Sausage, Pepperoni, Bacon, and Ham.",
                price: "$19.99-$39.99",
                img: "/images/pizzas/3.jpg",
              },
              {
                name: "Pepperoni Plus",
                desc: "Double the Pepperoni and Mozzarella.",
                price: "$18.49-$38.99",
                img: "/images/pizzas/4.jpg",
              },
              {
                name: "Buffalo Chicken",
                desc: "Buffalo Ranch sauce, Chicken, Bacon, Red Onion, Jalapeño.",
                price: "$19.49–$39.99",
                img: "/images/pizzas/5.jpg",
              },
              {
                name: "BBQ Chicken",
                desc: "BBQ sauce, Chicken, Bacon, Red Onion.",
                price: "$19.49–$39.99",
                img: "/images/pizzas/1.jpg",
              },
            ].map((pizza) => (
              <motion.div
                key={pizza.name}
                variants={popIn}
                className="bg-zinc-900 rounded-xl overflow-hidden shadow-md border border-zinc-800
                transition-transform transition-border duration-150 will-change-transform
                hover:-translate-y-2 hover:border-yellow-400 hover:shadow-yellow-400/20"
              >
                <img
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
            ))}
          </motion.div>
        </div>


      </div>

      {/* --- APPETIZERS --- */}
      <div id="appetizers" className="max-w-6xl mx-auto mb-24 scroll-mt-28">
        <h3 className="text-3xl font-extrabold text-yellow-400 text-center mb-10 tracking-wider">
          Appetizers
        </h3>

        {/* Featured Carousel */}
        <Slider
          dots
          infinite
          speed={600}
          slidesToShow={1}
          slidesToScroll={1}
          autoplay
          autoplaySpeed={4000}
          fade
          pauseOnHover
          lazyLoad="ondemand"
          arrows={true}
          className="appetizer-carousel"
        >

          {[
            {
              name: "Cheesy Garlic Sticks",
              price: "$9.99",
              img: "/images/appetizers/1.jpg",
            },
            {
              name: "Mozzarella Sticks",
              price: "$7.99",
              img: "/images/appetizers/2.jpg",
            },
            {
              name: "Chicken Wings",
              price: "10pc $12.99",
              img: "/images/appetizers/3.jpg",
            },
            {
              name: "Breaded Mushrooms",
              price: "$7.99",
              img: "/images/appetizers/4.jpg",
            },
          ].map((item) => (
            <motion.div
              key={item.name}
              variants={popIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="relative"
            >
              <img
                loading="lazy"
                src={item.img}
                alt={item.name}
                className="h-64 w-full object-cover brightness-90"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 text-center">
                <h4 className="text-xl font-bold text-yellow-400">{item.name}</h4>
                <p className="text-gray-200 text-sm">{item.price}</p>
                <a
                  href="https://uppercrust.hungerrush.com/Order/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-full text-xs font-semibold"
                >
                  Order • Customize →
                </a>
              </div>
            </motion.div>
          ))}
        </Slider>

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
          Wing Sauces: Mango Habanero, Frank’s Red Hot, Nashville Hot, Buffalo Ranch,
          Sweet Baby Ray’s, Kickin’ Bourbon, Lemon Pepper.
        </p>
      </div>




      {/* --- HOAGIES & PASTA --- */}
      <div id="hoagies" className="max-w-6xl mx-auto mb-24 scroll-mt-28">
        <h3 className="text-3xl font-extrabold text-yellow-400 text-center mb-10 tracking-wider">
          Hoagies & Pasta
        </h3>

        {/* Featured Carousel */}
        <div className="max-w-5xl mx-auto relative">
          <Slider
            dots
            infinite
            speed={600}
            slidesToShow={1}
            slidesToScroll={1}
            autoplay
            autoplaySpeed={4000}
            fade
            pauseOnHover
            lazyLoad="ondemand"
            arrows={true}
            className="hoagies-carousel rounded-xl overflow-hidden"
          >
            {[
              {
                name: "Philly Cheesesteak",
                price: "$9.99",
                img: "/images/hoagies/1.jpg",
              },
              {
                name: "Meatball Hoagie",
                price: "$9.99",
                img: "/images/hoagies/2.jpg",
              },
              {
                name: "Chicken Alfredo Pasta",
                price: "$10.99",
                img: "/images/pasta/1.jpg",
              },
              {
                name: "Spaghetti & Meatballs",
                price: "$11.99",
                img: "/images/pasta/2.jpg",
              },
            ].map((item) => (
              <motion.div
                key={item.name}
                variants={popIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="relative"
              >
                <img
                  loading="lazy"
                  src={item.img}
                  alt={item.name}
                  className="h-64 w-full object-cover brightness-90"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 text-center">
                  <h4 className="text-xl font-bold text-yellow-400">{item.name}</h4>
                  <p className="text-gray-200 text-sm">{item.price}</p>
                  <a
                    href="https://uppercrust.hungerrush.com/Order/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-full text-xs font-semibold"
                  >
                    Order • Customize →
                  </a>
                </div>
              </motion.div>
            ))}
          </Slider>
        </div>

        {/* Quick List */}
        <div className="mt-12 grid sm:grid-cols-2 gap-10 text-left text-gray-300 text-sm">
          <div>
            <h4 className="text-lg font-bold text-yellow-400 mb-2">Hoagies</h4>
            <ul className="space-y-2">
              <li className="border-b border-zinc-700 pb-2">Philly Cheesesteak — $9.99</li>
              <li className="border-b border-zinc-700 pb-2">Italian Philly Cheesesteak — $9.99</li>
              <li className="border-b border-zinc-700 pb-2">Italian Chicken Cheesesteak — $9.99</li>
              <li className="border-b border-zinc-700 pb-2">Chicken Philly Cheesesteak — $9.99</li>
              <li className="border-b border-zinc-700 pb-2">Meatball Hoagie — $9.99</li>
              <li className="border-b border-zinc-700 pb-2">Sausage Hoagie — $9.99</li>
              <li className="border-b border-zinc-700 pb-2">Grilled Veggie Hoagie — $8.99</li>
              <li className="border-b border-zinc-700 pb-2">BLT Hoagie — $9.99</li>
            </ul>
            <p className="text-gray-500 text-xs mt-2 italic">
              Add fries, onion rings, or tots for an additional cost
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold text-yellow-400 mb-2">Pasta</h4>
            <ul className="space-y-2">
              <li className="border-b border-zinc-700 pb-2">Classic Spaghetti — $8.99</li>
              <li className="border-b border-zinc-700 pb-2">Spaghetti and Meatballs — $11.99</li>
              <li className="border-b border-zinc-700 pb-2">Chicken Parmesan — $11.99</li>
              <li className="border-b border-zinc-700 pb-2">Spinach & Garlic Spaghetti — $10.99</li>
              <li className="border-b border-zinc-700 pb-2">Chicken Alfredo — $10.99</li>
            </ul>
          </div>
        </div>
      </div>



      {/* --- BURGERS & CHICKEN SANDWICHES --- */}
      <div id="burgers" className="max-w-6xl mx-auto mb-24 scroll-mt-28">
        <h3 className="text-3xl font-extrabold text-yellow-400 text-center mb-10 tracking-wider">
          Burgers & Chicken Sandwiches
        </h3>

        {/* Featured Carousel */}
        <div className="max-w-5xl mx-auto relative">
          <Slider
            dots
            infinite
            speed={600}
            slidesToShow={1}
            slidesToScroll={1}
            autoplay
            autoplaySpeed={4000}
            fade
            pauseOnHover
            lazyLoad="ondemand"
            arrows={true}
            className="burgers-carousel rounded-xl overflow-hidden"
          >
            {[
              {
                name: "Texas Burger",
                price: "$9.99",
                img: "/images/burgers/1.jpg",
              },
              {
                name: "Classic 1/4 lb Cheeseburger",
                price: "$8.99",
                img: "/images/burgers/2.jpg",
              },
              {
                name: "Buffalo Chicken Sandwich",
                price: "$9.99",
                img: "/images/burgers/3.jpg",
              },
            ].map((item) => (
              <motion.div
                key={item.name}
                variants={popIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="relative"
              >

                <img
                  loading="lazy"
                  src={item.img}
                  alt={item.name}
                  className="h-64 w-full object-cover brightness-90"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 text-center">
                  <h4 className="text-xl font-bold text-yellow-400">{item.name}</h4>
                  <p className="text-gray-200 text-sm">{item.price}</p>
                  <a
                    href="https://uppercrust.hungerrush.com/Order/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-full text-xs font-semibold"
                  >
                    Order • Customize →
                  </a>
                </div>
              </motion.div>
            ))}
          </Slider>
        </div>

        {/* Quick List */}
        <div className="mt-12 grid sm:grid-cols-2 gap-10 text-left text-gray-300 text-sm">
          <div>
            <h4 className="text-lg font-bold text-yellow-400 mb-2">Burgers</h4>
            <ul className="space-y-2">
              <li className="border-b border-zinc-700 pb-2">Classic 1/4 lb Cheeseburger — $8.99</li>
              <li className="border-b border-zinc-700 pb-2">Texas Burger — $9.99</li>
              <li className="border-b border-zinc-700 pb-2">Buffalo Burger — $9.99</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-yellow-400 mb-2">Chicken Sandwiches</h4>
            <ul className="space-y-2">
              <li className="border-b border-zinc-700 pb-2">Chicken Sandwich — $8.99</li>
              <li className="border-b border-zinc-700 pb-2">Chicken Parmesan — $8.99</li>
              <li className="border-b border-zinc-700 pb-2">Texas Chicken — $9.99</li>
              <li className="border-b border-zinc-700 pb-2">Buffalo Chicken — $9.99</li>
              <li className="border-b border-zinc-700 pb-2">Nashville Chicken — $9.99</li>
            </ul>
            <p className="text-gray-500 text-xs mt-2 italic">
              Add fries, onion rings, or tots for an additional cost.
            </p>
          </div>
        </div>
      </div>



      {/* --- SALADS --- */}
      <div id="salads" className="max-w-6xl mx-auto mb-24 scroll-mt-28">
        <h3 className="text-3xl font-extrabold text-yellow-400 text-center mb-10 tracking-wider">
          Salads
        </h3>

        {/* Featured Salad Card */}
        <motion.div
          variants={popIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="relative max-w-3xl mx-auto rounded-xl overflow-hidden shadow-md border border-zinc-700"
        >
          <img
            loading="lazy"
            src="/images/salads/1.jpg"
            alt="Grilled Chicken Salad"
            className="h-64 w-full object-cover brightness-90"
          />

          <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-5 text-center">
            <h4 className="text-xl font-bold text-yellow-400">Grilled Chicken Salad</h4>
            <p className="text-gray-200 text-sm">$7.99</p>

            <a
              href="https://uppercrust.hungerrush.com/Order/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-xs font-semibold"
            >
              Order • Customize →
            </a>
          </div>
        </motion.div>

        {/* Salad List */}
        <div className="mt-12 max-w-lg mx-auto text-left text-gray-300">
          {[
            "Garden — $6.99",
            "Greek — $6.99",
            "Chef — $7.99",
            "Grilled Chicken Salad — $7.99",
          ].map((item) => (
            <p key={item} className="border-b border-zinc-700 pb-2 mb-2">
              {item}
            </p>
          ))}
        </div>
      </div>


      {/* --- DESSERTS & DRINKS --- */}
      <div id="desserts" className="max-w-6xl mx-auto mb-24 scroll-mt-28">
        <h3 className="text-3xl font-extrabold text-yellow-400 text-center mb-10 tracking-wider">
          Desserts & Drinks
        </h3>

        {/* Featured Dessert Card */}
        <motion.div
          variants={popIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="relative max-w-3xl mx-auto rounded-xl overflow-hidden shadow-md border border-zinc-700"
        >

          <img
            loading="lazy"
            src="/images/desserts/1.jpg"
            alt="Cannolis"
            className="h-64 w-full object-cover brightness-90"
          />

          <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-5 text-center">
            <h4 className="text-xl font-bold text-yellow-400">Cannolis</h4>
            <p className="text-gray-200 text-sm">$3.50 each</p>
            <a
              href="https://uppercrust.hungerrush.com/Order/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-xs font-semibold"
            >
              Order • Customize →
            </a>
          </div>
        </motion.div>

        {/* Quick List */}
        <div className="mt-12 grid sm:grid-cols-2 gap-10 text-left text-gray-300 text-sm">

          {/* Desserts */}
          <div>
            <h4 className="text-lg font-bold text-yellow-400 mb-2">Desserts</h4>
            <ul className="space-y-2">
              <li className="border-b border-zinc-700 pb-2">Maple Cinnamon Bites — $6.49</li>
              <li className="border-b border-zinc-700 pb-2">Cannolis — $3.50</li>
            </ul>
          </div>

          {/* Drinks */}
          <div>
            <h4 className="text-lg font-bold text-yellow-400 mb-2">Drinks</h4>
            <ul className="space-y-2">
              <li className="border-b border-zinc-700 pb-2">
                Coke, Diet Coke, Dole Lemonade, Sprite, Pink Lemonade,
                Dr. Pepper, Root Beer, Orange Crush
              </li>
              <li className="border-b border-zinc-700 pb-2">2-Liters — $3.99</li>
              <li className="border-b border-zinc-700 pb-2">Cans (Coke, Diet Coke, Sprite) — $1.49</li>
              <li className="border-b border-zinc-700 pb-2">Bottled Water — $1.49</li>
            </ul>
          </div>

        </div>
      </div>

      <div className="max-w-6xl mx-auto text-center mt-20">
        <a
          href="https://uppercrust.hungerrush.com/Order/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-10 py-4 rounded-full transition text-lg animate-soft-glow"
        >
          Order Online Now
        </a>

      </div>

    </section>
  );
}
