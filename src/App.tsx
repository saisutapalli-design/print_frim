import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { AlertsBanner } from './components/AlertsBanner';
import { BalanceSheetDashboard } from './components/BalanceSheetDashboard';
import { OrderManagement } from './components/OrderManagement';
import { ReceivablesCallSheet } from './components/ReceivablesCallSheet';
import { ExpenseTracker } from './components/ExpenseTracker';
import { TeamManagement } from './components/TeamManagement';
import { NewOrderModal } from './components/NewOrderModal';
import { RecordPaymentModal } from './components/RecordPaymentModal';
import { JobReceiptModal } from './components/JobReceiptModal';
import { Footer } from './components/Footer';
import { PRDModal } from './components/PRDModal';
import { LegalModal } from './components/LegalModal';
import { LoginScreen } from './components/LoginScreen';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { ProfileSettingsModal } from './components/ProfileSettingsModal';
import { 
  Language, 
  PrintOrder, 
  ExpenseItem, 
  InventoryItem, 
  StaffMember, 
  TimeFilter, 
  PaymentRecord,
  UserProfile,
  AppTheme
} from './types';
import { 
  initialOrders, 
  initialExpenses, 
  initialInventory, 
  initialStaff 
} from './data/mockData';

export default function App() {
  // Authentication state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('sairam_ads_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    // Default active profile for instant preview
    return {
      firstName: 'Sai',
      lastName: 'Ram',
      phoneNumber: '9848012345',
      role: 'Owner',
    };
  });

  // Customization & Settings state
  const [logoName, setLogoName] = useState<string>(() => {
    return localStorage.getItem('sairam_ads_logo_name') || 'Sairam Ads';
  });

  const [currentTheme, setCurrentTheme] = useState<AppTheme>(() => {
    return (localStorage.getItem('sairam_ads_theme') as AppTheme) || 'amber';
  });

  // Main application states
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'receivables' | 'expenses' | 'team'>('dashboard');
  const [language, setLanguage] = useState<Language>('en');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('this_month');

  // Business data stores
  const [orders, setOrders] = useState<PrintOrder[]>(initialOrders);
  const [expenses, setExpenses] = useState<ExpenseItem[]>(initialExpenses);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [staffList, setStaffList] = useState<StaffMember[]>(initialStaff);

  // Modal interaction states
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [isNewExpenseOpen, setIsNewExpenseOpen] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState<PrintOrder | null>(null);
  const [paymentOrder, setPaymentOrder] = useState<PrintOrder | null>(null);
  const [isPRDOpen, setIsPRDOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'disclaimer' | 'license' | 'privacy' | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);

  // Authentication Handlers
  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('sairam_ads_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sairam_ads_user');
  };

  const handleUpdateUser = (updated: UserProfile) => {
    setCurrentUser(updated);
    localStorage.setItem('sairam_ads_user', JSON.stringify(updated));
  };

  const handleUpdateLogoName = (newName: string) => {
    setLogoName(newName);
    localStorage.setItem('sairam_ads_logo_name', newName);
  };

  const handleUpdateTheme = (theme: AppTheme) => {
    setCurrentTheme(theme);
    localStorage.setItem('sairam_ads_theme', theme);
  };

  // Handlers for Orders
  const handleSaveOrder = (
    newOrderData: Omit<PrintOrder, 'id' | 'orderNumber' | 'paymentHistory'>
  ) => {
    const newId = `ord-${Date.now()}`;
    const newOrderNumber = `ORD-2026-${orders.length + 101}`;

    const paymentHistory: PaymentRecord[] = [];
    if (newOrderData.paidAmount > 0) {
      paymentHistory.push({
        id: `pay-${Date.now()}`,
        date: newOrderData.date,
        amount: newOrderData.paidAmount,
        paymentMethod: 'UPI/PhonePe',
        note: 'Advance collected at booking',
      });
    }

    const createdOrder: PrintOrder = {
      ...newOrderData,
      id: newId,
      orderNumber: newOrderNumber,
      paymentHistory,
    };

    setOrders((prev) => [createdOrder, ...prev]);

    // Update staff metrics for productivity tracking
    setStaffList((prev) =>
      prev.map((s) => {
        if (s.id === newOrderData.assignedStaffId) {
          return {
            ...s,
            todaySqFt: s.todaySqFt + newOrderData.totalSqFt,
            todayJobs: s.todayJobs + 1,
            totalSqFtMonth: s.totalSqFtMonth + newOrderData.totalSqFt,
            totalJobsMonth: s.totalJobsMonth + 1,
          };
        }
        return s;
      })
    );

    // Auto open job receipt for printing/confirmation
    setReceiptOrder(createdOrder);
  };

  const handleSavePayment = (
    orderId: string,
    payment: Omit<PaymentRecord, 'id'>
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const newPaid = order.paidAmount + payment.amount;
        const newPending = Math.max(0, order.totalCost - newPaid);
        const percentagePaid =
          order.totalCost > 0
            ? Math.min(100, Math.round((newPaid / order.totalCost) * 100))
            : 100;

        const paymentStatus =
          newPending <= 0 ? 'Paid' : newPaid > 0 ? 'Partial' : 'Unpaid';

        const updatedHistory = [
          ...order.paymentHistory,
          {
            ...payment,
            id: `pay-${Date.now()}`,
          },
        ];

        return {
          ...order,
          paidAmount: newPaid,
          pendingAmount: newPending,
          percentagePaid,
          paymentStatus,
          paymentHistory: updatedHistory,
        };
      })
    );
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    newStatus: PrintOrder['jobStatus']
  ) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, jobStatus: newStatus } : o))
    );
  };

  // Handlers for Expenses
  const handleAddExpense = (newExpenseData: Omit<ExpenseItem, 'id'>) => {
    const newExpense: ExpenseItem = {
      ...newExpenseData,
      id: `exp-${Date.now()}`,
    };
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const handleDeleteExpense = (expenseId: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
  };

  // Handlers for Staff
  const handleAddStaff = (newStaff: StaffMember) => {
    setStaffList((prev) => [...prev, newStaff]);
  };

  // Handlers for Inventory Restocking
  const handleRestockItem = (itemId: string, addQuantity: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            currentStock: Number((item.currentStock + addQuantity).toFixed(1)),
            lastRestocked: new Date().toISOString().split('T')[0],
          };
        }
        return item;
      })
    );
  };

  // Count pending orders for badge
  const pendingOrdersCount = orders.filter((o) => o.pendingAmount > 0).length;

  // Unread notification count: low stock items + pending dues alert
  const lowStockCount = inventory.filter((item) => item.currentStock <= item.minThreshold).length;
  const unreadNotificationCount = lowStockCount + (pendingOrdersCount > 0 ? 1 : 0);

  // If user is not logged in, render the Login Screen (User Request 1)
  if (!currentUser) {
    return (
      <LoginScreen
        onLogin={handleLogin}
        language={language}
        logoName={logoName}
      />
    );
  }

  // Theme styling map
  const themeClasses = {
    amber: 'selection:bg-amber-200',
    blue: 'selection:bg-blue-200',
    emerald: 'selection:bg-emerald-200',
    slate: 'selection:bg-slate-300',
  }[currentTheme];

  return (
    <div className={`h-screen max-h-screen w-full max-w-full flex flex-col overflow-hidden bg-slate-100 text-slate-900 font-sans antialiased ${themeClasses}`}>
      {/* Navigation Header at the Top (Log expense removed from header per User Request 3) */}
      <header className="shrink-0 z-40 w-full">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          language={language}
          setLanguage={setLanguage}
          onOpenNewOrder={() => setIsNewOrderOpen(true)}
          pendingCount={pendingOrdersCount}
          user={currentUser}
          logoName={logoName}
          unreadCount={unreadNotificationCount}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenProfileSettings={() => setIsProfileSettingsOpen(true)}
        />
      </header>

      {/* Main Content Area - Scrollable with Non-Sticky Footer inside (User Request 2) */}
      <main className="flex-1 w-full max-w-full overflow-y-auto overflow-x-hidden flex flex-col justify-between">
        <div className="w-full max-w-full px-4 sm:px-6 lg:px-[32px] py-5 space-y-5 flex-1">
          {/* User Request 7: "only on the 5 customers have pending balances totaling ₹10,968 pending dues tab only" */}
          {activeTab === 'receivables' && (
            <AlertsBanner
              orders={orders}
              language={language}
            />
          )}

          {/* View Routing */}
          {activeTab === 'dashboard' && (
            <BalanceSheetDashboard
              orders={orders}
              expenses={expenses}
              language={language}
              timeFilter={timeFilter}
              setTimeFilter={setTimeFilter}
              onNavigateToOrders={() => setActiveTab('orders')}
              onNavigateToReceivables={() => setActiveTab('receivables')}
              onNavigateToExpenses={() => setActiveTab('expenses')}
            />
          )}

          {activeTab === 'orders' && (
            <OrderManagement
              orders={orders}
              language={language}
              onOpenNewOrder={() => setIsNewOrderOpen(true)}
              onSelectOrderReceipt={(order) => setReceiptOrder(order)}
              onOpenRecordPayment={(order) => setPaymentOrder(order)}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          )}

          {activeTab === 'receivables' && (
            <ReceivablesCallSheet
              orders={orders}
              language={language}
              onOpenRecordPayment={(order) => setPaymentOrder(order)}
              onSelectOrderReceipt={(order) => setReceiptOrder(order)}
            />
          )}

          {activeTab === 'expenses' && (
            <ExpenseTracker
              expenses={expenses}
              inventory={inventory}
              language={language}
              onAddExpense={handleAddExpense}
              onRestockItem={handleRestockItem}
              onDeleteExpense={handleDeleteExpense}
              isOpenExpenseModal={isNewExpenseOpen}
              setIsOpenExpenseModal={setIsNewExpenseOpen}
            />
          )}

          {activeTab === 'team' && (
            <TeamManagement
              staffList={staffList}
              language={language}
              onAddStaff={handleAddStaff}
            />
          )}
        </div>

        {/* User Request 2: Footer inside scroll container - NOT sticky to the bottom */}
        <div className="w-full shrink-0">
          <Footer
            language={language}
            onOpenPRD={() => setIsPRDOpen(true)}
            onOpenLegal={(type) => setLegalModalType(type)}
            logoName={logoName}
          />
        </div>
      </main>

      {/* Modals & Popovers */}
      <NewOrderModal
        isOpen={isNewOrderOpen}
        onClose={() => setIsNewOrderOpen(false)}
        onSaveOrder={handleSaveOrder}
        staffList={staffList}
        language={language}
      />

      <RecordPaymentModal
        order={paymentOrder}
        onClose={() => setPaymentOrder(null)}
        onSavePayment={handleSavePayment}
        language={language}
      />

      <JobReceiptModal
        order={receiptOrder}
        onClose={() => setReceiptOrder(null)}
        language={language}
      />

      <PRDModal
        isOpen={isPRDOpen}
        onClose={() => setIsPRDOpen(false)}
        language={language}
      />

      <LegalModal
        isOpen={legalModalType !== null}
        onClose={() => setLegalModalType(null)}
        type={legalModalType || 'disclaimer'}
        language={language}
      />

      {/* Notifications Drawer (User Request 6: Low inventory moved into notifications) */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        inventory={inventory}
        orders={orders}
        language={language}
        onNavigateToInventory={() => setActiveTab('expenses')}
        onNavigateToPendingDues={() => setActiveTab('receivables')}
      />

      {/* Profile & Settings Modal (User Requests 4 & 5) */}
      <ProfileSettingsModal
        isOpen={isProfileSettingsOpen}
        onClose={() => setIsProfileSettingsOpen(false)}
        user={currentUser}
        onUpdateUser={handleUpdateUser}
        logoName={logoName}
        onUpdateLogoName={handleUpdateLogoName}
        currentTheme={currentTheme}
        onUpdateTheme={handleUpdateTheme}
        onLogout={handleLogout}
        language={language}
      />
    </div>
  );
}
