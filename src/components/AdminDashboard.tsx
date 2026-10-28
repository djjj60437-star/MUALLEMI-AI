import React, { useState } from 'react';
import { School, Users, BarChart3, Download, Printer, Shield, BookOpen, CheckCircle } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [downloading, setDownloading] = useState(false);

  // School aggregate statistics
  const schoolStats = {
    schoolName: 'مدرسة الحكمة الثانوية للبنين - مديرية قصبة عمّان',
    totalStudents: 412,
    activeClasses: 14,
    activeTeachers: 22,
    averageMastery: 79.4,
    curriculumCoverage: 76.5,
    subjectBreakdown: [
      { subject: 'الرياضيات', mastery: 74, questionsSolved: 3420, coverage: 82 },
      { subject: 'الفيزياء', mastery: 71, questionsSolved: 2890, coverage: 78 },
      { subject: 'الكيمياء', mastery: 83, questionsSolved: 2610, coverage: 85 },
      { subject: 'العلوم الحياتية', mastery: 86, questionsSolved: 2150, coverage: 74 },
      { subject: 'اللغة العربية', mastery: 88, questionsSolved: 3100, coverage: 80 },
      { subject: 'اللغة الإنجليزية', mastery: 77, questionsSolved: 2940, coverage: 75 },
      { subject: 'تاريخ الأردن', mastery: 89, questionsSolved: 2280, coverage: 90 },
    ],
    gradeBreakdown: [
      { grade: 'التوجيهي العلمي (2008)', students: 110, averageScore: 81 },
      { grade: 'التوجيهي الأدبي (2008)', students: 85, averageScore: 78 },
      { grade: 'الأول ثانوي العلمي', students: 115, averageScore: 79 },
      { grade: 'الصف العاشر الأساسي', students: 102, averageScore: 82 },
    ],
  };

  const handleExportCSV = () => {
    setDownloading(true);
    const headers = 'المبحث,نسبة الإتقان %,المسائل المنجزة,تغطية المنهاج %\n';
    const rows = schoolStats.subjectBreakdown
      .map((s) => `${s.subject},${s.mastery},${s.questionsSolved},${s.coverage}`)
      .join('\n');

    const blob = new Blob([`\uFEFF${headers}${rows}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `تقرير_مخرجات_التعلم_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    setDownloading(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
              <span>الإدارة التربوية المدرسية</span>
              <span aria-hidden="true">·</span>
              <span>مؤشرات أداء مجمعة</span>
              <span aria-hidden="true">·</span>
              <span>حماية خصوصية الطلبة</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <School className="w-5 h-5 text-emerald-800" />
              <span>لوحة الإدارة المدرسية والإحصاءات التعليمية</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">{schoolStats.schoolName}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              disabled={downloading}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>تصدير تقرير CSV</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الملخص</span>
            </button>
          </div>
        </div>

        {/* Privacy Assurance Notice */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center gap-2.5 text-slate-600">
          <Shield className="w-4 h-4 text-emerald-800 shrink-0" />
          <span>
            <strong>معايير الخصوصية الصارمة:</strong> جميع البيانات المعروضة مجمّعة إحصائياً. لا يتم
            عرض المحادثات الشخصية للطلبة احتراماً لخصوصيتهم وأمانهم الرقمي.
          </span>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500">إجمالي الطلبة المشاركين</span>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {schoolStats.totalStudents}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold block">في 14 شعبة صفية</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500">متوسط الإتقان المدرسي</span>
          <div className="text-2xl font-black text-emerald-800 font-mono">
            %{schoolStats.averageMastery}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold block">+4.2% مقارنة بالشهر السابق</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500">نسبة تغطية المنهاج</span>
          <div className="text-2xl font-black text-teal-800 font-mono">
            %{schoolStats.curriculumCoverage}
          </div>
          <span className="text-[11px] text-teal-700 font-semibold block">مطابق لخطة وزارة التربية</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500">المعلمون المشرفون</span>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {schoolStats.activeTeachers}
          </div>
          <span className="text-[11px] text-slate-500 font-semibold block">متابعون نشطون للشعب</span>
        </div>
      </div>

      {/* Subject Performance Breakdown Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-800" />
          <span>مؤشرات الإتقان وتغطية المناهج حسب المبحث الدراسي</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-3">المبحث</th>
                <th className="py-3 px-3">متوسط نسبة الإتقان</th>
                <th className="py-3 px-3">المسائل المنجزة</th>
                <th className="py-3 px-3">تغطية الخطة الفصلية</th>
                <th className="py-3 px-3">الحالة التعليمية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schoolStats.subjectBreakdown.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-slate-900">{row.subject}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-emerald-800">
                    %{row.mastery}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-600">
                    {row.questionsSolved.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-700 rounded-full"
                          style={{ width: `${row.coverage}%` }}
                        />
                      </div>
                      <span className="font-mono text-slate-500 font-semibold">%{row.coverage}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        row.mastery >= 80
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {row.mastery >= 80 ? 'إتقان ممتاز' : 'متابعة دورية'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
