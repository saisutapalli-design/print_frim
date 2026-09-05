import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Scale, 
  AlertTriangle, 
  FileCheck, 
  Building2, 
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Language } from '../types';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'disclaimer' | 'license' | 'privacy';
  language: Language;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  type,
  language,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end print:p-0 print:bg-white">
      {/* Backdrop */}
      <div className="fixed inset-0 print:hidden" onClick={onClose} aria-hidden="true" />

      {/* Drawer */}
      <div className="relative z-10 bg-white w-full max-w-lg lg:max-w-xl h-full shadow-2xl border-l border-slate-200 flex flex-col transition-all duration-300 ease-out overflow-hidden print:border-none print:shadow-none print:max-w-none print:w-full print:h-auto">
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              {type === 'disclaimer' && <AlertTriangle className="w-4 h-4" />}
              {type === 'license' && <Scale className="w-4 h-4" />}
              {type === 'privacy' && <ShieldCheck className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                {type === 'disclaimer' && (language === 'te' ? 'చట్టపరమైన హెచ్చరిక & నిరాకరణ (Disclaimer)' : 'Statutory & Operational Disclaimer')}
                {type === 'license' && (language === 'te' ? 'లైసెన్స్ & ఆపరేటర్ ఒప్పందం (License & Agreement)' : 'Software License & Operator Agreement')}
                {type === 'privacy' && (language === 'te' ? 'గోప్యతా విధానం & చట్టాలు (Privacy Policy & Acts)' : 'Data Privacy Policy & Statutory Compliance')}
              </h3>
              <p className="text-[11px] text-slate-400">
                Sairam Ads Operations Suite • Legal & Compliance
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-slate-700 leading-relaxed">
          {/* DISCLAIMER CONTENT */}
          {type === 'disclaimer' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Operations & Financial Estimation Notice</span>
                </div>
                <p className="text-amber-800 text-xs">
                  {language === 'te'
                    ? 'ఈ సాఫ్ట్‌వేర్ లెక్కలు, కొలతలు మరియు ఖర్చుల నివేదికలు ప్రింటింగ్ షాప్ రోజువారీ పర్యవేక్షణ కొరకు మాత్రమే. ఇది చార్టర్డ్ అకౌంటెంట్ ఆడిట్ నివేదికకు ప్రత్యామ్నాయం కాదు.'
                    : 'The square footage formulas, material rate projections, GST estimations, and profit calculations rendered within this terminal are engineered for internal production scheduling and point-of-sale shop floor accounting.'}
                </p>
              </div>

              <div className="space-y-2.5">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  1. Dimensional Tolerances & Production Scrap
                </h4>
                <p>
                  Actual flex banner finished dimensions may vary within ±0.5 inches due to heat stretching during high-speed solvent print passes and border hems/eyelet margins. Square footage billing is computed based on gross cut size.
                </p>

                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  2. Financial Dues & Cash Reconciliations
                </h4>
                <p>
                  Recorded customer balances, UPI transactions, and outstanding payments reflect self-reported shop counter submissions. Shop proprietors are advised to conduct periodic bank account reconciliations with payment gateway statements.
                </p>

                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  3. Limitation of Liability
                </h4>
                <p>
                  Under no circumstances shall the software authors or developers be held liable for commercial trade losses, print substrate ink misprints, power fluctuations affecting print heads, or delayed deliveries resulting from third-party hardware failures.
                </p>
              </div>
            </div>
          )}

          {/* LICENSE AND AGREEMENT CONTENT */}
          {type === 'license' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                  <Scale className="w-4 h-4 text-blue-600" />
                  <span>Commercial Proprietary License (Single-Shop Terminal)</span>
                </div>
                <p className="text-blue-800 text-xs">
                  Licensed exclusively for Sairam Ads, Andhra Pradesh.
                </p>
              </div>

              <div className="space-y-2.5">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  1. Grant of License
                </h4>
                <p>
                  This End User License Agreement ("EULA") grants the operating entity non-exclusive, non-transferable authority to utilize the application across shop counter PCs, design workstations, and manager mobile devices for commercial flex, vinyl, and signage operations.
                </p>

                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  2. Operator Responsibility & Record Authenticity
                </h4>
                <p>
                  Operators (Designers, Cashiers, Machine Leads) agree to enter genuine customer contact numbers and accurate payment collections. Counter receipts issued to customers constitute legally binding commercial acknowledgments of advance receipts under commercial trade conventions.
                </p>

                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  3. IP Rights & Customization
                </h4>
                <p>
                  All graphic layout assets, UI component configurations, database structures, and bilingual translation dictionaries remain the proprietary intellectual property of the engineering developers and Sairam Ads.
                </p>
              </div>
            </div>
          )}

          {/* PRIVACY POLICY & ACTS CONTENT */}
          {type === 'privacy' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Statutory Acts Compliance & Data Integrity</span>
                </div>
                <p className="text-emerald-800 text-xs">
                  {language === 'te'
                    ? 'కస్టమర్ల సమాచారం, ఫోన్ నంబర్లు, మరియు పేమెంట్ వివరాలు భారత ప్రభుత్వ చట్టాల ప్రకారం అత్యంత భద్రంగా భద్రపరచబడతాయి.'
                    : 'Governed by the statutory provisions of the Digital Personal Data Protection Act (DPDPA), 2023, Information Technology Act, 2000, and local commercial shop regulations.'}
                </p>
              </div>

              <div className="space-y-3">
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Digital Personal Data Protection Act (DPDPA), 2023
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    Customer data collected (name, mobile number, order specifications, and billing amounts) is collected under legitimate purpose principles for job delivery, order status communication, and accounts receivable follow-up. No customer information is ever profiled, shared, or commoditized to third-party ad networks.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-600" />
                    Information Technology Act, 2000 (Section 43A & Reasonable Security Practices)
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    The platform implements strict client-side encryption and sandboxed browser sessions. Access to customer contact lists and WhatsApp reminder mechanisms is restricted to authorized shop operators.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-purple-600" />
                    Andhra Pradesh Shops and Establishments Act, 1988
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    Maintains transparent employment rosters, employee wage records (daily and monthly), and operational hour tracking compliant with the statutory mandates of the Department of Labour, Government of Andhra Pradesh.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-500 text-center">
            Last Reviewed & Approved: September 4, 2026 by Sai Suthapalli (Chief System Admin)
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
          >
            {language === 'te' ? 'సరే' : 'I Understand'}
          </button>
        </div>
      </div>
    </div>
  );
};
