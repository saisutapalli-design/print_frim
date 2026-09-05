export type Language = 'en' | 'te';

export type PaymentStatus = 'Paid' | 'Partial' | 'Unpaid';

export type PrintCategory =
  | 'Normal Flex'
  | 'Star Flex'
  | 'Vinyl Sticker'
  | 'Backlit Glow Sign'
  | 'One-Way Vision'
  | 'Cloth/Fabric Banner';

export type JobStatus =
  | 'Received'
  | 'Designing'
  | 'Printing'
  | 'Finishing'
  | 'Delivered';

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  paymentMethod: 'Cash' | 'UPI/PhonePe' | 'Bank Transfer';
  note?: string;
}

export interface PrintOrder {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  customerPhone: string;
  contactPerson?: string;
  category: PrintCategory;
  widthFeet: number;
  heightFeet: number;
  quantity: number;
  totalSqFt: number;
  ratePerSqFt: number;
  totalCost: number;
  paidAmount: number;
  pendingAmount: number;
  paymentStatus: PaymentStatus;
  percentagePaid: number;
  assignedStaffId: string;
  assignedStaffName: string;
  jobStatus: JobStatus;
  deliveryDate: string;
  notes?: string;
  paymentHistory: PaymentRecord[];
}

export type ExpenseCategory =
  | 'Raw Materials/Inventory'
  | 'Shop Rent'
  | 'Power/Current Bill'
  | 'Team Salaries'
  | 'Machine Maintenance'
  | 'Miscellaneous';

export interface ExpenseItem {
  id: string;
  date: string;
  category: ExpenseCategory;
  title: string;
  amount: number;
  paidTo: string;
  paymentMode: 'Cash' | 'UPI/PhonePe' | 'Bank Transfer';
  notes?: string;
  receiptNumber?: string;
}

export type InventoryCategory =
  | 'Flex Rolls'
  | 'Printing Inks'
  | 'Vinyl Materials'
  | 'Hardware & Eyelets'
  | 'Chemicals & Solvents';

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  currentStock: number;
  unit: 'Rolls' | 'Liters' | 'Packets' | 'Boxes' | 'Pieces';
  minThreshold: number;
  unitCost: number;
  supplierName: string;
  lastRestocked: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'Designer' | 'Printer Operator' | 'Finishing & Pasting' | 'Delivery & Helper';
  phone: string;
  wageType: 'Monthly' | 'Daily Wage';
  wageAmount: number;
  totalSqFtMonth: number;
  totalJobsMonth: number;
  todaySqFt: number;
  todayJobs: number;
  avatarUrl?: string;
  status: 'Active' | 'On Leave';
}

export type TimeFilter = 'today' | 'this_week' | 'this_month' | 'all_time';

export interface UserProfile {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: 'Owner' | 'Manager' | 'Admin' | 'Designer';
}

export type AppTheme = 'amber' | 'blue' | 'emerald' | 'slate';
