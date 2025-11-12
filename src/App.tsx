import { Routes, Route } from "react-router-dom";
import Header from "../src/components/Header";
import Home from "../src/pages/Home";
import MenuPage from "../src/pages/MenuPage";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<MenuPage />} />
      </Routes>
    </>
  );
}

export default App;
