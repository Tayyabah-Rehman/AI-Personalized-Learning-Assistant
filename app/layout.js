import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata = {
  title: "AI Learning Assistant | Internee.pk",
  description: "Personalized AI-powered tutor for Internee.pk learning modules",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
