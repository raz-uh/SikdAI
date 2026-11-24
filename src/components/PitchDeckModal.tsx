import React, { useState } from 'react';
import { Presentation, Target, TrendingUp, DollarSign, Award, ChevronLeft, ChevronRight, CheckCircle2, PieChart, ShieldCheck, Zap } from 'lucide-react';

export const PitchDeckModal: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Sikdai AI - EdTech Seed Pitch Deck',
      subtitle: 'Democratizing quality, personalized education for 6 Million+ school students in Nepal through a CDC curriculum-aligned AI tutor.',
      badge: 'Target: Grades 1 to 10',
      type: 'hero',
      content: (
        <div className="space-y-4 text-center py-6">
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl max-w-xl mx-auto space-y-2">
            <p className="text-3xl font-black text-slate-900">६० लाख+ विद्यार्थीका लागि</p>
            <p className="text-sm font-bold text-emerald-800">नेपाल पाठ्यक्रम विकास केन्द्र (CDC) मान्यता प्राप्त भर्चुअल ट्युटर</p>
            <p className="text-xs text-slate-600">लक्षित वर्ग: कक्षा १ देखि १० का सबै विद्यार्थी र शिक्षकहरू</p>
          </div>
        </div>
      ),
    },
    {
      title: 'The Core Problem (मुख्य समस्या)',
      badge: 'समस्या',
      type: 'problem',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium py-4">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
            <span className="font-extrabold text-rose-900 text-sm block">🔴 High Tuition Burden</span>
            <p className="text-rose-800">
              Parents spend NPR 3,000 - 8,000/month on private tutors, making supplementary learning unaffordable for most families in Nepal.
            </p>
          </div>

          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
            <span className="font-extrabold text-rose-900 text-sm block">🔴 Global AI Fails Local Curriculum</span>
            <p className="text-rose-800">
              Generic LLMs hallucinate on CDC textbooks, exam patterns, and local subjects like Social Studies & Nepali.
            </p>
          </div>

          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
            <span className="font-extrabold text-rose-900 text-sm block">🔴 Overcrowded Classrooms</span>
            <p className="text-rose-800">
              40+ students per teacher prevents individual support and self-paced remediation.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'The Sikdai AI Solution (समाधान)',
      badge: 'समाधान',
      type: 'solution',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium py-4">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
            <span className="font-extrabold text-emerald-900 text-sm block">🟢 Hyper-Localized Tutor</span>
            <p className="text-emerald-800">
              Interactive multilingual AI explaining complex STEM & Humanities concepts in clear English or Nepali aligned to Grade 1-10 CDC levels.
            </p>
          </div>

          <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl space-y-2">
            <span className="font-extrabold text-teal-900 text-sm block">🟢 SEE Practice & Prep</span>
            <p className="text-teal-800">
              Instant step-by-step math problem solving, essay evaluations, and automated quizzes matching official terminal exam marking schemes.
            </p>
          </div>

          <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-2xl space-y-2">
            <span className="font-extrabold text-cyan-900 text-sm block">🟢 24/7 Accessible Access</span>
            <p className="text-cyan-800">
              Ultra-low bandwidth web experience accessible on basic family smartphones and laptops anywhere across Nepal's 7 provinces.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'CDC Curriculum Engine (Zero Hallucination)',
      badge: 'प्रविधि',
      type: 'tech',
      content: (
        <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-4">
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-emerald-400">RAG-Grounded CDC Architecture</h4>
            <p className="text-xs text-slate-300">
              Sikdai AI uses Retrieval-Augmented Generation (RAG) strictly grounded in official CDC textbooks (Grade 1 to 10 NCF directives).
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold">
            <span className="bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-center">गणित (Mathematics)</span>
            <span className="bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-center">विज्ञान (Science & Tech)</span>
            <span className="bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-center">सामाजिक (Social Studies)</span>
            <span className="bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-center">नेपाली र अंग्रेजी</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Market Opportunity (नेपाल बजार अवसर)',
      badge: 'बजार साइज',
      type: 'market',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center py-4">
          <div className="bg-slate-900 text-white p-6 rounded-3xl text-center space-y-2">
            <span className="text-5xl font-black text-emerald-400">6.7M</span>
            <p className="text-sm font-bold text-slate-200">Total K-12 School Students in Nepal</p>
          </div>

          <div className="space-y-3 text-xs font-medium">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
              <span className="font-bold text-slate-900">TAM (Total Addressable Market):</span>
              <p className="text-slate-600">6.7 Million school students across 35,000 public and institutional schools.</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
              <span className="font-bold text-slate-900">SAM (Serviceable Addressable Market):</span>
              <p className="text-slate-600">1.5 Million private & urban school students with digital device access.</p>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-0.5">
              <span className="font-bold text-emerald-900">SOM (2 Years Target):</span>
              <p className="text-emerald-800 font-bold">100,000 paid subscribers generating over NPR 30 Crore ($2.2M+) ARR.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Capital Ask & Allocation (पुँजी माग र विनियोजन)',
      badge: 'पुँजी माग',
      type: 'funding',
      content: (
        <div className="space-y-4 py-2">
          <div className="bg-emerald-900 text-white p-5 rounded-2xl text-center space-y-1">
            <span className="text-2xl font-black text-amber-300">Funding Ask: NPR 30 Lakhs ($22.5k USD)</span>
            <p className="text-xs text-emerald-200">Seed round for scaling RAG CDC infrastructure & PABSON school partnerships</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold text-slate-800">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <span className="text-lg font-black text-emerald-700">45%</span>
              <p>Engineering & RAG Infra</p>
            </div>
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl space-y-1">
              <span className="text-lg font-black text-teal-700">30%</span>
              <p>School Sales & GTM</p>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
              <span className="text-lg font-black text-amber-700">15%</span>
              <p>Curriculum Verification</p>
            </div>
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-1">
              <span className="text-lg font-black text-indigo-700">10%</span>
              <p>Operations & Compliance</p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const current = slides[currentSlide];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900">{current.title}</h3>
              <p className="text-xs text-slate-500 font-medium">{current.badge}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">
              स्लाइड {currentSlide + 1} / {slides.length}
            </span>
          </div>
        </div>

        {/* Slide Content */}
        <div className="min-h-[260px] flex items-center justify-center">
          <div className="w-full">{current.content}</div>
        </div>

        {/* Slide Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>अघिल्लो (Previous)</span>
          </button>

          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentSlide ? 'bg-emerald-600 w-6' : 'bg-slate-200 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1))}
            disabled={currentSlide === slides.length - 1}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40"
          >
            <span>पछिल्लो (Next)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
