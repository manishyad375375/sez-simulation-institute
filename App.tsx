
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SimulationInfo, User, UserProgress } from './types';
import { db } from './firebase';
import { ref, onValue, set, update } from 'firebase/database';
import Sidebar from './components/Sidebar';
import LibraryView from './components/LibraryView';
import LoginInterface from './components/LoginInterface';
import AdminDashboard from './components/AdminDashboard';
import ProjectileSimulation from './simulations/ProjectileSimulation';
import CellSimulation from './simulations/CellSimulation';
import ChemistrySimulation from './simulations/ChemistrySimulation';
import PulleySimulation from './simulations/PulleySimulation';
import GeometrySimulation from './simulations/GeometrySimulation';
import CircuitSimulation from './simulations/CircuitSimulation';
import MatterSimulation from './simulations/MatterSimulation';
import SolarSimulation from './simulations/SolarSimulation';
import LogicSimulation from './simulations/LogicSimulation';
import EconomicsSimulation from './simulations/EconomicsSimulation';

const SIMULATIONS: SimulationInfo[] = [
  { id: 'sim-1', number: 1, title: 'Projectile Motion', subject: 'Physics / Math', concept: 'Quadratic Curves', icon: 'fa-rocket', color: 'bg-indigo-600', status: 'available' },
  { id: 'sim-2', number: 2, title: 'Cell Inspector', subject: 'Biology', concept: 'Plant vs Animal Cells', icon: 'fa-microscope', color: 'bg-emerald-600', status: 'available' },
  { id: 'sim-3', number: 3, title: 'Equation Balance', subject: 'Chemistry', concept: 'Conservation of Mass', icon: 'fa-scale-balanced', color: 'bg-amber-600', status: 'available' },
  { id: 'sim-4', number: 4, title: 'Pulley & Force Lab', subject: 'Physics', concept: 'Mechanical Advantage', icon: 'fa-weight-hanging', color: 'bg-rose-600', status: 'available' },
  { id: 'sim-5', number: 5, title: 'Triangle Maker', subject: 'Math', concept: 'Geometry & Angles', icon: 'fa-draw-polygon', color: 'bg-cyan-600', status: 'available' },
  { id: 'sim-6', number: 6, title: 'Circuit Builder', subject: 'Physics', concept: "Ohm's Law", icon: 'fa-bolt', color: 'bg-yellow-500', status: 'available' },
  { id: 'sim-7', number: 7, title: 'States of Matter', subject: 'Chemistry', concept: 'Particle Dynamics', icon: 'fa-fire', color: 'bg-orange-600', status: 'available' },
  { id: 'sim-8', number: 8, title: 'Solar Scale', subject: 'Astronomy', concept: "Kepler's Laws", icon: 'fa-sun', color: 'bg-blue-600', status: 'available' },
  { id: 'sim-9', number: 9, title: 'Binary Logic', subject: 'CompSci', concept: 'Logic Gates', icon: 'fa-microchip', color: 'bg-teal-600', status: 'available' },
  { id: 'sim-10', number: 10, title: 'Market Dynamics', subject: 'Economics', concept: 'Supply & Demand', icon: 'fa-chart-line', color: 'bg-purple-600', status: 'available' },
];

const STORAGE_KEY_CURRENT_USER = 'sez_current_user_id';

