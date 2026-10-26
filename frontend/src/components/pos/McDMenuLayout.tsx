/* eslint-disable react-hooks/purity */
// src/components/pos/McDMenuLayout.tsx
"use client";

import { useState } from "react";
import { usePosStore } from "@/store/usePosStore";
import { MenuItem, OrderItemModifier } from "@/types/schema";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Home,
  Coffee,
  Flame,
  Sparkles,
  ShoppingBag,
  ChevronRight,
  Ban,
  Plus,
  Fish,
  Utensils,
  ChevronUp,
} from "lucide-react";
import { OrderCartSidebar } from "./OrderCartSidebar";

export function McDMenuLayout() {
  const { categories, menuItems, cart, addToCart } = usePosStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("cat-1");
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const [selectedMods, setSelectedMods] = useState<OrderItemModifier[]>([]);
  const [notes, setNotes] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);

  const filteredItems = menuItems.filter(
    (item) => selectedCategory === "ALL" || item.category_id === selectedCategory
  );

  const totalCartItems = cart.reduce((acc, i) => acc + i.quantity, 0);
  const cartSubtotal = cart.reduce((acc, i) => acc + i.total_price, 0);

  const handleSelectMenuItem = (item: MenuItem) => {
    if (!item.is_available) return;

    if (item.modifier_groups && item.modifier_groups.length > 0) {
      setActiveItem(item);
      setSelectedMods([]);
      setNotes("");
    } else {
      addToCart({
        id: `oi-${Date.now()}`,
        menu_item_id: item.id,
        menu_item_name: item.name,
        quantity: 1,
        unit_price: item.base_price,
        total_price: item.base_price,
        applied_modifiers: [],
      });
    }
  };

  const confirmModifiers = () => {
    if (!activeItem) return;
    const modSum = selectedMods.reduce((acc, m) => acc + m.price_adjustment, 0);
    const finalUnit = Number((activeItem.base_price + modSum).toFixed(2));

    addToCart({
      id: `oi-${Date.now()}`,
      menu_item_id: activeItem.id,
      menu_item_name: activeItem.name,
      quantity: 1,
      unit_price: finalUnit,
      total_price: finalUnit,
      notes: notes.trim() || undefined,
      applied_modifiers: selectedMods,
    });
    setActiveItem(null);
  };

  const categoryIcons = [Utensils, Fish, Utensils, Coffee];

  return (
    <div className="flex h-[calc(100vh-6.5rem)] gap-6 overflow-hidden relative pt-2">
      
      {/* 1. Left-Side Vertical Navigation Sidebar (Light Theme) */}
      <div className="w-[260px] shrink-0 flex flex-col justify-between bg-white rounded-3xl overflow-hidden relative shadow-sm border border-zinc-100">
        
        <div className="p-5 relative z-10 space-y-2 flex-1 overflow-y-auto">
          <div className="px-2 py-2 text-[11px] font-extrabold uppercase tracking-widest text-zinc-400 mb-2">
            Menu Categories
          </div>
          
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${
              selectedCategory === "ALL"
                ? "bg-[#E54D2E] text-white shadow-md shadow-[#E54D2E]/20"
                : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
            }`}
          >
            <div className="flex items-center gap-3">
              <Home className="h-5 w-5 shrink-0" />
              <span>All Items</span>
            </div>
            {selectedCategory === "ALL" && <ChevronRight className="h-4 w-4" />}
          </button>
          
          {categories.map((cat, idx) => {
            const Icon = categoryIcons[idx % categoryIcons.length];
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${
                  isSelected
                    ? "bg-[#E54D2E] text-white shadow-md shadow-[#E54D2E]/20"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="leading-tight">{cat.name}</span>
                </div>
                {isSelected && <ChevronRight className="h-4 w-4 opacity-80" />}
              </button>
            );
          })}
        </div>

        {/* Decorative Bottom Area */}
        <div className="p-6 relative z-10 pt-10">
          <div className="absolute bottom-4 left-4 opacity-5 pointer-events-none scale-150 transform translate-x-4 -translate-y-4">
             <Utensils className="h-32 w-32" />
          </div>
          <div className="relative z-20">
            <h4 className="font-black text-zinc-800 text-lg leading-tight mb-1">
              Fresh Flavors
              <br/>Great Moments
            </h4>
            <div className="w-8 h-1 bg-[#E54D2E] rounded-full mt-3" />
          </div>
        </div>
      </div>

      {/* 2. Main Product Grid */}
      <div className="flex-1 flex flex-col overflow-y-auto pb-32">
        
        {/* Light Hero Banner */}
        <div className="mb-6 relative overflow-hidden rounded-3xl bg-[#FFF5F0] shadow-sm min-h-[160px] flex items-center p-8 border border-[#FDECE4]">
          <div 
            className="absolute inset-0 bg-cover bg-right opacity-90 mix-blend-multiply"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80')" }} 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFF5F0] via-[#FFF5F0]/90 to-transparent" />
          
          <div className="relative z-10 space-y-2.5">
            <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold mb-1 shadow-sm">
              <Sparkles className="h-3 w-3 fill-orange-500 text-orange-500" /> Special Promotion
            </div>
            <h2 className="text-4xl font-black tracking-tight text-zinc-900">
              Featured Menu Selection <span className="text-[#E54D2E]">& Combos</span>
            </h2>
            <p className="text-sm text-zinc-500 font-medium">
              Tap any item below to add to order • Images reflect fresh preparation
            </p>
          </div>
        </div>

        {/* Product Cards */}
        <motion.div layout className="grid grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                <Card
                  onClick={() => handleSelectMenuItem(item)}
                  className={`group relative overflow-hidden rounded-[24px] transition-all duration-300 border-zinc-100 shadow-sm bg-white flex flex-col h-full ${
                    item.is_available
                      ? "cursor-pointer hover:shadow-xl hover:border-zinc-200 hover:-translate-y-1 active:scale-[0.98]"
                      : "opacity-60 cursor-not-allowed grayscale-[0.3]"
                  }`}
                >
                  {/* Food Image Container */}
                  <div className="relative h-48 w-full overflow-hidden bg-zinc-100 shrink-0">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-zinc-300">
                        <Utensils className="h-12 w-12" />
                      </div>
                    )}
                    {/* Price Pill */}
                    <div className="absolute top-4 right-4 bg-white text-zinc-900 px-3 py-1.5 rounded-full text-sm font-black shadow-lg">
                      ${item.base_price.toFixed(2)}
                    </div>
                  </div>

                  <CardContent className="p-5 flex flex-col flex-1 gap-1.5 bg-white relative z-0">
                    <h3 className="font-bold text-[16px] leading-snug text-zinc-900 group-hover:text-[#E54D2E] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed flex-1 mt-1">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 mt-2">
                      <span className="bg-zinc-50 border border-zinc-100 text-zinc-600 px-3 py-1.5 rounded-xl text-[11px] font-bold">
                        Tax {item.tax_rate}%
                      </span>
                      {item.is_available ? (
                        <button className="bg-[#FFF0ED] text-[#E54D2E] px-4 py-1.5 rounded-xl text-[13px] font-bold flex items-center gap-1 hover:bg-[#FFE3DD] transition-colors">
                          <Plus className="h-4 w-4 stroke-[3]" /> Select
                        </button>
                      ) : (
                        <span className="flex items-center gap-1 text-zinc-400 font-bold text-xs bg-zinc-50 px-3 py-1.5 rounded-xl">
                          <Ban className="h-3 w-3" /> Sold Out
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* 3. Bottom Floating Cart Bar (Compact & Bottom Right) */}
      <div className="absolute bottom-6 right-6 w-auto min-w-[280px] max-w-[340px] z-40">
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
          <SheetTrigger className="w-full text-left cursor-pointer rounded-[20px] bg-gradient-to-r from-[#E54D2E] to-[#D43D1F] text-white px-4 py-3 shadow-2xl hover:shadow-[#E54D2E]/30 transition-transform active:scale-[0.98] block focus:outline-none">
            <div className="flex items-center justify-between gap-4">
              
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2.5 rounded-xl relative shrink-0">
                  <ShoppingBag className="h-5 w-5 text-white" strokeWidth={2.5} />
                  {totalCartItems > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-white text-[#E54D2E] h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-black shadow-sm">
                      {totalCartItems}
                    </span>
                  )}
                </div>
                <div>
                  <span className="font-bold text-[14px] block leading-tight">
                    Review Order
                  </span>
                  <span className="text-[10px] font-semibold text-white/80 mt-0.5 block">
                    {totalCartItems === 0 ? "Cart is empty" : `${totalCartItems} items added`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-black text-lg">
                  ${cartSubtotal.toFixed(2)}
                </span>
                <div className="flex items-center justify-center bg-white/20 hover:bg-white/30 transition-colors h-8 w-8 rounded-full shrink-0">
                  <ChevronUp className="h-4 w-4" />
                </div>
              </div>
              
            </div>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md p-4 flex flex-col">
            <SheetHeader className="mb-2">
              <SheetTitle>Current Order & Checkout</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-hidden flex flex-col">
              <OrderCartSidebar />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Modifier Dialog */}
      <Dialog open={!!activeItem} onOpenChange={() => setActiveItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-[#E54D2E]" />
              Customize {activeItem?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-3">
            {activeItem?.modifier_groups?.map((group) => (
              <div key={group.id} className="space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-sm font-bold text-zinc-900">
                    {group.name}
                  </span>
                  {group.is_required && (
                    <Badge variant="outline" className="text-[10px] bg-rose-50 text-rose-600 border-rose-200">Required</Badge>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  {group.modifiers.map((mod) => {
                    const isSelected = selectedMods.some((m) => m.id === mod.id);
                    return (
                      <Button
                        key={mod.id}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        className={`justify-between text-sm h-12 transition-all rounded-xl ${
                          isSelected ? "bg-[#E54D2E] text-white hover:bg-[#D43D1F]" : "text-zinc-700 hover:bg-zinc-50"
                        }`}
                        onClick={() =>
                          setSelectedMods((prev) =>
                            isSelected
                              ? prev.filter((m) => m.id !== mod.id)
                              : [...prev, { id: mod.id, name: mod.name, price_adjustment: mod.price_adjustment }]
                          )
                        }
                      >
                        <span className="font-semibold">{mod.name}</span>
                        <span className={`font-bold shrink-0 ml-1 ${isSelected ? "text-white" : "text-zinc-500"}`}>
                          +${mod.price_adjustment.toFixed(2)}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Special Instructions
              </label>
              <Input
                placeholder="e.g., No onions, extra crispy..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-11 text-sm bg-zinc-50 rounded-xl"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t">
            <Button variant="ghost" className="rounded-xl font-bold text-zinc-500" onClick={() => setActiveItem(null)}>
              Cancel
            </Button>
            <Button className="rounded-xl font-bold bg-[#E54D2E] hover:bg-[#D43D1F] text-white px-8" onClick={confirmModifiers}>
              Add to Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}