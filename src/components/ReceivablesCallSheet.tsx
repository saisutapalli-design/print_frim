import React, { useState } from 'react';
import { 
  PhoneCall, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle, 
  IndianRupee, 
  Calendar, 
  Search, 
  ExternalLink,
  ReceiptIndianRupee, 
  User, 
  Printer, 
  Copy, 
  Check,
  LayoutList,
  LayoutGrid,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronDown
} from 'lucide-react';
import { Language, PrintOrder } from '../types';
import { translations, formatINR, formatDate } from '../utils/translations';

interface ReceivablesCallSheetProps {
  orders: PrintOrder[];
  language: Language;
  onOpenRecordPayment: (order: PrintOrder) => void;
  onSelectOrderReceipt: (order: PrintOrder) => void;
}

type ReceivableSortField = 'pendingAmount' | 'customerName' | 'date' | 'totalCost';
type SortDirection = 'asc' | 'desc';

export const ReceivablesCallSheet: React.FC<ReceivablesCallSheetProps> = ({
  orders,
  language,
  onOpenRecordPayment,
  onSelectOrderReceipt,
}) => {
  const t = translations[language];
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [highDuesOnly, setHighDuesOnly] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<ReceivableSortField>('pendingAmount');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Filter only orders with pending dues > 0
  const pendingOrders = orders.filter((o) => o.pendingAmount > 0);

  const filtered = pendingOrders.filter((o) => {
    const matchesSearch =
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerPhone.includes(searchTerm) ||
      (o.contactPerson && o.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesHighDues = !highDuesOnly || o.pendingAmount >= 1000;
    return matchesSearch && matchesHighDues;
  });

  // Sort filtered orders
  const sorted = [...filtered].sort((a, b) => {
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

  const handleSort = (field: ReceivableSortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const totalOutstanding = pendingOrders.reduce((sum, o) => sum + o.pendingAmount, 0);

  // Generate WhatsApp reminder link
  const getWhatsAppLink = (order: PrintOrder) => {
    const rawPhone = order.customerPhone.replace(/[^0-9]/g, '');
    const cleanPhone = rawPhone.startsWith('91') ? rawPhone : `91${rawPhone}`;

    const messageTe = `నమస్కారం ${order.customerName} గారు, సాయిరాం యాడ్స్ (Sairam Ads) నుండి. మీ ప్రింటింగ్ జాబ్ (${order.category} - ${order.orderNumber}) కు సంబంధించి బకాయి మొత్తం ₹${order.pendingAmount} ఉంది. దయచేసి UPI (PhonePe / GPay) ద్వారా లేదా మా షాపు వద్ద చెల్లించగలరు. ధన్యవాదాలు!`;

    const messageEn = `Hello ${order.customerName}, Greetings from Sairam Ads. Regarding your print order (${order.category} - ${order.orderNumber}), there is an outstanding balance of ₹${order.pendingAmount}. Kindly settle the dues via UPI or at our shop counter. Thank you!`;

    const encodedMsg = encodeURIComponent(language === 'te' ? messageTe : messageEn);
    return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
  };

  const handleCopyReminder = (order: PrintOrder) => {
    const text = language === 'te'
      ? `నమస్కారం ${order.customerName} గారు, సాయిరాం యాడ్స్ (Sairam Ads) నుండి. మీ ప్రింటింగ్ జాబ్ (${order.category} - ${order.orderNumber}) కు సంబంధించి బకాయి మొత్తం ₹${order.pendingAmount} ఉంది. దయచేసి UPI ద్వారా లేదా మా షాపు వద్ద చెల్లించగలరు. ధన్యవాదాలు!`
      : `Hello ${order.customerName}, Greetings from Sairam Ads. Regarding your print order (${order.category} - ${order.orderNumber}), there is an outstanding balance of ₹${order.pendingAmount}. Kindly settle the dues via UPI or at our shop counter. Thank you!`;
    navigator.clipboard.writeText(text);
    setCopiedId(order.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const renderSortIndicator = (field: ReceivableSortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-60 inline-block ml-1" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-red-600 inline-block ml-1" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-red-600 inline-block ml-1" />
    );
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-red-900 text-white rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-800 text-red-200 text-xs font-bold uppercase tracking-wider mb-2">
              <AlertCircle className="w-3.5 h-3.5" />
              {language === 'te' ? 'బాకీల వసూలు కేంద్రం' : 'Revenue Recovery Desk'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {language === 'te' ? 'పెండింగ్ బాకీలు' : 'Pending Dues'}
            </h1>
          </div>

          <div className="bg-red-950/80 border border-red-700/80 rounded-2xl p-4 sm:text-right shrink-0">
            <span className="text-xs font-bold text-red-300 uppercase tracking-wide block">
              {language === 'te' ? 'మొత్తం రావలసిన బాకీ' : 'Total Outstanding Balance'}
            </span>
            <div className="text-3xl sm:text-4xl font-black text-amber-400 mt-1">
              {formatINR(totalOutstanding)}
            </div>
            <span className="text-xs text-red-200 mt-0.5 block font-medium">
              {pendingOrders.length} {language === 'te' ? 'ఆర్డర్లకు బకాయిలు ఉన్నాయి' : 'unsettled orders'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Action Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'te' ? 'కస్టమర్ పేరు లేదా ఫోన్ నంబర్ తో వెతకండి...' : 'Filter calling list by customer or phone...'}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
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
            onClick={() => setHighDuesOnly(!highDuesOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              highDuesOnly
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {language === 'te' ? 'పెద్ద బాకీలు (> ₹1,000)' : 'Dues > ₹1,000'}
          </button>

          {/* Sort selector */}
          <div className="relative">
            <select
              value={`${sortField}-${sortDirection}`}
              onChange={(e) => {
                const [f, d] = e.target.value.split('-') as [ReceivableSortField, SortDirection];
                setSortField(f);
                setSortDirection(d);
              }}
              className="appearance-none pl-3 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden text-slate-700 cursor-pointer"
            >
              <option value="pendingAmount-desc">{language === 'te' ? 'బాకీ (ఎక్కువ ముందు)' : 'Due: High to Low'}</option>
              <option value="pendingAmount-asc">{language === 'te' ? 'బాకీ (తక్కువ ముందు)' : 'Due: Low to High'}</option>
              <option value="date-desc">{language === 'te' ? 'తేదీ (కొత్తవి ముందు)' : 'Date: Newest First'}</option>
              <option value="customerName-asc">{language === 'te' ? 'కస్టమర్ (A-Z)' : 'Customer Name (A-Z)'}</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-500">
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
            title="Print Calling Sheet"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>{language === 'te' ? 'ప్రింట్' : 'Print'}</span>
          </button>

          <span className="text-xs text-slate-500 font-bold hidden md:inline whitespace-nowrap">
            {sorted.length} {language === 'te' ? 'కస్టమర్లు' : 'pending'}
          </span>
        </div>
      </div>

      {/* Render Table or Grid */}
      {viewMode === 'table' ? (
        /* TABLE VIEW WITH STICKY RIGHT-ALIGNED ACTION COLUMN */
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
                  <th className="py-3 px-4 whitespace-nowrap">{language === 'te' ? 'ఫోన్' : 'Phone'}</th>
                  <th className="py-3 px-4 whitespace-nowrap">{t.category}</th>
                  <th className="py-3 px-4 whitespace-nowrap">{t.sizeDimensions}</th>
                  <th
                    onClick={() => handleSort('totalCost')}
                    className="py-3 px-4 text-right cursor-pointer hover:bg-slate-200/70 transition select-none whitespace-nowrap"
                  >
                    <span className="inline-flex items-center justify-end">{t.totalCost} {renderSortIndicator('totalCost')}</span>
                  </th>
                  <th className="py-3 px-4 text-right whitespace-nowrap">{t.paidAmount}</th>
                  <th
                    onClick={() => handleSort('pendingAmount')}
                    className="py-3 px-4 text-right cursor-pointer hover:bg-slate-200/70 transition select-none whitespace-nowrap"
                  >
                    <span className="inline-flex items-center justify-end">{t.pending} {renderSortIndicator('pendingAmount')}</span>
                  </th>

                  {/* STICKY RIGHT-ALIGNED ACTION COLUMN */}
                  <th className="py-3 px-4 text-right sticky right-0 z-20 bg-slate-100 shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.08)] whitespace-nowrap min-w-[280px]">
                    {language === 'te' ? 'చర్య' : 'Action'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sorted.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      <p className="text-sm font-medium">
                        {language === 'te' ? 'బకాయిలు ఉన్న కస్టమర్లు ఎవరూ లేరు.' : 'No pending receivables matching filters.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  sorted.map((order) => {
                    const waLink = getWhatsAppLink(order);
                    const telLink = `tel:${order.customerPhone.replace(/[^0-9]/g, '')}`;

                    return (
                      <tr key={order.id} className="hover:bg-slate-50/90 transition bg-white">
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-bold text-slate-900">{formatDate(order.date)}</div>
                          <span className="text-[11px] font-mono text-slate-400">{order.orderNumber}</span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-bold text-slate-900">{order.customerName}</div>
                          {order.contactPerson && (
                            <span className="text-[11px] text-slate-500 block">
                              {order.contactPerson}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-700 whitespace-nowrap">
                          {order.customerPhone}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-800">
                          {order.category}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                          {order.widthFeet}&apos; × {order.heightFeet}&apos; ({order.totalSqFt} sq.ft)
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap font-bold text-slate-800">
                          {formatINR(order.totalCost)}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap font-bold text-emerald-700">
                          {formatINR(order.paidAmount)}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="text-red-600 font-black text-sm bg-red-100/80 px-2.5 py-1 rounded-lg inline-block border border-red-200">
                            {formatINR(order.pendingAmount)}
                          </div>
                        </td>

                        {/* STICKY RIGHT ACTION CELL */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap sticky right-0 z-10 bg-white shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.08)]">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Call button */}
                            <a
                              href={telLink}
                              className="p-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-lg transition cursor-pointer shadow-xs"
                              title={t.callCustomer}
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                            </a>

                            {/* WhatsApp button */}
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-lg transition cursor-pointer shadow-xs"
                              title="WhatsApp Reminder"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>

                            {/* Copy Reminder text */}
                            <button
                              onClick={() => handleCopyReminder(order)}
                              className={`p-1.5 rounded-lg transition cursor-pointer shadow-xs ${
                                copiedId === order.id
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                              title="Copy Reminder Text"
                            >
                              {copiedId === order.id ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>

                            {/* Collect payment */}
                            <button
                              onClick={() => onOpenRecordPayment(order)}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-xs"
                              title={t.recordPayment}
                            >
                              <span>{language === 'te' ? 'వసూలు' : 'Collect'}</span>
                            </button>

                            {/* View slip */}
                            <button
                              onClick={() => onSelectOrderReceipt(order)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer"
                              title="View Slip"
                            >
                              <ReceiptIndianRupee className="w-3.5 h-3.5" />
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
        /* GRID VIEW OF RECEIVABLES */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sorted.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl">
              <p className="text-sm font-medium">
                {language === 'te' ? 'బకాయిలు ఉన్న కస్టమర్లు ఎవరూ లేరు.' : 'No pending receivables matching filters.'}
              </p>
            </div>
          ) : (
            sorted.map((order) => {
              const waLink = getWhatsAppLink(order);
              const telLink = `tel:${order.customerPhone.replace(/[^0-9]/g, '')}`;

              return (
                <div
                  key={order.id}
                  className="bg-white border-2 border-red-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-red-300 hover:shadow-sm transition"
                >
                  <div>
                    {/* Header: Customer and Balance Due */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-mono text-slate-400 block">
                          {order.orderNumber} • {formatDate(order.date)}
                        </span>
                        <h3 className="font-extrabold text-base text-slate-900 mt-0.5">
                          {order.customerName}
                        </h3>
                        {order.contactPerson && (
                          <span className="text-xs text-slate-500 block">
                            Contact: {order.contactPerson}
                          </span>
                        )}
                      </div>

                      {/* Pending Amount Badge */}
                      <div className="text-right">
                        <span className="text-[10px] font-bold uppercase text-red-600 tracking-wider block">
                          {t.pending}
                        </span>
                        <div className="text-xl font-black text-red-600">
                          {formatINR(order.pendingAmount)}
                        </div>
                      </div>
                    </div>

                    {/* Job Specs */}
                    <div className="mt-3 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between text-slate-700 font-medium">
                        <span>{order.category}</span>
                        <span className="font-bold">{order.widthFeet}&apos; × {order.heightFeet}&apos; ({order.totalSqFt} sq.ft)</span>
                      </div>
                      <div className="flex justify-between text-slate-500 text-[11px] pt-1 border-t border-slate-200">
                        <span>
                          {language === 'te' ? 'బిల్లు మొత్తం:' : 'Total Billed:'} <strong>{formatINR(order.totalCost)}</strong>
                        </span>
                        <span className="text-emerald-700">
                          {language === 'te' ? 'ఇచ్చినది:' : 'Paid:'} <strong>{formatINR(order.paidAmount)}</strong> ({order.percentagePaid}%)
                        </span>
                      </div>
                      {order.notes && (
                        <div className="text-[11px] text-slate-500 italic pt-1">
                          Note: {order.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons: RIGHT ALIGNED */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end flex-wrap gap-2">
                    {/* View Slip */}
                    <button
                      onClick={() => onSelectOrderReceipt(order)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                      title="View Slip"
                    >
                      <ReceiptIndianRupee className="w-4 h-4" />
                    </button>

                    {/* Copy Reminder Message */}
                    <button
                      onClick={() => handleCopyReminder(order)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs ${
                        copiedId === order.id
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                      title="Copy reminder message to clipboard"
                    >
                      {copiedId === order.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{language === 'te' ? 'కాపీ అయింది!' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{language === 'te' ? 'మెసేజ్ కాపీ' : 'Copy'}</span>
                        </>
                      )}
                    </button>

                    {/* WhatsApp Reminder */}
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{language === 'te' ? 'వాట్సాప్' : 'WhatsApp'}</span>
                    </a>

                    {/* Direct Phone Call */}
                    <a
                      href={telLink}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{t.callCustomer}</span>
                    </a>

                    {/* Record Payment Button */}
                    <button
                      onClick={() => onOpenRecordPayment(order)}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                    >
                      <IndianRupee className="w-3.5 h-3.5" />
                      <span>{t.recordPayment}</span>
                    </button>
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
