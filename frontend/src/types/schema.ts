// src/types/schema.ts
export type OrderType = 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
export type OrderStatus = 'DRAFT' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
export type PrintStatus = 'PENDING' | 'PRINTED' | 'FAILED';

export interface Modifier {
  id: string;
  group_id: string;
  name: string;
  price_adjustment: number;
}

export interface ModifierGroup {
  id: string;
  name: string;
  is_required: boolean;
  modifiers: Modifier[];
}

// Update MenuItem in src/types/schema.ts
export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  base_price: number;
  tax_rate: number;
  is_available: boolean;
  is_active: boolean;
  image_url?: string; // <--- Added for McD style image cards
  modifier_groups?: ModifierGroup[];
}

export interface OrderItemModifier {
  id: string;
  name: string;
  price_adjustment: number;
}

export interface OrderItem {
  id: string;
  menu_item_id: string;
  menu_item_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes?: string;
  applied_modifiers: OrderItemModifier[];
}

export interface KitchenPrintJob {
  id: string;
  order_id: string;
  order_number: string;
  table_number?: string;
  order_type: OrderType;
  items: OrderItem[];
  status: PrintStatus;
  retry_count: number;
  created_at: string;
  printed_at?: string;
  error_log?: string;
}

export interface Customer {
  id: string;
  phone_number: string;
  name: string;
  email?: string;
  total_points: number;
}

export interface LoyaltyTransaction {
  id: string;
  customer_id: string;
  customer_name: string;
  order_id?: string;
  type: 'EARN' | 'REDEEM' | 'REFUND_REVERSAL' | 'MANUAL_ADJUST';
  points: number;
  reason?: string;
  created_at: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  unit_of_measure: 'KG' | 'LITER' | 'PIECE' | 'GRAM';
  current_stock: number;
  min_stock_level: number;
  cost_per_unit: number;
}

export interface StockMovement {
  id: string;
  inventory_item_id: string;
  inventory_item_name: string;
  type: 'SALE_DEDUCTION' | 'PURCHASE_ADD' | 'WASTAGE' | 'MANUAL_ADJUST';
  quantity: number;
  reason?: string;
  reference_id?: string;
  created_by: string;
  created_at: string;
}

export interface ShiftRecord {
  id: string;
  user_name: string;
  opened_at: string;
  closed_at?: string;
  opening_balance: number;
  cash_sales: number;
  card_sales: number;
  closing_balance?: number;
  status: 'OPEN' | 'CLOSED' | 'RECONCILED';
}

export interface AuditLogEntry {
  id: string;
  user_name: string;
  role: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: string;
  created_at: string;
}

// Add to the bottom of src/types/schema.ts

export interface ReceiptSnapshot {
  invoice_number: string;
  order_number: string;
  order_type: OrderType;
  table_number: string;
  cashier_name: string;
  payment_method: 'CASH' | 'CARD' | 'LOYALTY_POINTS';
  created_at: string;
  items: OrderItem[];
  subtotal: number;
  discount_total: number;
  tax_total: number;
  net_total: number;
  customer_name?: string;
  customer_phone?: string;
  points_redeemed: number;
  points_earned: number;
  remaining_points?: number;
  kot_status: PrintStatus;
}