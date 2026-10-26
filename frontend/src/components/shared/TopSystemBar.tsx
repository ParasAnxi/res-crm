// src/components/shared/TopSystemBar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { usePosStore } from "@/store/usePosStore";
import {
  Wifi,
  WifiOff,
  Printer,
  AlertTriangle,
  Store,
  ChefHat,
  Package,
  Users,
  BarChart3,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function TopSystemBar() {
  const pathname = usePathname();
  const {
    isOnline,
    printerErrorSimulated,
    unsyncedQueueCount,
    kitchenPrintJobs,
    toggleOnlineMode,
    togglePrinterError,
  } = usePosStore();

  const failedPrints = kitchenPrintJobs.filter(
    (j) => j.status === "FAILED",
  ).length;

  const navLinks = [
    { href: "/pos", label: "POS Terminal", icon: Store },
    {
      href: "/kitchen",
      label: "KOT Queue",
      icon: ChefHat,
      alertCount: failedPrints,
    },
    { href: "/inventory", label: "Inventory & Recipes", icon: Package },
    { href: "/customers", label: "Loyalty CRM", icon: Users },
    { href: "/shifts", label: "Shift & Cash", icon: Clock },
    { href: "/admin", label: "Owner Admin", icon: BarChart3 },
  ];

  return (
    // Uses pointer-events-none on the wrapper so clicks pass through the empty space around the floating bar
    <header className="sticky top-4 z-50 shrink-0 px-4 flex flex-col gap-3 pointer-events-none">
      {/* Floating Pill Nav */}
      <div className="pointer-events-auto flex items-center justify-between bg-white shadow-sm border border-zinc-200/60 rounded-full px-3 py-2 max-w-[1600px] w-full mx-auto">
        {/* Left: Brand & Main Navigation */}
        <div className="flex items-center gap-2 lg:gap-4">
          <Link href="/" className="flex items-center gap-3 pl-1 pr-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E54D2E] text-white font-bold text-lg shadow-sm overflow-hidden">
              <Image
                src="/logo.png"
                alt="DILI BISTRO POS"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-sm block text-zinc-900 leading-none">
                DILI BISTRO POS
              </span>
              <span className="text-[10px] text-zinc-500 font-medium mt-0.5 block">
                Counter #01 • Shift #SH-204 (USD)
              </span>
            </div>
          </Link>

          {/* Divider */}
          <div className="hidden lg:block w-px h-8 bg-zinc-100 mx-1" />

          {/* Middle: Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition-all ${
                    active
                      ? "bg-[#FFF0ED] text-[#E54D2E]"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                  {item.alertCount ? (
                    <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-black bg-[#E54D2E] text-white shrink-0">
                      {item.alertCount}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3 pr-1">
          {/* Divider */}
          <div className="hidden lg:block w-px h-8 bg-zinc-100 mr-1" />

          {/* Interactive Demo Controls for Client Presentation */}
          <div className="flex items-center gap-2">
            {/* SyncQueue & Internet Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleOnlineMode}
              className={`h-10 text-xs font-bold gap-2 rounded-full px-4 border-transparent shadow-none ${
                isOnline
                  ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                  : "text-zinc-500 bg-zinc-100 hover:bg-zinc-200"
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="h-3.5 w-3.5 text-emerald-600" />
                  Online (Synced)
                </>
              ) : (
                <>
                  <WifiOff className="h-3.5 w-3.5 text-zinc-400" />
                  Offline Mode ({unsyncedQueueCount} in Sync)
                </>
              )}
            </Button>

            {/* ESC/POS Kitchen Printer Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={togglePrinterError}
              className={`h-10 text-xs font-bold gap-2 rounded-full px-4 border-transparent shadow-none ${
                printerErrorSimulated
                  ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                  : "bg-[#F7F5F2] text-zinc-700 hover:bg-[#EAE7E2]"
              }`}
            >
              <Printer className="h-3.5 w-3.5" />
              {printerErrorSimulated
                ? "Simulating KOT Jam"
                : "KOT Printer: Ready"}
            </Button>
          </div>
        </div>
      </div>

      {/* Persistent Recovery Banner */}
      {failedPrints > 0 && (
        <div className="pointer-events-auto flex items-center justify-between rounded-xl bg-[#FFF0F0] border border-[#FFD6D6] px-5 py-3 text-xs text-[#D93025] max-w-[1600px] w-full mx-auto shadow-sm">
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="h-4 w-4 shrink-0 fill-[#D93025] text-white" />
            <span>
              <strong>Hardware Alert:</strong> {failedPrints} Kitchen Order
              Ticket{failedPrints === 1 ? "" : "s"} failed to print on LAN
              Printer (192.168.1.200). Order is safely stored locally.
            </span>
          </div>
          <Link
            href="/kitchen"
            className="font-bold hover:underline flex items-center gap-1 shrink-0 ml-2"
          >
            Open KOT Recovery Queue <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}
    </header>
  );
}
