import React from 'react';
import { PhoneCall } from 'lucide-react';
import { Language, PrintOrder } from '../types';
import { translations, formatINR } from '../utils/translations';

interface AlertsBannerProps {
  orders: PrintOrder[];
  language: Language;
}

export const AlertsBanner: React.FC<AlertsBannerProps> = ({
  orders,
  language,
}) => {
  const t = translations[language];

  // Calculate pending customers and total pending money
  const pendingOrders = orders.filter((o) => o.pendingAmount > 0);
  const totalPendingDues = pendingOrders.reduce((acc, curr) => acc + curr.pendingAmount, 0);
  const uniqueCustomersOwing = new Set(pendingOrders.map((o) => o.customerName)).size;

  if (totalPendingDues === 0) return null;

  return (
    <div className="mb-5">
      {/* Red Alert: Unpaid / Pending Recoveries - shown only on Pending Dues tab */}
      <div 
        id="alert-unpaid-dues"
        className="bg-red-50 border-2 border-red-500/80 rounded-xl p-3.5 sm:p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-red-950"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-red-700 tracking-wide text-xs uppercase bg-red-200/80 px-2 py-0.5 rounded">
                {language === 'te' ? 'బాకీల హెచ్చరిక' : 'PENDING RECOVERY ALERT'}
              </span>
              <span className="font-bold text-sm sm:text-base text-red-950">
                {uniqueCustomersOwing} {t.unpaidAlert}{' '}
                <span className="font-black text-red-600 text-base sm:text-lg">
                  {formatINR(totalPendingDues)}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
