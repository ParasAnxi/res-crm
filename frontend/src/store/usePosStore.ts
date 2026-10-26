// src/store/usePosStore.ts
import { create } from 'zustand';
import {
  MenuItem,
  OrderItem,
  OrderType,
  KitchenPrintJob,
  Customer,
  InventoryItem,
  StockMovement,
  LoyaltyTransaction,
  ShiftRecord,
  AuditLogEntry,
  ReceiptSnapshot,
} from '@/types/schema';

interface PosState {
  isOnline: boolean;
  printerErrorSimulated: boolean;
  unsyncedQueueCount: number;
  toggleOnlineMode: () => void;
  togglePrinterError: () => void;

  activeOrderType: OrderType;
  tableNumber: string;
  selectedCustomer: Customer | null;
  cart: OrderItem[];
  pointsRedeemed: number;
  lastReceipt: ReceiptSnapshot | null;

  categories: { id: string; name: string }[];
  menuItems: MenuItem[];
  kitchenPrintJobs: KitchenPrintJob[];
  customers: Customer[];
  loyaltyTransactions: LoyaltyTransaction[];
  inventory: InventoryItem[];
  stockMovements: StockMovement[];
  shifts: ShiftRecord[];
  auditLogs: AuditLogEntry[];

  setOrderType: (type: OrderType) => void;
  setTableNumber: (table: string) => void;
  selectCustomer: (customer: Customer | null) => void;
  toggleRedeemPoints: (points: number) => void;
  addToCart: (item: OrderItem) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  clearLastReceipt: () => void;
  confirmOrderAndDispatchKOT: (paymentMethod: 'CASH' | 'CARD' | 'LOYALTY_POINTS') => void;
  retryKitchenPrint: (jobId: string) => void;
  toggleMenuAvailability: (menuItemId: string) => void;
  recordStockAdjustment: (
    itemId: string,
    type: 'PURCHASE_ADD' | 'WASTAGE' | 'MANUAL_ADJUST',
    qtyDelta: number,
    reason: string
  ) => void;
  registerCustomer: (name: string, phone: string, email?: string) => void;
  adjustCustomerPoints: (customerId: string, pointsDelta: number, reason: string) => void;
  reconcileCurrentShift: (countedCash: number) => void;
}

