export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950 text-zinc-500">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-center sm:text-left text-xs">
        <p className="text-zinc-400">
          © 2026 Upper Crust Pizza. All rights reserved.
        </p>
        <p>
          Made by{" "}
          <a
            href="https://zachhowell.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-yellow-500 transition-colors"
          >
            ZH Web Solutions
          </a>
        </p>
      </div>
    </footer>
  );
}
