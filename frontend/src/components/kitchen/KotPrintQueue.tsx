// src/components/kitchen/KotPrintQueue.tsx
"use client";

import { usePosStore } from "@/store/usePosStore";
import { Button } from "@/components/ui/button";
import { 
  RefreshCw, 
  CheckCircle2, 
  AlertOctagon, 
  Printer, 
  ChefHat,
  FileText,
  Clock,
  AlertCircle
} from "lucide-react";

export function KotPrintQueue() {
  const { kitchenPrintJobs, retryKitchenPrint } = usePosStore();

  return (
    <div className="relative min-h-[calc(100vh-8rem)] pb-24">
      {/* Background Page Texture/Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-30 mix-blend-overlay pointer-events-none rounded-3xl"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1600&q=80')" }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/40 via-white/80 to-[#FFF5F0]/90 pointer-events-none rounded-3xl" />

      <div className="relative z-10 space-y-6 pt-2">
        {/* Rich Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-[#2C1914] text-white shadow-lg min-h-[140px] flex items-center p-6 md:p-8">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=1200&q=80')" }} 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C0F0A] via-[#1C0F0A]/80 to-transparent" />
          
          <div className="relative z-10 flex items-center gap-5 w-full">
            <div className="bg-[#E54D2E]/20 border border-[#E54D2E]/30 p-4 rounded-2xl shrink-0">
              <ChefHat className="h-10 w-10 text-[#E54D2E]" />
            </div>
            <div className="flex-1 space-y-1.5">
              <h1 className="text-3xl font-black tracking-tight">
                Kitchen Order Ticket <span className="text-[#E54D2E]">(KOT)</span> Spooler
              </h1>
              <p className="text-sm text-white/80 font-medium">
                Decoupled ESC/POS print queue (`KitchenPrintJob` model) • Prevents duplicate sales on printer jam
              </p>
            </div>
            
            {/* Calligraphic touch on the right */}
            <div className="hidden lg:block shrink-0 mr-12 rotate-[-4deg]">
              <span className="font-serif italic text-3xl font-bold text-[#E54D2E]/90 drop-shadow-md">
                Fresh<br/>Food<br/>Right Order
              </span>
            </div>
          </div>
        </div>

        {/* KOT Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {kitchenPrintJobs.map((job) => {
            const isFailed = job.status === "FAILED";
            
            return (
              <div
                key={job.id}
                className={`relative overflow-hidden rounded-[24px] border-2 shadow-sm transition-all flex flex-col ${
                  isFailed 
                    ? "bg-gradient-to-b from-white to-[#FFF0F0] border-[#FFE5E5]" 
                    : "bg-gradient-to-b from-white to-[#F0FFF4] border-[#E5FFE5]"
                }`}
              >
                <div className="p-6 flex-1 flex flex-col gap-5">
                  
                  {/* Top Badges */}
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border ${
                      isFailed ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-green-50 text-green-700 border-green-200"
                    }`}>
                      <FileText className="h-3.5 w-3.5" />
                      {job.order_number}
                    </div>
                    
                    <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold ${
                      isFailed ? "bg-[#FFE5E5] text-[#D93025]" : "bg-[#E5FFE5] text-emerald-700"
                    }`}>
                      {isFailed ? <AlertCircle className="h-4 w-4 fill-[#D93025] text-white" /> : <CheckCircle2 className="h-4 w-4 fill-emerald-600 text-white" />}
                      {job.status} (Retries: {job.retry_count})
                    </div>
                  </div>

                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-zinc-900 tracking-tight">
                      Table / Ref: {job.table_number}
                    </h2>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-zinc-500">
                      <Clock className="h-4 w-4" />
                      {job.created_at}
                    </div>
                  </div>

                  {/* Simulated Receipt Container */}
                  <div className={`rounded-xl border bg-white p-5 font-mono text-sm shadow-sm space-y-2 ${
                    isFailed ? "border-rose-100" : "border-zinc-200"
                  }`}>
                    {job.retry_count > 0 && (
                      <div className="text-xs font-bold text-amber-600 border-b border-dashed border-amber-200 pb-2 mb-2">
                        *** RETRY DUPLICATE CHECK #{job.retry_count} ***
                      </div>
                    )}
                    
                    {job.items.map((item) => (
                      <div key={item.id} className="space-y-1">
                        <div className="font-bold text-zinc-900">
                          {item.quantity}x {item.menu_item_name}
                        </div>
                        {item.applied_modifiers.map((m) => (
                          <div key={m.id} className="pl-5 text-zinc-500 text-xs font-medium">
                            + {m.name}
                          </div>
                        ))}
                        {item.notes && (
                          <div className="pl-5 font-bold text-[#D93025] text-xs">
                            ** PREP NOTE: {item.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Error Log */}
                  {job.error_log && (
                    <div className="flex items-center gap-2 rounded-xl bg-[#FFF0F0] p-3 text-xs font-bold text-[#D93025] border border-[#FFE5E5]">
                      <AlertOctagon className="h-4 w-4 shrink-0" />
                      <span>{job.error_log}</span>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="mt-auto pt-2">
                    {isFailed ? (
                      <Button
                        size="lg"
                        className="w-full gap-2 rounded-xl bg-[#E54D2E] hover:bg-[#D43D1F] text-white font-bold h-14 text-[15px] shadow-md transition-transform active:scale-[0.98]"
                        onClick={() => retryKitchenPrint(job.id)}
                      >
                        <RefreshCw className="h-5 w-5" />
                        Retry KOT Print (No Duplicate Sale)
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full gap-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-bold border-zinc-200 h-14 text-[15px] transition-transform active:scale-[0.98]"
                        onClick={() => retryKitchenPrint(job.id)}
                      >
                        <Printer className="h-5 w-5" />
                        Authorised Reprint KOT
                      </Button>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      
    </div>
  );
}