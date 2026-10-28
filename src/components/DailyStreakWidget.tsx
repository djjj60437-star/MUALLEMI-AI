import React, { useState, useEffect } from 'react';
import { DailyStreakData } from '../types';
import confetti from 'canvas-confetti';
import { Flame, Award, CheckCircle, Sparkles, Target, Calendar } from 'lucide-react';

export const DailyStreakWidget: React.FC = () => {
  const [streakData, setStreakData] = useState<DailyStreakData>(() => {
    const saved = localStorage.getItem('muallemi_streak');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      streakDays: 4,
      lastCompletedDate: new Date().toISOString().split('T')[0],
      questionsAnsweredCount: 18,
      points: 240,
      levelTitle: 'طالب متميز - باحث المعرفة',
      badges: [
        { id: 'streak_3', title: 'درع الالتزام', desc: 'إتمام 3 أيام متتالية من التدريب', icon: '🛡️', unlocked: true },
        { id: 'math_ace', title: 'فارس التفاضل', desc: 'حل 10 مسائل تفاضل بنجاح', icon: '📐', unlocked: true },
        { id: 'mistake_slayer', title: 'قاهر الأخطاء', desc: 'تصحيح 5 أخطاء مفاهيمية', icon: '⚡', unlocked: true },
        { id: 'tawjihi_hero', title: 'صقر التوجيهي', desc: 'إتمام 7 أيام دراسية متواصلة', icon: '🦅', unlocked: false },
      ],
    };
  });

  const [dailyAnswered, setDailyAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const dailyQuestion = {
    title: 'تحدي اليوم (رياضيات كولنز - توجيهي علمي)',
    question: 'ما قيمة المشتقة الأولى للاقتران f(x) = ln(e^(5x)) عند x = 2؟',
    options: ['5', '10', 'e^5', 'ln(10)'],
    correct: 0,
    explanation: 'تذكر قاعدة اللوغاريتمات: ln(e^(5x)) = 5x مباشرة! ومشتقة 5x بالنسبة إلى x هي 5 كقيمة ثابتة لأي قيمة لـ x.',
  };

  const handleAnswerDaily = (idx: number) => {
    if (dailyAnswered) return;
    setSelectedAnswer(idx);
    setDailyAnswered(true);

    if (idx === dailyQuestion.correct) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
      });

      const updated = {
        ...streakData,
        points: streakData.points + 25,
        questionsAnsweredCount: streakData.questionsAnsweredCount + 1,
      };
      setStreakData(updated);
      localStorage.setItem('muallemi_streak', JSON.stringify(updated));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Streak & Milestone Overview */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>درع الاستمرارية اليومية</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {streakData.streakDays} أيام مستمرة من التعلم!
            </h2>
            <p className="text-xs text-slate-300 max-w-md">
              الاستمرار اليومي لمدة 15 دقيقة يصنع الفارق الحقيقي في نتائج الثانوية العامة والتفوق الأكاديمي.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15">
            <div className="text-center">
              <div className="text-2xl font-black text-amber-300 font-mono">
                {streakData.points}
              </div>
              <div className="text-[11px] text-slate-300 font-semibold">نقطة تميز</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-black text-emerald-300 font-mono">
                {streakData.questionsAnsweredCount}
              </div>
              <div className="text-[11px] text-slate-300 font-semibold">مسألة منجزة</div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Challenge Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-800" />
            <h3 className="text-sm font-bold text-slate-900">{dailyQuestion.title}</h3>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
            +25 نقطة تميز
          </span>
        </div>

        <p className="text-sm font-bold text-slate-800 font-mono leading-relaxed">
          {dailyQuestion.question}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          {dailyQuestion.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswerDaily(idx)}
              disabled={dailyAnswered}
              className={`p-3 rounded-xl border text-center font-mono font-bold text-xs transition-all ${
                dailyAnswered
                  ? idx === dailyQuestion.correct
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-950'
                    : selectedAnswer === idx
                    ? 'bg-rose-100 border-rose-500 text-rose-950'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                  : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-slate-800'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {dailyAnswered && (
          <div
            className={`p-4 rounded-xl text-xs space-y-1 ${
              selectedAnswer === dailyQuestion.correct
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-950'
                : 'bg-rose-50 border border-rose-200 text-rose-950'
            }`}
          >
            <div className="font-bold">
              {selectedAnswer === dailyQuestion.correct
                ? 'رائع جداً! إجابة صحيحة زادت رصيدك اليومي.'
                : 'إجابة غير صحيحة، اقرأ الشرح التالي لتفهم الفكرة:'}
            </div>
            <p className="leading-relaxed">{dailyQuestion.explanation}</p>
          </div>
        )}
      </div>

      {/* Badges & Achievements */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-800" />
          <span>أوسمة الإنجاز والتميز</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {streakData.badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-xl border transition-all ${
                b.unlocked
                  ? 'bg-emerald-50/40 border-emerald-200 text-slate-900'
                  : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
              }`}
            >
              <div className="text-2xl mb-1.5">{b.icon}</div>
              <h4 className="text-xs font-bold">{b.title}</h4>
              <p className="text-[11px] text-slate-500 mt-1">{b.desc}</p>
              <div className="mt-2 text-[10px] font-semibold text-emerald-800">
                {b.unlocked ? '✓ تم تحقيقه' : 'قيد التقدم'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
