import React from 'react';
import { Users, CheckCircle, Clock, HeartHandshake, BookOpen, AlertCircle } from 'lucide-react';

export const ParentDashboard: React.FC = () => {
  const studentInfo = {
    name: 'أحمد محمود القضاة',
    grade: 'الصف الثاني عشر (التوجيهي العلمي)',
    school: 'مدرسة الحكمة الثانوية للبنين',
    weeklyHours: 14.5,
    completedAssignments: 8,
    totalAssignments: 9,
    streakDays: 4,
    strongSubjects: ['الرياضيات العلمي', 'الكيمياء', 'تاريخ الأردن'],
    needsSupport: ['الفيزياء (التصادمات ثنائية الأبعاد)'],
    teacherNotes: [
      {
        teacher: 'أ. خالد العمري (معلم الرياضيات)',
        date: 'أمس',
        text: 'أحمد يبدي تقدماً ملحوظاً في فهم قواعد التفاضل والاشتقاق، واستمراره بحل المسائل التدريبية سينعكس إيجاباً على علامته الوزارية.',
      },
      {
        teacher: 'أ. إبراهيم الزعبي (معلم الفيزياء)',
        date: 'منذ يومين',
        text: 'يرجى تشجيع أحمد على مراجعة إشارات متجهات السرعة في وحدة الزخم، فقد تم إرسال تدريب علاجي مصغر له عبر المنصة.',
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
          <HeartHandshake className="w-4 h-4" />
          <span>بوابة الشراكة بين الأسرة والمدرسة</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              متابعة تقدم الطالب: {studentInfo.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {studentInfo.grade} · {studentInfo.school}
            </p>
          </div>
          <div className="px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200">
            🔥 {studentInfo.streakDays} أيام متواصلة من المذاكرة
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500">ساعات المذاكرة هذا الأسبوع</span>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {studentInfo.weeklyHours} <span className="text-xs font-normal">ساعة</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold block">معدل ممتاز ومتزن</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500">الواجبات المنجزة</span>
          <div className="text-2xl font-black text-emerald-800 font-mono">
            {studentInfo.completedAssignments} / {studentInfo.totalAssignments}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold block">نسبة إنجاز 89%</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500">الدافعية والانتظام</span>
          <div className="text-2xl font-black text-amber-600 font-mono">
            مرتفعة جداً
          </div>
          <span className="text-[11px] text-slate-500 font-semibold block">يستخدم منصة معلّمي يومياً</span>
        </div>
      </div>

      {/* Academic Strengths & Areas to Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 text-emerald-800">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>مباحث يظهر فيها الطالب إتقاناً متميزاً:</span>
          </h3>
          <div className="space-y-2">
            {studentInfo.strongSubjects.map((sub, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-slate-800 font-bold">
                ✓ {sub}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>مواضيع تحتاج تشجيعاً ومراجعة إضافية:</span>
          </h3>
          <div className="space-y-2">
            {studentInfo.needsSupport.map((sub, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-slate-800 font-medium">
                ⚠️ {sub}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Teacher Verified Notes */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          ملاحظات المعلمين المعتمدة لولي الأمر
        </h3>
        <div className="space-y-3">
          {studentInfo.teacherNotes.map((note, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>{note.teacher}</span>
                <span className="text-slate-400 font-normal">{note.date}</span>
              </div>
              <p className="text-slate-700 leading-relaxed">{note.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Supportive Routine Tip */}
      <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl text-xs space-y-2">
        <h4 className="font-bold text-emerald-950 flex items-center gap-1.5">
          <HeartHandshake className="w-4 h-4 text-emerald-800" />
          <span>نصيحة إرشادية لدعم طالب التوجيهي في المنزل:</span>
        </h4>
        <p className="text-emerald-900 leading-relaxed">
          وفّر له بيئة هادئة ومضاءة جيداً أثناء جلسات الدراسة المحددة بـ 45 دقيقة، وشجعه على أخذ استراحة قصيرة مدتها 10 دقائق بعد كل جلسة. الاستماع لملخص ما درسه يعزز ثقته بنفسه دون ممارسة ضغط نفسي.
        </p>
      </div>
    </div>
  );
};
