import React, { useState, useEffect } from 'react';
import { X, Volume2, Type, Contrast, Mic, Sparkles, Check } from 'lucide-react';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({ isOpen, onClose }) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [testSpeechText, setTestSpeechText] = useState('مرحباً بك في معلّمي، منصتك الذكية لتعلم المناهج الأردنية بثقة.');
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);

  useEffect(() => {
    // Apply classes to body
    const body = document.body;
    body.classList.remove('font-large', 'font-xlarge');
    if (fontSize === 'large') body.classList.add('font-large');
    if (fontSize === 'xlarge') body.classList.add('font-xlarge');

    if (highContrast) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }

    if (reducedMotion) {
      body.classList.add('reduced-motion');
    } else {
      body.classList.remove('reduced-motion');
    }
  }, [fontSize, highContrast, reducedMotion]);

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('ميزة نطق الصوت غير مدعومة في متصفحك حالياً.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-JO'; // Jordanian/Arabic speech
    utterance.rate = 0.95;
    utterance.onstart = () => setIsPlayingSpeech(true);
    utterance.onend = () => setIsPlayingSpeech(false);
    utterance.onerror = () => setIsPlayingSpeech(false);
    window.speechSynthesis.speak(utterance);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="accessibility-title"
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-slate-800"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              ♿
            </div>
            <h2 id="accessibility-title" className="text-lg font-bold text-slate-900">
              إمكانية الوصول والتعلم الشامل
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="إغلاق نافذة إمكانية الوصول"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-6">
          {/* Font Size Option */}
          <div>
            <label className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-2">
              <Type className="w-4 h-4 text-emerald-800" />
              حجم الخط والنصوص
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setFontSize('normal')}
                className={`py-2 px-3 text-sm rounded-lg border text-center transition-all ${
                  fontSize === 'normal'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                عادي (100%)
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`py-2 px-3 text-sm rounded-lg border text-center transition-all ${
                  fontSize === 'large'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                كبير (115%)
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`py-2 px-3 text-sm rounded-lg border text-center transition-all ${
                  fontSize === 'xlarge'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                أكبر (130%)
              </button>
            </div>
          </div>

          {/* High Contrast Mode */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2.5">
              <Contrast className="w-5 h-5 text-emerald-800" />
              <div>
                <p className="text-sm font-semibold text-slate-900">وضع التباين العالي</p>
                <p className="text-xs text-slate-500">وضوح فائق للنصوص والمعادلات لضعاف البصر</p>
              </div>
            </div>
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                highContrast ? 'bg-emerald-700 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-emerald-800" />
              <div>
                <p className="text-sm font-semibold text-slate-900">تقليل الحركات والانتقالات</p>
                <p className="text-xs text-slate-500">مناسب لمن يعانون من الحساسية البصرية أو التشتت</p>
              </div>
            </div>
            <button
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                reducedMotion ? 'bg-emerald-700 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          {/* Text-To-Speech Reader Test */}
          <div>
            <label className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-2">
              <Volume2 className="w-4 h-4 text-emerald-800" />
              المساعد الصوتي وقراءة الشروحات
            </label>
            <p className="text-xs text-slate-600 mb-2">
              يمكنك الاستماع لأي خطوة من خطوات الحل الصوتي بنقرة زر واحدة في أي مكان بالتطبيق.
            </p>
            <button
              onClick={() => speakText(testSpeechText)}
              disabled={isPlayingSpeech}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 hover:bg-emerald-100 font-medium text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Volume2 className={`w-4 h-4 ${isPlayingSpeech ? 'animate-bounce text-emerald-700' : ''}`} />
              <span>{isPlayingSpeech ? 'جارٍ نطق العبارة التجريبية...' : 'تجربة نطق الصوت باللغة العربية'}</span>
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
          >
            حفظ وإغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
