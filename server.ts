import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Helper to safely obtain GoogleGenAI client
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing. Please set it in your secrets/environment.');
  }
  return new GoogleGenAI({ apiKey });
}

// Main Tutor endpoint
app.post('/api/tutor', async (req, res) => {
  try {
    const { grade, subject, question, image, langPreference } = req.body;

    if (!grade || !subject) {
      return res.status(400).json({
        error: 'कृपया कक्षा (Grade) र विषय (Subject) चयन गर्नुहोस्।',
      });
    }

    const questionText = question && question.trim() ? question.trim() : 'कृपया यस तस्विरमा रहेको प्रश्न स्पष्ट बुझिने गरी हल र व्याख्या गरिदिनुहोस्।';

    if (!questionText && !image) {
      return res.status(400).json({
        error: 'कृपया प्रश्न लेख्नुहोस् वा तस्विर खिचेर पठाउनुहोस्।',
      });
    }

    const ai = getGenAI();

    // Determine target language strictly based on subject and user preference
    const subLower = (subject || '').toLowerCase();
    const isEnglishSubject = subLower.includes('english') || subLower.includes('अंग्रेजी');
    const isNepaliSubject = subLower.includes('nepali') || subLower.includes('नेपाली');

    let targetLang: 'English' | 'Nepali' = 'Nepali';

    if (isEnglishSubject) {
      targetLang = 'English';
    } else if (isNepaliSubject) {
      targetLang = 'Nepali';
    } else if (langPreference === 'English') {
      targetLang = 'English';
    } else if (langPreference === 'Nepali') {
      targetLang = 'Nepali';
    } else {
      // Auto mode: check if question text contains Devanagari script (\u0900-\u097F)
      const hasDevanagari = /[\u0900-\u097F]/.test(questionText);
      if (hasDevanagari) {
        targetLang = 'Nepali';
      } else {
        // If query is typed in English alphabet, respond in English
        targetLang = 'English';
      }
    }

    let systemInstruction = '';

    if (targetLang === 'English') {
      systemInstruction = `You are "SikdAI", an expert, friendly, encouraging, and highly patient virtual tutor designed specifically for school students in Nepal studying in Classes 1 to 10 according to the Nepal Curriculum Development Centre (CDC - पाठ्यक्रम विकास केन्द्र) guidelines.

Your task is to answer academic questions based strictly on the Nepal Curriculum Development Centre (CDC) syllabus and textbook standards.

CRITICAL LANGUAGE MANDATE:
- The user is studying/asking for ${isEnglishSubject ? 'English Subject' : subject + ' in English'}.
- You MUST DELIVER THE ENTIRE RESPONSE STRICTLY AND EXCLUSIVELY IN CLEAR, FLUENT, SIMPLE, AND CHILD-FRIENDLY ENGLISH.
- DO NOT output Nepali headings (like "१. सरल उत्तर" or "पहिलो चरण"), Devanagari text, or transliterated phrases.
- Every JSON field, explanation, grammar rule, step heading, practice question, practice answer, and key takeaway MUST be in clean, natural English.

RULES YOU MUST FOLLOW STRICTLY:
1. Formatting "stepByStepExplanation":
   - Format "stepByStepExplanation" STRICTLY as a numbered list (1., 2., 3.) where EACH STEP has a clear, bold English heading.
   - Example format for each step:
     1. **Step 1: Concept & Definition**
        [Explanation in clear English with bullet points]
     2. **Step 2: Key Rules & Grammar / Formula Breakdown**
        [Detailed step-by-step breakdown or LaTeX equations if math/science]
     3. **Step 3: Examples & Practical Application**
        [Clear example sentence or practical usage]
   - Mathematical & Scientific Equations: Format all math/physics/chemistry equations using standard LaTeX ($...$ or $$...$$).

2. JSON Response Structure: Return ONLY a valid JSON object with the following fields:
   - "simpleAnswer": "A clear, direct, and simple answer in friendly English (2-3 sentences max)."
   - "stepByStepExplanation": "A detailed, numbered step-by-step breakdown with bold English step headings, clear Markdown paragraphs, clean LaTeX math, and relatable examples in English."
   - "practiceQuestion": "Exactly ONE quick practice question in English based on this concept for the student to try."
   - "practiceAnswer": "The correct answer and brief explanation for the practice question in English."
   - "keyTakeaways": ["Key Point 1", "Key Point 2", "Key Point 3"] - 3 key bullet points in English for quick revision before exams.
   - "cdcReference": "Reference to Nepal CDC Class ${grade} ${subject} textbook unit/curriculum standard."

3. Tone: Positive, encouraging, clear, and age-appropriate for Class ${grade} students.`;
    } else {
      systemInstruction = `You are "SikdAI" (सिक्दै-AI), an expert, friendly, encouraging, and highly patient virtual tutor designed specifically for school students in Nepal studying in Classes 1 to 10 according to the Nepal Curriculum Development Centre (CDC - पाठ्यक्रम विकास केन्द्र) guidelines.

Your task is to answer academic questions based strictly on the Nepal Curriculum Development Centre (CDC) syllabus and textbook standards.

RULES YOU MUST FOLLOW STRICTLY:
1. Output Language: You MUST DELIVER THE ENTIRE RESPONSE IN CLEAR, SIMPLE, CHILD-FRIENDLY NEPALI (using warm, polite terms like भाइबहिनीहरू, साथी, हजुर). Always include English technical/scientific terms in brackets where helpful (e.g., गुरुत्वाकर्षण (Gravity), कर्ता (Subject), प्रकाश संश्लेषण (Photosynthesis)).
2. Formatting "बुझ्न सजिलो व्याख्या" (Step-by-step Concept Explanation):
   - Format "stepByStepExplanation" STRICTLY as a numbered list (१., २., ३.) where EACH STEP has a clear, bold heading in Nepali.
   - Example format for each step:
     1. **पहिलो चरण: अवधारणा र परिचय (Step 1: Concept & Definition)**
        [Simple Nepali explanation with bullet points]
     2. **दोस्रो चरण: मुख्य नियम र सूत्र (Step 2: Key Rule & Formula)**
        [Detailed breakdown / LaTeX equations]
     3. **तेस्रो चरण: नेपालको स्थानीय उदाहरण (Step 3: Local Example)**
        [Relatable Nepali example]
   - Mathematical & Scientific Equations: Format all math/physics/chemistry equations using standard LaTeX ($...$ or $$...$$).

3. JSON Response Structure: Return ONLY a valid JSON object with the following fields:
   - "simpleAnswer": "सरल उत्तर - A clear, direct, and simple answer in friendly Nepali (2-3 sentences max)."
   - "stepByStepExplanation": "बुझ्न सजिलो व्याख्या - Detailed numbered step-by-step breakdown with bold Nepali step headings, clear Markdown, clean LaTeX math, and relatable Nepali examples."
   - "practiceQuestion": "अभ्यास प्रश्न - Exactly ONE quick practice question in Nepali for the student to try."
   - "practiceAnswer": "अभ्यास प्रश्नको उत्तर - Correct answer and brief explanation in Nepali."
   - "keyTakeaways": ["मुख्य कुरा १", "मुख्य कुरा २", "मुख्य कुरा ३"] - 3 key bullet points in Nepali for quick memory revision.
   - "cdcReference": "नेपाल CDC पाठ्यक्रम सन्दर्भ - Mention Class ${grade} ${subject} CDC textbook unit."

4. Tone: Encouraging, inspiring, and positive!`;
    }

    const prompt = `[STUDENT QUERY]
Class (Grade): Class ${grade}
Subject: ${subject}
Question: ${questionText}
Target Language: ${targetLang}
${image ? '(Note: The student attached a photo of the question. Examine the image carefully and answer the question.)' : ''}

Please deliver your answer strictly in ${targetLang}. For 'stepByStepExplanation', format as numbered steps (1., 2., 3.) with bold headings in ${targetLang}.`;

    let contents: any = prompt;

    if (image && typeof image === 'string') {
      let mimeType = 'image/jpeg';
      let base64Data = image;

      if (image.startsWith('data:')) {
        const matches = image.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
        if (matches) {
          mimeType = matches[1];
          base64Data = matches[2];
        }
      }

      contents = [
        prompt,
        {
          inlineData: {
            mimeType,
            data: base64Data,
          },
        },
      ];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('AI ले कुनै उत्तर सिर्जना गर्न सकेन।');
    }

    const data = JSON.parse(text);
    return res.json(data);
  } catch (err: any) {
    console.error('Error in /api/tutor:', err);
    return res.status(500).json({
      error: err.message || 'उत्तर प्राप्त गर्दा समस्या आयो। कृपया पुन: प्रयास गर्नुहोस्।',
    });
  }
});

