import { Routes, Route } from "react-router-dom";
import Header from "../src/components/Header";
import Home from "../src/pages/Home";
import MenuPage from "../src/pages/MenuPage";
import HoursPage from "../src/pages/HoursPage";
import ContactPage from "../src/pages/ContactPage";



function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/hours" element={<HoursPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </>
  );
}

export default App;
