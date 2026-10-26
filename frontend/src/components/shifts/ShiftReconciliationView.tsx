// src/components/shifts/ShiftReconciliationView.tsx
"use client";

import { useState } from "react";
import { usePosStore } from "@/store/usePosStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Banknote, 
  CheckCircle2, 
  Lock, 
  Clock, 
  Wallet, 
  BarChart3, 
  CreditCard,
  History,
  Coins
} from "lucide-react";

export function ShiftReconciliationView() {
  const { shifts, reconcileCurrentShift } = usePosStore();

  const activeShift = shifts.find((s) => s.status === "OPEN");
  const expectedCash = activeShift
    ? Number((activeShift.opening_balance + activeShift.cash_sales).toFixed(2))
    : 0;

  const [countedCash, setCountedCash] = useState(expectedCash.toFixed(2));

  return (
    <div className="relative min-h-[calc(100vh-8rem)] pb-24">
      {/* Background Page Texture/Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-20 mix-blend-overlay pointer-events-none rounded-3xl"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1600&q=80')" }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/40 via-white/80 to-[#FFF5F0]/90 pointer-events-none rounded-3xl" />

      <div className="relative z-10 space-y-6 pt-2">
        
        {/* Rich Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-[#2C1914] text-white shadow-lg min-h-[140px] flex items-center p-6 md:p-8">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80')" }} 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C0F0A] via-[#1C0F0A]/90 to-transparent" />
          
          <div className="relative z-10 flex items-center justify-between w-full gap-5">
            <div className="space-y-1.5 flex-1">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                Cashier Shift & USD <span className="text-[#E54D2E]">Cash Drawer Reconciliation</span>
              </h1>
              {/* <p className="text-sm text-white/80 font-medium">
                Mapped to `Shift` model (`opening_balance`, `closing_balance`, `status: OPEN | RECONCILED`)
              </p> */}
            </div>
            
            {/* Contextual Info Box on the right */}
            <div className="hidden lg:flex items-center gap-3 bg-white/5 border border-white/10 p-3.5 rounded-xl backdrop-blur-md">
              <div className="bg-amber-500/20 p-2 rounded-lg">
                 <Clock className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                 <div className="text-sm font-bold text-white">Accurate cash tracking</div>
                 <div className="text-xs text-white/60 font-medium">Keep your shifts balanced and secure</div>
              </div>
            </div>
          </div>
        </div>

        {activeShift && (
          <Card className="border-0 shadow-md bg-white rounded-2xl overflow-hidden relative">
            <CardHeader className="border-b border-zinc-100 pb-4 bg-white">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-3 text-zinc-900">
                  <div className="bg-[#E54D2E]/10 p-2 rounded-lg">
                    <Banknote className="h-5 w-5 text-[#E54D2E]" />
                  </div>
                  <span className="font-bold">Active Shift #{activeShift.id} — {activeShift.user_name}</span>
                </CardTitle>
                <div className="bg-[#E54D2E] text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm">
                  OPEN SINCE {activeShift.opened_at}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                
                {/* Opening Float */}
                <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-amber-700/80 font-semibold text-xs uppercase tracking-wider">
                    <div className="bg-amber-100 p-1.5 rounded-md"><Wallet className="h-4 w-4 text-amber-600" /></div>
                    Opening Float (USD)
                  </div>
                  <p className="text-2xl font-black text-zinc-900 mt-1">
                    ${activeShift.opening_balance.toFixed(2)}
                  </p>
                </div>

                {/* Cash Sales */}
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-emerald-700/80 font-semibold text-xs uppercase tracking-wider">
                    <div className="bg-emerald-100 p-1.5 rounded-md"><BarChart3 className="h-4 w-4 text-emerald-600" /></div>
                    Cash Sales Recorded
                  </div>
                  <p className="text-2xl font-black text-emerald-600 mt-1">
                    +${activeShift.cash_sales.toFixed(2)}
                  </p>
                </div>

                {/* Card Sales */}
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-zinc-600 font-semibold text-xs uppercase tracking-wider">
                    <div className="bg-zinc-200 p-1.5 rounded-md"><CreditCard className="h-4 w-4 text-zinc-700" /></div>
                    Card / QR Sales
                  </div>
                  <p className="text-2xl font-black text-zinc-900 mt-1">
                    ${activeShift.card_sales.toFixed(2)}
                  </p>
                </div>

                {/* Expected Cash */}
                <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4 flex flex-col gap-2 relative overflow-hidden">
                  <div className="absolute right-0 top-0 opacity-5 scale-150 -translate-y-4 translate-x-4"><Wallet className="h-24 w-24" /></div>
                  <div className="flex items-center gap-2 text-rose-700/80 font-semibold text-xs uppercase tracking-wider relative z-10">
                    <div className="bg-rose-100 p-1.5 rounded-md"><Wallet className="h-4 w-4 text-rose-600" /></div>
                    Expected Cash in Drawer
                  </div>
                  <p className="text-2xl font-black text-[#E54D2E] mt-1 relative z-10">
                    ${expectedCash.toFixed(2)}
                  </p>
                </div>

              </div>

              {/* Action Area */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-zinc-100">
                <div className="flex items-center gap-3">
                  <div className="bg-zinc-100 p-2 rounded-full">
                    <Coins className="h-5 w-5 text-zinc-600" />
                  </div>
                  <span className="font-bold text-zinc-900">Physical Counted Cash (USD):</span>
                  <Input
                    type="number"
                    step="0.01"
                    value={countedCash}
                    onChange={(e) => setCountedCash(e.target.value)}
                    className="w-36 h-11 font-black text-lg text-center rounded-xl border-zinc-300 focus:border-[#E54D2E] focus:ring-[#E54D2E]/20 bg-white"
                  />
                </div>
                <Button
                  size="lg"
                  onClick={() => reconcileCurrentShift(parseFloat(countedCash) || expectedCash)}
                  className="gap-2 h-11 px-6 rounded-xl bg-[#E54D2E] hover:bg-[#D43D1F] text-white font-bold shadow-md"
                >
                  <Lock className="h-4 w-4" /> Close & Reconcile Shift
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-0 shadow-sm rounded-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="border-b border-zinc-100 pb-4">
            <CardTitle className="text-base flex items-center gap-3 text-zinc-900">
              <div className="bg-orange-100 p-1.5 rounded-lg">
                <History className="h-4 w-4 text-orange-600" />
              </div>
              Shift History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {shifts.map((sh) => (
              <div
                key={sh.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-100 bg-white p-4 transition-colors hover:border-zinc-200"
              >
                <div className="flex items-center gap-4">
                  <div className={`h-2.5 w-2.5 rounded-full ${sh.status === 'OPEN' ? 'bg-[#E54D2E]' : 'bg-zinc-400'}`} />
                  <div>
                    <span className="font-bold text-[15px] text-zinc-900 block leading-tight">
                      {sh.id} • {sh.user_name}
                    </span>
                    <span className="block text-zinc-500 font-medium text-xs mt-0.5">
                      Opened: {sh.opened_at} {sh.closed_at ? ` • Closed: ${sh.closed_at}` : ""}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 md:gap-6 text-sm font-medium">
                  <div className="flex items-center gap-3 text-zinc-600">
                    <span>Float: ${sh.opening_balance.toFixed(2)}</span>
                    <span className="text-zinc-300">|</span>
                    <span>Cash Sales: ${sh.cash_sales.toFixed(2)}</span>
                    {sh.closing_balance !== undefined && (
                      <>
                        <span className="text-zinc-300">|</span>
                        <span className="font-bold text-zinc-900">
                          Counted: ${sh.closing_balance.toFixed(2)}
                        </span>
                      </>
                    )}
                  </div>
                  
                  <Badge 
                    variant="outline" 
                    className={`text-[11px] font-bold px-3 py-1 gap-1 border-0 ${
                      sh.status === "OPEN" 
                        ? "bg-[#E54D2E] text-white" 
                        : "bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    {sh.status === "RECONCILED" && (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    )}
                    {sh.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}