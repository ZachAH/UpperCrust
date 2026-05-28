import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import PageSEO from "./components/PageSEO";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Lazy-loaded pages for code splitting
const Home = lazy(() => import("./pages/Home"));
const MenuPage = lazy(() => import("./pages/MenuPage"));
const HoursPage = lazy(() => import("./pages/HoursPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const Login = lazy(() => import("./pages/login")); 
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

function App() {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Check if we are on the admin page to hide the public header
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <>
      <PageSEO />
      {/* Only show the public header if we ARE NOT on the admin dashboard */}
      {!isAdminPage && <Header />}

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