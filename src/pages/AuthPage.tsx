import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ShieldAlert } from 'lucide-react';

export function AuthPage() {
  const { registerUser } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ role: 'BUYER', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      await registerUser({ ...formData, status: 'PENDING_VERIFICATION' });
      alert("Registration submitted! Pending approval.");
      window.location.href = '/';
    } catch (err) { alert("Error submitting."); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-slate-900 p-8 rounded-2xl border border-white/5 shadow-2xl">
        <h1 className="text-xl font-bold text-white mb-6">
          {step === 1 ? "Account Setup" : "KYC Verification"}
        </h1>

        {step === 1 ? (
          <div className="space-y-4">
            <input type="email" placeholder="Email" className="w-full p-3 bg-slate-800 rounded text-white" onChange={e => setFormData({...formData, email: e.target.value})} />
            <input type="password" placeholder="Password" className="w-full p-3 bg-slate-800 rounded text-white" onChange={e => setFormData({...formData, password: e.target.value})} />
            <select className="w-full p-3 bg-slate-800 text-white rounded" onChange={e => setFormData({...formData, role: e.target.value})}>
              <option value="BUYER">Buyer</option>
              <option value="SELLER">Seller</option>
            </select>
            <button onClick={() => setStep(2)} className="w-full bg-emerald-500 py-3 rounded font-bold">Next</button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">Upload Valid ID, Selfie with ID, and DENR Papers (if Seller).</p>
            <input type="file" className="w-full text-white text-xs" />
            <input type="file" className="w-full text-white text-xs" />
            {formData.role === 'SELLER' && <input type="file" className="w-full text-white text-xs" placeholder="DENR Paper" />}
            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="w-1/3 bg-slate-700 py-3 rounded text-white">Back</button>
              <button onClick={handleRegister} disabled={isLoading} className="w-2/3 bg-emerald-500 py-3 rounded font-bold">
                {isLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
