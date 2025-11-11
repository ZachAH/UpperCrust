import Hero from "../components/Hero";

console.log("Home component loaded");

export default function Home() {
  return (
    <div>
      <Hero />
      <section className="text-center py-16 bg-neutral-900">
        <h2 className="text-3xl font-bold mb-4">Welcome to Upper Crust Pizza</h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          The finest handcrafted pies in the Midwest. Locally sourced ingredients, wood-fired flavor, and a passion for pizza since 1998.
        </p>
      </section>
    </div>
  );
}
