// src/components/customers/LoyaltyDirectory.tsx
"use client";

import { useState } from "react";
import { usePosStore } from "@/store/usePosStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  UserPlus, 
  Users, 
  History, 
  Crown,
  User,
  Phone,
  Mail,
  Coins,
  ChevronRight
} from "lucide-react";

export function LoyaltyDirectory() {
  const { customers, loyaltyTransactions, registerCustomer, adjustCustomerPoints } = usePosStore();
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+670 ");
  const [email, setEmail] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    registerCustomer(name.trim(), phone.trim(), email.trim() || undefined);
    setName("");
    setPhone("+670 ");
    setEmail("");
  };

  // Helper to get initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

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
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1606914501449-5a96b6ce24ca?auto=format&fit=crop&w=1200&q=80')" }} 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C0F0A] via-[#1C0F0A]/80 to-transparent" />
          
          {/* Subtle gold abstract waves overlay for premium feel */}
          <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none" />

          <div className="relative z-10 flex items-center gap-5 w-full">
            <div className="bg-transparent border-2 border-amber-500/40 p-3 rounded-2xl shrink-0">
              <Crown className="h-8 w-8 text-amber-400" />
            </div>
            <div className="flex-1 space-y-1.5">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                Customer Loyalty Programme & Points Ledger
              </h1>
              <p className="text-sm text-white/80 font-medium">
                Rule: 1 Point earned per $1.00 USD spent • 100 Points = $5.00 USD Checkout Reward
              </p>
            </div>
            
            {/* Decorative 3D Crown image on the right (Simulated with icon for now) */}
            <div className="hidden md:block shrink-0 mr-4 opacity-80">
               <Crown className="h-16 w-16 text-amber-500 drop-shadow-lg rotate-12" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Fast Customer Registration Bar */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-[#FFF5F0] to-white rounded-2xl overflow-hidden">
          <CardHeader className="pb-3 border-b border-[#FDECE4] bg-white/50">
            <CardTitle className="text-sm flex items-center gap-2 text-zinc-900">
               <div className="bg-[#E54D2E]/10 p-1.5 rounded-lg">
                 <UserPlus className="h-4 w-4 text-[#E54D2E]" />
               </div>
              Register New Loyalty Member (+50 Welcome Points)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 pb-5">
            <form onSubmit={handleRegister} className="flex flex-wrap items-center gap-4">
              
              <div className="relative flex-1 min-w-[200px]">
                <User className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="Customer Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9 h-11 text-sm rounded-xl border-zinc-200 text-zinc-900 font-medium bg-white"
                />
              </div>

              <div className="relative flex-1 min-w-[180px]">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="+670"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-9 h-11 text-sm rounded-xl border-zinc-200 text-zinc-900 font-medium bg-white"
                />
              </div>

              <div className="relative flex-1 min-w-[200px]">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="Email (Optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-11 text-sm rounded-xl border-zinc-200 text-zinc-900 font-medium bg-white"
                />
              </div>

              <Button 
                type="submit" 
                size="lg"
                className="gap-2 h-11 rounded-xl bg-[#E54D2E] hover:bg-[#D43D1F] text-white font-bold px-6 shrink-0 shadow-md"
              >
                <UserPlus className="h-4 w-4" /> Enroll Customer
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Customer Directory */}
          <Card className="lg:col-span-7 border-0 shadow-sm rounded-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-zinc-100 pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                 <div className="bg-[#E54D2E]/10 p-1.5 rounded-lg">
                   <Users className="h-4 w-4 text-[#E54D2E]" />
                 </div>
                Registered Customers (`Customer` Model)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {customers.map((c) => (
                <div
                  key={c.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-100 bg-white p-4 transition-all hover:shadow-md hover:border-zinc-200"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar Initials */}
                    <div className="h-10 w-10 rounded-full bg-rose-100 text-rose-700 font-black flex items-center justify-center shrink-0">
                      {getInitials(c.name)}
                    </div>
                    <div>
                      <span className="font-bold text-[15px] text-zinc-900 block leading-tight">{c.name}</span>
                      <span className="text-zinc-500 font-medium text-xs mt-0.5 block">
                        {c.phone_number} {c.email ? ` • ${c.email}` : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-[#E54D2E] text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                      <Coins className="h-3.5 w-3.5 fill-white/20" />
                      {c.total_points} Points (${(c.total_points * 0.05).toFixed(2)} Value)
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-xs font-bold bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg px-3"
                        onClick={() =>
                          adjustCustomerPoints(c.id, 25, "Manual goodwill bonus by Manager")
                        }
                      >
                        +25 Bonus Pts
                      </Button>
                      <ChevronRight className="h-4 w-4 text-zinc-400" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Loyalty Ledger History */}
          <Card className="lg:col-span-5 border-0 shadow-sm rounded-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-zinc-100 pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                 <div className="bg-[#E54D2E]/10 p-1.5 rounded-lg">
                   <History className="h-4 w-4 text-[#E54D2E]" />
                 </div>
                Points Ledger (`LoyaltyTransaction`)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {loyaltyTransactions.map((tx) => {
                const isEarn = tx.points >= 0;
                return (
                  <div
                    key={tx.id}
                    className={`flex items-center justify-between rounded-xl border p-4 text-sm transition-all ${
                      isEarn 
                        ? 'border-emerald-200 bg-emerald-50/50' 
                        : 'border-rose-200 bg-rose-50/50'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <Badge 
                          variant="outline" 
                          className={`text-[10px] font-bold px-2 py-0.5 ${
                            isEarn ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-rose-100 text-rose-700 border-rose-200"
                          }`}
                        >
                          {tx.type}
                        </Badge>
                        <span className="font-bold text-zinc-900">{tx.customer_name}</span>
                      </div>
                      <p className="text-zinc-500 text-xs font-medium">{tx.reason}</p>
                      <span className="text-[10px] text-zinc-400 font-medium block">
                        {tx.created_at}
                      </span>
                    </div>
                    <span
                      className={`font-black text-base ${
                        isEarn ? "text-emerald-600" : "text-[#D93025]"
                      }`}
                    >
                      {isEarn ? `+${tx.points}` : tx.points} pts
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}