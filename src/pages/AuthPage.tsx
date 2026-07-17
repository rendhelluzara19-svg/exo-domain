import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ShieldAlert, Fingerprint } from 'lucide-react';
import { Role } from '@/types';

export function AuthPage() {
  const { users, setCurrentUser, registerUser } = useApp();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await registerUser({
        email,
        password,
        name: 'New User',
        role: 'BUYER' as Role,
        status: 'APPROVED',
      });
      window.location.href = '/'; 
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);
      
      if (user) {
        if (user.status === 'PENDING') throw new Error('Account pending approval.');
        setCurrentUser(user);
        window.location.href = '/'; 
      } else {
        throw new Error('Invalid email or password.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      {/* Login Form */}
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-white mb-8 text-center tracking-tighter">Exo Domain</h1>
        
        <form onSubmit={isLogin ? handleLogin : handleRegister} className="bg-slate-900 p-8 rounded-2xl shadow-xl border border-white/5">
          <h2 className="text-xl font-bold text-white mb-6">{isLogin ? 'Sign In' : 'Register'}</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-lg flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> {error}
            </div>
          )}

          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-3 mb-4 bg-slate-800 rounded-lg text-white border border-white/5" required />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full p-3 mb-6 bg-slate-800 rounded-lg text-white border border-white/5" required />

          <button type="submit" disabled={isLoading} className="w-full bg-emerald-500 py-3 rounded-lg font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-50">
            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Register')}
          </button>
        </form>

        {/* Security Panels (yung nawala na UI) */}
        <div className="mt-6 bg-slate-900/50 p-4 rounded-xl border border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-emerald-400 font-bold text-[10px] uppercase tracking-widest">Security Enclave v4.2</h3>
            <span className="text-[10px] text-slate-500">Node: 3000</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-950 p-2 rounded border border-white/5 text-[9px] text-slate-400">Strength Shield: <span className="text-white">Active</span></div>
            <div className="bg-slate-950 p-2 rounded border border-white/5 text-[9px] text-slate-400">Anti-Bot: <span className="text-emerald-500">Passed</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
