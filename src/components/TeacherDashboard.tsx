import React, { useState } from 'react';
import { TeacherClass, TeacherAssignment, LessonPlanOutput } from '../types';
import { School, Users, FileText, CheckCircle, AlertTriangle, Plus, Sparkles, Copy, Printer, RefreshCw, Layers } from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'classes' | 'lesson_planner' | 'reteach'>('classes');

  // Sample Teacher Classes
  const [classes, setClasses] = useState<TeacherClass[]>([
    {
      id: 'cls_1',
      name: 'الصف الثاني عشر (التوجيهي العلمي) - شُعبة أ',
      grade: 'tawjihi_sci',
      subject: 'الفيزياء والرياضيات',
      inviteCode: 'JO-SCI-2026',
      studentCount: 28,
      averageMastery: 78,
      activeAssignmentsCount: 2,
      strugglingConcepts: [
        {
          concept: 'تحديد إشارة السرعة والزخم في التصادمات ثنائية الأبعاد',
          missedPercentage: 42,
          needsReteaching: true,
        },
        {
          concept: 'تطبيق قاعدة السلسلة في الجذور والاقترانات المثلثية المركبة',
          missedPercentage: 35,
          needsReteaching: true,
        },
      ],
    },
    {
      id: 'cls_2',
      name: 'الصف العاشر الأساسي - شُعبة ج',
      grade: 'grade10',
      subject: 'العلوم العامة والفيزياء',
      inviteCode: 'JO-G10-449',
      studentCount: 31,
      averageMastery: 84,
      activeAssignmentsCount: 1,
      strugglingConcepts: [
        {
          concept: 'حساب الشغل والطاقة الحركية',
          missedPercentage: 18,
          needsReteaching: false,
        },
      ],
    },
  ]);

  // Lesson Planner State
  const [plannerGrade, setPlannerGrade] = useState('الصف الثاني عشر (التوجيهي العلمي)');
  const [plannerSubject, setPlannerSubject] = useState('الفيزياء');
  const [plannerLesson, setPlannerLesson] = useState('الزخم الخطي والتصادمات غير المرنة');
  const [plannerDuration, setPlannerDuration] = useState(45);
  const [teachingStyle, setTeachingStyle] = useState('الاستقصاء وحل المشكلات التشاركي');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<LessonPlanOutput | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Assignment Modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [newAssignTitle, setNewAssignTitle] = useState('');
  const [newAssignDueDate, setNewAssignDueDate] = useState('2026-10-28');

  const handleGenerateLessonPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingPlan(true);

    try {
      const response = await fetch('/api/ai/lesson-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: plannerGrade,
          subject: plannerSubject,
          lesson: plannerLesson,
          duration: plannerDuration,
          teachingStyle,
        }),
      });

      const data = await response.json();
      if (data.success && data.plan) {
        setGeneratedPlan(data.plan);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleCopyPlan = () => {
    if (!generatedPlan) return;
    const planText = `خطة درس: ${generatedPlan.title}\nالمبحث: ${generatedPlan.subject} - الصف: ${generatedPlan.grade}\n\nالنتاجات:\n${generatedPlan.learningObjectives.join('\n')}\n\nالتهيئة الحافزة:\n${generatedPlan.hookIntroduction}\n\nالعرض وخطوات التدريس:\n${generatedPlan.stepByStepExplanation.map((s) => `${s.title}: ${s.content} (${s.durationMin} دقيقة)`).join('\n')}\n\nالتقويم التكويني:\n${generatedPlan.formativeAssessmentQuestions.join('\n')}\n\nالواجب البيتي:\n${generatedPlan.homeworkTask}`;
    navigator.clipboard.writeText(planText);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Teacher Top Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
              <span>بوابة المعلم الأردني</span>
              <span aria-hidden="true">·</span>
              <span>إدارة الشُعب والواجبات المنهجية</span>
              <span aria-hidden="true">·</span>
              <span>تحضير الدروس الذكي</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <School className="w-5 h-5 text-emerald-800" />
              <span>لوحة المعلم ومساعد التدريس الذكي</span>
            </h2>
          </div>

          {/* Sub-tab Navigation */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveSubTab('classes')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeSubTab === 'classes'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              شُعبي والواجبات
            </button>
            <button
              onClick={() => setActiveSubTab('lesson_planner')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeSubTab === 'lesson_planner'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              مساعد تحضير الدروس
            </button>
            <button
              onClick={() => setActiveSubTab('reteach')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeSubTab === 'reteach'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              مفاهيم تحتاج إعادة شرح
            </button>
          </div>
        </div>
      </div>

      {/* Subtab 1: Classes & Assignments */}
      {activeSubTab === 'classes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{cls.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{cls.subject}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-mono font-bold border border-emerald-200">
                    رمز الانضمام: {cls.inviteCode}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl text-center text-xs">
                  <div>
                    <div className="font-bold text-slate-900 font-mono text-base">
                      {cls.studentCount}
                    </div>
                    <div className="text-slate-500 text-[11px]">طالباً مسجلاً</div>
                  </div>
                  <div className="border-x border-slate-200">
                    <div className="font-bold text-emerald-800 font-mono text-base">
                      %{cls.averageMastery}
                    </div>
                    <div className="text-slate-500 text-[11px]">متوسط الإتقان</div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 font-mono text-base">
                      {cls.activeAssignmentsCount}
                    </div>
                    <div className="text-slate-500 text-[11px]">واجبات نشطة</div>
                  </div>
                </div>

                {/* Quick Reteach Alert if present */}
                {cls.strugglingConcepts.filter((c) => c.needsReteaching).length > 0 && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-1">
                    <div className="font-bold text-rose-800 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>تنبيه تربوي: مفاهيم تحتاج إعادة تدريس للشعبة</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      {cls.strugglingConcepts[0].concept} (أخطأ فيه{' '}
                      {cls.strugglingConcepts[0].missedPercentage}% من الطلاب).
                    </p>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">تم تحديث النتائج اليوم</span>
                  <button
                    onClick={() => setShowAssignModal(true)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إسناد واجب جديد للشعبة</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 2: AI Lesson Planner for Teachers */}
      {activeSubTab === 'lesson_planner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs Form (4 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-800" />
              <span>إعداد خطة درس نموذجية</span>
            </h3>

            <form onSubmit={handleGenerateLessonPlan} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">المبحث:</label>
                <input
                  type="text"
                  value={plannerSubject}
                  onChange={(e) => setPlannerSubject(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">الصف والمرحلة:</label>
                <input
                  type="text"
                  value={plannerGrade}
                  onChange={(e) => setPlannerGrade(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">عنوان الدرس:</label>
                <input
                  type="text"
                  value={plannerLesson}
                  onChange={(e) => setPlannerLesson(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">المدة (دقائق):</label>
                  <input
                    type="number"
                    value={plannerDuration}
                    onChange={(e) => setPlannerDuration(parseInt(e.target.value, 10))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">استراتيجية التدريس:</label>
                  <input
                    type="text"
                    value={teachingStyle}
                    onChange={(e) => setTeachingStyle(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isGeneratingPlan}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-xl font-bold shadow-sm transition-all flex items-center justify-center gap-2 mt-4"
              >
                {isGeneratingPlan ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جارٍ توليد خطة الدرس النموذجية...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>توليد خطة الدرس بالذكاء الاصطناعي</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Generated Plan Output (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {generatedPlan ? (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5 text-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] text-emerald-800 font-bold block">
                      مسودة خطة درس (متوافقة مع سجلات الإشراف التربوي)
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{generatedPlan.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyPlan}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedSuccess ? 'تم النسخ!' : 'نسخ الخطة'}</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>طباعة الخطة</span>
                    </button>
                  </div>
                </div>

                {/* Objectives */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-emerald-900">النتاجات التعليمية المستهدفة:</h4>
                  <ul className="text-xs text-slate-700 space-y-1 pr-4 list-disc">
                    {generatedPlan.learningObjectives.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>

                {/* Hook Introduction */}
                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 text-xs space-y-1">
                  <strong className="text-emerald-950 block">التهيئة الحافزة (سؤال الانطلاق):</strong>
                  <p className="text-slate-700 leading-relaxed">{generatedPlan.hookIntroduction}</p>
                </div>

                {/* Steps Sequence */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800">سير الحصة والأنشطة التدريسية:</h4>
                  {generatedPlan.stepByStepExplanation.map((step, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{step.title}</span>
                        <span className="text-slate-500 font-mono text-[11px]">{step.durationMin} دقيقة</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{step.content}</p>
                    </div>
                  ))}
                </div>

                {/* Differentiated Support */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1">
                    <strong className="text-amber-900 block">دعم الطلبة ذوي الصعوبة:</strong>
                    <p className="text-slate-700">{generatedPlan.differentiatedSupport.strugglingStudents}</p>
                  </div>
                  <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200 space-y-1">
                    <strong className="text-teal-900 block">إثراء الطلبة المتميزين:</strong>
                    <p className="text-slate-700">{generatedPlan.differentiatedSupport.advancedStudents}</p>
                  </div>
                </div>

                {/* Homework Task */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <strong className="text-slate-800 block">الواجب البيتي المقترح:</strong>
                  <p className="text-slate-600 mt-1">{generatedPlan.homeworkTask}</p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl p-8 border border-dashed border-slate-300 text-center space-y-2">
                <FileText className="w-10 h-10 mx-auto text-slate-400" />
                <h4 className="text-sm font-bold text-slate-800">اختر تفاصيل الدرس واضغط "توليد الخطة"</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  يقوم الذكاء الاصطناعي بإعداد خطة درس متوافقة مع معايير وزارة التربية والتعليم الأردنية، جاهزة للطباعة والتعديل.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subtab 3: Reteaching Concepts */}
      {activeSubTab === 'reteach' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                المفاهيم الأكثر خطأً والموصى بإعادة تدريسها
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                تحليل تلقائي لإجابات الطلبة في الشعبتين يحدد أين تكمن نقاط الضعف المفاهيمية.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {classes[0].strugglingConcepts.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 text-sm">{item.concept}</div>
                  <div className="text-slate-500 mt-1">
                    الصف الثاني عشر العلمي · نسبة الخطأ في الاختبار الأخير:{' '}
                    <span className="font-bold text-rose-600 font-mono">
                      %{item.missedPercentage}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setPlannerLesson(item.concept);
                      setActiveSubTab('lesson_planner');
                    }}
                    className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold transition-colors shrink-0"
                  >
                    توليد خطة علاجية لهذا المفهوم
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
