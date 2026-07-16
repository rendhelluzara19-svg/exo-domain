import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils';
import { Copy, Upload, CheckCircle2, CircleDashed, ShieldCheck, Crown, Shield, HelpCircle, Eye } from 'lucide-react';
import { PlanType } from '@/types';
import { uploadToCloudinary } from '@/utils/cloudinary';
import { Loader2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

export const WalletCard = () => {
  const { currentUser, users, createPaymentRequest, paymentRequests } = useApp();
  const [amount, setAmount] = useState<string>('');
  const [receiptUrl, setReceiptUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isPerksModalOpen, setIsPerksModalOpen] = useState(false);
  const [txNumber, setTxNumber] = useState<string>('');
  const [accNumber, setAccNumber] = useState<string>('');
  
  // Tab state: 'TOPUP' | 'SUBSCRIPTION'
  const [activeTab, setActiveTab] = useState<'TOPUP' | 'SUBSCRIPTION'>('TOPUP');
  
  // Selected Plan state for Subscription Tab
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);

  if (!currentUser) return null;

  // Active topup check
  const pendingRequest = paymentRequests.find(r => r.userId === currentUser.id && (r.status === 'PENDING_VERIFIER' || r.status === 'PENDING_TREASURER'));

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0 || !receiptUrl) return;
    createPaymentRequest(currentUser.id, num, receiptUrl, 'TOPUP', undefined, txNumber, accNumber);
    setAmount('');
    setReceiptUrl('');
    setTxNumber('');
    setAccNumber('');
  };

  const starterCount = currentUser.animalCategory ? users.filter(u => u.animalCategory === currentUser.animalCategory && u.plan === 'STARTER').length : 0;
  const canSelectStarter = starterCount < 10;

  const handleSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan || !receiptUrl) return;
    if (selectedPlan === 'STARTER' && !canSelectStarter) {
      alert('Starter slots for your category are full. Please select a higher plan.');
      return;
    }
    const planCost = getPlanPrice(selectedPlan);
    createPaymentRequest(currentUser.id, planCost, receiptUrl, selectedPlan === 'EXO_PASS' ? 'EXO_PASS' : 'SUBSCRIPTION', selectedPlan, txNumber, accNumber);
    setReceiptUrl('');
    setSelectedPlan(null);
    setTxNumber('');
    setAccNumber('');
  };

  const getPlanPrice = (plan: PlanType) => {
    switch (plan) {
      case 'EXO_PASS': return 99;
      case 'STARTER': return 99;
      case 'PRO': return 299;
      case 'ELITE': return 699;
      default: return 0;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden shadow-sm">
      {/* Balances Section */}
      <div className="bg-gray-900 p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="flex justify-between items-center mb-6 relative z-10">
          <h3 className="text-teal-400 font-bold text-xs tracking-widest uppercase">Vault & Balances</h3>
          {currentUser.plan !== 'NONE' && (
            <span className="bg-[#D4AF37] text-gray-900 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
              <Crown className="w-3 h-3" /> {currentUser.plan.replace('_', ' ')}
            </span>
          )}
        </div>
        
        <div className="space-y-4 relative z-10">
          <div className="flex justify-between items-end border-b border-white/10 pb-4">
            <span className="text-gray-400 text-sm">TOTAL AVAILABLE BALANCE</span>
            <span className="text-4xl font-bold text-white tracking-tight">{formatCurrency(currentUser.balance)}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 bg-gray-50">
        <button 
          onClick={() => setActiveTab('TOPUP')}
          className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'TOPUP' ? 'text-teal-600 border-b-2 border-teal-600 bg-white' : 'text-gray-500 hover:text-gray-900'}`}
        >
          Wallet Top-Up
        </button>
        <button 
          onClick={() => setActiveTab('SUBSCRIPTION')}
          className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'SUBSCRIPTION' ? 'text-teal-600 border-b-2 border-teal-600 bg-white' : 'text-gray-500 hover:text-gray-900'}`}
        >
          Upgrade Plan
        </button>
      </div>

      {/* Action Section */}
      <div className="p-6">
        
        {pendingRequest ? (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <h5 className="font-bold text-gray-900 mb-4 text-center">Request Tracker: {pendingRequest.type}</h5>
            <div className="relative">
              <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-gray-200"></div>
              <div className="space-y-4 relative z-10">
                <div className="flex items-start gap-3">
                  <div className="bg-green-500 rounded-full w-7 h-7 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Step 1: 🧾 Payment Uploaded</div>
                    <div className="text-xs text-gray-500">Success</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className={`rounded-full w-7 h-7 flex items-center justify-center shrink-0 mt-0.5 ${pendingRequest.status === 'PENDING_VERIFIER' ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}>
                    {pendingRequest.status === 'PENDING_VERIFIER' ? <CircleDashed className="w-4 h-4 text-white animate-spin-slow" /> : <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Step 2: 🔍 Verification Staff Audit</div>
                    <div className="text-xs text-gray-500">{pendingRequest.status === 'PENDING_VERIFIER' ? 'Waiting for Verifier' : 'Verified'}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className={`rounded-full w-7 h-7 flex items-center justify-center shrink-0 mt-0.5 ${pendingRequest.status === 'PENDING_TREASURER' ? 'bg-yellow-500 animate-pulse' : 'bg-gray-300'}`}>
                    {pendingRequest.status === 'PENDING_TREASURER' ? <CircleDashed className="w-4 h-4 text-white animate-spin-slow" /> : <div className="w-2 h-2 rounded-full bg-gray-400"></div>}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Step 3: 💎 Treasurer Ledger Crediting</div>
                    <div className="text-xs text-gray-500">{pendingRequest.status === 'PENDING_TREASURER' ? 'Waiting for Treasurer' : 'Pending'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'TOPUP' && (
              <form onSubmit={handleTopUp} className="space-y-6">
                {/* Payment Channel Embed */}
                <div className="bg-gray-50 rounded-2xl overflow-hidden border border-[#E5E7EB]">
                  <img src="https://api.allorigins.win/raw?url=https://cln.sh/Tj6vG87q/download/image.png" alt="QR" className="w-full object-cover max-h-64" />
                  <div className="p-4 bg-white border-t border-[#E5E7EB]">
                    <details className="text-sm text-gray-700">
                      <summary className="font-bold cursor-pointer hover:text-teal-600 transition-colors outline-none">Show Manual Bank Details</summary>
                      <div className="mt-3 space-y-2 bg-gray-50 p-3 rounded-xl">
                        <div className="flex justify-between items-center">
                          <span>GCash: <strong>09957822037</strong> (R****el L.)</span>
                          <button type="button" onClick={() => navigator.clipboard.writeText('09957822037')} className="text-gray-400 hover:text-gray-900"><Copy className="w-4 h-4"/></button>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>GoTyme: <strong>019706278863</strong> (R****el L.)</span>
                          <button type="button" onClick={() => navigator.clipboard.writeText('019706278863')} className="text-gray-400 hover:text-gray-900"><Copy className="w-4 h-4"/></button>
                        </div>
                      </div>
                    </details>
                  </div>
                </div>

                {/* Quick Amount Chips */}
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-2 block">Transfer Amount</label>
                  <div className="flex gap-2 mb-2">
                    {[100, 500, 1000, 2500].map(val => (
                      <button 
                        key={val} type="button" onClick={() => setAmount(val.toString())}
                        className="flex-1 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs font-bold text-gray-700 hover:border-teal-600 hover:text-teal-600 transition-colors"
                      >
                        ₱{val}
                      </button>
                    ))}
                  </div>
                  <Input type="number" min="1" placeholder="Or enter manual amount..." value={amount} onChange={e => setAmount(e.target.value)} required />
                </div>

                {/* Transaction and Sender Account Inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Transaction Reference #</label>
                    <Input 
                      type="text" 
                      placeholder="e.g. Ref 501234567" 
                      value={txNumber} 
                      onChange={e => setTxNumber(e.target.value)} 
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Sender Account Info</label>
                    <Input 
                      type="text" 
                      placeholder="e.g. J. Dela Cruz (0995***)" 
                      value={accNumber} 
                      onChange={e => setAccNumber(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                {/* Mandatory Upload */}
                <div className="border-2 border-dashed border-[#E5E7EB] rounded-2xl p-4 text-center bg-gray-50 transition-colors hover:border-teal-500">
                  <label className="block text-sm font-bold text-gray-700 mb-2">📸 Upload Payment Receipt Screenshot</label>
                  <p className="text-xs text-gray-500 mb-4">Proof of transfer is required to proceed.</p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    disabled={isUploading}
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        setIsUploading(true);
                        try {
                          const url = await uploadToCloudinary(e.target.files[0]);
                          setReceiptUrl(url);
                        } catch (err) {
                          console.error(err);
                        } finally {
                          setIsUploading(false);
                        }
                      }
                    }}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-teal-600 hover:file:bg-teal-50 cursor-pointer disabled:opacity-50"
                    required
                  />
                  {isUploading && (
                    <div className="text-sm text-teal-600 mt-2 flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Uploading to Cloudinary...
                    </div>
                  )}
                  {receiptUrl && <img src={receiptUrl} className="mt-4 w-full max-w-xs mx-auto h-32 object-cover rounded-lg border border-gray-200" />}
                </div>

                <Button type="submit" className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white" disabled={!amount || !receiptUrl || isUploading}>Submit for Verification</Button>
              </form>
            )}

            {activeTab === 'SUBSCRIPTION' && (
              <form onSubmit={handleSubscription} className="space-y-6">
                
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-gray-900">Select a Plan</h4>
                  <button type="button" onClick={() => setIsPerksModalOpen(true)} className="text-teal-600 text-xs font-bold hover:underline flex items-center gap-1">
                    <Eye className="w-4 h-4" /> View Plan Perks
                  </button>
                </div>

                {currentUser.role === 'BUYER' ? (
                  <div className={`p-4 border-2 rounded-2xl cursor-pointer transition-all ${selectedPlan === 'EXO_PASS' ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-gray-200 bg-white hover:border-[#D4AF37]/50'}`} onClick={() => setSelectedPlan('EXO_PASS')}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Crown className={`w-6 h-6 ${selectedPlan === 'EXO_PASS' ? 'text-[#D4AF37]' : 'text-gray-400'}`} />
                        <h4 className="font-bold text-gray-900 text-lg">Exo Pass (VIP)</h4>
                      </div>
                      <span className="font-bold text-[#D4AF37]">{formatCurrency(99)}/mo</span>
                    </div>
                    <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
                      <li>Early Bird Access (view new/rare listings before others)</li>
                      <li>VIP Buyer Badge on Profile</li>
                      <li>Exclusive Discount coupons from partner sellers</li>
                    </ul>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {['STARTER', 'PRO', 'ELITE'].map((plan) => {
                      const isDisabled = plan === 'STARTER' && !canSelectStarter;
                      return (
                      <div key={plan} className={`p-4 border-2 rounded-2xl transition-all ${isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer'} ${selectedPlan === plan as PlanType ? 'border-teal-500 bg-teal-50' : 'border-gray-200 bg-white hover:border-teal-500/50'}`} onClick={() => !isDisabled && setSelectedPlan(plan as PlanType)}>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className={`w-5 h-5 ${selectedPlan === plan ? 'text-teal-600' : 'text-gray-400'}`} />
                            <h4 className="font-bold text-gray-900 capitalize">{plan.toLowerCase()} Plan</h4>
                          </div>
                          <span className="font-bold text-teal-600">{formatCurrency(getPlanPrice(plan as PlanType))}/mo</span>
                        </div>
                        {isDisabled && (
                           <p className="text-xs text-red-500 mt-2 font-medium">Free slots (10) for your category ({currentUser.animalCategory}) are full.</p>
                        )}
                      </div>
                    )})}
                  </div>
                )}

                {/* Transaction and Sender Account Inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Transaction Reference #</label>
                    <Input 
                      type="text" 
                      placeholder="e.g. Ref 501234567" 
                      value={txNumber} 
                      onChange={e => setTxNumber(e.target.value)} 
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Sender Account Info</label>
                    <Input 
                      type="text" 
                      placeholder="e.g. J. Dela Cruz (0995***)" 
                      value={accNumber} 
                      onChange={e => setAccNumber(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                {/* Mandatory Upload */}
                <div className="border-2 border-dashed border-[#E5E7EB] rounded-2xl p-4 text-center bg-gray-50 transition-colors hover:border-teal-500">
                  <label className="block text-sm font-bold text-gray-700 mb-2">📸 Upload Payment Receipt Screenshot</label>
                  <p className="text-xs text-gray-500 mb-4">Please transfer the exact amount to GCash: 09957822037.</p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    disabled={isUploading}
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        setIsUploading(true);
                        try {
                          const url = await uploadToCloudinary(e.target.files[0]);
                          setReceiptUrl(url);
                        } catch (err) {
                          console.error(err);
                        } finally {
                          setIsUploading(false);
                        }
                      }
                    }}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-teal-600 hover:file:bg-teal-50 cursor-pointer disabled:opacity-50"
                    required
                  />
                  {isUploading && (
                    <div className="text-sm text-teal-600 mt-2 flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Uploading to Cloudinary...
                    </div>
                  )}
                  {receiptUrl && <img src={receiptUrl} className="mt-4 w-full max-w-xs mx-auto h-32 object-cover rounded-lg border border-gray-200" />}
                </div>

                <Button type="submit" className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white" disabled={!selectedPlan || !receiptUrl || isUploading}>Submit Upgrade Request</Button>
              </form>
            )}
          </>
        )}
      </div>

      <Modal isOpen={isPerksModalOpen} onClose={() => setIsPerksModalOpen(false)} title="Platform Plan Perks">
        <div className="space-y-4">
          {currentUser.role !== 'SELLER' && (
            <div className={`p-4 border-2 rounded-xl relative ${currentUser.plan === 'EXO_PASS' ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-[0_0_15px_rgba(212,175,55,0.2)]' : 'border-[#D4AF37]/30 bg-[#D4AF37]/5'}`}>
              {currentUser.plan === 'EXO_PASS' && <div className="absolute top-3 right-3 text-[10px] font-bold bg-[#D4AF37] text-white px-2 py-1 rounded-full uppercase tracking-wider">Current Plan</div>}
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><Crown className="w-4 h-4 text-[#D4AF37]" /> Exo Pass / VIP Buyer (₱99/mo)</h4>
              <ul className="text-xs text-gray-700 list-disc pl-4 space-y-1">
                <li>'Early Bird' Access (see new/rare listings before others)</li>
                <li>'VIP Buyer' Badge on profile</li>
                <li>Exclusive Discount coupons from partner sellers</li>
              </ul>
            </div>
          )}
          
          {currentUser.role !== 'BUYER' && (
            <>
              <div className={`p-4 border-2 rounded-xl relative ${currentUser.plan === 'STARTER' ? 'border-red-500 bg-red-50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-red-200 bg-red-50/50'}`}>
                {currentUser.plan === 'STARTER' && <div className="absolute top-3 right-3 text-[10px] font-bold bg-red-500 text-white px-2 py-1 rounded-full uppercase tracking-wider">Current Plan</div>}
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-red-600" /> Starter Plan (₱99/mo)</h4>
                <ul className="text-xs text-gray-700 list-disc pl-4 space-y-1">
                  <li><strong>Bulk Listing Tool:</strong> Upload multiple exotic pet listings at once.</li>
                  <li><strong>Basic Dashboard:</strong> Track total sales count for any pet type.</li>
                </ul>
              </div>

              <div className={`p-4 border-2 rounded-xl relative ${currentUser.plan === 'PRO' ? 'border-blue-500 bg-blue-50 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'border-blue-200 bg-blue-50/50'}`}>
                {currentUser.plan === 'PRO' && <div className="absolute top-3 right-3 text-[10px] font-bold bg-blue-500 text-white px-2 py-1 rounded-full uppercase tracking-wider">Current Plan</div>}
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-blue-600" /> Pro Plan (₱299/mo)</h4>
                <ul className="text-xs text-gray-700 list-disc pl-4 space-y-1">
                  <li><strong>Advanced Analytics:</strong> Monitor listing views and conversion rates for your shop.</li>
                  <li><strong>'Verified' Blue Badge:</strong> Build trust with buyers in the exotic community.</li>
                </ul>
              </div>

              <div className={`p-4 border-2 rounded-xl relative overflow-hidden ${currentUser.plan === 'ELITE' ? 'border-purple-500 bg-purple-100 shadow-[0_0_20px_rgba(168,85,247,0.3)] scale-[1.02] transition-transform' : 'border-purple-300 bg-purple-50'}`}>
                <div className="absolute top-0 right-0 w-16 h-16 bg-purple-200 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
                {currentUser.plan === 'ELITE' && <div className="absolute top-3 right-3 text-[10px] font-bold bg-purple-600 text-white px-2 py-1 rounded-full uppercase tracking-wider shadow-md z-10">Current Plan</div>}
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2 relative z-10"><ShieldCheck className="w-4 h-4 text-purple-600" /> Elite Plan (₱699/mo)</h4>
                <ul className="text-xs text-gray-700 list-disc pl-4 space-y-1 relative z-10">
                  <li><strong>Hero Banner Slot:</strong> 1 free ad placement on the Homepage.</li>
                  <li><strong>Custom Store URL:</strong> exodomain.ph/yourshop</li>
                  <li><strong>Priority Search:</strong> Your listings appear at the top of all search results.</li>
                  <li><strong>Direct Messaging:</strong> One-click button to your preferred contact method.</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
