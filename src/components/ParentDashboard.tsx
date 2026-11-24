import React, { useState } from 'react';
import { Users, Clock, Target, TrendingUp, Award, CheckCircle, AlertTriangle, BookOpen, Calendar, ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';
import { GradeNumber } from '../types';

interface ParentDashboardProps {
  grade: GradeNumber;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ grade }) => {
  const [studentName, setStudentName] = useState('आरभ शर्मा (Aarav)');
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'subjects' | 'activity'>('overview');

  // Simulated parent telemetry matching pitch deck metrics
  const stats = {
    weeklyHours: '१२.५ घण्टा',
    totalQuestions: '८४ प्रश्न',
    quizAccuracy: '८८%',
    studyStreak: '६ दिन निरन्तर',
    weakSubject: 'गणित (Mathematics)',
    strongSubject: 'विज्ञान र प्रविधि (Science)',
  };

  const subjectProgress = [
    { name: 'विज्ञान र प्रविधि (Science & Tech)', progress: 92, color: 'bg-emerald-500', status: 'उत्कृष्ट (Excellent)' },
    { name: 'गणित (Mathematics)', progress: 74, color: 'bg-amber-500', status: 'थप अभ्यास आवश्यक (Needs Practice)' },
    { name: 'सामाजिक अध्ययन (Social Studies)', progress: 88, color: 'bg-teal-500', status: 'राम्रो (Good)' },
    { name: 'नेपाली (Nepali)', progress: 85, color: 'bg-indigo-500', status: 'सन्तोषजनक (Satisfactory)' },
    { name: 'अंग्रेजी (English)', progress: 90, color: 'bg-blue-500', status: 'उत्कृष्ट (Excellent)' },
  ];

  const recentActivity = [
    { date: 'आज (Today), ५:३० PM', action: 'कक्षा १० गणित - "न्युटनको गुरुत्वाकर्षण नियम" अभ्यास प्रश्न समाधान गर्यो', score: '10/10' },
    { date: 'हिजो (Yesterday), ६:१५ PM', action: 'विज्ञान - "प्रकाशको अपवर्तन" ३-प्रश्न क्विज पूरा गर्यो', score: '3/3' },
    { date: '२ दिन अघि, ७:०० PM', action: 'SEE निबन्ध - "नेपालमा जलविद्युतको सम्भावना" AI मूल्याङ्कन', score: '8.5/10' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-teal-800/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-xs font-bold text-emerald-300">
              <Users className="w-3.5 h-3.5" />
              <span>अभिभावक ड्यासबोर्ड (Parent Progress Dashboard)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {studentName} को सिकाइ प्रगति विवरण
            </h2>
            <p className="text-sm text-slate-300">
              कक्षा {grade} • नेपाल CDC पाठ्यक्रम अनुसार वास्तविक समय (Real-Time) ट्र्याकिङ
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10">
            <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-white">CDC प्रमाणित सिकाइ</p>
              <p className="text-slate-300">सुरक्षित र गुणस्तरीय शिक्षा</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">हप्ताको अध्ययन समय</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.weeklyHours}</p>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> गत हप्ताभन्दा १५% बढी
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">हल गरिएका प्रश्न</span>
            <BookOpen className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.totalQuestions}</p>
          <p className="text-[11px] text-slate-500 font-medium">सबै ५ विषय मिलाएर</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">क्विज शुद्धता (Accuracy)</span>
            <Target className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.quizAccuracy}</p>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> राम्रो नतिजा
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">स्टडी स्ट्रिक (Streak)</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600">{stats.studyStreak}</p>
          <p className="text-[11px] text-amber-700 font-medium">निरन्तर अभ्यास जारी</p>
        </div>
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject Strength Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>विषयगत प्रगति र दक्षता (Subject Mastery)</span>
            </h3>
            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-bold">
              कक्षा {grade}
            </span>
          </div>

          <div className="space-y-4">
            {subjectProgress.map((sub, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">{sub.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-medium">{sub.status}</span>
                    <span className="text-slate-900">{sub.progress}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`${sub.color} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${sub.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Parent Recommendation Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <p className="font-bold text-amber-900">अभिभावकका लागि SikdAI सुझाव (Parent Insight):</p>
              <p className="text-amber-800 leading-relaxed font-medium">
                आरभले विज्ञान र अंग्रेजीमा उत्कृष्ट प्रदर्शन गरिरहेका छन्। गणितको "त्रिकोणमिति (Trigonometry)" मा अलिकति थप अभ्यास आवश्यक देखिन्छ। आज साँझ गणितको ५ वटा अभ्यास प्रश्न गराउन उपयुक्त हुनेछ।
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Calendar className="w-5 h-5 text-teal-600" />
            <span>हालैका अभ्यास गतिविधिहरू</span>
          </h3>

          <div className="space-y-3.5">
            {recentActivity.map((act, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1 text-xs">
                <div className="flex items-center justify-between text-slate-500 font-medium">
                  <span>{act.date}</span>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">{act.score}</span>
                </div>
                <p className="font-semibold text-slate-800 leading-snug">{act.action}</p>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center">
            <p className="text-[11px] text-slate-500 font-medium flex items-center justify-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>SikdAI ले अभिभावकलाई हरेक हप्ता SMS विवरण पठाउँछ</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
