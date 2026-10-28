import React, { useState } from 'react';
import { ExplanationStyle, GradeLevel, StructuredExplanation, ChatMessage } from '../types';
import { CURRICULUM_SUBJECTS } from '../data/curriculumData';
import { Send, Volume2, Mic, MicOff, BookOpen, CheckCircle, HelpCircle, ArrowRight, Sparkles, RefreshCw, Layers } from 'lucide-react';

interface AskMuallemiTabProps {
  initialQuestion?: string;
  initialSubject?: string;
  selectedGrade: GradeLevel;
}

export const AskMuallemiTab: React.FC<AskMuallemiTabProps> = ({
  initialQuestion = '',
  initialSubject = 'الرياضيات',
  selectedGrade,
}) => {
  const [question, setQuestion] = useState(initialQuestion);
  const [subject, setSubject] = useState(initialSubject);
  const [style, setStyle] = useState<ExplanationStyle>('jordanian');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [revealedPracticeAnswer, setRevealedPracticeAnswer] = useState<Record<string, boolean>>({});

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || question;
    if (!textToSend.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          subject,
          grade: selectedGrade === 'tawjihi_sci' ? 'التوجيهي العلمي' : 'المرحلة الثانوية المعتمدة',
          style,
        }),
      });

      const data = await response.json();
      if (data.success && data.structured) {
        const assistantMessage: ChatMessage = {
          id: `resp_${Date.now()}`,
          role: 'assistant',
          content: data.structured.explanationIntro || 'تم إعداد خطوات الحل:',
          timestamp: new Date().toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit' }),
          styleUsed: style,
          structured: data.structured,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'تعذر الحصول على الشرح');
      }
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: `عذراً يا بطل: ${err.message || 'حدث خطأ في الاتصال بالمعلم الذكي. يرجى إعادة المحاولة.'}`,
        timestamp: new Date().toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Web Speech Synthesis (Audio Player)
  const playSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-JO';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  // Web Speech Recognition (Voice Input)
  const toggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('التعرف على الصوت غير مدعوم في متصفحك. يرجى استخدام متصفح حديث مثل Chrome.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-JO';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuestion((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner & Control Deck */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-800" />
              <span>اسأل معلّمي - الشرح المنهجي خطوة بخطوة</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              مبني على مناهج وزارة التربية والتعليم الأردنية · يفكك الصعوبات ولا يكتفي بإعطاء الجواب النهائي
            </p>
          </div>

          {/* Subject Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">المبحث:</span>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 focus:outline-none focus:border-emerald-700"
            >
              {CURRICULUM_SUBJECTS.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dialect / Style Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            اختر أسلوب الشرح واللهجة المفضلة لديك:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <button
              type="button"
              onClick={() => setStyle('jordanian')}
              className={`py-2 px-2.5 rounded-xl border text-xs text-center transition-all ${
                style === 'jordanian'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50/50'
              }`}
            >
              <div className="font-semibold">لهجة أردنية محببة</div>
              <div className="text-[10px] text-slate-500">"بكل بساطة وع الترتيب يا بطل"</div>
            </button>

            <button
              type="button"
              onClick={() => setStyle('simple')}
              className={`py-2 px-2.5 rounded-xl border text-xs text-center transition-all ${
                style === 'simple'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50/50'
              }`}
            >
              <div className="font-semibold">لغة بسيطة ومباشرة</div>
              <div className="text-[10px] text-slate-500">تأسيس سهل للمفاهيم الصعبة</div>
            </button>

            <button
              type="button"
              onClick={() => setStyle('standard')}
              className={`py-2 px-2.5 rounded-xl border text-xs text-center transition-all ${
                style === 'standard'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50/50'
              }`}
            >
              <div className="font-semibold">فصحى مدرسية دقيقة</div>
              <div className="text-[10px] text-slate-500">مطابقة لدليل المعلم والوزارة</div>
            </button>

            <button
              type="button"
              onClick={() => setStyle('academic')}
              className={`py-2 px-2.5 rounded-xl border text-xs text-center transition-all ${
                style === 'academic'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50/50'
              }`}
            >
              <div className="font-semibold">أكاديمي معمّق</div>
              <div className="text-[10px] text-slate-500">للمتفوقين وحالات التفكير العليا</div>
            </button>

            <button
              type="button"
              onClick={() => setStyle('bilingual')}
              className={`py-2 px-2.5 rounded-xl border text-xs text-center transition-all ${
                style === 'bilingual'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50/50'
              }`}
            >
              <div className="font-semibold">ثنائي اللغة (عربي - English)</div>
              <div className="text-[10px] text-slate-500">مصطلحات المناهج العالمية</div>
            </button>
          </div>
        </div>

        {/* Input Textarea & Voice Button */}
        <div className="relative">
          <textarea
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="اكتب مسألتك أو مفهومك هنا بالتفصيل... (مثال: اشتقاق دالة كسرية، قانون كيرشوف، قاعدة لو شاتيليه، إعراب المنادى...)"
            className="w-full p-4 pb-14 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 text-slate-900 text-sm placeholder:text-slate-500 transition-all"
          />
          <div className="absolute left-3 bottom-3 flex items-center gap-2">
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`p-2 rounded-lg border transition-all ${
                isListening
                  ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              title={isListening ? 'جارٍ الاستماع... انقر للإيقاف' : 'إملاء صوتي باللغة العربية'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => handleSend()}
              disabled={loading || !question.trim()}
              className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>معلّمي يفكك المسألة...</span>
                </>
              ) : (
                <>
                  <span>اشرح لي خطوة بخطوة</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Messages / Explanations Stream */}
      <div className="space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-4">
            {msg.role === 'user' ? (
              <div className="flex justify-end">
                <div className="max-w-2xl bg-emerald-800 text-white rounded-2xl rounded-tr-sm p-4 text-sm shadow-sm leading-relaxed">
                  <div className="text-[11px] text-emerald-200 font-semibold mb-1">
                    سؤالك إلى معلّمي ({msg.timestamp}):
                  </div>
                  <div className="font-medium whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6 text-slate-800">
                {/* Assistant Header & Actions */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-bold text-slate-900">شرح معلّمي المنهجي</span>
                    {msg.styleUsed && (
                      <span className="text-slate-500">
                        (أسلوب:{' '}
                        {msg.styleUsed === 'jordanian'
                          ? 'اللهجة الأردنية'
                          : msg.styleUsed === 'simple'
                          ? 'بسيط'
                          : msg.styleUsed === 'academic'
                          ? 'أكاديمي'
                          : msg.styleUsed === 'bilingual'
                          ? 'ثنائي اللغة'
                          : 'فصحى مدرسية'}
                        )
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      playSpeech(
                        msg.structured
                          ? `${msg.structured.concept}. ${msg.structured.solutionSteps.map((s) => s.explanation).join('. ')}. الجواب النهائي: ${msg.structured.finalAnswer}`
                          : msg.content
                      )
                    }
                    className="flex items-center gap-1.5 text-slate-500 hover:text-emerald-800 font-medium transition-colors"
                    title="الاستماع للشرح صوتياً"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>استمع للشرح</span>
                  </button>
                </div>

                {/* Structured Breakdown if available */}
                {msg.structured ? (
                  <div className="space-y-6">
                    {/* Concept Card */}
                    <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
                      <div className="text-xs font-semibold text-emerald-800 mb-1">
                        🎯 المفهوم المنهجي الأساسي:
                      </div>
                      <h3 className="text-base font-bold text-emerald-950">
                        {msg.structured.concept}
                      </h3>
                      {msg.structured.explanationIntro && (
                        <p className="text-xs text-emerald-900 mt-2 leading-relaxed">
                          {msg.structured.explanationIntro}
                        </p>
                      )}
                    </div>

                    {/* Verified Curriculum Citation Source */}
                    {msg.structured.sourceReference && (
                      <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                        <BookOpen className="w-4 h-4 text-emerald-700 shrink-0" />
                        <div>
                          <span className="font-semibold text-slate-800">
                            المرجع المعتمد من وزارة التربية والتعليم:{' '}
                          </span>
                          <span>
                            {msg.structured.sourceReference.bookName} ·{' '}
                            {msg.structured.sourceReference.unitTitle} · صفحة{' '}
                            {msg.structured.sourceReference.pageNumber}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Step-by-Step Cards */}
                    <div className="space-y-3">
                      <div className="text-xs font-bold text-slate-700">
                        خطوات الحل المنطقية خطوة بخطوة:
                      </div>
                      {msg.structured.solutionSteps.map((step) => (
                        <div
                          key={step.stepNumber}
                          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all space-y-2 shadow-xs"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                                {step.stepNumber}
                              </span>
                              <h4 className="text-sm font-bold text-slate-900">
                                {step.title}
                              </h4>
                            </div>
                            <button
                              onClick={() => playSpeech(`${step.title}. ${step.explanation}`)}
                              className="text-slate-400 hover:text-emerald-700 p-1"
                              title="استمع لهذه الخطوة"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pr-8">
                            {step.explanation}
                          </p>

                          {step.calculationOrFormula && (
                            <div className="mr-8 p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-emerald-950 font-semibold dir-ltr text-left">
                              {step.calculationOrFormula}
                            </div>
                          )}

                          {step.ruleExplanation && (
                            <div className="mr-8 text-[11px] text-slate-500 italic">
                              💡 علّة الخطوة:{' '}
                              <span className="text-slate-600">{step.ruleExplanation}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Final Answer Banner */}
                    <div className="p-4 rounded-xl bg-slate-900 text-white space-y-1">
                      <div className="text-xs font-semibold text-emerald-400">
                        النتيجة النهائية الصريحة:
                      </div>
                      <div className="text-base sm:text-lg font-bold font-mono">
                        {msg.structured.finalAnswer}
                      </div>
                      {msg.structured.coreRule && (
                        <p className="text-xs text-slate-300 pt-1 border-t border-slate-800">
                          📌 القاعدة الذهبية في الامتحان: {msg.structured.coreRule}
                        </p>
                      )}
                    </div>

                    {/* Similar Practice Question */}
                    {msg.structured.similarPracticeQuestion && (
                      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-amber-700" />
                            اختبر فهمك بسؤال تدريبي مشابه (غير مجاب مسبقاً):
                          </span>
                          <span className="text-[10px] text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded font-medium">
                            تدريب مولّد بأسلوب المنهاج
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm font-semibold text-slate-900">
                          {msg.structured.similarPracticeQuestion.question}
                        </p>

                        {msg.structured.similarPracticeQuestion.choices && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {msg.structured.similarPracticeQuestion.choices.map((c, i) => (
                              <div
                                key={i}
                                className="p-2 rounded-lg bg-white border border-amber-200 text-slate-800 font-medium"
                              >
                                {c}
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-3 pt-1">
                          <button
                            onClick={() =>
                              setRevealedPracticeAnswer((prev) => ({
                                ...prev,
                                [msg.id]: !prev[msg.id],
                              }))
                            }
                            className="text-xs font-semibold text-amber-900 hover:text-amber-950 underline"
                          >
                            {revealedPracticeAnswer[msg.id]
                              ? 'إخفاء الإجابة والتلميح'
                              : 'تحقق من إجابتك والتلميح'}
                          </button>
                        </div>

                        {revealedPracticeAnswer[msg.id] && (
                          <div className="p-3 rounded-lg bg-white border border-amber-300 text-xs text-slate-800 space-y-1">
                            <p>
                              <strong className="text-emerald-800">التلميح:</strong>{' '}
                              {msg.structured.similarPracticeQuestion.hint}
                            </p>
                            <p>
                              <strong className="text-emerald-800">الحل النموذجي:</strong>{' '}
                              {msg.structured.similarPracticeQuestion.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {messages.length === 0 && (
        <div className="bg-slate-50 rounded-2xl p-8 border border-dashed border-slate-300 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center font-bold text-lg">
            ؟
          </div>
          <h3 className="text-base font-bold text-slate-800">جاهز لأي سؤال في منهاجك الأردني</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            اكتب مسألتك أو اختر من الأمثلة في الأعلى. سيبدأ معلّمي بتفكيكها إلى خطوات منطقية مع مبررات كل خطوة لتفهم المفهوم كاملاً.
          </p>
        </div>
      )}
    </div>
  );
};
