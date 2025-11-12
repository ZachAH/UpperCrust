export default function Menu() {
    const items = [
      {
        name: "Margherita",
        description: "Classic tomato sauce, mozzarella, and fresh basil.",
        price: "$12",
        image: "/pizza-hero.jpg",
      },
      {
        name: "Pepperoni",
        description: "Loaded with spicy pepperoni and melted cheese.",
        price: "$14",
        image: "/pizza-hero.jpg",
      },
      {
        name: "BBQ Chicken",
        description: "Tangy BBQ sauce, grilled chicken, red onions, and cilantro.",
        price: "$15",
        image: "/pizza-hero.jpg",
      },
    ];
  
    return (
      <section id="menu" className="bg-neutral-950 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Our Pizzas</h2>
          <p className="text-gray-400">
            Handcrafted with fresh, local ingredients — baked to perfection in our
            wood-fired oven.
          </p>
        </div>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {items.map((pizza, index) => (
            <div
              key={index}
              className="bg-neutral-900 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <img
                src={pizza.image}
                alt={pizza.name}
                className="h-60 w-full object-cover"
              />
              <div className="p-6 text-left">
                <h3 className="text-2xl font-semibold mb-2">{pizza.name}</h3>
                <p className="text-gray-400 mb-4">{pizza.description}</p>
                <span className="text-yellow-400 font-bold text-lg">
                  {pizza.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  