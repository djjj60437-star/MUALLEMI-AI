import React, { useState } from 'react';
import { SAMPLE_PRACTICE_QUESTIONS, CURRICULUM_SUBJECTS } from '../data/curriculumData';
import { PracticeQuestion, GradeLevel } from '../types';
import confetti from 'canvas-confetti';
import { Award, CheckCircle, XCircle, Clock, Sparkles, RefreshCw, BookOpen, AlertCircle } from 'lucide-react';

interface PracticeExamTabProps {
  selectedGrade: GradeLevel;
}

export const PracticeExamTab: React.FC<PracticeExamTabProps> = ({ selectedGrade }) => {
  const [questions, setQuestions] = useState<PracticeQuestion[]>(SAMPLE_PRACTICE_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswersHistory, setUserAnswersHistory] = useState<Array<{ isCorrect: boolean; qId: string }>>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimed, setIsTimed] = useState(false);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;

    setIsAnswerSubmitted(true);
    const isCorrect = selectedOption === currentQ.correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    }

    setUserAnswersHistory((prev) => [...prev, { isCorrect, qId: currentQ.id }]);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    }
  };

  const handleGenerateAIQuestions = async () => {
    setIsGeneratingAI(true);
    try {
      const response = await fetch('/api/ai/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: 'الرياضيات',
          grade: 'التوجيهي العلمي',
          unit: 'التفاضل والتكامل وتطبيقاته',
          count: 3,
          difficulty: 'توجيهي وزارة',
        }),
      });

      const data = await response.json();
      if (data.success && data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setCurrentIndex(0);
        setSelectedOption(null);
        setIsAnswerSubmitted(false);
        setScore(0);
        setUserAnswersHistory([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
              <span>نماذج امتحانات التوجيهي</span>
              <span aria-hidden="true">·</span>
              <span>أسئلة موضوعية ومقالية</span>
              <span aria-hidden="true">·</span>
              <span>تقييم وتغذية راجعة فورية</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-800" />
              <span>تدريبي وبنك أسئلة الامتحانات الوزارية</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateAIQuestions}
              disabled={isGeneratingAI}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              {isGeneratingAI ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>توليد أسئلة توجيهي جديدة...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>توليد أسئلة وزارية جديدة</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress & Score Strip */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700">
              السؤال {currentIndex + 1} من {questions.length}
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-emerald-800 font-bold">
              النتيجة الحالية: {score} / {questions.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[11px] font-semibold text-slate-500">مستوى الصعوبة:</span>
            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold text-[10px] border border-amber-200">
              {currentQ?.difficulty || 'متوسط'}
            </span>
          </div>
        </div>
      </div>

      {/* Current Question Card */}
      {currentQ && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          {/* Question Meta & Statement */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{currentQ.unitTitle} · {currentQ.lessonTitle}</span>
              {currentQ.sourceReference && (
                <span className="text-emerald-800 font-medium">
                  {currentQ.sourceReference}
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed font-mono">
              {currentQ.question}
            </h3>
          </div>

          {/* Options List */}
          <div className="space-y-2.5">
            {currentQ.options?.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectOption = idx === currentQ.correctAnswer;

              let styleClasses = 'bg-white border-slate-200 hover:border-slate-300 text-slate-800';
              if (isSelected && !isAnswerSubmitted) {
                styleClasses = 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold';
              } else if (isAnswerSubmitted) {
                if (isCorrectOption) {
                  styleClasses = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                } else if (isSelected && !isCorrectOption) {
                  styleClasses = 'bg-rose-100 border-rose-500 text-rose-950 font-bold';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerSubmitted}
                  className={`w-full p-4 rounded-xl border text-right transition-all flex items-center justify-between font-mono text-xs sm:text-sm ${styleClasses}`}
                >
                  <span>{opt}</span>
                  {isAnswerSubmitted && isCorrectOption && (
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrectOption && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Actions Bar */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                تأكيد الإجابة
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                disabled={currentIndex === questions.length - 1}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                {currentIndex === questions.length - 1 ? 'انتهت الأسئلة' : 'السؤال التالي'}
              </button>
            )}

            <span className="text-xs text-slate-500">
              الهدف: {currentQ.learningObjective}
            </span>
          </div>

          {/* Explanation if submitted */}
          {isAnswerSubmitted && (
            <div
              className={`p-4 rounded-xl text-xs sm:text-sm space-y-1.5 ${
                selectedOption === currentQ.correctAnswer
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-950'
                  : 'bg-rose-50 border border-rose-200 text-rose-950'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5">
                {selectedOption === currentQ.correctAnswer ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>إجابة صحيحة يا بطل!</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>انتبه، الإجابة الصحيحة موضحة أدناه:</span>
                  </>
                )}
              </div>
              <p className="leading-relaxed text-slate-700">
                {currentQ.explanation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
