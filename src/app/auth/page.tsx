"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, Lock, User, Loader2, Eye, EyeOff } from "lucide-react";

import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  const toggleMode = () => setIsLogin(!isLogin);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (data.status) {
        // Success!
        router.push("/profile"); // Redirect to profile after successful login/registration
      } else {
        alert(data.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex selection:bg-[#D4A373] selection:text-white">
      
      {/* Left Column - Imagery (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-[#EBE5D9] relative overflow-hidden flex-col justify-between p-12">
        <a href="/" className="z-20 font-[family-name:var(--font-playfair)] font-bold text-2xl text-[#1C1816] tracking-tighter hover:opacity-80 transition-opacity w-fit">
          Zing Healthy Eats<span className="text-[#D4A373]">.</span>
        </a>

        <div className="z-20 max-w-md">
          <p className="font-[family-name:var(--font-playfair)] text-4xl text-[#1C1816] italic mb-6">
            "The perfect crunch, made for your daily ritual."
          </p>
          <p className="text-[#7A614A] uppercase tracking-widest text-xs font-semibold">Join the pantry</p>
        </div>

        {/* Abstract Image Background */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-[120%] h-[120%] bg-[url('/granola_hero.jpg')] bg-cover bg-center mix-blend-multiply opacity-50 rounded-full blur-[10px]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#EBE5D9] to-transparent"></div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24 relative">
        <a 
          href="/"
          className="lg:hidden absolute top-8 left-8 font-[family-name:var(--font-playfair)] font-bold text-2xl text-[#1C1816] tracking-tighter"
        >
          Zing<span className="text-[#D4A373]">.</span>
        </a>

        <div className="max-w-sm w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "register"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#1C1816] mb-2">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-[#7A614A] text-sm mb-10">
                {isLogin 
                  ? "Enter your details to access your pantry." 
                  : "Sign up to track orders and save your favorites."}
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {!isLogin && (
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9A8A7A]" />
                    <input 
                      required 
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      type="text" 
                      placeholder="Username" 
                      className="w-full pl-12 pr-4 py-3 bg-transparent border border-[#DCD4C4] rounded-xl focus:outline-none focus:border-[#1C1816] text-[#1C1816] placeholder-[#9A8A7A] transition-colors"
                    />
                  </div>
                )}

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9A8A7A]" />
                  <input 
                    required 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    type="email" 
                    placeholder="Email Address" 
                    className="w-full pl-12 pr-4 py-3 bg-transparent border border-[#DCD4C4] rounded-xl focus:outline-none focus:border-[#1C1816] text-[#1C1816] placeholder-[#9A8A7A] transition-colors"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9A8A7A]" />
                  <input 
                    required 
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password" 
                    className="w-full pl-12 pr-12 py-3 bg-transparent border border-[#DCD4C4] rounded-xl focus:outline-none focus:border-[#1C1816] text-[#1C1816] placeholder-[#9A8A7A] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9A8A7A] hover:text-[#1C1816] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {isLogin && (
                  <div className="flex justify-end">
                    <a href="#" className="text-xs text-[#7A614A] hover:text-[#1C1816] font-medium transition-colors">
                      Forgot password?
                    </a>
                  </div>
                )}

                <button 
                  disabled={isLoading}
                  type="submit" 
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#1C1816] text-[#FAF8F5] rounded-xl font-semibold tracking-wide transition-all hover:bg-[#3A322C] disabled:opacity-70 mt-4 shadow-md hover:shadow-lg"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    isLogin ? "Sign In" : "Create Account"
                  )}
                </button>
              </form>

              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-[#DCD4C4]"></div>
                <span className="text-xs uppercase tracking-widest text-[#9A8A7A] font-medium">Or</span>
                <div className="flex-1 h-px bg-[#DCD4C4]"></div>
              </div>

              <button 
                type="button" 
                className="w-full flex items-center justify-center gap-3 py-3.5 bg-white border border-[#DCD4C4] text-[#1C1816] rounded-xl font-semibold transition-all hover:bg-[#FAF8F5] shadow-sm hover:shadow"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              <div className="mt-8 text-center">
                <p className="text-sm text-[#7A614A]">
                  {isLogin ? "New to Zing?" : "Already have an account?"}{" "}
                  <button onClick={toggleMode} className="text-[#1C1816] font-semibold hover:underline">
                    {isLogin ? "Create an account" : "Sign in"}
                  </button>
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
