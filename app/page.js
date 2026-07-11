"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!loading && user) router.push("/dashboard"); }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-blue-50 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 gradient-bg rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-blue-sm">A</div>
          <div>
            <span className="text-base font-bold text-gray-900">AI Learning Assistant</span>
            <span className="ml-2 badge badge-blue">Internee.pk</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-secondary text-sm px-5 py-2">Login</Link>
          <Link href="/register" className="btn-primary text-sm px-5 py-2">Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="gradient-bg absolute inset-0 opacity-[0.03]" />
        <div className="max-w-6xl mx-auto px-8 pt-24 pb-20 text-center relative">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-800 text-xs font-semibold px-4 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block" />
            Powered by OpenAI GPT-4 · Built for Internee.pk
          </div>
          <h1 className="text-6xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tight">
            Your Personal AI Tutor<br />
            <span className="gradient-text">Tailored to You</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Dynamic lesson plans, instant AI Q&A, and smart progress tracking — all in one platform designed to guide interns through every learning module.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register" className="btn-primary text-base px-8 py-3.5 shadow-blue-md">
              Start Learning Free →
            </Link>
            <Link href="/login" className="btn-secondary text-base px-8 py-3.5">
              Sign In
            </Link>
          </div>
          <p className="text-xs text-slate-400 mt-5">No credit card required • Free to get started</p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything you need to learn faster</h2>
          <p className="text-slate-500">Intelligent tools that adapt to your learning style and pace</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "📚", title: "Dynamic Lesson Planning", desc: "AI generates structured, personalized lesson content tailored to your skill level and learning goals.", badge: "AI-Powered" },
            { icon: "💬", title: "Instant AI Q&A", desc: "Ask questions in real-time and get clear, contextual answers with code examples from your AI tutor.", badge: "Real-time" },
            { icon: "📊", title: "Progress & Weak Areas", desc: "Visual dashboards track your completion rates and automatically flag topics that need more attention.", badge: "Smart Tracking" },
          ].map(f => (
            <div key={f.title} className="card p-6">
              <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center text-2xl mb-4 shadow-blue-sm">{f.icon}</div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-gray-800">{f.title}</h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed mb-3">{f.desc}</p>
              <span className="badge badge-blue">{f.badge}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Modules preview */}
      <section className="gradient-bg py-20">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">4 Core Learning Modules</h2>
          <p className="text-blue-200 mb-12">Covering everything from Python to Machine Learning</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "🐍", title: "Python Basics", n: "5 Lessons" },
              { icon: "🤖", title: "Machine Learning", n: "5 Lessons" },
              { icon: "🌐", title: "Web Development", n: "5 Lessons" },
              { icon: "📊", title: "Data Analysis", n: "4 Lessons" },
            ].map(m => (
              <div key={m.title} className="glass rounded-2xl p-5 text-white text-center">
                <div className="text-3xl mb-2">{m.icon}</div>
                <div className="font-semibold">{m.title}</div>
                <div className="text-blue-200 text-xs mt-1">{m.n}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-8 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to accelerate your learning?</h2>
        <p className="text-slate-500 mb-8">Join interns who are already using AI to learn smarter, not harder.</p>
        <Link href="/register" className="btn-primary text-base px-10 py-3.5 shadow-blue-lg">
          Create Free Account →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 text-center text-sm text-slate-400">
        © 2025 AI Learning Assistant · Internee.pk · Built with Next.js & OpenAI
      </footer>
    </div>
  );
}
