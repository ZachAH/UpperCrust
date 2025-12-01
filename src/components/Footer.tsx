export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 text-center py-6">
      <p>© 2025 Upper Crust Pizza. All rights reserved.</p>

      <div className="mt-2 flex flex-col items-center gap-2">
        <p>
          Website by{" "}
          <a
            href="https://zhowellportfolio.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-400 hover:text-yellow-300 font-semibold transition"
          >
            Zach Howell
          </a>{" "}
          🍕
        </p>

        <div className="flex gap-4 items-center justify-center mt-1">
          <img src="/react.png" alt="React" className="w-7 h-7" />
          <img src="/vite.svg" alt="Vite" className="w-7 h-7" />
          <img src="/tailwind.png" alt="TailwindCSS" className="w-7 h-7" />
        </div>
      </div>
    </footer>


  );
}
