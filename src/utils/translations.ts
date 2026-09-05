import { Language } from '../types';

export const translations = {
  en: {
    appTitle: 'Sairam Ads',
    appSubtitle: 'Operational & Financial Control Center',
    shopLocation: 'Main Road, AP',
    dashboard: 'Dashboard',
    orders: 'Orders Ledger',
    newOrder: 'New Print Order',
    expenses: 'Expenses & Inventory',
    team: 'Staff Output',
    receivables: 'Pending Dues',
    
    // Time filters
    today: 'Today',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    allTime: 'All Time',

    // Dashboard cards
    totalRevenue: 'Total Billed Value',
    collectedCash: 'Collected Revenue',
    pendingDues: 'Pending Receivables',
    totalExpenses: 'Total Operational Expenses',
    netProfit: 'Net Realized Profit',
    totalSqFtPrinted: 'Total Sq.Ft Printed',
    collectionRate: 'Collection Rate',
    profitMargin: 'Net Margin',

    // Alerts
    alertsTitle: 'Critical Operational Alerts',
    unpaidAlert: 'customers have pending balances totaling',
    callNow: 'Open Recovery Call List',
    lowStockAlert: 'materials are below critical safety stock',
    checkInventory: 'View Inventory',

    // Tables
    date: 'Date',
    customer: 'Customer & Contact',
    category: 'Material / Type',
    sizeDimensions: 'Size (W × H)',
    sqft: 'Sq.Ft',
    totalCost: 'Total Cost',
    paid: 'Paid',
    pending: 'Pending',
    paymentStatus: 'Payment Status',
    action: 'Action',

    // Form labels
    customerName: 'Customer / Business Name',
    phone: 'Mobile / WhatsApp Number',
    contactPerson: 'Contact Person (Optional)',
    printCategory: 'Print Material Category',
    widthFt: 'Width (Feet)',
    heightFt: 'Height (Feet)',
    qty: 'Quantity',
    ratePerSqFt: 'Rate per Sq.Ft (₹)',
    advancePayment: 'Payment Collected Now (₹)',
    fullPayment: '100% Full',
    halfPayment: '50% Half',
    quarterPayment: '25%',
    unpaid: '₹0 Unpaid',
    assignedStaff: 'Assigned Operator / Designer',
    deliveryDate: 'Delivery Due Date',
    jobNotes: 'Specific Instructions (Eyelets, Lamination, etc.)',
    saveOrder: 'Print Job Slip',
    cancel: 'Cancel',

    // Expenses
    expensesTab: 'Expenses',
    inventoryStock: 'Inventory & Stock',
    addExpense: 'Log Expense',
    expenseCategory: 'Expense Category',
    expenseTitle: 'Description / Payee',
    amount: 'Amount (₹)',
    paymentMode: 'Payment Mode',
    stockLevel: 'Current Stock',
    minStock: 'Min Stock Level',
    restock: 'Restock Item',
    
    // Calling sheet
    callCustomer: 'Direct Call',
    whatsappReminder: 'WhatsApp Dues Notice',
    lastPaymentDate: 'Last Payment Date',
    recordPayment: 'Collect Payment',

    // Statuses
    statusPaid: 'Full Paid',
    statusPartial: 'Partial Paid',
    statusUnpaid: 'Unpaid / Credit',
  },
  te: {
    appTitle: 'సాయిరాం యాడ్స్ (Sairam Ads)',
    appSubtitle: 'ఆపరేషన్స్ & లెక్కల కేంద్రం',
    shopLocation: 'మెయిన్ రోడ్, ఆంధ్రప్రదేశ్',
    dashboard: 'డాష్‌బోర్డ్',
    orders: 'ఆర్డర్ల లెడ్జర్',
    newOrder: 'కొత్త ప్రింట్ ఆర్డర్',
    expenses: 'ఖర్చులు & ఇన్వెంటరీ',
    team: 'స్టాఫ్ పనితీరు',
    receivables: 'పెండింగ్ బాకీలు',

    // Time filters
    today: 'ఈ రోజు',
    thisWeek: 'ఈ వారం',
    thisMonth: 'ఈ నెల',
    allTime: 'మొత్తం',

    // Dashboard cards
    totalRevenue: 'మొత్తం ఆర్డర్ల విలువ',
    collectedCash: 'వసూలైన మొత్తం (నగదు)',
    pendingDues: 'ఇంకా రావలసిన బాకీలు',
    totalExpenses: 'మొత్తం దుకాణం ఖర్చులు',
    netProfit: 'నికర లాభం (చేతికొచ్చినది)',
    totalSqFtPrinted: 'ప్రింట్ చేసిన మొత్తం Sq.Ft',
    collectionRate: 'వసూలు శాతం',
    profitMargin: 'లాభ శాతం',

    // Alerts
    alertsTitle: 'ముఖ్యమైన హెచ్చరికలు',
    unpaidAlert: 'కస్టమర్ల నుండి రావలసిన మొత్తం బాకీ:',
    callNow: 'కాల్ లిస్ట్ చూడండి',
    lowStockAlert: 'ముడిసరుకులు పరిమితి కంటే తక్కువగా ఉన్నాయి',
    checkInventory: 'ఇన్వెంటరీ చూడండి',

    // Tables
    date: 'తేదీ',
    customer: 'కస్టమర్ & ఫోన్ నంబర్',
    category: 'మెటీరియల్ రకం',
    sizeDimensions: 'సైజు (వెడల్పు × ఎత్తు)',
    sqft: 'చ.అడుగులు (Sq.Ft)',
    totalCost: 'మొత్తం బిల్లు',
    paid: 'చెల్లించినది',
    pending: 'బాకీ ఉన్నది',
    paymentStatus: 'చెల్లింపు స్థితి',
    action: 'చర్య',

    // Form labels
    customerName: 'కస్టమర్ / షాప్ పేరు',
    phone: 'ఫోన్ నంబర్ / వాట్సాప్',
    contactPerson: 'కాంటాక్ట్ వ్యక్తి (ఆప్షనల్)',
    printCategory: 'ప్రింట్ రకం',
    widthFt: 'వెడల్పు (అడుగులు)',
    heightFt: 'ఎత్తు (అడుగులు)',
    qty: 'పరిమాణం (Qty)',
    ratePerSqFt: 'రేటు (చ.అడుగుకి ₹)',
    advancePayment: 'ఇచ్చిన అడ్వాన్స్ (₹)',
    fullPayment: '100% మొత్తం చెల్లింపు',
    halfPayment: '50% సగం',
    quarterPayment: '25% పావు వంతు',
    unpaid: '₹0 క్రెడిట్/ఏమీ ఇవ్వలేదు',
    assignedStaff: 'కేటాయించిన స్టాఫ్',
    deliveryDate: 'డెలివరీ తేదీ',
    jobNotes: 'సూచనలు (ఐలెట్స్, లామినేషన్, ఫ్రేమ్ మొదలైనవి)',
    saveOrder: 'జాబ్ స్లిప్ ప్రింట్ చేయండి',
    cancel: 'రద్దు చేయండి',

    // Expenses
    expensesTab: 'ఖర్చులు',
    inventoryStock: 'సరుకుల నిల్వ (స్టాక్)',
    addExpense: 'ఖర్చు నమోదు చేయండి',
    expenseCategory: 'ఖర్చు విభాగం',
    expenseTitle: 'వివరాలు / ఎవరికి ఇచ్చారు',
    amount: 'మొత్తం (₹)',
    paymentMode: 'చెల్లింపు విధానం',
    stockLevel: 'ప్రస్తుత నిల్వ',
    minStock: 'కనీస నిల్వ అవసరం',
    restock: 'స్టాక్ చేర్చండి',

    // Calling sheet
    callCustomer: 'కాల్ చేయండి',
    whatsappReminder: 'వాట్సాప్ మెసేజ్ పంపండి',
    lastPaymentDate: 'చివరి చెల్లింపు తేదీ',
    recordPayment: 'డబ్బులు వసూలు చేయండి',

    // Statuses
    statusPaid: 'పూర్తి చెల్లింపు',
    statusPartial: 'సగం చెల్లింపు',
    statusUnpaid: 'పూర్తి బాకీ (క్రెడిట్)',
  }
};

export const formatINR = (val: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
};

export const formatDate = (dateStr: string): string => {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};
