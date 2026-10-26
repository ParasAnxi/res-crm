// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { TopSystemBar } from "@/components/shared/TopSystemBar";

export const metadata: Metadata = {
  title: "Dili Bistro POS — Offline-First Restaurant Management",
  description: "POS, KOT Printing, Inventory & Loyalty System for Timor-Leste",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <TopSystemBar />
        <main className="flex-1 p-4 md:p-6 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}