const App: React.FC = () => {
  const [currentSimId, setCurrentSimId] = useState<string | null>(null);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [dbConnected, setDbConnected] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  
  // Database States
  const [users, setUsers] = useState<User[]>([]);
  const [progress, setProgress] = useState<Record<string, UserProgress>>({});
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // 1. Monitor Connectivity Status
  useEffect(() => {
    const connectedRef = ref(db, '.info/connected');
    return onValue(connectedRef, (snap) => {
      setDbConnected(!!snap.val());
      if (snap.val()) setDbError(null);
    });
  }, []);

  // 2. Synchronize Users and Ensure Admin Account Existence
  useEffect(() => {
    const usersRef = ref(db, 'users');
    const unsubscribe = onValue(usersRef, 
      async (snapshot) => {
        const data = snapshot.val();
        let userList: User[] = [];
        
        if (data) {
          userList = Object.values(data) as User[];
        }

        // Specifically check for the demo admin account
        const adminExists = userList.find(u => u.email === 'demo@sez.com');
        
        if (!adminExists) {
          console.log("Admin account missing. Initializing demo@sez.com...");
          const defaultAdmin: User = { 
            id: 'admin', 
            name: 'Institute Admin', 
            avatar: 'fa-user-shield', 
            rank: 'Coach', 
            email: 'demo@sez.com',
            password: 'admin123',
            joinedAt: new Date().toISOString() 
          };
          await set(ref(db, 'users/admin'), defaultAdmin);
        }

        setUsers(userList);

        const savedId = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
        if (savedId && !currentUser) {
          const found = userList.find(u => u.id === savedId);
          if (found) setCurrentUser(found);
        }
        
        setIsInitialLoad(false);
      },
      (error) => {
        console.error("Firebase Read Error (Users):", error);
        setDbError("Access Denied: Check Database Rules");
        setIsInitialLoad(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // 3. Synchronize Progress from Firebase
  useEffect(() => {
    const progressRef = ref(db, 'progress');
    const unsubscribe = onValue(progressRef, 
      (snapshot) => {
        const data = snapshot.val();
        if (data) setProgress(data);
      },
      (error) => {
        console.error("Firebase Read Error (Progress):", error);
      }
    );
    return () => unsubscribe();
  }, []);

  // Sync session ID to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_CURRENT_USER, currentUser.id);
    } else {
      localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeSim = SIMULATIONS.find(s => s.id === currentSimId);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleUpdateProgress = async (simId: string, score: number) => {
    if (!currentUser) return;
    setIsSyncing(true);
    try {
      const existingScore = progress[currentUser.id]?.[simId]?.score || 0;
      await update(ref(db), {
        [`progress/${currentUser.id}/${simId}`]: {
          completed: true,
          score: Math.max(score, existingScore),
          lastAccessed: new Date().toISOString()
        }
      });
    } catch (err) {
      console.error("Update Failed:", err);
      setDbError("Write Failed: Check Permissions");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleToggleComplete = async (simId: string) => {
    if (!currentUser) return;
    setIsSyncing(true);
    try {
      const userProg = progress[currentUser.id] || {};
      const isCompleted = !!userProg[simId]?.completed;
      await update(ref(db), {
        [`progress/${currentUser.id}/${simId}`]: {
          completed: !isCompleted,
          score: !isCompleted ? 100 : 0,
          lastAccessed: new Date().toISOString()
        }
      });
    } catch (err) {
      console.error("Toggle Failed:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const currentUserProgress = useMemo(() => {
    return currentUser ? progress[currentUser.id] || {} : {};
  }, [currentUser, progress]);

  const handleCreateUser = async (userData: { name: string, email: string, password?: string }) => {
    setIsSyncing(true);
    try {
      const id = `SEZ-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`;
      const newUser: User = {
        id,
        name: userData.name,
        email: userData.email,
        password: userData.password,
        avatar: ['fa-user-graduate', 'fa-user-astronaut', 'fa-user-ninja', 'fa-user-tie'][Math.floor(Math.random() * 4)],
        rank: 'Student',
        joinedAt: new Date().toISOString()
      };
      await set(ref(db, `users/${id}`), newUser);
      setCurrentUser(newUser);
    } catch (err) {
      console.error("Creation Failed:", err);
      setDbError("Registration Denied");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentSimId(null);
    setIsAdminView(false);
    setIsSidebarOpen(false);
    setIsProfileMenuOpen(false);
  };

  const renderContent = () => {
    if (isAdminView && currentUser?.rank === 'Coach') {
      return <AdminDashboard users={users} allProgress={progress} simulations={SIMULATIONS} />;
    }

    if (currentSimId) {
      const commonProps = { onComplete: (score: number) => handleUpdateProgress(currentSimId!, score) };
      switch (currentSimId) {
        case 'sim-1': return <ProjectileSimulation {...commonProps} />;
        case 'sim-2': return <CellSimulation />;
        case 'sim-3': return <ChemistrySimulation />;
        case 'sim-4': return <PulleySimulation />;
        case 'sim-5': return <GeometrySimulation />;
        case 'sim-6': return <CircuitSimulation />;
        case 'sim-7': return <MatterSimulation />;
        case 'sim-8': return <SolarSimulation />;
        case 'sim-9': return <LogicSimulation />;
        case 'sim-10': return <EconomicsSimulation />;
        default: return null;
      }
    }

    return (
      <LibraryView 
        simulations={SIMULATIONS} 
        onSelect={setCurrentSimId} 
        userProgress={currentUserProgress}
      />
    );
  };

  if (isInitialLoad) {
    return (
      <div className="fixed inset-0 bg-[#020617] flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Initializing Cloud Session...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginInterface users={users} onSelect={setCurrentUser} onCreate={handleCreateUser} dbConnected={dbConnected} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex overflow-hidden h-screen relative font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 animate-in fade-in duration-700">
      <div 
        className={`fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm transition-opacity duration-500 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={toggleSidebar} 
      />
      
      <div className={`fixed inset-y-0 left-0 z-[70] w-80 transform transition-transform duration-500 ease-in-out shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar 
          simulations={SIMULATIONS} 
          activeId={currentSimId} 
          userProgress={currentUserProgress}
          isAdmin={currentUser?.rank === 'Coach'}
          isAdminActive={isAdminView}
          onSelectAdmin={() => { setIsAdminView(true); setCurrentSimId(null); setIsSidebarOpen(false); }}
          onSelect={(id) => { 
            setCurrentSimId(id); 
            setIsAdminView(false);
            setIsSidebarOpen(false); 
          }} 
          onToggleComplete={handleToggleComplete}
          onSwitchUser={handleLogout}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative w-full">
        <header className="bg-white border-b border-slate-200 px-6 md:px-10 py-5 flex items-center justify-between sticky top-0 z-[50] shadow-sm flex-none">
          <div className="flex items-center gap-3 md:gap-5">
            <button 
              onClick={toggleSidebar} 
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border-2 shadow-sm ${isSidebarOpen ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}`}
            >
              <i className={`fa-solid ${isSidebarOpen ? 'fa-bars' : 'fa-bars-staggered'}`}></i>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>
            {(currentSimId || isAdminView) && (
              <button 
                onClick={() => { setCurrentSimId(null); setIsAdminView(false); }} 
                className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-100 hover:bg-slate-50 flex items-center justify-center text-slate-500 transition-all shadow-sm"
              >
                <i className="fa-solid fa-house-user text-sm"></i>
              </button>
            )}
            <div className="ml-1 max-w-[150px] sm:max-w-none">
              <div className="flex items-center gap-2">
                <h1 className="font-black text-lg md:text-2xl text-slate-900 truncate tracking-tight">
                  {isAdminView ? 'Admin Console' : (activeSim ? activeSim.title : 'SEZ Simulator')}
                </h1>
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${dbConnected ? 'border-emerald-100 bg-emerald-50 text-emerald-600' : 'border-rose-100 bg-rose-50 text-rose-600'}`}>
                   <span className={`w-1 h-1 rounded-full ${dbConnected ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></span>
                   {dbConnected ? 'Live' : 'Offline'}
                </div>
                {isSyncing && <i className="fa-solid fa-cloud-arrow-up text-indigo-400 text-xs animate-bounce"></i>}
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${activeSim || isAdminView ? 'bg-indigo-500 animate-pulse' : 'bg-slate-300'}`}></span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] truncate">
                  {isAdminView ? 'Institutional Analytics' : (activeSim ? `Module ${activeSim.number} • ${activeSim.subject}` : 'Cloud Synced Interface')}
                </p>
              </div>
            </div>
          </div>
          
          <div className="relative" ref={profileMenuRef}>
            <div 
              className="flex items-center gap-4 cursor-pointer group" 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            >
               <div className="hidden md:flex flex-col items-end mr-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Access Node</p>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{currentUser?.name}</p>
               </div>
               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl ring-4 ring-white transition-all group-hover:scale-105 ${isProfileMenuOpen ? 'ring-indigo-100 scale-105' : ''} ${currentUser?.rank === 'Coach' ? 'bg-amber-500' : 'bg-indigo-600'}`}>
                 <i className={`fa-solid ${currentUser?.avatar || 'fa-user-shield'} text-lg`}></i>
               </div>
            </div>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-4 w-72 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-6 animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-300 z-[100]">
                {dbError && (
                  <div className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-[9px] font-black text-rose-600 uppercase">
                    <i className="fa-solid fa-triangle-exclamation"></i> {dbError}
                  </div>
                )}
                <div className="flex flex-col items-center text-center pb-6 border-b border-slate-50 mb-4">
                  <div className={`w-20 h-20 rounded-3xl mb-4 flex items-center justify-center text-white text-3xl shadow-2xl ${currentUser?.rank === 'Coach' ? 'bg-amber-500' : 'bg-indigo-600'}`}>
                    <i className={`fa-solid ${currentUser?.avatar}`}></i>
                  </div>
                  <h3 className="font-black text-lg text-slate-900 leading-tight">{currentUser?.name}</h3>
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">{currentUser?.rank} Access</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 overflow-hidden relative group">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Network Identifier</p>
                    <p className="text-xs font-mono font-bold text-slate-700 truncate">{currentUser?.id}</p>
                    <i className="fa-solid fa-fingerprint absolute -bottom-2 -right-2 text-4xl opacity-5 group-hover:opacity-10 transition-opacity"></i>
                  </div>

                  {currentUser?.rank === 'Coach' && !isAdminView && (
                    <button 
                      onClick={() => { setIsAdminView(true); setIsProfileMenuOpen(false); }}
                      className="w-full py-3.5 rounded-2xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 border border-amber-200"
                    >
                      <i className="fa-solid fa-gauge-high"></i>
                      Admin Dashboard
                    </button>
                  )}

                  <button 
                    onClick={handleLogout}
                    className="w-full py-4 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 group/btn"
                  >
                    <i className="fa-solid fa-power-off group-hover:rotate-12 transition-transform"></i>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-10 lg:p-14 custom-scrollbar bg-white">
          <div className="max-w-[1600px] mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
