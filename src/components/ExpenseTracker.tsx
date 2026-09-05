import React, { useState } from 'react';
import { 
  Plus, 
  Package, 
  Zap, 
  Home, 
  Users, 
  Wrench, 
  FileText, 
  AlertTriangle, 
  Check, 
  X, 
  ArrowDownRight, 
  TrendingDown, 
  RefreshCw, 
  Search, 
  Download, 
  Printer, 
  ReceiptIndianRupee,
  Trash2, 
  ChevronDown,
  LayoutList,
  LayoutGrid,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Language, ExpenseItem, InventoryItem, ExpenseCategory, InventoryCategory } from '../types';
import { translations, formatINR, formatDate } from '../utils/translations';

interface ExpenseTrackerProps {
  expenses: ExpenseItem[];
  inventory: InventoryItem[];
  language: Language;
  onAddExpense: (newExpense: Omit<ExpenseItem, 'id'>) => void;
  onRestockItem: (itemId: string, addQuantity: number) => void;
  onDeleteExpense?: (expenseId: string) => void;
  isOpenExpenseModal: boolean;
  setIsOpenExpenseModal: (open: boolean) => void;
}

type ExpenseSortField = 'date' | 'title' | 'amount' | 'category' | 'paidTo';
type InventorySortField = 'name' | 'currentStock' | 'minThreshold' | 'unitCost' | 'category';
type SortDirection = 'asc' | 'desc';

