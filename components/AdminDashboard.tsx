
import React, { useState, useMemo } from 'react';
import { User, UserProgress, SimulationInfo, ModuleProgress } from '../types';

interface Props {
  users: User[];
  allProgress: Record<string, UserProgress>;
  simulations: SimulationInfo[];
}

const AdminDashboard: React.FC<Props> = ({ users, allProgress, simulations }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'name' | 'progress'>('name');

  const students = useMemo(() => users.filter(u => u.rank === 'Student'), [users]);

  const stats = useMemo(() => {
    let totalCompletions = 0;
    let totalScore = 0;
    let scoreCount = 0;
    const simCounts: Record<string, number> = {};

    students.forEach(s => {
      const prog = (allProgress[s.id] || {}) as UserProgress;
      (Object.entries(prog) as [string, ModuleProgress][]).forEach(([simId, data]) => {
        if (data.completed) {
          totalCompletions++;
          totalScore += data.score;
          scoreCount++;
          simCounts[simId] = (simCounts[simId] || 0) + 1;
        }
      });
    });

    const avgScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;
    const popularSimId = Object.entries(simCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    const popularSim = simulations.find(s => s.id === popularSimId)?.title || 'N/A';

    return { totalCompletions, avgScore, popularSim, studentCount: students.length, simCounts };
  }, [students, allProgress, simulations]);

  const subjectStats = useMemo(() => {
    const subjects: Record<string, { total: number; completed: number }> = {};
    
    simulations.forEach(sim => {
      const subName = sim.subject.split(' / ')[0];
      if (!subjects[subName]) {
        subjects[subName] = { total: 0, completed: 0 };
      }
      subjects[subName].total += students.length;
      
      students.forEach(s => {
        const prog = allProgress[s.id]?.[sim.id];
        if (prog?.completed) {
          subjects[subName].completed += 1;
        }
      });
    });

    return Object.entries(subjects).map(([name, data]) => ({
      name,
      percent: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
      count: data.completed
    })).sort((a, b) => b.percent - a.percent);
  }, [students, allProgress, simulations]);

  const studentData = useMemo(() => {
    return students.map(s => {
      const prog = (allProgress[s.id] || {}) as UserProgress;
      const completedCount = (Object.values(prog) as ModuleProgress[]).filter(p => p.completed).length;
      const progressPercent = (completedCount / simulations.length) * 100;
      const lastActive = (Object.values(prog) as ModuleProgress[]).sort((a, b) => 
        new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime()
      )[0]?.lastAccessed || s.joinedAt;
      
      return { ...s, completedCount, progressPercent, lastActive };
    })
    .filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortField === 'progress') return b.progressPercent - a.progressPercent;
      return a.name.localeCompare(b.name);
    });
  }, [students, allProgress, simulations, searchQuery, sortField]);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard label="Active Students" value={stats.studentCount} icon="fa-users" color="bg-indigo-600" />
        <StatCard label="Total Completions" value={stats.totalCompletions} icon="fa-circle-check" color="bg-emerald-600" />
        <StatCard label="Avg. Score" value={`${stats.avgScore}%`} icon="fa-brain" color="bg-amber-500" />
        <StatCard label="Top Module" value={stats.popularSim} icon="fa-star" color="bg-purple-600" isString />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Module Engagement Chart - Switched to Horizontal for better alignment */}
        <div className="lg:col-span-8 bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 border border-slate-200 shadow-xl flex flex-col">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Module Engagement</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Cohort Performance Analytics</p>
            </div>
            <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Real-time Metrics</span>
            </div>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            {simulations.map((sim) => {
              const count = stats.simCounts[sim.id] || 0;
              const percent = stats.studentCount > 0 ? Math.round((count / stats.studentCount) * 100) : 0;
              return (
                <div key={sim.id} className="group flex flex-col gap-2">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3">
                       <div className={`w-8 h-8 rounded-xl ${sim.color} flex items-center justify-center text-white text-[10px] shadow-lg group-hover:scale-110 transition-transform`}>
                          <i className={`fa-solid ${sim.icon}`}></i>
                       </div>
                       <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Module {sim.number}</p>
                          <p className="text-sm font-black text-slate-800 leading-none group-hover:text-indigo-600 transition-colors">{sim.title}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Engagement</span>
                       <span className="text-xs font-black text-slate-900 tabular-nums">
                         {count} <span className="text-[9px] text-slate-400">/ {stats.studentCount}</span>
                       </span>
                    </div>
                  </div>
                  <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 relative shadow-inner">
                    <div 
                      className={`h-full ${sim.color} transition-all duration-1000 ease-out shadow-lg relative overflow-hidden`}
                      style={{ width: `${percent}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subject Wise Report */}
        <div className="lg:col-span-4 bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 text-white shadow-2xl border border-slate-800 flex flex-col">
          <div className="mb-8">
            <h3 className="text-xl font-black tracking-tight">Subject Proficiency</h3>
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">Cohort Breakdown</p>
          </div>
          <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
            {subjectStats.map((sub, idx) => (
              <div key={sub.name} className="space-y-2 group">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Subject</p>
                    <p className="text-xs font-black text-white group-hover:text-indigo-400 transition-colors">{sub.name}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Proficiency</span>
                    <span className="text-sm font-black tabular-nums">{sub.percent}%</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                    style={{ width: `${sub.percent}%`, transitionDelay: `${idx * 100}ms` }}
                  ></div>
                </div>
              </div>
            ))}
            
            <div className="pt-6 border-t border-white/10 mt-6">
              <div className="bg-white/5 rounded-2xl p-5 border border-white/5 relative overflow-hidden group">
                 <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2">Faculty Directive</p>
                 <p className="text-xs font-medium text-slate-300 leading-relaxed italic">
                   "Monitor subject-specific proficiency to identify curricula gaps in the current cohort."
                 </p>
                 <i className="fa-solid fa-chart-line absolute -bottom-4 -right-2 text-4xl opacity-5 group-hover:opacity-10 transition-opacity"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Student Roster Table */}
        <div className="lg:col-span-12 bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden">
          <div className="p-6 md:p-10 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Enrollment Registry</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Comprehensive Student Performance Data</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative group flex-1 sm:min-w-[240px]">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"></i>
                <input 
                  type="text" 
                  placeholder="Search student ID or name..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 pl-12 pr-6 py-3 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
              <select 
                value={sortField}
                onChange={(e) => setSortField(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
              >
                <option value="name">Sort by Name</option>
                <option value="progress">Sort by Progress</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Identity</th>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Access ID</th>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Module Progress</th>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Last Active</th>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {studentData.length > 0 ? studentData.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                          <i className={`fa-solid ${s.avatar}`}></i>
                        </div>
                        <span className="font-black text-slate-800 tracking-tight">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-lg">{s.id}</span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden min-w-[120px]">
                          <div 
                            className="bg-indigo-500 h-full transition-all duration-1000 shadow-[0_0_8px_rgba(99,102,241,0.3)]" 
                            style={{ width: `${s.progressPercent}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-black text-slate-600 tabular-nums">{s.completedCount}/{simulations.length}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                        {new Date(s.lastActive).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                       <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${s.progressPercent === 100 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                         {s.progressPercent === 100 ? 'Complete' : 'In Progress'}
                       </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-10 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-30">
                        <i className="fa-solid fa-magnifying-glass text-6xl"></i>
                        <p className="text-[11px] font-black uppercase tracking-widest">No matching students found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color, isString = false }: any) => (
  <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-xl flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
    <div className="flex justify-between items-start mb-6">
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform`}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div className="bg-slate-50 px-3 py-1 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-widest">Global Range</div>
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`font-black text-slate-900 tracking-tighter truncate ${isString ? 'text-xl' : 'text-3xl md:text-4xl'}`}>{value}</p>
    </div>
  </div>
);

export default AdminDashboard;
