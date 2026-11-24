import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { TutorResponse, GradeNumber } from '../types';
import {
  CheckCircle2,
  BookOpenCheck,
  HelpCircle,
  Volume2,
  VolumeX,
  Bookmark,
  BookmarkCheck,
  Share2,
  Printer,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Award,
  BookMarked
} from 'lucide-react';

interface TutorResponseCardProps {
  grade: GradeNumber;
  subjectName: string;
  question: string;
  questionImage?: string | null;
  response: TutorResponse;
  onSaveBookmark: () => void;
  isSaved: boolean;
}

export const TutorResponseCard: React.FC<TutorResponseCardProps> = ({
  grade,
  subjectName,
  question,
  questionImage,
  response,
  onSaveBookmark,
  isSaved,
}) => {
  const [showPracticeAnswer, setShowPracticeAnswer] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);

  // Audio Text-To-Speech handler
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('तपाईंको ब्राउजरमा आवाज सुविधा उपलब्ध छैन।');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const textToRead = `${response.simpleAnswer}. ${response.stepByStepExplanation.replace(/[*#]/g, '')}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    // Try to pick a Nepali or Hindi voice if available, fallback to default
    const voices = window.speechSynthesis.getVoices();
    const nepalVoice = voices.find(v => v.lang.includes('ne') || v.lang.includes('hi'));
    if (nepalVoice) {
      utterance.voice = nepalVoice;
    }
    utterance.rate = 0.9; // Slightly slower for clarity

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handleCopyText = () => {
    const fullText = `[SikdAI - कक्षा ${grade} ${subjectName}]\nप्रश्न: ${question}\n\n[सरल उत्तर]\n${response.simpleAnswer}\n\n[बुझ्न सजिलो व्याख्या]\n${response.stepByStepExplanation}\n\n[अभ्यास प्रश्न]\n${response.practiceQuestion}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Pre-process text to fix common LaTeX formatting issues if needed
  const formatExplanation = (text: string) => {
    if (!text) return '';
    // Ensure single dollar expressions like $F \propto m_1$ or $$ equation $$ are properly spaced
    return text;
  };

  const isResponseEnglish =
    !/[\u0900-\u097F]/.test(response.simpleAnswer || '') ||
    subjectName.toLowerCase().includes('english') ||
    subjectName.includes('अंग्रेजी');

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden transition-all print:shadow-none print:border-none">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-5 sm:p-6 print:bg-none print:text-black print:p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              कक्षा {grade} • {subjectName}
            </span>
            <span className="bg-white/10 text-slate-200 px-3 py-1 rounded-full text-xs font-medium">
              नेपाल CDC पाठ्यक्रम अनुसार
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handleToggleSpeech}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isPlayingAudio
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title="आवाजमा सुन्नुहोस् (Listen in Audio)"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isPlayingAudio ? (isResponseEnglish ? 'Stop' : 'रोक्नुहोस्') : (isResponseEnglish ? 'Listen' : 'सुन्नुहोस्')}</span>
            </button>

            <button
              onClick={onSaveBookmark}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isSaved
                  ? 'bg-amber-400 text-slate-900 font-bold'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title="नोटमा सुरक्षित गर्नुहोस्"
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              <span className="hidden sm:inline">{isSaved ? (isResponseEnglish ? 'Saved' : 'सुरक्षित छ') : (isResponseEnglish ? 'Save Note' : 'नोटमा राख्नुस्')}</span>
            </button>

            <button
              onClick={handleCopyText}
              className="p-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-all"
              title="प्रतिलिपि बनाउनुहोस् (Copy)"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={handlePrint}
              className="p-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-all hidden sm:flex"
              title="प्रिन्ट गर्नुहोस् (Print)"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start gap-4">
          {questionImage && (
            <div className="shrink-0 group relative">
              <img
                src={questionImage}
                alt="Uploaded question photo"
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border-2 border-emerald-400/50 shadow-md transition-all group-hover:scale-105"
              />
              <span className="absolute bottom-1 right-1 bg-black/70 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded font-bold">
                फोटो
              </span>
            </div>
          )}
          <h2 className="text-lg sm:text-xl font-extrabold text-white leading-snug font-sans flex-1">
            {isResponseEnglish ? 'Question: ' : 'प्रश्न: '}<span className="font-medium text-emerald-100">"{question}"</span>
          </h2>
        </div>
      </div>

      <div className="p-5 sm:p-7 space-y-6">
        {/* SECTION 1: Direct Answer */}
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 sm:p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-200/30 rounded-bl-full -mr-6 -mt-6 pointer-events-none"></div>
          
          <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-base mb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{isResponseEnglish ? '1. Simple Direct Answer:' : '१. सरल उत्तर (Simple Direct Answer):'}</span>
          </div>

          <p className="text-slate-800 text-base sm:text-lg font-medium leading-relaxed pl-7">
            {response.simpleAnswer}
          </p>
        </div>

        {/* SECTION 2: Step-by-step Concept Explanation */}
        <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base border-b border-slate-200 pb-2.5">
            <BookOpenCheck className="w-5 h-5 text-teal-600 shrink-0" />
            <span>{isResponseEnglish ? '2. Step-by-step Concept Explanation:' : '२. बुझ्न सजिलो व्याख्या (Step-by-step Concept Explanation):'}</span>
          </div>

          <div className="text-slate-800 text-base leading-relaxed pl-1 font-sans prose prose-emerald max-w-none prose-p:my-2 prose-headings:my-3 prose-ul:my-2 prose-ol:my-2">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {formatExplanation(response.stepByStepExplanation)}
            </ReactMarkdown>
          </div>

          {/* Key Takeaways */}
          {response.keyTakeaways && response.keyTakeaways.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-200/80">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                {isResponseEnglish ? 'Key Revision Points / Takeaways:' : 'मुख्य याद राख्नुपर्ने बुँदाहरू (Key Revision Points):'}
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {response.keyTakeaways.map((item, index) => (
                  <li key={index} className="bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-800 flex items-start gap-2 shadow-2xs">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* SECTION 3: Practice Question */}
        <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-950 font-extrabold text-base">
              <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>{isResponseEnglish ? '3. Practice Question for You:' : '३. अभ्यास प्रश्न (Practice Question for You):'}</span>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 bg-amber-200 text-amber-900 rounded-md">
              {isResponseEnglish ? 'Try it yourself!' : 'आफै प्रयास गर्नुहोस्!'}
            </span>
          </div>

          <p className="text-slate-900 font-bold text-base bg-white p-3 rounded-lg border border-amber-200 shadow-2xs">
            {response.practiceQuestion}
          </p>

          {/* Show Practice Answer Toggle */}
          {response.practiceAnswer && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowPracticeAnswer(!showPracticeAnswer)}
                className="flex items-center gap-2 text-xs font-bold text-amber-800 hover:text-amber-950 transition-colors"
              >
                {showPracticeAnswer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                <span>
                  {showPracticeAnswer
                    ? (isResponseEnglish ? 'Hide Answer' : 'उत्तर लुकाउनुहोस्')
                    : (isResponseEnglish ? 'Show Answer & Explanation' : 'उत्तर र स्पष्टीकरण हेर्नुहोस् (Show Answer)')}
                </span>
              </button>

              {showPracticeAnswer && (
                <div className="mt-2.5 bg-white p-3.5 rounded-lg border border-amber-300 text-sm text-slate-800 leading-relaxed font-medium animate-fadeIn">
                  <span className="font-bold text-amber-900 block mb-1">
                    {isResponseEnglish ? 'Correct Answer:' : 'सही उत्तर:'}
                  </span>
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {response.practiceAnswer}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CDC Reference Note */}
        {response.cdcReference && (
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 pt-2 border-t border-slate-100">
            <BookMarked className="w-4 h-4 text-slate-400" />
            <span>{response.cdcReference}</span>
          </div>
        )}
      </div>
    </div>
  );
};
