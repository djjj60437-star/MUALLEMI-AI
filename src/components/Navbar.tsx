import React from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { UserRole } from '../types';
import { GraduationCap, LogIn, Eye } from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenAccessibility: () => void;
  streakCount: number;
  currentUser: FirebaseUser | null;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  onOpenAccessibility,
  streakCount,
  currentUser,
  onOpenAuth,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onTabChange('dashboard')}
              className="flex items-center gap-2.5 text-right focus:outline-none group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-700/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
                  معلّمي <span className="text-emerald-700 font-semibold text-sm">MUALLEMI</span>
                </span>
                <span className="text-[11px] text-slate-700 font-medium -mt-1 hidden sm:inline">
                  منهاج الأردن الذكي
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4-5 clean single-line navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            {currentRole === 'student' && (
              <>
                <button
                  onClick={() => onTabChange('dashboard')}
                  className={`hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                    activeTab === 'dashboard' ? 'text-emerald-700 border-emerald-600 font-semibold' : 'border-transparent'
                  }`}
                >
                  الرئيسية
                </button>
                <button
                  onClick={() => onTabChange('ask')}
                  className={`hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                    activeTab === 'ask' ? 'text-emerald-700 border-emerald-600 font-semibold' : 'border-transparent'
                  }`}
                >
                  اسأل معلّمي
                </button>
                <button
                  onClick={() => onTabChange('photo')}
                  className={`hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                    activeTab === 'photo' ? 'text-emerald-700 border-emerald-600 font-semibold' : 'border-transparent'
                  }`}
                >
                  صوّر سؤالك
                </button>
                <button
                  onClick={() => onTabChange('mistake')}
                  className={`hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                    activeTab === 'mistake' ? 'text-emerald-700 border-emerald-600 font-semibold' : 'border-transparent'
                  }`}
                >
                  محلّل الأخطاء
                </button>
                <button
                  onClick={() => onTabChange('curriculum')}
                  className={`hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                    activeTab === 'curriculum' ? 'text-emerald-700 border-emerald-600 font-semibold' : 'border-transparent'
                  }`}
                >
                  موادي والمنهاج
                </button>
                <button
                  onClick={() => onTabChange('practice')}
                  className={`hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                    activeTab === 'practice' ? 'text-emerald-700 border-emerald-600 font-semibold' : 'border-transparent'
                  }`}
                >
                  تدريبي وامتحاناتي
                </button>
              </>
            )}

            {currentRole === 'teacher' && (
              <>
                <button
                  onClick={() => onTabChange('teacher_classes')}
                  className={`hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                    activeTab === 'teacher_classes' ? 'text-emerald-700 border-emerald-600 font-semibold' : 'border-transparent'
                  }`}
                >
                  شُعبي والواجبات
                </button>
                <button
                  onClick={() => onTabChange('teacher_lesson_planner')}
                  className={`hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                    activeTab === 'teacher_lesson_planner' ? 'text-emerald-700 border-emerald-600 font-semibold' : 'border-transparent'
                  }`}
                >
                  مساعد تحضير الدروس
                </button>
                <button
                  onClick={() => onTabChange('teacher_reteach')}
                  className={`hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                    activeTab === 'teacher_reteach' ? 'text-emerald-700 border-emerald-600 font-semibold' : 'border-transparent'
                  }`}
                >
                  المفاهيم التي تحتاج إعادة شرح
                </button>
              </>
            )}

            {currentRole === 'admin' && (
              <>
                <button
                  onClick={() => onTabChange('admin_stats')}
                  className="text-emerald-700 font-semibold whitespace-nowrap shrink-0 py-1 border-b-2 border-emerald-600"
                >
                  الإحصاءات الشاملة للمدرسة
                </button>
                <button
                  onClick={() => onTabChange('curriculum')}
                  className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 py-1"
                >
                  تغطية المناهج الوزارية
                </button>
              </>
            )}

            {currentRole === 'parent' && (
              <span className="text-emerald-800 font-medium text-sm">
                متابعة تقدم الطالب الأكاديمي
              </span>
            )}
          </nav>

          {/* Zone 3: Role Switcher, Auth & Accessibility Action */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Streak Counter for Students */}
            {currentRole === 'student' && (
              <div 
                onClick={() => onTabChange('streak')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-semibold cursor-pointer hover:bg-amber-100 transition-colors"
                title="أيام الاستمرارية في التعلم اليومي"
              >
                <span>🔥</span>
                <span>{streakCount} أيام مستمرة</span>
              </div>
            )}

            {/* Role Switcher Menu */}
            <div className="relative flex items-center bg-slate-100 rounded-lg p-1 text-xs font-medium">
              <button
                onClick={() => { onRoleChange('student'); onTabChange('dashboard'); }}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                  currentRole === 'student' ? 'bg-white text-emerald-800 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                طالب
              </button>
              <button
                onClick={() => { onRoleChange('teacher'); onTabChange('teacher_classes'); }}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                  currentRole === 'teacher' ? 'bg-white text-emerald-800 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                معلم
              </button>
              <button
                onClick={() => { onRoleChange('admin'); onTabChange('admin_stats'); }}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                  currentRole === 'admin' ? 'bg-white text-emerald-800 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                إدارة
              </button>
              <button
                onClick={() => { onRoleChange('parent'); onTabChange('parent_view'); }}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                  currentRole === 'parent' ? 'bg-white text-emerald-800 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ولي أمر
              </button>
            </div>

            {/* Auth Trigger Button */}
            <button
              onClick={onOpenAuth}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                currentUser
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-emerald-800 border-emerald-800 text-white hover:bg-emerald-900'
              }`}
              title={currentUser ? 'حسابي المسجل' : 'تسجيل الدخول إلى المنصة'}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {currentUser ? (currentUser.displayName || 'حسابي') : 'تسجيل الدخول'}
              </span>
            </button>

            {/* Accessibility Button */}
            <button
              onClick={onOpenAccessibility}
              aria-label="خيارات إمكانية الوصول والشمولية"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
              title="خيارات إمكانية الوصول وقراءة الصوت وتكبير الخط"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
