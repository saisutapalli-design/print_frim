import React from 'react';
import { X, Printer, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Language, PrintOrder } from '../types';
import { translations, formatINR, formatDate } from '../utils/translations';

interface JobReceiptModalProps {
  order: PrintOrder | null;
  onClose: () => void;
  language: Language;
}

export const JobReceiptModal: React.FC<JobReceiptModalProps> = ({
  order,
  onClose,
  language,
}) => {
  const t = translations[language];

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end print:p-0 print:bg-white">
      {/* Backdrop */}
      <div className="fixed inset-0 print:hidden" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 bg-white w-full max-w-lg lg:max-w-xl h-full shadow-2xl border-l border-slate-200 flex flex-col transition-all duration-300 ease-out overflow-y-auto print:border-none print:shadow-none print:max-w-none print:w-full print:h-auto">
        {/* Top Bar (hidden in print) */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0 print:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            {language === 'te' ? 'జాబ్ స్లిప్ & ప్రింట్ రసీదు' : 'Print Job Slip & Invoice Receipt'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'te' ? 'ప్రింట్ చేయండి' : 'Print Slip'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-6 space-y-5 text-slate-900 font-sans">
          {/* Business Header */}
          <div className="text-center pb-4 border-b-2 border-slate-900">
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-950">
              Sairam Ads
            </h2>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Main Road, AP
            </p>
            <p className="text-xs font-mono text-slate-600">
              Ph: 98492 34120 / 94401 88321 • GSTIN: 37AAAAA0000A1Z5
            </p>
            <div className="inline-block mt-2 px-3 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-xs">
              ORDER SLIP: {order.orderNumber}
            </div>
          </div>

          {/* Job & Customer Details */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500 font-semibold block uppercase text-[10px]">Customer:</span>
              <span className="font-extrabold text-sm text-slate-950 block">{order.customerName}</span>
              <span className="font-mono text-slate-700">{order.customerPhone}</span>
              {order.contactPerson && (
                <span className="text-slate-500 block">Attn: {order.contactPerson}</span>
              )}
            </div>

            <div className="text-right">
              <span className="text-slate-500 font-semibold block uppercase text-[10px]">Date &amp; Operator:</span>
              <span className="font-bold text-slate-900 block">{formatDate(order.date)}</span>
              <span className="text-slate-600 block">Due: {formatDate(order.deliveryDate)}</span>
              <span className="text-slate-500 block">Staff: {order.assignedStaffName}</span>
            </div>
          </div>

          {/* Job Specifications Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 font-bold border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="p-2">Item Description</th>
                  <th className="p-2 text-center">Dimensions</th>
                  <th className="p-2 text-center">Sq.Ft</th>
                  <th className="p-2 text-right">Rate</th>
                  <th className="p-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 font-bold text-slate-900">
                    {order.category}
                    {order.notes && (
                      <span className="block text-[11px] font-normal text-slate-500 italic mt-0.5">
                        Note: {order.notes}
                      </span>
                    )}
                  </td>
                  <td className="p-2 text-center font-mono">
                    {order.widthFeet}&apos; × {order.heightFeet}&apos;
                    {order.quantity > 1 && ` (×${order.quantity})`}
                  </td>
                  <td className="p-2 text-center font-bold">{order.totalSqFt}</td>
                  <td className="p-2 text-right font-mono">₹{order.ratePerSqFt}</td>
                  <td className="p-2 text-right font-bold">{formatINR(order.totalCost)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Breakdown */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-xs">
            <div className="flex justify-between font-semibold text-slate-700">
              <span>Total Billed Amount:</span>
              <span className="font-bold text-slate-900">{formatINR(order.totalCost)}</span>
            </div>
            <div className="flex justify-between font-semibold text-emerald-700">
              <span>Advance / Collected Cash:</span>
              <span className="font-bold">{formatINR(order.paidAmount)} ({order.percentagePaid}%)</span>
            </div>

            {/* Prominent Balance Due Banner */}
            <div className={`flex justify-between items-center p-2.5 rounded-lg border mt-2 ${
              order.pendingAmount > 0 
                ? 'bg-red-50 border-red-300 text-red-950' 
                : 'bg-emerald-50 border-emerald-300 text-emerald-950'
            }`}>
              <span className="font-extrabold uppercase text-xs">
                {order.pendingAmount > 0 ? 'Balance Due to Pay:' : 'Payment Status:'}
              </span>
              <span className="text-base font-black">
                {order.pendingAmount > 0 ? formatINR(order.pendingAmount) : 'FULLY SETTLED (PAID)'}
              </span>
            </div>
          </div>

          {/* Payment History records if any */}
          {order.paymentHistory.length > 0 && (
            <div className="text-[11px] text-slate-500 space-y-1">
              <span className="font-bold uppercase tracking-wider block text-[10px] text-slate-400">
                Payment Transactions Log:
              </span>
              {order.paymentHistory.map((rec) => (
                <div key={rec.id} className="flex justify-between border-b border-slate-100 pb-0.5">
                  <span>{formatDate(rec.date)} • {rec.paymentMethod} {rec.note && `(${rec.note})`}</span>
                  <span className="font-bold text-slate-800">{formatINR(rec.amount)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Footer Terms */}
          <div className="pt-4 border-t border-slate-200 text-center text-[10px] text-slate-500">
            <p>1. Delivery upon payment of pending balance. 2. Verify design spelling before final printing.</p>
            <p className="mt-1 font-bold text-slate-700">Thank you for printing with Sairam Ads!</p>
          </div>
        </div>
      </div>
    </div>
  );
};
