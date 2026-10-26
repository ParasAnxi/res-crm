// src/components/pos/OrderCartSidebar.tsx
"use client";

import { usePosStore } from "@/store/usePosStore";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  UserCheck,
  Trash2,
  Banknote,
  CreditCard,
  Gift,
  Minus,
  Plus,
  ShoppingBag,
  Store,
  Bike,
  Package
} from "lucide-react";

export function OrderCartSidebar() {
  const {
    activeOrderType,
    tableNumber,
    selectedCustomer,
    customers,
    cart,
    pointsRedeemed,
    setOrderType,
    setTableNumber,
    selectCustomer,
    toggleRedeemPoints,
    updateQuantity,
    clearCart,
    confirmOrderAndDispatchKOT,
  } = usePosStore();

  const subtotal = cart.reduce((acc, item) => acc + item.total_price, 0);
  const discountTotal = pointsRedeemed > 0 ? Number((pointsRedeemed * 0.05).toFixed(2)) : 0;
  const taxableAmount = Math.max(0, subtotal - discountTotal);
  const taxTotal = Number((taxableAmount * 0.10).toFixed(2));
  const netTotal = Number((taxableAmount + taxTotal).toFixed(2));

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden">
      
      {/* Order Type & Table Selector */}
      <div className="p-5 border-b border-zinc-100 space-y-4 bg-zinc-50/50">
        <div className="grid grid-cols-3 gap-2 rounded-xl bg-zinc-100 p-1.5">
          {(['DINE_IN', 'TAKEAWAY', 'DELIVERY'] as const).map((type) => {
            const icons = { DINE_IN: Store, TAKEAWAY: Package, DELIVERY: Bike };
            const Icon = icons[type];
            return (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-[11px] font-bold transition-all ${
                  activeOrderType === type
                    ? "bg-white text-zinc-900 shadow-sm scale-100"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {type.replace("_", " ")}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <Input
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            placeholder="Table / Ref"
            className="h-11 text-sm font-bold w-28 bg-white border-zinc-200 rounded-xl focus:border-[#E54D2E] focus:ring-[#E54D2E]/20 text-center"
          />
          <select
            className="flex-1 h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-600 focus:ring-2 focus:ring-[#E54D2E]/20"
            value={selectedCustomer?.id || ""}
            onChange={(e) => {
              const found = customers.find((c) => c.id === e.target.value) || null;
              selectCustomer(found);
            }}
          >
            <option value="">+ Attach Customer...</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.total_points} pts)
              </option>
            ))}
          </select>
        </div>

        {selectedCustomer && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between rounded-xl bg-orange-50 border border-orange-100 px-4 py-3 text-sm"
          >
            <div className="flex items-center gap-3">
              <div className="bg-orange-200 p-1.5 rounded-md">
                <UserCheck className="h-4 w-4 text-orange-700" />
              </div>
              <div>
                <span className="font-bold text-orange-950 block leading-tight">{selectedCustomer.name}</span>
                <span className="text-[11px] font-bold text-orange-700/70">{selectedCustomer.total_points} pts available</span>
              </div>
            </div>
            {selectedCustomer.total_points >= 100 && (
              <Button
                size="sm"
                variant={pointsRedeemed > 0 ? "default" : "outline"}
                className={`h-8 text-xs px-3 font-bold rounded-lg shadow-none ${
                  pointsRedeemed > 0 
                    ? "bg-[#E54D2E] hover:bg-[#D43D1F] text-white border-transparent" 
                    : "bg-white text-orange-700 border-orange-200 hover:bg-orange-100"
                }`}
                onClick={() => toggleRedeemPoints(pointsRedeemed > 0 ? 0 : 100)}
              >
                <Gift className="h-3.5 w-3.5 mr-1.5" />
                {pointsRedeemed > 0 ? "-$5 Applied" : "Redeem $5"}
              </Button>
            )}
          </motion.div>
        )}
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-white">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-zinc-500 space-y-3">
            <div className="rounded-full bg-zinc-100 p-5">
              <ShoppingBag className="h-10 w-10 text-zinc-300" />
            </div>
            <div>
              <p className="font-bold text-zinc-900 text-lg">Your cart is empty</p>
              <p className="text-sm font-medium mt-1">Tap menu items to add them here.</p>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.15 }}
                className="rounded-2xl border border-zinc-100 bg-white p-4 space-y-3 shadow-sm hover:border-[#E54D2E]/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <span className="font-bold text-zinc-900 text-sm">{item.menu_item_name}</span>
                    {item.applied_modifiers.map((m) => (
                      <span key={m.id} className="block text-[11px] font-medium text-zinc-500 mt-0.5">
                        + {m.name} (${m.price_adjustment.toFixed(2)})
                      </span>
                    ))}
                    {item.notes && (
                      <span className="block text-[11px] font-bold text-[#E54D2E] mt-1 bg-rose-50 px-2 py-0.5 rounded-md w-fit">
                        Note: {item.notes}
                      </span>
                    )}
                  </div>
                  <span className="font-black text-sm text-zinc-900">
                    ${item.total_price.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                  <span className="text-xs font-bold text-zinc-400">
                    ${item.unit_price.toFixed(2)} / ea
                  </span>
                  <div className="flex items-center gap-1.5 bg-zinc-100 rounded-xl p-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 rounded-lg hover:bg-white hover:shadow-sm text-zinc-600 bg-transparent"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <span className="w-8 text-center font-bold text-sm text-zinc-900">{item.quantity}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 rounded-lg hover:bg-white hover:shadow-sm text-zinc-600 bg-transparent"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer & Payment Action Bar */}
      <div className="border-t border-zinc-100 bg-zinc-50/80 p-5 space-y-4">
        <div className="space-y-2 text-sm font-medium">
          <div className="flex justify-between text-zinc-500">
            <span>Subtotal</span>
            <span className="font-bold text-zinc-900">${subtotal.toFixed(2)}</span>
          </div>
          {discountTotal > 0 && (
            <div className="flex justify-between text-[#E54D2E] font-bold">
              <span>Loyalty Discount</span>
              <span>-${discountTotal.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-zinc-500">
            <span>Service Tax (10%)</span>
            <span className="font-bold text-zinc-900">${taxTotal.toFixed(2)}</span>
          </div>
          <Separator className="my-3 bg-zinc-200" />
          <div className="flex justify-between text-lg font-black text-zinc-900">
            <span>Total Payable</span>
            <span className="text-[#E54D2E] text-2xl">${netTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            className="w-full gap-2 h-14 rounded-xl text-sm font-bold bg-[#E54D2E] hover:bg-[#D43D1F] text-white shadow-lg shadow-[#E54D2E]/20 transition-transform active:scale-[0.98]"
            disabled={cart.length === 0}
            onClick={() => confirmOrderAndDispatchKOT("CASH")}
          >
            <Banknote className="h-5 w-5" />
            Pay Cash
          </Button>
          <Button
            variant="outline"
            className="w-full gap-2 h-14 rounded-xl text-sm font-bold bg-white border-zinc-200 text-zinc-800 hover:bg-zinc-50 shadow-sm transition-transform active:scale-[0.98]"
            disabled={cart.length === 0}
            onClick={() => confirmOrderAndDispatchKOT("CARD")}
          >
            <CreditCard className="h-5 w-5" />
            Card / QR
          </Button>
        </div>

        {cart.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="w-full h-10 rounded-xl text-sm font-bold text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors mt-2"
          >
            <Trash2 className="h-4 w-4 mr-2" /> Clear Active Ticket
          </Button>
        )}
      </div>
    </div>
  );
}