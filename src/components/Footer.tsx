import React from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Scale, 
  AlertTriangle, 
  Info, 
  ExternalLink,
  BookOpen,
  CheckCircle2,
  Clock,
  UserCheck
} from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  language: Language;
  onOpenPRD: () => void;
  onOpenLegal: (type: 'disclaimer' | 'license' | 'privacy') => void;
  logoName?: string;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onOpenPRD,
  onOpenLegal,
  logoName = 'Sairam Ads',
}) => {
  const currentYear = 2026;

  return (
    <footer 
      id="app-footer"
      className="bg-slate-900 border-t border-slate-800 text-slate-400 select-none print:hidden w-full transition-all duration-200 mt-8"
    >
      {/* Upper fluid bar */}
      <div className="w-full px-4 sm:px-6 lg:px-[32px] py-2.5 sm:py-3 border-b border-slate-800/80">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 text-xs">
          
          {/* Left: ONE Anchor Link covering Users, Design Specs & PRD */}
          <div className="flex items-center gap-2 flex-wrap justify-center lg:justify-start">
            <a
              href="#prd-specs"
              id="footer-prd-specs-anchor"
              onClick={(e) => {
                e.preventDefault();
                onOpenPRD();
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs shadow-md shadow-amber-500/10 transition cursor-pointer"
              title="Open Users, Design Specs & Product Requirements Document (PRD)"
            >
              <BookOpen className="w-4 h-4 text-slate-950" />
              <span>
                {language === 'te' 
                  ? 'యూజర్లు, డిజైన్ స్పెసిఫికేషన్లు & PRD' 
                  : 'Users, Design Specs & PRD'}
              </span>
              <span className="text-[10px] font-bold bg-slate-900 text-amber-300 px-1.5 py-0.5 rounded-full uppercase ml-0.5">
                Doc
              </span>
            </a>

            <span className="hidden sm:inline-block text-slate-700">|</span>

            {/* Legal & Statutory Policies */}
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap text-[11px] sm:text-xs">
              <button
                type="button"
                id="footer-disclaimer-btn"
                onClick={() => onOpenLegal('disclaimer')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'te' ? 'నిరాకరణ' : 'Disclaimer'}</span>
              </button>

              <button
                type="button"
                id="footer-license-btn"
                onClick={() => onOpenLegal('license')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5 text-blue-400" />
                <span>{language === 'te' ? 'లైసెన్స్ & ఒప్పందం' : 'License & Agreement'}</span>
              </button>

              <button
                type="button"
                id="footer-privacy-btn"
                onClick={() => onOpenLegal('privacy')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'te' ? 'గోప్యతా చట్టాలు' : 'Privacy Policy & Acts (DPDPA/IT)'}</span>
              </button>
            </div>
          </div>

          {/* Right: Last updated & Updater attribution */}
          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-400 text-center lg:text-right shrink-0">
            <span className="flex items-center gap-1 text-slate-300 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{language === 'te' ? 'చివరిగా నవీకరించబడింది:' : 'Last Updated:'} <strong>September 4, 2026</strong></span>
            </span>
            <span className="text-slate-700">•</span>
            <span className="flex items-center gap-1 text-slate-300 font-medium">
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'te' ? 'నవీకరించినవారు:' : 'Updated by:'} <strong className="text-amber-300">Sai Suthapalli</strong> (Chief System Admin)</span>
            </span>
          </div>

        </div>
      </div>

      {/* Lower fluid bar: Copyright, Designed by & Micro Disclaimer */}
      <div className="w-full px-4 sm:px-6 lg:px-[32px] py-2 bg-slate-950/80 text-[11px] text-slate-400 flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
        <div>
          <span>© {currentYear} <strong>{logoName}</strong>. All rights reserved.</span>
          <span className="hidden sm:inline-block mx-2 text-slate-700">|</span>
          <span className="text-slate-400">
            {language === 'te'
              ? `డిజైన్ చేసినవారు: డీప్‌మైండ్ / యాంటీగ్రావిటీ డిజైన్ ల్యాబ్ • ${logoName}`
              : `Designed by DeepMind / Antigravity Design Lab for ${logoName} Enterprises`}
          </span>
        </div>

        <div className="text-slate-400 text-[10px] sm:text-[11px] max-w-xl truncate">
          <span>
            {language === 'te'
              ? 'గమనిక: ఈ అప్లికేషన్ ప్రింటింగ్ షాప్ లెడ్జర్ కొరకు మాత్రమే. చార్టర్డ్ అకౌంటెంట్ ఆడిట్‌కు ప్రత్యామ్నాయం కాదు.'
              : 'Disclaimer: Operational estimates & calculations are for shop ledger purposes under the AP Shops and Establishments Act & DPDPA 2023.'}
          </span>
        </div>
      </div>
    </footer>
  );
};
