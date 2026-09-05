import React from 'react';
import { 
  X, 
  Bell, 
  Package, 
  AlertCircle, 
  PhoneCall, 
  CheckCheck, 
  ChevronRight, 
  Clock, 
  Trash2,
  AlertTriangle 
} from 'lucide-react';
import { Language, InventoryItem, PrintOrder } from '../types';
import { formatINR } from '../utils/translations';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: InventoryItem[];
  orders: PrintOrder[];
  language: Language;
  onNavigateToInventory: () => void;
  onNavigateToPendingDues: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  inventory,
  orders,
  language,
  onNavigateToInventory,
  onNavigateToPendingDues,
}) => {
  if (!isOpen) return null;

  // Derive notifications
  const lowStockItems = inventory.filter((item) => item.currentStock <= item.minThreshold);
  const pendingOrders = orders.filter((o) => o.pendingAmount > 0);
  const totalPendingDues = pendingOrders.reduce((acc, curr) => acc + curr.pendingAmount, 0);

  const notificationCount = lowStockItems.length + (totalPendingDues > 0 ? 1 : 0);

  return (
    <div 
      id="notifications-panel"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end"
    >
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Drawer */}
      <div className="relative z-10 bg-white w-full max-w-md h-full shadow-2xl border-l border-slate-200 flex flex-col transition-all duration-300 ease-out overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>{language === 'te' ? 'నోటిఫికేషన్లు' : 'Notifications'}</span>
                {notificationCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-black bg-amber-400 text-slate-950">
                    {notificationCount}
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-400">
                {language === 'te' ? 'ఇన్వెంటరీ & బాకీల అలర్ట్స్' : 'Inventory alerts & balance notices'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {notificationCount === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <CheckCheck className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
              <p className="font-semibold text-sm text-slate-700">
                {language === 'te' ? 'అన్నీ సరిగ్గా ఉన్నాయి!' : 'All caught up!'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'te' ? 'ఎలాంటి హెచ్చరికలు లేవు.' : 'No pending alerts or low stock warnings.'}
              </p>
            </div>
          ) : (
            <>
              {/* 1. Low Inventory Notifications */}
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border-2 border-amber-400/80 rounded-xl p-3.5 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Package className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded">
                          {language === 'te' ? 'తక్కువ స్టాక్ హెచ్చరిక' : 'LOW INVENTORY'}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Live
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 mt-1 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {language === 'te'
                          ? `ప్రస్తుత స్టాక్: ${item.currentStock} ${item.unit} మాత్రమే ఉంది (కనీస పరిమితి: ${item.minThreshold} ${item.unit}).`
                          : `Remaining: ${item.currentStock} ${item.unit} left (Safety threshold: ${item.minThreshold} ${item.unit}).`}
                      </p>
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateToInventory();
                        }}
                        className="mt-2 text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                      >
                        <span>{language === 'te' ? 'ఇన్వెంటరీ చూడండి / రీస్టాక్ చేయండి' : 'Check Inventory / Restock'}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* 2. Outstanding Balance Notification */}
              {totalPendingDues > 0 && (
                <div className="bg-white border-2 border-red-500/80 rounded-xl p-3.5 shadow-sm hover:shadow-md transition">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 bg-red-100 text-red-800 rounded">
                          {language === 'te' ? 'బాకీల అలర్ట్' : 'PENDING DUES'}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Live
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">
                        {pendingOrders.length} {language === 'te' ? 'కస్టమర్ల నుండి రావలసిన మొత్తం:' : 'Customers with Outstanding Dues'}
                      </h4>
                      <div className="text-base font-black text-red-600 mt-0.5">
                        {formatINR(totalPendingDues)}
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {language === 'te'
                          ? 'బాకీ ఉన్న కస్టమర్లకు WhatsApp రిమైండర్ లేదా ఫోన్ కాల్ చేయండి.'
                          : 'Send payment reminder SMS/WhatsApp or call to settle balances.'}
                      </p>
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateToPendingDues();
                        }}
                        className="mt-2 text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                      >
                        <span>{language === 'te' ? 'పెండింగ్ బాకీల లిస్ట్ చూడండి' : 'Open Pending Dues List'}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>{notificationCount} {language === 'te' ? 'యాక్టివ్ నోటిఫికేషన్లు' : 'active alerts'}</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition cursor-pointer"
          >
            {language === 'te' ? 'మూసివేయండి' : 'Dismiss'}
          </button>
        </div>
      </div>
    </div>
  );
};
