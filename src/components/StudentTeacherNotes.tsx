import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { StudyMaterial, GradeNumber } from '../types';
import { BookOpen, School, Sparkles, UserCheck, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface StudentTeacherNotesProps {
  grade: GradeNumber;
  subjectName: string;
}

export const StudentTeacherNotes: React.FC<StudentTeacherNotesProps> = ({ grade, subjectName }) => {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'study_materials'),
          where('grade', '==', grade)
        );
        const snapshot = await getDocs(q);
        const list: StudyMaterial[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as StudyMaterial);
        });
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setMaterials(list);
      } catch (err) {
        console.error('Error fetching teacher materials for student:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [grade, subjectName]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-slate-400 text-xs">
        शिक्षकहरूले पोष्ट गरेका सामग्रीहरू खोजिँदैछ...
      </div>
    );
  }

  if (materials.length === 0) {
    return null; // Don't block UI if no teacher notes yet
  }

  return (
    <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border border-indigo-200 rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <School className="w-5 h-5 text-indigo-700 shrink-0" />
        <h3 className="text-sm font-black text-indigo-950">
          शिक्षकहरूबाट पोस्ट गरिएका विशेष नोटहरू (Teacher Study Guides - Class {grade}):
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {materials.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl p-4 border border-indigo-100 shadow-2xs space-y-2 hover:border-indigo-300 transition-all"
          >
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
              <span className="flex items-center gap-1 text-indigo-700">
                <UserCheck className="w-3.5 h-3.5" />
                {item.teacherName}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(item.createdAt).toLocaleDateString('ne-NP')}
              </span>
            </div>

            <h4 className="font-extrabold text-slate-900 text-sm">
              {item.title}
            </h4>

            <div className="text-slate-700 text-xs leading-relaxed prose prose-sm max-h-48 overflow-y-auto">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {item.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
