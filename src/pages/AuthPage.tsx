import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ShieldAlert } from 'lucide-react';

export function AuthPage() {
  const { registerUser, users, setCurrentUser } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '', password: '', role: 'BUYER', hasDenr: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      await registerUser({ ...formData, status: 'PENDING_VERIFICATION' });
      alert("Submitted for verification!");
      window.location.href = '/';
    } catch (err) { alert("Error."); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-slate-900 p-8 rounded-2xl border border-white/5">
        <h2 className="text-white font-bold mb-4">{step === 1 ? "Account Type" : "KYC Uploads"}</h2>
        
        {step === 1 && (
          <div className="space-y-4">
            <select className="w-full p-3 bg-slate-800 text-white rounded" onChange={e => setFormData({...formData, role: e.target.value})}>
              <option value="BUYER">Buyer</option>
              <option value="SELLER">Seller</option>
            </select>
            <button onClick={() => setStep(2)} className="w-full bg-emerald-500 py-3 rounded">Next</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <input type="file" className="w-full text-white text-xs" />
            <input type="file" className="w-full text-white text-xs" />
            {formData.role === 'SELLER' && (
              <input type="file" className="w-full text-white text-xs" placeholder="DENR Papers" />
            )}
            <button onClick={handleRegister} disabled={isLoading} className="w-full bg-emerald-500 py-3 rounded">
              {isLoading ? "Submitting..." : "Submit Verification"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
