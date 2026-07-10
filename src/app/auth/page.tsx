"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, Lock, User, Loader2, Eye, EyeOff } from "lucide-react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

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
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
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

              <div className="w-full flex justify-center mt-2">
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    setIsLoading(true);
                    try {
                      const res = await fetch("/api/auth/google", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ token: credentialResponse.credential })
                      });
                      const data = await res.json();
                      if (data.status) {
                        router.push("/profile");
                      } else {
                        alert(data.message);
                      }
                    } catch (err) {
                      console.error(err);
                      alert("Something went wrong with Google login");
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  onError={() => {
                    alert("Google Login Failed");
                  }}
                  useOneTap
                  theme="outline"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                  width="100%"
                />
              </div>

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
    </GoogleOAuthProvider>
  );
}
