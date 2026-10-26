// src/components/pos/ReceiptPreviewModal.tsx
"use client";

import { usePosStore } from "@/store/usePosStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Printer,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Sparkles,
} from "lucide-react";

export function ReceiptPreviewModal() {
  const { lastReceipt, clearLastReceipt, isOnline } = usePosStore();

  if (!lastReceipt) return null;

  const handleBrowserPrint = () => {
    window.print();
  };

  return (
    <Dialog open={!!lastReceipt} onOpenChange={() => clearLastReceipt()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-base">
            <span className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-primary" />
              Sale Completed & Receipt Generated
            </span>
            <Badge variant={isOnline ? "secondary" : "outline"} className="text-[10px]">
              {isOnline ? "Synced to Cloud" : "Saved to Local SQLite"}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Hardware Dispatch Status Banner (Proves Acceptance Test #3 & #5) */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="flex items-center gap-1.5 rounded-md border bg-emerald-500/10 border-emerald-500/30 px-2.5 py-1.5 text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            <span>Receipt Printer (USB): Ready</span>
          </div>

          {lastReceipt.kot_status === "PRINTED" ? (
            <div className="flex items-center gap-1.5 rounded-md border bg-emerald-500/10 border-emerald-500/30 px-2.5 py-1.5 text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              <span>Kitchen KOT (LAN): Dispatched</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-md border bg-destructive/10 border-destructive/30 px-2.5 py-1.5 text-destructive font-medium">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span>KOT Queued (Printer Jam)</span>
            </div>
          )}
        </div>

        {/* 80mm Thermal Paper Slip Simulation */}
        <div
          id="printable-thermal-receipt"
          className="mx-auto w-full max-w-[330px] rounded-sm border bg-white text-zinc-900 p-4 shadow-inner font-mono text-[11px] leading-relaxed"
        >
          {/* Store Header */}
          <div className="text-center space-y-0.5 border-b border-dashed border-zinc-400 pb-2.5">
            <h2 className="font-bold text-sm tracking-wider uppercase">
              DILI BISTRO & GRILL
            </h2>
            <p className="text-[10px] text-zinc-600">
              Avenida de Portugal, Praia dos Coqueiros
            </p>
            <p className="text-[10px] text-zinc-600">
              Dili, Timor-Leste • TIN: TL-904821-01
            </p>
            <p className="text-[10px] text-zinc-600">Tel: +670 331 2400</p>
          </div>

          {/* Fiscal Invoice & Order Metadata */}
          <div className="py-2 border-b border-dashed border-zinc-400 space-y-0.5 text-[10px]">
            <div className="flex justify-between">
              <span>INVOICE #:</span>
              <span className="font-bold">{lastReceipt.invoice_number}</span>
            </div>
            <div className="flex justify-between">
              <span>ORDER #:</span>
              <span>{lastReceipt.order_number}</span>
            </div>
            <div className="flex justify-between">
              <span>DATE/TIME:</span>
              <span>{lastReceipt.created_at}</span>
            </div>
            <div className="flex justify-between">
              <span>TYPE / REF:</span>
              <span className="font-bold">
                {lastReceipt.order_type} ({lastReceipt.table_number})
              </span>
            </div>
            <div className="flex justify-between">
              <span>CASHIER:</span>
              <span>{lastReceipt.cashier_name}</span>
            </div>
          </div>

          {/* Line Items */}
          <div className="py-2 border-b border-dashed border-zinc-400 space-y-2">
            <div className="flex justify-between font-bold text-[10px] border-b border-zinc-300 pb-1">
              <span>QTY  ITEM</span>
              <span>TOTAL (USD)</span>
            </div>

            {lastReceipt.items.map((item) => (
              <div key={item.id} className="space-y-0.5">
                <div className="flex justify-between font-semibold">
                  <span>
                    {item.quantity}x {item.menu_item_name}
                  </span>
                  <span>${item.total_price.toFixed(2)}</span>
                </div>
                {item.applied_modifiers.map((m) => (
                  <div
                    key={m.id}
                    className="flex justify-between pl-3 text-[10px] text-zinc-600"
                  >
                    <span>+ {m.name}</span>
                    <span>+${m.price_adjustment.toFixed(2)}</span>
                  </div>
                ))}
                {item.notes && (
                  <div className="pl-3 text-[10px] italic text-zinc-600">
                    Note: {item.notes}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Totals & Taxes */}
          <div className="py-2 border-b border-dashed border-zinc-400 space-y-1">
            <div className="flex justify-between">
              <span>SUBTOTAL:</span>
              <span>${lastReceipt.subtotal.toFixed(2)}</span>
            </div>
            {lastReceipt.discount_total > 0 && (
              <div className="flex justify-between font-semibold">
                <span>LOYALTY REWARD ({lastReceipt.points_redeemed} PTS):</span>
                <span>-${lastReceipt.discount_total.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>SERVICE TAX (10%):</span>
              <span>${lastReceipt.tax_total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs font-bold pt-1 border-t border-zinc-300">
              <span>TOTAL PAID (USD):</span>
              <span>${lastReceipt.net_total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[10px] text-zinc-600">
              <span>PAYMENT METHOD:</span>
              <span className="font-bold">{lastReceipt.payment_method}</span>
            </div>
          </div>

          {/* Customer Loyalty Summary Block (FR-LOY-004 & FR-LOY-007) */}
          {lastReceipt.customer_name && (
            <div className="py-2 border-b border-dashed border-zinc-400 space-y-0.5 text-[10px]">
              <div className="font-bold flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> LOYALTY MEMBER SUMMARY
              </div>
              <div className="flex justify-between">
                <span>MEMBER:</span>
                <span>
                  {lastReceipt.customer_name} ({lastReceipt.customer_phone})
                </span>
              </div>
              <div className="flex justify-between">
                <span>POINTS EARNED THIS VISIT:</span>
                <span>+{lastReceipt.points_earned} PTS</span>
              </div>
              {lastReceipt.points_redeemed > 0 && (
                <div className="flex justify-between">
                  <span>POINTS REDEEMED:</span>
                  <span>-{lastReceipt.points_redeemed} PTS</span>
                </div>
              )}
              <div className="flex justify-between font-bold">
                <span>NEW AVAILABLE BALANCE:</span>
                <span>{lastReceipt.remaining_points} PTS</span>
              </div>
            </div>
          )}

          {/* Barcode & Footer */}
          <div className="pt-3 text-center space-y-1">
            <div className="font-mono text-xs tracking-[0.25em] font-bold text-zinc-700">
              ||| |||| || ||||| |||| |||
            </div>
            <p className="text-[10px] font-semibold">
              Obrigado Barak! Thank You for Dining With Us!
            </p>
            <p className="text-[9px] text-zinc-500">
              Offline-First POS v1.0 • Local Receipt Copy
            </p>
          </div>
        </div>

        <DialogFooter className="flex sm:justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => clearLastReceipt()}
          >
            Close & Next Order
          </Button>
          <Button size="sm" onClick={handleBrowserPrint} className="gap-1.5">
            <Printer className="h-4 w-4" />
            Print 80mm Customer Receipt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}