// Mini Quiz Generator endpoint
app.post('/api/quiz', async (req, res) => {
  try {
    const { grade, subject, topic } = req.body;
    if (!grade || !subject) {
      return res.status(400).json({ error: 'Grade and subject required.' });
    }

    const ai = getGenAI();

    const systemInstruction = `You are SikdAI Quiz Master for Nepal CDC Curriculum. Generate a 3-question Multiple Choice Quiz (MCQ) in Nepali for Class ${grade} ${subject} on topic "${topic || 'General Overview'}".
Return strictly a JSON object formatted as:
{
  "topicTitle": "शीर्षक",
  "questions": [
    {
      "id": 1,
      "question": "प्रश्न १ (Nepali text with English technical terms in brackets)",
      "options": ["क) विकल्प १", "ख) विकल्प २", "ग) विकल्प ३", "घ) विकल्प ४"],
      "correctIndex": 0,
      "explanation": "व्याख्या (Nepali explanation)"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Generate 3 CDC practice questions for Class ${grade} ${subject} - Topic: ${topic || 'Important Exam Topics'}.`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    if (!text) throw new Error('Quiz generation failed');
    return res.json(JSON.parse(text));
  } catch (err: any) {
    console.error('Error in /api/quiz:', err);
    return res.status(500).json({ error: err.message || 'क्विज सिर्जना गर्न सकिएन।' });
  }
});

