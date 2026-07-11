"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try { await login(email, password); router.push("/dashboard"); }
    catch { setError("Invalid email or password. Please try again."); }
    finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    try { await loginWithGoogle(); router.push("/dashboard"); }
    catch { setError("Google sign-in failed. Please try again."); }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-bg flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:"radial-gradient(circle at 20% 80%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)", backgroundSize:"60px 60px"}} />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white text-lg font-bold">A</div>
            <span className="text-white font-bold text-lg">AI Learning Assistant</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Welcome back to<br />your learning journey
          </h2>
          <p className="text-blue-200 text-base leading-relaxed">
            Pick up right where you left off. Your personalized AI tutor is ready to help you master every module.
          </p>
        </div>
        <div className="relative z-10 grid grid-cols-2 gap-4">
          {[
            { n: "19", label: "Learning Modules" },
            { n: "4", label: "Subject Areas" },
            { n: "AI", label: "Powered Tutor" },
            { n: "24/7", label: "Available" },
          ].map(s => (
            <div key={s.label} className="glass rounded-xl p-4">
              <div className="text-2xl font-bold text-white">{s.n}</div>
              <div className="text-blue-200 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center text-white font-bold text-sm">A</div>
            <span className="font-bold text-gray-800">AI Learning Assistant</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Sign in to your account</h1>
          <p className="text-slate-500 text-sm mb-8">Don't have an account? <Link href="/register" className="text-blue-600 font-semibold hover:underline">Sign up free</Link></p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="input-field" placeholder="you@example.com" />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <span className="text-xs text-blue-600 cursor-pointer hover:underline">Forgot password?</span>
              </div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="input-field" placeholder="Enter your password" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</span>
              ) : "Sign In"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-100" /><span className="text-xs text-gray-400 font-medium">OR CONTINUE WITH</span><div className="flex-1 h-px bg-gray-100" />
          </div>

          <button onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 border-1.5 border-gray-200 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition border border-gray-200">
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Continue with Google
          </button>

          <p className="text-center text-xs text-slate-400 mt-8">
            By signing in, you agree to our <span className="text-blue-600 cursor-pointer hover:underline">Terms</span> and <span className="text-blue-600 cursor-pointer hover:underline">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}
