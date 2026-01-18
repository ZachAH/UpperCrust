import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";

// Lazy-loaded pages for code splitting
const Home = lazy(() => import("./pages/Home"));
const MenuPage = lazy(() => import("./pages/MenuPage"));
const HoursPage = lazy(() => import("./pages/HoursPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
// Components (Functional wrappers)
import { ProtectedRoute } from "./components/ProtectedRoute";

// Pages (Lazy loaded for performance)
const Login = lazy(() => import(".//pages/login"));
const AdminDashboard = lazy(() => import(".//pages/AdminDasboard"));

function App() {
  return (
    <>
      <Header />

      <Suspense fallback={<div className="page-loader">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/hours" element={<HoursPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
