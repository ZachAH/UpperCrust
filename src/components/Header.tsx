export default function Header() {
    return (
      <header className="bg-black text-white shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl font-bold tracking-wide">Upper Crust Pizza</h1>
          <nav className="flex space-x-6 text-sm uppercase font-medium">
            <a href="#menu" className="hover:text-yellow-400 transition">Menu</a>
            <a href="#about" className="hover:text-yellow-400 transition">About</a>
            <a href="#order" className="hover:text-yellow-400 transition">Order</a>
            <a href="#contact" className="hover:text-yellow-400 transition">Contact</a>
          </nav>
        </div>
      </header>
    );
  }
  