"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, User, UserCircle, Briefcase, GraduationCap } from "lucide-react";
import Button from "@/components/UI/Button";
import api from "@/lib/api";
import { saveAuth } from "@/lib/auth";

export default function SignupForm() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Info, 2: OTP
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "student",
    otp: "",
  });

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await api.post<any>("/auth/signup/request-otp", { email: formData.email });
      if (res.success) {
        setStep(2);
      }
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.otp) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await api.post<any>("/auth/signup/confirm-otp", {
        email: formData.email,
        otp: formData.otp,
        password: formData.password,
        role: formData.role,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      if (res.success) {
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
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 border border-primary/5 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-primary">Create Account</h1>
        <p className="text-primary/60">
          {step === 1 ? "Join the EduSense community today" : "Verify your email address"}
        </p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleRequestOtp} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-primary/70 ml-1">First Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="John"
                  className="w-full bg-background border border-primary/10 rounded-2xl py-2.5 pl-11 pr-4 text-primary focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all placeholder:text-primary/30"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-primary/70 ml-1">Last Name</label>
              <div className="relative">
                <UserCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Doe"
                  className="w-full bg-background border border-primary/10 rounded-2xl py-2.5 pl-11 pr-4 text-primary focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all placeholder:text-primary/30"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-primary/70 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                className="w-full bg-background border border-primary/10 rounded-2xl py-2.5 pl-11 pr-4 text-primary focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all placeholder:text-primary/30"
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
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-background border border-primary/10 rounded-2xl py-3 pl-11 pr-4 text-primary focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all placeholder:text-primary/30"
              />
            </div>
          </div>

          <div className="space-y-3">
             <label className="text-sm font-semibold text-primary/70 ml-1">I am a...</label>
             <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "student" })}
                  className={`flex-1 flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 ${
                    formData.role === "student"
                      ? "border-secondary bg-secondary/5 text-secondary shadow-md"
                      : "border-primary/5 bg-background text-primary/40 hover:border-primary/10"
                  }`}
                >
                  <GraduationCap size={24} />
                  <span className="font-bold text-sm">Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "teacher" })}
                  className={`flex-1 flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 ${
                    formData.role === "teacher"
                      ? "border-secondary bg-secondary/5 text-secondary shadow-md"
                      : "border-primary/5 bg-background text-primary/40 hover:border-primary/10"
                  }`}
                >
                  <Briefcase size={24} />
                  <span className="font-bold text-sm">Teacher</span>
                </button>
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
            className="w-full h-12 text-base font-bold shadow-lg shadow-secondary/20 mt-4"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Continue"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleConfirmOtp} className="space-y-6">
          <div className="p-5 bg-secondary/5 rounded-2xl border border-secondary/10 text-center space-y-2">
            <p className="text-sm text-primary/70">
              We just sent a 6-digit verification code to
            </p>
            <p className="font-bold text-primary">{formData.email}</p>
          </div>

          <div className="space-y-1.5 text-center">
            <label className="text-sm font-semibold text-primary/70">Enter Verification Code</label>
            <input
              type="text"
              required
              maxLength={6}
              value={formData.otp}
              onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
              placeholder="000000"
              className="w-full bg-background border border-primary/10 rounded-2xl py-4 text-center text-3xl font-bold tracking-[0.5em] text-primary focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all placeholder:text-primary/10"
            />
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <Button
              type="submit"
              variant="primary"
              className="w-full h-14 text-lg font-bold shadow-lg shadow-secondary/20"
              disabled={isLoading || formData.otp.length < 6}
            >
              {isLoading ? <Loader2 className="animate-spin" size={24} /> : "Verify & Create Account"}
            </Button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full py-2 text-sm text-primary/40 font-semibold hover:text-primary transition-colors"
            >
              Go Back
            </button>
          </div>
        </form>
      )}

      <div className="text-center pt-2">
        <p className="text-sm text-primary/60">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-secondary font-bold hover:underline"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
