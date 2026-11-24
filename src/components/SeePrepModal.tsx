import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Award, FileEdit, CheckCircle2, AlertCircle, RefreshCw, Sparkles, BookOpen, Calculator, PenTool, Check, Star } from 'lucide-react';
import { GradeNumber } from '../types';

interface SeePrepModalProps {
  grade: GradeNumber;
}

export const SeePrepModal: React.FC<SeePrepModalProps> = ({ grade }) => {
  const [activeTab, setActiveTab] = useState<'essay' | 'math' | 'model_paper'>('essay');
  
  // Essay Evaluator state
  const [essayTopic, setEssayTopic] = useState('नेपालमा जलविद्युतको सम्भावना र चुनौती (Hydroelectricity in Nepal)');
  const [essayLanguage, setEssayLanguage] = useState<'Nepali' | 'English'>('Nepali');
  const [essayContent, setEssayContent] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any | null>(null);
  const [evalError, setEvalError] = useState<string | null>(null);

  // Sample prompt template for essay
  const sampleEssays = [
    {
      title: 'नेपालमा पर्यटन उद्योगको विकास (Tourism Industry in Nepal)',
      text: `नेपाल एउटा प्राकृतिक सुन्दरताले भरिपूर्ण देश हो। यहाँ विश्वको सर्वोच्च शिखर सगरमाथा लगायत धेरै हिमशिखरहरू रहेका छन्। नेपालमा पर्यटन उद्योगको ठूलो सम्भावना छ। पोखरा, लुम्बिनी, चितवनजस्ता पर्यटकीय स्थलहरूले विदेशी र आन्तरिक पर्यटकहरूलाई आकर्षित गर्छन्। पर्यटनले वैदेशिक मुद्रा आर्जन र रोजगार सिर्जनामा मद्दत पुर्‍याउँछ। तर पूर्वाधारको कमी र प्रचारप्रसारको अभावले गर्दा सोचेजति प्रगति हुन सकेको छैन।`,
    },
    {
      title: 'वातावरण प्रदूषण र यसको नियन्त्रण (Environmental Pollution & Control)',
      text: `वातावरण प्रदूषण वर्तमान विश्वको प्रमुख समस्या हो। जल, थल र वायु प्रदूषणले मानव स्वास्थ्य र जैविक विविधतामा प्रतिकूल असर पारिरहेको छ। नेपालका सहरी क्षेत्रमा सवारी साधनको धुवाँ र फोहोरमैला मुख्य चुनौती बनेका छन्। रुख रोप्ने, प्लास्टिकको प्रयोग घटाउने र नवीकरणीय ऊर्जाको प्रयोग बढाउने उपाय अपनाउनुपर्छ।`,
    },
  ];

  const handleEvaluateEssay = async () => {
    if (!essayContent.trim()) {
      alert('कृपया पहिले निबन्ध वा उत्तरको पाठ लेख्नुहोस्।');
      return;
    }

    setIsEvaluating(true);
    setEvalError(null);
    setEvaluationResult(null);

    try {
      const res = await fetch('/api/essay-evaluator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade,
          topic: essayTopic,
          essayText: essayContent,
          language: essayLanguage,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'मूल्याङ्कन गर्न सकिएन।');
      }

      const data = await res.json();
      setEvaluationResult(data);
    } catch (err: any) {
      console.error(err);
      setEvalError(err.message || 'निबन्ध मूल्याङ्कनमा समस्या आयो।');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold text-emerald-200">
            <Award className="w-4 h-4 text-amber-300" />
            <span>SEE र टर्मिनल परीक्षा तयारी (SEE & Exam Prep)</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            SEE नमुना परीक्षा, गणित समाधान र निबन्ध जाँच (CDC Board Marking)
          </h1>

          <p className="text-sm text-emerald-100 font-normal leading-relaxed">
            नेपाल परीक्षा बोर्ड (NEB/CDC) को बोर्ड परीक्षाको अंक तालिका अनुसार निबन्धको AI जाँच र गणितका समस्या समाधान गर्नुहोस्।
          </p>
        </div>
      </div>

      {/* Sub-navigation */}
      <div className="flex border-b border-slate-200 bg-white p-1.5 rounded-2xl shadow-xs gap-1">
        <button
          onClick={() => setActiveTab('essay')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'essay'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <PenTool className="w-4 h-4" />
          <span>निबन्ध मूल्याङ्कन (Essay Evaluator)</span>
        </button>

        <button
          onClick={() => setActiveTab('math')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'math'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>SEE गणित स्टेप्स (Math Solver)</span>
        </button>

        <button
          onClick={() => setActiveTab('model_paper')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'model_paper'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>CDC ग्रिड मोडेल पेपर</span>
        </button>
      </div>

      {/* Tab 1: Essay Evaluator */}
      {activeTab === 'essay' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <FileEdit className="w-5 h-5 text-emerald-600" />
                <span>निबन्ध/उत्तर यहाँ हाल्नुहोस्</span>
              </h3>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                अंक विभाजन: १० मार्क्स
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  निबन्ध वा प्रश्नको शीर्षक (Essay Topic):
                </label>
                <input
                  type="text"
                  value={essayTopic}
                  onChange={(e) => setEssayTopic(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
                  placeholder="उदा: नेपालमा जलविद्युतको सम्भावना"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  निबन्धको भाषा (Language):
                </label>
                <div className="flex gap-3 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setEssayLanguage('Nepali')}
                    className={`px-3 py-1.5 rounded-lg border ${
                      essayLanguage === 'Nepali'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    नेपाली (Nepali)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEssayLanguage('English')}
                    className={`px-3 py-1.5 rounded-lg border ${
                      essayLanguage === 'English'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    अंग्रेजी (English)
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    आफ्नो निबन्धको परिच्छेद यहाँ लेख्नुहोस् (Paste/Type Essay):
                  </label>
                  <span className="text-[11px] text-slate-500">
                    {essayContent.length} अक्षर
                  </span>
                </div>
                <textarea
                  value={essayContent}
                  onChange={(e) => setEssayContent(e.target.value)}
                  rows={8}
                  placeholder="यहाँ आफ्नो निबन्ध लेख्नुहोस् वा तल दिइएको नमुना छानेर प्रयास गर्नुहोस्..."
                  className="w-full p-3.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 leading-relaxed font-sans"
                />
              </div>

              {/* Sample Essays selector */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-600">नमुना अभ्यास (Sample Essays):</span>
                <div className="flex flex-col gap-2">
                  {sampleEssays.map((samp, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setEssayTopic(samp.title);
                        setEssayContent(samp.text);
                      }}
                      className="text-left text-xs bg-slate-50 hover:bg-emerald-50 border border-slate-200 p-2.5 rounded-xl font-medium text-slate-700 hover:text-emerald-900 hover:border-emerald-300 transition-all"
                    >
                      💡 {samp.title}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleEvaluateEssay}
                disabled={isEvaluating || !essayContent.trim()}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isEvaluating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>CDC बोर्ड अंक तालिका अनुसार जाँच हुँदैछ...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>AI मूल्याङ्कन र अंक हेर्नुहोस् (Evaluate)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Result Panel */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>CDC बोर्ड परीक्षा नतिजा र प्रतिक्रिया</span>
            </h3>

            {evalError && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{evalError}</span>
              </div>
            )}

            {!evaluationResult && !isEvaluating && !evalError && (
              <div className="text-center py-16 space-y-3 text-slate-400">
                <PenTool className="w-12 h-12 mx-auto text-slate-300" />
                <p className="text-sm font-semibold text-slate-600">
                  बायाँतर्फ निबन्ध लेखी "AI मूल्याङ्कन" थिच्नुहोस्।
                </p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  व्याकरण, CDC तथ्य, संरचना र मौलिकताको आधारमा अंक र सुझाव प्राप्त हुनेछ।
                </p>
              </div>
            )}

            {isEvaluating && (
              <div className="text-center py-16 space-y-4 animate-pulse">
                <RefreshCw className="w-10 h-10 mx-auto text-emerald-600 animate-spin" />
                <p className="text-sm font-bold text-slate-700">
                  नेपाल CDC बोर्डको १० अंकको मापदण्ड अनुसार मूल्याङ्कन हुँदैछ...
                </p>
              </div>
            )}

            {evaluationResult && (
              <div className="space-y-4 text-xs">
                {/* Score Summary Box */}
                <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-emerald-300 font-bold text-[11px]">प्राप्त अंक (Score Awarded):</span>
                    <div className="text-3xl font-black text-amber-300">
                      {evaluationResult.totalScore} / {evaluationResult.maxScore || 10}
                    </div>
                    <span className="text-[11px] text-slate-300">ग्रेड: {evaluationResult.gradeAwarded}</span>
                  </div>

                  <div className="text-right">
                    <span className="bg-emerald-500/30 text-emerald-200 px-3 py-1 rounded-full text-xs font-bold border border-emerald-400/30">
                      CDC मेल: {evaluationResult.cdcAlignmentScore}
                    </span>
                  </div>
                </div>

                {/* Score Breakdown */}
                {evaluationResult.breakdown && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <p className="font-bold text-slate-900 text-xs">अंक विभाजन विवरण (Marks Breakdown):</p>
                    <ul className="space-y-1.5 text-slate-700 font-medium">
                      <li>• {evaluationResult.breakdown.contentAndFacts}</li>
                      <li>• {evaluationResult.breakdown.languageAndGrammar}</li>
                      <li>• {evaluationResult.breakdown.structureAndFlow}</li>
                      <li>• {evaluationResult.breakdown.creativityAndExamples}</li>
                    </ul>
                  </div>
                )}

                {/* Strengths */}
                {evaluationResult.strengths?.length > 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl space-y-1">
                    <span className="font-bold text-emerald-900 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> राम्रा पक्षहरू (Strengths):
                    </span>
                    <ul className="list-disc pl-5 text-emerald-800 font-medium space-y-0.5">
                      {evaluationResult.strengths.map((str: string, i: number) => (
                        <li key={i}>{str}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {evaluationResult.improvements?.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl space-y-1">
                    <span className="font-bold text-amber-900 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 text-amber-600" /> सुधार गर्नुपर्ने कुराहरू (Areas to Improve):
                    </span>
                    <ul className="list-disc pl-5 text-amber-800 font-medium space-y-0.5">
                      {evaluationResult.improvements.map((imp: string, i: number) => (
                        <li key={i}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Model Correction */}
                {evaluationResult.modelCorrection && (
                  <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl space-y-2">
                    <p className="font-bold text-emerald-400">💡 सुधारिएको नमुना परिच्छेद (Model Correction):</p>
                    <p className="leading-relaxed font-sans text-slate-200 whitespace-pre-line">
                      {evaluationResult.modelCorrection}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Math Steps */}
      {activeTab === 'math' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-600" />
              <span>SEE गणित मुख्य नमुना प्रश्न र समाधान (Step-by-step Math Solver)</span>
            </h3>
            <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-bold">
              CDC ग्रिड अनुसार
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-2 py-0.5 rounded">
                प्रश्न १ (४ अंक - SEE 2080)
              </span>
              <p className="font-bold text-slate-800 text-sm">
                यदि एउटा सामानको अङ्कित मूल्य रू. ४,००० मा १०% छुट दिएर १३% भ्याट जोड्दा ग्राहकले कति रकम तिर्नुपर्छ?
              </p>
              <div className="text-xs text-slate-600 space-y-1 font-mono pt-2 border-t border-slate-200">
                <p>१) छुट रकम = ४००० को १०% = ४००</p>
                <p>२) छुटपछिको मूल्य = ४००० - ४०० = ३६००</p>
                <p>३) भ्याट रकम = ३६०० को १३% = ४६८</p>
                <p className="font-bold text-emerald-700">४) जम्मा तिर्नुपर्ने मूल्य = ३६०० + ४६८ = रू. ४,०६८</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-2 py-0.5 rounded">
                प्रश्न २ (५ अंक - चक्रवर्द्धि ब्याज)
              </span>
              <p className="font-bold text-slate-800 text-sm">
                रू. ५०,००० को २ वर्षमा १०% वार्षिक चक्रवर्द्धि ब्याजदरले हुने चक्रवर्द्धि मूलधन (Compound Amount) कति हुन्छ?
              </p>
              <div className="text-xs text-slate-600 space-y-1 font-mono pt-2 border-t border-slate-200">
                <p>सूत्र: CA = P(1 + R/100)^T</p>
                <p>CA = 50000 × (1 + 10/100)^2</p>
                <p>CA = 50000 × (1.1)^2 = 50000 × 1.21</p>
                <p className="font-bold text-emerald-700">जम्मा चक्रवर्द्धि मूल्य = रू. ६०,५००</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: CDC Model Paper */}
      {activeTab === 'model_paper' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>कक्षा १० SEE अनिवार्य विषय CDC विशिष्टीकरण तालिका (Specification Grid)</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <p className="font-bold text-emerald-900 text-sm">अनिवार्य गणित (Maths)</p>
              <p className="text-emerald-800">पूर्णाङ्क: ७५ (सैद्धान्तिक) + २५ (प्रयोगात्मक)</p>
              <p className="text-emerald-700">समूह 'क', 'ख', 'ग', 'घ' गरी १६ प्रश्नहरू</p>
            </div>

            <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl space-y-1">
              <p className="font-bold text-teal-900 text-sm">विज्ञान र प्रविधि (Science)</p>
              <p className="text-teal-800">पूर्णाङ्क: ७५ (सैद्धान्तिक) + २५ (प्रयोगात्मक)</p>
              <p className="text-teal-700">भौतिक, रसायन, जीव, पृथ्वी र अन्तरिक्ष</p>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
              <p className="font-bold text-amber-900 text-sm">सामाजिक अध्ययन (Social)</p>
              <p className="text-amber-800">पूर्णाङ्क: ७५ (सैद्धान्तिक) + २५ (प्रयोगात्मक)</p>
              <p className="text-amber-700">नक्सा कार्य, समसामयिक विषय र निबन्ध</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
