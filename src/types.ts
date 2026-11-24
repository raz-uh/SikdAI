export type GradeNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface SubjectOption {
  id: string;
  nameNp: string;
  nameEn: string;
  iconName: string;
  color: string;
  bgColor: string;
  descriptionNp: string;
}

export interface TutorResponse {
  simpleAnswer: string;       // सरल उत्तर (Simple Direct Answer)
  stepByStepExplanation: string; // बुझ्न सजिलो व्याख्या (Step-by-step concept explanation)
  practiceQuestion: string;   // अभ्यास प्रश्न (One quick practice question for the student to try)
  practiceAnswer?: string;
  keyTakeaways?: string[];
  cdcReference?: string;
}

export interface SavedHistoryItem {
  id: string;
  date: string;
  grade: GradeNumber;
  subject: string;
  question: string;
  image?: string;
  response: TutorResponse;
}

export interface SampleQuestion {
  grade: GradeNumber;
  subjectId: string;
  titleNp: string;
  questionNp: string;
  questionEn: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizSet {
  topicTitle: string;
  questions: QuizQuestion[];
}


export type UserRole = 'student' | 'teacher';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  grade?: GradeNumber; // Student grade
  schoolName?: string;
  subjectSpecialization?: string; // Teacher subject focus (e.g., 'Science & Technology', 'Mathematics', 'English')
  createdAt: string;
}

export interface StudyMaterial {
  id: string;
  teacherId: string;
  teacherName: string;
  title: string;
  grade: GradeNumber;
  subject: string;
  content: string;
  tags?: string[];
  createdAt: string;
}

