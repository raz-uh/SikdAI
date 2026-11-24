import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Briefcase, BookOpen, FileText, Sparkles, RefreshCw, CheckCircle2, Copy, Download, Share2 } from 'lucide-react';
import { GradeNumber } from '../types';
import { SUBJECTS } from '../data/cdcData';

interface TeacherCopilotProps {
  grade: GradeNumber;
}

export const TeacherCopilot: React.FC<TeacherCopilotProps> = ({ grade }) => {
  const [docType, setDocType] = useState<'lesson_plan' | 'exam_paper'>('lesson_plan');
  const [subject, setSubject] = useState(SUBJECTS[0].nameNp);
  const [topic, setTopic] = useState('न्युटनको गुरुत्वाकर्षण नियम र गुरुत्वप्रवेग (Newton\'s Law of Gravitation)');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    setGeneratedDoc(null);

    try {
      const res = await fetch('/api/teacher-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: docType,
          grade,
          subject,
          topic,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'सामाग्री सिर्जना गर्न सकिएन।');
      }

      const data = await res.json();
      setGeneratedDoc(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'शिक्षक सामाग्री सिर्जना गर्दा समस्या आयो।');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = () => {
    if (!generatedDoc) return;
    const textToCopy = `${generatedDoc.title}\nकक्षा: ${generatedDoc.grade} | विषय: ${generatedDoc.subject}\n\n` +
      generatedDoc.sections.map((s: any) => `## ${s.heading}\n${s.content}`).join('\n\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold text-emerald-200">
            <Briefcase className="w-4 h-4 text-amber-300" />
            <span>शिक्षक को-पाइलट (Teacher Co-Pilot)</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            नेपाली शिक्षकहरूका लागि नि:शुल्क पाठ योजना र प्रश्नपत्र निर्माण औजार
          </h1>

          <p className="text-sm text-emerald-100 font-normal leading-relaxed">
            नेपाल पाठ्यक्रम विकास केन्द्र (CDC) को ढाँचामा ४५ मिनेटको पाठ योजना (Lesson Plan) वा बोर्ड परीक्षाको प्रश्नपत्र १ मिनेटमा सिर्जना गर्नुहोस्।
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Controls */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span>सामग्री चयन गर्नुहोस्</span>
          </h3>

          <div className="space-y-4 text-xs font-bold">
            <div>
              <label className="block text-slate-700 mb-1.5">के सिर्जना गर्न चाहनुहुन्छ?</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDocType('lesson_plan')}
                  className={`p-3 rounded-xl border text-center font-bold flex flex-col items-center gap-1 transition-all ${
                    docType === 'lesson_plan'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  <span>४५ मिनेट पाठ योजना (Lesson Plan)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDocType('exam_paper')}
                  className={`p-3 rounded-xl border text-center font-bold flex flex-col items-center gap-1 transition-all ${
                    docType === 'exam_paper'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  <span>CDC परीक्षा प्रश्नपत्र (Exam Paper)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 mb-1">कक्षा चयन:</label>
              <input
                type="text"
                readOnly
                value={`Class ${grade} (कक्षा ${grade})`}
                className="w-full p-2.5 bg-slate-100 rounded-xl border border-slate-200 text-slate-700 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">विषय छनोट:</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-500 font-semibold"
              >
                {SUBJECTS.map((s) => (
                  <option key={s.id} value={s.nameNp}>
                    {s.nameNp}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 mb-1">पाठ वा एकाइको शीर्षक (Topic/Unit):</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={3}
                placeholder="उदा: प्रकाशको अपवर्तन, बीजगणित, वा नेपालको भूगोल..."
                className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-500 font-normal leading-relaxed"
              />
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || !topic.trim()}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>CDC ढाँचामा सिर्जना हुँदैछ...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>शिक्षक सामग्री सिर्जना गर्नुहोस् (Generate)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Document Display */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>सिर्जना गरिएको सामग्री (Generated Document)</span>
            </h3>

            {generatedDoc && (
              <button
                type="button"
                onClick={handleCopyText}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-all"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'कपी गरियो!' : 'कपी गर्नुहोस्'}</span>
              </button>
            )}
          </div>

          {!generatedDoc && !isGenerating && (
            <div className="text-center py-20 space-y-3 text-slate-400">
              <Briefcase className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">
                बायाँतर्फ पाठ र विषय छानी "शिक्षक सामग्री सिर्जना गर्नुहोस्" थिच्नुहोस्।
              </p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                शिक्षकहरूले यो पाठ योजना वा प्रश्नपत्र सीधै प्रिन्ट वा कपी गरी कक्षामा प्रयोग गर्न सक्नुहुन्छ।
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="text-center py-20 space-y-4 animate-pulse">
              <RefreshCw className="w-10 h-10 mx-auto text-emerald-600 animate-spin" />
              <p className="text-sm font-bold text-slate-700">
                नेपाल CDC विशिष्टीकरण तालिका अनुसार शिक्षक सामग्री तयार पार्दैछ...
              </p>
            </div>
          )}

          {generatedDoc && (
            <div className="space-y-6 text-sm">
              <div className="border-b border-slate-200 pb-4">
                <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  कक्षा {generatedDoc.grade} • {generatedDoc.subject}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-2">{generatedDoc.title}</h2>
                <p className="text-xs text-slate-600 mt-1 font-medium">{generatedDoc.summary}</p>
              </div>

              {/* Document Sections */}
              <div className="space-y-5">
                {generatedDoc.sections?.map((sec: any, idx: number) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 text-emerald-800">
                      <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-900 flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <span>{sec.heading}</span>
                    </h4>

                    <div className="prose prose-slate max-w-none text-xs leading-relaxed text-slate-800 whitespace-pre-line font-sans pl-7">
                      <ReactMarkdown>{sec.content}</ReactMarkdown>
                    </div>
                  </div>
                ))}
              </div>

              {/* Teacher Pro Tip */}
              {generatedDoc.teacherTip && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5 text-amber-950">
                    💡 शिक्षकका लागि विशेष सुझाव (Teacher Pro Tip):
                  </p>
                  <p className="font-medium text-amber-800">{generatedDoc.teacherTip}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
