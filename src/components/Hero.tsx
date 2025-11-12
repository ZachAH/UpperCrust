export default function Hero() {
    return (
      <section
        className="relative bg-[url('/pizza-hero.jpg')] bg-cover bg-center h-screen flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="bg-blue-600 text-white text-3xl font-bold text-center p-10">
  Tailwind Test Box
</div>

        <div className="relative z-10 text-center text-white px-4">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
            Handcrafted. Local. Legendary.
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-200">
            Fresh ingredients, wood-fired perfection — a true slice of the Midwest.
          </p>
          <a
            href="#menu"
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 rounded-full transition"
          >
            View Menu
          </a>
        </div>
      </section>
    );
  }
  