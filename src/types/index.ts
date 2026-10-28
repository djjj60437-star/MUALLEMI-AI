export type UserRole = 'student' | 'teacher' | 'admin' | 'parent';

export type ExplanationStyle = 
  | 'jordanian'   // باللهجة الأردنية المحببة ("بكل بساطة وع الترتيب يا بطل")
  | 'simple'      // لغة مبسطة وسهلة
  | 'standard'    // فصحى مدرسية دقيقة
  | 'academic'    // شرح أكاديمي وتفصيلي معمّق
  | 'bilingual';  // ثنائي اللغة (عربي ومصطلحات بالإنجليزية)

export type GradeLevel = 
  | 'grade7'   // الصف السابع
  | 'grade8'   // الصف الثامن
  | 'grade9'   // الصف التاسع
  | 'grade10'  // الصف العاشر
  | 'grade11_sci' // الأول ثانوي العلمي
  | 'grade11_lit' // الأول ثانوي الأدبي
  | 'tawjihi_sci' // التوجيهي العلمي
  | 'tawjihi_lit' // التوجيهي الأدبي
  | 'tawjihi_btec'; // التوجيهي المهني / BTEC

export interface CurriculumSource {
  bookName: string;
  grade: string;
  semester: 'الأول' | 'الثاني';
  editionYear: string;
  unitTitle: string;
  lessonTitle: string;
  pageNumber?: number;
  learningObjective: string;
  isVerified: boolean;
}

export interface CurriculumLesson {
  id: string;
  title: string;
  unitId: string;
  unitTitle: string;
  subjectId: string;
  subjectName: string;
  grade: GradeLevel;
  gradeName: string;
  objectives: string[];
  summaryText: string;
  sourceBook: string;
  pageRange: string;
  verified: boolean;
  sampleQuestionsCount: number;
}

export interface CurriculumSubject {
  id: string;
  name: string;
  icon: string;
  category: 'علمي' | 'أدبي' | 'مشترك' | 'مهني';
  unitsCount: number;
  lessonsCount: number;
  availableGrades: GradeLevel[];
  description: string;
}

export interface ExplanationStep {
  stepNumber: number;
  title: string;
  explanation: string;
  calculationOrFormula?: string;
  ruleExplanation?: string;
}

export interface StructuredExplanation {
  concept: string;
  explanationIntro?: string;
  subject: string;
  gradeEstimated: string;
  solutionSteps: ExplanationStep[];
  finalAnswer: string;
  coreRule: string;
  similarPracticeQuestion?: {
    question: string;
    hint: string;
    answer: string;
    choices?: string[];
  };
  sourceReference?: CurriculumSource;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  styleUsed?: ExplanationStyle;
  structured?: StructuredExplanation;
  imageUrl?: string;
  extractedText?: string;
}

export interface MistakeAnalysis {
  questionText: string;
  correctAnswer: string;
  studentAnswer: string;
  errorClassification: 'سوء فهم للمفهوم الأساسي' | 'خطأ حسابي بسيط' | 'خطأ في الإشارات الرياضية' | 'نسيان وحدة القياس' | 'سوء قراءة لمعطى';
  isConceptual: boolean;
  errorLocation: string;
  remedyExplanation: string;
  microDrillQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface PracticeQuestion {
  id: string;
  subjectId: string;
  unitTitle: string;
  lessonTitle: string;
  grade: GradeLevel;
  difficulty: 'سهل' | 'متوسط' | 'صعب' | 'توجيهي وزارة';
  type: 'mcq' | 'calculation' | 'true_false';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  learningObjective: string;
  sourceReference?: string;
}

export interface DailyStreakData {
  streakDays: number;
  lastCompletedDate: string;
  questionsAnsweredCount: number;
  points: number;
  levelTitle: string;
  badges: Array<{ id: string; title: string; desc: string; icon: string; unlocked: boolean }>;
}

export interface StudyPlanItem {
  id: string;
  subject: string;
  topic: string;
  scheduledTimeMinutes: number;
  date: string;
  completed: boolean;
  priority: 'عالية' | 'متوسطة' | 'مراجعة أخطاء سابقة';
}

export interface TeacherClass {
  id: string;
  name: string;
  grade: GradeLevel;
  subject: string;
  inviteCode: string;
  studentCount: number;
  averageMastery: number;
  activeAssignmentsCount: number;
  strugglingConcepts: Array<{
    concept: string;
    missedPercentage: number;
    needsReteaching: boolean;
  }>;
}

export interface TeacherAssignment {
  id: string;
  classId: string;
  className: string;
  title: string;
  subject: string;
  unit: string;
  dueDate: string;
  totalSubmissions: number;
  totalStudents: number;
  averageScore: number;
  status: 'نشط' | 'منتهي' | 'مسودة';
}

export interface LessonPlanOutput {
  title: string;
  subject: string;
  grade: string;
  durationMinutes: number;
  learningObjectives: string[];
  hookIntroduction: string;
  stepByStepExplanation: Array<{ title: string; content: string; durationMin: number }>;
  classroomActivities: string[];
  formativeAssessmentQuestions: string[];
  differentiatedSupport: {
    strugglingStudents: string;
    advancedStudents: string;
  };
  homeworkTask: string;
  teacherSummary: string;
}
