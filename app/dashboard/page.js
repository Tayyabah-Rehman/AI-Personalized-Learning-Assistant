"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { MODULES } from "@/lib/lessons";
import Link from "next/link";
import ProgressChart from "@/components/ProgressChart";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => { if (!loading && !user) router.push("/login"); }, [user, loading, router]);

  // ✅ FIX: Updated useEffect with event listener for progress updates
  useEffect(() => {
    if (!user) return;

    const fetchData = () => {
      getDoc(doc(db, "users", user.uid)).then(d => setUserData(d.data()));
    };

    fetchData();

    // Listen for progress updates from LessonClient
    const handleProgressUpdate = () => {
      fetchData();
    };

    window.addEventListener('progress-updated', handleProgressUpdate);

    return () => {
      window.removeEventListener('progress-updated', handleProgressUpdate);
    };
  }, [user]);

  if (loading || !user) return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="text-center text-white">
        <div className="w-12 h-12 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" style={{borderWidth:"3px"}} />
        <p className="font-medium">Loading your dashboard...</p>
      </div>
    </div>
  );

  const progress = userData?.progress || {};
  const weakAreas = userData?.weakAreas || [];
  const lessonsCompleted = userData?.lessonsCompleted || 0;
  const totalLessons = MODULES.reduce((s, m) => s + m.totalLessons, 0);
  const overallPct = Math.round((lessonsCompleted / totalLessons) * 100);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top navbar */}
      <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-blue-sm">A</div>
            <span className="font-bold text-gray-800 text-sm">AI Learning Assistant</span>
            <span className="badge badge-blue hidden sm:inline-flex">Internee.pk</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-1.5">
            <div className="w-6 h-6 gradient-bg rounded-full flex items-center justify-center text-white text-xs font-bold">
              {(user.displayName || "U")[0].toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.displayName || "Learner"}</span>
          </div>
          <button onClick={() => { logout(); router.push("/login"); }}
            className="text-sm text-slate-400 hover:text-red-500 transition px-3 py-1.5 rounded-lg hover:bg-red-50">
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-gray-100 flex flex-col py-6 px-3 hidden md:flex">
          <nav className="space-y-1 flex-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">Menu</p>
            {[
              { icon: "🏠", label: "Dashboard", href: "/dashboard", active: true },
              { icon: "💬", label: "AI Tutor Chat", href: "/lesson?module=python-basics&chat=true" },
            ].map(item => (
              <Link key={item.label} href={item.href}
                className={`sidebar-link ${item.active ? "active" : ""}`}>
                <span>{item.icon}</span>{item.label}
              </Link>
            ))}
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2 mt-5">Modules</p>
            {MODULES.map(m => (
              <Link key={m.id} href={`/lesson?module=${m.id}`} className="sidebar-link">
                <span>{m.icon}</span>
                <span className="truncate">{m.title}</span>
              </Link>
            ))}
          </nav>
          <div className="px-3 mt-4">
            <div className="gradient-bg rounded-xl p-4 text-white text-center">
              <div className="text-2xl font-bold">{overallPct}%</div>
              <div className="text-blue-200 text-xs mt-0.5">Overall Progress</div>
              <div className="h-1.5 bg-white/20 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all" style={{ width: `${overallPct}%` }} />
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Welcome header */}
          <div className="gradient-bg rounded-2xl p-6 mb-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-12 translate-x-12" />
            <div className="relative z-10">
              <h1 className="text-2xl font-bold text-white mb-1">
                Good day, {user.displayName?.split(" ")[0] || "Learner"} 👋
              </h1>
              <p className="text-blue-200 text-sm">You've completed {lessonsCompleted} of {totalLessons} lessons. Keep it up!</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { icon: "✅", label: "Completed", value: lessonsCompleted, color: "text-blue-600", bg: "bg-blue-50" },
              { icon: "📚", label: "Total Lessons", value: totalLessons, color: "text-indigo-600", bg: "bg-indigo-50" },
              { icon: "⚠️", label: "Weak Areas", value: weakAreas.length, color: "text-amber-600", bg: "bg-amber-50" },
              { icon: "🗂️", label: "Modules", value: MODULES.length, color: "text-green-600", bg: "bg-green-50" },
            ].map(s => (
              <div key={s.label} className="card p-5">
                <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center text-xl mb-3`}>{s.icon}</div>
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Module cards */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-base font-bold text-gray-800">Learning Modules</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MODULES.map(module => {
                  const done = Object.keys(progress).filter(k => k.startsWith(module.id)).length;
                  const pct = Math.round((done / module.totalLessons) * 100);
                  return (
                    <div key={module.id} className="card p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 gradient-bg rounded-xl flex items-center justify-center text-xl shadow-blue-sm">{module.icon}</div>
                          <div>
                            <h3 className="font-bold text-gray-800 text-sm">{module.title}</h3>
                            <p className="text-xs text-slate-400">{module.totalLessons} lessons</p>
                          </div>
                        </div>
                        <span className={`badge ${pct === 100 ? "badge-green" : pct > 0 ? "badge-blue" : "bg-gray-100 text-gray-500"}`}>
                          {pct}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-4 leading-relaxed">{module.description}</p>
                      <div className="mb-4">
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, background: "linear-gradient(90deg, #1a3d7c, #2b6bf0)" }} />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                          <span>{done} done</span><span>{module.totalLessons - done} left</span>
                        </div>
                      </div>
                      <Link href={`/lesson?module=${module.id}`}
                        className="btn-primary w-full text-center text-xs py-2.5 block">
                        {pct === 0 ? "Start Module →" : pct === 100 ? "Review Module" : "Continue →"}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right sidebar */}
            <div className="space-y-4">
              <ProgressChart progress={progress} />

              {weakAreas.length > 0 && (
                <div className="card p-5">
                  <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-amber-50 rounded-lg flex items-center justify-center text-sm">⚠️</span>
                    Weak Areas to Review
                  </h3>
                  <div className="space-y-2">
                    {weakAreas.map(area => (
                      <div key={area} className="flex items-center gap-2 bg-amber-50 rounded-lg px-3 py-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                        <span className="text-xs text-amber-700 font-medium">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="card p-5 border-l-4 border-blue-500">
                <h3 className="font-bold text-gray-800 text-sm mb-1">💬 AI Tutor</h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">Get instant answers, code examples, and explanations from your personal AI tutor.</p>
                <Link href="/lesson?module=python-basics"
                  className="btn-primary w-full text-center text-xs py-2.5 block">
                  Open AI Tutor Chat
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
