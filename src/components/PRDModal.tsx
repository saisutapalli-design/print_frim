import React from 'react';
import { 
  X, 
  BookOpen, 
  Users, 
  Layers, 
  FileText, 
  CheckCircle2, 
  Printer, 
  ShieldCheck, 
  Cpu, 
  Palette,
  Maximize2,
  PhoneCall,
  IndianRupee,
  PackageCheck
} from 'lucide-react';
import { Language } from '../types';

interface PRDModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const PRDModal: React.FC<PRDModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      id="prd-specs"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end print:p-0 print:bg-white"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 print:hidden" onClick={onClose} aria-hidden="true" />

      {/* Drawer */}
      <div className="relative z-10 bg-white w-full max-w-2xl lg:max-w-3xl h-full shadow-2xl border-l border-slate-200 flex flex-col transition-all duration-300 ease-out overflow-hidden print:border-none print:shadow-none print:max-w-none print:w-full print:h-auto">
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                {language === 'te' 
                  ? 'యూజర్లు, డిజైన్ స్పెసిఫికేషన్లు & ప్రాడక్ట్ రిక్వైర్‌మెంట్స్ డాక్యుమెంట్ (PRD)' 
                  : 'Application Users, Design Specs & Product Requirements Document (PRD)'}
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'te'
                  ? 'అమలాపురం ఫ్లెక్స్ ప్రింట్ సాఫ్ట్‌వేర్ పూర్తి డిజైన్ మరియు ఫీచర్స్ వివరాలు'
                  : 'Comprehensive Architecture, Operational Roles & Full Feature Catalog'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer print:hidden"
              title="Print Documentation"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'te' ? 'ప్రింట్' : 'Print'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 text-slate-800">
          {/* Executive Overview Banner */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  {language === 'te' ? 'ప్రాజెక్ట్ సమాచారం' : 'Project Specification'} • Release v2.4 (2026 Edition)
                </span>
                <h3 className="text-xl font-black mt-1 text-white">
                  Sairam Ads Operations Suite
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  {language === 'te'
                    ? 'ఫ్లెక్స్, వినైల్ మరియు బ్యాక్‌లిట్ ప్రింటింగ్ షాపుల కోసం ప్రత్యేకంగా రూపొందించబడిన సమగ్ర పాయింట్-ఆఫ్-సేల్, బ్యాలెన్స్ షీట్, మరియు బాకీల వసూళ్ల నిర్వహణ వ్యవస్థ.'
                    : 'A purpose-built operational ERP and Point-of-Sale terminal architected specifically for high-throughput commercial signage, flex banner, and vinyl fabrication centers in Andhra Pradesh.'}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="inline-block px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-700/60 rounded-lg text-xs font-bold">
                  Status: Production Ready
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 1: TARGET USERS & PERSONAS */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <Users className="w-5 h-5 text-amber-600" />
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                1. {language === 'te' ? 'టార్గెట్ యూజర్లు & పాత్రలు (Target Users & Personas)' : 'Target Application Users & Operational Personas'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Persona 1: Shop Proprietor */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">
                    {language === 'te' ? 'షాప్ యజమాని / మేనేజర్' : 'Shop Proprietor & Managing Director'}
                  </h4>
                  <span className="text-[10px] uppercase font-black px-2 py-0.5 bg-amber-100 text-amber-900 rounded">
                    Primary Admin
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Responsibilities:</strong> Monitors daily net profitability, incoming cash vs. vendor overheads, reviews total printed square footage, audits uncollected receivables, and manages team payroll disbursements.
                </p>
                <div className="text-[11px] text-slate-500 font-medium">
                  <strong>Key Goal:</strong> Eliminate cash leakage and collect outstanding customer balances prior to festive rush seasons.
                </div>
              </div>

              {/* Persona 2: Front-Desk Cashier */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">
                    {language === 'te' ? 'కౌంటర్ క్యాషియర్ / ఆర్డర్ క్లర్క్' : 'Front-Desk Cashier & Job Intake Clerk'}
                  </h4>
                  <span className="text-[10px] uppercase font-black px-2 py-0.5 bg-blue-100 text-blue-900 rounded">
                    Front Desk
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Responsibilities:</strong> Enters walk-in client orders, specifies dimensional width and height, collects initial UPI/Cash advances, prints thermal job receipts, and records subsequent installment payments.
                </p>
                <div className="text-[11px] text-slate-500 font-medium">
                  <strong>Key Goal:</strong> Rapid job slip generation within under 30 seconds with automatic square footage calculation.
                </div>
              </div>

              {/* Persona 3: Graphic Designer */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">
                    {language === 'te' ? 'గ్రాఫిక్ డిజైనర్ (కోరెల్‌డ్రా / ఫోటోషాప్)' : 'Lead Graphic Designer (CorelDraw / Photoshop)'}
                  </h4>
                  <span className="text-[10px] uppercase font-black px-2 py-0.5 bg-purple-100 text-purple-900 rounded">
                    Pre-Press
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Responsibilities:</strong> Reviews incoming banner specifications, prepares TIFF/RIP files, coordinates layout proof approvals with customers, and transitions order workflow status from Design to Printing.
                </p>
                <div className="text-[11px] text-slate-500 font-medium">
                  <strong>Key Goal:</strong> Track individual monthly design volume and avoid dimensional mismatches between customer orders and RIP software.
                </div>
              </div>

              {/* Persona 4: Machine Operator */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">
                    {language === 'te' ? 'సాల్వెంట్ ప్రింటర్ మెషిన్ ఆపరేటర్' : 'Solvent & Eco-Solvent Machine Operator'}
                  </h4>
                  <span className="text-[10px] uppercase font-black px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded">
                    Production Floor
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Responsibilities:</strong> Operates 10-foot and 12-foot Konica 512i / Star solvent printers, monitors raw flex roll media and solvent ink levels, reports consumption, and marks completed print runs.
                </p>
                <div className="text-[11px] text-slate-500 font-medium">
                  <strong>Key Goal:</strong> Ensure minimal head clogging, track roll inventory levels, and prevent running out of solvent ink during active jobs.
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: DESIGN SPECIFICATIONS & ERGONOMIC ARCHITECTURE */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <Layers className="w-5 h-5 text-amber-600" />
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                2. {language === 'te' ? 'డిజైన్ స్పెసిఫికేషన్లు & ఆర్కిటెక్చర్ (Design Specifications)' : 'Design Specifications & UI Architecture'}
              </h3>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Maximize2 className="w-4 h-4 text-indigo-600" />
                  <span>Fluid 100% Layout with 32px Lateral Margins</span>
                </div>
                <p>
                  To maximize workspace utilization across modern ultra-wide monitors, 15-inch laptops, and 10-inch shop floor tablets, the application enforces a <strong>fluid percentage-based layout</strong> (no restrictive fixed-pixel center containers). On desktop and laptop screens (above tablet breakpoint `lg:`), the application maintains an exact <strong>32 pixels of left and right padding (`lg:px-[32px]`)</strong> across all views, ensuring high density and optical alignment.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Cpu className="w-4 h-4 text-emerald-600" />
                  <span>Fixed Anchor Boundaries with Independent Viewport Scrolling</span>
                </div>
                <p>
                  The top navigation header (brand, status indicators, quick actions, language toggle) and bottom operational footer (legal disclaimers, compliance acts, and PRD anchor) remain <strong>permanently fixed</strong> to the viewport bounds. Only the interior business content viewport scrolls, preventing disorienting full-page jumps and providing constant access to global actions.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Palette className="w-4 h-4 text-amber-600" />
                  <span>Right-Side Popover Drawers & Shop Floor Visual Contrast</span>
                </div>
                <p>
                  Modal interactions (New Order, Record Payment, Job Slip Receipt, Add Expense, Restock Media, Add Staff, and Documentation) are built as <strong>ergonomic right-side sliding popover drawers</strong>. This maintains user context, allows visual cross-referencing with underlying table data, and prevents occlusion common to traditional centered modal dialogs. High-contrast slate and amber color palettes ensure legibility in brightly illuminated solvent printer bays.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  <span>Localized Bilingual Typography (English & Telugu)</span>
                </div>
                <p>
                  Built with immediate toggleable localization supporting authentic coastal Andhra printing vernacular: <em>'చదరపు అడుగులు' (Square Feet)</em>, <em>'బకాయిలు' (Receivables)</em>, <em>'ముడిసరుకు' (Inventory)</em>, and <em>'జాబ్ స్లిప్' (Job Slip)</em>, making the interface readily adopted by both non-English machine helpers and technical designers.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 3: PRODUCT REQUIREMENTS DOCUMENT (PRD) & FEATURE CATALOG */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <FileText className="w-5 h-5 text-amber-600" />
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                3. {language === 'te' ? 'ప్రాడక్ట్ ఫీచర్ల వివరాలు (PRD Feature Catalog)' : 'Product Requirements Document: Core Functional Modules'}
              </h3>
            </div>

            <div className="space-y-3">
              {/* Feature 1 */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-1.5 hover:border-slate-300 transition">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-bold">1</span>
                    Order Booking & Dimensional Auto-Calculation Engine
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                    Core POS
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Provides instantaneous area calculation upon entering dimensions: <code>Width (ft) × Height (ft) = Total Sq.Ft</code>. Multiplies by category standard rates (Normal Flex ₹10/sqft, Star Flex ₹18/sqft, Vinyl ₹25/sqft, Backlit ₹40/sqft). Handles quantity scaling, framing overheads, automatically computes pending balance = <code>Total Cost - Paid Advance</code>, and marks payment status (Paid, Partial, Unpaid).
                </p>
              </div>

              {/* Feature 2 */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-1.5 hover:border-slate-300 transition">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-bold">2</span>
                    Operations Balance Sheet & Profitability Analytics
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                    Financial Ledger
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Real-time double-entry summary comparing gross billed sales, actual cash/UPI collected, pending customer dues, and categorized business overheads (Rent, Power, Wages, Raw Materials, Machine Maintenance). Features dynamic period filtering (Today, This Week, This Month, All Time) with computed Net Operating Profit and material volume distributions.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-1.5 hover:border-slate-300 transition">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-bold">3</span>
                    Accounts Receivable Recovery & WhatsApp Calling Sheet
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-100 text-rose-800 rounded">
                    Cash Flow Protection
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Prioritizes debtors sorted in descending order of outstanding balance. Includes high-debt filters (&gt; ₹1,000), 1-click telephone dialer integration, 1-click WhatsApp reminder with pre-composed respectful Telugu or English billing notifications, and clipboard message copying.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-1.5 hover:border-slate-300 transition">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-bold">4</span>
                    Expense Ledger & Raw Consumables Inventory Tracker
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
                    Overhead & Stock
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Maintains a transparent chronological log of all store expenditures with vendor names, payment modes, and deletion controls. Integrates real-time tracking for rolls (Normal Flex, Star Flex, Vinyl, Backlit) and solvent inks (Cyan, Magenta, Yellow, Black) with automatic low-stock safety threshold badges and quick restock drawers.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-1.5 hover:border-slate-300 transition">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-bold">5</span>
                    Team Productivity, Output Volume & Payroll Hub
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded">
                    Human Resources
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Monitors individual operator and designer output across both daily and monthly square footage, tallying active jobs alongside monthly salaries and daily wages. Supports registering new team members and direct phone/WhatsApp staff communication.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-1.5 hover:border-slate-300 transition">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-bold">6</span>
                    Receipt Generation, Browser Printing & CSV Data Export
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-800 rounded">
                    Interoperability
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Generates clean 80mm thermal receipts and standard invoice slips with QR placeholder, job specs, and balance breakdown. Offers 1-click CSV download for both Orders and Expenses for seamless import into Tally, Excel, or local accounting packages.
                </p>
              </div>
            </div>
          </section>

          {/* Verification Footnote */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
            Document Version: PRD-2026-v2.4 • Maintained by Chief Systems Administrator (Sai Suthapalli) • Konaseema Print Operations Architecture
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
          >
            {language === 'te' ? 'మూసివేయండి' : 'Close Document'}
          </button>
        </div>
      </div>
    </div>
  );
};
