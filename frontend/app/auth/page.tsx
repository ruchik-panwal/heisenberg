"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      // Save the token and user data to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ name: data.name, email: data.email }));
      
      // Redirect to the dictionary or search page
      router.push("/dictionary");
      
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-2">
          {isLogin ? "Welcome back" : "Create an account"}
        </h1>
        <p className="text-neutral-400 mb-8">
          {isLogin ? "Log in to access your saved compounds." : "Join HeisenBerg to build your compound library."}
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-mono text-neutral-500 mb-1">NAME</label>
              <input 
                type="text" name="name" required={!isLogin}
                onChange={handleChange}
                className="w-full bg-black border border-neutral-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" 
              />
            </div>
          )}
          
          <div>
            <label className="block text-xs font-mono text-neutral-500 mb-1">EMAIL</label>
            <input 
              type="email" name="email" required
              onChange={handleChange}
              className="w-full bg-black border border-neutral-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" 
            />
          </div>
          
          <div>
            <label className="block text-xs font-mono text-neutral-500 mb-1">PASSWORD</label>
            <input 
              type="password" name="password" required
              onChange={handleChange}
              className="w-full bg-black border border-neutral-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" 
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-white text-black font-semibold rounded-xl px-4 py-3 mt-4 hover:bg-neutral-200 transition-colors"
          >
            {isLogin ? "Sign In" : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(null); }} 
            className="text-white hover:underline cursor-pointer"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}