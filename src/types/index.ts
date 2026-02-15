// Core data types for Retail Shoe Management System

export interface Product {
  itemNumber: string;
  styleNumber: string;
  title: string;
  longName: string;
  color: string;
  shortDescription: string;
  quarter: string;
  markdown: boolean;
  price: number;
  dnsPrice2: number;
  dnsPrice3: number;
  vendor: string;
  companyOnHand: number;
  localOnHand: number;
  imageUrl: string;
  gender?: string;
  sizes: ProductSize[];
  widths: ProductSize[];
  inventory: StoreInventory[];
  relatedProducts?: string[]; // Item numbers
}

export interface ProductSize {
  id: string;
  size: string;
  width?: string;
  available: boolean;
  quantity?: number;
}

export interface StoreInventory {
  storeNumber: string;
  size: string;
  quantity: number;
  available: boolean;
}

export enum OrderStatus {
  Processing = 1,
  NotAvailable = 2,
  Available = 3,
  Cancelled = 4,
  Shipped = 5,
}

export interface Order {
  orderNumber: string;
  autoTransferNumber?: string;
  companyAddress?: string;
  createdBy: string;
  createdByName: string;
  customerName: string;
  createDate: string;
  orderStatus: OrderStatus;
  size: string;
  itemNumber: string;
  storeFromId: string;
  storeToId: string;
  barcode?: string;
  isInternetOrder: boolean;
  internetOrderNumber?: string;
  isLocked: boolean;
  lockedBy?: string;
  lockedByName?: string;
  lockedByTimestamp?: number;
  product?: Product;
}

export interface Store {
  storeNumber: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  manager?: string;
}

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'employee' | 'manager';
  storeNumber: string;
  avatar?: string;
}

export interface Printer {
  name: string;
  type: 'ticket' | 'label' | 'shipout';
  location: string;
}

export interface Coupon {
  code: string;
  amount: number;
  percentage?: number;
  expiryDate: string;
  itemNumber?: string;
  comment?: string;
}

export interface ShipOut {
  shipOutNumber: string;
  autoTransferNumber: string;
  shipFromStore: string;
  shipToStore: string;
  createDate: string;
  status: 'pending' | 'shipped' | 'received';
  items: {
    barcode: string;
    itemNumber: string;
    size: string;
  }[];
}

export interface OrderSummary {
  totalOrders: number;
  processingOrders: number;
  availableOrders: number;
  notAvailableOrders: number;
  totalSales: number;
  averageOrderValue: number;
}

// UI State types
export interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  modals: {
    [key: string]: boolean;
  };
}

// Filter types
export interface ProductFilters {
  search: string;
  vendor?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  inStock?: boolean;
}

export interface OrderFilters {
  search: string;
  status?: OrderStatus;
  storeFrom?: string;
  storeTo?: string;
  dateFrom?: string;
  dateTo?: string;
  createdBy?: string;
}