export const usePosStore = create<PosState>((set, get) => ({
  isOnline: true,
  printerErrorSimulated: false,
  unsyncedQueueCount: 0,

  toggleOnlineMode: () =>
    set((s) => ({
      isOnline: !s.isOnline,
      unsyncedQueueCount: !s.isOnline ? 0 : s.unsyncedQueueCount,
    })),

  togglePrinterError: () =>
    set((s) => ({ printerErrorSimulated: !s.printerErrorSimulated })),

  activeOrderType: 'DINE_IN',
  tableNumber: 'T-04',
  selectedCustomer: null,
  cart: [],
  pointsRedeemed: 0,
  lastReceipt: null,

  categories: [
    { id: 'cat-1', name: 'Burgers & Mains' },
    { id: 'cat-2', name: 'Timor Grill & Seafood' },
    { id: 'cat-3', name: 'Sides & Starters' },
    { id: 'cat-4', name: 'Artisan Coffee & Drinks' },
  ],

  // Inside src/store/usePosStore.ts (replace menuItems array)
  menuItems: [
    {
      id: 'm-1',
      category_id: 'cat-1',
      name: 'Double Smash Wagyu Burger',
      description: 'Double patty, aged cheddar, house smoky sauce, brioche bun',
      base_price: 12.5,
      tax_rate: 10,
      is_available: true,
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80',
      modifier_groups: [
        {
          id: 'mg-1',
          name: 'Cooking & Add-ons',
          is_required: false,
          modifiers: [
            { id: 'mod-1', group_id: 'mg-1', name: 'Extra Cheddar Slice', price_adjustment: 1.5 },
            { id: 'mod-2', group_id: 'mg-1', name: 'Crispy Bacon Strip', price_adjustment: 2.0 },
            { id: 'mod-3', group_id: 'mg-1', name: 'Gluten-Free Bun', price_adjustment: 1.5 },
          ],
        },
      ],
    },
    {
      id: 'm-2',
      category_id: 'cat-2',
      name: 'Dili Lime & Chili Grilled Snapper',
      description: 'Fresh local catch, charred lime, garlic herb butter, steamed rice',
      base_price: 16.0,
      tax_rate: 10,
      is_available: true,
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=500&q=80',
      modifier_groups: [
        {
          id: 'mg-2',
          name: 'Spice Level',
          is_required: true,
          modifiers: [
            { id: 'mod-4', group_id: 'mg-2', name: 'Mild Herb', price_adjustment: 0 },
            { id: 'mod-5', group_id: 'mg-2', name: 'Timor Ai-Manas (Extra Spicy)', price_adjustment: 0.5 },
          ],
        },
      ],
    },
    {
      id: 'm-3',
      category_id: 'cat-3',
      name: 'Truffle Parmesan Fries',
      description: 'Hand-cut Russet fries, white truffle oil, grated parmesan',
      base_price: 6.5,
      tax_rate: 10,
      is_available: true,
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 'm-4',
      category_id: 'cat-4',
      name: 'Iced Maubisse Single-Origin Latte',
      description: 'Organic Timor-Leste highland espresso over cold milk',
      base_price: 4.25,
      tax_rate: 10,
      is_available: true,
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=500&q=80',
      modifier_groups: [
        {
          id: 'mg-3',
          name: 'Milk Choice',
          is_required: false,
          modifiers: [
            { id: 'mod-6', group_id: 'mg-3', name: 'Oat Milk', price_adjustment: 0.75 },
            { id: 'mod-7', group_id: 'mg-3', name: 'Extra Espresso Shot', price_adjustment: 1.0 },
          ],
        },
      ],
    },
    {
      id: 'm-5',
      category_id: 'cat-2',
      name: 'Charcoal Peri-Peri Half Chicken',
      description: '24-hour marinated chicken, house slaw, charred corn',
      base_price: 14.0,
      tax_rate: 10,
      is_available: false,
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=500&q=80',
    },
  ],

  kitchenPrintJobs: [
    {
      id: 'kot-101',
      order_id: 'ord-990',
      order_number: 'ORD-2026-1023-018',
      table_number: 'T-02',
      order_type: 'DINE_IN',
      status: 'FAILED',
      retry_count: 1,
      created_at: '2 mins ago',
      error_log: 'ESC/POS LAN Timeout at 192.168.1.200:9100 (Paper Jam / Cover Open)',
      items: [
        {
          id: 'oi-1',
          menu_item_id: 'm-1',
          menu_item_name: 'Double Smash Wagyu Burger',
          quantity: 2,
          unit_price: 14.0,
          total_price: 28.0,
          notes: 'No pickles on 1 burger',
          applied_modifiers: [{ id: 'mod-1', name: 'Extra Cheddar Slice', price_adjustment: 1.5 }],
        },
      ],
    },
    {
      id: 'kot-100',
      order_id: 'ord-989',
      order_number: 'ORD-2026-1023-017',
      table_number: 'TAKEAWAY',
      order_type: 'TAKEAWAY',
      status: 'PRINTED',
      retry_count: 0,
      created_at: '9 mins ago',
      printed_at: '9 mins ago',
      items: [
        {
          id: 'oi-2',
          menu_item_id: 'm-4',
          menu_item_name: 'Iced Maubisse Single-Origin Latte',
          quantity: 3,
          unit_price: 4.25,
          total_price: 12.75,
          applied_modifiers: [],
        },
      ],
    },
  ],

  customers: [
    { id: 'cust-1', phone_number: '+670 7723 4819', name: 'Mateus Gusmão', email: 'mateus@dili.tl', total_points: 340 },
    { id: 'cust-2', phone_number: '+670 7811 9022', name: 'Ana Belo', email: 'ana.belo@timor.tl', total_points: 120 },
    { id: 'cust-3', phone_number: '+670 7790 1144', name: 'Carlos Ramos', email: 'carlos@dili.tl', total_points: 850 },
  ],

  loyaltyTransactions: [
    {
      id: 'lt-1',
      customer_id: 'cust-1',
      customer_name: 'Mateus Gusmão',
      order_id: 'ORD-2026-1023-018',
      type: 'EARN',
      points: 28,
      reason: 'Earned 1 pt per $1 USD spent',
      created_at: '10 mins ago',
    },
    {
      id: 'lt-2',
      customer_id: 'cust-3',
      customer_name: 'Carlos Ramos',
      order_id: 'ORD-2026-1023-014',
      type: 'REDEEM',
      points: -100,
      reason: 'Redeemed $5.00 USD voucher at checkout',
      created_at: '1 hour ago',
    },
  ],

  inventory: [
    { id: 'inv-1', name: 'Wagyu Beef Patty (150g)', sku: 'ING-BEEF-01', unit_of_measure: 'PIECE', current_stock: 14, min_stock_level: 20, cost_per_unit: 2.8 },
    { id: 'inv-2', name: 'Red Snapper Fillet', sku: 'ING-FISH-02', unit_of_measure: 'PIECE', current_stock: 28, min_stock_level: 10, cost_per_unit: 4.5 },
    { id: 'inv-3', name: 'Maubisse Arabica Beans', sku: 'ING-COF-01', unit_of_measure: 'KG', current_stock: 1.8, min_stock_level: 3.0, cost_per_unit: 14.0 },
    { id: 'inv-4', name: 'Brioche Burger Buns', sku: 'ING-BUN-01', unit_of_measure: 'PIECE', current_stock: 42, min_stock_level: 15, cost_per_unit: 0.45 },
  ],

  stockMovements: [
    {
      id: 'sm-1',
      inventory_item_id: 'inv-1',
      inventory_item_name: 'Wagyu Beef Patty (150g)',
      type: 'SALE_DEDUCTION',
      quantity: -4,
      reason: 'Recipe deduction for 2x Double Smash Wagyu Burger',
      reference_id: 'ORD-2026-1023-018',
      created_by: 'Cashier: Tomas',
      created_at: '2 mins ago',
    },
    {
      id: 'sm-2',
      inventory_item_id: 'inv-3',
      inventory_item_name: 'Maubisse Arabica Beans',
      type: 'WASTAGE',
      quantity: -0.25,
      reason: 'Espresso grinder calibration spill',
      created_by: 'Manager: Lucia',
      created_at: '2 hours ago',
    },
    {
      id: 'sm-3',
      inventory_item_id: 'inv-2',
      inventory_item_name: 'Red Snapper Fillet',
      type: 'PURCHASE_ADD',
      quantity: 20,
      reason: 'Morning delivery from Dili Fishery Supplier',
      reference_id: 'PO-2026-089',
      created_by: 'Manager: Lucia',
      created_at: '4 hours ago',
    },
  ],

  shifts: [
    {
      id: 'SH-204',
      user_name: 'Tomas Silva (Cashier)',
      opened_at: 'Today, 08:00 AM',
      opening_balance: 150.0,
      cash_sales: 412.5,
      card_sales: 289.0,
      status: 'OPEN',
    },
    {
      id: 'SH-203',
      user_name: 'Maria Costa (Cashier)',
      opened_at: 'Yesterday, 04:00 PM',
      closed_at: 'Yesterday, 11:15 PM',
      opening_balance: 150.0,
      cash_sales: 640.0,
      card_sales: 510.25,
      closing_balance: 790.0,
      status: 'RECONCILED',
    },
  ],

  auditLogs: [
    {
      id: 'aud-1',
      user_name: 'Lucia (Manager)',
      role: 'MANAGER',
      action: 'MARK_ITEM_86_UNAVAILABLE',
      entity_type: 'MenuItem',
      entity_id: 'm-5',
      details: 'Marked "Charcoal Peri-Peri Half Chicken" temporarily unavailable',
      created_at: '35 mins ago',
    },
    {
      id: 'aud-2',
      user_name: 'Lucia (Manager)',
      role: 'MANAGER',
      action: 'RECORD_WASTAGE',
      entity_type: 'InventoryItem',
      entity_id: 'inv-3',
      details: 'Deducted -0.25 KG Maubisse Arabica Beans (Reason: Grinder calibration)',
      created_at: '2 hours ago',
    },
  ],

  setOrderType: (type) => set({ activeOrderType: type }),
  setTableNumber: (table) => set({ tableNumber: table }),
  selectCustomer: (customer) => set({ selectedCustomer: customer, pointsRedeemed: 0 }),
  toggleRedeemPoints: (points) => set({ pointsRedeemed: points }),

  addToCart: (newItem) =>
    set((state) => ({
      cart: [...state.cart, newItem],
    })),

  updateQuantity: (itemId, delta) =>
    set((state) => ({
      cart: state.cart
        .map((item) => {
          if (item.id !== itemId) return item;
          const nextQty = item.quantity + delta;
          return nextQty > 0
            ? { ...item, quantity: nextQty, total_price: Number((nextQty * item.unit_price).toFixed(2)) }
            : null;
        })
        .filter(Boolean) as OrderItem[],
    })),

  clearCart: () => set({ cart: [], selectedCustomer: null, pointsRedeemed: 0 }),

  clearLastReceipt: () => set({ lastReceipt: null }),

  confirmOrderAndDispatchKOT: (paymentMethod) => {
    const state = get();
    if (state.cart.length === 0) return;

    const seqNum = 19 + state.kitchenPrintJobs.length;
    const nextOrderNumber = `ORD-2026-1023-0${seqNum}`;
    const nextInvoiceNumber = `INV-TL-2026-00${seqNum}`;

    const subtotal = Number(state.cart.reduce((acc, i) => acc + i.total_price, 0).toFixed(2));
    const discountTotal = state.pointsRedeemed > 0 ? Number((state.pointsRedeemed * 0.05).toFixed(2)) : 0;
    const taxableAmount = Math.max(0, subtotal - discountTotal);
    const taxTotal = Number((taxableAmount * 0.1).toFixed(2));
    const netTotal = Number((taxableAmount + taxTotal).toFixed(2));
    const earnedPoints = Math.floor(netTotal);

    const kotStatus = state.printerErrorSimulated ? 'FAILED' : 'PRINTED';

    const newJob: KitchenPrintJob = {
      id: `kot-${Date.now()}`,
      order_id: `ord-${Date.now()}`,
      order_number: nextOrderNumber,
      table_number: state.activeOrderType === 'DINE_IN' ? state.tableNumber : state.activeOrderType,
      order_type: state.activeOrderType,
      status: kotStatus,
      retry_count: 0,
      created_at: 'Just now',
      printed_at: state.printerErrorSimulated ? undefined : 'Just now',
      error_log: state.printerErrorSimulated ? 'LAN Printer Unreachable (192.168.1.200:9100)' : undefined,
      items: [...state.cart],
    };

    // Update customer loyalty ledger if attached
    let updatedCustomers = state.customers;
    let updatedLoyaltyLedger = state.loyaltyTransactions;
    let updatedCustomerBalance: number | undefined = undefined;

    if (state.selectedCustomer) {
      const netPointsDelta = earnedPoints - state.pointsRedeemed;
      updatedCustomerBalance = state.selectedCustomer.total_points + netPointsDelta;

      updatedCustomers = state.customers.map((c) =>
        c.id === state.selectedCustomer?.id
          ? { ...c, total_points: updatedCustomerBalance! }
          : c
      );
      updatedLoyaltyLedger = [
        {
          id: `lt-${Date.now()}`,
          customer_id: state.selectedCustomer.id,
          customer_name: state.selectedCustomer.name,
          order_id: nextOrderNumber,
          type: state.pointsRedeemed > 0 ? 'REDEEM' : 'EARN',
          points: netPointsDelta,
          reason:
            state.pointsRedeemed > 0
              ? `Redeemed ${state.pointsRedeemed} pts & earned +${earnedPoints} pts`
              : `Earned +${earnedPoints} pts on order ${nextOrderNumber}`,
          created_at: 'Just now',
        },
        ...state.loyaltyTransactions,
      ];
    }

    // Update current active shift totals
    const updatedShifts = state.shifts.map((sh) =>
      sh.status === 'OPEN'
        ? {
            ...sh,
            cash_sales: paymentMethod === 'CASH' ? Number((sh.cash_sales + netTotal).toFixed(2)) : sh.cash_sales,
            card_sales: paymentMethod !== 'CASH' ? Number((sh.card_sales + netTotal).toFixed(2)) : sh.card_sales,
          }
        : sh
    );

    // Create immutable snapshot for the 80mm Customer Receipt Modal
    const receiptSnapshot: ReceiptSnapshot = {
      invoice_number: nextInvoiceNumber,
      order_number: nextOrderNumber,
      order_type: state.activeOrderType,
      table_number: state.activeOrderType === 'DINE_IN' ? state.tableNumber : state.activeOrderType,
      cashier_name: 'Tomas Silva',
      payment_method: paymentMethod,
      created_at: new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      items: [...state.cart],
      subtotal,
      discount_total: discountTotal,
      tax_total: taxTotal,
      net_total: netTotal,
      customer_name: state.selectedCustomer?.name,
      customer_phone: state.selectedCustomer?.phone_number,
      points_redeemed: state.pointsRedeemed,
      points_earned: state.selectedCustomer ? earnedPoints : 0,
      remaining_points: updatedCustomerBalance,
      kot_status: kotStatus,
    };

    set({
      kitchenPrintJobs: [newJob, ...state.kitchenPrintJobs],
      customers: updatedCustomers,
      loyaltyTransactions: updatedLoyaltyLedger,
      shifts: updatedShifts,
      unsyncedQueueCount: state.isOnline ? state.unsyncedQueueCount : state.unsyncedQueueCount + 1,
      lastReceipt: receiptSnapshot,
      cart: [],
      selectedCustomer: null,
      pointsRedeemed: 0,
    });
  },

  retryKitchenPrint: (jobId) =>
    set((state) => ({
      kitchenPrintJobs: state.kitchenPrintJobs.map((job) =>
        job.id === jobId
          ? {
              ...job,
              status: state.printerErrorSimulated ? 'FAILED' : 'PRINTED',
              retry_count: job.retry_count + 1,
              printed_at: state.printerErrorSimulated ? undefined : 'Just now (Retried)',
              error_log: state.printerErrorSimulated ? 'Retry failed: Check printer power/LAN cable' : undefined,
            }
          : job
      ),
    })),

  toggleMenuAvailability: (menuItemId) =>
    set((state) => {
      const target = state.menuItems.find((m) => m.id === menuItemId);
      return {
        menuItems: state.menuItems.map((item) =>
          item.id === menuItemId ? { ...item, is_available: !item.is_available } : item
        ),
        auditLogs: [
          {
            id: `aud-${Date.now()}`,
            user_name: 'Owner / Admin',
            role: 'ADMIN',
            action: 'TOGGLE_MENU_AVAILABILITY',
            entity_type: 'MenuItem',
            entity_id: menuItemId,
            details: `Changed "${target?.name}" availability to ${!target?.is_available ? 'AVAILABLE' : '86 / SOLD OUT'}`,
            created_at: 'Just now',
          },
          ...state.auditLogs,
        ],
      };
    }),

  recordStockAdjustment: (itemId, type, qtyDelta, reason) =>
    set((state) => {
      const item = state.inventory.find((i) => i.id === itemId);
      if (!item) return state;
      const signedDelta = type === 'PURCHASE_ADD' ? Math.abs(qtyDelta) : -Math.abs(qtyDelta);
      return {
        inventory: state.inventory.map((i) =>
          i.id === itemId
            ? { ...i, current_stock: Math.max(0, Number((i.current_stock + signedDelta).toFixed(3))) }
            : i
        ),
        stockMovements: [
          {
            id: `sm-${Date.now()}`,
            inventory_item_id: itemId,
            inventory_item_name: item.name,
            type,
            quantity: signedDelta,
            reason,
            created_by: 'Manager: Lucia',
            created_at: 'Just now',
          },
          ...state.stockMovements,
        ],
        auditLogs: [
          {
            id: `aud-${Date.now()}`,
            user_name: 'Lucia (Manager)',
            role: 'MANAGER',
            action: `STOCK_${type}`,
            entity_type: 'InventoryItem',
            entity_id: itemId,
            details: `${signedDelta > 0 ? '+' : ''}${signedDelta} ${item.unit_of_measure} on ${item.name} (${reason})`,
            created_at: 'Just now',
          },
          ...state.auditLogs,
        ],
      };
    }),

  registerCustomer: (name, phone, email) =>
    set((state) => ({
      customers: [
        {
          id: `cust-${Date.now()}`,
          name,
          phone_number: phone,
          email,
          total_points: 50, // Welcome bonus
        },
        ...state.customers,
      ],
    })),

  adjustCustomerPoints: (customerId, pointsDelta, reason) =>
    set((state) => {
      const cust = state.customers.find((c) => c.id === customerId);
      if (!cust) return state;
      return {
        customers: state.customers.map((c) =>
          c.id === customerId ? { ...c, total_points: Math.max(0, c.total_points + pointsDelta) } : c
        ),
        loyaltyTransactions: [
          {
            id: `lt-${Date.now()}`,
            customer_id: customerId,
            customer_name: cust.name,
            type: 'MANUAL_ADJUST',
            points: pointsDelta,
            reason,
            created_at: 'Just now',
          },
          ...state.loyaltyTransactions,
        ],
      };
    }),

  reconcileCurrentShift: (countedCash) =>
    set((state) => ({
      shifts: state.shifts.map((sh) =>
        sh.status === 'OPEN'
          ? {
              ...sh,
              closed_at: 'Just now',
              closing_balance: countedCash,
              status: 'RECONCILED',
            }
          : sh
      ),
    })),
}));