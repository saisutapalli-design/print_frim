import React, { useState } from 'react';
import { 
  X, 
  User, 
  Settings, 
  LogOut, 
  Palette, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  Phone, 
  Tag, 
  Edit3, 
  Save,
  Printer,
  ChevronDown
} from 'lucide-react';
import { Language, UserProfile, AppTheme } from '../types';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  logoName: string;
  onUpdateLogoName: (newName: string) => void;
  currentTheme: AppTheme;
  onUpdateTheme: (theme: AppTheme) => void;
  onLogout: () => void;
  language: Language;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  logoName,
  onUpdateLogoName,
  currentTheme,
  onUpdateTheme,
  onLogout,
  language,
}) => {
  if (!isOpen) return null;

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [role, setRole] = useState<UserProfile['role']>(user.role);

  const [editingLogoName, setEditingLogoName] = useState(logoName);
  const [logoSavedSuccess, setLogoSavedSuccess] = useState(false);
  const [profileSavedSuccess, setProfileSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      firstName: firstName.trim() || 'Sai',
      lastName: lastName.trim() || 'Ram',
      phoneNumber: phoneNumber.trim(),
      role,
    });
    setProfileSavedSuccess(true);
    setTimeout(() => setProfileSavedSuccess(false), 2000);
  };

  const handleSaveLogo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLogoName.trim()) return;
    onUpdateLogoName(editingLogoName.trim());
    setLogoSavedSuccess(true);
    setTimeout(() => setLogoSavedSuccess(false), 2000);
  };

  const themes: { id: AppTheme; name: string; color: string; bg: string }[] = [
    { id: 'amber', name: 'Sairam Amber (Default)', color: 'bg-amber-500', bg: 'border-amber-500' },
    { id: 'blue', name: 'Royal Cobalt', color: 'bg-blue-600', bg: 'border-blue-600' },
    { id: 'emerald', name: 'Emerald Ledger', color: 'bg-emerald-600', bg: 'border-emerald-600' },
    { id: 'slate', name: 'Graphite Modern', color: 'bg-slate-800', bg: 'border-slate-800' },
  ];

  return (
    <div 
      id="profile-settings-modal"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end"
    >
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Drawer */}
      <div className="relative z-10 bg-white w-full max-w-lg h-full shadow-2xl border-l border-slate-200 flex flex-col transition-all duration-300 ease-out overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm shadow-md">
              {user.firstName[0]?.toUpperCase() || 'S'}{user.lastName[0]?.toUpperCase() || 'R'}
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>{user.firstName} {user.lastName}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                  {user.role}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                +91 {user.phoneNumber} • {language === 'te' ? 'యూజర్ ప్రొఫైల్ & సెట్టింగ్స్' : 'User Profile & Settings'}
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
        <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50">
          {/* 1. Profile Details Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <User className="w-4 h-4 text-amber-500" />
                <span>{language === 'te' ? 'ప్రొఫైల్ వివరాలు' : 'Profile Details'}</span>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                {language === 'te' ? 'పాత్ర:' : 'Role:'} {role}
              </span>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    {language === 'te' ? 'మొదటి పేరు' : 'First Name'}
                  </label>
                  <input
                    id="profile-first-name-input"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    {language === 'te' ? 'చివరి పేరు' : 'Last Name'}
                  </label>
                  <input
                    id="profile-last-name-input"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  {language === 'te' ? 'ఫోన్ నంబర్' : 'Phone Number'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="profile-phone-input"
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  {language === 'te' ? 'పాత్ర (Role Tag)' : 'Role / Position Tag'}
                </label>
                <div className="relative">
                  <select
                    id="profile-role-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserProfile['role'])}
                    className="w-full appearance-none pl-3.5 pr-10 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 cursor-pointer transition"
                  >
                    <option value="Owner">Owner (షాప్ యజమాని)</option>
                    <option value="Manager">Manager (మేనేజర్)</option>
                    <option value="Admin">Admin (సిస్టమ్ అడ్మిన్)</option>
                    <option value="Designer">Designer (డిజైనర్)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between">
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{language === 'te' ? 'ప్రొఫైల్ సేవ్ చేయండి' : 'Save Profile'}</span>
                </button>
                {profileSavedSuccess && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    {language === 'te' ? 'సేవ్ చేయబడింది!' : 'Saved successfully!'}
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* 2. Logo Name Change Facility */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Printer className="w-4 h-4 text-amber-500" />
                <span>{language === 'te' ? 'యాప్ / లోగో పేరు మార్పు' : 'Shop / Logo Name Customization'}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              {language === 'te'
                ? 'మీరు ఎంచుకున్న పేరు హెడర్, ఇన్వాయిస్ రసీదులు మరియు ప్రింట్ స్లిప్పులలో కనిపిస్తుంది.'
                : 'This name appears across the top header, printable job receipts, bills, and footer.'}
            </p>

            <form onSubmit={handleSaveLogo} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  {language === 'te' ? 'అప్లికేషన్ / షాప్ పేరు' : 'Application / Brand Title'}
                </label>
                <input
                  id="profile-brand-input"
                  type="text"
                  required
                  value={editingLogoName}
                  onChange={(e) => setEditingLogoName(e.target.value)}
                  placeholder="Sairam Ads"
                  className="w-full px-3.5 py-2.5 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{language === 'te' ? 'పేరును అప్‌డేట్ చేయండి' : 'Update Logo Name'}</span>
                </button>
                {logoSavedSuccess && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    {language === 'te' ? 'పేరు మార్చబడింది!' : 'Name updated!'}
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* 3. Theme Change Facility */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
              <Palette className="w-4 h-4 text-amber-500" />
              <span>{language === 'te' ? 'రంగు థీమ్ మార్పు' : 'Color Theme Accent'}</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {themes.map((th) => {
                const isSelected = currentTheme === th.id;
                return (
                  <button
                    key={th.id}
                    onClick={() => onUpdateTheme(th.id)}
                    className={`p-3 rounded-xl border-2 flex items-center gap-2.5 text-left transition cursor-pointer ${
                      isSelected
                        ? `${th.bg} bg-slate-50 shadow-xs`
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full ${th.color} shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold text-slate-900 block truncate">
                        {th.name}
                      </span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-slate-900 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Logout Session */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-red-950">
                {language === 'te' ? 'ఖాతా నుండి లాగౌట్' : 'Sign Out of Sairam Ads'}
              </h4>
              <p className="text-xs text-red-700 mt-0.5">
                {language === 'te' ? 'మళ్లీ ప్రవేశించడానికి OTP అవసరం.' : 'Will require phone OTP to sign back in.'}
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{language === 'te' ? 'లాగౌట్' : 'Logout'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="font-medium">Sairam Ads Operations Suite</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition cursor-pointer"
          >
            {language === 'te' ? 'ముగించండి' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
