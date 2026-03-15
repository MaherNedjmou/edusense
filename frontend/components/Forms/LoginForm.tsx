"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock } from "lucide-react";
import Button from "@/components/UI/Button";
import api from "@/lib/api";
import { saveAuth } from "@/lib/auth";
import { useStore } from "@/store/useStore";
import googleIcon from "@/public/google.svg";

export default function LoginForm() {

  const setData = useStore(state => state.setData);
  const getData = useStore(state => state.getData);

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    setError("");

    try {
      const res = await api.post<any>("/auth/signin", { email, password });
      if (res.success) {
        res.user.roleId = res.roleId;
        setData("user", res.user);
        saveAuth(res.token, res.user);
        
        // Redirect based on role
        if (res.user.role === "teacher") {
          router.push("/teacher");
        } else if (res.user.role === "student") {
          router.push("/student");
        } else {
          router.push("/");
        }
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-primary/5 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-primary">Welcome Back</h1>
        <p className="text-primary/60">Log in to your EduSense account</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-primary/70 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-background border border-primary/10 rounded-2xl py-3 pl-11 pr-4 text-primary focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all placeholder:text-primary/30"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-primary/70 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-background border border-primary/10 rounded-2xl py-3 pl-11 pr-4 text-primary focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all placeholder:text-primary/30"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full h-12 text-base font-bold"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={18} />
              <span>Logging in...</span>
            </div>
          ) : (
            "Login"
          )}
        </Button>

        <div className="relative flex items-center gap-3">
          <div className="flex-1 h-px bg-primary/10" />
          <span className="text-xs font-semibold text-primary/30 uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-primary/10" />
        </div>
        
        <Button
          variant="outline"
          type="button"
          className="w-full h-12 text-base font-bold flex items-center justify-center gap-2"
        >
          <Image src={googleIcon} alt="Google" className="w-5 h-5" />
          Continue with Google
        </Button>

      </form>

      <div className="text-center">
        <p className="text-sm text-primary/60">
          Don't have an account?{" "}
          <button
            onClick={() => router.push("/signup")}
            className="text-secondary font-bold hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
