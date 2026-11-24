import { SubjectOption, SampleQuestion, GradeNumber } from '../types';

export const GRADES: { grade: GradeNumber; nameNp: string; nameEn: string; levelNp: string }[] = [
  { grade: 1, nameNp: 'कक्षा १', nameEn: 'Class 1', levelNp: 'आधारभूत तह (१-३)' },
  { grade: 2, nameNp: 'कक्षा २', nameEn: 'Class 2', levelNp: 'आधारभूत तह (१-३)' },
  { grade: 3, nameNp: 'कक्षा ३', nameEn: 'Class 3', levelNp: 'आधारभूत तह (१-३)' },
  { grade: 4, nameNp: 'कक्षा ४', nameEn: 'Class 4', levelNp: 'आधारभूत तह (४-५)' },
  { grade: 5, nameNp: 'कक्षा ५', nameEn: 'Class 5', levelNp: 'आधारभूत तह (४-५)' },
  { grade: 6, nameNp: 'कक्षा ६', nameEn: 'Class 6', levelNp: 'आधारभूत तह (६-८)' },
  { grade: 7, nameNp: 'कक्षा ७', nameEn: 'Class 7', levelNp: 'आधारभूत तह (६-८)' },
  { grade: 8, nameNp: 'कक्षा ८', nameEn: 'Class 8', levelNp: 'आधारभूत तह (६-८ - BLE)' },
  { grade: 9, nameNp: 'कक्षा ९', nameEn: 'Class 9', levelNp: 'माध्यमिक तह (९-१०)' },
  { grade: 10, nameNp: 'कक्षा १०', nameEn: 'Class 10', levelNp: 'माध्यमिक तह (SEE)' },
];

export const SUBJECTS: SubjectOption[] = [
  {
    id: 'science',
    nameNp: 'विज्ञान तथा प्रविधि',
    nameEn: 'Science & Technology',
    iconName: 'Atom',
    color: 'emerald',
    bgColor: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    descriptionNp: 'भौतिक विज्ञान, रसायन, जीवविज्ञान र प्रविधि'
  },
  {
    id: 'math',
    nameNp: 'गणित',
    nameEn: 'Mathematics',
    iconName: 'Calculator',
    color: 'blue',
    bgColor: 'bg-blue-50 border-blue-200 text-blue-800',
    descriptionNp: 'अङ्कगणित, बीजगणित, ज्यामिति र नाप'
  },
  {
    id: 'social',
    nameNp: 'सामाजिक अध्ययन',
    nameEn: 'Social Studies',
    iconName: 'Globe',
    color: 'amber',
    bgColor: 'bg-amber-50 border-amber-200 text-amber-800',
    descriptionNp: 'नेपालको भूगोल, इतिहास, नागरिक शास्त्र र संस्कृति'
  },
  {
    id: 'english',
    nameNp: 'अंग्रेजी',
    nameEn: 'English',
    iconName: 'BookOpen',
    color: 'indigo',
    bgColor: 'bg-indigo-50 border-indigo-200 text-indigo-800',
    descriptionNp: 'Grammar, Reading Comprehension, Essay & Writing'
  },
  {
    id: 'nepali',
    nameNp: 'नेपाली',
    nameEn: 'Nepali',
    iconName: 'Feather',
    color: 'rose',
    bgColor: 'bg-rose-50 border-rose-200 text-rose-800',
    descriptionNp: 'व्याकरण, शब्दभण्डार, निबन्ध र पाठ्यपुस्तक'
  },
  {
    id: 'environment',
    nameNp: 'स्वास्थ्य, शारीरिक तथा वातावरण',
    nameEn: 'Health & Environment',
    iconName: 'HeartPulse',
    color: 'teal',
    bgColor: 'bg-teal-50 border-teal-200 text-teal-800',
    descriptionNp: 'वातावरण संरक्षण, सरसफाइ र स्वास्थ्य'
  },
  {
    id: 'opt_math',
    nameNp: 'ऐच्छिक गणित',
    nameEn: 'Optional Mathematics',
    iconName: 'Binary',
    color: 'purple',
    bgColor: 'bg-purple-50 border-purple-200 text-purple-800',
    descriptionNp: 'त्रिकोणमिति, म्याट्रिक्स र रेखागणित'
  },
  {
    id: 'computer',
    nameNp: 'कम्प्युटर विज्ञान',
    nameEn: 'Computer Science',
    iconName: 'Laptop',
    color: 'sky',
    bgColor: 'bg-sky-50 border-sky-200 text-sky-800',
    descriptionNp: 'कम्प्युटर प्रणाली, साइबर सुरक्षा र प्रोग्रामिङ'
  }
];

