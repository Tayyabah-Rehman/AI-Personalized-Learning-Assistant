"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { getModuleById } from "@/lib/lessons";
import { fetchLesson, fetchChat } from "@/lib/api";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

export default function LessonClient() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const moduleId = params.get("module") || "python-basics";
  const module = getModuleById(moduleId);

  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonContent, setLessonContent] = useState("");
  const [lessonLoading, setLessonLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [progress, setProgress] = useState({});
  const [chatOpen, setChatOpen] = useState(true);
  const [resuming, setResuming] = useState(true); // ✅ NEW: loading state for Firestore fetch
  const chatEndRef = useRef(null);

  useEffect(() => { if (!loading && !user) router.push("/login"); }, [user, loading, router]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Auto-resume: load progress then start next incomplete lesson
  useEffect(() => {
    if (!user || !module) return;
    setResuming(true); // ✅ Show spinner while fetching
    getDoc(doc(db, "users", user.uid)).then(d => {
      const savedProgress = d.data()?.progress || {};
      setProgress(savedProgress);

      // Find first lesson not yet completed
      const nextLesson = module.lessons.find(
        lesson => !savedProgress[`${moduleId}_${lesson.id}`]
      );

      if (nextLesson) {
        loadLesson(nextLesson);
      } else {
        // All done — open last lesson in review mode
        loadLesson(module.lessons[module.lessons.length - 1]);
      }
      setResuming(false); // ✅ Hide spinner after loading
    });
  }, [user, moduleId]);

  const loadLesson = async (lesson) => {
    setSelectedLesson(lesson);
    setLessonContent("");
    setLessonLoading(true);
    setMessages([{ role: "assistant", content: `Hello! I'm your AI tutor for **${lesson.title}**.\n\nThe lesson is loading on the left. Ask me anything once it appears! 🎓` }]);
    try {
      const data = await fetchLesson(lesson.title, module.title);
      setLessonContent(data.content);
    } catch (err) {
      setLessonContent(`⚠️ ${err.message || "Failed to load lesson. Please check your API key."}`);
    } finally {
      setLessonLoading(false);
    }
  };

  const markComplete = async () => {
    if (!user || !selectedLesson) return;
    const key = `${moduleId}_${selectedLesson.id}`;
    if (progress[key]) return;

    const newProgress = { ...progress, [key]: { completedAt: new Date().toISOString(), score: 100 } };
    setProgress(newProgress);
    await updateDoc(doc(db, "users", user.uid), {
      [`progress.${key}`]: { completedAt: new Date().toISOString(), score: 100 },
      lessonsCompleted: Object.keys(newProgress).length,
    });

    window.dispatchEvent(new Event("progress-updated"));

    // Auto-advance to next lesson after 800ms so user sees ✅ Completed first
    const currentIndex = module.lessons.findIndex(l => l.id === selectedLesson.id);
    const nextLesson = module.lessons[currentIndex + 1];
    if (nextLesson) {
      setTimeout(() => loadLesson(nextLesson), 800);
    }
    // If last lesson — stay, button shows ✅ Completed, module is done
  };

  const sendMessage = async () => {
    if (!input.trim() || chatLoading) return;
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setChatLoading(true);
    try {
      const data = await fetchChat(
        [...messages, userMsg],
        { lessonTitle: selectedLesson?.title, moduleTitle: module?.title, lessonContent }
      );
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      if (data.isWeakArea && selectedLesson && user) {
        await updateDoc(doc(db, "users", user.uid), {
          weakAreas: arrayUnion(`${module.title}: ${selectedLesson.title}`),
        });
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: `⚠️ ${err.message || "Sorry, try again."}` }]);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading || !user) return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="text-center text-white">
        <div className="w-12 h-12 border-t-2 border-white rounded-full animate-spin mx-auto mb-4" />
        <p className="font-medium">Loading...</p>
      </div>
    </div>
  );
  if (!module) return <div className="p-8">Module not found. <Link href="/dashboard" className="text-blue-600">Go back</Link></div>;

  // ✅ NEW: Show spinner while Firestore is fetching progress
  if (resuming) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-t-2 border-white rounded-full animate-spin mx-auto mb-4" />
          <p className="font-medium">Resuming your lesson...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-slate-500 hover:text-blue-600 transition text-sm font-medium">← Dashboard</Link>
          <span className="text-gray-200">|</span>
          <span className="text-base">{module.icon}</span>
          <span className="text-sm font-semibold text-gray-800">{module.title}</span>
          {selectedLesson && <><span className="text-gray-300">›</span><span className="text-sm text-slate-500">{selectedLesson.title}</span></>}
        </div>
        <div className="flex items-center gap-2">
          {selectedLesson && (
            <button onClick={markComplete}
              disabled={!!progress[`${moduleId}_${selectedLesson.id}`]}
              className={`text-xs font-semibold px-4 py-2 rounded-lg transition ${progress[`${moduleId}_${selectedLesson.id}`] ? "bg-green-50 text-green-700 border border-green-200" : "btn-primary"}`}>
              {progress[`${moduleId}_${selectedLesson.id}`] ? "✅ Completed" : "Mark Complete"}
            </button>
          )}
          <button onClick={() => setChatOpen(o => !o)}
            className="text-xs font-semibold px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
            {chatOpen ? "Hide Chat" : "💬 AI Chat"}
          </button>
        </div>
      </header>

      <div className="flex pt-[52px]" style={{ height: "100vh" }}>
        <aside className="w-60 bg-white border-r border-gray-100 overflow-y-auto py-4 hidden md:block flex-shrink-0 h-full">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 mb-3">Lessons</p>
          <ul className="space-y-0.5 px-2">
            {module.lessons.map((lesson, i) => {
              const key = `${moduleId}_${lesson.id}`;
              const done = !!progress[key];
              return (
                <li key={lesson.id}>
                  <button onClick={() => loadLesson(lesson)}
                    className={`w-full text-left px-3 py-3 rounded-xl text-sm transition flex items-center gap-3 ${selectedLesson?.id === lesson.id ? "bg-blue-50 text-blue-800 font-semibold" : "text-slate-600 hover:bg-slate-50"}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${done ? "bg-green-500 text-white" : selectedLesson?.id === lesson.id ? "gradient-bg text-white" : "bg-gray-100 text-gray-400"}`}>
                      {done ? "✓" : i + 1}
                    </div>
                    <span className="leading-tight text-left">{lesson.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="flex-1 overflow-y-auto">
          {!selectedLesson ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-20 h-20 gradient-bg rounded-3xl flex items-center justify-center text-4xl mb-5 shadow-lg">{module.icon}</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{module.title}</h2>
              <p className="text-slate-500 mb-8 max-w-sm">{module.description}</p>
              <button onClick={() => loadLesson(module.lessons[0])} className="btn-primary px-8 py-3">Start First Lesson →</button>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-8 py-8">
              <div className="mb-8 pb-5 border-b border-gray-100">
                <h1 className="text-xl font-bold text-gray-900 mb-2">{selectedLesson.title}</h1>
                <div className="flex items-center gap-2">
                  <span className="badge badge-blue">{selectedLesson.difficulty}</span>
                  <span className="badge bg-gray-100 text-gray-600">⏱ {selectedLesson.duration} min</span>
                  {progress[`${moduleId}_${selectedLesson.id}`] && <span className="badge badge-green">✅ Completed</span>}
                </div>
              </div>
              {lessonLoading ? (
                <div className="space-y-3">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className={`h-3.5 bg-blue-100/60 rounded animate-pulse-blue ${i % 5 === 4 ? "w-2/3" : i % 3 === 2 ? "w-5/6" : "w-full"}`} />
                  ))}
                  <div className="flex items-center gap-2 mt-8 text-blue-600 text-sm bg-blue-50 px-4 py-3 rounded-xl">
                    <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin flex-shrink-0" />
                    AI is generating your detailed lesson — this takes about 10 seconds...
                  </div>
                </div>
              ) : (
                <div className="lesson-content">
                  <ReactMarkdown>{lessonContent}</ReactMarkdown>
                </div>
              )}
            </div>
          )}
        </div>

        {chatOpen && (
          <div className="w-80 bg-white border-l border-gray-100 flex flex-col flex-shrink-0 h-full">
            <div className="px-4 py-3 border-b border-gray-100 gradient-bg flex-shrink-0">
              <h3 className="text-white font-bold text-sm">💬 AI Tutor</h3>
              <p className="text-blue-200 text-xs mt-0.5">Ask anything about this lesson</p>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin bg-slate-50">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center text-xl mx-auto mb-3">🤖</div>
                  <p className="text-xs text-slate-400 leading-relaxed">Select a lesson to start chatting!</p>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "assistant" && (
                    <div className="w-6 h-6 gradient-bg rounded-full flex items-center justify-center text-white text-[10px] font-bold mr-2 flex-shrink-0 mt-1">AI</div>
                  )}
                  <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${m.role === "user" ? "gradient-bg text-white" : "bg-white border border-gray-100 text-gray-700 shadow-sm"}`}>
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 gradient-bg rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">AI</div>
                  <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay:"0ms"}} />
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay:"150ms"}} />
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay:"300ms"}} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="p-3 border-t border-gray-100 bg-white flex-shrink-0">
              <div className="flex gap-2">
                <input value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder={selectedLesson ? "Ask a question..." : "Select a lesson first..."}
                  disabled={!selectedLesson}
                  className="input-field text-xs py-2.5 flex-1" />
                <button onClick={sendMessage} disabled={chatLoading || !selectedLesson || !input.trim()}
                  className="btn-primary px-3 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed">→</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}