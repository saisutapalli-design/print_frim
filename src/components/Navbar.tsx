import React from 'react';
import { 
  Printer, 
  LayoutDashboard, 
  ReceiptText, 
  PhoneCall, 
  ReceiptIndianRupee, 
  Users, 
  Languages, 
  MapPin,
  Clock,
  Menu,
  X,
  Bell,
  User,
  Settings,
  ChevronDown
} from 'lucide-react';
import { Language, UserProfile } from '../types';
import { translations } from '../utils/translations';

interface NavbarProps {
  activeTab: 'dashboard' | 'orders' | 'receivables' | 'expenses' | 'team';
  setActiveTab: (tab: 'dashboard' | 'orders' | 'receivables' | 'expenses' | 'team') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  onOpenNewOrder: () => void;
  pendingCount: number;
  user: UserProfile;
  logoName: string;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenProfileSettings: () => void;
}

interface NavItem {
  id: 'dashboard' | 'orders' | 'receivables' | 'expenses' | 'team';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  onOpenNewOrder,
  pendingCount,
  user,
  logoName,
  unreadCount,
  onOpenNotifications,
  onOpenProfileSettings,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const t = translations[language];

  const navItems: NavItem[] = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'orders', label: t.orders, icon: ReceiptText },
    { 
      id: 'receivables', 
      label: t.receivables, 
      icon: PhoneCall, 
      badge: pendingCount > 0 ? `${pendingCount}` : undefined,
      badgeColor: 'bg-red-600 text-white animate-pulse'
    },
    { id: 'expenses', label: t.expenses, icon: ReceiptIndianRupee },
    { id: 'team', label: t.team, icon: Users },
  ];

  const initials = `${user.firstName[0] || 'S'}${user.lastName[0] || 'R'}`.toUpperCase();

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-md border-b border-slate-800">
      {/* Top microbar */}
      <div className="bg-slate-950 w-full px-4 sm:px-6 lg:px-[32px] py-1 text-xs text-slate-400 flex flex-wrap items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-amber-400 font-medium">
            <MapPin className="w-3.5 h-3.5" />
            {logoName || 'Sairam Ads'} • Main Road, AP
          </span>
          <span className="hidden sm:inline-block text-slate-600">•</span>
          <span className="hidden sm:flex items-center gap-1 text-slate-400">
            <Clock className="w-3 h-3" />
            Shop Ops: 8:30 AM - 9:30 PM
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs transition cursor-pointer"
            title="Toggle English / Telugu"
            id="lang-toggle-btn"
          >
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold">{language === 'en' ? 'తెలుగులోకి మార్చండి' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="w-full px-4 sm:px-6 lg:px-[32px]">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-lg">
              <Printer className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950" />
            </div>
            <div>
              <span className="font-black text-base sm:text-lg lg:text-xl tracking-tight text-white block">
                {logoName || 'Sairam Ads'}
              </span>
            </div>
          </div>

          {/* Nav tabs (Responsive for Tablet & Desktop) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 mx-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 lg:px-3 lg:py-2 rounded-lg text-xs lg:text-sm font-medium transition cursor-pointer relative whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 lg:w-4 lg:h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] lg:text-[11px] px-1.5 py-0.2 rounded-full font-bold leading-none ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* 1. Bell Icon for Notifications */}
            <button
              id="header-notifications-btn"
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title={language === 'te' ? 'నోటిఫికేషన్లు' : 'Notifications'}
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* User Profile Pill with Role Tag */}
            <button
              id="header-profile-btn"
              onClick={onOpenProfileSettings}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition cursor-pointer text-left"
              title={language === 'te' ? 'యూజర్ ప్రొఫైల్ & సెట్టింగ్స్' : 'User Profile & Settings'}
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                {initials}
              </div>
              <div className="hidden sm:flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white leading-tight">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 leading-none">
                    {user.role}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 leading-tight">
                  +91 {user.phoneNumber.slice(-5)}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block ml-0.5" />
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer / menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenProfileSettings();
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-amber-400" />
                <span>{language === 'te' ? 'సెట్టింగ్స్ & ప్రొఫైల్' : 'Settings & Profile'}</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400 text-slate-950">
                {user.role}
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
