import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { WalletCard } from '@/components/WalletCard';
import { BuyerBadges } from '@/components/BuyerBadges';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency } from '@/lib/utils';
import { Package, Shield, ShieldCheck, CheckCircle, XCircle, FileText, FileBadge, Activity, CreditCard, AlertTriangle, Crown, Eye, EyeOff, BarChart2, Smartphone } from 'lucide-react';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { RoleControlCenter } from '@/components/RoleControlCenter';
import { uploadToCloudinary } from '@/utils/cloudinary';

export const ProfileDashboardPage = () => {
  const { currentUser, users, updateUser, paymentRequests, updatePaymentRequest, products, addProduct, orders, updateOrder, ledgers, reports, appConfig, updateAppConfig, addLedgerEntry, isLiteMode, performanceMode, setPerformanceMode, deviceType } = useApp();
  
  const isRegularUser = currentUser && ['BUYER', 'SELLER'].includes(currentUser.role);
  
  // Add Listing Modal State
  const [isAddListingOpen, setIsAddListingOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', price: '', stock: '', category: 'FEEDERS' as const
  });

  // Edit Profile Modal State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isPerksModalOpen, setIsPerksModalOpen] = useState(false);
  const [editProfileData, setEditProfileData] = useState({
    name: '',
    bio: '',
    avatar: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [editProfileError, setEditProfileError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  if (!currentUser) return null;

  const handleOpenEditProfile = () => {
    setEditProfileData({
      name: currentUser.name,
      bio: currentUser.bio || '',
      avatar: currentUser.avatar || ''
    });
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordError('');
    setEditProfileError('');
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setEditProfileError('');
    setPasswordError('');

    let updates: any = {};
    
    // Check if name is being changed and if they are KYC locked
    if (editProfileData.name !== currentUser.name) {
      if (currentUser.status === 'APPROVED' || currentUser.kycData) {
        setEditProfileError('Name cannot be changed after KYC verification.');
        return;
      }
      updates.name = editProfileData.name;
    }
    
    updates.bio = editProfileData.bio;
    updates.avatar = editProfileData.avatar;

    // Handle password change if filled
    if (passwordData.currentPassword || passwordData.newPassword) {
      if (currentUser.password !== passwordData.currentPassword) {
        setPasswordError('Current password is incorrect.');
        return;
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError('New passwords do not match.');
        return;
      }
      if (passwordData.newPassword.length < 6) {
        setPasswordError('New password must be at least 6 characters.');
        return;
      }
      updates.password = passwordData.newPassword;
    }

    updateUser(currentUser.id, updates);
    setIsEditProfileOpen(false);
    alert('Profile updated successfully.');
  };

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setEditProfileData(prev => ({ ...prev, avatar: url }));
    } catch (err) {
      console.error(err);
      alert('Failed to upload image to Cloudinary.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.stock) return;
    
    // Auto-verify Exotics if DENR is verified for seller (mock behavior)
    
    addProduct({
      name: newProduct.name,
      description: newProduct.description,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
      category: newProduct.category,
      images: [],
    });
    setIsAddListingOpen(false);
    setNewProduct({ name: '', description: '', price: '', stock: '', category: 'FEEDERS' });
  };

  return (
    <div className="p-4 sm:p-6 pb-24 max-w-4xl mx-auto space-y-6">
      
      {/* Profile Header Block */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between relative overflow-hidden gap-4">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full -mr-16 -mt-16 opacity-50"></div>
        <div className="flex items-center gap-4 relative z-10">
          <ProfileAvatar user={currentUser} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-xl text-gray-900">{currentUser.name}</h2>
              {currentUser.role === 'ADMIN' && <span className="bg-[#D4AF37] text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">Founder</span>}
              {currentUser.kycData && <CheckCircle className="w-4 h-4 text-teal-500" title="Verified ID" />}
              {currentUser.denrVerified && <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-md">DENR Verified</span>}
              {currentUser.plan === 'EXO_PASS' && <span className="bg-[#D4AF37] text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1"><Crown className="w-3 h-3"/> VIP Buyer</span>}
            </div>
            <p className="text-sm text-gray-500">{currentUser.email} • <span className="font-bold text-teal-600">{currentUser.role.replace('_', ' ')}</span></p>
            {currentUser.bio && <p className="text-xs text-gray-600 mt-1 max-w-sm">{currentUser.bio}</p>}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 relative z-10 items-stretch sm:items-center">
          {isRegularUser && (
            <button 
              onClick={() => setPerformanceMode(performanceMode === 'LITE' ? 'FULL' : 'LITE')}
              className={`flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-xl border transition-all font-bold ${
                performanceMode === 'LITE' 
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)] hover:bg-emerald-600' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
              }`}
              title="Toggle Lite vs Full Experience"
            >
              <Smartphone className="w-3.5 h-3.5" />
              Lite Mode: {performanceMode === 'LITE' ? 'Active' : 'Disabled'}
            </button>
          )}
          {currentUser.role === 'SELLER' && currentUser.plan !== 'ELITE' && (
            <Button variant="outline" className="text-xs px-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white border-0 hover:from-teal-600 hover:to-teal-700 font-bold shadow-md hover:shadow-lg transition-all" onClick={() => setIsPerksModalOpen(true)}>
              <Crown className="w-3 h-3 mr-1" /> Upgrade Plan
            </Button>
          )}
          {currentUser.role === 'BUYER' && currentUser.plan !== 'EXO_PASS' && (
            <Button variant="outline" className="text-xs px-3 bg-[#D4AF37] text-white border-0 hover:bg-[#C5A017] font-bold shadow-md hover:shadow-lg transition-all" onClick={() => setIsPerksModalOpen(true)}>
              <Crown className="w-3 h-3 mr-1" /> Get VIP Pass
            </Button>
          )}
          <Button variant="outline" className="text-xs px-3" onClick={handleOpenEditProfile}>Edit Profile</Button>
        </div>
      </div>

      {/* --- STAFF DASHBOARDS --- */}
      
      {/* VERIFICATION STAFF */}
      {(currentUser.role === 'VERIFICATION_STAFF' || currentUser.role === 'ADMIN') && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-[0_0_15px_rgba(57,255,20,0.15)] hover:border-[#39FF14]/30 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-5 h-5" style={{ color: '#39FF14' }} />
            <h3 className="font-bold text-gray-900">KYC & Verification Queue</h3>
          </div>
          <div className="space-y-3">
            {users.filter(u => u.status === 'PENDING').map(u => (
              <div key={u.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 rounded-xl border border-gray-200 gap-4">
                <div className="flex-1">
                  <div className="font-bold text-sm">{u.name} <span className="text-gray-400 font-normal">({u.role})</span></div>
                  <div className="text-xs text-gray-500 mb-2">{u.email}</div>
                  {u.role === 'SELLER' && (
                    <div className="text-xs text-gray-600 mb-2">Category: {u.animalCategory || 'N/A'}</div>
                  )}
                  {u.faceIdConsent && (
                    <div className="text-[10px] text-teal-600 font-bold mb-2 uppercase flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> FaceID/Biometric Consent Granted
                    </div>
                  )}
                  <div className="flex gap-2">
                    {u.kycData?.idImageUrl && <a href={u.kycData.idImageUrl} target="_blank" rel="noreferrer" className="text-xs text-teal-600 underline">View ID</a>}
                    {u.kycData?.selfieUrl && <a href={u.kycData.selfieUrl} target="_blank" rel="noreferrer" className="text-xs text-teal-600 underline">View Selfie</a>}
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button size="sm" onClick={() => updateUser(u.id, { status: 'APPROVED' })} className="flex-1 bg-teal-600 hover:bg-teal-700">Approve</Button>
                  <Button size="sm" variant="outline" onClick={() => updateUser(u.id, { status: 'REJECTED' })} className="flex-1 text-red-600 hover:bg-red-50 border-red-200">Reject</Button>
                </div>
              </div>
            ))}
            {users.filter(u => u.status === 'PENDING').length === 0 && <div className="text-sm text-gray-400 p-4 text-center border border-dashed rounded-xl">No pending KYC verifications.</div>}
          </div>
          
          <div className="mt-8 flex items-center gap-3 mb-4">
            <FileBadge className="w-5 h-5" style={{ color: '#39FF14' }} />
            <h3 className="font-bold text-gray-900">Payment Staging (Step 1)</h3>
          </div>
          <div className="space-y-3">
            {paymentRequests.filter(r => r.status === 'PENDING_VERIFIER').map(req => {
              const u = users.find(us => us.id === req.userId);
              return (
                <div key={req.id} className="flex flex-col sm:flex-row gap-4 p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                  <img src={req.receiptUrl} alt="Receipt" className="w-20 h-20 object-cover rounded-lg bg-gray-200 shrink-0 cursor-pointer animate-[pulse_2s_infinite]" onClick={() => window.open(req.receiptUrl)} />
                  <div className="flex-1">
                    <div className="font-bold text-sm">{u?.name} <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full ml-2">{req.type}</span></div>
                    <div className="text-orange-600 font-bold mt-1">{formatCurrency(req.amount)}</div>
                    
                    {/* Display user input details */}
                    <div className="mt-2 space-y-1 bg-white p-2 rounded-lg border border-orange-100 text-xs">
                      <div className="text-gray-700 font-semibold flex items-center gap-1">🔗 Reference #: <span className="font-mono text-gray-900 bg-gray-100 px-1 rounded">{req.transactionNumber || 'None provided'}</span></div>
                      <div className="text-gray-700 font-semibold flex items-center gap-1">👤 Sender Account: <span className="font-mono text-gray-900 bg-gray-100 px-1 rounded">{req.accountNumber || 'None provided'}</span></div>
                    </div>
                    
                    <div className="text-[10px] text-gray-400 mt-1">Receipt Hash: {req.id.substring(0,8)}...</div>
                  </div>
                  <Button size="sm" onClick={() => updatePaymentRequest(req.id, 'PENDING_TREASURER')} className="self-center sm:self-end bg-orange-500 hover:bg-orange-600">Stage to Treasurer</Button>
                </div>
              );
            })}
            {paymentRequests.filter(r => r.status === 'PENDING_VERIFIER').length === 0 && <div className="text-sm text-gray-400 p-4 text-center border border-dashed rounded-xl">No pending payment receipts to stage.</div>}
          </div>
        </div>
      )}

      {/* FINANCE STAFF / TREASURER */}
      {(currentUser.role === 'FINANCE_STAFF' || currentUser.role === 'ADMIN') && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-[0_0_15px_rgba(57,255,20,0.15)] hover:border-[#39FF14]/30 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-5 h-5" style={{ color: '#39FF14' }} />
            <h3 className="font-bold text-gray-900">Treasurer Action Queue</h3>
          </div>
          <div className="space-y-3">
            {paymentRequests.filter(r => r.status === 'PENDING_TREASURER').map(req => {
              const u = users.find(us => us.id === req.userId);
              return (
                <div key={req.id} className="flex flex-col sm:flex-row gap-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <div className="flex-1">
                    <div className="font-bold text-sm">{u?.name} <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full ml-2">{req.type}</span></div>
                    <div className="text-yellow-700 font-bold mt-1 text-lg">{formatCurrency(req.amount)}</div>
                    
                    {/* Display user input details */}
                    <div className="mt-2 space-y-1 bg-white p-2 rounded-lg border border-yellow-100 text-xs max-w-md">
                      <div className="text-gray-700 font-semibold flex items-center gap-1">🔗 Reference #: <span className="font-mono text-gray-900 bg-gray-100 px-1 rounded">{req.transactionNumber || 'None provided'}</span></div>
                      <div className="text-gray-700 font-semibold flex items-center gap-1">👤 Sender Account: <span className="font-mono text-gray-900 bg-gray-100 px-1 rounded">{req.accountNumber || 'None provided'}</span></div>
                    </div>

                    <div className="text-xs text-gray-500 mt-2">Ready for final ledger credit and system activation.</div>
                  </div>
                  <div className="flex gap-2 self-center sm:self-end">
                    <Button size="sm" onClick={() => {
                      updatePaymentRequest(req.id, 'ACTIVATED' as any);
                      if (u) {
                        if (req.type === 'TOPUP') {
                          updateUser(u.id, { balance: u.balance + req.amount });
                        } else if ((req.type === 'SUBSCRIPTION' || req.type === 'EXO_PASS') && req.planTarget) {
                          updateUser(u.id, { plan: req.planTarget });
                        }
                        
                        // Add verified entry to ledger
                        addLedgerEntry({
                          userId: u.id,
                          userName: u.name,
                          userRole: u.role,
                          type: req.type === 'TOPUP' ? 'Wallet Top-Up' : `Plan: ${req.planTarget}`,
                          amount: req.amount,
                          channel: `GCash/GoTyme (Ref: ${req.transactionNumber || 'N/A'}, Acc: ${req.accountNumber || 'N/A'})`
                        });
                      }
                    }} className="bg-[#D4AF37] hover:bg-yellow-600 text-white">Approve & Credit</Button>
                  </div>
                </div>
              );
            })}
            {paymentRequests.filter(r => r.status === 'PENDING_TREASURER').length === 0 && <div className="text-sm text-gray-400 p-4 text-center border border-dashed rounded-xl">No staged payments await execution.</div>}
          </div>
          
          <div className="mt-8 flex items-center gap-3 mb-4">
            <Activity className="w-5 h-5" style={{ color: '#39FF14' }} />
            <h3 className="font-bold text-gray-900">Live Transaction Ledger</h3>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {ledgers.map(l => (
              <div key={l.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-center">
                <div>
                  <div className="text-xs font-bold text-gray-800">{l.type} - {l.referenceId.substring(0,8)}</div>
                  <div className="text-[10px] text-gray-500">{new Date(l.date).toLocaleString()}</div>
                </div>
                <div className="font-mono text-sm font-bold text-gray-900">{formatCurrency(l.amount)}</div>
              </div>
            ))}
            {ledgers.length === 0 && <div className="text-sm text-gray-400">Ledger is empty.</div>}
          </div>
        </div>
      )}

      {/* SUPPORT STAFF */}
      {(currentUser.role === 'SUPPORT_STAFF' || currentUser.role === 'ADMIN') && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-[0_0_15px_rgba(57,255,20,0.15)] hover:border-[#39FF14]/30 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5" style={{ color: '#39FF14' }} />
            <h3 className="font-bold text-gray-900">Listing Reports</h3>
          </div>
          <div className="space-y-3">
            {reports.filter(r => r.status === 'OPEN').map(r => (
              <div key={r.id} className="p-4 bg-red-50 rounded-xl border border-red-100">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-sm text-red-900">Reason: {r.reason}</div>
                  <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded-full">High Priority</span>
                </div>
                <p className="text-sm text-red-700 mb-3">{r.details}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">Take Action</Button>
                  <Button size="sm" variant="ghost" className="text-gray-500 hover:bg-gray-100">Dismiss</Button>
                </div>
              </div>
            ))}
            {reports.filter(r => r.status === 'OPEN').length === 0 && <div className="text-sm text-gray-400 p-4 text-center border border-dashed rounded-xl">No active reports.</div>}
          </div>
        </div>
      )}

      {/* ADMIN SETTINGS */}
      {currentUser.role === 'ADMIN' && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mt-6 hover:shadow-[0_0_15px_rgba(57,255,20,0.15)] hover:border-[#39FF14]/30 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-5 h-5" style={{ color: '#39FF14' }} />
            <h3 className="font-bold text-gray-900">Platform Configuration</h3>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-center">
            <div>
              <div className="font-bold text-sm text-gray-900">DTI/BIR Verified Business Badge</div>
              <div className="text-xs text-gray-500">Toggle the global verified business badge on the platform UI.</div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={appConfig.dtiVerified} onChange={e => updateAppConfig({ dtiVerified: e.target.checked })} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>
        </div>
      )}

      {/* SELLER SPECIFIC VIEWS */}
      {(currentUser.role === 'SELLER' || currentUser.role === 'ADMIN') && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5" style={{ color: '#39FF14' }} />
              <h3 className="font-bold text-xl text-gray-900">Inventory & Listings</h3>
            </div>
            <Button onClick={() => setIsAddListingOpen(true)} className="flex items-center gap-2 bg-gray-900 text-white"><Package className="w-4 h-4"/> Add Listing</Button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6 hover:shadow-[0_0_15px_rgba(57,255,20,0.15)] hover:border-[#39FF14]/30 transition-all duration-300">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BarChart2 className="w-4 h-4" style={{ color: '#39FF14' }} />
                <h4 className="font-bold text-sm text-gray-900">Universal Inventory Tracker</h4>
              </div>
              <span className="text-xs text-gray-500">Track stock across all exotic categories</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/50 text-xs text-gray-500 uppercase">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Species / Item Name</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">Price</th>
                    <th className="px-4 py-3 font-semibold">In Stock</th>
                    <th className="px-4 py-3 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.filter(p => p.sellerId === currentUser.id).length > 0 ? (
                    products.filter(p => p.sellerId === currentUser.id).map(p => (
                      <tr key={`inv-${p.id}`} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                        <td className="px-4 py-3 text-gray-600">{p.category}</td>
                        <td className="px-4 py-3 text-gray-900">{formatCurrency(p.price)}</td>
                        <td className="px-4 py-3 font-bold text-gray-700">{p.stock}</td>
                        <td className="px-4 py-3 text-right">
                          {p.stock > 5 ? (
                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold uppercase">Healthy</span>
                          ) : p.stock > 0 ? (
                            <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-bold uppercase animate-pulse">Low Stock</span>
                          ) : (
                            <span className="text-[10px] bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold uppercase">Depleted</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500 text-xs border border-dashed rounded-xl m-4">No inventory data. Add listings to track stock.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.filter(p => p.sellerId === currentUser.id).map(p => (
              <div key={p.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative group cursor-pointer hover:shadow-md transition-shadow">
                {p.stock <= 5 && (
                  <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-bounce z-10 shadow-md">
                    LOW STOCK
                  </div>
                )}
                <div className="w-full h-32 bg-gray-100 rounded-xl mb-3 overflow-hidden flex items-center justify-center text-xs text-gray-400 relative">
                  {(p.images?.[0] || p.videos?.[0]) ? (
                     p.images?.[0] ? <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <video src={p.videos[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" muted />
                  ) : 'No Image'}
                </div>
                <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{p.name}</h4>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span className="font-bold text-teal-600">{formatCurrency(p.price)}</span>
                  <span className="bg-gray-100 px-2 py-1 rounded-lg text-gray-600 font-medium text-xs">Qty: {p.stock}</span>
                </div>
              </div>
            ))}
            {products.filter(p => p.sellerId === currentUser.id).length === 0 && (
              <div className="col-span-full py-8 text-center text-gray-500 bg-white border border-dashed rounded-2xl">
                No active listings found.
              </div>
            )}
          </div>
        </div>
      )}

      {/* GENERAL USERS (BUYERS & SELLERS) */}
      {(currentUser.role === 'BUYER' || currentUser.role === 'SELLER') && (
        <>
          <WalletCard />
          <BuyerBadges />
          
          {/* Referral Program */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-700 p-6 rounded-3xl border border-teal-600 shadow-md text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <h3 className="font-bold text-lg mb-2 relative z-10 flex items-center gap-2">Referral Program</h3>
            <p className="text-sm text-teal-50 mb-4 relative z-10">Share your unique code to invite friends! Both you and your friend get a 10% discount on your next plan upgrade.</p>
            <div className="flex items-center gap-3 relative z-10">
              <div className="bg-white/20 px-4 py-2 rounded-xl border border-white/30 font-mono font-bold tracking-widest backdrop-blur-sm">
                EXO-{currentUser.id.substring(0,6).toUpperCase()}
              </div>
              <Button variant="secondary" className="bg-white text-teal-800 hover:bg-gray-100 font-bold" onClick={() => { navigator.clipboard.writeText(`EXO-${currentUser.id.substring(0,6).toUpperCase()}`); alert('Referral code copied to clipboard!'); }}>
                Copy Code
              </Button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-[0_0_15px_rgba(57,255,20,0.15)] hover:border-[#39FF14]/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-5 h-5" style={{ color: '#39FF14' }} />
              <h3 className="font-bold text-gray-900">My Orders</h3>
            </div>
            <div className="space-y-4">
              {orders.filter(o => o.buyerId === currentUser.id).map(order => (
                <div key={order.id} className="border border-gray-100 rounded-2xl p-4 bg-gray-50 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Order ID: {order.id.substring(0,8)}</div>
                    <div className="font-bold text-sm">{products.find(p=>p.id === order.items[0]?.productId)?.name} & others</div>
                    <div className="font-bold text-teal-600 mt-1">{formatCurrency(order.totalAmount)}</div>
                    <div className="text-xs font-medium px-2 py-1 bg-white border border-gray-200 rounded-lg inline-block mt-2">
                      Status: {order.status.replace('_', ' ')}
                    </div>
                  </div>
                </div>
              ))}
              {orders.filter(o => o.buyerId === currentUser.id).length === 0 && <div className="text-sm text-gray-400 text-center py-4">No orders yet.</div>}
            </div>
          </div>
        </>
      )}

      {/* Add Listing Modal */}
      <Modal isOpen={isAddListingOpen} onClose={() => setIsAddListingOpen(false)} title="Create New Listing">
        <form onSubmit={handleAddListing} className="space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-xs text-orange-800">
            <div className="flex items-center gap-2 mb-2 font-bold text-orange-900">
              <AlertTriangle className="w-4 h-4" /> Prohibited Items (DENR Compliance)
            </div>
            <ul className="list-disc pl-4 space-y-1">
              <li>Endangered native species without valid permits</li>
              <li>Venomous reptiles (unless Elite tier with special permit)</li>
              <li>Stolen/Smuggled flora and fauna</li>
            </ul>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Product Name</label>
              <input type="text" value={newProduct.name} onChange={e=>setNewProduct({...newProduct, name: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500" required />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-gray-700 mb-1">Price (₱)</label>
              <input type="number" value={newProduct.price} onChange={e=>setNewProduct({...newProduct, price: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500" required />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-gray-700 mb-1">Stock</label>
              <input type="number" value={newProduct.stock} onChange={e=>setNewProduct({...newProduct, stock: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500" required />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
              <select value={newProduct.category} onChange={e=>setNewProduct({...newProduct, category: e.target.value as any})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500">
                <option value="FEEDERS">Feeders</option>
                <option value="EXOTICS">Exotics</option>
                <option value="SUPPLIES">Supplies</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
              <textarea value={newProduct.description} onChange={e=>setNewProduct({...newProduct, description: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 h-24" />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Upload Images</label>
              <input type="file" accept="image/*" multiple className="text-xs w-full mb-1" />
              <p className="text-[10px] text-gray-500">Note: Standard listings are restricted to images only. Video uploads are reserved for Ads and Events.</p>
            </div>
            
            {newProduct.category === 'EXOTICS' && !currentUser.denrVerified && (
               <div className="col-span-2 bg-gray-100 p-3 rounded-lg text-xs text-gray-600 border border-dashed border-gray-300">
                 ⚠️ You are not DENR Verified. This exotic listing will not display the DENR badge and may be subjected to community reporting if valid permits are not provided in the description.
               </div>
            )}
          </div>
          <Button type="submit" className="w-full bg-gray-900 text-white">Publish Listing</Button>
        </form>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} title="Edit Profile & Security">
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {editProfileError && <div className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{editProfileError}</div>}
          
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-gray-900 border-b pb-2">Profile Details</h4>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Display Name</label>
              <input 
                type="text" 
                value={editProfileData.name} 
                onChange={e=>setEditProfileData({...editProfileData, name: e.target.value})} 
                className={`w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 ${currentUser.status === 'APPROVED' || currentUser.kycData ? 'opacity-60 cursor-not-allowed' : ''}`} 
                required 
                disabled={currentUser.status === 'APPROVED' || !!currentUser.kycData}
              />
              {(currentUser.status === 'APPROVED' || currentUser.kycData) && (
                <p className="text-[10px] text-orange-600 mt-1">Name is locked because you have submitted KYC/Verification.</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">Profile Picture / Avatar</label>
              
              {/* File Upload Selector */}
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center hover:bg-gray-50/50 transition-all relative cursor-pointer">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarFileChange} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  disabled={isUploading}
                />
                {isUploading ? (
                  <div className="text-xs font-bold text-teal-600 animate-pulse flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                    Uploading to Cloudinary ('exo_unsigned')...
                  </div>
                ) : editProfileData.avatar ? (
                  <div className="text-xs text-green-600 font-bold flex items-center justify-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Custom photo loaded! Click or drag to change
                  </div>
                ) : (
                  <div className="text-xs text-gray-400 font-semibold">
                    📸 Drag & drop your avatar, or click to upload
                  </div>
                )}
              </div>

              {/* URL Input Fallback */}
              <div className="flex gap-2 items-center">
                <span className="text-[10px] text-gray-400 font-bold uppercase shrink-0">Or Paste URL:</span>
                <input 
                  type="url" 
                  placeholder="https://example.com/avatar.jpg"
                  value={editProfileData.avatar} 
                  onChange={e=>setEditProfileData({...editProfileData, avatar: e.target.value})} 
                  className="w-full px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-teal-500 text-xs" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Bio / Description</label>
              <textarea 
                value={editProfileData.bio} 
                onChange={e=>setEditProfileData({...editProfileData, bio: e.target.value})} 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 h-20"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm text-gray-900 border-b pb-2">Security / Change Password</h4>
            {passwordError && <div className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">{passwordError}</div>}
            
            <div className="relative">
              <label className="block text-xs font-bold text-gray-700 mb-1">Current Password</label>
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={passwordData.currentPassword} 
                onChange={e=>setPasswordData({...passwordData, currentPassword: e.target.value})} 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 pr-10" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[28px] text-gray-400 hover:text-teal-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-xs font-bold text-gray-700 mb-1">New Password</label>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={passwordData.newPassword} 
                  onChange={e=>setPasswordData({...passwordData, newPassword: e.target.value})} 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 pr-10" 
                />
              </div>
              <div className="relative">
                <label className="block text-xs font-bold text-gray-700 mb-1">Confirm New</label>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={passwordData.confirmPassword} 
                  onChange={e=>setPasswordData({...passwordData, confirmPassword: e.target.value})} 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 pr-10" 
                />
              </div>
            </div>
            <p className="text-[10px] text-gray-500">Leave password fields blank if you do not wish to change your password.</p>
          </div>

          {isRegularUser && (
            <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-500" /> Performance Gateway
                  </h5>
                  <p className="text-[10px] text-gray-500 mt-0.5 font-medium">Toggle optimized UI & Lite Mode manually on this device.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPerformanceMode(performanceMode === 'LITE' ? 'FULL' : 'LITE')}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none flex items-center ${performanceMode === 'LITE' ? 'bg-emerald-500 justify-end' : 'bg-gray-300 justify-start'}`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                </button>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full bg-teal-600 text-white">Save Changes</Button>
        </form>
      </Modal>
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
      
      {/* 40+ PLATFORM MANAGEMENT & CONTROL CENTER */}
      <RoleControlCenter />
    </div>
  );
};
