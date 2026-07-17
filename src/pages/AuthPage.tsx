import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ShieldAlert } from 'lucide-react';
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

      // FIX: Imbes na navigate, gamitin ang window.location
      // Ito ay pilit na mag-re-refresh ng buong App, kaya mawawala ang white screen
      window.location.href = '/'; 
    } catch (err: any) {
      console.error("[Auth] Registration error:", err);
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
        // FIX: Hard redirect para siguradong fresh load ng page
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
      <form onSubmit={isLogin ? handleLogin : handleRegister} className="w-full max-w-sm bg-slate-900 p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-6">{isLogin ? 'Sign In' : 'Register'}</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-lg flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" /> {error}
          </div>
        )}

        <input 
          type="email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="Email" 
          className="w-full p-3 mb-4 bg-slate-800 rounded-lg text-white"
          required 
        />
        
        <input 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          placeholder="Password" 
          className="w-full p-3 mb-6 bg-slate-800 rounded-lg text-white"
          required 
        />

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-emerald-500 py-3 rounded-lg font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Register')}
        </button>

        <button 
          type="button" 
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-4 text-sm text-gray-400 hover:text-white"
        >
          {isLogin ? 'No account? Register here' : 'Already have an account? Sign In'}
        </button>
      </form>
    </div>
  );
}
