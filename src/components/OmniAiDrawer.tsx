import React, { useState, useRef } from 'react';
import { 
  Bot, Sparkles, X, Send, Paperclip, FileText, Image as ImageIcon, 
  Volume2, VolumeX, Mic, MicOff, RefreshCw, BookOpen, CheckCircle2, Maximize2, Minimize2 
} from 'lucide-react';
import { ExplanationStyle, GradeLevel, StructuredExplanation } from '../types';

interface OmniAiDrawerProps {
  selectedGrade: GradeLevel;
}

export const OmniAiDrawer: React.FC<OmniAiDrawerProps> = ({ selectedGrade }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [promptInput, setPromptInput] = useState('');
  const [style, setStyle] = useState<ExplanationStyle>('jordanian');
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; content: string; isImage: boolean } | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{
    role: 'user' | 'assistant';
    text: string;
    structured?: StructuredExplanation;
    fileName?: string;
  }>>([
    {
      role: 'assistant',
      text: 'مرحباً بك يا بطل! أنا المساعد الذكي الشامل لمعلّمي AI. أستطيع الإجابة على أي سؤال، قراءة وتحليل المستندات المرفقة (PDF والصور)، وشرح الدروس صوتياً واجتماعياً باللهجة الأردنية أو الفصحى.',
    },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImg = file.type.startsWith('image/');
    const reader = new FileReader();

    if (isImg) {
      reader.onload = () => {
        setUploadedFile({
          name: file.name,
          content: reader.result as string,
          isImage: true,
        });
      };
      reader.readAsDataURL(file);
    } else {
      reader.onload = () => {
        setUploadedFile({
          name: file.name,
          content: (reader.result as string) || '',
          isImage: false,
        });
      };
      reader.readAsText(file);
    }
  };

  const handleSendPrompt = async () => {
    if ((!promptInput.trim() && !uploadedFile) || loading) return;

    const currentPrompt = promptInput;
    const currentFile = uploadedFile;

    setChatHistory((prev) => [
      ...prev,
      {
        role: 'user',
        text: currentPrompt || (currentFile ? `مستند مرفق: ${currentFile.name}` : ''),
        fileName: currentFile?.name,
      },
    ]);

    setPromptInput('');
    setUploadedFile(null);
    setLoading(true);

    try {
      if (currentFile && currentFile.isImage) {
        // Photo solve endpoint
        const res = await fetch('/api/ai/photo-solve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: currentFile.content,
            studentNotes: currentPrompt,
            subject: 'المناهج المعتمدة',
            grade: selectedGrade === 'tawjihi_sci' ? 'التوجيهي العلمي' : 'المرحلة الثانوية',
            style,
          }),
        });
        const data = await res.json();
        if (data.success && data.structured) {
          setChatHistory((prev) => [
            ...prev,
            {
              role: 'assistant',
              text: data.extractedText || 'تم تحليل الصورة وحل المسألة:',
              structured: data.structured,
            },
          ]);
        }
      } else {
        // Text or Document prompt
        const combinedText = currentFile && !currentFile.isImage
          ? `[محتوى المستند المرفق: ${currentFile.name}]\n${currentFile.content.slice(0, 3000)}\n\nسؤال الطالب: ${currentPrompt}`
          : currentPrompt;

        const res = await fetch('/api/ai/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: combinedText,
            subject: 'جميع المواد',
            grade: selectedGrade === 'tawjihi_sci' ? 'التوجيهي العلمي' : 'المرحلة الثانوية',
            style,
          }),
        });

        const data = await res.json();
        if (data.success && data.structured) {
          setChatHistory((prev) => [
            ...prev,
            {
              role: 'assistant',
              text: data.structured.explanationIntro || 'شرح معلّمي الشامل:',
              structured: data.structured,
            },
          ]);
        }
      }
    } catch (e: any) {
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `حدث خطأ أثناء المعالجة: ${e.message || 'يرجى المحاولة مرة أخرى.'}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceMic = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('التعرف على الصوت غير مدعوم في متصفحك.');
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
        setPromptInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-JO';
    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      {/* Floating AI Launcher Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 bg-gradient-to-r from-emerald-800 via-teal-700 to-slate-900 text-white p-3.5 sm:px-5 sm:py-3 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2.5 group border border-emerald-400/30"
        title="افتح الذكاء الاصطناعي الشامل لقراءة الملفات والشرح الصوتي"
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
        </div>
        <span className="text-xs font-bold whitespace-nowrap hidden sm:inline">
          معلّمي AI الشامل (قراءة المستندات والصوت)
        </span>
      </button>

      {/* AI Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-start sm:pr-6 bg-slate-900/60 backdrop-blur-xs p-2 sm:p-4">
          <div
            className={`bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col transition-all duration-300 ${
              isExpanded
                ? 'w-full max-w-4xl h-[90vh]'
                : 'w-full max-w-lg h-[80vh] sm:h-[650px]'
            }`}
          >
            {/* Drawer Header */}
            <div className="p-4 bg-slate-900 text-white rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-900 flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold flex items-center gap-1.5">
                    <span>المساعد الشامل للذكاء الاصطناعي</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                      Gemini 3.8
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    يجيب، يفهم، يقرأ ملفات PDF والصور، ويتحدث باللغة العربية.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Dialect / Style Bar */}
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">أسلوب الشرح:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setStyle('jordanian')}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    style === 'jordanian' ? 'bg-emerald-800 text-white' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  أردني محبب
                </button>
                <button
                  onClick={() => setStyle('simple')}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    style === 'simple' ? 'bg-emerald-800 text-white' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  مبسط
                </button>
                <button
                  onClick={() => setStyle('standard')}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    style === 'standard' ? 'bg-emerald-800 text-white' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  فصحى
                </button>
              </div>
            </div>

            {/* Messages Chat Log */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
              {chatHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    item.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl space-y-2 ${
                      item.role === 'user'
                        ? 'bg-emerald-800 text-white rounded-tr-xs'
                        : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-xs'
                    }`}
                  >
                    {item.fileName && (
                      <div className="text-[10px] bg-black/10 px-2 py-1 rounded flex items-center gap-1 font-mono">
                        <FileText className="w-3 h-3" />
                        <span>مرفق: {item.fileName}</span>
                      </div>
                    )}

                    <p className="leading-relaxed whitespace-pre-wrap">{item.text}</p>

                    {/* Structured AI Explanation if available */}
                    {item.structured && (
                      <div className="mt-3 pt-3 border-t border-slate-200 space-y-2 text-right">
                        <div className="p-2.5 rounded-lg bg-white border border-emerald-200 text-emerald-950 font-bold">
                          🎯 {item.structured.concept}
                        </div>

                        {item.structured.solutionSteps.map((s) => (
                          <div key={s.stepNumber} className="p-2 rounded bg-white border border-slate-200 space-y-1">
                            <span className="font-bold text-slate-900">
                              {s.stepNumber}. {s.title}
                            </span>
                            <p className="text-slate-600">{s.explanation}</p>
                            {s.calculationOrFormula && (
                              <div className="font-mono text-emerald-800 dir-ltr text-left">
                                {s.calculationOrFormula}
                              </div>
                            )}
                          </div>
                        ))}

                        <div className="p-2 bg-slate-900 text-white rounded font-mono font-bold">
                          الجواب: {item.structured.finalAnswer}
                        </div>
                      </div>
                    )}

                    {item.role === 'assistant' && (
                      <button
                        onClick={() =>
                          speakText(
                            item.structured
                              ? `${item.structured.concept}. ${item.structured.finalAnswer}`
                              : item.text
                          )
                        }
                        className="text-[10px] text-emerald-700 hover:underline flex items-center gap-1 pt-1 font-semibold"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>استمع للشرح صوتياً</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* File Upload Banner if attached */}
            {uploadedFile && (
              <div className="px-4 py-2 bg-emerald-50 border-t border-emerald-200 text-xs flex items-center justify-between text-emerald-900">
                <div className="flex items-center gap-1.5 truncate">
                  {uploadedFile.isImage ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  <span className="font-semibold truncate">تم إرفاق: {uploadedFile.name}</span>
                </div>
                <button
                  onClick={() => setUploadedFile(null)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Input Controls */}
            <div className="p-3 bg-white border-t border-slate-200 rounded-b-2xl space-y-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*,.pdf,.txt,.docx"
                className="hidden"
              />

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-slate-500 hover:text-emerald-800 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                  title="إرفاق ملف PDF أو صورة مسألة"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <button
                  onClick={toggleVoiceMic}
                  className={`p-2 rounded-lg border transition-all ${
                    isListening
                      ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                      : 'text-slate-500 hover:text-emerald-800 hover:bg-slate-100 border-slate-200'
                  }`}
                  title="إملاء صوتي باللغة العربية"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
                  placeholder="اسأل الذكاء الاصطناعي الشامل أو ارفق مستندك..."
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none"
                />

                <button
                  onClick={handleSendPrompt}
                  disabled={loading || (!promptInput.trim() && !uploadedFile)}
                  className="p-2 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-xl shadow-xs transition-all"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
