import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole, GradeNumber } from '../types';
import { X, UserCheck, GraduationCap, School, Mail, Lock, User as UserIcon, Sparkles, AlertCircle, LogIn, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultRole = 'student' }) => {
  const { signUpWithEmail, logInWithEmail, logInWithGoogle } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [grade, setGrade] = useState<GradeNumber>(8);
  const [specialization, setSpecialization] = useState('Science & Mathematics');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (isSignUp) {
        if (!displayName.trim()) {
          throw new Error('कृपया आफ्नो नाम राख्नुहोस् (Please enter your full name)');
        }
        await signUpWithEmail(email, password, displayName, role, grade, specialization);
      } else {
        await logInWithEmail(email, password);
      }
      onClose();
    } catch (err: any) {
      console.error('Auth Error:', err);
      let msg = err?.message || 'लगइन गर्दा केही त्रुटि भयो (Authentication failed)';
      if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password') || msg.includes('auth/user-not-found')) {
        msg = 'इमेल वा पासवर्ड मिलेन। कृपया पुन: प्रयास गर्नुहोस्। (Invalid email or password)';
      } else if (msg.includes('auth/email-already-in-use')) {
        msg = 'यो इमेल प्रयोग भइसकेको छ। कृपया लगइन गर्नुहोस्। (Email already registered)';
      } else if (msg.includes('auth/weak-password')) {
        msg = 'पासवर्ड कम्तिमा ६ अक्षरको हुनुपर्छ। (Password must be at least 6 characters)';
      }
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await logInWithGoogle(role, grade);
      onClose();
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      setError('गुगल लगइन सफल हुन सकेन। (Google Sign-In failed)');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden relative transition-all">
        {/* Header Header Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="बन्द गर्नुहोस्"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1 text-emerald-200 text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-amber-300" />
            नेपाल CDC डिजिटल डिजिटल सिकाइ
          </div>
          <h2 className="text-2xl font-black">
            {isSignUp ? 'नयाँ खाता बनाउनुहोस्' : 'सिक्दै-AI मा लगइन'}
          </h2>
          <p className="text-emerald-100 text-xs mt-1">
            {isSignUp
              ? 'विद्यार्थी वा शिक्षकको रूपमा दर्ता हुनुहोस्'
              : 'आफ्नो सिकाइ र सुरक्षित नोटहरू पहुँच गर्नुहोस्'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {/* Tab Switcher: Login vs Sign Up */}
          <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setError(null); }}
              className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                !isSignUp ? 'bg-white text-emerald-800 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LogIn className="w-4 h-4" />
              लगइन (Sign In)
            </button>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setError(null); }}
              className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                isSignUp ? 'bg-white text-emerald-800 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              दर्ता गर्नुहोस् (Sign Up)
            </button>
          </div>

          {/* Role Selector (Student vs Teacher) */}
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700 block">
                भूमिका छान्नुहोस् (Select Role):
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`p-3 rounded-2xl border-2 transition-all text-left flex flex-col gap-1 ${
                    role === 'student'
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <GraduationCap className={`w-5 h-5 ${role === 'student' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    {role === 'student' && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
                  </div>
                  <span className="text-xs font-extrabold">विद्यार्थी (Student)</span>
                  <span className="text-[10px] opacity-80">कक्षा १ - १० पढ्ने</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`p-3 rounded-2xl border-2 transition-all text-left flex flex-col gap-1 ${
                    role === 'teacher'
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <School className={`w-5 h-5 ${role === 'teacher' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    {role === 'teacher' && <span className="w-2 h-2 rounded-full bg-indigo-600"></span>}
                  </div>
                  <span className="text-xs font-extrabold">शिक्षक (Teacher)</span>
                  <span className="text-[10px] opacity-80">सामग्री र नोट पोस्ट गर्ने</span>
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isSignUp && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">पुरा नाम (Full Name)</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="उदा: राम शर्मा / Sita Adhikari"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            {isSignUp && role === 'student' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">कक्षा (Grade):</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value) as GradeNumber)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-bold text-slate-800 bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((g) => (
                    <option key={g} value={g}>
                      कक्षा {g} (Class {g})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {isSignUp && role === 'teacher' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">मुख्य विषय (Specialization Subject):</label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="उदा: Science, Mathematics, English"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">इमेल ठेगाना (Email)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">पासवर्ड (Password)</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-2.5 rounded-xl text-xs font-extrabold text-white shadow-md transition-all flex items-center justify-center gap-2 ${
                role === 'teacher' && isSignUp
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              } disabled:opacity-50`}
            >
              {submitting ? (
                <span>प्रक्रिया हुँदैछ...</span>
              ) : (
                <>
                  <span>{isSignUp ? 'दर्ता हुनुहोस् (Create Account)' : 'लगइन गर्नुहोस् (Sign In)'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-[11px]">
              <span className="bg-white px-2 text-slate-400">वा (Or)</span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={submitting}
            className="w-full py-2.5 border border-slate-300 hover:border-slate-400 bg-white text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-2xs hover:bg-slate-50 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google बाट जारी राख्नुहोस्</span>
          </button>
        </div>
      </div>
    </div>
  );
};
