import React, { useState, useEffect } from 'react';
import { X, Calculator, Sparkles, Check, Phone, User, Calendar, Ruler, IndianRupee, Layers, Printer, ChevronDown } from 'lucide-react';
import { Language, PrintOrder, PrintCategory, StaffMember, PaymentStatus } from '../types';
import { translations, formatINR } from '../utils/translations';
import { standardPrintRates, standardPresets } from '../data/mockData';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveOrder: (newOrder: Omit<PrintOrder, 'id' | 'orderNumber' | 'paymentHistory'>) => void;
  staffList: StaffMember[];
  language: Language;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({
  isOpen,
  onClose,
  onSaveOrder,
  staffList,
  language,
}) => {
  const t = translations[language];

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [category, setCategory] = useState<PrintCategory>('Normal Flex');
  const [widthFeet, setWidthFeet] = useState<number>(10);
  const [heightFeet, setHeightFeet] = useState<number>(4);
  const [quantity, setQuantity] = useState<number>(1);
  const [ratePerSqFt, setRatePerSqFt] = useState<number>(standardPrintRates['Normal Flex'] || 14);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [assignedStaffId, setAssignedStaffId] = useState<string>(staffList[0]?.id || 'staff-1');
  const [deliveryDate, setDeliveryDate] = useState<string>('2026-09-05');
  const [notes, setNotes] = useState<string>('');

  // Update default rate when category changes
  useEffect(() => {
    if (standardPrintRates[category]) {
      setRatePerSqFt(standardPrintRates[category]);
    }
  }, [category]);

  if (!isOpen) return null;

  // Calculated values
  const totalSqFt = Number((widthFeet * heightFeet * quantity).toFixed(1));
  const totalCost = Math.round(totalSqFt * ratePerSqFt);
  const pendingAmount = Math.max(0, totalCost - paidAmount);
  
  let paymentStatus: PaymentStatus = 'Unpaid';
  if (paidAmount >= totalCost && totalCost > 0) {
    paymentStatus = 'Paid';
  } else if (paidAmount > 0) {
    paymentStatus = 'Partial';
  }

  const percentagePaid = totalCost > 0 ? Math.min(100, Math.round((paidAmount / totalCost) * 100)) : 0;

  // Quick Preset Handlers
  const handlePresetSelect = (w: number, h: number) => {
    setWidthFeet(w);
    setHeightFeet(h);
  };

  const handleQuickPayment = (type: 'full' | 'half' | 'quarter' | 'zero') => {
    if (type === 'full') setPaidAmount(totalCost);
    if (type === 'half') setPaidAmount(Math.round(totalCost * 0.5));
    if (type === 'quarter') setPaidAmount(Math.round(totalCost * 0.25));
    if (type === 'zero') setPaidAmount(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert(language === 'te' ? 'దయచేసి కస్టమర్ పేరు మరియు ఫోన్ నంబర్ నమోదు చేయండి.' : 'Please provide Customer Name and Phone Number.');
      return;
    }

    const assignedStaff = staffList.find((s) => s.id === assignedStaffId);

    onSaveOrder({
      date: new Date().toISOString().split('T')[0],
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      contactPerson: contactPerson.trim() || undefined,
      category,
      widthFeet,
      heightFeet,
      quantity,
      totalSqFt,
      ratePerSqFt,
      totalCost,
      paidAmount,
      pendingAmount,
      paymentStatus,
      percentagePaid,
      assignedStaffId,
      assignedStaffName: assignedStaff ? assignedStaff.name : 'Staff Member',
      jobStatus: 'Received',
      deliveryDate,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div 
        id="new-order-popover-container"
        className="relative z-10 bg-white w-full max-w-xl md:max-w-2xl h-full shadow-2xl border-l border-slate-200 flex flex-col transition-all duration-300 ease-out overflow-hidden"
      >
        {/* Fixed Popover Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg tracking-tight">
                {language === 'te' ? 'కొత్త ప్రింటింగ్ ఆర్డర్ నమోదు' : 'Create New Print Order'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Popover Body Form with fixed footer */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Scrollable Middle Content - Only this scrolls */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {/* Field 1: Customer Name (Vertical - 1 field per row) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t.customerName} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  id="modal-customer-name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={language === 'te' ? 'ఉదా: వెంకటేశ్వర స్వీట్స్' : 'e.g. Balaji Cloth Emporium'}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Field 2: Phone Number (Vertical - 1 field per row) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t.phone} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  id="modal-customer-phone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="98480 12345"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Field 3: Contact Person (Optional) (Vertical - 1 field per row) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t.contactPerson}
              </label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder={language === 'te' ? 'ఉదా: రాము (మేనేజర్)' : 'e.g. Ramu (Store Manager)'}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-hidden"
              />
            </div>

            {/* Field 4: Print Material Category (Vertical - 1 field per row) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t.printCategory}
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PrintCategory)}
                  className="w-full appearance-none pl-3.5 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:border-amber-500 focus:outline-hidden text-slate-800 cursor-pointer"
                >
                  <option value="Normal Flex">Normal Flex (₹14/sq.ft)</option>
                  <option value="Star Flex">Star Flex High Gloss (₹22/sq.ft)</option>
                  <option value="Vinyl Sticker">Vinyl Sticker 3M (₹30/sq.ft)</option>
                  <option value="Backlit Glow Sign">Backlit Glow Sign (₹45/sq.ft)</option>
                  <option value="One-Way Vision">One-Way Vision (₹48/sq.ft)</option>
                  <option value="Cloth/Fabric Banner">Cloth / Fabric Banner (₹18/sq.ft)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Field 5: Standard Size Presets (Vertical - 1 field per row) */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                {language === 'te' ? 'స్టాండర్డ్ సైజులు (త్వరిత ఎంపిక):' : 'Standard Size Presets:'}
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {standardPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePresetSelect(preset.width, preset.height)}
                    className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition cursor-pointer ${
                      widthFeet === preset.width && heightFeet === preset.height
                        ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Field 6: Rate per Sq.Ft (₹) (Vertical - 1 field per row) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t.ratePerSqFt}
              </label>
              <div className="relative">
                <span className="text-slate-400 font-bold absolute left-3 top-1/2 -translate-y-1/2">₹</span>
                <input
                  type="number"
                  min="1"
                  value={ratePerSqFt}
                  onChange={(e) => setRatePerSqFt(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white focus:border-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Field 7: Width (Feet) (Vertical - 1 field per row) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t.widthFt}
              </label>
              <div className="relative">
                <Ruler className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={widthFeet}
                  onChange={(e) => setWidthFeet(Math.max(0.1, Number(e.target.value)))}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:border-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Field 8: Height (Feet) (Vertical - 1 field per row) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t.heightFt}
              </label>
              <div className="relative">
                <Ruler className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={heightFeet}
                  onChange={(e) => setHeightFeet(Math.max(0.1, Number(e.target.value)))}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:border-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Field 9: Quantity (Vertical - 1 field per row) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t.qty}
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:border-amber-500 focus:outline-hidden"
              />
            </div>

            {/* Calculation Summary Card */}
            <div className="bg-slate-100 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-amber-500" />
                <span className="font-semibold text-slate-700 text-xs sm:text-sm">
                  {widthFeet}&apos; × {heightFeet}&apos; ({quantity} pcs) = <strong className="text-slate-900">{totalSqFt} Sq.Ft</strong>
                </span>
              </div>
              <div className="text-sm sm:text-base font-black text-slate-900">
                {language === 'te' ? 'మొత్తం ఖరీదు:' : 'Total Job Cost:'}{' '}
                <span className="text-emerald-700">{formatINR(totalCost)}</span>
              </div>
            </div>

            {/* Field 10: Advance Payment (Vertical - 1 field per row) */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="block text-xs font-black text-amber-950 uppercase tracking-wider">
                  {t.advancePayment}
                </label>

                {/* Quick Split Buttons */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleQuickPayment('full')}
                    className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                  >
                    {t.fullPayment}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPayment('half')}
                    className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-600 text-white hover:bg-amber-700 cursor-pointer"
                  >
                    {t.halfPayment}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPayment('quarter')}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300 cursor-pointer"
                  >
                    {t.quarterPayment}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPayment('zero')}
                    className="px-2.5 py-1 text-xs font-bold rounded-lg bg-red-100 text-red-700 hover:bg-red-200 cursor-pointer"
                  >
                    {t.unpaid}
                  </button>
                </div>
              </div>

              <div className="relative">
                <span className="text-slate-500 font-bold absolute left-3 top-1/2 -translate-y-1/2">₹</span>
                <input
                  type="number"
                  min="0"
                  max={totalCost}
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(Math.min(totalCost, Math.max(0, Number(e.target.value))))}
                  className="w-full pl-8 pr-3 py-2.5 text-base bg-white border border-amber-300 rounded-xl font-black text-slate-900 focus:outline-hidden"
                />
              </div>

              {/* Resulting Pending Amount */}
              <div className={`flex items-center justify-between px-3 py-2 rounded-xl border font-bold text-sm ${
                pendingAmount > 0 
                  ? 'bg-red-50 text-red-900 border-red-300' 
                  : 'bg-emerald-50 text-emerald-900 border-emerald-300'
              }`}>
                <span>{language === 'te' ? 'మిగిలిన బాకీ:' : 'Pending Due:'}</span>
                <span className="text-base font-black">
                  {formatINR(pendingAmount)} ({percentagePaid}% paid)
                </span>
              </div>
            </div>

            {/* Field 11: Assigned Staff (Vertical - 1 field per row) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t.assignedStaff}
              </label>
              <div className="relative">
                <select
                  value={assignedStaffId}
                  onChange={(e) => setAssignedStaffId(e.target.value)}
                  className="w-full appearance-none pl-3.5 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-hidden text-slate-800 cursor-pointer"
                >
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Field 12: Delivery Date (Vertical - 1 field per row) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t.deliveryDate}
              </label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-hidden text-slate-800"
              />
            </div>

            {/* Field 13: Notes (Vertical - 1 field per row) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t.jobNotes}
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={language === 'te' ? 'ఉదా: నాలుగు వైపులా రింగులు వేయాలి, 1 అంగుళం మడత' : 'e.g. Eyelets every 2 feet, glossy finish'}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden"
              />
            </div>
          </div>

          {/* Fixed Footer at the bottom for Cancel and Print Job Slip buttons */}
          <div className="shrink-0 bg-slate-50 border-t border-slate-200 px-5 sm:px-6 py-4 flex items-center justify-between gap-3 z-20">
            <div className="text-xs">
              <span className="text-slate-500 font-medium mr-1.5">
                {language === 'te' ? 'మొత్తం:' : 'Total:'} <strong className="text-slate-900 font-bold">{formatINR(totalCost)}</strong>
              </span>
              <span className={`font-bold ${pendingAmount > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                • {language === 'te' ? 'బాకీ:' : 'Due:'} {formatINR(pendingAmount)}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                id="submit-new-order-btn"
                className="px-5 py-2 sm:px-6 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-black rounded-xl shadow-md transition cursor-pointer flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>{t.saveOrder}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