// Essay Evaluator & SEE Exam Marking endpoint
app.post('/api/essay-evaluator', async (req, res) => {
  try {
    const { grade, topic, essayText, language } = req.body;
    if (!essayText || !essayText.trim()) {
      return res.status(400).json({ error: 'कृपया निबन्ध वा उत्तरको पाठ लेख्नुहोस्।' });
    }

    const ai = getGenAI();

    const systemInstruction = `You are the Official Nepal CDC Board Essay & Exam Answer Evaluator for Class ${grade || 10}.
Evaluate the provided student essay or long answer based on official CDC terminal exam marking schemes (Total 10 Marks).

Return strictly a JSON object with:
{
  "title": "मूल्याङ्कन शीर्षक",
  "totalScore": 8.5,
  "maxScore": 10,
  "gradeAwarded": "A",
  "cdcAlignmentScore": "९०%",
  "breakdown": {
    "contentAndFacts": "विषयवस्तु र CDC तथ्य (Content & CDC Facts Score /3.5)",
    "languageAndGrammar": "भाषा र व्याकरण शुद्धता (Grammar & Vocabulary /2.5)",
    "structureAndFlow": "ढाँचा र परिच्छेद (Structure & Paragraphing /2.0)",
    "creativityAndExamples": "मौलिकता र उदाहरण (Creativity & Local Examples /2.0)"
  },
  "strengths": ["राम्रो पक्ष १", "राम्रो पक्ष २"],
  "improvements": ["सुधार गर्नुपर्ने कुरा १", "सुधार गर्नुपर्ने कुरा २"],
  "modelCorrection": "सुधारिएको नमुना निबन्ध वा सुझाव (Improved Model Paragraph/Feedback in friendly Nepali)"
}`;

    const prompt = `[ESSAY EVALUATION REQUEST]
कक्षा (Grade): Class ${grade || 10}
विषय/शीर्षक (Topic): ${topic || 'सामान्य निबन्ध/उत्तर'}
भाषा (Language): ${language || 'Nepali'}
विद्यार्थीको उत्तर/निबन्ध (Student Text):
"${essayText}"

कृपया नेपाल CDC बोर्डको अंक विभाजन तालिका अनुसार विस्तृत परीक्षण गरी प्रतिक्रिया दिनुहोस्।`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const text = response.text;
    if (!text) throw new Error('Evaluation failed');
    return res.json(JSON.parse(text));
  } catch (err: any) {
    console.error('Error in /api/essay-evaluator:', err);
    return res.status(500).json({ error: err.message || 'निबन्ध मूल्याङ्कन गर्न सकिएन।' });
  }
});

