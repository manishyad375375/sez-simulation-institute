
import React, { useState } from 'react';
import { User } from '../types';

interface Props {
  users: User[];
  currentUser: User | null;
  onSelect: (user: User) => void;
  onCreate: (name: string) => void;
  onClose: () => void;
}

const UserSwitcher: React.FC<Props> = ({ users, currentUser, onSelect, onCreate, onClose }) => {
  const [newName, setNewName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onCreate(newName.trim());
      setNewName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
      <div className="absolute inset-0 bg-slate-900/80 animate-in fade-in duration-500" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        <div className="p-8 md:p-12">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Identity Manager</h2>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Select an active profile</p>
            </div>
            <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {users.map(user => (
              <button
                key={user.id}
                onClick={() => onSelect(user)}
                className={`p-6 rounded-[2rem] border-2 transition-all flex items-center gap-5 text-left group ${
                  currentUser?.id === user.id 
                    ? 'border-indigo-600 bg-indigo-50 shadow-lg shadow-indigo-100' 
                    : 'border-slate-50 hover:border-slate-200 bg-slate-50'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl shadow-xl transition-transform group-hover:scale-110 ${currentUser?.id === user.id ? 'bg-indigo-600' : 'bg-slate-400'}`}>
                   <i className={`fa-solid ${user.avatar}`}></i>
                </div>
                <div>
                  <p className={`font-black tracking-tight ${currentUser?.id === user.id ? 'text-indigo-900' : 'text-slate-800'}`}>
                    {user.name}
                  </p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {user.rank}
                  </p>
                </div>
              </button>
            ))}

            {!isCreating ? (
              <button 
                onClick={() => setIsCreating(true)}
                className="p-6 rounded-[2rem] border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all flex items-center gap-5 text-left group"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 group-hover:bg-white transition-all">
                   <i className="fa-solid fa-plus text-xl"></i>
                </div>
                <div>
                  <p className="font-black text-slate-400 group-hover:text-indigo-600">New Profile</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initialize Student</p>
                </div>
              </button>
            ) : (
              <form onSubmit={handleCreate} className="col-span-1 md:col-span-2 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 animate-in slide-in-from-top-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Student Full Name</label>
                 <div className="flex gap-3">
                   <input 
                     autoFocus
                     type="text" 
                     value={newName}
                     onChange={(e) => setNewName(e.target.value)}
                     placeholder="Enter name..."
                     className="flex-1 bg-white border border-slate-200 px-6 py-4 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                   />
                   <button 
                     type="submit"
                     className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-indigo-700 active:scale-95 transition-all"
                   >
                     Deploy
                   </button>
                 </div>
              </form>
            )}
          </div>
        </div>
        
        <div className="bg-slate-50 p-8 border-t border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <i className="fa-solid fa-shield-halved text-indigo-500"></i>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest"></p>
           </div>
           <p className="text-[10px] font-black text-indigo-600 bg-indigo-100 px-3 py-1 rounded-lg">SYSTEM ACTIVE</p>
        </div>
      </div>
    </div>
  );
};

export default UserSwitcher;
