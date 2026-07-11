import { Suspense } from "react";
import LessonClient from "./LessonClient";

export default function LessonPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-t-2 border-white rounded-full animate-spin mx-auto mb-4" />
          <p className="font-medium">Loading...</p>
        </div>
      </div>
    }>
      <LessonClient />
    </Suspense>
  );
}
