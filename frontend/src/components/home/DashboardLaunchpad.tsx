// src/components/home/DashboardLaunchpad.tsx
"use client";

import Link from "next/link";
import { usePosStore } from "@/store/usePosStore";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Store,
  ChefHat,
  Package,
  Users,
  Clock,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  Zap,
  Database,
  Wifi,
  Lock,
} from "lucide-react";

export function DashboardLaunchpad() {
  const { kitchenPrintJobs, inventory, customers, unsyncedQueueCount } = usePosStore();
  const failedPrints = kitchenPrintJobs.filter((j) => j.status === "FAILED").length;
  const lowStockCount = inventory.filter((i) => i.current_stock <= i.min_stock_level).length;

  const modules = [
    {
      title: "Cashier POS & Billing Terminal",
      href: "/pos",
      role: "CASHIER / MANAGER",
      description: "Fast offline-first order entry, modifiers, split payments, and instant KOT dispatch.",
      icon: Store,
      stat: "Under 1s response",
      badgeVariant: "secondary" as const,
      gradient: "from-amber-500/10 via-orange-500/5 to-transparent",
      iconBg: "bg-amber-500/15 text-amber-600",
      btnBg: "bg-amber-600 hover:bg-amber-700 text-white",
    },
    {
      title: "Kitchen Order Ticket (KOT) Queue",
      href: "/kitchen",
      role: "KITCHEN / CASHIER",
      description: "Independent ESC/POS print spooler with jam detection and duplicate-safe retry.",
      icon: ChefHat,
      stat: failedPrints > 0 ? `${failedPrints} Failed Print Alert` : "All tickets printed",
      badgeVariant: failedPrints > 0 ? ("destructive" as const) : ("secondary" as const),
      alert: failedPrints > 0,
      gradient: "from-rose-500/10 via-red-500/5 to-transparent",
      iconBg: "bg-rose-500/15 text-rose-600",
      btnBg: "bg-rose-600 hover:bg-rose-700 text-white",
    },
    {
      title: "Inventory, Recipes & Wastage",
      href: "/inventory",
      role: "MANAGER / OWNER",
      description: "Ingredient stock catalogue, recipe consumption rules, purchase intake, and spoilage ledger.",
      icon: Package,
      stat: `${lowStockCount} Low Stock Warnings`,
      badgeVariant: lowStockCount > 0 ? ("destructive" as const) : ("secondary" as const),
      alert: lowStockCount > 0,
      gradient: "from-purple-500/10 via-indigo-500/5 to-transparent",
      iconBg: "bg-purple-500/15 text-purple-600",
      btnBg: "bg-purple-600 hover:bg-purple-700 text-white",
    },
    {
      title: "Customer Loyalty & Points CRM",
      href: "/customers",
      role: "CASHIER / OWNER",
      description: "Mobile phone lookup, USD points earning/redemption rules, and auditable points ledger.",
      icon: Users,
      stat: `${customers.length} Active Members`,
      badgeVariant: "secondary" as const,
      gradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
      iconBg: "bg-emerald-500/15 text-emerald-600",
      btnBg: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
    {
      title: "Shift & Cash Drawer Reconciliation",
      href: "/shifts",
      role: "CASHIER / MANAGER",
      description: "Shift opening float, expected vs. counted USD cash drawer reconciliation, and variance logs.",
      icon: Clock,
      stat: "Shift #SH-204 Open",
      badgeVariant: "secondary" as const,
      gradient: "from-blue-500/10 via-sky-500/5 to-transparent",
      iconBg: "bg-blue-500/15 text-blue-600",
      btnBg: "bg-blue-600 hover:bg-blue-700 text-white",
    },
    {
      title: "Owner Admin, Reports & Audit Logs",
      href: "/admin",
      role: "OWNER / ADMIN",
      description: "Gross/Net sales reports, 86 menu availability toggles, SQLite backup & security audit trail.",
      icon: BarChart3,
      stat: `${unsyncedQueueCount} Unsynced Records`,
      badgeVariant: "secondary" as const,
      gradient: "from-amber-600/10 via-yellow-500/5 to-transparent",
      iconBg: "bg-amber-600/15 text-amber-700",
      btnBg: "bg-amber-700 hover:bg-amber-800 text-white",
    },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* Hero Banner with Rich Gradient and Illustration feel */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-3xl border bg-gradient-to-r from-amber-600 via-orange-500 to-rose-600 p-8 text-white shadow-xl"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_50%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-md">
                PRD v1.0 Interactive Prototype
              </Badge>
              <Badge className="bg-black/30 text-white border-transparent backdrop-blur-md">
                Target Market: Timor-Leste (USD)
              </Badge>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              Restaurant POS, KOT, Inventory & Loyalty System
            </h1>
            <p className="text-white/90 text-sm leading-relaxed">
              Local-first architecture built on Prisma schema models. Test offline billing, simulated kitchen printer failures, recipe stock deductions, and shift cash reconciliation below.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                <Wifi className="h-3.5 w-3.5" /> Offline First
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                <Database className="h-3.5 w-3.5" /> Local Database
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                <Zap className="h-3.5 w-3.5" /> Fast & Reliable
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                <ShieldCheck className="h-3.5 w-3.5" /> Zero Cloud Dependency
              </span>
            </div>
          </div>

          {/* Right Floating Glass Card */}
          <div className="rounded-2xl bg-white/10 border border-white/20 p-5 backdrop-blur-xl shadow-2xl flex items-center gap-4 shrink-0 max-w-sm">
            <div className="rounded-xl bg-white/20 p-3 text-white">
              <Database className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Local SQLite + SyncQueue Ready</h3>
              <p className="text-xs text-white/80 mt-0.5">
                Zero cloud dependency during internet outages in Dili.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 6 Grid Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {modules.map((mod, index) => {
          const Icon = mod.icon;
          return (
            <motion.div
              key={mod.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link href={mod.href} className="block h-full">
                <Card className={`h-full relative overflow-hidden transition-all duration-300 border hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 bg-card group`}>
                  {/* Subtle top gradient wash */}
                  <div className={`absolute inset-0 bg-gradient-to-b ${mod.gradient} pointer-events-none`} />

                  <CardContent className="p-6 flex flex-col justify-between h-full relative z-10 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className={`rounded-2xl p-3.5 ${mod.iconBg} shadow-sm group-hover:scale-110 transition-transform`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <Badge variant={mod.badgeVariant} className="font-semibold text-xs px-2.5 py-0.5">
                          {mod.stat}
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                          Role: {mod.role}
                        </span>
                        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                          {mod.title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                          {mod.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border/60">
                      <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                        Launch Module
                      </span>
                      <div className={`rounded-full p-2 ${mod.btnBg} transition-transform group-hover:translate-x-1 shadow-sm`}>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}