import React, { useState } from 'react';
import { GradeNumber, SubjectOption, QuizSet } from '../types';
import { HelpCircle, CheckCircle2, XCircle, RefreshCw, Award, ArrowRight, Sparkles } from 'lucide-react';

interface QuizModalProps {
  grade: GradeNumber;
  subject: SubjectOption;
}

export const QuizModal: React.FC<QuizModalProps> = ({ grade, subject }) => {
  const [topicInput, setTopicInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [quizSet, setQuizSet] = useState<QuizSet | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateQuiz = async () => {
    setLoading(true);
    setError(null);
    setQuizSet(null);
    setSelectedAnswers({});
    setSubmitted(false);

    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade,
          subject: subject.nameNp,
          topic: topicInput || `${subject.nameNp} पाठ्यपुस्तक अभ्यास`,
        }),
      });

      if (!res.ok) {
        throw new Error('क्विज सिर्जना गर्न सकिएन।');
      }

      const data: QuizSet = await res.json();
      setQuizSet(data);
    } catch (err: any) {
      setError(err.message || 'कुनै समस्या आयो। पुन: प्रयास गर्नुहोस्।');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (questionId: number, optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const calculateScore = () => {
    if (!quizSet) return 0;
    let score = 0;
    quizSet.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-emerald-600" />
            CDC क्विज अभ्यास (Class {grade} {subject.nameNp})
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            नेपाल पाठ्यक्रम विकास केन्द्रको ढाँचा अनुसार ३ वटा बहुवैकल्पिक प्रश्नहरू
          </p>
        </div>

        <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold">
          कक्षा {grade} • {subject.nameNp}
        </span>
      </div>

      {/* Topic Input Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={topicInput}
          onChange={(e) => setTopicInput(e.target.value)}
          placeholder={`कुनै निश्चित पाठ टाइप गर्नुहोस् (उदा. "परमाणु", "Pythagoras", "इतिहास")`}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
        />
        <button
          onClick={handleGenerateQuiz}
          disabled={loading}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>क्विज बनाउँदैछ...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>नयाँ क्विज तयार गर्नुहोस्</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Quiz Display */}
      {quizSet && (
        <div className="space-y-6 pt-2">
          {quizSet.questions.map((q, idx) => {
            const selectedOpt = selectedAnswers[q.id];
            const isCorrect = selectedOpt === q.correctIndex;

            return (
              <div key={q.id} className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                <div className="font-bold text-base text-slate-900 flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{q.question}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-8">
                  {q.options.map((opt, optIdx) => {
                    const isThisSelected = selectedOpt === optIdx;
                    let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:border-slate-300';

                    if (submitted) {
                      if (optIdx === q.correctIndex) {
                        btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold';
                      } else if (isThisSelected && !isCorrect) {
                        btnStyle = 'bg-rose-100 border-rose-400 text-rose-900 font-medium';
                      } else {
                        btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                      }
                    } else if (isThisSelected) {
                      btnStyle = 'bg-emerald-600 border-emerald-600 text-white font-bold';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleOptionSelect(q.id, optIdx)}
                        className={`p-3 rounded-lg border text-left text-sm transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {submitted && optIdx === q.correctIndex && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        {submitted && isThisSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="ml-8 p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed font-medium">
                    <span className="font-bold text-emerald-800">व्याख्या: </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            {!submitted ? (
              <button
                onClick={() => setSubmitted(true)}
                disabled={Object.keys(selectedAnswers).length === 0}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 disabled:opacity-40"
              >
                <span>नतिजा हेर्नुहोस् (Submit Quiz)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center justify-between w-full bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-emerald-600" />
                  <div>
                    <div className="text-lg font-extrabold text-emerald-950">
                      प्राप्त अङ्क: {calculateScore()} / {quizSet.questions.length}
                    </div>
                    <div className="text-xs text-emerald-800 font-medium">
                      {calculateScore() === 3
                        ? 'अति उत्तम! तपाईंले सबै प्रश्नको सही उत्तर दिनुभयो।'
                        : 'राम्रो प्रयास! पाठ पुन: दोहोर्‍याएर पढ्नुहोस्।'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleGenerateQuiz}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold text-xs hover:bg-emerald-700 transition-colors"
                >
                  पुन: प्रयास गर्नुहोस्
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
