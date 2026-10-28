import React, { useState } from 'react';
import { MistakeAnalysis } from '../types';
import { AlertTriangle, CheckCircle2, RefreshCw, Sparkles, ArrowRight, BookOpen, HelpCircle } from 'lucide-react';

export const MistakeDetectorTab: React.FC = () => {
  const [questionText, setQuestionText] = useState(
    'أوجد مشتقة y = cos(3x²). ما هو ناتج dy/dx؟'
  );
  const [correctAnswer, setCorrectAnswer] = useState(
    'dy/dx = -6x · sin(3x²)'
  );
  const [studentAttempt, setStudentAttempt] = useState(
    'dy/dx = 6x · sin(3x²)'
  );
  const [subject, setSubject] = useState('الرياضيات العلمي');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<MistakeAnalysis | null>(null);
  const [microDrillAnswer, setMicroDrillAnswer] = useState<number | null>(null);
  const [microDrillFeedback, setMicroDrillFeedback] = useState<string | null>(null);

  // Common preset misconception scenarios in Jordanian curriculum
  const presetMistakes = [
    {
      title: 'إشارة مشتقة جيب التمام cos(x)',
      subject: 'الرياضيات العلمي',
      question: 'أوجد مشتقة y = cos(3x²)',
      correct: 'dy/dx = -6x · sin(3x²)',
      attempt: 'dy/dx = 6x · sin(3x²)',
      label: 'نسيان إشارة السالب'
    },
    {
      title: 'الزخم الخطي والسرعة المتجهة',
      subject: 'الفيزياء',
      question: 'كرتان اصطدمتا وجهاً لوجه: الأولى بسرعة 4m/s شرقاً والثانية بسرعة 3m/s غرباً. احسب الزخم الكلي للنظام.',
      correct: 'P_total = m1(4) - m2(3) [الاتجاه نحو الغرب سالب]',
      attempt: 'P_total = m1(4) + m2(3) = جمع عددي بسيط',
      label: 'خلط بين الكمية القياسية والمتجهة (مفاهيمي)'
    },
    {
      title: 'الأزواج المترافقة في برونستد-لوري',
      subject: 'الكيمياء',
      question: 'حدد القاعدة المرافقة لحمض H₂SO₄ في تفاعله مع الماء.',
      correct: 'HSO₄⁻ (فقد بروتون H+ واحد)',
      attempt: 'SO₄²⁻ (فقد بروتونين دفعة واحدة)',
      label: 'فقد بروتونين بدل بروتون واحد (مفاهيمي)'
    }
  ];

  const handleAnalyze = async () => {
    if (!questionText.trim() || !studentAttempt.trim()) return;

    setLoading(true);
    setAnalysis(null);
    setMicroDrillAnswer(null);
    setMicroDrillFeedback(null);

    try {
      const response = await fetch('/api/ai/detect-mistake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText,
          correctAnswer,
          studentAnswer: studentAttempt,
          subject,
        }),
      });

      const data = await response.json();
      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (p: typeof presetMistakes[0]) => {
    setQuestionText(p.question);
    setCorrectAnswer(p.correct);
    setStudentAttempt(p.attempt);
    setSubject(p.subject);
    setAnalysis(null);
    setMicroDrillAnswer(null);
    setMicroDrillFeedback(null);
  };

  const handleCheckMicroDrill = (index: number) => {
    if (!analysis) return;
    setMicroDrillAnswer(index);
    if (index === analysis.microDrillQuestion.correctIndex) {
      setMicroDrillFeedback('أحسنت يا بطل! إجابة صحيحة، لقد أغلقت ثغرة الخطأ بنجاح.');
    } else {
      setMicroDrillFeedback('إجابة غير دقيقة، راجع التفسير أدناه وحاول مرة أخرى.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-emerald-800">
          <AlertTriangle className="w-5 h-5" />
          <h2 className="text-xl font-bold text-slate-900">
            محلّل الأخطاء الذكي — الفارق الجوهري في معلّمي
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          بدلاً من مجرد إخبارك بأن إجابتك "خاطئة"، يقوم محلّل الأخطاء بتشريح حلك: هل وقعت في 
          <strong> سوء فهم للمفهوم الأساسي</strong> أم مجرد <strong>انزلاق حسابي في الإشارة أو الأرقام</strong>؟ 
          ثم يمنحك تدريباً فورياً لضمان عدم تكرار الخطأ في الامتحان الوزاري.
        </p>

        {/* Preset Misconception Buttons */}
        <div className="pt-2">
          <span className="text-xs font-semibold text-slate-700 block mb-2">
            نماذج أخطاء شائعة جداً في امتحانات التوجيهي الأردنية (اختر لتجربتها فوراً):
          </span>
          <div className="flex flex-wrap gap-2">
            {presetMistakes.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(p)}
                className="px-3 py-1.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg text-xs font-medium text-slate-700 transition-colors text-right"
              >
                <span>{p.title}</span>
                <span className="text-[10px] text-slate-500 mr-1.5">({p.label})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Workbench */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              نص المسألة أو السؤال:
            </label>
            <textarea
              rows={3}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-emerald-700 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              الإجابة النموذجية المعتمدة (أو اترك لمعلّمي تقديرها):
            </label>
            <textarea
              rows={3}
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-emerald-700 focus:outline-none font-mono"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span>محاولة الطالب / الحل الذي كتبته أو نتيجتك:</span>
            <span className="text-rose-600 text-[11px] font-normal">
              اكتب الخطوات أو النتيجة التي تشك فيها
            </span>
          </label>
          <textarea
            rows={3}
            value={studentAttempt}
            onChange={(e) => setStudentAttempt(e.target.value)}
            placeholder="اكتب خطواتك بالتفصيل، مثل: dy/dx = 6x * sin(3x²)..."
            className="w-full p-3 bg-rose-50/40 border border-rose-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-rose-400 focus:outline-none font-mono"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleAnalyze}
            disabled={loading || !studentAttempt.trim()}
            className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>جارٍ تشخيص نوع الخطأ...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>شخّص خطئي وعلاجه الآن</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Output */}
      {analysis && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          {/* Classification Banner */}
          <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs text-emerald-400 font-semibold block">
                تشخيص محلّل الأخطاء:
              </span>
              <h3 className="text-lg font-bold mt-0.5">
                {analysis.errorClassification}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  analysis.isConceptual
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {analysis.isConceptual ? 'خطأ مفاهيمي يستوجب إعادة المفهوم' : 'خطأ إجرائي / حسابي بسيط'}
              </span>
            </div>
          </div>

          {/* Location & Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-800 block">
                📍 أين وقع الخطأ تحديداً؟
              </span>
              <p className="text-slate-600 leading-relaxed font-mono">
                {analysis.errorLocation}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
              <span className="font-bold text-emerald-950 block">
                💡 كيف تصححه وتتفاداه في الامتحان؟
              </span>
              <p className="text-emerald-900 leading-relaxed">
                {analysis.remedyExplanation}
              </p>
            </div>
          </div>

          {/* Micro-Drill Question */}
          {analysis.microDrillQuestion && (
            <div className="p-5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-700" />
                  تدريب علاجي مصغر (Micro-Drill) لتثبيت الفهم:
                </span>
                <span className="text-[10px] text-amber-800 font-medium">
                  استهدف نقطة الضعف
                </span>
              </div>

              <p className="text-xs sm:text-sm font-bold text-slate-900">
                {analysis.microDrillQuestion.question}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {analysis.microDrillQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCheckMicroDrill(idx)}
                    className={`p-3 rounded-lg border text-right transition-all font-semibold ${
                      microDrillAnswer === idx
                        ? idx === analysis.microDrillQuestion.correctIndex
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                          : 'bg-rose-100 border-rose-500 text-rose-900'
                        : 'bg-white border-amber-200 hover:border-amber-400 text-slate-800'
                    }`}
                  >
                    <span>{opt}</span>
                  </button>
                ))}
              </div>

              {microDrillFeedback && (
                <div
                  className={`p-3 rounded-lg text-xs font-medium ${
                    microDrillAnswer === analysis.microDrillQuestion.correctIndex
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-rose-100 text-rose-900 border border-rose-300'
                  }`}
                >
                  <p>{microDrillFeedback}</p>
                  <p className="text-slate-600 mt-1 font-normal">
                    {analysis.microDrillQuestion.explanation}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