export const SAMPLE_QUESTIONS: SampleQuestion[] = [
  // Class 10 Science
  {
    grade: 10,
    subjectId: 'science',
    titleNp: 'गुरुत्वाकर्षण बल (Gravitational Force)',
    questionNp: 'न्युटनको गुरुत्वाकर्षणसम्बन्धी विश्वव्यापी नियम लेख्नुहोस् र यसको गणितीय सूत्र प्रमाणित गर्नुहोस्।',
    questionEn: 'State Newton\'s Universal Law of Gravitation and explain its formula.'
  },
  {
    grade: 10,
    subjectId: 'science',
    titleNp: 'प्रकाश संश्लेषण (Photosynthesis)',
    questionNp: 'बिरुवाले प्रकाश संश्लेषण प्रक्रिया कसरी गर्छन्? यसका लागि के-के चाहिन्छ?',
    questionEn: 'How do plants perform photosynthesis and what are the required elements?'
  },
  {
    grade: 10,
    subjectId: 'science',
    titleNp: 'आवर्त तालिका (Periodic Table)',
    questionNp: 'आधुनिक आवर्त तालिकामा धातु र अधातुहरूको स्थान कहाँ हुन्छ?',
    questionEn: 'Where are metals and non-metals located in the Modern Periodic Table?'
  },

  // Class 10 Math
  {
    grade: 10,
    subjectId: 'math',
    titleNp: 'चक्रवृद्धि ब्याज (Compound Interest)',
    questionNp: 'चक्रवृद्धि ब्याज र साधारण ब्याजमा के फरक छ? उदाहरणसहित बुझाउनुहोस्।',
    questionEn: 'What is the difference between Compound Interest and Simple Interest?'
  },
  {
    grade: 10,
    subjectId: 'math',
    titleNp: 'पिरामिडको क्षेत्रफल (Area of Pyramid)',
    questionNp: 'वर्गआधार भएको पिरामिडको पुरा सतहको क्षेत्रफल निकाल्ने सूत्र के हो?',
    questionEn: 'What is the formula for total surface area of a square-based pyramid?'
  },

  // Class 10 Social
  {
    grade: 10,
    subjectId: 'social',
    titleNp: 'संयुक्त राष्ट्रसंघ (United Nations)',
    questionNp: 'संयुक्त राष्ट्रसंघ (UN) को स्थापना कहिले भयो र यसका मुख्य उद्देश्यहरू के-के हुन्?',
    questionEn: 'When was the United Nations founded and what are its primary objectives?'
  },

  // Class 8 Science & Math (BLE Level)
  {
    grade: 8,
    subjectId: 'science',
    titleNp: 'सजीवहरूको वर्गीकरण (Classification of Living Beings)',
    questionNp: 'मेरुदण्ड भएका र नभएका जनावरहरू बीचका मुख्य फरकहरू के-के हुन्?',
    questionEn: 'What are the key differences between vertebrates and invertebrates?'
  },
  {
    grade: 8,
    subjectId: 'math',
    titleNp: 'पाइथागोरस साध्य (Pythagoras Theorem)',
    questionNp: 'समकोण त्रिभुजमा पाइथागोरस साध्य भनेको के हो? सूत्रसहित स्पष्ट पार्नुहोस्।',
    questionEn: 'What is the Pythagoras Theorem in a right-angled triangle?'
  },

  // Class 5 Level
  {
    grade: 5,
    subjectId: 'science',
    titleNp: 'पदार्थका तीन अवस्था (States of Matter)',
    questionNp: 'ठोस, द्रव र ग्यास पदार्थमा के फरक छ?',
    questionEn: 'What is the difference between solid, liquid, and gas?'
  },
  {
    grade: 5,
    subjectId: 'social',
    titleNp: 'नेपालका भूगोल (Geography of Nepal)',
    questionNp: 'नेपाललाई कतिवटा धरातलीय स्वरूपमा विभाजन गरिएको छ?',
    questionEn: 'How many geographical regions is Nepal divided into?'
  },

  // Class 3 / Junior Level
  {
    grade: 3,
    subjectId: 'science',
    titleNp: 'हाम्रो वातावरण (Our Environment)',
    questionNp: 'वातावरण सफा राख्न हामीले के-के गर्नुपर्छ?',
    questionEn: 'What should we do to keep our environment clean?'
  }
];

export const QUICK_CHEATSHEETS = [
  {
    subjectId: 'science',
    titleNp: 'विज्ञान मुख्य सूत्र र नियमहरू (Science Formulae & Laws)',
    items: [
      { name: 'गुरुत्वाकर्षण बल (F)', formula: 'F = G × (m1 × m2) / d²' },
      { name: 'गुरुत्वप्रवेग (g)', formula: 'g = G × M / R² (पृथ्वीमा g ≈ 9.8 m/s²)' },
      { name: 'ओमको नियम (Ohm\'s Law)', formula: 'V = I × R' },
      { name: 'सामर्थ्य (Power)', formula: 'P = W / t = V × I' }
    ]
  },
  {
    subjectId: 'math',
    titleNp: 'गणित मुख्य सूत्रहरू (Math Cheat Sheet)',
    items: [
      { name: 'वर्गको क्षेत्रफल (Area of Square)', formula: 'A = l²' },
      { name: 'वृत्तको क्षेत्रफल (Area of Circle)', formula: 'A = π × r²' },
      { name: 'साधारण ब्याज (SI)', formula: 'I = (P × T × R) / 100' },
      { name: 'पाइथागोरस साध्य (Pythagoras Theorem)', formula: 'h² = p² + b²' }
    ]
  },
  {
    subjectId: 'nepali',
    titleNp: 'नेपाली व्याकरण मुख्य नियम (Nepali Grammar Quick Rules)',
    items: [
      { name: 'पदवर्ग (Parts of Speech)', formula: 'नाम, सर्वनाम, विशेषण, क्रियापद, अव्यय' },
      { name: 'कारक र विभक्ति (Cases)', formula: 'प्रथमा (ले, बाट), द्वितीया (लाई), तृतीया (ले, द्वारा)' },
      { name: 'समानार्थी शब्द (Synonyms)', formula: 'सूर्य = भानु/दिनकर, पानी = जल/नीर' }
    ]
  }
];
