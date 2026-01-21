
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';

interface Props {
  users: User[];
  onSelect: (user: User) => void;
  onCreate: (userData: { name: string, email: string, password?: string }) => void;
  dbConnected: boolean;
}

const LoginInterface: React.FC<Props> = ({ users, onSelect, onCreate, dbConnected }) => {
  const [view, setView] = useState<'selection' | 'student-login' | 'student-register' | 'admin-login'>('selection');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  // Validation Logic
  const validations = {
    length: password.length >= 7,
    hasNumber: /\d/.test(password),
    hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    match: password === confirmPassword && confirmPassword.length > 0
  };

  const isPasswordValid = validations.length && validations.hasNumber && validations.hasSymbol && validations.match;

  // Track mouse for 3D parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 15;
      const y = (clientY / innerHeight - 0.5) * 15;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const resetForms = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setLoginError(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowValidation(false);
  };

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = users.find(u => 
      u.rank === 'Student' && 
      u.email?.toLowerCase() === email.trim().toLowerCase() && 
      u.password === password
    );

    if (found) {
      onSelect(found);
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const foundAdmin = users.find(u => 
      u.rank === 'Coach' && 
      u.email?.toLowerCase() === email.trim().toLowerCase() && 
      u.password === password
    );

    if (foundAdmin) {
      onSelect(foundAdmin);
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setShowValidation(true);
      return;
    }
    if (fullName.trim() && email.trim()) {
      onCreate({ name: fullName.trim(), email: email.trim(), password });
    }
  };

  const getTiltStyle = (intensity = 1, zDepth = 0) => ({
    transform: `rotateY(${mousePos.x * intensity}deg) rotateX(${-mousePos.y * intensity}deg) translateZ(${zDepth}px)`,
    transition: 'transform 0.1s ease-out',
    transformStyle: 'preserve-3d' as const
  });

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[200] bg-[#020617] flex flex-col font-sans overflow-y-auto overflow-x-hidden select-none"
      style={{ perspective: '1200px' }}
    >
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-950"></div>
        <div 
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage: `linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)`,
            backgroundSize: '100px 100px',
            transform: `rotateX(65deg) translateY(${mousePos.y * 2}px) translateZ(-300px)`,
            transformOrigin: 'top',
          }}
        ></div>
        <div 
          className="absolute top-1/4 left-1/4 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-indigo-600/10 rounded-full blur-[120px] transition-transform duration-500 ease-out"
          style={{ transform: `translate(${mousePos.x * -5}px, ${mousePos.y * -5}px)` }}
        ></div>
        <div 
          className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-cyan-600/10 rounded-full blur-[120px] transition-transform duration-500 ease-out"
          style={{ transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)` }}
        ></div>
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center p-4 md:p-8 z-10">
        
        {/* Dynamic Header - Responsive Sizes */}
        <div 
          className="mb-8 md:mb-16 text-center animate-in fade-in slide-in-from-top-6 duration-1000 w-full"
          style={getTiltStyle(0.1, 40)}
        >
           <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 backdrop-blur-2xl rounded-full border border-white/10 mb-6 shadow-2xl">
              <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.8)]"></div>
              <span className="text-[10px] md:text-xs font-black text-indigo-200 uppercase tracking-[0.4em] md:tracking-[0.6em]">Shreeji Education Zone</span>
           </div>
           <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-white tracking-tighter mb-2 md:mb-4 drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
             Simulation <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-[length:200%_auto] animate-[gradient_8s_linear_infinite]">Learning Hub</span>
           </h1>
           <p className="text-slate-500 font-bold uppercase tracking-[0.2em] md:tracking-[0.4em] text-[9px] md:text-xs opacity-60">Interactive Virtual Labs for Smarter Learning</p>
        </div>

        {/* Auth Interface Grid - Optimized for Mobile (Stack) to Desktop (Side-by-Side) */}
        <div className="w-full flex justify-center px-2">
          {view === 'selection' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full max-w-4xl animate-in zoom-in-95 duration-700">
              {/* Student Portal Card */}
              <div 
                role="button"
                onClick={() => { setView('student-login'); resetForms(); }}
                style={getTiltStyle(0.5, 20)}
                className="group relative min-h-[260px] md:h-[380px] cursor-pointer transition-all duration-300 active:scale-95"
              >
                <div className="absolute inset-0 bg-indigo-600/10 rounded-[2.5rem] md:rounded-[3.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative h-full bg-white/5 backdrop-blur-[32px] rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-10 border border-white/10 group-hover:border-indigo-500/50 group-hover:bg-white/[0.08] shadow-2xl transition-all duration-500 flex flex-col justify-between overflow-hidden">
                  <div className="relative z-10" style={{ transform: 'translateZ(50px)' }}>
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-indigo-600 rounded-2xl md:rounded-3xl flex items-center justify-center text-white text-2xl md:text-3xl mb-4 md:mb-8 shadow-xl group-hover:scale-110 transition-transform">
                      <i className="fa-solid fa-user-graduate"></i>
                    </div>
                    <h3 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-2 md:mb-4">Student Portal</h3>
                    <p className="text-slate-400 font-medium text-[10px] md:text-sm leading-relaxed max-w-[280px]">
                      Your gateway to interactive virtual learning.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 text-indigo-400 font-black text-[10px] md:text-xs uppercase tracking-widest group-hover:gap-6 transition-all">
                    <span>Student Login</span>
                    <i className="fa-solid fa-arrow-right-long animate-pulse"></i>
                  </div>
                </div>
              </div>

              {/* Admin Portal Card */}
              <div 
                role="button"
                onClick={() => { setView('admin-login'); resetForms(); }}
                style={getTiltStyle(0.5, 20)}
                className="group relative min-h-[260px] md:h-[380px] cursor-pointer transition-all duration-300 active:scale-95"
              >
                <div className="absolute inset-0 bg-amber-600/10 rounded-[2.5rem] md:rounded-[3.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative h-full bg-slate-900/40 backdrop-blur-[32px] rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-10 border border-white/5 group-hover:border-amber-500/50 group-hover:bg-slate-900/60 shadow-2xl transition-all duration-500 flex flex-col justify-between overflow-hidden">
                  <div className="relative z-10" style={{ transform: 'translateZ(50px)' }}>
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-500 rounded-2xl md:rounded-3xl flex items-center justify-center text-slate-950 text-2xl md:text-3xl mb-4 md:mb-8 shadow-xl group-hover:scale-110 transition-transform">
                      <i className="fa-solid fa-user-shield"></i>
                    </div>
                    <h3 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-2 md:mb-4">Faculty Admin</h3>
                    <p className="text-slate-400 font-medium text-[10px] md:text-sm leading-relaxed max-w-[280px]">
                      Advanced tools for simulation management and performance analytics.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 text-amber-500 font-black text-[10px] md:text-xs uppercase tracking-widest group-hover:gap-6 transition-all">
                    <span>Admin Login</span>
                    <i className="fa-solid fa-fingerprint animate-pulse"></i>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Authentication Forms - Precise Form Size, Responsive Header */}
          {(view === 'student-login' || view === 'student-register' || view === 'admin-login') && (
            <div 
              style={getTiltStyle(0.2, 30)}
              className={`w-full ${view === 'admin-login' ? 'max-w-[400px]' : 'max-w-[460px]'} bg-slate-900/90 backdrop-blur-3xl rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-12 shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-500`}
            >
              {view !== 'admin-login' ? (
                <>
                  <div className="flex justify-between items-center mb-6 md:mb-10 pb-4 md:pb-6 border-b border-white/5">
                    <button onClick={() => setView('selection')} className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-indigo-400 transition-colors flex items-center gap-3 group">
                      <i className="fa-solid fa-chevron-left group-hover:-translate-x-1 transition-transform"></i> Back
                    </button>
                    <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">
                      {view === 'student-login' ? 'Login' : 'Enroll'}
                    </h2>
                  </div>

                  <form onSubmit={view === 'student-login' ? handleStudentLogin : handleRegister} className="space-y-4 md:space-y-6">
                    <div className="space-y-4">
                      {view === 'student-register' && (
                        <div className="relative group">
                          <i className="fa-solid fa-user absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 text-sm"></i>
                          <input 
                            type="text" required placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/10 text-white px-14 py-4 md:py-4.5 rounded-2xl font-bold text-sm focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700"
                          />
                        </div>
                      )}
                      <div className="relative group">
                        <i className="fa-solid fa-envelope absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 text-sm"></i>
                        <input 
                          type="email" required placeholder="Student Email" value={email} onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/10 text-white px-14 py-4 md:py-4.5 rounded-2xl font-bold text-sm focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700"
                        />
                      </div>
                      <div className="relative group">
                        <i className="fa-solid fa-key absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 text-sm"></i>
                        <input 
                          type={showPassword ? "text" : "password"} required placeholder="Password" value={password} onChange={(e) => {
                            setPassword(e.target.value);
                            if (view === 'student-register') setShowValidation(true);
                          }}
                          className="w-full bg-white/[0.03] border border-white/10 text-white px-14 py-4 md:py-4.5 rounded-2xl font-bold text-sm focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 hover:text-indigo-400 transition-colors">
                          <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                        </button>
                      </div>
                      {view === 'student-register' && (
                        <div className="relative group">
                          <i className="fa-solid fa-lock-open absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 text-sm"></i>
                          <input 
                            type={showConfirmPassword ? "text" : "password"} required placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full bg-white/[0.03] border px-14 py-4 md:py-4.5 rounded-2xl font-bold text-sm focus:outline-none transition-all placeholder:text-slate-700 ${confirmPassword && !validations.match ? 'border-rose-500/50 text-rose-200' : 'border-white/10 text-white focus:border-indigo-500/50'}`}
                          />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 hover:text-indigo-400 transition-colors">
                            <i className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                          </button>
                        </div>
                      )}
                    </div>

                    {view === 'student-register' && showValidation && (
                      <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5 space-y-2 text-[9px] md:text-[10px]">
                        <ValidationItem label="Minimum 7 characters" active={validations.length} />
                        <ValidationItem label="Contains a number" active={validations.hasNumber} />
                        <ValidationItem label="Special character" active={validations.hasSymbol} />
                        <ValidationItem label="Keys match exactly" active={validations.match} />
                      </div>
                    )}

                    {loginError && (
                      <p className="text-rose-500 text-[10px] font-black uppercase text-center animate-pulse">Identity sync failed</p>
                    )}

                    <div className="flex flex-col gap-3">
                      <button type="submit" disabled={!dbConnected || (view === 'student-register' && !isPasswordValid)} className={`w-full py-4 md:py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 ${isPasswordValid || view === 'student-login' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}>
                        {view === 'student-login' ? 'Login' : 'Enroll Now'}
                      </button>
                      <button type="button" onClick={() => { setView(view === 'student-login' ? 'student-register' : 'student-login'); resetForms(); }} className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-indigo-400 transition-colors text-center">
                        {view === 'student-login' ? "New Here? Register Account" : "Existing Profile? Sync Login"}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-500/10 border border-amber-500/30 rounded-3xl flex items-center justify-center text-amber-500 text-3xl md:text-4xl mb-6 shadow-2xl">
                     <i className="fa-solid fa-shield-halved"></i>
                  </div>
                  <h3 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight text-center leading-none">Admin Access Portal</h3>
                  <p className="text-[10px] md:text-[12px] font-black text-amber-500 uppercase tracking-[0.4em] mb-10 opacity-60">Authorised Admin Access</p>
                  
                  <form onSubmit={handleAdminLogin} className="w-full space-y-4 md:space-y-6">
                    <div className="space-y-4">
                      <div className="relative group">
                        <i className="fa-solid fa-envelope absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-500 transition-colors text-sm"></i>
                        <input 
                          type="email" required placeholder="Admin Email" value={email} onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/10 text-white px-14 py-4 md:py-4.5 rounded-2xl font-bold text-sm focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-slate-700 shadow-inner"
                        />
                      </div>
                      <div className="relative group">
                        <i className="fa-solid fa-key absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-500 transition-colors text-sm"></i>
                        <input 
                          type={showPassword ? "text" : "password"} required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/10 text-white px-14 py-4 md:py-4.5 rounded-2xl font-bold text-sm focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-slate-700 shadow-inner"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 hover:text-amber-500 transition-colors">
                          <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                        </button>
                      </div>
                    </div>

                    {loginError && (
                      <p className="text-rose-500 text-[10px] font-black uppercase text-center animate-pulse tracking-widest">Authorization Access Denied</p>
                    )}
                    
                    <div className="flex flex-col gap-3">
                       <button type="submit" className="w-full py-4 md:py-5 bg-amber-500 text-slate-950 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-amber-950/20 hover:bg-amber-400 transition-all hover:scale-[1.02] active:scale-95">
                         Login
                       </button>
                       <button type="button" onClick={() => setView('selection')} className="w-full py-3 md:py-4 bg-white/5 text-slate-500 border border-white/5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                         Return to Home
                       </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Persistent Footer - Always Bottom */}
      <div className="py-8 w-full text-center z-10 mt-auto animate-in fade-in duration-1000 delay-500">
         <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] md:tracking-[0.6em] opacity-40">© 2026 Shreeji Education Zone</p>
      </div>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active  {
          -webkit-box-shadow: 0 0 0 1000px #1a1a1a inset !important;
          -webkit-text-fill-color: white !important;
        }
      `}</style>
    </div>
  );
};

const ValidationItem = ({ label, active }: { label: string, active: boolean }) => (
  <div className={`flex items-center gap-3 font-bold ${active ? 'text-emerald-400' : 'text-slate-500'} transition-colors duration-300`}>
    <i className={`fa-solid ${active ? 'fa-circle-check text-emerald-400' : 'fa-circle-dot opacity-40'} text-[8px]`}></i>
    <span className="tracking-tight">{label}</span>
  </div>
);

export default LoginInterface;
