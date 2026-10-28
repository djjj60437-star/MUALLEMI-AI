import React, { useState } from 'react';
import { 
  auth, 
  googleProvider, 
  db, 
  handleFirestoreError, 
  OperationType 
} from '../firebase';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { UserRole, GradeLevel } from '../types';
import { X, LogIn, UserPlus, LogOut, CheckCircle2, ShieldCheck, Mail, Lock, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: FirebaseUser | null;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  selectedGrade: GradeLevel;
  onGradeChange: (grade: GradeLevel) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  userRole,
  onRoleChange,
  selectedGrade,
  onGradeChange,
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const saveUserProfile = async (user: FirebaseUser, roleToSave: UserRole) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: displayName || user.displayName || 'طالب معلّمي',
        role: roleToSave,
        grade: selectedGrade,
        streakDays: 4,
        points: 240,
        createdAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await saveUserProfile(result.user, userRole);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'فشل تسجيل الدخول باستخدام حساب Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('يرجى ملء جميع الحقول المطلوبة.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      if (isRegisterMode) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await saveUserProfile(result.user, userRole);
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        // Check stored profile
        const docRef = doc(db, 'users', result.user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.role) onRoleChange(data.role as UserRole);
          if (data.grade) onGradeChange(data.grade as GradeLevel);
        }
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setErrorMsg('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('هذا البريد الإلكتروني مسجل مسبقاً، يرجى اختيار تسجيل الدخول.');
      } else {
        setErrorMsg(err.message || 'حدث خطأ أثناء الاتصال بخدمة Firebase.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div 
        role="dialog"
        aria-modal="true"
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-800"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              🔒
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              {currentUser ? 'حسابي في معلّمي AI' : isRegisterMode ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {currentUser ? (
          /* User Logged In Profile */
          <div className="py-6 space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-800 text-white font-black text-2xl mx-auto flex items-center justify-center shadow-md">
              {(currentUser.displayName || currentUser.email || 'M')[0].toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {currentUser.displayName || 'طالب معلّمي'}
              </h3>
              <p className="text-xs text-slate-500 dir-ltr">{currentUser.email}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 text-right">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">نوع الحساب والمدخل:</span>
                <span className="font-bold text-emerald-800">
                  {userRole === 'student' ? 'طالب' : userRole === 'teacher' ? 'معلم' : userRole === 'admin' ? 'إدارة' : 'ولي أمر'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">حالة الربط:</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>متصل بـ Firebase (arctic-ceremony)</span>
                </span>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج من الحساب</span>
            </button>
          </div>
        ) : (
          /* Auth Form */
          <div className="py-4 space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {errorMsg}
              </div>
            )}

            {/* Quick Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 px-4 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>تسجيل الدخول بنقرة واحدة بـ Google</span>
            </button>

            <div className="flex items-center my-3 text-xs text-slate-400">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="px-3">أو باستخدام البريد الإلكتروني</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailAuth} className="space-y-3 text-xs">
              {isRegisterMode && (
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">الاسم الكامل:</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="مثال: أحمد محمود القضاة"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">البريد الإلكتروني:</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full pr-8 pl-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none dir-ltr text-right"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute right-2.5 top-3" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">كلمة المرور:</label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pr-8 pl-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none dir-ltr text-right"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-2.5 top-3" />
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <label className="font-semibold text-slate-700">دور المستخدم الرئيسي:</label>
                <select
                  value={userRole}
                  onChange={(e) => onRoleChange(e.target.value as UserRole)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none font-medium"
                >
                  <option value="student">طالب (المناهج والتوجيهي)</option>
                  <option value="teacher">معلم مدرسية</option>
                  <option value="admin">إدارة مدرسية</option>
                  <option value="parent">ولي أمر</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-xl font-bold shadow-sm transition-all flex items-center justify-center gap-2 mt-4"
              >
                {isRegisterMode ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                <span>{isRegisterMode ? 'إنشاء حساب جديد' : 'الدخول إلى الحساب'}</span>
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsRegisterMode(!isRegisterMode)}
                className="text-xs text-emerald-800 font-semibold hover:underline"
              >
                {isRegisterMode ? 'لديك حساب بالفعل؟ سجل دخولك من هنا' : 'ليس لديك حساب؟ أنشئ حسابك الجديد الآن'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
