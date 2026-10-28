import React, { useState } from 'react';
import { StudyPlanItem } from '../types';
import { Calendar, Clock, CheckCircle2, Circle, AlertCircle, Plus, Sparkles } from 'lucide-react';

export const StudyPlannerTab: React.FC = () => {
  const [examDate, setExamDate] = useState('2026-06-20');
  const [items, setItems] = useState<StudyPlanItem[]>([
    {
      id: 'plan_1',
      subject: 'الرياضيات العلمي',
      topic: 'مراجعة قاعدة السلسلة وتطبيقات القيم القصوى',
      scheduledTimeMinutes: 45,
      date: 'اليوم',
      completed: true,
      priority: 'عالية',
    },
    {
      id: 'plan_2',
      subject: 'الفيزياء',
      topic: 'حل 5 مسائل على التصادمات غير المرنة وحفظ الزخم',
      scheduledTimeMinutes: 40,
      date: 'اليوم',
      completed: false,
      priority: 'مراجعة أخطاء سابقة',
    },
    {
      id: 'plan_3',
      subject: 'الكيمياء',
      topic: 'الاتزان الأيوني وحسابات pH للمحاليل المنظمة',
      scheduledTimeMinutes: 35,
      date: 'غداً',
      completed: false,
      priority: 'متوسطة',
    },
    {
      id: 'plan_4',
      subject: 'تاريخ الأردن',
      topic: 'دراسة محطة تعريب قيادة الجيش ودستور 1952',
      scheduledTimeMinutes: 30,
      date: 'غداً',
      completed: false,
      priority: 'متوسطة',
    },
  ]);

  const [newTopic, setNewTopic] = useState('');
  const [newSubject, setNewSubject] = useState('الرياضيات العلمي');

  // Calculate days remaining to Tawjihi exam
  const calculateDaysRemaining = () => {
    const target = new Date(examDate).getTime();
    const today = new Date().getTime();
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const handleToggleComplete = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim()) return;

    const newItem: StudyPlanItem = {
      id: `plan_${Date.now()}`,
      subject: newSubject,
      topic: newTopic,
      scheduledTimeMinutes: 35,
      date: 'اليوم',
      completed: false,
      priority: 'عالية',
    };

    setItems((prev) => [newItem, ...prev]);
    setNewTopic('');
  };

  const daysRemaining = calculateDaysRemaining();
  const completedCount = items.filter((i) => i.completed).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Tawjihi Countdown Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold mb-1">
            <Calendar className="w-4 h-4" />
            <span>الخطة الدراسية الذكية والعد التنازلي للتوجيهي</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">
            امتحانات شهادة الدراسة الثانوية العامة (التوجيهي)
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            تنظيم أوقات الدراسة الذكية وفق جلسات تركيز (25 دقيقة دراسة + 5 دقائق استراحة).
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl text-center shrink-0 min-w-[140px]">
          <div className="text-3xl font-black text-amber-400 font-mono">
            {daysRemaining}
          </div>
          <div className="text-xs text-slate-300 font-semibold mt-0.5">يوماً متبقياً</div>
        </div>
      </div>

      {/* Add Task Box */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-2.5">
          <select
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
          >
            <option value="الرياضيات العلمي">الرياضيات العلمي</option>
            <option value="الفيزياء">الفيزياء</option>
            <option value="الكيمياء">الكيمياء</option>
            <option value="العلوم الحياتية">العلوم الحياتية</option>
            <option value="اللغة العربية">اللغة العربية</option>
            <option value="اللغة الإنجليزية">اللغة الإنجليزية</option>
            <option value="تاريخ الأردن">تاريخ الأردن</option>
          </select>

          <input
            type="text"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            placeholder="أضف جلسة دراسية جديدة (مثال: حل أسئلة سنوات سابقة في الكيمياء)..."
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-700 focus:outline-none"
          />

          <button
            type="submit"
            className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة جلسة</span>
          </button>
        </form>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
          <span className="font-bold text-slate-800">
            جلسات المراجعة المقررة ({completedCount} من {items.length} مكتملة)
          </span>
          <span className="text-slate-500 font-medium">
            الأولوية للمفاهيم التي ارتكبت فيها أخطاء سابقة
          </span>
        </div>

        <div className="space-y-2.5">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggleComplete(item.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                item.completed
                  ? 'bg-slate-50/70 border-slate-200 text-slate-400 line-through'
                  : 'bg-white border-slate-200 hover:border-emerald-300 shadow-xs text-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 hover:text-emerald-600 shrink-0" />
                )}
                <div>
                  <div className="text-[11px] font-semibold text-emerald-800">{item.subject}</div>
                  <div className="text-xs sm:text-sm font-bold mt-0.5">{item.topic}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs shrink-0">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.priority === 'مراجعة أخطاء سابقة'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : item.priority === 'عالية'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.priority}
                </span>
                <span className="text-slate-500 flex items-center gap-1 font-mono text-[11px]">
                  <Clock className="w-3.5 h-3.5" />
                  {item.scheduledTimeMinutes} د
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
