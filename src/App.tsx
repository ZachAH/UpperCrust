import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import Home from "../src/pages/Home";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-900 text-white">
      <Header />
      <main className="flex-grow">
        <Home />
      </main>
      <Footer />
    </div>
  );
}

export default App;
