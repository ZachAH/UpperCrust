// src/components/ProtectedRoute.tsx
import { useEffect, useState, type ReactNode } from 'react'; // Added 'type' here
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged, type User } from 'firebase/auth'; // Added 'type' here
import { auth } from '../lib/firebase';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
        <p className="text-zinc-400 font-medium">Verifying Admin Access...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};