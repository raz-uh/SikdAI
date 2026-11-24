import React, { useState } from 'react';
import { CreditCard, Check, Sparkles, Building2, ShieldCheck, Heart, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

export const PricingModal: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedPlan, setSelectedPlan] = useState<'b2c' | 'b2b' | 'b2g'>('b2c');
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'esewa' | 'khalti' | 'connectips'>('esewa');

  const handleSubscribe = () => {
    setShowPaymentSuccess(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-xs font-bold text-emerald-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>SikdAI सदस्यता योजना र शुल्क (Pricing Plans)</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          नेपालभरका विद्यार्थी र विद्यालयका लागि सुलभ सदस्यता
        </h2>

        <p className="text-sm text-slate-300 font-normal leading-relaxed max-w-xl mx-auto">
          निःशुल्क ट्युटर अभ्यासका साथै असीमित प्रश्नोत्तर, AI निबन्ध जाँच र शिक्षक सामाग्रीका लागि प्रिमियम योजना लिनुहोस्।
        </p>

        {/* Toggle Billing */}
        <div className="pt-2 flex items-center justify-center gap-3">
          <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
            मासिक (Monthly)
          </span>

          <button
            type="button"
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="w-14 h-7 bg-emerald-600 rounded-full p-1 relative transition-colors focus:outline-hidden"
          >
            <div
              className={`w-5 h-5 bg-white rounded-full transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'
              }`}
            ></div>
          </button>

          <span className={`text-xs font-bold flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-400'}`}>
            वार्षिक (Yearly)
            <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full">
              ३०% छुट
            </span>
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* B2C Subscription */}
        <div className="bg-white rounded-3xl border-2 border-emerald-500 shadow-xl p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
            लोकप्रिय (Popular)
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">व्यक्तिगत / विद्यार्थी</span>
              <h3 className="text-xl font-extrabold text-slate-900">B2C व्यक्तिगत प्लान</h3>
              <p className="text-xs text-slate-500">अभिभावक र विद्यार्थीहरूका लागि</p>
            </div>

            <div className="pt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">
                  NPR {billingCycle === 'yearly' ? '२,४९९' : '२९९'}
                </span>
                <span className="text-xs text-slate-500 font-bold">
                  / {billingCycle === 'yearly' ? 'वर्ष' : 'महिना'}
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                {billingCycle === 'yearly' ? 'रू. २०८/महिना मात्र पर्न आउने' : 'ट्युशन शुल्कभन्दा ९५% सस्तो'}
              </p>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-700 font-medium">
              <p className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>असीमित AI ट्युटर प्रश्नोत्तर (कक्षा १ - १०)</span>
              </p>
              <p className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>SEE निबन्ध र गणित समाधान AI जाँच</span>
              </p>
              <p className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>अभिभावक ड्यासबोर्ड र हप्ताको प्रगति विवरण</span>
              </p>
              <p className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>असीमित क्विज अभ्यास र सुत्र सूची</span>
              </p>
            </div>
          </div>

          <div className="pt-6 space-y-3">
            {/* Payment options badges */}
            <div className="flex items-center justify-center gap-2">
              <span className="text-[10px] font-bold text-slate-400">भुक्तानी माध्यम:</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">eSewa</span>
              <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded">Khalti</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">ConnectIPS</span>
            </div>

            <button
              type="button"
              onClick={handleSubscribe}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>अहिले सदस्यता लिनुहोस् (Upgrade Now)</span>
            </button>
          </div>
        </div>

        {/* B2B Institutional */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">संस्थागत / विद्यालय</span>
              <h3 className="text-xl font-extrabold text-slate-900">B2B Institutional</h3>
              <p className="text-xs text-slate-500">निजी तथा संस्थागत विद्यालयहरू</p>
            </div>

            <div className="pt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">NPR १२०</span>
                <span className="text-xs text-slate-500 font-bold">/ विद्यार्थी / महिना</span>
              </div>
              <p className="text-[11px] text-teal-700 font-semibold mt-1">वार्षिक बल्क लाइसेन्स सम्झौता</p>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-700 font-medium">
              <p className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600 shrink-0" />
                <span>सबै शिक्षकका लागि Teacher Co-Pilot नि:शुल्क</span>
              </p>
              <p className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600 shrink-0" />
                <span>विद्यालय प्रशासन ड्यासबोर्ड र विश्लेषकहरू</span>
              </p>
              <p className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600 shrink-0" />
                <span>CDC प्रश्नपत्र र पाठ योजना असीमित निर्माण</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => alert('B2B संस्थागत सोधपुछका लागि info@sikdai.ai मा वा PABSON सञ्जाल मार्फत सम्पर्क गर्नुहोस्।')}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
          >
            <span>विद्यालयका लागि सम्पर्क गर्नुहोस्</span>
          </button>
        </div>

        {/* B2G Government / NGO */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">सरकारी / गाउँपालिका</span>
              <h3 className="text-xl font-extrabold text-slate-900">B2G / Development</h3>
              <p className="text-xs text-slate-500">नगरपालिका, विकास साझेदार र INGOs</p>
            </div>

            <div className="pt-2">
              <div className="text-2xl font-black text-slate-900">अनुदान तथा अनुदानित ठेक्का</div>
              <p className="text-[11px] text-indigo-700 font-semibold mt-1">७ वटै प्रदेशका दूरदराजका सामुदायिक विद्यालय</p>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-700 font-medium">
              <p className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>कम ब्यान्डविथ (Low-Bandwidth) मा मोबाइलमा चल्ने</span>
              </p>
              <p className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>स्थानीय मातृभाषा तथा CDC पाठ्यक्रम समायोजन</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => alert('नगरपालिका तथा सरकारी साझेदारिताका लागि support@sikdai.ai मा सम्पर्क गर्नुहोस्।')}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs border border-slate-300 transition-all"
          >
            <span>B2G साझेदारी प्रस्ताव</span>
          </button>
        </div>
      </div>

      {/* Payment Success Modal simulation */}
      {showPaymentSuccess && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-black text-slate-900">सदस्यता सुचारु भयो!</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              बधाई छ! तपाईंको <span className="font-bold text-emerald-700">SikdAI Pro Premium</span> सदस्यता सुचारु भएको छ। अब असीमित AI ट्युटर, SEE निबन्ध जाँच र शिक्षक को-पाइलट प्रयोग गर्नुहोस्।
            </p>

            <button
              type="button"
              onClick={() => setShowPaymentSuccess(false)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all"
            >
              <span>सिकाइ सुरु गर्नुहोस् (Start Learning)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
