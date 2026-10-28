import React, { useState, useEffect } from 'react';
import { UserRole, GradeLevel } from './types';
import { Navbar } from './components/Navbar';
import { StudentHero } from './components/StudentHero';
import { AskMuallemiTab } from './components/AskMuallemiTab';
import { PhotoSolverTab } from './components/PhotoSolverTab';
import { MistakeDetectorTab } from './components/MistakeDetectorTab';
import { CurriculumBrowserTab } from './components/CurriculumBrowserTab';
import { PracticeExamTab } from './components/PracticeExamTab';
import { DailyStreakWidget } from './components/DailyStreakWidget';
import { StudyPlannerTab } from './components/StudyPlannerTab';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ParentDashboard } from './components/ParentDashboard';
import { AccessibilityModal } from './components/AccessibilityModal';
import { AuthModal } from './components/AuthModal';
import { OmniAiDrawer } from './components/OmniAiDrawer';
import { auth } from './firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { 
  Sparkles, Camera, AlertTriangle, BookOpen, Award, Calendar, 
  ArrowLeft, ShieldCheck, WifiOff 
} from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('tawjihi_sci');
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [initialAskQuestion, setInitialAskQuestion] = useState('');
  const [initialAskSubject, setInitialAskSubject] = useState('الرياضيات');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleQuickAsk = (questionText: string, subjectName: string) => {
    setInitialAskQuestion(questionText);
    setInitialAskSubject(subjectName);
    setActiveTab('ask');
  };

  const handleLessonSelectedForAsk = (lessonTitle: string, subjectName: string) => {
    setInitialAskQuestion(`اشرح لي بالتفصيل درس "${lessonTitle}" مبيناً أهم القوانين والنتاجات وحل مثال نموذجي من كتاب الوزارة.`);
    setInitialAskSubject(subjectName);
    setActiveTab('ask');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Network / Connectivity Status Bar if offline */}
      {!isOnline && (
        <div className="bg-amber-600 text-white text-xs font-semibold py-1 px-4 text-center flex items-center justify-center gap-2">
          <WifiOff className="w-3.5 h-3.5" />
          <span>أنت تعمل حالياً في وضع عدم الاتصال (Offline) - يمكنك مراجعة الدروس وحل التمارين المخزنة محلياً.</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAccessibility={() => setIsAccessibilityOpen(true)}
        streakCount={4}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20">
        {/* STUDENT VIEWS */}
        {currentRole === 'student' && (
          <>
            {activeTab === 'dashboard' && (
              <div className="space-y-12">
                {/* Hero section */}
                <StudentHero
                  onQuickAsk={handleQuickAsk}
                  onOpenPhotoSolver={() => setActiveTab('photo')}
                  selectedGrade={selectedGrade}
                  onSelectGrade={setSelectedGrade}
                />

                {/* Main Feature Cards Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-right mb-6">
                    <span className="text-xs font-bold text-emerald-800">
                      محطات التعلم الذكية
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                      كل ما تحتاجه للتميز في المناهج الأردنية
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {/* Card 1: Ask Muallemi */}
                    <div
                      onClick={() => setActiveTab('ask')}
                      className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group space-y-3"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-900">
                        اسأل معلّمي - الشرح خطوة بخطوة
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        اختر لهجتك المفضلة (الأردنية أو الفصحى) واحصل على تفكيك كامل للمسألة مع القواعد الذهبية والعلة المنهجية.
                      </p>
                      <div className="pt-2 flex items-center gap-1 text-xs font-bold text-emerald-800">
                        <span>ابدأ السؤال الآن</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Card 2: Photo Solver */}
                    <div
                      onClick={() => setActiveTab('photo')}
                      className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group space-y-3"
                    >
                      <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Camera className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-900">
                        صوّر سؤالك الذكي (OCR)
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        التقط صورة لتمرين كتاب كولنز أو ورقة العمل بكاميرا هاتفك ليتم استخراج المسألة ورسمها وحلها فوراً.
                      </p>
                      <div className="pt-2 flex items-center gap-1 text-xs font-bold text-teal-800">
                        <span>صوّر المسألة</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Card 3: The Mistake Detector */}
                    <div
                      onClick={() => setActiveTab('mistake')}
                      className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group space-y-3"
                    >
                      <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-900">
                        محلّل الأخطاء الذكي
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        اكتشف لماذا كان جوابك غير دقيق: هل هو سوء فهم مفاهيمي أم زلة إشارة حسابية؟ مع تدريب مصغر للعلاج.
                      </p>
                      <div className="pt-2 flex items-center gap-1 text-xs font-bold text-rose-800">
                        <span>شخّص خطأك</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Card 4: Curriculum Browser */}
                    <div
                      onClick={() => setActiveTab('curriculum')}
                      className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group space-y-3"
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-900">
                        موادي وفهرس المنهاج الأردني
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        تصفح وحدات وكتب الوزارة المعتمدة لعام 2025/2026، واطلع على نتاجات كل درس وأرقام الصفحات بدقة.
                      </p>
                      <div className="pt-2 flex items-center gap-1 text-xs font-bold text-indigo-800">
                        <span>تصفح المنهاج</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Card 5: Practice & Exam Bank */}
                    <div
                      onClick={() => setActiveTab('practice')}
                      className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group space-y-3"
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Award className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-900">
                        تدريبي وامتحانات التوجيهي
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        بنك أسئلة موضوعية ومقالية مع توليد نماذج امتحانية ذكية تحاكي نمط اختبارات الثانوية العامة الوزارية.
                      </p>
                      <div className="pt-2 flex items-center gap-1 text-xs font-bold text-amber-800">
                        <span>ابدأ تدريبك</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Card 6: Study Planner */}
                    <div
                      onClick={() => setActiveTab('planner')}
                      className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group space-y-3"
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-slate-950">
                        خطتي الدراسية ومؤقت الامتحانات
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        العد التنازلي للتوجيهي مع تقسيم جلسات المراجعة إلى فترات تركيز واستراحة مع إعطاء الأولوية للأخطاء السابقة.
                      </p>
                      <div className="pt-2 flex items-center gap-1 text-xs font-bold text-slate-800">
                        <span>عرض الخطة</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Demonstration Walkthrough Banner (Section 23 in Prompt) */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="p-6 rounded-2xl bg-emerald-950 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-1 text-right">
                      <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                        <ShieldCheck className="w-4 h-4" />
                        <span>بيئة العرض التوضيحية المعتمدة (Demo Mode)</span>
                      </div>
                      <h3 className="text-lg font-bold">
                        جرب مسار الطالب والمعلم الكامل في 3 خطوات
                      </h3>
                      <p className="text-xs text-slate-300 max-w-xl">
                        1. اسأل معلّمي أو صوّر مسألة ➔ 2. حل تدريب التحقق ➔ 3. انتقل لوضع المعلم لمشاهدة النتائج التراكمية والشعب الصفية.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => {
                          setInitialAskQuestion('كيف نطبق قاعدة السلسلة في اشتقاق الاقتران f(x) = (3x² - 1)⁵؟');
                          setInitialAskSubject('الرياضيات');
                          setActiveTab('ask');
                        }}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        تجربة سؤال نموذجي
                      </button>
                      <button
                        onClick={() => setCurrentRole('teacher')}
                        className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors"
                      >
                        عرض لوحة المعلم
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ask' && (
              <AskMuallemiTab
                initialQuestion={initialAskQuestion}
                initialSubject={initialAskSubject}
                selectedGrade={selectedGrade}
              />
            )}

            {activeTab === 'photo' && (
              <PhotoSolverTab selectedGrade={selectedGrade} />
            )}

            {activeTab === 'mistake' && <MistakeDetectorTab />}

            {activeTab === 'curriculum' && (
              <CurriculumBrowserTab
                onSelectLessonForAsk={handleLessonSelectedForAsk}
                selectedGrade={selectedGrade}
                onSelectGrade={setSelectedGrade}
              />
            )}

            {activeTab === 'practice' && (
              <PracticeExamTab selectedGrade={selectedGrade} />
            )}

            {activeTab === 'streak' && <DailyStreakWidget />}

            {activeTab === 'planner' && <StudyPlannerTab />}
          </>
        )}

        {/* TEACHER VIEWS */}
        {currentRole === 'teacher' && <TeacherDashboard />}

        {/* ADMIN VIEWS */}
        {currentRole === 'admin' && <AdminDashboard />}

        {/* PARENT VIEWS */}
        {currentRole === 'parent' && <ParentDashboard />}
      </main>

      {/* Floating Omni AI Drawer Button for Students */}
      <OmniAiDrawer selectedGrade={selectedGrade} />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">معلّمي | MUALLEMI AI</span>
            <span>—</span>
            <span>منصة المناهج الأردنية الذكية</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-slate-400">طبعة المناهج 2025/2026</span>
            <button
              onClick={() => setIsAccessibilityOpen(true)}
              className="hover:text-slate-900 transition-colors"
            >
              خيارات الشمولية
            </button>
            <span className="text-emerald-800 font-semibold">افهمها بطريقتك، وتعلّمها بثقتك.</span>
          </div>
        </div>
      </footer>

      {/* Accessibility Modal */}
      <AccessibilityModal
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        userRole={currentRole}
        onRoleChange={setCurrentRole}
        selectedGrade={selectedGrade}
        onGradeChange={setSelectedGrade}
      />
    </div>
  );
}
