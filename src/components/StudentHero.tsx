import React, { useState } from 'react';
import { Camera, Sparkles, ArrowLeft, BookOpen, CheckCircle, Search, HelpCircle, Flame } from 'lucide-react';
import { GradeLevel } from '../types';

interface StudentHeroProps {
  onQuickAsk: (question: string, subject: string) => void;
  onOpenPhotoSolver: () => void;
  selectedGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
}

export const StudentHero: React.FC<StudentHeroProps> = ({
  onQuickAsk,
  onOpenPhotoSolver,
  selectedGrade,
  onSelectGrade,
}) => {
  const [query, setQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('الرياضيات');

  const sampleQuestions = [
    { text: 'كيف أشتق y = sin(3x² + 5) بقاعدة السلسلة؟', subject: 'الرياضيات' },
    { text: 'ما الفرق بين التصادم المرن وعديم المرونة في الزخم الخطي؟', subject: 'الفيزياء' },
    { text: 'كيف أحدد الزوج المترافق وفق برونستد-لوري في NH₃ + H₂O؟', subject: 'الكيمياء' },
    { text: 'ما إعراب المتعجب منه في صيغة ما أفعله؟', subject: 'اللغة العربية' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onQuickAsk(query, selectedSubject);
  };

  return (
    <div className="relative overflow-hidden bg-white border-b border-slate-200">
      {/* Background Subtle Mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/40 via-white to-slate-50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Top 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Column 1: Core Action & Pitch (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              {/* Unboxed Metadata Header */}
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-3">
                <span>المملكة الأردنية الهاشمية</span>
                <span aria-hidden="true">·</span>
                <span>المناهج المعتمدة 2025/2026</span>
                <span aria-hidden="true">·</span>
                <span>الذكاء الاصطناعي التربوي التفاعلي</span>
              </div>

              {/* Main Headline with balanced wrap */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.2] mb-3 text-balance">
                معلّمي: افهمها بطريقتك، <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 to-teal-700">
                  وتعلّمها بثقتك.
                </span>
              </h1>

              {/* Sub-paragraph */}
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                المنصة التعليمية الأولى المصممة خصيصاً للطلبة والمعلمين في الأردن. 
                اطرح أي مسألة، أو صوّر تمرين كتاب الوزارة بكاميرتك، واحصل على شرح خطوة بخطوة باللهجة الأردنية أو الفصحى مع كشف الأخطاء المفاهيمية.
              </p>
            </div>

            {/* Grade Selector & Subject Row */}
            <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                <span className="font-semibold text-slate-800">اختر صفك الدراسي:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => onSelectGrade('tawjihi_sci')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      selectedGrade === 'tawjihi_sci'
                        ? 'bg-emerald-800 text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    توجيهي علمي (2008 / 2007)
                  </button>
                  <button
                    onClick={() => onSelectGrade('tawjihi_lit')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      selectedGrade === 'tawjihi_lit'
                        ? 'bg-emerald-800 text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    توجيهي أدبي
                  </button>
                  <button
                    onClick={() => onSelectGrade('grade11_sci')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      selectedGrade === 'grade11_sci'
                        ? 'bg-emerald-800 text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    أول ثانوي
                  </button>
                  <button
                    onClick={() => onSelectGrade('grade10')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      selectedGrade === 'grade10'
                        ? 'bg-emerald-800 text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    الصف العاشر
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Ask & Photo Input Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="اكتب أي مسألة أو استفسار في الرياضيات، الفيزياء، الكيمياء، النحو..."
                  className="w-full pl-36 pr-4 py-3.5 bg-white rounded-xl border border-slate-300 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 text-slate-900 text-sm placeholder:text-slate-500 shadow-sm transition-all"
                />
                <div className="absolute left-2 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={onOpenPhotoSolver}
                    className="p-2 text-slate-600 hover:text-emerald-800 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                    title="التقاط أو رفع صورة مسألة من الكتاب"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <span>افهمها الآن</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Sample Questions Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs text-slate-500">
                <span className="shrink-0 text-slate-600 font-medium">أمثلة سريعة:</span>
                {sampleQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQuery(q.text);
                      setSelectedSubject(q.subject);
                    }}
                    className="shrink-0 px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg text-slate-700 transition-colors text-right"
                  >
                    {q.text}
                  </button>
                ))}
              </div>
            </form>
          </div>

          {/* Column 2: Inspiring Visual Anchor (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-lg h-full min-h-[300px] lg:min-h-[380px] group">
              <img
                src="/src/assets/images/hero_muallemi_education_1792496237857.jpg"
                alt="طالبة أردنية تدرس الرياضيات والفيزياء باستخدام منصة معلّمي في عمّان"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                onError={(e) => {
                  // Fallback container if image fails
                  e.currentTarget.style.display = 'none';
                }}
              />
              {/* Bottom Scrim with Verified Badge */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent flex flex-col justify-end p-5 text-white">
                <div className="flex items-center gap-2 mb-1.5 text-xs text-emerald-300 font-semibold">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>معتمد ومطابق لأحدث طبعات المناهج الأردنية</span>
                </div>
                <h3 className="text-lg font-bold">
                  تعلّم بلا تعقيد، وبخطوات واضحة تغنيك عن التلقين
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  من كتاب كولنز العلمي إلى مهارات الاتصال وتاريخ الأردن، رفيقك في طريق التميز بالثانوية العامة.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Proof & Features Strip below hero */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-200 text-right">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-emerald-800">01. المناهج المعتمدة</p>
            <h4 className="text-sm font-bold text-slate-900">مقررات وزارة التربية الأردنية</h4>
            <p className="text-xs text-slate-500">توثيق أرقام الصفحات والوحدات من كتب الطالب الرسمية.</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-emerald-800">02. حل بالصور OCR</p>
            <h4 className="text-sm font-bold text-slate-900">صوّر مسألتك الذكي</h4>
            <p className="text-xs text-slate-500">استخراج المعادلات والرسومات البيانية وحلها خطوة بخطوة.</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-emerald-800">03. الفارق الجوهري</p>
            <h4 className="text-sm font-bold text-slate-900">محلّل الأخطاء الذكي</h4>
            <p className="text-xs text-slate-500">يميز الخطأ المفاهيمي عن زلة الإشارة أو الحساب البسيط.</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-emerald-800">04. غرف المعلمين</p>
            <h4 className="text-sm font-bold text-slate-900">تحضير الدروس والتقارير</h4>
            <p className="text-xs text-slate-500">رصد المفاهيم التي تحتاج إعادة شرح ومساندة شعبك الصفية.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
