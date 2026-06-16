import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/ui/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SpeakWithYou — Learn English from Zero in 30 Days",
  description:
    "A free English learning platform for beginners. Complete a 30-day challenge with daily lessons, speaking practice, and AI mock interviews to build your English confidence.",
  keywords: [
    "learn English",
    "English for beginners",
    "30-day challenge",
    "speak English",
    "AI interview",
    "English practice",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
