import React, { useState, useRef } from 'react';
import { Camera, Upload, RotateCw, Crop, CheckCircle, RefreshCw, BookOpen, Volume2, Sparkles, ArrowRight, AlertCircle, Edit3 } from 'lucide-react';
import { SAMPLE_TEXTBOOK_PHOTOS } from '../data/curriculumData';
import { StructuredExplanation, GradeLevel } from '../types';

interface PhotoSolverTabProps {
  selectedGrade: GradeLevel;
}

export const PhotoSolverTab: React.FC<PhotoSolverTabProps> = ({ selectedGrade }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    '/src/assets/images/photo_solver_action_1792496256546.jpg'
  );
  const [rotation, setRotation] = useState(0);
  const [studentNotes, setStudentNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [editableText, setEditableText] = useState('');
  const [isEditingText, setIsEditingText] = useState(false);
  const [diagramDescription, setDiagramDescription] = useState<string | null>(null);
  const [solution, setSolution] = useState<StructuredExplanation | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 15 ميغابايت.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setSolution(null);
      setExtractedText(null);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: typeof SAMPLE_TEXTBOOK_PHOTOS[0]) => {
    setSelectedImage('/src/assets/images/photo_solver_action_1792496256546.jpg');
    setStudentNotes(`تمرين من ${sample.source}: ${sample.title} (${sample.instruction})`);
    setSolution(null);
    setExtractedText(null);
    setErrorMsg(null);
  };

  const rotateImage = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleSolvePhoto = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/ai/photo-solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          studentNotes: editableText || studentNotes,
          subject: 'الرياضيات والعلوم',
          grade: selectedGrade === 'tawjihi_sci' ? 'التوجيهي العلمي' : 'المرحلة الثانوية',
          style: 'jordanian',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setExtractedText(data.extractedText);
        setEditableText(data.extractedText);
        setDiagramDescription(data.diagramDescription);
        setSolution(data.structured);
      } else {
        throw new Error(data.error || 'تعذر تحليل صورة المسألة');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء معالجة الصورة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-800" />
              <span>صوّر سؤالك الذكي - القارئ المتعدد الوسائط</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              التقط صورة لتمارين كتاب الوزارة أو الدوسيات الأردنية، وسيقوم معلّمي بقراءة المسألة وحلها بالتفصيل.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <Upload className="w-4 h-4" />
              <span>رفع صورة من الجهاز أو الكاميرا</span>
            </button>
          </div>
        </div>

        {/* Quick Samples from Jordanian Curriculum */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="text-xs font-semibold text-slate-600 mb-2">
            أو جرب نموذجاً جاهزاً من أسئلة كتب التوجيهي الوزارية المعتمدة:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {SAMPLE_TEXTBOOK_PHOTOS.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className="p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 bg-slate-50 text-right transition-all group"
              >
                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                  {sample.title}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">{sample.source}</div>
                <div className="text-[10px] font-mono text-emerald-800 mt-1 dir-ltr text-right">
                  {sample.equation}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main 2-Zone Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left/Top Zone: Image Preview & Interactive Controls (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
            <span className="font-bold text-slate-800">معاينة الصورة والتحكم</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={rotateImage}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                title="تدوير الصورة 90 درجة"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Image Display Container with simulated scan overlay */}
          <div className="relative rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center min-h-[320px] max-h-[460px] border border-slate-200 group">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="مسألة الكتاب المدرسي المصورة"
                style={{ transform: `rotate(${rotation}deg)` }}
                className="max-h-[440px] w-auto object-contain transition-transform duration-300"
              />
            ) : (
              <div className="text-center p-8 text-slate-400">
                <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-xs">لم يتم اختيار صورة بعد</p>
              </div>
            )}

            {/* Scanning Focus Box Simulation */}
            {loading && (
              <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center text-white space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
                <div className="text-xs font-semibold">جارٍ استخراج الرموز والمعادلات وقراءة المسألة...</div>
                <div className="w-48 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-emerald-500 animate-pulse" />
                </div>
              </div>
            )}
          </div>

          {/* Student Notes / Extra Context */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              ملاحظة إضافية للمعلم الذكي (اختياري):
            </label>
            <input
              type="text"
              value={studentNotes}
              onChange={(e) => setStudentNotes(e.target.value)}
              placeholder="مثال: ركز لي على إشارة السالب في الفرع ب..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-emerald-700 focus:outline-none"
            />
          </div>

          <button
            onClick={handleSolvePhoto}
            disabled={loading || !selectedImage}
            className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>معلّمي يحلل الصورة...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>قراءة السؤال وحله خطوة بخطوة</span>
              </>
            )}
          </button>
        </div>

        {/* Right/Bottom Zone: Extracted Text & Step-by-Step Solution (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Extracted Text Confirmation Box */}
          {extractedText && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  <span>النص والمعادلات المستخرجة من الصورة (OCR):</span>
                </div>
                <button
                  onClick={() => setIsEditingText(!isEditingText)}
                  className="text-xs text-slate-500 hover:text-emerald-800 flex items-center gap-1 font-semibold"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditingText ? 'تم التصحيح' : 'تصحيح الرموز يدوياً'}</span>
                </button>
              </div>

              {isEditingText ? (
                <textarea
                  rows={3}
                  value={editableText}
                  onChange={(e) => setEditableText(e.target.value)}
                  className="w-full p-2.5 text-xs font-mono bg-slate-50 border border-emerald-300 rounded-lg focus:outline-none"
                />
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 leading-relaxed font-mono">
                  {editableText}
                </div>
              )}

              {diagramDescription && (
                <div className="text-[11px] text-slate-600 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200">
                  📊 <strong>ملاحظة حول الرسم:</strong> {diagramDescription}
                </div>
              )}
            </div>
          )}

          {/* Solution Render */}
          {solution ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
              {/* Solution Title */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs text-emerald-800 font-bold">الحل المنهجي الكامل</span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">{solution.concept}</h3>
                </div>
                {solution.sourceReference && (
                  <div className="text-left">
                    <span className="text-[11px] text-slate-500 block">
                      {solution.sourceReference.bookName}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-800">
                      الوحدة الأولى · ص {solution.sourceReference.pageNumber}
                    </span>
                  </div>
                )}
              </div>

              {/* Solution Steps */}
              <div className="space-y-3">
                {solution.solutionSteps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-right"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">
                        {step.stepNumber}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{step.title}</h4>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed pr-7">
                      {step.explanation}
                    </p>

                    {step.calculationOrFormula && (
                      <div className="mr-7 p-2 bg-white rounded border border-slate-200 text-xs font-mono font-semibold text-emerald-950 dir-ltr text-left">
                        {step.calculationOrFormula}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Final Answer */}
              <div className="p-4 rounded-xl bg-slate-900 text-white text-right">
                <div className="text-xs text-emerald-400 font-semibold mb-1">الجواب النهائي المعتمد:</div>
                <div className="text-base font-mono font-bold">{solution.finalAnswer}</div>
                {solution.coreRule && (
                  <div className="text-xs text-slate-300 mt-2 pt-2 border-t border-slate-800">
                    💡 <strong>القاعدة المعتمدة:</strong> {solution.coreRule}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl p-8 border border-dashed border-slate-300 text-center space-y-2">
              <Camera className="w-10 h-10 mx-auto text-slate-400" />
              <h4 className="text-sm font-bold text-slate-800">اختر صورة واضغط "قراءة السؤال وحله"</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                يدعم التطبيق الصور الواضحة لكتب وزارة التربية والتعليم والدوسيات وأوراق العمل المدرسية.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
