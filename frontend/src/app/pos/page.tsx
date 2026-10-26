// src/app/pos/page.tsx
import { McDMenuLayout } from "@/components/pos/McDMenuLayout";
import { ReceiptPreviewModal } from "@/components/pos/ReceiptPreviewModal";

export default function PosTerminalPage() {
  return (
    <>
      <McDMenuLayout />
      <ReceiptPreviewModal />
    </>
  );
}