import React, { useState } from 'react';
import { GraduationCap, Bookmark, Sparkles, HelpCircle, FileText, Award, Users, Briefcase, CreditCard, Presentation, LogIn, LogOut, UserCheck, School, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';


export type NavTab = 'tutor' | 'see_prep' | 'teacher' | 'teacher_portal' | 'parent' | 'quiz' | 'pricing' | 'pitch' | 'cheatsheet' | 'history';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, savedCount }) => {
  const { currentUser, userProfile, logOut } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const isTeacher = userProfile?.role === 'teacher';

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2">
            {/* Logo & Nepal CDC Tag */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setActiveTab('tutor')}
                className="flex items-center gap-2.5 text-left focus:outline-hidden group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xl tracking-tight text-slate-900 font-sans">
                      Sikd<span className="text-emerald-600">AI</span>
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      सिक्दै-AI
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5 hidden sm:block">
                    नेपाल CDC भर्चुअल ट्युटर (कक्षा १ - १०)
                  </p>
                </div>
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 text-xs sm:text-sm font-semibold">
              <button
                onClick={() => setActiveTab('tutor')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg shrink-0 transition-all ${
                  activeTab === 'tutor'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>प्रश्नोत्तर</span>
              </button>

              {isTeacher ? (
                <button
                  onClick={() => setActiveTab('teacher_portal')}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg shrink-0 transition-all ${
                    activeTab === 'teacher_portal'
                      ? 'bg-indigo-600 text-white shadow-xs font-bold'
                      : 'bg-indigo-50 text-indigo-900 hover:bg-indigo-100 font-bold'
                  }`}
                >
                  <School className="w-4 h-4 text-indigo-600" />
                  <span>शिक्षक पोर्टल</span>
                </button>
              ) : null}

              <button
                onClick={() => setActiveTab('see_prep')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg shrink-0 transition-all ${
                  activeTab === 'see_prep'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Award className="w-4 h-4 text-amber-500" />
                <span>SEE तयारी</span>
              </button>

              <button
                onClick={() => setActiveTab('teacher')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg shrink-0 transition-all ${
                  activeTab === 'teacher'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Briefcase className="w-4 h-4 text-teal-600" />
                <span className="hidden md:inline">शिक्षक सहायक</span>
                <span className="md:hidden">शिक्षक</span>
              </button>

              <button
                onClick={() => setActiveTab('parent')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg shrink-0 transition-all ${
                  activeTab === 'parent'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Users className="w-4 h-4 text-blue-600" />
                <span>अभिभावक</span>
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg shrink-0 transition-all ${
                  activeTab === 'quiz'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                <span>क्विज</span>
              </button>

              <button
                onClick={() => setActiveTab('cheatsheet')}
                className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg shrink-0 transition-all ${
                  activeTab === 'cheatsheet'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>सूत्र</span>
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg shrink-0 transition-all relative ${
                  activeTab === 'history'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>नोट</span>
                {savedCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-xs font-bold bg-amber-400 text-slate-900">
                    {savedCount}
                  </span>
                )}
              </button>
            </div>

            {/* Auth Button / Profile Menu */}
            <div className="relative shrink-0">
              {currentUser && userProfile ? (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-2xl transition-all text-xs font-bold text-slate-800"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-extrabold text-[11px]">
                      {userProfile.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="hidden sm:inline max-w-[100px] truncate">
                      {userProfile.displayName}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                      userProfile.role === 'teacher' ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {userProfile.role === 'teacher' ? 'शिक्षक' : `कक्षा ${userProfile.grade || ''}`}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn text-xs space-y-1">
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="font-extrabold text-slate-900">{userProfile.displayName}</p>
                        <p className="text-slate-500 text-[11px] truncate">{userProfile.email}</p>
                        <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                          {userProfile.role === 'teacher' ? '👨‍🏫 शिक्षक' : `👨‍🎓 विद्यार्थी (Class ${userProfile.grade})`}
                        </div>
                      </div>

                      {userProfile.role === 'teacher' && (
                        <button
                          onClick={() => { setActiveTab('teacher_portal'); setShowProfileMenu(false); }}
                          className="w-full text-left px-3 py-2 hover:bg-indigo-50 text-indigo-900 font-bold flex items-center gap-2"
                        >
                          <School className="w-4 h-4 text-indigo-600" />
                          <span>शिक्षक पोर्टल (Teacher Portal)</span>
                        </button>
                      )}

                      <button
                        onClick={() => { logOut(); setShowProfileMenu(false); }}
                        className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-700 font-bold flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4 text-rose-600" />
                        <span>बाहिर निस्कनुहोस् (Sign Out)</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs rounded-2xl shadow-sm transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span>लगइन / दर्ता</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