// Teacher Co-Pilot (Lesson Plan & Exam Question Generator) endpoint
app.post('/api/teacher-copilot', async (req, res) => {
  try {
    const { type, grade, subject, topic } = req.body;
    if (!grade || !subject) {
      return res.status(400).json({ error: 'Class and Subject required.' });
    }

    const ai = getGenAI();

    const systemInstruction = `You are "SikdAI Teacher Co-Pilot", an expert pedagogical assistant for Nepali school teachers following CDC (Curriculum Development Centre) guidelines.

Generate a comprehensive document based on the requested type ("lesson_plan" or "exam_paper").

Return strictly a JSON object formatted as:
{
  "title": "शीर्षक (Title in Nepali)",
  "grade": "${grade}",
  "subject": "${subject}",
  "type": "${type}",
  "summary": "छोटो सारांश",
  "sections": [
    {
      "heading": "भाग शीर्षक (Section Heading)",
      "content": "विस्तृत विवरण (Markdown with bullet points, time breakdown, teacher activities, student activities, learning outcomes, or exam questions with CDC grid mark weightage)."
    }
  ],
  "teacherTip": "शिक्षकका लागि उपयोगी टिप्स (Teacher Pro Tip)"
}`;

    const prompt = `[TEACHER COPILOT REQUEST]
प्रकार (Type): ${type === 'exam_paper' ? 'CDC Terminal Exam Question Paper (विशिष्टीकरण तालिका प्रश्नपत्र)' : '45-Minute CDC Lesson Plan (पाठ योजना)'}
कक्षा (Grade): Class ${grade}
विषय (Subject): ${subject}
शीर्षक/एकाइ (Topic/Unit): ${topic || 'एकाइ आधारित मुख्य पाठ'}

नेपालको शैक्षिक वातावरण र CDC पाठ्यक्रम अनुसार प्रयोग गर्न सकिने गरी पूर्ण पाठ सामग्री तयार पार्नुहोस्।`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const text = response.text;
    if (!text) throw new Error('Teacher Co-Pilot generation failed');
    return res.json(JSON.parse(text));
  } catch (err: any) {
    console.error('Error in /api/teacher-copilot:', err);
    return res.status(500).json({ error: err.message || 'शिक्षक सामाग्री सिर्जना गर्न सकिएन।' });
  }
});

// Serve static assets in production or Vite dev middleware in dev mode
const distPath = path.join(process.cwd(), 'dist');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });
  app.use(vite.middlewares);
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const template = await vite.transformIndexHtml(
        url,
        `<!doctype html>
<html lang="ne">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SikdAI (सिक्दै-AI) - Nepal CDC Virtual Tutor</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Mukta:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body class="bg-slate-50 text-slate-900 font-sans antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
      );
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SikdAI Server running on port ${PORT}`);
});
