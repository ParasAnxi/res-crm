// src/components/inventory/StockLedgerView.tsx
"use client";
import { useState } from "react";
import { usePosStore } from "@/store/usePosStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  AlertTriangle, 
  PlusCircle, 
  Flame,
  PackageCheck,
  ClipboardList,
  History,
  Box
} from "lucide-react";

export function StockLedgerView() {
  const { inventory, stockMovements, recordStockAdjustment } = usePosStore();
  const [selectedItemId, setSelectedItemId] = useState(inventory[0]?.id || "");
  const [qty, setQty] = useState("5");
  const [reason, setReason] = useState("");

  const handleAdjust = (type: "PURCHASE_ADD" | "WASTAGE") => {
    const parsed = parseFloat(qty);
    if (!selectedItemId || isNaN(parsed) || parsed <= 0) return;

    recordStockAdjustment(
      selectedItemId,
      type,
      parsed,
      reason.trim() || (type === "PURCHASE_ADD" ? "Supplier restock delivery" : "Kitchen spoilage / wastage")
    );
    setReason("");
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
          
          <div className="relative z-10 flex items-center gap-4 w-full">
            <div className="bg-transparent border-2 border-white/20 p-2.5 rounded-xl shrink-0">
              <Box className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 space-y-1">
              <h1 className="text-2xl font-black tracking-tight">
                Inventory, Recipes & Stock Movement Ledger
              </h1>
              {/* <p className="text-sm text-white/80 font-medium">
                Mapped to `InventoryItem`, `RecipeIngredient`, and immutable `StockMovement` models
              </p> */}
            </div>
          </div>
        </div>

        {/* Quick Purchase Restock / Wastage Bar */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-[#FFF5F0] to-white rounded-2xl overflow-hidden">
          <CardHeader className="pb-3 border-b border-[#FDECE4] bg-white/50">
            <CardTitle className="text-sm flex items-center gap-2">
               <div className="bg-[#E54D2E] p-1.5 rounded-lg">
                 <PackageCheck className="h-4 w-4 text-white" />
               </div>
              Quick Stock Adjustment (Purchase Intake or Spoilage/Wastage)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3 pt-5 pb-5">
            <select
              className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-700 min-w-[240px] focus:ring-2 focus:ring-[#E54D2E]/20"
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
            >
              {inventory.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.current_stock} {item.unit_of_measure})
                </option>
              ))}
            </select>
            <Input
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              placeholder="Qty"
              className="w-24 h-11 text-sm rounded-xl border-zinc-200 text-center font-bold text-zinc-900"
            />
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Supplier Invoice # or Wastage Reason..."
              className="flex-1 min-w-[220px] h-11 text-sm rounded-xl border-zinc-200 text-zinc-700"
            />
            <Button
              size="lg"
              className="gap-2 h-11 rounded-xl bg-[#E54D2E] hover:bg-[#D43D1F] text-white font-bold px-6"
              onClick={() => handleAdjust("PURCHASE_ADD")}
            >
              <PlusCircle className="h-4 w-4 stroke-[2.5]" /> Record Purchase (+Stock)
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 h-11 rounded-xl border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 font-bold px-6"
              onClick={() => handleAdjust("WASTAGE")}
            >
              <Flame className="h-4 w-4" /> Log Wastage (-Stock)
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Ingredient Catalogue Table */}
          <Card className="lg:col-span-7 border-0 shadow-sm rounded-2xl">
            <CardHeader className="border-b border-zinc-100 pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                 <div className="bg-[#E54D2E] p-1.5 rounded-lg">
                   <ClipboardList className="h-4 w-4 text-white" />
                 </div>
                Ingredient & Stock Catalogue
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-100 text-left text-zinc-500 bg-zinc-50/50">
                      <th className="py-3 px-6 font-semibold font-mono text-xs uppercase tracking-wider">SKU / Ingredient</th>
                      <th className="py-3 px-4 font-semibold font-mono text-xs uppercase tracking-wider">Current Stock</th>
                      <th className="py-3 px-4 font-semibold font-mono text-xs uppercase tracking-wider">Min Level</th>
                      <th className="py-3 px-4 font-semibold font-mono text-xs uppercase tracking-wider">Unit Cost</th>
                      <th className="py-3 px-6 font-semibold font-mono text-xs uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {inventory.map((item) => {
                      const isLow = item.current_stock <= item.min_stock_level;
                      
                      // Map image based on name for aesthetic
                      let imageSrc = "https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=100&q=80"; // default box
                      if (item.name.includes("Wagyu")) imageSrc = "https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=100&q=80";
                      if (item.name.includes("Snapper")) imageSrc = "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=100&q=80";
                      if (item.name.includes("Arabica")) imageSrc = "https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=100&q=80";
                      if (item.name.includes("Buns")) imageSrc = "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&q=80";

                      return (
                        <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors">
                          <td className="py-4 px-6 flex items-center gap-3">
                            <img src={imageSrc} className="w-10 h-10 rounded-full object-cover border border-zinc-200" alt={item.name} />
                            <div>
                               <span className="font-bold text-zinc-900 block">{item.name}</span>
                               <span className="text-[11px] font-mono text-zinc-400">
                                 {item.sku}
                               </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-bold text-zinc-900">
                            {item.current_stock} <span className="text-zinc-500 font-medium text-xs">{item.unit_of_measure}</span>
                          </td>
                          <td className="py-4 px-4 text-zinc-400 font-medium">
                            {item.min_stock_level} <span className="text-xs">{item.unit_of_measure}</span>
                          </td>
                          <td className="py-4 px-4 font-mono font-medium text-zinc-700">
                             ${item.cost_per_unit.toFixed(2)}
                          </td>
                          <td className="py-4 px-6">
                            {isLow ? (
                              <Badge variant="outline" className="gap-1 text-[11px] bg-rose-50 text-rose-600 border-rose-200 font-bold px-2 py-0.5">
                                <AlertTriangle className="h-3 w-3" /> Low Stock
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-[11px] bg-emerald-50 text-emerald-600 border-emerald-200 font-bold px-2 py-0.5">
                                Healthy
                              </Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Immutable Stock Movement Ledger */}
          <Card className="lg:col-span-5 border-0 shadow-sm rounded-2xl">
            <CardHeader className="border-b border-zinc-100 pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                 <div className="bg-[#E54D2E] p-1.5 rounded-lg">
                   <History className="h-4 w-4 text-white" />
                 </div>
                Auditable Stock Movements
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {stockMovements.map((mov) => {
                 
                 let badgeStyle = "bg-zinc-100 text-zinc-700 border-zinc-200";
                 if(mov.type === "SALE_DEDUCTION" || mov.type === "WASTAGE") badgeStyle = "bg-rose-50 text-rose-600 border-rose-100";
                 if(mov.type === "PURCHASE_ADD") badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-100";

                 return (
                  <div
                    key={mov.id}
                    className={`flex items-start justify-between rounded-xl border p-4 text-sm transition-all ${
                       mov.type === 'SALE_DEDUCTION' || mov.type === 'WASTAGE' ? 'border-rose-100 bg-white' : 'border-emerald-100 bg-white'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-bold px-2 py-0.5 ${badgeStyle}`}
                        >
                          {mov.type}
                        </Badge>
                        <span className="font-bold text-zinc-900">{mov.inventory_item_name}</span>
                      </div>
                      <p className="text-zinc-500 text-xs font-medium">{mov.reason}</p>
                      <span className="block text-[10px] text-zinc-400 font-medium">
                        Manager: {mov.created_by.split(': ')[1]} • {mov.created_at}
                      </span>
                    </div>
                    <span
                      className={`font-mono font-black text-base ${
                        mov.quantity > 0 ? "text-emerald-600" : "text-[#D93025]"
                      }`}
                    >
                      {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity}
                    </span>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}