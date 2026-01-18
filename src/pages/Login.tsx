// src/pages/login.tsx
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase'; // Ensure path is correct
import { useNavigate } from 'react-router-dom';

// Use "export default" here
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password); //
      navigate('/admin');
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-zinc-950">
      <form onSubmit={handleLogin} className="p-8 bg-zinc-900 rounded-lg shadow-xl border border-zinc-800 w-96">
        <h1 className="text-2xl font-bold text-white mb-6">Admin Login</h1>
        <input 
          type="email" 
          placeholder="Email" 
          className="w-full p-2 mb-4 bg-zinc-800 text-white rounded border border-zinc-700 outline-none focus:border-red-600"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full p-2 mb-6 bg-zinc-800 text-white rounded border border-zinc-700 outline-none focus:border-red-600"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded transition-colors">
          Login
        </button>
      </form>
    </div>
  );
}