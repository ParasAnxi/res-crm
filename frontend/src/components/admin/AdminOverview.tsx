// src/components/admin/AdminOverview.tsx
"use client";

import { usePosStore } from "@/store/usePosStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  ShieldAlert, 
  Database, 
  DollarSign, 
  Utensils, 
  BarChart3, 
  CreditCard, 
  Percent, 
  Crown,
  Lock
} from "lucide-react";

export function AdminOverview() {
  const { menuItems, shifts, auditLogs, toggleMenuAvailability } = usePosStore();

  const totalCash = shifts.reduce((acc, s) => acc + s.cash_sales, 0);
  const totalCard = shifts.reduce((acc, s) => acc + s.card_sales, 0);
  const netSales = totalCash + totalCard;

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
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=1200&q=80')" }} 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C0F0A] via-[#1C0F0A]/90 to-transparent" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-5">
            <div className="flex items-center gap-5">
              <div className="bg-transparent border-2 border-amber-500/40 p-3 rounded-2xl shrink-0">
                <Crown className="h-8 w-8 text-amber-400" />
              </div>
              <div className="space-y-1.5 flex-1">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                  Owner <span className="text-[#E54D2E]">Administration, Reports</span> & Security Audit Trail
                </h1>
                {/* <p className="text-sm text-white/80 font-medium">
                  Mapped to `MenuItem`, `AuditLog`, `AppSetting`, and `SyncQueue` models
                </p> */}
              </div>
            </div>
            
            <Button
              size="lg"
              className="gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md rounded-xl font-bold shadow-md transition-colors"
              onClick={() =>
                alert("Local SQLite Snapshot (.db) & CSV Sales Report exported to local backup folder.")
              }
            >
              <Database className="h-5 w-5 text-amber-100" /> 
              Trigger Local SQLite Backup (FR-SEC-005)
            </Button>
          </div>
        </div>

        {/* Executive Summary KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Net Sales */}
          <Card className="border-orange-100 shadow-sm bg-gradient-to-br from-orange-50 to-[#FFF0E5] rounded-2xl overflow-hidden relative">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10">
              <BarChart3 className="h-32 w-32 text-[#E54D2E]" />
            </div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-xs font-bold text-orange-600/80 uppercase tracking-wider flex items-center gap-2">
                <div className="bg-orange-200 p-1.5 rounded-md"><BarChart3 className="h-4 w-4 text-[#E54D2E]" /></div>
                Total Net Sales (USD)
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 space-y-1">
              <div className="text-4xl font-black text-[#E54D2E] flex items-center gap-1">
                <span className="text-3xl opacity-80">$</span>
                {netSales.toFixed(2)}
              </div>
              <p className="text-xs font-medium text-orange-700/60">
                Reconciled across all local shifts
              </p>
            </CardContent>
          </Card>

          {/* Cash vs Card */}
          <Card className="border-emerald-100 shadow-sm bg-gradient-to-br from-emerald-50 to-[#F0FFF4] rounded-2xl">
            <CardHeader className="pb-3 border-b border-emerald-100/50">
              <CardTitle className="text-xs font-bold text-emerald-700/80 uppercase tracking-wider flex items-center gap-2">
                <div className="bg-emerald-200 p-1.5 rounded-md"><CreditCard className="h-4 w-4 text-emerald-700" /></div>
                Cash vs. Card Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex justify-between items-center font-bold text-emerald-950">
                <span className="text-sm">Cash Drawer Total:</span>
                <span className="text-lg">${totalCash.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center font-bold text-emerald-700/80">
                <span className="text-sm">Card / QR Total:</span>
                <span className="text-lg">${totalCard.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Configured Tax & Loyalty */}
          <Card className="border-blue-100 shadow-sm bg-gradient-to-br from-blue-50 to-[#F0F5FF] rounded-2xl">
            <CardHeader className="pb-3 border-b border-blue-100/50">
              <CardTitle className="text-xs font-bold text-blue-700/80 uppercase tracking-wider flex items-center gap-2">
                <div className="bg-blue-200 p-1.5 rounded-md"><Percent className="h-4 w-4 text-blue-700" /></div>
                Configured Tax & Loyalty (AppSetting)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex justify-between items-center font-bold text-blue-950">
                <span className="text-sm text-blue-800/80">Timor-Leste Service Tax:</span>
                <span className="text-lg">10.0%</span>
              </div>
              <div className="flex justify-between items-center font-bold text-blue-950">
                <span className="text-sm text-blue-800/80">Loyalty Earn Rate:</span>
                <span className="text-lg">1 pt / $1 USD</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Menu Availability Control */}
          <Card className="lg:col-span-6 border-0 shadow-sm rounded-2xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="border-b border-zinc-100 pb-4">
              <CardTitle className="text-base flex items-center gap-3 text-zinc-900">
                <div className="bg-[#E54D2E]/10 p-1.5 rounded-lg">
                  <Utensils className="h-4 w-4 text-[#E54D2E]" />
                </div>
                Live Menu Availability (&quot;86 Item&quot; Controls)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {menuItems.map((item) => {
                 // Map image based on name for aesthetic
                 let imageSrc = "https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=100&q=80"; // fallback
                 if (item.name.includes("Wagyu")) imageSrc = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&q=80";
                 if (item.name.includes("Snapper")) imageSrc = "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=100&q=80";
                 if (item.name.includes("Fries")) imageSrc = "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=100&q=80";
                 if (item.name.includes("Latte")) imageSrc = "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=100&q=80";
                 if (item.name.includes("Chicken")) imageSrc = "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=100&q=80";

                 return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-zinc-100 bg-white p-3 transition-colors hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <img src={imageSrc} alt={item.name} className="h-10 w-12 object-cover rounded-lg border border-zinc-200" />
                      <div>
                        <span className="font-bold text-sm text-zinc-900 block leading-tight">{item.name}</span>
                        <span className="text-zinc-500 font-medium text-[11px] mt-0.5 block">
                          ${item.base_price.toFixed(2)} USD • Tax {item.tax_rate}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {item.is_available ? (
                        <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-md text-xs font-bold">
                          In Stock
                        </div>
                      ) : (
                        <div className="bg-rose-50 text-[#D93025] px-3 py-1 rounded-md text-xs font-bold">
                          86&apos;d / Unavailable
                        </div>
                      )}
                      <Switch
                        checked={item.is_available}
                        onCheckedChange={() => toggleMenuAvailability(item.id)}
                        className="data-[state=checked]:bg-[#E54D2E]"
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Security Audit Log Viewer */}
          <Card className="lg:col-span-6 border-0 shadow-sm rounded-2xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="border-b border-zinc-100 pb-4">
              <CardTitle className="text-base flex items-center justify-between w-full text-zinc-900">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 p-1.5 rounded-lg">
                    <ShieldAlert className="h-4 w-4 text-amber-600" />
                  </div>
                  Sensitive Action Audit Trail (`AuditLog`)
                </div>
                <Lock className="h-4 w-4 text-amber-600/50" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="rounded-xl border border-rose-200 bg-white p-4 space-y-2 shadow-sm transition-all hover:border-rose-300 relative overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E54D2E]/80" />
                  
                  <div className="flex items-center justify-between pl-2">
                    <Badge variant="outline" className="font-mono text-[10px] font-bold bg-orange-50 text-orange-700 border-orange-200 px-2 py-0.5">
                      {log.action}
                    </Badge>
                    <span className="text-[11px] font-medium text-zinc-400">
                      {log.created_at}
                    </span>
                  </div>
                  
                  <div className="pl-2">
                    <p className="font-semibold text-zinc-900 text-sm">{log.details}</p>
                    <span className="text-[11px] text-zinc-500 font-medium block mt-1">
                      Actor: {log.user_name} ({log.role}) • Entity: {log.entity_type} ({log.entity_id})
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}