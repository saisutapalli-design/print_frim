import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  CreditCard, 
  Zap, 
  Home, 
  Users, 
  Package, 
  Maximize2,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  PieChart,
  Printer
} from 'lucide-react';
import { Language, PrintOrder, ExpenseItem, TimeFilter } from '../types';
import { translations, formatINR } from '../utils/translations';

interface BalanceSheetDashboardProps {
  orders: PrintOrder[];
  expenses: ExpenseItem[];
  language: Language;
  timeFilter: TimeFilter;
  setTimeFilter: (tf: TimeFilter) => void;
  onNavigateToOrders: () => void;
  onNavigateToReceivables: () => void;
  onNavigateToExpenses: () => void;
}

export const BalanceSheetDashboard: React.FC<BalanceSheetDashboardProps> = ({
  orders,
  expenses,
  language,
  timeFilter,
  setTimeFilter,
  onNavigateToOrders,
  onNavigateToReceivables,
  onNavigateToExpenses,
}) => {
  const t = translations[language];

  // Filter orders and expenses based on selected time filter
  const filterByTime = <T extends { date: string }>(items: T[]): T[] => {
    const todayStr = '2026-09-04'; // Reference current date
    const today = new Date(todayStr);

    return items.filter((item) => {
      const itemDate = new Date(item.date);
      if (timeFilter === 'today') {
        return item.date === todayStr;
      }
      if (timeFilter === 'this_week') {
        // Last 7 days
        const diffTime = Math.abs(today.getTime() - itemDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      }
      if (timeFilter === 'this_month') {
        // Month of Sep 2026
        return itemDate.getMonth() === today.getMonth() && itemDate.getFullYear() === today.getFullYear();
      }
      return true; // all_time
    });
  };

  const filteredOrders = filterByTime<PrintOrder>(orders);
  const filteredExpenses = filterByTime<ExpenseItem>(expenses);

  // Financial aggregates
  const totalBilledRevenue = filteredOrders.reduce((sum, o) => sum + o.totalCost, 0);
  const totalCollectedRevenue = filteredOrders.reduce((sum, o) => sum + o.paidAmount, 0);
  const totalPendingDues = filteredOrders.reduce((sum, o) => sum + o.pendingAmount, 0);
  const totalExpensesAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalSqFtPrinted = filteredOrders.reduce((sum, o) => sum + o.totalSqFt, 0);

  // Profit metrics
  const realizedNetProfit = totalCollectedRevenue - totalExpensesAmount;
  const potentialNetProfit = totalBilledRevenue - totalExpensesAmount;
  const collectionRate = totalBilledRevenue > 0 ? Math.round((totalCollectedRevenue / totalBilledRevenue) * 100) : 0;
  const realizedMargin = totalCollectedRevenue > 0 ? Math.round((realizedNetProfit / totalCollectedRevenue) * 100) : 0;

  // Expense breakdown by category
  const expenseByCategory = {
    'Raw Materials/Inventory': 0,
    'Shop Rent': 0,
    'Power/Current Bill': 0,
    'Team Salaries': 0,
    'Machine Maintenance': 0,
    'Miscellaneous': 0,
  };

  filteredExpenses.forEach((exp) => {
    if (expenseByCategory[exp.category] !== undefined) {
      expenseByCategory[exp.category] += exp.amount;
    } else {
      expenseByCategory['Miscellaneous'] += exp.amount;
    }
  });

  // Category-wise sq.ft volume
  const sqftByCategory: Record<string, number> = {};
  filteredOrders.forEach((o) => {
    sqftByCategory[o.category] = (sqftByCategory[o.category] || 0) + o.totalSqFt;
  });

  // Calculate highest comparison point for the visual graph
  const maxFinancialPoint = Math.max(totalBilledRevenue, totalCollectedRevenue, totalExpensesAmount, 1000);

  return (
    <div className="space-y-6">
      {/* Header controls & Time period toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {language === 'te' ? 'ఆపరేషన్స్ బ్యాలెన్స్ షీట్ & లాభనష్టాలు' : 'Operations Balance Sheet & Profitability'}
          </h1>
        </div>

        {/* Time Segmented Pills & Print Action */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs sm:text-sm">
            {(
              [
                { id: 'today', label: t.today },
                { id: 'this_week', label: t.thisWeek },
                { id: 'this_month', label: t.thisMonth },
                { id: 'all_time', label: t.allTime },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                onClick={() => setTimeFilter(item.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  timeFilter === item.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer"
            title="Print Financial Summary"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'te' ? 'ప్రింట్' : 'Print Report'}</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Collected Cash (In-Hand Revenue) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t.collectedCash}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
              {formatINR(totalCollectedRevenue)}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
              <span>{language === 'te' ? 'మొత్తం బిల్లు:' : 'Total Billed:'}</span>
              <span className="font-semibold text-slate-700">{formatINR(totalBilledRevenue)}</span>
              <span className="text-emerald-600 font-bold ml-auto">
                {collectionRate}% {language === 'te' ? 'వసూలైనది' : 'realized'}
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(collectionRate, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Pending Receivables (Revenue Leakage Risk) */}
        <div 
          onClick={onNavigateToReceivables}
          className="bg-white border-2 border-red-200 rounded-2xl p-5 shadow-xs relative overflow-hidden cursor-pointer hover:border-red-400 hover:shadow-sm transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              {t.pendingDues}
            </span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-red-600 tracking-tight">
              {formatINR(totalPendingDues)}
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
              <span className="text-red-700 font-medium">
                {filteredOrders.filter((o) => o.pendingAmount > 0).length} {language === 'te' ? 'కస్టమర్లు బాకీ' : 'customers owe'}
              </span>
              <span className="text-red-600 font-bold flex items-center gap-0.5">
                {t.callNow} →
              </span>
            </div>
            <div className="w-full bg-red-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="bg-red-500 h-1.5 rounded-full" 
                style={{ width: `${totalBilledRevenue > 0 ? Math.min((totalPendingDues / totalBilledRevenue) * 100, 100) : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Total Expenses */}
        <div 
          onClick={onNavigateToExpenses}
          className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs relative overflow-hidden cursor-pointer hover:border-slate-400 transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t.totalExpenses}
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-rose-700 tracking-tight">
              {formatINR(totalExpensesAmount)}
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
              <span>{filteredExpenses.length} {language === 'te' ? 'ఎంట్రీలు నమోదయ్యాయి' : 'logged entries'}</span>
              <span className="text-slate-600 font-medium hover:underline">
                {language === 'te' ? 'వివరాలు చూడండి' : 'View Ledger'} →
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-600 font-medium">
              <span>{language === 'te' ? 'రెంట్ + పవర్:' : 'Rent+Power:'} {formatINR(expenseByCategory['Shop Rent'] + expenseByCategory['Power/Current Bill'])}</span>
            </div>
          </div>
        </div>

        {/* Card 4: Net Realized Profit & Production Volume */}
        <div className={`border rounded-2xl p-5 shadow-xs relative overflow-hidden ${
          realizedNetProfit >= 0 ? 'bg-slate-900 text-white border-slate-800' : 'bg-red-950 text-white border-red-900'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {t.netProfit}
            </span>
            <div className="w-8 h-8 rounded-lg bg-white/10 text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-1.5">
              {formatINR(realizedNetProfit)}
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-slate-300">
              <span className="text-amber-300 font-bold">
                {realizedMargin}% {t.profitMargin}
              </span>
              <span className="text-slate-300">
                {totalSqFtPrinted} {t.sqft}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              {language === 'te' 
                ? `బాకీలు వసూలైతే లాభం: ${formatINR(potentialNetProfit)}`
                : `If pending dues collected: ${formatINR(potentialNetProfit)}`}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Chart Section: Cash Flow & Expense Ledger Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Financial Flow Visual Comparison Bar Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {language === 'te' ? 'ఆదాయం vs ఖర్చుల పోలిక (నగదు ప్రవాహం)' : 'Revenue Inflow vs Outgoing Expenses'}
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-xs bg-slate-300" />
                <span className="text-slate-600">{language === 'te' ? 'బిల్లు' : 'Billed'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-xs bg-emerald-600" />
                <span className="text-slate-600">{language === 'te' ? 'వసూలైనది' : 'Collected'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-xs bg-rose-500" />
                <span className="text-slate-600">{language === 'te' ? 'ఖర్చులు' : 'Expenses'}</span>
              </div>
            </div>
          </div>

          {/* Graphical Bars */}
          <div className="py-6 space-y-6">
            {/* Total Billed */}
            <div>
              <div className="flex justify-between items-center text-xs sm:text-sm font-semibold mb-1.5">
                <span className="text-slate-700">{language === 'te' ? 'మొత్తం ఆర్డర్ల బుకింగ్ విలువ' : 'Total Billed Order Value'}</span>
                <span className="font-bold text-slate-900">{formatINR(totalBilledRevenue)}</span>
              </div>
              <div className="w-full h-7 bg-slate-100 rounded-lg p-1">
                <div 
                  className="h-full bg-slate-700 rounded-md transition-all duration-700 flex items-center justify-end pr-2 text-[11px] font-bold text-white"
                  style={{ width: `${Math.max((totalBilledRevenue / maxFinancialPoint) * 100, 8)}%` }}
                >
                  {formatINR(totalBilledRevenue)}
                </div>
              </div>
            </div>

            {/* Collected Cash */}
            <div>
              <div className="flex justify-between items-center text-xs sm:text-sm font-semibold mb-1.5">
                <span className="text-emerald-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {language === 'te' ? 'చేతికి వచ్చిన నగదు (Collected Cash)' : 'Collected Cash (Direct Inflow)'}
                </span>
                <span className="font-bold text-emerald-700">{formatINR(totalCollectedRevenue)}</span>
              </div>
              <div className="w-full h-7 bg-emerald-50 rounded-lg p-1 border border-emerald-100">
                <div 
                  className="h-full bg-emerald-600 rounded-md transition-all duration-700 flex items-center justify-end pr-2 text-[11px] font-bold text-white"
                  style={{ width: `${Math.max((totalCollectedRevenue / maxFinancialPoint) * 100, 8)}%` }}
                >
                  {formatINR(totalCollectedRevenue)}
                </div>
              </div>
            </div>

            {/* Total Expenses */}
            <div>
              <div className="flex justify-between items-center text-xs sm:text-sm font-semibold mb-1.5">
                <span className="text-rose-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  {language === 'te' ? 'దుకాణం నిర్వహణ ఖర్చులు (Total Expenses)' : 'Total Business Overheads & Expenses'}
                </span>
                <span className="font-bold text-rose-700">{formatINR(totalExpensesAmount)}</span>
              </div>
              <div className="w-full h-7 bg-rose-50 rounded-lg p-1 border border-rose-100">
                <div 
                  className="h-full bg-rose-600 rounded-md transition-all duration-700 flex items-center justify-end pr-2 text-[11px] font-bold text-white"
                  style={{ width: `${Math.max((totalExpensesAmount / maxFinancialPoint) * 100, 8)}%` }}
                >
                  {formatINR(totalExpensesAmount)}
                </div>
              </div>
            </div>

            {/* Net Cash Spread */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${realizedNetProfit >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                  {realizedNetProfit >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">
                    {language === 'te' ? 'నికర నిర్వహణ మిగులు (Realized Cash Balance)' : 'Current Operating Cash Spread'}
                  </span>
                  <span className="text-slate-500">
                    {language === 'te' ? 'వసూలైన నగదు నుండి ఖర్చులు తీసివేయగా' : 'Collected Cash minus all operating costs'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-base sm:text-lg font-black ${realizedNetProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {formatINR(realizedNetProfit)}
                </span>
                <span className="block text-[11px] text-slate-500">
                  {realizedNetProfit >= 0 ? (language === 'te' ? 'లాభంలో ఉన్నారు' : 'Net Cash Positive') : (language === 'te' ? 'ఖర్చులు ఎక్కువగా ఉన్నాయి' : 'Cash Deficit')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Categorized Expense Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-amber-600" />
                {language === 'te' ? 'ఖర్చుల వివరాల విభజన' : 'Expense Breakdown'}
              </h2>
              <span className="text-xs font-bold text-slate-500">
                {formatINR(totalExpensesAmount)}
              </span>
            </div>

            {/* List of expense components */}
            <div className="mt-4 space-y-3.5">
              {[
                { 
                  name: language === 'te' ? 'ముడిసరుకులు & రోల్స్' : 'Raw Materials / Media', 
                  amount: expenseByCategory['Raw Materials/Inventory'], 
                  icon: Package,
                  color: 'bg-indigo-500',
                  textColor: 'text-indigo-700'
                },
                { 
                  name: language === 'te' ? 'షాప్ అద్దె (Rent)' : 'Shop Rent', 
                  amount: expenseByCategory['Shop Rent'], 
                  icon: Home,
                  color: 'bg-blue-500',
                  textColor: 'text-blue-700'
                },
                { 
                  name: language === 'te' ? 'కరెంట్ బిల్లు (Power)' : 'Power / Current Bill', 
                  amount: expenseByCategory['Power/Current Bill'], 
                  icon: Zap,
                  color: 'bg-amber-500',
                  textColor: 'text-amber-700'
                },
                { 
                  name: language === 'te' ? 'జీతాలు & వేతనాలు' : 'Team Salaries & Wages', 
                  amount: expenseByCategory['Team Salaries'], 
                  icon: Users,
                  color: 'bg-emerald-500',
                  textColor: 'text-emerald-700'
                },
                { 
                  name: language === 'te' ? 'మెయింటెనెన్స్ & ఇతరాలు' : 'Machine Service & Misc', 
                  amount: expenseByCategory['Machine Maintenance'] + expenseByCategory['Miscellaneous'], 
                  icon: Layers,
                  color: 'bg-slate-500',
                  textColor: 'text-slate-700'
                },
              ].map((item, idx) => {
                const percent = totalExpensesAmount > 0 ? Math.round((item.amount / totalExpensesAmount) * 100) : 0;
                const Icon = item.icon;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <Icon className="w-3.5 h-3.5 text-slate-400" />
                        {item.name}
                      </span>
                      <span className="font-bold text-slate-900">
                        {formatINR(item.amount)} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-1.5 rounded-full ${item.color}`} 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={onNavigateToExpenses}
            className="w-full mt-6 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>{language === 'te' ? 'పూర్తి ఖర్చులు & ఇన్వెంటరీ చూడండి' : 'Manage Expenses & Inventory'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Production Volume (Sq.Ft by Category) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {language === 'te' ? 'ప్రింటింగ్ పరిమాణం & మెటీరియల్ ఉత్పత్తి (చ.అడుగుల్లో)' : 'Production Output Volume by Print Type (Square Feet)'}
            </h2>
          </div>
          <span className="text-xs font-black px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg">
            {totalSqFtPrinted} {t.sqft} {language === 'te' ? 'మొత్తం' : 'Total Output'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
          {Object.entries(sqftByCategory).map(([cat, sqft]) => (
            <div key={cat} className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block truncate">
                {cat}
              </span>
              <div className="text-lg font-black text-slate-900 mt-1">
                {sqft} <span className="text-xs font-normal text-slate-500">sq.ft</span>
              </div>
              <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
                {totalSqFtPrinted > 0 ? Math.round((sqft / totalSqFtPrinted) * 100) : 0}% of output
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
