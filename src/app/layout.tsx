// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header"; // Header ko import kiya
import Footer from "@/components/Footer"; // Footer ko import kiya

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MeraBlog - Aapka Apna Tech Blog",
  description: "Latest tech news, tutorials, and much more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-800`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-6 py-8">
            {children} {/* Yahan aapke page ka content aayega */}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}