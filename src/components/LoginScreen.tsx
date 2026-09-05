import React, { useState, useEffect } from 'react';
import { Printer, Phone, KeyRound, ArrowRight, ShieldCheck, CheckCircle2, RefreshCw, User, Sparkles } from 'lucide-react';
import { Language, UserProfile } from '../types';

interface LoginScreenProps {
  onLogin: (user: UserProfile) => void;
  language: Language;
  logoName: string;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  language,
  logoName,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('9848012345');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // User profile inputs
  const [firstName, setFirstName] = useState('Sai');
  const [lastName, setLastName] = useState('Ram');
  const [role, setRole] = useState<UserProfile['role']>('Owner');

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: any;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    if (cleanNumber.length !== 10) {
      setError(language === 'te' ? 'దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి' : 'Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setIsSendingOtp(true);
    setTimeout(() => {
      setIsSendingOtp(false);
      setStep('otp');
      setCountdown(30);
      setOtp('779900'); // pre-fill demo OTP for user convenience
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim().length !== 6) {
      setError(language === 'te' ? 'దయచేసి 6 అంకెల OTP నమోదు చేయండి' : 'Please enter the 6-digit OTP code');
      return;
    }
    setError('');
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      const user: UserProfile = {
        firstName: firstName.trim() || 'Sai',
        lastName: lastName.trim() || 'Ram',
        phoneNumber: phoneNumber.trim(),
        role: role || 'Owner',
      };
      onLogin(user);
    }, 500);
  };

  const handleResendOtp = () => {
    if (countdown > 0) return;
    setCountdown(30);
    setError('');
    setOtp('779900');
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden font-sans text-slate-100">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md bg-slate-800/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-slate-950/60">
        {/* Brand identity */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/25 mb-3">
            <Printer className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {logoName || 'Sairam Ads'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {language === 'te' 
              ? 'ఫ్లెక్స్ ప్రింటింగ్ & సైన్‌బోర్డ్ మేనేజ్‌మెంట్ లెడ్జర్' 
              : 'Flex Printing & Signboard Management Ledger'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs font-medium flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Phone Number */}
        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                {language === 'te' ? 'మొబైల్ ఫోన్ నంబర్' : 'Mobile Phone Number'}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-slate-400 border-r border-slate-600 pr-2">
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-slate-300">+91</span>
                </div>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="98480 12345"
                  className="w-full pl-20 pr-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-white font-mono text-base tracking-wider focus:outline-hidden focus:border-amber-500 transition"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {language === 'te' ? 'లాగిన్ కావడానికి 10 అంకెల ఫోన్ నంబర్ ఇవ్వండి' : 'Enter 10-digit number to receive verification OTP'}
              </p>
            </div>

            {/* Role / Name Preview */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  {language === 'te' ? 'మొదటి పేరు' : 'First Name'}
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  {language === 'te' ? 'చివరి పేరు' : 'Last Name'}
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                {language === 'te' ? 'పాత్ర (Role)' : 'Role / Tag'}
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserProfile['role'])}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-medium focus:outline-hidden focus:border-amber-500 cursor-pointer"
              >
                <option value="Owner">Owner (షాప్ యజమాని)</option>
                <option value="Manager">Manager (మేనేజర్)</option>
                <option value="Admin">Admin (అడ్మినిస్ట్రేటర్)</option>
                <option value="Designer">Designer (డిజైనర్)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSendingOtp}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-slate-950 font-bold rounded-xl shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              {isSendingOtp ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{language === 'te' ? 'OTP పంపండి' : 'Send OTP Code'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Step 2: OTP Entry */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3 bg-slate-900/80 border border-slate-700/60 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">
                  {language === 'te' ? 'OTP పంపబడిన ఫోన్:' : 'OTP Sent to:'}
                </span>
                <span className="font-mono font-bold text-sm text-amber-400">+91 {phoneNumber}</span>
              </div>
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="text-xs text-slate-300 hover:text-white underline cursor-pointer"
              >
                {language === 'te' ? 'మార్చండి' : 'Change'}
              </button>
            </div>

            {/* Demo Helper Banner */}
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs text-amber-300">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Demo OTP: <strong>779900</strong></span>
              </div>
              <button
                type="button"
                onClick={() => setOtp('779900')}
                className="px-2 py-0.5 bg-amber-500 text-slate-950 rounded text-[11px] font-bold cursor-pointer hover:bg-amber-400"
              >
                Auto-fill
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                {language === 'te' ? '6 అంకెల OTP కోడ్' : '6-Digit Verification Code'}
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="779900"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-white font-mono text-center tracking-[0.35em] text-lg font-bold focus:outline-hidden focus:border-amber-500 transition"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                {countdown > 0 
                  ? (language === 'te' ? `మళ్లీ పంపడానికి: ${countdown}s` : `Resend code in: ${countdown}s`) 
                  : (language === 'te' ? 'OTP రాలేదా?' : "Didn't receive OTP?")}
              </span>
              {countdown === 0 && (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
                >
                  {language === 'te' ? 'OTP మళ్లీ పంపండి' : 'Resend OTP'}
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              {isVerifying ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{language === 'te' ? 'ధృవీకరించి ప్రవేశించండి' : 'Verify & Sign In'}</span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{language === 'te' ? 'సురక్షితమైన OTP లాగిన్ సిస్టమ్' : 'Secure Single-Device OTP Session'}</span>
        </div>
      </div>
    </div>
  );
};
