import React from 'react';
import { GRADES, SUBJECTS } from '../data/cdcData';
import { GradeNumber, SubjectOption } from '../types';
import { Atom, Calculator, Globe, BookOpen, Feather, HeartPulse, Binary, Laptop } from 'lucide-react';

interface GradeSubjectSelectorProps {
  selectedGrade: GradeNumber;
  setSelectedGrade: (grade: GradeNumber) => void;
  selectedSubject: SubjectOption;
  setSelectedSubject: (subject: SubjectOption) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Atom: <Atom className="w-5 h-5" />,
  Calculator: <Calculator className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  Feather: <Feather className="w-5 h-5" />,
  HeartPulse: <HeartPulse className="w-5 h-5" />,
  Binary: <Binary className="w-5 h-5" />,
  Laptop: <Laptop className="w-5 h-5" />,
};

export const GradeSubjectSelector: React.FC<GradeSubjectSelectorProps> = ({
  selectedGrade,
  setSelectedGrade,
  selectedSubject,
  setSelectedSubject,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-5">
      {/* Grade Selector */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">1</span>
            कक्षा छान्नुहोस् (Select Grade):
          </label>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
            {GRADES.find(g => g.grade === selectedGrade)?.levelNp}
          </span>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 sm:gap-2">
          {GRADES.map((g) => {
            const isSelected = g.grade === selectedGrade;
            return (
              <button
                key={g.grade}
                type="button"
                onClick={() => setSelectedGrade(g.grade)}
                className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-emerald-600 border-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20 scale-102 ring-2 ring-emerald-300'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <span className="text-xs opacity-80 leading-none">कक्षा</span>
                <span className="text-base font-extrabold mt-0.5 leading-tight">{g.grade}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subject Selector */}
      <div>
        <label className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">2</span>
          विषय छान्नुहोस् (Select Subject):
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {SUBJECTS.map((sub) => {
            const isSelected = sub.id === selectedSubject.id;
            const icon = ICON_MAP[sub.iconName] || <BookOpen className="w-5 h-5" />;

            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => setSelectedSubject(sub)}
                className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md ring-2 ring-slate-400'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div
                  className={`p-2 rounded-lg shrink-0 ${
                    isSelected ? 'bg-emerald-500 text-white' : sub.bgColor
                  }`}
                >
                  {icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm leading-tight truncate">{sub.nameNp}</div>
                  <div className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {sub.nameEn}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
