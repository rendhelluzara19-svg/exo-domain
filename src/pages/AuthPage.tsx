import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';

export function AuthPage() {
  const { registerUser, users, setCurrentUser } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ 
    role: 'BUYER', 
    itemType: 'FEEDER', 
    email: '', 
    password: '' 
  });
  const [isLoading, setIsLoading] = useState(false);

  const needsDenr = ['REPTILE', 'MAMMAL', 'BIRD'].includes(formData.itemType);

  const handleAuth = async () => {
    setIsLoading(true);
    try {
      if (isLogin) {
        const user = users.find(u => u.email.toLowerCase() === formData.email.trim().toLowerCase() && u.password === formData.password);
        
        if (user) {
          const isStaff = ['VERIFIER', 'FINANCE', 'SUPPORT', 'ORGANIZER', 'ADMIN'].includes(user.role.toUpperCase());
          
          if (user.status === 'PENDING_VERIFICATION' && !isStaff) {
            alert("Account is still under verification.");
          } else {
            setCurrentUser(user);
            window.location.href = '/';
          }
        } else {
          alert("Invalid email or password.");
        }
      } else {
        await registerUser({ ...formData, status: 'PENDING_VERIFICATION' });
        alert("Registration submitted! Pending admin approval.");
        window.location.href = '/';
      }
    } catch (err) { 
      alert("Auth error."); 
    } finally { 
      setIsLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-slate-900 p-8 rounded-2xl border border-white/5 shadow-2xl">
        <h1 className="text-xl font-bold text-white mb-6">
          {isLogin ? "Sign In" : step === 1 ? "Account Setup" : "KYC Verification"}
        </h1>

        {isLogin ? (
          <div className="space-y-4">
            <input type="email" placeholder="Email" className="w-full p-3 bg-slate-800 rounded text-white" onChange={e => setFormData({...formData, email: e.target.value})} />
            <input type="password" placeholder="Password" className="w-full p-3 bg-slate-800 rounded text-white" onChange={e => setFormData({...formData, password: e.target.value})} />
            <button onClick={handleAuth} disabled={isLoading} className="w-full bg-emerald-500 py-3 rounded font-bold">
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
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
                <option value="MAMMAL">Mammals (Needs DENR)</option>
                <option value="BIRD">Birds (Needs DENR)</option>
              </select>
            )}
            <button onClick={() => setStep(2)} className="w-full bg-emerald-500 py-3 rounded font-bold">Next</button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-[10px] text-slate-400">Upload Valid ID, Selfie with ID {needsDenr && ", and DENR Permit"}.</p>
            <input type="file" className="w-full text-white text-xs" />
            <input type="file" className="w-full text-white text-xs" />
            {needsDenr && <input type="file" className="w-full text-white text-xs" />}
            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="w-1/3 bg-slate-700 py-3 rounded text-white">Back</button>
              <button onClick={handleAuth} disabled={isLoading} className="w-2/3 bg-emerald-500 py-3 rounded font-bold">
                {isLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        )}

        <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-4 text-xs text-slate-500 hover:text-white">
          {isLogin ? "No account? Register" : "Already have account? Sign In"}
        </button>
      </div>
    </div>
  );
}