export const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({
  expenses,
  inventory,
  language,
  onAddExpense,
  onRestockItem,
  onDeleteExpense,
  isOpenExpenseModal,
  setIsOpenExpenseModal,
}) => {
  const t = translations[language];
  const [activeSubTab, setActiveSubTab] = useState<'expenses' | 'inventory'>('expenses');

  // Expense states
  const [expViewMode, setExpViewMode] = useState<'table' | 'grid'>('table');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expSortField, setExpSortField] = useState<ExpenseSortField>('date');
  const [expSortDirection, setExpSortDirection] = useState<SortDirection>('desc');

  // Inventory states
  const [invViewMode, setInvViewMode] = useState<'grid' | 'table'>('table');
  const [invSearchTerm, setInvSearchTerm] = useState('');
  const [invCategoryFilter, setInvCategoryFilter] = useState<string>('All');
  const [invLowStockOnly, setInvLowStockOnly] = useState(false);
  const [invSortField, setInvSortField] = useState<InventorySortField>('currentStock');
  const [invSortDirection, setInvSortDirection] = useState<SortDirection>('asc');

  // Form states for adding expense
  const [expCategory, setExpCategory] = useState<ExpenseCategory>('Raw Materials/Inventory');
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState<number | ''>('');
  const [expPaidTo, setExpPaidTo] = useState('');
  const [expPaymentMode, setExpPaymentMode] = useState<'Cash' | 'UPI/PhonePe' | 'Bank Transfer'>('UPI/PhonePe');
  const [expNotes, setExpNotes] = useState('');
  const [expReceipt, setExpReceipt] = useState('');

  // Restock modal state
  const [restockItem, setRestockItem] = useState<InventoryItem | null>(null);
  const [restockQty, setRestockQty] = useState<number>(1);

  // Filtered & sorted expenses
  const filteredExpenses = expenses.filter((e) => {
    const matchesCat = selectedCategory === 'All' || e.category === selectedCategory;
    const matchesSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.paidTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.receiptNumber && e.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    let valA: any = a[expSortField];
    let valB: any = b[expSortField];

    if (expSortField === 'date') {
      valA = new Date(a.date).getTime();
      valB = new Date(b.date).getTime();
    } else if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) return expSortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return expSortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleExpSort = (field: ExpenseSortField) => {
    if (expSortField === field) {
      setExpSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setExpSortField(field);
      setExpSortDirection(field === 'amount' || field === 'date' ? 'desc' : 'asc');
    }
  };

  // Filtered & sorted inventory
  const filteredInventory = inventory.filter((item) => {
    const matchesCat = invCategoryFilter === 'All' || item.category === invCategoryFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(invSearchTerm.toLowerCase()) ||
      item.supplierName.toLowerCase().includes(invSearchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(invSearchTerm.toLowerCase());
    const matchesLowStock = !invLowStockOnly || item.currentStock <= item.minThreshold;
    return matchesCat && matchesSearch && matchesLowStock;
  });

  const sortedInventory = [...filteredInventory].sort((a, b) => {
    let valA: any = a[invSortField];
    let valB: any = b[invSortField];

    if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) return invSortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return invSortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleInvSort = (field: InventorySortField) => {
    if (invSortField === field) {
      setInvSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setInvSortField(field);
      setInvSortDirection(field === 'currentStock' ? 'asc' : 'desc');
    }
  };

  const totalExpenseAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const getCategoryIcon = (category: ExpenseCategory) => {
    switch (category) {
      case 'Raw Materials/Inventory':
        return <Package className="w-4 h-4 text-indigo-600" />;
      case 'Shop Rent':
        return <Home className="w-4 h-4 text-blue-600" />;
      case 'Power/Current Bill':
        return <Zap className="w-4 h-4 text-amber-600" />;
      case 'Team Salaries':
        return <Users className="w-4 h-4 text-emerald-600" />;
      case 'Machine Maintenance':
        return <Wrench className="w-4 h-4 text-orange-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle.trim() || !expAmount || Number(expAmount) <= 0) {
      alert(language === 'te' ? 'దయచేసి ఖర్చు వివరాలు మరియు సరైన మొత్తాన్ని నమోదు చేయండి.' : 'Please provide description and valid amount.');
      return;
    }

    onAddExpense({
      date: new Date().toISOString().split('T')[0],
      category: expCategory,
      title: expTitle.trim(),
      amount: Number(expAmount),
      paidTo: expPaidTo.trim() || (language === 'te' ? 'జనరల్ ఖర్చు' : 'General Payee'),
      paymentMode: expPaymentMode,
      notes: expNotes.trim() || undefined,
      receiptNumber: expReceipt.trim() || undefined,
    });

    // Reset
    setExpTitle('');
    setExpAmount('');
    setExpPaidTo('');
    setExpNotes('');
    setExpReceipt('');
    setIsOpenExpenseModal(false);
  };

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (restockItem && restockQty > 0) {
      onRestockItem(restockItem.id, restockQty);
      setRestockItem(null);
      setRestockQty(1);
    }
  };

  const handleExportExpensesCSV = () => {
    const headers = ['Date', 'Category', 'Title', 'Amount', 'Payment Mode', 'Paid To', 'Receipt Number', 'Notes'];
    const rows = sortedExpenses.map(e => [
      e.date,
      `"${e.category}"`,
      `"${e.title}"`,
      e.amount,
      e.paymentMode,
      `"${e.paidTo}"`,
      `"${e.receiptNumber || ''}"`,
      `"${e.notes || ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SairamAds_Expenses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderExpSortIndicator = (field: ExpenseSortField) => {
    if (expSortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-60 inline-block ml-1" />;
    }
    return expSortDirection === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-rose-600 inline-block ml-1" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-rose-600 inline-block ml-1" />
    );
  };

  const renderInvSortIndicator = (field: InventorySortField) => {
    if (invSortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-60 inline-block ml-1" />;
    }
    return invSortDirection === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-slate-900 inline-block ml-1" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-slate-900 inline-block ml-1" />
    );
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Sub-tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div 
            id="subtab-segmented-toggle"
            role="tablist"
            aria-label="Expenses and Inventory views"
            className="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1.5 shadow-inner"
          >
            <button
              id="subtab-expenses-toggle-btn"
              type="button"
              role="tab"
              aria-selected={activeSubTab === 'expenses'}
              onClick={() => setActiveSubTab('expenses')}
              className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer select-none ${
                activeSubTab === 'expenses'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 ring-1 ring-slate-900/5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <ReceiptIndianRupee className={`w-4 h-4 transition-colors ${activeSubTab === 'expenses' ? 'text-rose-600' : 'text-slate-500'}`} />
              <span>{t.expensesTab || 'Expenses'}</span>
              <span
                className={`ml-0.5 px-1.5 py-0.5 rounded-md text-[11px] font-bold ${
                  activeSubTab === 'expenses'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                    : 'bg-slate-200/80 text-slate-600'
                }`}
              >
                {expenses.length}
              </span>
            </button>
            <button
              id="subtab-inventory-toggle-btn"
              type="button"
              role="tab"
              aria-selected={activeSubTab === 'inventory'}
              onClick={() => setActiveSubTab('inventory')}
              className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer select-none ${
                activeSubTab === 'inventory'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 ring-1 ring-slate-900/5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Package className={`w-4 h-4 transition-colors ${activeSubTab === 'inventory' ? 'text-amber-600' : 'text-slate-500'}`} />
              <span>{t.inventoryStock || 'Inventory & Stock'}</span>
              {inventory.some((i) => i.currentStock <= i.minThreshold) ? (
                <span
                  className="ml-0.5 px-1.5 py-0.5 rounded-md text-[11px] font-black bg-amber-500 text-slate-950 inline-flex items-center gap-0.5 shadow-xs"
                  title={language === 'te' ? 'సరుకులు తక్కువగా ఉన్నాయి' : 'Low stock items detected'}
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>{inventory.filter((i) => i.currentStock <= i.minThreshold).length}</span>
                </span>
              ) : (
                <span
                  className={`ml-0.5 px-1.5 py-0.5 rounded-md text-[11px] font-bold ${
                    activeSubTab === 'inventory'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                      : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {inventory.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeSubTab === 'expenses' && (
            <button
              onClick={handleExportExpensesCSV}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer"
              title="Download Expenses CSV"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>{language === 'te' ? 'CSV డౌన్‌లోడ్' : 'Export CSV'}</span>
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer"
            title="Print view"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>{language === 'te' ? 'ప్రింట్' : 'Print'}</span>
          </button>

          {activeSubTab === 'expenses' && (
            <button
              id="open-add-expense-modal"
              onClick={() => setIsOpenExpenseModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addExpense}</span>
            </button>
          )}
        </div>
      </div>

      {activeSubTab === 'expenses' ? (
        /* EXPENSES VIEW */
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={language === 'te' ? 'ఖర్చు వివరాలు, పేరు లేదా రసీదు నంబర్...' : 'Search expenses, payee, or receipt #...'}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Table / Grid Mode Toggle */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setExpViewMode('table')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    expViewMode === 'table'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title={language === 'te' ? 'టేబుల్ వ్యూ' : 'Table View'}
                >
                  <LayoutList className="w-4 h-4" />
                  <span className="hidden xs:inline">{language === 'te' ? 'టేబుల్' : 'Table'}</span>
                </button>

                <button
                  onClick={() => setExpViewMode('grid')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    expViewMode === 'grid'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title={language === 'te' ? 'గ్రిడ్ వ్యూ' : 'Grid View'}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden xs:inline">{language === 'te' ? 'గ్రిడ్' : 'Grid'}</span>
                </button>
              </div>

              {/* Category selector */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden text-slate-700 cursor-pointer"
                >
                  <option value="All">{language === 'te' ? 'అన్ని వర్గాలు' : 'All Categories'}</option>
                  <option value="Raw Materials/Inventory">Raw Materials / Inventory</option>
                  <option value="Shop Rent">Shop Rent</option>
                  <option value="Power/Current Bill">Power / Current Bill</option>
                  <option value="Team Salaries">Team Salaries</option>
                  <option value="Machine Maintenance">Machine Maintenance</option>
                  <option value="Miscellaneous">Miscellaneous</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-500">
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Sort selector */}
              <div className="relative">
                <select
                  value={`${expSortField}-${expSortDirection}`}
                  onChange={(e) => {
                    const [f, d] = e.target.value.split('-') as [ExpenseSortField, SortDirection];
                    setExpSortField(f);
                    setExpSortDirection(d);
                  }}
                  className="appearance-none pl-3 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden text-slate-700 cursor-pointer"
                >
                  <option value="date-desc">{language === 'te' ? 'తేదీ (కొత్తవి ముందు)' : 'Date: Newest'}</option>
                  <option value="date-asc">{language === 'te' ? 'తేదీ (పాతవి ముందు)' : 'Date: Oldest'}</option>
                  <option value="amount-desc">{language === 'te' ? 'మొత్తం (ఎక్కువ ముందు)' : 'Amount: High to Low'}</option>
                  <option value="amount-asc">{language === 'te' ? 'మొత్తం (తక్కువ ముందు)' : 'Amount: Low to High'}</option>
                  <option value="title-asc">{language === 'te' ? 'వివరాలు (A-Z)' : 'Title: A-Z'}</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-500">
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600">
              {sortedExpenses.length} {language === 'te' ? 'నమోదైన ఖర్చులు' : 'logged expense items'}
            </span>
            <span className="font-black text-rose-700 text-sm">
              {language === 'te' ? 'మొత్తం ఖర్చు:' : 'Total Filtered:'} {formatINR(totalExpenseAmount)}
            </span>
          </div>

          {/* Conditional: Table View vs Grid View */}
          {expViewMode === 'table' ? (
            /* TABLE VIEW WITH STICKY RIGHT-ALIGNED ACTION COLUMN */
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto relative min-w-full">
                <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[750px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px] tracking-wider">
                      <th
                        onClick={() => handleExpSort('date')}
                        className="py-3 px-4 cursor-pointer hover:bg-slate-200/70 transition select-none whitespace-nowrap"
                      >
                        <span className="inline-flex items-center">{t.date} {renderExpSortIndicator('date')}</span>
                      </th>
                      <th
                        onClick={() => handleExpSort('category')}
                        className="py-3 px-4 cursor-pointer hover:bg-slate-200/70 transition select-none whitespace-nowrap"
                      >
                        <span className="inline-flex items-center">{t.expenseCategory} {renderExpSortIndicator('category')}</span>
                      </th>
                      <th
                        onClick={() => handleExpSort('title')}
                        className="py-3 px-4 cursor-pointer hover:bg-slate-200/70 transition select-none whitespace-nowrap"
                      >
                        <span className="inline-flex items-center">{t.expenseTitle} {renderExpSortIndicator('title')}</span>
                      </th>
                      <th
                        onClick={() => handleExpSort('paidTo')}
                        className="py-3 px-4 cursor-pointer hover:bg-slate-200/70 transition select-none whitespace-nowrap"
                      >
                        <span className="inline-flex items-center">{language === 'te' ? 'ఎవరికి ఇచ్చారు' : 'Paid To / Vendor'} {renderExpSortIndicator('paidTo')}</span>
                      </th>
                      <th className="py-3 px-4 whitespace-nowrap">{t.paymentMode}</th>
                      <th
                        onClick={() => handleExpSort('amount')}
                        className="py-3 px-4 text-right cursor-pointer hover:bg-slate-200/70 transition select-none whitespace-nowrap"
                      >
                        <span className="inline-flex items-center justify-end">{t.amount} {renderExpSortIndicator('amount')}</span>
                      </th>

                      {/* FIXED RIGHT-ALIGNED ACTION COLUMN */}
                      <th className="py-3 px-4 text-right sticky right-0 z-20 bg-slate-100 shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.08)] whitespace-nowrap min-w-[90px]">
                        {language === 'te' ? 'చర్య' : 'Action'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sortedExpenses.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-slate-400">
                          {language === 'te' ? 'ఖర్చులు ఏమీ లేవు' : 'No expenses found.'}
                        </td>
                      </tr>
                    ) : (
                      sortedExpenses.map((exp) => (
                        <tr key={exp.id} className="hover:bg-slate-50 transition bg-white">
                          <td className="py-3.5 px-4 font-bold text-slate-800 whitespace-nowrap">
                            {formatDate(exp.date)}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-semibold text-xs border border-slate-200">
                              {getCategoryIcon(exp.category)}
                              <span>{exp.category}</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{exp.title}</div>
                            {exp.notes && <div className="text-xs text-slate-500 mt-0.5">{exp.notes}</div>}
                            {exp.receiptNumber && (
                              <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-1 rounded">
                                Ref: {exp.receiptNumber}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                            {exp.paidTo}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium border border-slate-200">
                              {exp.paymentMode}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right font-black text-rose-700 whitespace-nowrap text-sm">
                            {formatINR(exp.amount)}
                          </td>

                          {/* STICKY RIGHT-ALIGNED ACTION CELL */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap sticky right-0 z-10 bg-white shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.08)]">
                            <div className="flex items-center justify-end">
                              {onDeleteExpense && (
                                <button
                                  onClick={() => {
                                    if (window.confirm(language === 'te' ? 'ఈ ఖర్చును రికార్డు నుండి తొలగించాలా?' : 'Delete this logged expense?')) {
                                      onDeleteExpense(exp.id);
                                    }
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                  title={language === 'te' ? 'తొలగించండి' : 'Delete Expense'}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* GRID VIEW OF EXPENSES */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedExpenses.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl">
                  {language === 'te' ? 'ఖర్చులు ఏమీ లేవు' : 'No expenses found.'}
                </div>
              ) : (
                sortedExpenses.map((exp) => (
                  <div
                    key={exp.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-semibold text-xs border border-slate-200">
                          {getCategoryIcon(exp.category)}
                          <span>{exp.category}</span>
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {formatDate(exp.date)}
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-slate-900 mt-2">
                        {exp.title}
                      </h3>

                      <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                        <div className="flex justify-between text-slate-600">
                          <span>Paid To:</span>
                          <span className="font-semibold text-slate-800">{exp.paidTo}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Payment Mode:</span>
                          <span className="font-medium text-slate-800">{exp.paymentMode}</span>
                        </div>
                        {exp.receiptNumber && (
                          <div className="flex justify-between text-slate-500 text-[11px]">
                            <span>Receipt Ref:</span>
                            <span className="font-mono">{exp.receiptNumber}</span>
                          </div>
                        )}
                        {exp.notes && (
                          <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200">
                            {exp.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-lg font-black text-rose-700">
                        {formatINR(exp.amount)}
                      </div>
                      {onDeleteExpense && (
                        <button
                          onClick={() => {
                            if (window.confirm(language === 'te' ? 'ఈ ఖర్చును రికార్డు నుండి తొలగించాలా?' : 'Delete this logged expense?')) {
                              onDeleteExpense(exp.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ) : (
        /* INVENTORY STOCK VIEW */
        <div className="space-y-4">
          {/* Inventory Controls Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={invSearchTerm}
                onChange={(e) => setInvSearchTerm(e.target.value)}
                placeholder={language === 'te' ? 'సరుకు పేరు, సప్లయర్ తో వెతకండి...' : 'Search raw materials, media, supplier...'}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Table / Grid Mode Toggle */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setInvViewMode('table')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    invViewMode === 'table'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title={language === 'te' ? 'టేబుల్ వ్యూ' : 'Table View'}
                >
                  <LayoutList className="w-4 h-4" />
                  <span className="hidden xs:inline">{language === 'te' ? 'టేబుల్' : 'Table'}</span>
                </button>

                <button
                  onClick={() => setInvViewMode('grid')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    invViewMode === 'grid'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title={language === 'te' ? 'గ్రిడ్ వ్యూ' : 'Grid View'}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden xs:inline">{language === 'te' ? 'గ్రిడ్' : 'Grid'}</span>
                </button>
              </div>

              {/* Low stock filter toggle */}
              <button
                onClick={() => setInvLowStockOnly(!invLowStockOnly)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  invLowStockOnly
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{language === 'te' ? 'తక్కువ స్టాక్ మాత్రమే' : 'Low Stock Only'}</span>
              </button>

              {/* Category selector */}
              <div className="relative">
                <select
                  value={invCategoryFilter}
                  onChange={(e) => setInvCategoryFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden text-slate-700 cursor-pointer"
                >
                  <option value="All">{language === 'te' ? 'అన్ని వర్గాలు' : 'All Categories'}</option>
                  <option value="Flex Rolls">Flex Rolls</option>
                  <option value="Star Flex Rolls">Star Flex Rolls</option>
                  <option value="Vinyl Rolls">Vinyl Rolls</option>
                  <option value="Solvent Inks">Solvent Inks</option>
                  <option value="Hardware">Hardware</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-500">
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Sort selector */}
              <div className="relative">
                <select
                  value={`${invSortField}-${invSortDirection}`}
                  onChange={(e) => {
                    const [f, d] = e.target.value.split('-') as [InventorySortField, SortDirection];
                    setInvSortField(f);
                    setInvSortDirection(d);
                  }}
                  className="appearance-none pl-3 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden text-slate-700 cursor-pointer"
                >
                  <option value="currentStock-asc">{language === 'te' ? 'స్టాక్ (తక్కువ నుండి ఎక్కువ)' : 'Stock: Lowest first'}</option>
                  <option value="currentStock-desc">{language === 'te' ? 'స్టాక్ (ఎక్కువ నుండి తక్కువ)' : 'Stock: Highest first'}</option>
                  <option value="name-asc">{language === 'te' ? 'పేరు (A-Z)' : 'Name: A-Z'}</option>
                  <option value="unitCost-desc">{language === 'te' ? 'ధర (ఎక్కువ నుండి తక్కువ)' : 'Cost: High to Low'}</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-500">
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Conditional: Table View vs Grid View */}
          {invViewMode === 'table' ? (
            /* INVENTORY TABLE VIEW WITH STICKY RIGHT-ALIGNED ACTION COLUMN */
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto relative min-w-full">
                <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px] tracking-wider">
                      <th
                        onClick={() => handleInvSort('name')}
                        className="py-3 px-4 cursor-pointer hover:bg-slate-200/70 transition select-none whitespace-nowrap"
                      >
                        <span className="inline-flex items-center">{language === 'te' ? 'మెటీరియల్ / సరుకు పేరు' : 'Material / Item Name'} {renderInvSortIndicator('name')}</span>
                      </th>
                      <th
                        onClick={() => handleInvSort('category')}
                        className="py-3 px-4 cursor-pointer hover:bg-slate-200/70 transition select-none whitespace-nowrap"
                      >
                        <span className="inline-flex items-center">{language === 'te' ? 'వర్గం' : 'Category'} {renderInvSortIndicator('category')}</span>
                      </th>
                      <th
                        onClick={() => handleInvSort('currentStock')}
                        className="py-3 px-4 text-center cursor-pointer hover:bg-slate-200/70 transition select-none whitespace-nowrap"
                      >
                        <span className="inline-flex items-center justify-center">{t.stockLevel} {renderInvSortIndicator('currentStock')}</span>
                      </th>
                      <th
                        onClick={() => handleInvSort('minThreshold')}
                        className="py-3 px-4 text-center cursor-pointer hover:bg-slate-200/70 transition select-none whitespace-nowrap"
                      >
                        <span className="inline-flex items-center justify-center">{t.minStock} {renderInvSortIndicator('minThreshold')}</span>
                      </th>
                      <th
                        onClick={() => handleInvSort('unitCost')}
                        className="py-3 px-4 text-right cursor-pointer hover:bg-slate-200/70 transition select-none whitespace-nowrap"
                      >
                        <span className="inline-flex items-center justify-end">{language === 'te' ? 'యూనిట్ ధర' : 'Unit Cost'} {renderInvSortIndicator('unitCost')}</span>
                      </th>
                      <th className="py-3 px-4 whitespace-nowrap">{language === 'te' ? 'సప్లయర్' : 'Supplier'}</th>
                      <th className="py-3 px-4 text-center whitespace-nowrap">{language === 'te' ? 'స్థితి' : 'Status'}</th>

                      {/* FIXED RIGHT-ALIGNED ACTION COLUMN */}
                      <th className="py-3 px-4 text-right sticky right-0 z-20 bg-slate-100 shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.08)] whitespace-nowrap min-w-[130px]">
                        {language === 'te' ? 'చర్య' : 'Action'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sortedInventory.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-10 text-center text-slate-400">
                          {language === 'te' ? 'సరుకులు ఏమీ లేవు' : 'No inventory items found.'}
                        </td>
                      </tr>
                    ) : (
                      sortedInventory.map((item) => {
                        const isLowStock = item.currentStock <= item.minThreshold;

                        return (
                          <tr key={item.id} className={`hover:bg-slate-50 transition ${isLowStock ? 'bg-amber-50/25' : 'bg-white'}`}>
                            <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-900">
                              {item.name}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                {item.category}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                              <span className={`font-black text-sm ${isLowStock ? 'text-amber-700' : 'text-slate-900'}`}>
                                {item.currentStock} {item.unit}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center whitespace-nowrap text-slate-600 font-medium">
                              {item.minThreshold} {item.unit}
                            </td>
                            <td className="py-3.5 px-4 text-right whitespace-nowrap font-bold text-slate-800">
                              {formatINR(item.unitCost)}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 text-xs">
                              {item.supplierName}
                            </td>
                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                              {isLowStock ? (
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 rounded-full text-[11px] font-black inline-flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                                  {language === 'te' ? 'స్టాక్ తక్కువ!' : 'LOW STOCK'}
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-bold">
                                  {language === 'te' ? 'సరిపడా ఉంది' : 'In Stock'}
                                </span>
                              )}
                            </td>

                            {/* STICKY RIGHT-ALIGNED ACTION CELL */}
                            <td className={`py-3.5 px-4 text-right whitespace-nowrap sticky right-0 z-10 ${isLowStock ? 'bg-amber-50/80' : 'bg-white'} shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.08)]`}>
                              <div className="flex items-center justify-end">
                                <button
                                  onClick={() => {
                                    setRestockItem(item);
                                    setRestockQty(item.unit === 'Pieces' ? 500 : 2);
                                  }}
                                  className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                                >
                                  <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                                  <span>{t.restock}</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* INVENTORY GRID VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedInventory.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl">
                  {language === 'te' ? 'సరుకులు ఏమీ లేవు' : 'No inventory items found.'}
                </div>
              ) : (
                sortedInventory.map((item) => {
                  const isLowStock = item.currentStock <= item.minThreshold;
                  return (
                    <div
                      key={item.id}
                      className={`bg-white border rounded-2xl p-5 shadow-xs relative transition flex flex-col justify-between ${
                        isLowStock ? 'border-amber-400 bg-amber-50/20' : 'border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                              {item.category}
                            </span>
                            <h3 className="font-bold text-slate-900 text-sm sm:text-base mt-0.5">
                              {item.name}
                            </h3>
                          </div>
                          {isLowStock ? (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 rounded-full text-[11px] font-black flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              {language === 'te' ? 'స్టాక్ తక్కువ!' : 'LOW STOCK'}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-bold">
                              {language === 'te' ? 'సరిపడా ఉంది' : 'In Stock'}
                            </span>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                          <div>
                            <span className="text-xs text-slate-500 block">{t.stockLevel}</span>
                            <span className={`text-2xl font-black ${isLowStock ? 'text-amber-600' : 'text-slate-900'}`}>
                              {item.currentStock}{' '}
                              <span className="text-xs font-semibold text-slate-500">{item.unit}</span>
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-slate-500 block">{t.minStock}</span>
                            <span className="text-sm font-bold text-slate-700">
                              {item.minThreshold} {item.unit}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 text-xs text-slate-500 flex justify-between items-center">
                          <span>Supplier: {item.supplierName}</span>
                          <span className="font-semibold text-slate-700">{formatINR(item.unitCost)} / unit</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                        <button
                          onClick={() => {
                            setRestockItem(item);
                            setRestockQty(item.unit === 'Pieces' ? 500 : 2);
                          }}
                          className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                          <span>{t.restock}</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}

      {/* Add Expense Popover Drawer */}
      {isOpenExpenseModal && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end">
          <div className="fixed inset-0" onClick={() => setIsOpenExpenseModal(false)} aria-hidden="true" />

          <div className="relative z-10 bg-white w-full max-w-md md:max-w-lg h-full shadow-2xl border-l border-slate-200 flex flex-col transition-all duration-300 ease-out overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base">
                  {language === 'te' ? 'కొత్త ఖర్చు నమోదు' : 'Log Operational Expense'}
                </h3>
              </div>
              <button
                onClick={() => setIsOpenExpenseModal(false)}
                className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExpenseSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    {t.expenseCategory}
                  </label>
                  <div className="relative">
                    <select
                      value={expCategory}
                      onChange={(e) => setExpCategory(e.target.value as ExpenseCategory)}
                      className="w-full appearance-none pl-3.5 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden font-medium text-slate-800 cursor-pointer"
                    >
                      <option value="Raw Materials/Inventory">Raw Materials / Flex Media / Inks</option>
                      <option value="Shop Rent">Shop Rent</option>
                      <option value="Power/Current Bill">Power / Current Bill (APEPDCL)</option>
                      <option value="Team Salaries">Team Salaries / Daily Wages</option>
                      <option value="Machine Maintenance">Machine Service & Parts</option>
                      <option value="Miscellaneous">Miscellaneous & Refreshments</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    {t.expenseTitle} *
                  </label>
                  <input
                    type="text"
                    required
                    value={expTitle}
                    onChange={(e) => setExpTitle(e.target.value)}
                    placeholder="e.g., 2 rolls Star Flex 10ft purchase"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      {t.amount} (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={expAmount}
                      onChange={(e) => setExpAmount(e.target.value ? Number(e.target.value) : '')}
                      placeholder="e.g., 4200"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden font-bold text-rose-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      {t.paymentMode}
                    </label>
                    <div className="relative">
                      <select
                        value={expPaymentMode}
                        onChange={(e) => setExpPaymentMode(e.target.value as any)}
                        className="w-full appearance-none pl-3 pr-8 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden text-slate-800 font-medium cursor-pointer"
                      >
                        <option value="UPI/PhonePe">UPI / PhonePe</option>
                        <option value="Cash">Cash</option>
                        <option value="Bank Transfer">Bank Transfer / IMPS</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-500">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    {language === 'te' ? 'ఎవరికి చెల్లించారు (Paid To)' : 'Paid To / Vendor'}
                  </label>
                  <input
                    type="text"
                    value={expPaidTo}
                    onChange={(e) => setExpPaidTo(e.target.value)}
                    placeholder="e.g., Surya Graphics / Landlord / Subba Rao"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    {language === 'te' ? 'రసీదు / బిల్లు నంబర్' : 'Bill / Receipt / UTR Ref'}
                  </label>
                  <input
                    type="text"
                    value={expReceipt}
                    onChange={(e) => setExpReceipt(e.target.value)}
                    placeholder="e.g., INV-4820 or UPI Ref ID"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    {language === 'te' ? 'గమనికలు (Notes)' : 'Internal Notes (Optional)'}
                  </label>
                  <textarea
                    rows={2}
                    value={expNotes}
                    onChange={(e) => setExpNotes(e.target.value)}
                    placeholder="Additional details..."
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden resize-none font-medium"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsOpenExpenseModal(false)}
                  className="px-4 py-2.5 border border-slate-300 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
                >
                  {language === 'te' ? 'ఖర్చును నమోదు చేయండి' : 'Record Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Restock Inventory Popover Drawer */}
      {restockItem && (
        <div 
          id="restock-material-modal"
          className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end"
        >
          {/* Backdrop */}
          <div 
            className="fixed inset-0" 
            onClick={() => setRestockItem(null)} 
            aria-hidden="true" 
          />

          {/* Right-side Popover Drawer Container */}
          <div 
            id="restock-material-popover-container"
            className="relative z-10 bg-white w-full max-w-md md:max-w-lg h-full shadow-2xl border-l border-slate-200 flex flex-col transition-all duration-300 ease-out overflow-hidden"
          >
            {/* Popover Header */}
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between shrink-0 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base">
                    {language === 'te' ? 'సరుకు రీస్టాక్ నమోదు' : 'Restock Raw Material'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {language === 'te' ? 'ఇన్వెంటరీ స్టాక్ అప్‌డేట్ & సప్లై వివరాలు' : 'Replenish inventory stock & update balance'}
                  </p>
                </div>
              </div>
              <button
                id="close-restock-drawer-btn"
                type="button"
                onClick={() => setRestockItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleRestockSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {/* Material Details Card */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                      {restockItem.category}
                    </span>
                    {restockItem.currentStock <= restockItem.minThreshold && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md">
                        <AlertTriangle className="w-3 h-3" />
                        {language === 'te' ? 'తక్కువ స్టాక్' : 'Low Stock'}
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{restockItem.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {language === 'te' ? 'సరఫరాదారు' : 'Supplier'}: <span className="font-medium text-slate-700">{restockItem.supplierName}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-500 block">{language === 'te' ? 'ప్రస్తుత నిల్వ' : 'Current Stock'}:</span>
                      <span className="font-bold text-slate-900 text-sm">
                        {restockItem.currentStock} {restockItem.unit}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">{language === 'te' ? 'కనిష్ట పరిమితి' : 'Min Threshold'}:</span>
                      <span className="font-medium text-slate-700 text-sm">
                        {restockItem.minThreshold} {restockItem.unit}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quantity Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    {language === 'te' ? 'చేర్చవలసిన పరిమాణం' : 'Quantity to Add'} ({restockItem.unit}) *
                  </label>
                  <input
                    id="restock-quantity-input"
                    type="number"
                    min={1}
                    required
                    value={restockQty}
                    onChange={(e) => setRestockQty(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3.5 py-2.5 text-base font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                  />
                </div>

                {/* Quick Add Presets */}
                <div>
                  <span className="block text-xs font-semibold text-slate-500 mb-2">
                    {language === 'te' ? 'త్వరిత మొత్తాలు' : 'Quick Presets'}:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(restockItem.unit === 'Pieces' ? [100, 500, 1000] : [1, 2, 5, 10]).map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setRestockQty((prev) => (prev ? prev + preset : preset))}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 rounded-lg text-xs font-bold border border-slate-200 transition cursor-pointer"
                      >
                        +{preset} {restockItem.unit}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setRestockQty(restockItem.unit === 'Pieces' ? 500 : 2)}
                      className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 underline ml-auto cursor-pointer"
                    >
                      {language === 'te' ? 'రీసెట్' : 'Reset'}
                    </button>
                  </div>
                </div>

                {/* Stock Projection Preview */}
                <div className="p-3.5 bg-emerald-50/80 border border-emerald-200/80 rounded-xl">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-800 font-medium">
                      {language === 'te' ? 'కొత్త నిల్వ అంచనా' : 'New Projected Stock'}:
                    </span>
                    <span className="font-bold text-emerald-900 text-sm">
                      {restockItem.currentStock + (Number(restockQty) || 0)} {restockItem.unit}
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-700/90 mt-1">
                    {language === 'te' 
                      ? `ప్రస్తుతం ${restockItem.currentStock} ఉన్న దానికి +${restockQty || 0} చేరుతుంది`
                      : `Increasing balance from ${restockItem.currentStock} to ${restockItem.currentStock + (Number(restockQty) || 0)} ${restockItem.unit}`}
                  </div>
                </div>
              </div>

              {/* Fixed Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
                <button
                  id="cancel-restock-btn"
                  type="button"
                  onClick={() => setRestockItem(null)}
                  className="px-4 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition"
                >
                  {t.cancel}
                </button>
                <button
                  id="submit-restock-btn"
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs transition inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4 text-amber-400" />
                  <span>{language === 'te' ? 'స్టాక్ అప్‌డేట్ చేయండి' : 'Update Stock'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
