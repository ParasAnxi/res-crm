/* eslint-disable react-hooks/purity */
// src/components/pos/MenuGrid.tsx
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
import { Search, Plus, Ban, Sparkles } from "lucide-react";

export function MenuGrid() {
  const { categories, menuItems, addToCart } = usePosStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const [selectedMods, setSelectedMods] = useState<OrderItemModifier[]>([]);
  const [notes, setNotes] = useState("");

  const filteredItems = menuItems.filter((item) => {
    const matchesCat = selectedCategory === "ALL" || item.category_id === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

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

  return (
    <div className="flex flex-col h-full gap-5">
      {/* Search & Category Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-card p-3 rounded-xl border shadow-xs">
        <div className="flex flex-wrap gap-1.5">
          <Button
            size="sm"
            variant={selectedCategory === "ALL" ? "default" : "ghost"}
            className="rounded-lg text-xs font-semibold transition-all"
            onClick={() => setSelectedCategory("ALL")}
          >
            All Items
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              size="sm"
              variant={selectedCategory === cat.id ? "default" : "ghost"}
              className="rounded-lg text-xs font-semibold transition-all"
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search menu or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 bg-muted/40 border-transparent focus:border-primary transition-all text-xs rounded-lg"
          />
        </div>
      </div>

      {/* Animated Menu Item Grid */}
      <motion.div
        layout
        className="grid grid-cols-2 xl:grid-cols-3 gap-4 pb-4"
      >
        <AnimatePresence>
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                onClick={() => handleSelectMenuItem(item)}
                className={`group relative overflow-hidden transition-all duration-300 border ${
                  item.is_available
                    ? "cursor-pointer hover:border-primary/60 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
                    : "opacity-50 cursor-not-allowed bg-muted/30"
                }`}
              >
                {/* Subtle top accent bar on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />

                <CardContent className="p-4 flex flex-col justify-between h-full gap-3">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-sm leading-snug group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      <Badge
                        variant={item.is_available ? "secondary" : "destructive"}
                        className="shrink-0 font-mono font-bold text-xs px-2 py-0.5 shadow-2xs"
                      >
                        ${item.base_price.toFixed(2)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/60 text-[11px] text-muted-foreground font-medium">
                    <span>Tax: {item.tax_rate}%</span>
                    {item.is_available ? (
                      <span className="flex items-center gap-1 text-primary font-semibold group-hover:translate-x-0.5 transition-transform">
                        <Plus className="h-3.5 w-3.5" /> Add
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-destructive font-semibold">
                        <Ban className="h-3.5 w-3.5" /> Sold Out
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Modifier Dialog with Smooth Animation */}
      <Dialog open={!!activeItem} onOpenChange={() => setActiveItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-primary" />
              {activeItem?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {activeItem?.modifier_groups?.map((group) => (
              <div key={group.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {group.name}
                  </span>
                  {group.is_required && (
                    <Badge variant="outline" className="text-[10px]">Required</Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {group.modifiers.map((mod) => {
                    const isSelected = selectedMods.some((m) => m.id === mod.id);
                    return (
                      <Button
                        key={mod.id}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        className={`justify-between text-xs h-10 transition-all ${
                          isSelected ? "shadow-md ring-2 ring-primary/20" : ""
                        }`}
                        onClick={() =>
                          setSelectedMods((prev) =>
                            isSelected
                              ? prev.filter((m) => m.id !== mod.id)
                              : [...prev, { id: mod.id, name: mod.name, price_adjustment: mod.price_adjustment }]
                          )
                        }
                      >
                        <span className="truncate">{mod.name}</span>
                        <span className="font-mono font-bold shrink-0 ml-1">
                          +${mod.price_adjustment.toFixed(2)}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Kitchen Prep Note (KOT Instructions)
              </label>
              <Input
                placeholder="e.g., No onions, extra dressing..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-9 text-xs bg-muted/40"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setActiveItem(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={confirmModifiers}>
              Add to Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}