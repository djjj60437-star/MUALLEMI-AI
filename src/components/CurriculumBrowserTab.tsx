import React, { useState } from 'react';
import { CURRICULUM_SUBJECTS, VERIFIED_LESSONS } from '../data/curriculumData';
import { CurriculumLesson, GradeLevel } from '../types';
import { BookOpen, CheckCircle, Search, Filter, ArrowLeft, Sparkles, BookMarked } from 'lucide-react';

interface CurriculumBrowserTabProps {
  onSelectLessonForAsk: (lessonTitle: string, subjectName: string) => void;
  selectedGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
}

export const CurriculumBrowserTab: React.FC<CurriculumBrowserTabProps> = ({
  onSelectLessonForAsk,
  selectedGrade,
  onSelectGrade,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLessonModal, setActiveLessonModal] = useState<CurriculumLesson | null>(null);

  const filteredLessons = VERIFIED_LESSONS.filter((lesson) => {
    const matchesSubject = selectedSubjectId === 'all' || lesson.subjectId === selectedSubjectId;
    const matchesSearch =
      lesson.title.includes(searchQuery) ||
      lesson.unitTitle.includes(searchQuery) ||
      lesson.subjectName.includes(searchQuery);
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
              <span>وزارة التربية والتعليم الأردنية</span>
              <span aria-hidden="true">·</span>
              <span>مركز المناهج والكتب المدرسية</span>
              <span aria-hidden="true">·</span>
              <span>طبعة 2025/2026 المعتمدة</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-800" />
              <span>فهرس المناهج والدروس الموثقة</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              تصفح الوحدات والدروس المعتمدة، واطلع على النتاجات التعلمية المحددة في كتب التوجيهي والمراحل الأساسية.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن درس، وحدة، أو نتاج..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-700 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Subjects Horizontal Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedSubjectId('all')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-semibold ${
              selectedSubjectId === 'all'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            جميع المباحث ({VERIFIED_LESSONS.length})
          </button>
          {CURRICULUM_SUBJECTS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSubjectId(s.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-semibold ${
                selectedSubjectId === s.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CURRICULUM_SUBJECTS.map((subj) => (
          <div
            key={subj.id}
            onClick={() => setSelectedSubjectId(subj.id)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              selectedSubjectId === subj.id
                ? 'bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-700/20'
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500">{subj.category}</span>
              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                {subj.unitsCount} وحدات
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">{subj.name}</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
              {subj.description}
            </p>
          </div>
        ))}
      </div>

      {/* Verified Lessons List */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">
            الدروس المنهجية المعتمدة ({filteredLessons.length} درساً متاحاً)
          </h3>
          <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>نصوص موثقة مع أرقام الصفحات</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="p-5 rounded-xl border border-slate-200 hover:border-emerald-300 bg-white hover:bg-emerald-50/20 transition-all space-y-3 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] text-emerald-800 font-semibold block">
                    {lesson.subjectName} · {lesson.gradeName}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-950 mt-0.5">
                    {lesson.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{lesson.unitTitle}</p>
                </div>
                <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded shrink-0">
                  {lesson.pageRange}
                </span>
              </div>

              {/* Learning Objectives Preview */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-700">النتاجات التعليمية:</span>
                <ul className="text-xs text-slate-600 space-y-1 pr-3 list-disc">
                  {lesson.objectives.slice(0, 2).map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>

              {/* Bottom Citation & Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-500 font-mono truncate max-w-[200px]">
                  {lesson.sourceBook}
                </span>
                <button
                  onClick={() => onSelectLessonForAsk(lesson.title, lesson.subjectName)}
                  className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold flex items-center gap-1 text-[11px] transition-colors"
                >
                  <span>اشرح لي هذا الدرس</span>
                  <ArrowLeft className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
