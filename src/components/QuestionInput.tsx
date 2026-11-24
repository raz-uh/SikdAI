import React, { useState, useEffect } from 'react';
import { GradeNumber, SubjectOption } from '../types';
import { SAMPLE_QUESTIONS } from '../data/cdcData';
import { CameraModal } from './CameraModal';
import { Search, Mic, MicOff, Send, Lightbulb, Sparkles, RefreshCw, Camera, X, Image as ImageIcon, Globe } from 'lucide-react';

interface QuestionInputProps {
  grade: GradeNumber;
  subject: SubjectOption;
  onSubmitQuestion: (question: string, image?: string | null, langPreference?: 'Nepali' | 'English' | 'Auto') => void;
  isLoading: boolean;
}

export const QuestionInput: React.FC<QuestionInputProps> = ({
  grade,
  subject,
  onSubmitQuestion,
  isLoading,
}) => {
  const [questionText, setQuestionText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [langPreference, setLangPreference] = useState<'Nepali' | 'English' | 'Auto'>('Auto');

  const isEnglishSub = subject.id === 'english' || subject.nameEn.toLowerCase().includes('english');
  const isNepaliSub = subject.id === 'nepali' || subject.nameEn.toLowerCase().includes('nepali');

  // Filter sample questions relevant to current grade & subject or fallbacks
  const matchingSamples = SAMPLE_QUESTIONS.filter(
    (q) => q.subjectId === subject.id && (q.grade === grade || Math.abs(q.grade - grade) <= 2)
  );

  const activeSamples = matchingSamples.length > 0 
    ? matchingSamples 
    : SAMPLE_QUESTIONS.filter((q) => q.subjectId === subject.id);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
    }
  }, []);

  const handleSpeechToggle = () => {
    if (!speechSupported) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = langPreference === 'English' ? 'en-US' : 'ne-NP';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setQuestionText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!questionText.trim() && !selectedImage) || isLoading) return;
    onSubmitQuestion(questionText.trim(), selectedImage, langPreference);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
      {/* Camera Capture Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(dataUrl) => {
          setSelectedImage(dataUrl);
        }}
      />

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">3</span>
            प्रश्न लेख्नुहोस् वा फोटो खिच्नुहोस् (Type, Speak, or Scan Photo):
          </label>

          {/* Language Selector Bar */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5 shrink-0" />
            {isEnglishSub ? (
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-900 rounded-lg font-bold text-[11px]">
                English Subject (Only English Output)
              </span>
            ) : isNepaliSub ? (
              <span className="px-2 py-0.5 bg-rose-100 text-rose-900 rounded-lg font-bold text-[11px]">
                नेपाली विषय (नेपालीमा मात्र)
              </span>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setLangPreference('Nepali')}
                  className={`px-2 py-1 rounded-lg font-semibold transition-all ${
                    langPreference === 'Nepali'
                      ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🇳🇵 नेपाली
                </button>
                <button
                  type="button"
                  onClick={() => setLangPreference('English')}
                  className={`px-2 py-1 rounded-lg font-semibold transition-all ${
                    langPreference === 'English'
                      ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🇬🇧 English
                </button>
                <button
                  type="button"
                  onClick={() => setLangPreference('Auto')}
                  className={`px-2 py-1 rounded-lg font-semibold transition-all ${
                    langPreference === 'Auto'
                      ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🤖 स्वत: (Auto)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Selected Image Preview Badge */}
        {selectedImage && (
          <div className="relative inline-flex items-center gap-3 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs text-emerald-900 font-medium animate-fadeIn">
            <img
              src={selectedImage}
              alt="Question attached"
              className="w-14 h-14 object-cover rounded-lg border border-emerald-300 shadow-xs"
            />
            <div className="flex-1 pr-6">
              <span className="font-bold flex items-center gap-1 text-emerald-800">
                <ImageIcon className="w-3.5 h-3.5" />
                तस्विर संलग्न भयो (Photo Attached)
              </span>
              <p className="text-[11px] text-emerald-700 opacity-90">
                तपाईं अतिरिक्त थप प्रश्न लेख्न वा सोझै उत्तर खोज्न सक्नुहुन्छ।
              </p>
            </div>
            <button
              type="button"
              onClick={handleClearImage}
              title="तस्विर हटाउनुहोस्"
              className="absolute top-2 right-2 p-1 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-full border border-slate-200 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="relative">
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder={
              selectedImage
                ? 'यो तस्विरबारे थप विवरण वा प्रश्न लेख्नुहोस् (ऐच्छिक)...'
                : `उदाहरण: कक्षा ${grade} ${subject.nameNp} मा "न्युटनको नियम भनेको के हो?" वा फोटो खिच्नुहोस्`
            }
            rows={3}
            className="w-full px-4 py-3 pr-36 sm:pr-40 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 placeholder-slate-400 text-base font-normal resize-none transition-all shadow-xs"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />

          <div className="absolute right-3 bottom-3 flex items-center gap-1.5 sm:gap-2">
            {/* Camera Button */}
            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              title="प्रश्नको फोटो खिच्नुहोस् (Camera Scan)"
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs transition-all active:scale-95 shadow-xs"
            >
              <Camera className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">क्यामेरा</span>
            </button>

            {/* Speech Button */}
            {speechSupported && (
              <button
                type="button"
                onClick={handleSpeechToggle}
                title="बोलिबाट सोध्नुहोस् (Speech to Text)"
                className={`p-2 rounded-xl border transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white border-rose-500 animate-pulse shadow-md'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={(!questionText.trim() && !selectedImage) || isLoading}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all ${
                (!questionText.trim() && !selectedImage) || isLoading
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed border-transparent shadow-none'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 active:scale-95'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>खोज्दैछ...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>उत्तर खोज्नुहोस्</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Preset Sample Questions */}
      {activeSamples.length > 0 && (
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>कक्षा {grade} {subject.nameNp} का केही नमुना प्रश्नहरू (Sample CDC Questions):</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {activeSamples.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuestionText(sample.questionNp);
                }}
                className="text-xs bg-slate-50 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200 hover:border-emerald-300 text-slate-700 px-3 py-1.5 rounded-lg transition-all text-left flex items-center gap-1.5 group"
              >
                <Sparkles className="w-3 h-3 text-slate-400 group-hover:text-emerald-600" />
                <span className="font-semibold">{sample.titleNp}:</span>
                <span className="line-clamp-1 opacity-90">{sample.questionNp}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

