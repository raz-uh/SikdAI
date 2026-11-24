import React, { useState, useEffect } from 'react';
import { GradeNumber, SubjectOption, TutorResponse, SavedHistoryItem } from './types';
import { SUBJECTS, GRADES } from './data/cdcData';
import { Navbar, NavTab } from './components/Navbar';
import { GradeSubjectSelector } from './components/GradeSubjectSelector';
import { QuestionInput } from './components/QuestionInput';
import { TutorResponseCard } from './components/TutorResponseCard';
import { QuizModal } from './components/QuizModal';
import { CheatsheetModal } from './components/CheatsheetModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { SeePrepModal } from './components/SeePrepModal';
import { TeacherCopilot } from './components/TeacherCopilot';
import { ParentDashboard } from './components/ParentDashboard';
import { PricingModal } from './components/PricingModal';
import { PitchDeckModal } from './components/PitchDeckModal';
import { TeacherPortal } from './components/TeacherPortal';
import { StudentTeacherNotes } from './components/StudentTeacherNotes';
import { useAuth } from './context/AuthContext';
import { db } from './lib/firebase';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Sparkles, GraduationCap, AlertCircle, RefreshCw, BookOpen, Heart, ShieldCheck, Star } from 'lucide-react';

export default function App() {
  const { currentUser, userProfile } = useAuth();

  const [selectedGrade, setSelectedGrade] = useState<GradeNumber>(10);
  const [selectedSubject, setSelectedSubject] = useState<SubjectOption>(SUBJECTS[0]);
  const [question, setQuestion] = useState<string>('');
  const [questionImage, setQuestionImage] = useState<string | null>(null);
  const [response, setResponse] = useState<TutorResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<NavTab>('tutor');

  // Load saved history from localStorage & Firestore
  const [savedItems, setSavedItems] = useState<SavedHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem('sikdai_saved_notebook');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Auto set grade if student is logged in
  useEffect(() => {
    if (userProfile?.grade) {
      setSelectedGrade(userProfile.grade);
    }
  }, [userProfile]);

  // Sync saved notes from Firestore when user logs in
  useEffect(() => {
    const fetchFirestoreSavedNotes = async () => {
      if (!currentUser) return;
      try {
        const q = query(
          collection(db, 'saved_notes'),
          where('userId', '==', currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const firestoreList: SavedHistoryItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          firestoreList.push({
            id: docSnap.id,
            date: data.createdAt ? new Date(data.createdAt).toLocaleDateString('ne-NP') : 'अघिल्लो नोट',
            grade: data.grade,
            subject: data.subject,
            question: data.question,
            response: {
              simpleAnswer: data.simpleAnswer,
              stepByStepExplanation: data.stepByStepExplanation,
              practiceQuestion: data.practiceQuestion || '',
              practiceAnswer: data.practiceAnswer || '',
            },
          });
        });

        if (firestoreList.length > 0) {
          // Merge with local avoiding duplicates
          setSavedItems((prev) => {
            const map = new Map<string, SavedHistoryItem>();
            [...firestoreList, ...prev].forEach((item) => map.set(item.question + item.grade, item));
            return Array.from(map.values());
          });
        }
      } catch (err) {
        console.error('Error fetching Firestore saved notes:', err);
      }
    };

    fetchFirestoreSavedNotes();
  }, [currentUser]);

  // Save notebook changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sikdai_saved_notebook', JSON.stringify(savedItems));
    } catch (e) {
      console.error(e);
    }
  }, [savedItems]);

  const handleAskQuestion = async (
    userQuestionText: string,
    userImage?: string | null,
    langPref: 'Nepali' | 'English' | 'Auto' = 'Auto'
  ) => {
    const finalQuestionText = userQuestionText.trim() || 'संलग्न तस्विरमा रहेको प्रश्नको समाधान (Photo Question)';
    setQuestion(finalQuestionText);
    setQuestionImage(userImage || null);
    setIsLoading(true);
    setErrorMsg(null);
    setResponse(null);

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grade: selectedGrade,
          subject: selectedSubject.nameNp,
          question: userQuestionText,
          image: userImage,
          langPreference: langPref,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'सर्भरबाट उत्तर प्राप्त गर्न सकिएन।');
      }

      const data: TutorResponse = await res.json();
      setResponse(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'उत्तर सिर्जना गर्दा समस्या आयो। कृपया पुन: प्रयास गर्नुहोस्।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBookmark = async () => {
    if (!response || !question) return;

    const existingIndex = savedItems.findIndex(
      (item) => item.question === question && item.grade === selectedGrade
    );

    if (existingIndex >= 0) {
      // Un-save locally
      const itemToRemove = savedItems[existingIndex];
      setSavedItems(savedItems.filter((_, idx) => idx !== existingIndex));

      // Un-save from Firestore if logged in
      if (currentUser && itemToRemove.id) {
        try {
          await deleteDoc(doc(db, 'saved_notes', itemToRemove.id));
        } catch (e) {
          console.error('Error removing note from Firestore:', e);
        }
      }
    } else {
      // Save new
      const newItem: SavedHistoryItem = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('ne-NP'),
        grade: selectedGrade,
        subject: selectedSubject.nameNp,
        question: question,
        image: questionImage || undefined,
        response: response,
      };

      setSavedItems([newItem, ...savedItems]);

      // Sync to Firestore if logged in
      if (currentUser) {
        try {
          const docRef = await addDoc(collection(db, 'saved_notes'), {
            userId: currentUser.uid,
            grade: selectedGrade,
            subject: selectedSubject.nameNp,
            question: question,
            simpleAnswer: response.simpleAnswer,
            stepByStepExplanation: response.stepByStepExplanation,
            practiceQuestion: response.practiceQuestion || '',
            practiceAnswer: response.practiceAnswer || '',
            createdAt: new Date().toISOString(),
          });
          newItem.id = docRef.id;
        } catch (e) {
          console.error('Error saving note to Firestore:', e);
        }
      }
    }
  };

  const isCurrentSaved = savedItems.some(
    (item) => item.question === question && item.grade === selectedGrade
  );

  const handleSelectSavedItem = (item: SavedHistoryItem) => {
    setSelectedGrade(item.grade);
    const subObj = SUBJECTS.find((s) => s.nameNp === item.subject) || SUBJECTS[0];
    setSelectedSubject(subObj);
    setQuestion(item.question);
    setQuestionImage(item.image || null);
    setResponse(item.response);
    setActiveTab('tutor');
  };

  const handleRemoveSavedItem = async (id: string) => {
    setSavedItems(savedItems.filter((item) => item.id !== id));
    if (currentUser) {
      try {
        await deleteDoc(doc(db, 'saved_notes', id));
      } catch (e) {
        console.error('Error deleting note from Firestore:', e);
      }
    }
  };

  const handleClearAllSaved = () => {
    if (confirm('के तपाईं सबै सुरक्षित नोटहरू हटाउन चाहनुहुन्छ?')) {
      setSavedItems([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} savedCount={savedItems.length} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Welcome Hero Banner (Only on Tutor tab if no question asked yet) */}
        {activeTab === 'tutor' && !response && !isLoading && (
          <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-emerald-300 to-transparent pointer-events-none"></div>

            <div className="max-w-2xl space-y-3 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-semibold text-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>नेपालको आफ्नै भर्चुअल ट्युटर - सिक्दै-AI</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                नमस्ते साथी! कक्षा १ देखि १० सम्मका सबै शैक्षिक प्रश्नको उत्तर नेपालीमा पाउनुहोस्।
              </h1>

              <p className="text-sm sm:text-base text-emerald-100 leading-relaxed font-normal">
                नेपाल पाठ्यक्रम विकास केन्द्र (CDC) को मान्यता अनुसार सरल उत्तर, बुझ्न सजिलो व्याख्या र अभ्यास प्रश्नहरू प्रस्तुत गरिन्छ।
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-emerald-200">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" /> CDC निर्देशिका अनुसार
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-300" /> सरल नेपालीमा व्याख्या
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-300" /> कक्षा १-१० सबै विषय
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Tutor Q&A */}
        {activeTab === 'tutor' && (
          <div className="space-y-6">
            <GradeSubjectSelector
              selectedGrade={selectedGrade}
              setSelectedGrade={setSelectedGrade}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
            />

            <StudentTeacherNotes grade={selectedGrade} subjectName={selectedSubject.nameNp} />

            <QuestionInput
              grade={selectedGrade}
              subject={selectedSubject}
              onSubmitQuestion={handleAskQuestion}
              isLoading={isLoading}
            />

            {/* Error Message */}
            {errorMsg && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center gap-3 text-sm font-medium">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Loading Skeleton */}
            {isLoading && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6 animate-pulse">
                <div className="h-6 bg-slate-200 rounded-md w-1/3"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-slate-200 rounded-md w-full"></div>
                  <div className="h-4 bg-slate-200 rounded-md w-5/6"></div>
                  <div className="h-4 bg-slate-200 rounded-md w-2/3"></div>
                </div>
                <div className="h-24 bg-slate-100 rounded-xl"></div>
                <div className="flex items-center gap-2 text-emerald-700 text-sm font-bold justify-center pt-4">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>पाठ्यक्रम विकास केन्द्र (CDC) को आधारमा उत्तर तयार हुँदैछ...</span>
                </div>
              </div>
            )}

            {/* Response Card */}
            {response && !isLoading && (
              <TutorResponseCard
                grade={selectedGrade}
                subjectName={selectedSubject.nameNp}
                question={question}
                questionImage={questionImage}
                response={response}
                onSaveBookmark={handleSaveBookmark}
                isSaved={isCurrentSaved}
              />
            )}
          </div>
        )}

        {/* Tab 2: Teacher Portal (Published notes, AI Lesson Plans) */}
        {activeTab === 'teacher_portal' && <TeacherPortal />}

        {/* Tab 3: SEE Exam & Essay Prep */}
        {activeTab === 'see_prep' && <SeePrepModal grade={selectedGrade} />}

        {/* Tab 4: Teacher Co-Pilot */}
        {activeTab === 'teacher' && <TeacherCopilot grade={selectedGrade} />}

        {/* Tab 5: Parent Dashboard */}
        {activeTab === 'parent' && <ParentDashboard grade={selectedGrade} />}

        {/* Tab 6: MCQ Quiz Practice */}
        {activeTab === 'quiz' && (
          <QuizModal grade={selectedGrade} subject={selectedSubject} />
        )}

        {/* Tab 7: Pricing Plans */}
        {activeTab === 'pricing' && <PricingModal />}

        {/* Tab 8: Seed Pitch Deck */}
        {activeTab === 'pitch' && <PitchDeckModal />}

        {/* Tab 9: Formula Cheat Sheets */}
        {activeTab === 'cheatsheet' && <CheatsheetModal />}

        {/* Tab 10: My Saved Notebook */}
        {activeTab === 'history' && (
          <HistoryDrawer
            savedItems={savedItems}
            onSelectSavedItem={handleSelectSavedItem}
            onRemoveItem={handleRemoveSavedItem}
            onClearAll={handleClearAllSaved}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-slate-500 text-xs text-center space-y-2">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-semibold text-slate-700">
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            <span>SikdAI (सिक्दै-AI) - नेपाल CDC भर्चुअल ट्युटर</span>
          </div>

          <p className="text-slate-500 font-medium">
            नेपाल पाठ्यक्रम विकास केन्द्र (CDC) को मान्यता अनुसार तयार पारिएको।
          </p>

          <p className="flex items-center gap-1 font-medium">
            Made for Nepalese Students <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </footer>
    </div>
  );
}

