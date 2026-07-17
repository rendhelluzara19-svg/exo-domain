import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';

export function AuthPage() {
  const { registerUser, users, setCurrentUser } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ role: 'BUYER', itemType: 'FEEDER', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const needsDenr = ['REPTILE', 'MAMMAL', 'BIRD'].includes(formData.itemType);

  const handleAuth = async () => {
    setIsLoading(true);
    try {
      if (isLogin) {
        const user = users.find(u => u.email === formData.email && u.password === formData.password);
        if (user) { setCurrentUser(user); window.location.href = '/'; }
        else alert("Invalid login");
      } else {
        await registerUser({ ...formData, status: 'PENDING_VERIFICATION' });
        alert("Registration submitted!");
        window.location.href = '/';
      }
    } catch (err) { alert("Error"); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-slate-900 p-8 rounded-2xl border border-white/5">
        <h1 className="text-xl font-bold text-white mb-6">{isLogin ? "Sign In" : step === 1 ? "Account Setup" : "KYC"}</h1>

        {isLogin ? (
          <div className="space-y-4">
            <input type="email" placeholder="Email" className="w-full p-3 bg-slate-800 rounded text-white" onChange={e => setFormData({...formData, email: e.target.value})} />
            <input type="password" placeholder="Password" className="w-full p-3 bg-slate-800 rounded text-white" onChange={e => setFormData({...formData, password: e.target.value})} />
            <button onClick={handleAuth} className="w-full bg-emerald-500 py-3 rounded font-bold">Sign In</button>
          </div>
        ) : step === 1 ? (
          <div className="space-y-4">
            <input type="email" placeholder="Email" className="w-full p-3 bg-slate-800 rounded text-white" onChange={e => setFormData({...formData, email: e.target.value})} />
            <input type="password" placeholder="Password" className="w-full p-3 bg-slate-800 rounded text-white" onChange={e => setFormData({...formData, password: e.target.value})} />
            <select className="w-full p-3 bg-slate-800 text-white rounded" onChange={e => setFormData({...formData, role: e.target.value})}>
              <option value="BUYER">Buyer</option>
              <option value="SELLER">Seller</option>
            </select>
            {formData.role === 'SELLER' && (
              <select className="w-full p-3 bg-slate-800 text-white rounded" onChange={e => setFormData({...formData, itemType: e.target.value})}>
                <option value="FEEDER">Feeders (No DENR)</option>
                <option value="REPTILE">Reptiles (Needs DENR)</option>
              </select>
            )}
            <button onClick={() => setStep(2)} className="w-full bg-emerald-500 py-3 rounded font-bold">Next</button>
          </div>
        ) : (
          <div className="space-y-4">
            <input type="file" className="w-full text-white text-xs" />
            <input type="file" className="w-full text-white text-xs" />
            {needsDenr && <input type="file" className="w-full text-white text-xs" placeholder="DENR Permit" />}
            <button onClick={handleAuth} className="w-full bg-emerald-500 py-3 rounded font-bold">Submit</button>
          </div>
        )}

        <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-4 text-xs text-slate-500">
          {isLogin ? "No account? Register" : "Already have account? Sign In"}
        </button>
      </div>
    </div>
  );
}
