import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { StudyMaterial, GradeNumber } from '../types';
import { SUBJECTS } from '../data/cdcData';
import { BookOpen, PlusCircle, Trash2, Sparkles, Send, GraduationCap, CheckCircle2, FileText, Layers, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export const TeacherPortal: React.FC = () => {
  const { userProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<'create' | 'myMaterials' | 'aiPlanner'>('myMaterials');

  // New Material Form
  const [selectedGrade, setSelectedGrade] = useState<GradeNumber>(8);
  const [selectedSubject, setSelectedSubject] = useState<string>('विज्ञान तथा प्रविधि (Science & Tech)');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // My Materials List
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(false);

  // AI Lesson Assistant state
  const [aiTopic, setAiTopic] = useState('');
  const [aiGrade, setAiGrade] = useState<GradeNumber>(8);
  const [aiSubject, setAiSubject] = useState('Science & Technology');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [generatedLesson, setGeneratedLesson] = useState<string | null>(null);

  const fetchMaterials = async () => {
    if (!userProfile) return;
    setIsLoadingMaterials(true);
    try {
      const q = query(
        collection(db, 'study_materials'),
        where('teacherId', '==', userProfile.uid)
      );
      const snapshot = await getDocs(q);
      const list: StudyMaterial[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as StudyMaterial);
      });
      // Sort in memory by date descending
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setMaterials(list);
    } catch (err) {
      console.error('Error fetching materials:', err);
    } finally {
      setIsLoadingMaterials(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [userProfile]);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile || !title.trim() || !content.trim()) return;

    setIsPublishing(true);
    setPublishSuccess(false);

    try {
      const newMat = {
        teacherId: userProfile.uid,
        teacherName: userProfile.displayName || 'शिक्षक (Teacher)',
        title: title.trim(),
        grade: selectedGrade,
        subject: selectedSubject,
        content: content.trim(),
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'study_materials'), newMat);

      setTitle('');
      setContent('');
      setPublishSuccess(true);
      fetchMaterials();
      setTimeout(() => setPublishSuccess(false), 4000);
    } catch (err) {
      console.error('Publish error:', err);
      alert('सामग्री पोस्ट गर्दा समस्या आयो। (Failed to publish material)');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    if (!confirm('के तपाइँ यो अध्ययन सामग्री हटाउन चाहनुहुन्छ? (Are you sure?)')) return;
    try {
      await deleteDoc(doc(db, 'study_materials', id));
      setMaterials((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleGenerateAiLesson = async () => {
    if (!aiTopic.trim()) return;
    setIsGeneratingAi(true);
    setGeneratedLesson(null);

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: aiGrade,
          subject: aiSubject,
          question: `Create a comprehensive lesson plan / teaching guide for CDC Class ${aiGrade} ${aiSubject} on the topic: "${aiTopic}". Include: 1. Lesson Objectives (सिक्ने उपलब्धिहरू), 2. Essential Vocabulary & Formulas, 3. Step-by-step Teaching Steps & Activities, 4. Sample Assessment/Quiz Questions. Respond in clear Nepali and English.`,
          langPreference: 'Nepali',
        }),
      });

      const data = await res.json();
      if (data.stepByStepExplanation) {
        setGeneratedLesson(data.stepByStepExplanation);
      } else {
        setGeneratedLesson(data.simpleAnswer || 'पाठ योजना तयार भयो।');
      }
    } catch (err) {
      console.error('AI Lesson Plan Error:', err);
      alert('पाठ योजना बनाउन सकिएन।');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-5 sm:p-7 space-y-6">
      {/* Teacher Portal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-indigo-700 font-extrabold text-xs uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            शिक्षक पोर्टल (Teacher Portal)
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            नमस्ते, {userProfile?.displayName || 'आदरणीय शिक्षक'} ज्यु! 👨‍🏫
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
            नेपाल CDC पाठ्यक्रम अनुरूप कक्षा १-१० का विद्यार्थीहरूका लागि नोटहरू र सामग्रीहरू तयार तथा व्यवस्थापन गर्नुहोस्।
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('myMaterials')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'myMaterials'
                ? 'bg-indigo-600 text-white shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>मेरा सामग्रीहरू ({materials.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'create'
                ? 'bg-indigo-600 text-white shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>नयाँ नोट/सामग्री पोष्ट</span>
          </button>

          <button
            onClick={() => setActiveTab('aiPlanner')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'aiPlanner'
                ? 'bg-amber-600 text-white shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI पाठ योजना सहायक</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MY MATERIALS */}
      {activeTab === 'myMaterials' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              तपाईंले पोस्ट गर्नुभएका नोट तथा अध्ययन सामग्रीहरू:
            </h3>
            <button
              onClick={fetchMaterials}
              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              title="पुन: लोड गर्नुहोस्"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingMaterials ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {isLoadingMaterials ? (
            <div className="py-12 text-center text-slate-400 text-xs font-medium">
              सामग्री लोड हुँदैछ... (Loading materials)
            </div>
          ) : materials.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-8 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-slate-700 text-sm font-bold">
                अझै कुनै अध्ययन सामग्री पोस्ट गर्नुभएको छैन।
              </p>
              <p className="text-slate-500 text-xs">
                विद्यार्थीहरूका लागि कक्षा १ देखि १० सम्मका नोटहरू वा नमुना अभ्यास प्रश्नहरू थप्न 'नयाँ नोट/सामग्री पोष्ट' मा क्लिक गर्नुहोस्।
              </p>
              <button
                onClick={() => setActiveTab('create')}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors inline-flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                अहिले नयाँ नोट पोस्ट गर्नुहोस्
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {materials.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 space-y-3 relative group hover:border-indigo-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 font-extrabold text-[11px] rounded-lg">
                      कक्षा {item.grade} • {item.subject}
                    </span>
                    <button
                      onClick={() => handleDeleteMaterial(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                      title="सामग्री हटाउनुहोस्"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-base leading-snug">
                    {item.title}
                  </h4>

                  <div className="text-slate-700 text-xs line-clamp-4 prose prose-sm prose-emerald">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                      {item.content}
                    </ReactMarkdown>
                  </div>

                  <div className="text-[10px] text-slate-400 font-medium pt-2 border-t border-slate-200/60">
                    मिति: {new Date(item.createdAt).toLocaleDateString('ne-NP')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CREATE NEW MATERIAL */}
      {activeTab === 'create' && (
        <form onSubmit={handlePublish} className="space-y-4 max-w-3xl">
          {publishSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>सामग्री सफलतापुर्वक पोष्ट गरियो! विद्यार्थीहरूले आफ्नो ड्यासबोर्डमा यो देख्न सक्नेछन्।</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-extrabold text-slate-700 block mb-1">
                कक्षा छान्नुहोस् (Grade):
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(Number(e.target.value) as GradeNumber)}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((g) => (
                  <option key={g} value={g}>
                    कक्षा {g} (Class {g})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-extrabold text-slate-700 block mb-1">
                विषय छान्नुहोस् (Subject):
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {SUBJECTS.map((s) => (
                  <option key={s.id} value={`${s.nameNp} (${s.nameEn})`}>
                    {s.nameNp} ({s.nameEn})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-extrabold text-slate-700 block mb-1">
              सामग्रीको शीर्षक (Note / Resource Title):
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="उदा: एकाई ३ - प्रकाश र यसका नियमहरू (Unit Notes & Rules)"
              className="w-full px-3 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-extrabold text-slate-700 block mb-1">
              सामग्री तथा नोटको विवरण (Content in Markdown/Text):
            </label>
            <textarea
              rows={8}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="यहाँ मुख्य बुँदाहरू, उत्तरहरू, वा सूत्रहरू लेख्नुहोस् (You can use markdown formulas or bullet points)..."
              className="w-full p-3 text-xs font-mono rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isPublishing}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isPublishing ? 'प्रकाशन हुँदैछ...' : 'नोट प्रकाशित गर्नुहोस् (Publish Note)'}</span>
          </button>
        </form>
      )}

      {/* TAB 3: AI LESSON PLAN ASSISTANT */}
      {activeTab === 'aiPlanner' && (
        <div className="space-y-4 max-w-3xl">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950 space-y-1">
              <p className="font-extrabold text-sm">SikdAI शिक्षक पाठ-योजना सहायक</p>
              <p>
                CDC पाठ्यक्रम अनुसार कुनै पनि पाठ वा शीर्षक राख्नुहोस्। SikdAI ले तुरुन्तै उद्देश्य, शिक्षण विधि, सूत्र र नमुना प्रश्न सहितको उत्कृष्ट पाठ योजना तयार गरिदिनेछ।
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">कक्षा (Grade):</label>
              <select
                value={aiGrade}
                onChange={(e) => setAiGrade(Number(e.target.value) as GradeNumber)}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((g) => (
                  <option key={g} value={g}>
                    कक्षा {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">विषय (Subject):</label>
              <input
                type="text"
                value={aiSubject}
                onChange={(e) => setAiSubject(e.target.value)}
                placeholder="Science, Math, English..."
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">पाठको शीर्षक (Lesson Topic):</label>
            <input
              type="text"
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              placeholder="उदा: पाइथागोरस साध्य (Pythagoras Theorem) वा गुरुत्वाकर्षण बल"
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <button
            type="button"
            onClick={handleGenerateAiLesson}
            disabled={isGeneratingAi || !aiTopic.trim()}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGeneratingAi ? 'पाठ योजना बन्दैछ...' : 'AI पाठ-योजना तयार गर्नुहोस्'}</span>
          </button>

          {generatedLesson && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-600" />
                  तयार भएको पाठ-योजना गाइड:
                </span>
                <button
                  onClick={() => {
                    setTitle(`पाठ योजना: ${aiTopic}`);
                    setContent(generatedLesson);
                    setActiveTab('create');
                  }}
                  className="px-3 py-1 bg-indigo-100 text-indigo-900 font-bold text-[11px] rounded-lg hover:bg-indigo-200 transition-colors"
                >
                  सामग्रीको रूपमा प्रकाशित गर्न पठाउनुहोस्
                </button>
              </div>

              <div className="text-xs text-slate-800 leading-relaxed prose prose-sm prose-emerald max-w-none">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {generatedLesson}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
