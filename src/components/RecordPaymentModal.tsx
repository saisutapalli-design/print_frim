import React, { useState } from 'react';
import { X, Check, IndianRupee, CreditCard, ChevronDown } from 'lucide-react';
import { Language, PrintOrder, PaymentRecord } from '../types';
import { translations, formatINR } from '../utils/translations';

interface RecordPaymentModalProps {
  order: PrintOrder | null;
  onClose: () => void;
  onSavePayment: (orderId: string, payment: Omit<PaymentRecord, 'id'>) => void;
  language: Language;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  order,
  onClose,
  onSavePayment,
  language,
}) => {
  const t = translations[language];

  const [amount, setAmount] = useState<number>(order?.pendingAmount || 0);
  const [method, setMethod] = useState<'UPI/PhonePe' | 'Cash' | 'Bank Transfer'>('UPI/PhonePe');
  const [note, setNote] = useState<string>('');

  if (!order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      alert(language === 'te' ? 'దయచేసి సరైన మొత్తాన్ని నమోదు చేయండి.' : 'Please enter a valid payment amount.');
      return;
    }

    onSavePayment(order.id, {
      date: new Date().toISOString().split('T')[0],
      amount,
      paymentMethod: method,
      note: note.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 bg-white w-full max-w-md h-full shadow-2xl border-l border-slate-200 flex flex-col transition-all duration-300 ease-out">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {language === 'te' ? 'బాకీ చెల్లింపు నమోదు' : 'Collect / Record Payment'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">{order.orderNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Details Brief */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 text-xs space-y-1 shrink-0">
          <div className="flex justify-between font-bold text-slate-900">
            <span>{order.customerName}</span>
            <span className="font-mono text-slate-600">{order.customerPhone}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>{order.category} ({order.widthFeet}&apos; × {order.heightFeet}&apos;)</span>
            <span>Total: <strong>{formatINR(order.totalCost)}</strong></span>
          </div>
          <div className="flex justify-between pt-1 text-slate-600 border-t border-slate-200 font-medium">
            <span>Already Paid: <strong className="text-emerald-700">{formatINR(order.paidAmount)}</strong></span>
            <span>Remaining Due: <strong className="text-red-600">{formatINR(order.pendingAmount)}</strong></span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {language === 'te' ? 'వసూలైన మొత్తం (₹)' : 'Amount Collected Now (₹)'}
              </label>
              <div className="relative">
                <span className="text-slate-400 font-bold absolute left-3 top-1/2 -translate-y-1/2">₹</span>
                <input
                  type="number"
                  min="1"
                  max={order.pendingAmount}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 text-base font-black text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Quick Settle Full button */}
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setAmount(order.pendingAmount)}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition cursor-pointer"
                >
                  {language === 'te' ? 'పూర్తి బాకీ క్లియర్ చేయండి' : 'Full Settle'} ({formatINR(order.pendingAmount)})
                </button>
                {order.pendingAmount > 200 && (
                  <button
                    type="button"
                    onClick={() => setAmount(Math.round(order.pendingAmount / 2))}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                  >
                    50% ({formatINR(Math.round(order.pendingAmount / 2))})
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {t.paymentMode}
              </label>
              <div className="relative">
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as any)}
                  className="w-full appearance-none pl-3.5 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-hidden text-slate-800 cursor-pointer"
                >
                  <option value="UPI/PhonePe">UPI / PhonePe / Google Pay</option>
                  <option value="Cash">Cash (Shop Counter)</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {language === 'te' ? 'గమనిక (ఆప్షనల్)' : 'Payment Reference / Note (Optional)'}
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={language === 'te' ? 'ఉదా: కౌంటర్ వద్ద నగదు ఇచ్చారు' : 'e.g. Paid via PhonePe or Cash at counter'}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden"
              />
            </div>
          </div>

          <div className="shrink-0 bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-end gap-3 z-20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{language === 'te' ? 'చెల్లింపును నమోదు చేయండి' : 'Confirm & Save'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
