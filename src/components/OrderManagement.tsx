import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ReceiptIndianRupee, 
  ChevronRight, 
  Eye, 
  MoreVertical,
  Calendar,
  Layers,
  Sparkles,
  Download,
  RotateCcw,
  Printer,
  ChevronDown,
  LayoutList,
  LayoutGrid,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Language, PrintOrder, PaymentStatus, PrintCategory } from '../types';
import { translations, formatINR, formatDate } from '../utils/translations';

interface OrderManagementProps {
  orders: PrintOrder[];
  language: Language;
  onOpenNewOrder: () => void;
  onSelectOrderReceipt: (order: PrintOrder) => void;
  onOpenRecordPayment: (order: PrintOrder) => void;
  onUpdateOrderStatus: (orderId: string, status: PrintOrder['jobStatus']) => void;
}

type OrderSortField = 'date' | 'orderNumber' | 'customerName' | 'totalCost' | 'paidAmount' | 'pendingAmount' | 'paymentStatus';
type SortDirection = 'asc' | 'desc';

export const OrderManagement: React.FC<OrderManagementProps> = ({
  orders,
  language,
  onOpenNewOrder,
  onSelectOrderReceipt,
  onOpenRecordPayment,
  onUpdateOrderStatus,
}) => {
  const t = translations[language];
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | PaymentStatus>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<OrderSortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm) ||
      (order.contactPerson && order.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())) ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || order.paymentStatus === statusFilter;
    const matchesCategory = categoryFilter === 'All' || order.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let valA: any = a[sortField];
    let valB: any = b[sortField];

    if (sortField === 'date') {
      valA = new Date(a.date).getTime();
      valB = new Date(b.date).getTime();
    } else if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: OrderSortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Calculate stats for header bar
  const totalBilled = filteredOrders.reduce((sum, o) => sum + o.totalCost, 0);
  const totalPaid = filteredOrders.reduce((sum, o) => sum + o.paidAmount, 0);
  const totalPending = filteredOrders.reduce((sum, o) => sum + o.pendingAmount, 0);

  const handleExportCSV = () => {
    const headers = ['Order #', 'Date', 'Customer', 'Phone', 'Category', 'Width(ft)', 'Height(ft)', 'SqFt', 'Rate/SqFt', 'Total Cost', 'Paid', 'Pending', 'Payment Status', 'Job Status', 'Staff'];
    const rows = sortedOrders.map(o => [
      o.orderNumber,
      o.date,
      `"${o.customerName}"`,
      o.customerPhone,
      `"${o.category}"`,
      o.widthFeet,
      o.heightFeet,
      o.totalSqFt,
      o.ratePerSqFt,
      o.totalCost,
      o.paidAmount,
      o.pendingAmount,
      o.paymentStatus,
      o.jobStatus,
      `"${o.assignedStaffName}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SairamAds_Orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setCategoryFilter('All');
    setSortField('date');
    setSortDirection('desc');
  };

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {t.statusPaid}
          </span>
        );
      case 'Partial':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            {t.statusPartial}
          </span>
        );
      case 'Unpaid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300 animate-pulse">
            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            {t.statusUnpaid}
          </span>
        );
    }
  };

  const renderSortIndicator = (field: OrderSortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-60 inline-block ml-1" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-amber-600 inline-block ml-1" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-amber-600 inline-block ml-1" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Search Tools */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {language === 'te' ? 'ఆర్డర్ల మేనేజ్‌మెంట్ & లెడ్జర్' : 'Print Job Orders & Ledger'}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Table / Grid Switch */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                id="orders-view-table-btn"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={language === 'te' ? 'టేబుల్ వ్యూ' : 'Table View'}
              >
                <LayoutList className="w-4 h-4" />
                <span className="hidden xs:inline">{language === 'te' ? 'టేబుల్' : 'Table'}</span>
              </button>

              <button
                id="orders-view-grid-btn"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={language === 'te' ? 'గ్రిడ్ వ్యూ' : 'Grid View'}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden xs:inline">{language === 'te' ? 'గ్రిడ్' : 'Grid'}</span>
              </button>
            </div>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer"
              title="Download Orders as CSV"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>{language === 'te' ? 'CSV డౌన్‌లోడ్' : 'Export CSV'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer"
              title="Print Orders Table"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>{language === 'te' ? 'ప్రింట్' : 'Print Table'}</span>
            </button>

            <button
              id="order-add-new-btn"
              onClick={onOpenNewOrder}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.newOrder}</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between pt-2 border-t border-slate-100">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="order-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'te' ? 'కస్టమర్ పేరు, ఫోన్ నంబర్ లేదా ఆర్డర్ నంబర్ తో వెతకండి...' : 'Search by customer name, phone, order #...'}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-hidden transition"
            />
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(['All', 'Paid', 'Partial', 'Unpaid'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  statusFilter === st
                    ? st === 'Unpaid'
                      ? 'bg-red-600 text-white shadow-xs'
                      : st === 'Partial'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : st === 'Paid'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {st === 'All' ? (language === 'te' ? 'అన్నీ' : 'All') : st}
              </button>
            ))}
          </div>

          {/* Category Dropdown, Sort Dropdown & Reset Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden text-slate-700 cursor-pointer"
              >
                <option value="All">{language === 'te' ? 'అన్ని మెటీరియల్స్' : 'All Materials'}</option>
                <option value="Normal Flex">Normal Flex</option>
                <option value="Star Flex">Star Flex</option>
                <option value="Vinyl Sticker">Vinyl Sticker</option>
                <option value="Backlit Glow Sign">Backlit Glow Sign</option>
                <option value="One-Way Vision">One-Way Vision</option>
                <option value="Cloth/Fabric Banner">Cloth/Fabric Banner</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-500">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Quick Sort Selector */}
            <div className="relative">
              <select
                value={`${sortField}-${sortDirection}`}
                onChange={(e) => {
                  const [f, d] = e.target.value.split('-') as [OrderSortField, SortDirection];
                  setSortField(f);
                  setSortDirection(d);
                }}
                className="appearance-none pl-3 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden text-slate-700 cursor-pointer"
              >
                <option value="date-desc">{language === 'te' ? 'తేదీ (కొత్తవి ముందు)' : 'Date (Newest first)'}</option>
                <option value="date-asc">{language === 'te' ? 'తేదీ (పాతవి ముందు)' : 'Date (Oldest first)'}</option>
                <option value="pendingAmount-desc">{language === 'te' ? 'బాకీ (ఎక్కువ నుండి తక్కువ)' : 'Pending Due (Highest first)'}</option>
                <option value="totalCost-desc">{language === 'te' ? 'బిల్లు మొత్తం (ఎక్కువ నుండి తక్కువ)' : 'Billed (Highest first)'}</option>
                <option value="customerName-asc">{language === 'te' ? 'కస్టమర్ పేరు (A-Z)' : 'Customer Name (A-Z)'}</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-500">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>

            {(searchTerm || statusFilter !== 'All' || categoryFilter !== 'All' || sortField !== 'date' || sortDirection !== 'desc') && (
              <button
                onClick={handleResetFilters}
                className="p-2 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                title={language === 'te' ? 'ఫిల్టర్లు రీసెట్ చేయండి' : 'Reset Filters'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Quick totals ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="text-slate-600">
            {language === 'te' ? 'చూపుతున్న ఆర్డర్లు:' : 'Showing Orders:'}{' '}
            <span className="font-bold text-slate-900">{sortedOrders.length}</span>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <span className="text-slate-500">{language === 'te' ? 'బిల్లు:' : 'Billed:'}</span>{' '}
              <span className="font-bold text-slate-900">{formatINR(totalBilled)}</span>
            </div>
            <div>
              <span className="text-emerald-700">{language === 'te' ? 'వసూలైనది:' : 'Paid:'}</span>{' '}
              <span className="font-bold text-emerald-700">{formatINR(totalPaid)}</span>
            </div>
            <div>
              <span className="text-red-700">{language === 'te' ? 'బాకీ:' : 'Due:'}</span>{' '}
              <span className="font-extrabold text-red-600">{formatINR(totalPending)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Conditional Rendering: Table View vs Grid View */}
      {viewMode === 'table' ? (
        /* TABLE VIEW WITH STICKY RIGHT-ALIGNED ACTION COLUMN & HORIZONTAL SCROLL */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto relative min-w-full">
            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[950px]">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px] tracking-wider">
                  <th 
                    onClick={() => handleSort('date')}
                    className="py-3 px-4 cursor-pointer hover:bg-slate-200/70 transition select-none whitespace-nowrap"
                  >
                    <span className="inline-flex items-center">{t.date} {renderSortIndicator('date')}</span>
                  </th>
                  <th 
                    onClick={() => handleSort('customerName')}
                    className="py-3 px-4 cursor-pointer hover:bg-slate-200/70 transition select-none whitespace-nowrap"
                  >
                    <span className="inline-flex items-center">{t.customer} {renderSortIndicator('customerName')}</span>
                  </th>
                  <th className="py-3 px-4 whitespace-nowrap">{t.category}</th>
                  <th className="py-3 px-4 whitespace-nowrap">{t.sizeDimensions}</th>
                  <th 
                    onClick={() => handleSort('totalCost')}
                    className="py-3 px-4 text-right cursor-pointer hover:bg-slate-200/70 transition select-none whitespace-nowrap"
                  >
                    <span className="inline-flex items-center justify-end">{t.totalCost} {renderSortIndicator('totalCost')}</span>
                  </th>
                  <th 
                    onClick={() => handleSort('paymentStatus')}
                    className="py-3 px-4 text-center cursor-pointer hover:bg-slate-200/70 transition select-none whitespace-nowrap"
                  >
                    <span className="inline-flex items-center justify-center">{t.paymentStatus} {renderSortIndicator('paymentStatus')}</span>
                  </th>
                  <th className="py-3 px-4 text-center whitespace-nowrap">{language === 'te' ? '% వసూలు' : '% Paid'}</th>
                  <th 
                    onClick={() => handleSort('pendingAmount')}
                    className="py-3 px-4 text-right cursor-pointer hover:bg-slate-200/70 transition select-none whitespace-nowrap"
                  >
                    <span className="inline-flex items-center justify-end">{t.pending} {renderSortIndicator('pendingAmount')}</span>
                  </th>

                  {/* FIXED RIGHT-ALIGNED ACTION COLUMN */}
                  <th className="py-3 px-4 text-right sticky right-0 z-20 bg-slate-100 shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.08)] whitespace-nowrap min-w-[210px]">
                    {language === 'te' ? 'చర్య' : 'Action'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      <p className="text-sm font-medium">
                        {language === 'te' ? 'ఎటువంటి ఆర్డర్లు కనపడలేదు.' : 'No matching print orders found.'}
                      </p>
                      <button
                        onClick={onOpenNewOrder}
                        className="mt-2 text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
                      >
                        {t.newOrder}
                      </button>
                    </td>
                  </tr>
                ) : (
                  sortedOrders.map((order) => {
                    const isUnpaid = order.paymentStatus === 'Unpaid';
                    const isPartial = order.paymentStatus === 'Partial';
                    const rowBgClass = isUnpaid ? 'bg-red-50/50 hover:bg-red-50' : isPartial ? 'bg-amber-50/30 hover:bg-amber-50/60' : 'bg-white hover:bg-slate-50/80';
                    const stickyColBg = isUnpaid ? 'bg-red-50' : isPartial ? 'bg-amber-50/80' : 'bg-white';

                    return (
                      <tr key={order.id} className={`${rowBgClass} transition`}>
                        {/* Date & Order Number */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-bold text-slate-900">{formatDate(order.date)}</div>
                          <span className="text-[11px] font-mono text-slate-500">{order.orderNumber}</span>
                        </td>

                        {/* Customer Name & Phone */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5 whitespace-nowrap">
                            <span>{order.customerName}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                            <span className="font-mono text-slate-700">{order.customerPhone}</span>
                            {order.contactPerson && (
                              <span className="text-slate-400 hidden sm:inline">({order.contactPerson})</span>
                            )}
                          </div>
                        </td>

                        {/* Print Category */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-semibold text-slate-800 block">{order.category}</span>
                          <span className="text-[11px] text-slate-500">
                            ₹{order.ratePerSqFt}/sq.ft
                          </span>
                        </td>

                        {/* Dimensions & Sq.Ft */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-mono font-bold text-slate-900">
                            {order.widthFeet}&apos; × {order.heightFeet}&apos;
                            {order.quantity > 1 && <span className="text-amber-600 ml-1">({order.quantity} pcs)</span>}
                          </div>
                          <div className="text-[11px] text-slate-500 font-semibold">
                            {order.totalSqFt} sq.ft
                          </div>
                        </td>

                        {/* Total Cost */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap font-black text-slate-900">
                          {formatINR(order.totalCost)}
                        </td>

                        {/* Payment Status Badge */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          {getStatusBadge(order.paymentStatus)}
                        </td>

                        {/* Percentage Paid Progress */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="w-20 mx-auto space-y-1">
                            <span className={`text-xs font-black ${
                              order.percentagePaid === 100 ? 'text-emerald-700' : order.percentagePaid > 0 ? 'text-amber-700' : 'text-red-600'
                            }`}>
                              {order.percentagePaid}%
                            </span>
                            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-1.5 rounded-full ${
                                  order.percentagePaid === 100
                                    ? 'bg-emerald-600'
                                    : order.percentagePaid > 0
                                    ? 'bg-amber-500'
                                    : 'bg-red-500'
                                }`}
                                style={{ width: `${order.percentagePaid}%` }}
                              />
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {formatINR(order.paidAmount)}
                            </div>
                          </div>
                        </td>

                        {/* Pending Amount */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          {order.pendingAmount > 0 ? (
                            <div className="text-red-600 font-black text-sm bg-red-100/80 px-2.5 py-1 rounded-lg inline-block border border-red-200">
                              {formatINR(order.pendingAmount)}
                            </div>
                          ) : (
                            <span className="text-emerald-700 font-bold text-xs">₹0 (Nil)</span>
                          )}
                        </td>

                        {/* STICKY RIGHT-ALIGNED ACTION COLUMN CELL */}
                        <td className={`py-3.5 px-4 text-right whitespace-nowrap sticky right-0 z-10 ${stickyColBg} shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.08)]`}>
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Collect Payment button if pending */}
                            {order.pendingAmount > 0 && (
                              <button
                                onClick={() => onOpenRecordPayment(order)}
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition cursor-pointer flex items-center gap-1"
                                title={language === 'te' ? 'బాకీ వసూలు నమోదు' : 'Record payment'}
                              >
                                <span>{language === 'te' ? 'డబ్బులు వసూలు' : 'Collect'}</span>
                              </button>
                            )}

                            {/* Print/View Job Receipt */}
                            <button
                              onClick={() => onSelectOrderReceipt(order)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer"
                              title={language === 'te' ? 'జాబ్ స్లిప్ / రసీదు' : 'View / Print Job Slip'}
                            >
                              <ReceiptIndianRupee className="w-4 h-4" />
                            </button>

                            {/* Quick Phone Call if has pending dues */}
                            {order.pendingAmount > 0 && (
                              <a
                                href={`tel:${order.customerPhone.replace(/\s+/g, '')}`}
                                className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition cursor-pointer"
                                title={language === 'te' ? 'కస్టమర్ కు కాల్ చేయండి' : 'Call customer'}
                              >
                                <Phone className="w-4 h-4" />
                              </a>
                            )}

                            {/* Job Status selector */}
                            <div className="relative inline-block text-left">
                              <select
                                value={order.jobStatus}
                                onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as PrintOrder['jobStatus'])}
                                className="appearance-none text-[11px] py-1 pl-2.5 pr-6 bg-slate-100 hover:bg-slate-200/70 border border-slate-200 rounded-lg text-slate-800 font-medium cursor-pointer"
                              >
                                <option value="Received">Received</option>
                                <option value="Designing">Designing</option>
                                <option value="Printing">Printing</option>
                                <option value="Finishing">Finishing</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-slate-500">
                                <ChevronDown className="w-3 h-3" />
                              </div>
                            </div>
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
        /* GRID VIEW OF ORDERS */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedOrders.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl">
              <p className="text-sm font-medium">
                {language === 'te' ? 'ఎటువంటి ఆర్డర్లు కనపడలేదు.' : 'No matching print orders found.'}
              </p>
              <button
                onClick={onOpenNewOrder}
                className="mt-2 text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
              >
                {t.newOrder}
              </button>
            </div>
          ) : (
            sortedOrders.map((order) => {
              const isUnpaid = order.paymentStatus === 'Unpaid';
              const isPartial = order.paymentStatus === 'Partial';

              return (
                <div
                  key={order.id}
                  className={`bg-white border rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition ${
                    isUnpaid ? 'border-red-300 bg-red-50/20' : isPartial ? 'border-amber-300 bg-amber-50/10' : 'border-slate-200'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-mono text-slate-500 block">
                          {order.orderNumber} • {formatDate(order.date)}
                        </span>
                        <h3 className="font-extrabold text-base text-slate-900 mt-0.5">
                          {order.customerName}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <span className="font-mono text-slate-700">{order.customerPhone}</span>
                          {order.contactPerson && (
                            <span className="text-slate-400">({order.contactPerson})</span>
                          )}
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        {getStatusBadge(order.paymentStatus)}
                      </div>
                    </div>

                    {/* Job Details Card */}
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1.5">
                      <div className="flex justify-between items-center text-slate-800 font-semibold">
                        <span>{order.category}</span>
                        <span className="font-mono font-bold">
                          {order.widthFeet}&apos; × {order.heightFeet}&apos; {order.quantity > 1 ? `(${order.quantity} pcs)` : ''}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-500 text-[11px]">
                        <span>{order.totalSqFt} sq.ft @ ₹{order.ratePerSqFt}</span>
                        <span>Staff: {order.assignedStaffName}</span>
                      </div>

                      {/* Financials in Card */}
                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase text-slate-500 block font-bold">Billed</span>
                          <span className="font-black text-slate-900 text-sm">{formatINR(order.totalCost)}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-emerald-700 block font-bold">Paid</span>
                          <span className="font-bold text-emerald-700 text-sm">{formatINR(order.paidAmount)}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] uppercase text-red-600 block font-bold">Due</span>
                          <span className={`font-black text-sm ${order.pendingAmount > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                            {formatINR(order.pendingAmount)}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${
                            order.percentagePaid === 100
                              ? 'bg-emerald-600'
                              : order.percentagePaid > 0
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${order.percentagePaid}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Actions: RIGHT ALIGNED */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2 flex-wrap">
                    {/* Job Status Selector */}
                    <div className="relative inline-block text-left mr-auto">
                      <select
                        value={order.jobStatus}
                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as PrintOrder['jobStatus'])}
                        className="appearance-none text-[11px] py-1.5 pl-2.5 pr-6 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-slate-800 font-medium cursor-pointer"
                      >
                        <option value="Received">Received</option>
                        <option value="Designing">Designing</option>
                        <option value="Printing">Printing</option>
                        <option value="Finishing">Finishing</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-slate-500">
                        <ChevronDown className="w-3 h-3" />
                      </div>
                    </div>

                    {/* View Slip */}
                    <button
                      onClick={() => onSelectOrderReceipt(order)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                      title="View / Print Receipt"
                    >
                      <ReceiptIndianRupee className="w-4 h-4" />
                    </button>

                    {/* Call Customer if pending */}
                    {order.pendingAmount > 0 && (
                      <a
                        href={`tel:${order.customerPhone.replace(/\s+/g, '')}`}
                        className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl text-xs font-bold transition cursor-pointer"
                        title="Call Customer"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    )}

                    {/* Collect Payment button */}
                    {order.pendingAmount > 0 && (
                      <button
                        onClick={() => onOpenRecordPayment(order)}
                        className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
                      >
                        {language === 'te' ? 'డబ్బులు వసూలు' : 'Collect Dues'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
