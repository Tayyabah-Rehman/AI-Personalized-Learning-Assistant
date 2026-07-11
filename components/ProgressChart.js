"use client";
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from "recharts";
import { MODULES } from "@/lib/lessons";

const COLORS = ["#1a3d7c", "#2b6bf0", "#4f8ef7", "#7cb3ff"];

export default function ProgressChart({ progress }) {
  const data = MODULES.map((m, i) => {
    const done = Object.keys(progress || {}).filter(k => k.startsWith(m.id)).length;
    return {
      name: m.title,
      value: Math.round((done / m.totalLessons) * 100),
      fill: COLORS[i % COLORS.length],
      icon: m.icon,
    };
  });

  return (
    <div className="card p-5">
      <h3 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2">
        <span className="w-6 h-6 gradient-bg rounded-lg flex items-center justify-center text-white text-xs">📊</span>
        Module Progress
      </h3>
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={data} startAngle={90} endAngle={-270}>
            <RadialBar dataKey="value" cornerRadius={6} background={{ fill: "#f0f4ff" }} />
            <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f4", fontSize: "12px" }} />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-2 mt-2">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
            <span className="text-xs text-slate-600 flex-1 truncate">{d.name}</span>
            <span className="text-xs font-bold text-gray-800">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
