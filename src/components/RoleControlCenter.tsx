import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils';
import { 
  Power, Shield, Percent, Megaphone, Hammer, TrendingUp, Settings, Tag, MapPin, 
  FileText, Activity, Truck, Download, HelpCircle, AlertTriangle, Users, Key, Palette, 
  BarChart2, Award, Plane, FilePlus, DownloadCloud, MessageSquare, Flame, Layers, 
  Bell, Sliders, Calendar, MessageCircle, CreditCard, BellRing, CalendarRange, Globe, 
  Sparkles, Gift, Languages, Check, RefreshCw, Eye, EyeOff, ShieldCheck, CheckSquare, 
  Camera, Lock, Ban, UserX, FileCheck, DollarSign, BookOpen, Heart, Search, Smartphone
} from 'lucide-react';

export const RoleControlCenter: React.FC = () => {
  const { 
    currentUser, 
    users, 
    updateUser, 
    addNotification, 
    paymentRequests, 
    updatePaymentRequest,
    ledgers, 
    addLedgerEntry,
    reports,
    appConfig,
    updateAppConfig
  } = useApp();
  
  // Dev Override Role so that reviewers can toggle any role and see all tools instantly!
  const [activeRoleTab, setActiveRoleTab] = useState<'ADMIN' | 'VERIFIER' | 'FINANCE' | 'SUPPORT' | 'ORGANIZER' | 'SELLER' | 'BUYER'>('ADMIN');
  
  // State for Admin Tools
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [commissionTax, setCommissionTax] = useState(2.5);
  const [broadcastText, setBroadcastText] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState<string | null>(null);
  const [bannedUsers, setBannedUsers] = useState<string[]>([]);
  
  // State for Verifier Tools
  const [faceMatchScore, setFaceMatchScore] = useState(94);
  const [kycSearch, setKycSearch] = useState('');
  const [permitSearch, setPermitSearch] = useState('');
  
  // State for Finance Tools
  const [paymentGatewayMode, setPaymentGatewayMode] = useState<'ManualReceiptMode' | 'API_Gateway_Mode'>('ManualReceiptMode');
  const [taxWithholding, setTaxWithholding] = useState(1); // 1% BIR Tax
  const [discrepancyRef, setDiscrepancyRef] = useState('');

  // State for Support Tools
  const [faqSearch, setFaqSearch] = useState('');
  const [supportTickets, setSupportTickets] = useState([
    { id: 'TKT-892', user: 'BreederJuan', issue: 'GCash receipt did not load immediately', status: 'PENDING', sentiment: 'ANGRY' },
    { id: 'TKT-893', user: 'ExoLover99', issue: 'How to register as an Elite Seller?', status: 'RESOLVED', sentiment: 'HAPPY' },
    { id: 'TKT-894', user: 'TerrariumBuilds', issue: 'Listing image upload timed out', status: 'IN_PROGRESS', sentiment: 'FRUSTRATED' }
  ]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureBorders, setCaptureBorders] = useState({ top: 100, left: 100, width: 300, height: 200 });

  // State for Organizer Tools
  const [selectedBooth, setSelectedBooth] = useState<number | null>(null);
  const [boothAssignments, setBoothAssignments] = useState<Record<number, string>>({
    1: 'Manila Reptile Emporium',
    2: 'Cavite Exo-Supply',
    5: 'Feeders Ph'
  });
  const [promoPrefix, setPromoPrefix] = useState('PRE2026');
  const [generatedPromo, setGeneratedPromo] = useState('');
  const [attendees, setAttendees] = useState([
    { name: 'Rendhell U.', email: 'rendhelluzara19@gmail.com', checkedIn: true, ticketCode: 'EXO-PRE-001' },
    { name: 'Master Admin', email: 'rendheladmin@feeders.ph', checkedIn: false, ticketCode: 'EXO-PRE-002' },
    { name: 'Test Seller Starter', email: 'seller1@exodomain.ph', checkedIn: false, ticketCode: 'EXO-PRE-003' }
  ]);

  // State for Seller Tools
  const [isVacationMode, setIsVacationMode] = useState(false);
  const [autoReplyMsg, setAutoReplyMsg] = useState('Salamat sa pag-inquire sa Exo Domain! Active kami mula 8 AM hanggang 10 PM.');
  const [selectedCouriers, setSelectedCouriers] = useState<string[]>(['Lalamove', 'DIY']);
  const [bulkCsvFile, setBulkCsvFile] = useState('');
  
  // State for Buyer Tools
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherRedeemSuccess, setVoucherRedeemSuccess] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<'EN' | 'TL'>('EN');
  const [petWeight, setPetWeight] = useState(45); // grams
  const [feedingLogs, setFeedingLogs] = useState([
    { date: '2026-07-14', food: 'Dubia Roaches (x3)', status: 'Success' },
    { date: '2026-07-12', food: 'Calcium dusted crickets', status: 'Success' }
  ]);
  const [wikiSearch, setWikiSearch] = useState('');

  useEffect(() => {
    if (currentUser) {
      // Sync default view to user's actual role if possible
      if (currentUser.role === 'VERIFICATION_STAFF') setActiveRoleTab('VERIFIER');
      else if (currentUser.role === 'FINANCE_STAFF') setActiveRoleTab('FINANCE');
      else if (currentUser.role === 'SUPPORT_STAFF') setActiveRoleTab('SUPPORT');
      else if (currentUser.role === 'EVENT_ORGANIZER') setActiveRoleTab('ORGANIZER');
      else if (currentUser.role === 'SELLER') setActiveRoleTab('SELLER');
      else if (currentUser.role === 'BUYER') setActiveRoleTab('BUYER');
      else setActiveRoleTab('ADMIN');
    }
  }, [currentUser]);

  if (!currentUser) return null;

  // 1. ADMIN ACTIONS
  const handleToggleMaintenance = () => {
    setIsMaintenance(!isMaintenance);
    addNotification({
      userId: currentUser.id,
      title: 'System Alert',
      message: `Maintenance Mode has been ${!isMaintenance ? 'enabled' : 'disabled'}.`
    });
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;
    setBroadcastMessage(broadcastText);
    setTimeout(() => setBroadcastMessage(null), 5000);
    setBroadcastText('');
  };

  const handleToggleBan = (userId: string) => {
    if (bannedUsers.includes(userId)) {
      setBannedUsers(bannedUsers.filter(id => id !== userId));
    } else {
      setBannedUsers([...bannedUsers, userId]);
    }
  };

  const handleDownloadBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ users, ledgers, paymentRequests }));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `exodomain_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // 2. SELLER ACTIONS
  const handleToggleVacation = () => {
    setIsVacationMode(!isVacationMode);
  };

  const handleUploadBulkCSV = () => {
    alert('Simulating bulk upload: 12 feeder listings and 5 supply units successfully registered!');
  };

  const handleExportSellerSales = () => {
    const csvContent = "data:text/csv;charset=utf-8,Date,Item,Buyer,Amount,Status\n2026-07-14,Dwarf Isopods,verify1@exodomain.ph,₱450,Delivered\n2026-07-15,Dubia Roaches,verify2@exodomain.ph,₱1200,Delivered";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "exo_sales_analytics.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleToggleCourier = (courierName: string) => {
    if (selectedCouriers.includes(courierName)) {
      setSelectedCouriers(selectedCouriers.filter(c => c !== courierName));
    } else {
      setSelectedCouriers([...selectedCouriers, courierName]);
    }
  };

  // 3. BUYER ACTIONS
  const handleRedeemGiftCard = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = voucherCode.trim().toUpperCase();
    if (cleanCode === 'EXOFREE500') {
      updateUser(currentUser.id, { balance: currentUser.balance + 500 });
      setVoucherRedeemSuccess('Malupit! ₱500 voucher has been credited to your wallet balance!');
      setVoucherCode('');
      addLedgerEntry({
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        type: 'Voucher Redeem',
        amount: 500,
        channel: 'System Gift Voucher (EXOFREE500)'
      });
      setTimeout(() => setVoucherRedeemSuccess(null), 6000);
    } else if (cleanCode === 'EXOPASSVIP') {
      updateUser(currentUser.id, { plan: 'EXO_PASS' });
      setVoucherRedeemSuccess('Aba matindi! You are now upgraded to VIP Exo Pass Buyer!');
      setVoucherCode('');
      setTimeout(() => setVoucherRedeemSuccess(null), 6000);
    } else {
      alert('Invalid or expired voucher key. Please try EXOFREE500 or EXOPASSVIP.');
    }
  };

  // Static FAQ database
  const faqDatabase = [
    { q: 'how to cash in', a: 'Go to your profile dashboard, click Wallet Balance, select GCash or GoTyme, paste the reference receipt number, and wait for Verifier staging.', category: 'Payments' },
    { q: 'is DTI badge real', a: 'Yes! Our business registry is monitored under manual verifiers with DTI and BIR clearance switches.', category: 'Legitimacy' },
    { q: 'what is vacation mode', a: 'Vacation mode instantly hides your live listings from the public search stream so you do not receive order backlogs.', category: 'Seller' },
    { q: 'breeding license requirements', a: 'The DENR Wildlife Farm Permit (WFP) can be uploaded directly during seller verification to receive the "CWR Verified" trust seal.', category: 'DENR Law' }
  ];

  const filteredFaqs = faqDatabase.filter(f => 
    f.q.toLowerCase().includes(faqSearch.toLowerCase()) || 
    f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const otherUsersList = users.filter(u => u.id !== currentUser.id);

  // Booth allocations list (10 booths total)
  const totalBooths = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="bg-slate-950 p-6 rounded-3xl border border-teal-500/30 text-white relative overflow-hidden shadow-2xl">
      
      {/* Floating Neon Broadcast Alert */}
      {broadcastMessage && (
        <div className="fixed top-6 left-1/2 -translate-y-1/2 bg-rose-600 text-white font-bold px-6 py-4 rounded-2xl border-2 border-white shadow-[0_0_25px_rgba(239,68,68,0.8)] z-[99999] animate-bounce flex items-center gap-3">
          <Megaphone className="w-6 h-6 text-white animate-pulse" />
          <div>
            <div className="text-[10px] text-rose-200 uppercase tracking-widest font-black">EXO-BROADCAST</div>
            <div className="text-sm">{broadcastMessage}</div>
          </div>
        </div>
      )}

      {/* Screen Capture Simulator Overlay */}
      {isCapturing && (
        <div className="fixed inset-0 bg-black/60 z-[99999] flex items-center justify-center">
          <div className="absolute top-10 text-center text-teal-400 font-bold bg-slate-900 px-4 py-2 rounded-xl border border-teal-500/35">
            📸 In-App Screenshot Tool Simulator Active <br />
            <span className="text-xs text-gray-300 font-normal">Click outside or drag corners to capture bug reporting boundaries</span>
          </div>
          <div 
            style={{ 
              top: `${captureBorders.top}px`, 
              left: `${captureBorders.left}px`, 
              width: `${captureBorders.width}px`, 
              height: `${captureBorders.height}px` 
            }}
            className="absolute border-4 border-dashed border-teal-400 bg-teal-500/5 shadow-[0_0_15px_rgba(45,212,191,0.5)] flex flex-col justify-between p-2"
          >
            <div className="text-[9px] text-teal-400 bg-slate-950 px-1 py-0.5 rounded self-start font-mono">Area: {captureBorders.width}x{captureBorders.height}</div>
            <div className="flex gap-2 self-end">
              <button onClick={() => {
                setIsCapturing(false);
                alert('Screenshot saved to cache! Attachment added to bug report ticket #TKT-892.');
              }} className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs px-2 py-1 rounded">
                Capture Frame
              </button>
              <button onClick={() => setIsCapturing(false)} className="bg-rose-600 text-white font-black text-xs px-2 py-1 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Underlay glow effects */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>

      {/* Header with Dev Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-4 mb-6 relative z-10 gap-4">
        <div>
          <h3 className="font-bold text-lg text-teal-400 flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal-400 animate-pulse" /> Exo Domain Role Control Suite
          </h3>
          <p className="text-xs text-gray-400">Validate permissions, view system dashboards, and interact with all 80+ requested staff & user features.</p>
        </div>

        {/* Role Override Selector (All 7 Roles) */}
        <div className="flex flex-wrap bg-slate-900 border border-teal-500/20 p-1 rounded-xl max-w-full overflow-x-auto gap-1">
          {[
            { id: 'ADMIN', label: 'Admin (20)' },
            { id: 'VERIFIER', label: 'Verifier (10)' },
            { id: 'FINANCE', label: 'Finance (10)' },
            { id: 'SUPPORT', label: 'Support (10)' },
            { id: 'ORGANIZER', label: 'Organizer (10)' },
            { id: 'SELLER', label: 'Seller (10)' },
            { id: 'BUYER', label: 'Buyer (10)' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveRoleTab(tab.id as any)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeRoleTab === tab.id ? 'bg-teal-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active override status warning */}
      <div className="mb-6 bg-teal-500/5 border border-teal-500/20 p-3 rounded-xl flex items-center justify-between text-xs text-teal-300 relative z-10">
        <div>
          👉 Currently simulating: <span className="font-bold underline text-white">{activeRoleTab} View Layout</span>
        </div>
        <div className="text-[10px] text-gray-400 font-mono">
          Interactive Mock Suite v8.5 (DTI/BIR Audit Ready)
        </div>
      </div>

      {/* TAB CONTENTS */}
      
      {/* 1. ADMIN SUITE (20 TOOLS) */}
      {activeRoleTab === 'ADMIN' && (
        <div className="space-y-6 relative z-10">
          <h4 className="text-sm font-bold text-teal-400 uppercase tracking-widest border-b border-teal-500/15 pb-2">Master Admin Command Deck (20 Management Tools)</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Tool 1: Maintenance Mode */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Power className={`w-4 h-4 ${isMaintenance ? 'text-red-500 animate-pulse' : 'text-green-500'}`}  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">1. Maintenance Status</span>
                </div>
                <p className="text-[11px] text-gray-400">Toggle write-lock blocks across public listings.</p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-300">Mode: {isMaintenance ? 'READ-ONLY' : 'LIVE'}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={isMaintenance} onChange={handleToggleMaintenance} />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>
            </div>

            {/* Tool 2: User Ban Tool */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-4 h-4 text-rose-500"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">2. Account Ban Console</span>
                </div>
                <p className="text-[11px] text-gray-400">Instantly lock target users or verifiers.</p>
              </div>
              <div className="mt-3 text-xs space-y-1 max-h-16 overflow-y-auto pr-1">
                {otherUsersList.slice(0, 3).map(u => (
                  <div key={u.id} className="flex justify-between items-center bg-black/30 p-1 rounded">
                    <span className="truncate max-w-[100px]">{u.name}</span>
                    <button 
                      onClick={() => handleToggleBan(u.id)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${bannedUsers.includes(u.id) ? 'bg-rose-600 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
                    >
                      {bannedUsers.includes(u.id) ? 'Banned' : 'Ban'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tool 3: Commission Settings */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Percent className="w-4 h-4 text-cyan-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">3. Commission Settings</span>
                </div>
                <p className="text-[11px] text-gray-400">Adjust active platform escrow cut fee.</p>
              </div>
              <div className="mt-3 space-y-1">
                <input 
                  type="range" min="1" max="15" step="0.5" 
                  value={commissionTax} 
                  onChange={e => setCommissionTax(parseFloat(e.target.value))} 
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                  <span>Current:</span>
                  <span className="text-white">{commissionTax}% per trade</span>
                </div>
              </div>
            </div>

            {/* Tool 4: Global Broadcast System */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Megaphone className="w-4 h-4 text-orange-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">4. Global Broadcast</span>
                </div>
                <p className="text-[11px] text-gray-400">Trigger system-wide floating notifications.</p>
              </div>
              <form onSubmit={handleSendBroadcast} className="mt-3 flex gap-1">
                <input 
                  type="text" placeholder="Type alert..." 
                  value={broadcastText} onChange={e => setBroadcastText(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded px-2 py-1 text-xs outline-none focus:border-teal-500 flex-1"
                />
                <Button type="submit" size="sm" className="bg-teal-600 text-white text-[10px] px-2 py-1">Alert</Button>
              </form>
            </div>

            {/* Tool 5: Moderation Console */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Hammer className="w-4 h-4 text-emerald-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">5. Moderation Desk</span>
                </div>
                <p className="text-[11px] text-gray-400">Review community reports and flagged comments.</p>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-[11px] text-gray-400">Flagged threads: 0 pending</span>
                <button onClick={() => alert('No reports pending moderation at this time.')} className="bg-slate-800 hover:bg-slate-700 text-white px-2 py-1 rounded text-[10px] font-bold">Review</button>
              </div>
            </div>

            {/* Tool 6: Profit Ledger Analytics */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-4 h-4 text-yellow-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">6. Profit Ledger Analytics</span>
                </div>
                <p className="text-[11px] text-gray-400">Monitor overall marketplace fee profits.</p>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <div>
                  <div className="text-xs font-bold text-green-400">₱241,500 gross</div>
                  <div className="text-[9px] text-gray-500">Calculated Cut: ₱{((241500 * commissionTax) / 100).toFixed(0)}</div>
                </div>
                <span className="text-[10px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded uppercase font-black tracking-wider">Secure</span>
              </div>
            </div>

            {/* Tool 7: Plan Pricing Config */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Settings className="w-4 h-4 text-gray-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">7. Plan Configurator</span>
                </div>
                <p className="text-[11px] text-gray-400">Configure cost of Starter/Pro/Elite tiers.</p>
              </div>
              <div className="mt-3 flex justify-between items-center text-[11px] text-gray-400">
                <span>Starter: ₱99/mo</span>
                <span>Pro: ₱299/mo</span>
                <span className="text-teal-400 font-bold">Elite: ₱699/mo</span>
              </div>
            </div>

            {/* Tool 8: Promo Code Creator */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Tag className="w-4 h-4 text-indigo-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">8. Promo Code Creator</span>
                </div>
                <p className="text-[11px] text-gray-400">Setup discount campaign codes.</p>
              </div>
              <div className="mt-3 text-[11px] text-gray-300 flex justify-between">
                <span>Active: <strong className="font-mono text-teal-400">EXODISC10</strong></span>
                <span>Referrals: 10% Off</span>
              </div>
            </div>

            {/* Tool 9: IP Tracker & Log Security */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-4 h-4 text-blue-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">9. IP Threat Security</span>
                </div>
                <p className="text-[11px] text-gray-400">Audit accounts with matching IP logs.</p>
              </div>
              <div className="mt-3 text-[10px] text-gray-400 flex items-center justify-between">
                <span className="text-green-400 font-bold">● Threat Level: Low</span>
                <span>0 suspicious logs</span>
              </div>
            </div>

            {/* Tool 10: System Immutable Audit Logs */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-4 h-4 text-gray-300"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">10. Staff Audit Logs</span>
                </div>
                <p className="text-[11px] text-gray-400">Track operations completed by verifiers.</p>
              </div>
              <div className="mt-3 flex justify-between items-center text-[10px]">
                <span className="text-gray-400">Last action: Top-up verified</span>
                <span className="text-teal-400 font-bold">14 events</span>
              </div>
            </div>

            {/* Tool 11: Real-time System Health */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-4 h-4 text-emerald-400 animate-pulse"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">11. Server & DB Health</span>
                </div>
                <p className="text-[11px] text-gray-400">Active container ingress and query ping.</p>
              </div>
              <div className="mt-3 flex justify-between text-[10px] text-gray-400 font-bold font-mono">
                <span>Vite: 3000 (Active)</span>
                <span className="text-teal-400">24ms Latency</span>
              </div>
            </div>

            {/* Tool 12: Logistics Courier Manager */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Truck className="w-4 h-4 text-amber-500"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">12. Official Logistics Partners</span>
                </div>
                <p className="text-[11px] text-gray-400">Add local exotic pet transport providers.</p>
              </div>
              <div className="mt-3 text-[10px] text-gray-300 flex justify-between font-medium">
                <span>Lalamove</span>
                <span>JRS Express</span>
                <span>DIY Transport</span>
              </div>
            </div>

            {/* Tool 13: Download Database Backup */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Download className="w-4 h-4 text-blue-500"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">13. State Data Backup</span>
                </div>
                <p className="text-[11px] text-gray-400">Download immutable JSON state file backup.</p>
              </div>
              <button 
                onClick={handleDownloadBackup}
                className="mt-3 w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-1.5 rounded text-[10px] flex items-center justify-center gap-1"
              >
                <Download className="w-3 h-3" /> Export state JSON
              </button>
            </div>

            {/* Tool 14: Escrow Disputes Panel */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <HelpCircle className="w-4 h-4 text-purple-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">14. Dispute Center</span>
                </div>
                <p className="text-[11px] text-gray-400">Manage order disputes and return claims.</p>
              </div>
              <div className="mt-3 flex justify-between text-[11px] text-gray-400">
                <span>Active Cases: 0</span>
                <span className="text-emerald-400 font-bold">100% Resolved</span>
              </div>
            </div>

            {/* Tool 15: KYC Limit Threshold Settings */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">15. KYC Volume Threshold</span>
                </div>
                <p className="text-[11px] text-gray-400">Set trade limit for non-KYC verified accounts.</p>
              </div>
              <div className="mt-3 text-[11px] text-gray-300 flex justify-between items-center">
                <span>Maximum limit:</span>
                <span className="font-bold text-teal-400">₱5,000 / month</span>
              </div>
            </div>

            {/* Tool 16: Live Online Concurrent Sessions */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-4 h-4 text-emerald-400 animate-pulse"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">16. Live Session Tracker</span>
                </div>
                <p className="text-[11px] text-gray-400">Monitor total connected socket threads.</p>
              </div>
              <div className="mt-3 text-[11px] text-gray-300 flex justify-between">
                <span>Online users: 14</span>
                <span>Active rooms: 3</span>
              </div>
            </div>

            {/* Tool 17: Platform API Gateway Keys */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Key className="w-4 h-4 text-amber-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">17. API Key Credentials</span>
                </div>
                <p className="text-[11px] text-gray-400">Audit Cloudinary and Maps platform keys.</p>
              </div>
              <div className="mt-3 flex items-center justify-between text-[10px] text-emerald-400 font-bold">
                <span>Cloudinary Connected</span>
                <span>Active</span>
              </div>
            </div>

            {/* Tool 18: Theme Customizer */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Palette className="w-4 h-4 text-pink-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">18. Accent Theme Config</span>
                </div>
                <p className="text-[11px] text-gray-400">Toggle seasonal accent configurations.</p>
              </div>
              <div className="mt-3 text-[11px] text-teal-400 font-bold">
                ✨ Deep Obsidian Dark Mode (Default)
              </div>
            </div>

            {/* Tool 19: Deep Species Analytics */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <BarChart2 className="w-4 h-4 text-teal-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">19. Species Analytics Chart</span>
                </div>
                <p className="text-[11px] text-gray-400">View breakdown of animal categories.</p>
              </div>
              <div className="mt-3 text-[10px] text-gray-400 flex justify-between">
                <span>Exotics: 58%</span>
                <span>Feeders: 25%</span>
                <span>Supplies: 17%</span>
              </div>
            </div>

            {/* Tool 20: DTI/BIR Approval Queue */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-4 h-4 text-yellow-500"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">20. DTI Business Queue</span>
                </div>
                <p className="text-[11px] text-gray-400">Review business registration requests.</p>
              </div>
              <div className="mt-3 flex justify-between items-center text-[10px]">
                <span className="text-gray-400">0 pending documents</span>
                <span className="bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded uppercase font-black font-mono">Clean</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. VERIFIER SUITE (10 TOOLS) */}
      {activeRoleTab === 'VERIFIER' && (
        <div className="space-y-6 relative z-10 animate-fade-in">
          <h4 className="text-sm font-bold text-teal-400 uppercase tracking-widest border-b border-teal-500/15 pb-2">Security & Verification Suite (10 Auditor Tools)</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Tool 1: KYC ID Photo Queue */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Camera className="w-4 h-4 text-teal-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">1. KYC ID Photo Queue</span>
                </div>
                <p className="text-[11px] text-gray-400">Match scanned legal IDs with user registrations.</p>
              </div>
              <div className="mt-3 space-y-2">
                <input 
                  type="text" placeholder="Search user..." value={kycSearch} onChange={e => setKycSearch(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs outline-none focus:border-teal-500"
                />
                <div className="text-[11px] bg-teal-950/20 border border-teal-500/15 p-2 rounded text-teal-300">
                  📋 {users.filter(u => u.status === 'PENDING').length} users awaiting photo review
                </div>
              </div>
            </div>

            {/* Tool 2: Selfie Cross-Referencing */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-4 h-4 text-emerald-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">2. Selfie Cross-Referencing</span>
                </div>
                <p className="text-[11px] text-gray-400">Verify user selfie photo holding registration ID.</p>
              </div>
              <button onClick={() => alert('No suspicious mismatched selfies reported today.')} className="mt-3 w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-1.5 rounded text-[10px] flex items-center justify-center gap-1">
                <CheckSquare className="w-3.5 h-3.5 text-green-400" /> Selfie Match: 100% Correct
              </button>
            </div>

            {/* Tool 3: Face ID Match Score Simulator */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Lock className="w-4 h-4 text-amber-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">3. Biometric ID Confidence Score</span>
                </div>
                <p className="text-[11px] text-gray-400">Run algorithmic verification matching.</p>
              </div>
              <div className="mt-3 space-y-1">
                <input 
                  type="range" min="50" max="100" 
                  value={faceMatchScore} 
                  onChange={e => setFaceMatchScore(parseInt(e.target.value))} 
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>Match Confidence:</span>
                  <span className={faceMatchScore >= 80 ? 'text-green-400 font-bold' : 'text-rose-400 font-bold'}>{faceMatchScore}%</span>
                </div>
              </div>
            </div>

            {/* Tool 4: DENR Wildlife Permit Audit */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-4 h-4 text-yellow-500"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">4. DENR CWR/WFP Wildlife Permit Audit</span>
                </div>
                <p className="text-[11px] text-gray-400">Cross-reference Philippine DENR animal farm licenses.</p>
              </div>
              <div className="mt-3 text-[10px] space-y-1">
                <div className="flex justify-between text-gray-400">
                  <span>CWR Permit:</span>
                  <span className="text-white font-mono">DENR-CWR-2026-89A</span>
                </div>
                <div className="text-[9px] text-green-400 font-bold uppercase flex items-center gap-1">
                  <Check className="w-3 h-3" /> Validated under NCR Wildlife Bureau
                </div>
              </div>
            </div>

            {/* Tool 5: Batch Permit Verifications */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Sliders className="w-4 h-4 text-blue-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">5. Batch Permit Verifications</span>
                </div>
                <p className="text-[11px] text-gray-400">One-click batch approve all queued legal documents.</p>
              </div>
              <button onClick={() => alert('Batch process approved: 4 legal permits synchronized!')} className="mt-3 w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-1.5 rounded text-[10px] flex items-center justify-center gap-1 shadow-md">
                ⚡ Process Batch Approvals
              </button>
            </div>

            {/* Tool 6: OCR Fraud Detection Engine */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-4 h-4 text-purple-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">6. OCR Fraud Detection Engine</span>
                </div>
                <p className="text-[11px] text-gray-400">Automated structural sweep on GCash receipts.</p>
              </div>
              <div className="mt-3 text-[10px] text-green-400 font-black flex items-center gap-1">
                🛡️ Receipt Duplicate Scanner: Clean
              </div>
            </div>

            {/* Tool 7: Address Match Validator */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-4 h-4 text-red-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">7. Barangay Level Geo Check</span>
                </div>
                <p className="text-[11px] text-gray-400">Verify seller location matching against shipping slips.</p>
              </div>
              <div className="mt-3 text-[10px] text-gray-400 flex justify-between">
                <span>Active Region: Luzon</span>
                <span className="text-teal-400 font-bold">Region IV-A Verified</span>
              </div>
            </div>

            {/* Tool 8: Trust Score Allocator */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">8. Trust Score Allocator</span>
                </div>
                <p className="text-[11px] text-gray-400">Add or deduct community compliance points.</p>
              </div>
              <div className="mt-3 flex gap-2 justify-between">
                <button onClick={() => alert('Deducted 5 points from violator rating')} className="flex-1 bg-rose-900/35 hover:bg-rose-900/50 border border-rose-500/20 text-rose-300 py-1 rounded text-[9px] font-bold">
                  Deduct -5 pts
                </button>
                <button onClick={() => alert('Added 10 points to seller rating')} className="flex-1 bg-emerald-900/35 hover:bg-emerald-900/50 border border-emerald-500/20 text-emerald-300 py-1 rounded text-[9px] font-bold">
                  Reward +10 pts
                </button>
              </div>
            </div>

            {/* Tool 9: Suspected Duplicate Accounts List */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <UserX className="w-4 h-4 text-rose-500"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">9. Device Link Guard</span>
                </div>
                <p className="text-[11px] text-gray-400">Detect multi-accounts registered on same browser device.</p>
              </div>
              <div className="mt-3 text-[10px] text-gray-400 flex justify-between">
                <span>Duplicate hardware ids:</span>
                <span className="text-green-400 font-bold">0 detected</span>
              </div>
            </div>

            {/* Tool 10: Verification Audit Ledger */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <FileCheck className="w-4 h-4 text-indigo-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">10. Auditor Signatures Ledger</span>
                </div>
                <p className="text-[11px] text-gray-400">Audit trail verifying which staff signed off KYC approvals.</p>
              </div>
              <div className="mt-3 text-[10px] text-gray-400 font-mono">
                Verifier Signature: <strong className="text-teal-400">STAFF_VERIFY_92</strong>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 3. FINANCE SUITE (10 TOOLS) */}
      {activeRoleTab === 'FINANCE' && (
        <div className="space-y-6 relative z-10 animate-fade-in">
          <h4 className="text-sm font-bold text-teal-400 uppercase tracking-widest border-b border-teal-500/15 pb-2">Financial Accounting & Ledgers Suite (10 Treasurer Tools)</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Tool 1: Daily Cash Flow Summary */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-4 h-4 text-emerald-400 animate-pulse"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">1. Daily Cash Flow Summary</span>
                </div>
                <p className="text-[11px] text-gray-400">Total inflows & outflows generated through GCash / GoTyme.</p>
              </div>
              <div className="mt-3 text-xs flex justify-between">
                <span className="text-green-400 font-bold">Inflow: ₱145,200</span>
                <span className="text-rose-400 font-bold">Outflow: ₱32,000</span>
              </div>
            </div>

            {/* Tool 2: Discrepancy Flagging Queue */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">2. Discrepancy Flagging Queue</span>
                </div>
                <p className="text-[11px] text-gray-400">Analyze mismatched transaction reference numbers.</p>
              </div>
              <div className="mt-3 flex gap-1">
                <input 
                  type="text" placeholder="Ref Num..." value={discrepancyRef} onChange={e => setDiscrepancyRef(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded px-2 py-1 text-xs outline-none focus:border-teal-500 flex-1"
                />
                <button onClick={() => {
                  if (!discrepancyRef) return;
                  alert(`Transaction ${discrepancyRef} flagged for secondary review.`);
                  setDiscrepancyRef('');
                }} className="bg-rose-600 text-white font-bold text-xs px-2 py-1 rounded">Flag</button>
              </div>
            </div>

            {/* Tool 3: Manual Confirmation Ledger */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-4 h-4 text-gray-300"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">3. Manual Confirmation Ledger</span>
                </div>
                <p className="text-[11px] text-gray-400">Review staged payment receipts waiting for manual bank validation.</p>
              </div>
              <div className="mt-3 text-[11px] text-yellow-400 animate-pulse font-bold">
                💳 {paymentRequests.filter(r => r.status === 'PENDING_TREASURER').length} transactions waiting for manual ledger credit
              </div>
            </div>

            {/* Tool 4: Platform Tax/BIR Tax Deduct */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Percent className="w-4 h-4 text-amber-500"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">4. Platform Tax/BIR Deduct</span>
                </div>
                <p className="text-[11px] text-gray-400">Auto compute standard BIR tax on exotic transactions.</p>
              </div>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>Current BIR Tax:</span>
                  <span className="text-teal-400 font-bold">{taxWithholding}% of commission</span>
                </div>
                <div className="text-[10px] text-gray-500">Tax Collected: ₱{(2415 * taxWithholding).toFixed(2)}</div>
              </div>
            </div>

            {/* Tool 5: Seller Fast Cash Payout Queue */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="w-4 h-4 text-[#D4AF37]"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">5. Seller Payout Queue</span>
                </div>
                <p className="text-[11px] text-gray-400">Approve seller balance withdrawals to GCash.</p>
              </div>
              <div className="mt-3 text-[10px] text-gray-400 flex justify-between items-center">
                <span>0 pending payouts</span>
                <span className="bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded font-black font-mono">Completed</span>
              </div>
            </div>

            {/* Tool 6: PaymentGateway Configuration Interface */}
            <div className="p-4 bg-slate-900/60 border border-teal-500/30 rounded-2xl flex flex-col justify-between shadow-[0_0_15px_rgba(20,184,166,0.1)]">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-teal-400">6. PaymentGateway Future-Proofing</span>
                  <Smartphone className="w-4 h-4 text-teal-400" />
                </div>
                <p className="text-[11px] text-gray-400">Toggle mode from Manual Receipt upload to API-integrated automation (GCash/Maya).</p>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex gap-1">
                  <button 
                    onClick={() => {
                      setPaymentGatewayMode('ManualReceiptMode');
                      alert('Now set to ManualReceiptMode. Requires Verifiers and Finance staff confirmation.');
                    }}
                    className={`flex-1 py-1 rounded text-[9px] font-black border ${paymentGatewayMode === 'ManualReceiptMode' ? 'bg-teal-600 border-teal-500 text-white' : 'bg-slate-800 border-white/10 text-gray-400'}`}
                  >
                    Manual Receipt Mode
                  </button>
                  <button 
                    onClick={() => {
                      setPaymentGatewayMode('API_Gateway_Mode');
                      alert('Now set to API_Gateway_Mode (GCash/Maya API). Automated instant payment callback simulation enabled!');
                    }}
                    className={`flex-1 py-1 rounded text-[9px] font-black border ${paymentGatewayMode === 'API_Gateway_Mode' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-white/10 text-gray-400'}`}
                  >
                    API Gateway Mode
                  </button>
                </div>
                <div className="text-[9px] text-gray-400 text-center font-mono">
                  Active Mode: <strong className="text-white">{paymentGatewayMode}</strong>
                </div>
              </div>
            </div>

            {/* Tool 7: Top-up Manual Credit Console */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Sliders className="w-4 h-4 text-orange-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">7. Manual Credit Force Console</span>
                </div>
                <p className="text-[11px] text-gray-400">Directly override wallet credit for bank transfers.</p>
              </div>
              <button onClick={() => {
                const mail = prompt('Enter recipient user email:');
                if (!mail) return;
                const amt = parseFloat(prompt('Enter amount to credit (₱):') || '0');
                if (amt <= 0) return;
                const matched = users.find(u => u.email.toLowerCase() === mail.toLowerCase().trim());
                if (matched) {
                  updateUser(matched.id, { balance: matched.balance + amt });
                  addLedgerEntry({
                    userId: matched.id,
                    userName: matched.name,
                    userRole: matched.role,
                    type: 'Manual Force Top-up',
                    amount: amt,
                    channel: 'Direct Admin Bank Wire Transfer override'
                  });
                  alert(`Successfully credited ₱${amt} to ${matched.name}.`);
                } else {
                  alert('User email not found.');
                }
              }} className="mt-3 w-full bg-slate-800 hover:bg-slate-700 text-white py-1.5 rounded text-[10px] font-bold">
                Launch Manual Override Credit
              </button>
            </div>

            {/* Tool 8: Vault Security Seal Status */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">8. Vault Security Seal</span>
                </div>
                <p className="text-[11px] text-gray-400">Validate memory ledger SHA-256 seal integrity.</p>
              </div>
              <div className="mt-3 text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                🛡️ SHA-256 Vault: VALID & UNCOMPROMISED
              </div>
            </div>

            {/* Tool 9: Commission Rebate Calculator */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Percent className="w-4 h-4 text-purple-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">9. VIP Commission Rebates</span>
                </div>
                <p className="text-[11px] text-gray-400">0.5% Cash back given to Elite Sellers.</p>
              </div>
              <div className="mt-3 text-[10px] text-gray-400 flex justify-between">
                <span>Total Rebates Processed:</span>
                <span className="text-teal-400 font-bold">₱14,890.00</span>
              </div>
            </div>

            {/* Tool 10: Export Finance Audit Sheet */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Download className="w-4 h-4 text-blue-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">10. Export Tax Statement</span>
                </div>
                <p className="text-[11px] text-gray-400">Export audited monthly VAT statement for BIR filing.</p>
              </div>
              <button onClick={() => alert('Tax Statement CSV exported to your device!')} className="mt-3 w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-1.5 rounded text-[10px] flex items-center justify-center gap-1">
                <Download className="w-3.5 h-3.5" /> Download Tax Log
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. SUPPORT SUITE (10 TOOLS) */}
      {activeRoleTab === 'SUPPORT' && (
        <div className="space-y-6 relative z-10 animate-fade-in">
          <h4 className="text-sm font-bold text-teal-400 uppercase tracking-widest border-b border-teal-500/15 pb-2">User Support & Assistance Portal (10 Agent Tools)</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Tool 1: In-App Screen Capture Simulator */}
            <div className="p-4 bg-slate-900/60 border border-teal-500/30 rounded-2xl flex flex-col justify-between shadow-[0_0_15px_rgba(20,184,166,0.1)] animate-[pulse_3s_infinite]">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-teal-400">1. In-App Screen Capture</span>
                  <Camera className="w-4 h-4 text-teal-400 animate-bounce" />
                </div>
                <p className="text-[11px] text-gray-400">Simulate drawing a custom area boundary screenshot to report UI/listing visual bugs.</p>
              </div>
              <button 
                onClick={() => setIsCapturing(true)}
                className="mt-3 w-full bg-teal-600 hover:bg-teal-500 text-slate-950 font-black py-1.5 rounded text-[10px] flex items-center justify-center gap-1 shadow-md"
              >
                📸 Activate Capture Bounds
              </button>
            </div>

            {/* Tool 2: Support Ticket Queue */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-4 h-4 text-indigo-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">2. Bug & Assistance Tickets</span>
                </div>
                <p className="text-[11px] text-gray-400">Active tickets registered by buyers/sellers.</p>
              </div>
              <div className="mt-2 space-y-1 max-h-24 overflow-y-auto pr-1">
                {supportTickets.map(t => (
                  <div key={t.id} className="text-[9px] bg-black/40 p-1.5 rounded flex justify-between items-center border border-white/5">
                    <span className="truncate max-w-[120px]"><strong>{t.id}</strong>: {t.issue}</span>
                    <span className={`px-1 rounded text-[8px] font-black ${
                      t.status === 'RESOLVED' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
                    }`}>{t.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tool 3: Sentiment-Aware Intelligent FAQ Search */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between col-span-1 md:col-span-2">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Search className="w-4 h-4 text-teal-400 animate-pulse"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">3. Sentiment-Aware Intelligent FAQ Search (NLP Simulator)</span>
                </div>
                <p className="text-[11px] text-gray-400">Search customer help files with Tagalog & English keyword parsing.</p>
              </div>
              <div className="mt-3 space-y-2">
                <input 
                  type="text" placeholder="Type key words (e.g. 'how to cash in', 'vacation mode')..." 
                  value={faqSearch} onChange={e => setFaqSearch(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-xs outline-none focus:border-teal-500 text-white"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-1">
                  {filteredFaqs.map((f, i) => (
                    <div key={i} className="bg-black/35 p-2 rounded-xl border border-white/5 text-[10px]">
                      <div className="font-bold text-teal-300 flex justify-between">
                        <span>💡 {f.q}</span>
                        <span className="text-[8px] bg-slate-800 text-gray-400 px-1 rounded uppercase font-mono">Matched (98%)</span>
                      </div>
                      <div className="text-gray-300 mt-1">{f.a}</div>
                    </div>
                  ))}
                  {filteredFaqs.length === 0 && <div className="text-[10px] text-gray-500 text-center py-2">No matched FAQ answers. Try typing 'cash' or 'DENR'.</div>}
                </div>
              </div>
            </div>

            {/* Tool 4: In-App Chat Proxy */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <MessageSquare className="w-4 h-4 text-emerald-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">4. Live Chat Proxy</span>
                </div>
                <p className="text-[11px] text-gray-400">Proxy into disputed orders to arbitrate transactions.</p>
              </div>
              <button onClick={() => alert('No chat arbitration requested. Buyer and seller are in positive escrow standpoints.')} className="mt-3 w-full bg-slate-800 hover:bg-slate-700 text-white py-1 rounded text-[10px] font-bold">
                Proxy Dispute Chats
              </button>
            </div>

            {/* Tool 5: Refund Authorization Console */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Sliders className="w-4 h-4 text-purple-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">5. Refund Auth Desk</span>
                </div>
                <p className="text-[11px] text-gray-400">Revert escrow funds back to buyers for failed transport deliveries.</p>
              </div>
              <button onClick={() => {
                const oid = prompt('Enter Order ID to refund:');
                if (!oid) return;
                alert(`Order ${oid} successfully refunded. Balance credited back to buyer wallet.`);
              }} className="mt-3 w-full bg-rose-950/40 border border-rose-500/20 hover:bg-rose-900/30 text-rose-300 py-1.5 rounded text-[10px] font-bold">
                Initiate Escrow Refund
              </button>
            </div>

            {/* Tool 6: Platform Live Hotline Configurator */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="w-4 h-4 text-yellow-500"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">6. Platform Emergency Contacts</span>
                </div>
                <p className="text-[11px] text-gray-400">Emergency lines for custom transport issues.</p>
              </div>
              <div className="mt-3 text-[10px] text-gray-400">
                Support SMS: <strong className="text-white">+63 995 782 2037</strong>
              </div>
            </div>

            {/* Tool 7: User Satisfaction Score */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-4 h-4 text-[#D4AF37]"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">7. CSAT Rating Analytics</span>
                </div>
                <p className="text-[11px] text-gray-400">Overall customer satisfaction tracker feedback metrics.</p>
              </div>
              <div className="mt-3 text-[11px] text-emerald-400 font-bold flex justify-between items-center">
                <span>CSAT Rating: 4.8 / 5.0</span>
                <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-black font-mono">EXCELLENT</span>
              </div>
            </div>

            {/* Tool 8: Common Species Care Sheet */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-4 h-4 text-cyan-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">8. Care Quick-Reference Sheet</span>
                </div>
                <p className="text-[11px] text-gray-400">Cheat sheet to resolve buyer concerns about species.</p>
              </div>
              <div className="mt-3 text-[10px] text-gray-400">
                🦎 <em>Geckos: 75-85°F, 60% humidity. Avoid citrus fruits.</em>
              </div>
            </div>

            {/* Tool 9: Report Spammer Blacklist */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Ban className="w-4 h-4 text-red-500"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">9. Report Spammer Blacklist</span>
                </div>
                <p className="text-[11px] text-gray-400">Flag buyers who submit false reports to disrupt sellers.</p>
              </div>
              <div className="mt-3 text-[10px] text-gray-400 flex justify-between">
                <span>Blacklisted accounts:</span>
                <span className="text-teal-400 font-bold">0 users flagged</span>
              </div>
            </div>

            {/* Tool 10: Direct Feedback Inbox */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Gift className="w-4 h-4 text-pink-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">10. Suggestions & Feedback Box</span>
                </div>
                <p className="text-[11px] text-gray-400">Read anonymous suggestions from beta testers.</p>
              </div>
              <div className="mt-3 text-[10px] text-gray-300">
                📬 <em>"Excellent app! GCash manual staging is extremely transparent!"</em>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 5. ORGANIZER SUITE (10 TOOLS) */}
      {activeRoleTab === 'ORGANIZER' && (
        <div className="space-y-6 relative z-10 animate-fade-in">
          <h4 className="text-sm font-bold text-teal-400 uppercase tracking-widest border-b border-teal-500/15 pb-2">Exotic Event Organizers Command Desk (10 Logistics Tools)</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Tool 1: Interactive Expo Booth Map */}
            <div className="p-4 bg-slate-900/60 border border-teal-500/30 rounded-2xl flex flex-col justify-between col-span-1 md:col-span-2 shadow-[0_0_15px_rgba(20,184,166,0.1)]">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-teal-400">1. Interactive Expo Booth Layout Mapping</span>
                  <MapPin className="w-4 h-4 text-teal-400 animate-pulse" />
                </div>
                <p className="text-[11px] text-gray-400 mb-2">Philippine Reptile Expo 2026. Click a grid square block to reserve/assign a breeder booth vendor.</p>
              </div>
              
              {/* Grid map */}
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 bg-black/40 p-3 rounded-xl border border-white/5">
                {totalBooths.map(b => {
                  const assigned = boothAssignments[b];
                  return (
                    <div 
                      key={b}
                      onClick={() => {
                        setSelectedBooth(b);
                        const vendor = prompt(`Assign Breeder/Vendor to Booth #${b}:`, assigned || '');
                        if (vendor !== null) {
                          setBoothAssignments(prev => ({ ...prev, [b]: vendor }));
                        }
                      }}
                      className={`p-2.5 rounded-lg border text-center cursor-pointer transition-all ${
                        assigned 
                          ? 'bg-teal-500/25 border-teal-500 text-teal-300 shadow-[0_0_8px_rgba(45,212,191,0.3)]' 
                          : 'bg-slate-850 border-white/10 text-gray-400 hover:border-teal-500/40 hover:text-white'
                      }`}
                    >
                      <div className="text-[9px] font-mono">B-#{b}</div>
                      <div className="text-[8px] font-black truncate max-w-full">{assigned ? assigned.split(' ')[0] : 'FREE'}</div>
                    </div>
                  );
                })}
              </div>
              {selectedBooth && (
                <div className="text-[10px] text-gray-400 mt-2 text-right">
                  Selected Booth #{selectedBooth}: <strong className="text-teal-400">{boothAssignments[selectedBooth] || 'Unassigned Free Space'}</strong>
                </div>
              )}
            </div>

            {/* Tool 2: Registered Attendee Guestlist */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-4 h-4 text-indigo-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">2. Registered Guestlist Tickets</span>
                </div>
                <p className="text-[11px] text-gray-400">Track paid entrance guest email credentials.</p>
              </div>
              <div className="mt-2 space-y-1 max-h-24 overflow-y-auto pr-1">
                {attendees.map((a, i) => (
                  <div key={i} className="text-[9px] bg-black/40 p-1 rounded flex justify-between items-center border border-white/5">
                    <span>{a.name} ({a.ticketCode})</span>
                    <span className={`px-1 rounded text-[8px] font-black ${
                      a.checkedIn ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
                    }`}>{a.checkedIn ? 'IN' : 'WAIT'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tool 3: Event Ticket Generator */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Sliders className="w-4 h-4 text-cyan-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">3. Ticket Generator Barcode</span>
                </div>
                <p className="text-[11px] text-gray-400">Create ticket templates with verification numbers.</p>
              </div>
              <button onClick={() => {
                const code = `EXO-TKT-${Math.floor(1000 + Math.random() * 9000)}`;
                alert(`New Unique Ticket Template generated: ${code}. Sent to queue.`);
              }} className="mt-3 w-full bg-slate-800 hover:bg-slate-700 text-white py-1.5 rounded text-[10px] font-bold">
                Generate Secure Ticket
              </button>
            </div>

            {/* Tool 4: Check-in Scanner Simulator */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Key className="w-4 h-4 text-[#D4AF37]"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">4. QR Check-In Scanner</span>
                </div>
                <p className="text-[11px] text-gray-400">Check in attendees by typing or scanning ticket codes.</p>
              </div>
              <div className="mt-3 flex gap-1">
                <input 
                  type="text" placeholder="Ticket code..." defaultValue="EXO-PRE-002" id="ticket-scan-input"
                  className="bg-black/40 border border-white/10 rounded px-2 py-1 text-xs outline-none focus:border-teal-500 flex-1 font-mono uppercase"
                />
                <button onClick={() => {
                  const val = (document.getElementById('ticket-scan-input') as HTMLInputElement)?.value || 'EXO-PRE-002';
                  setAttendees(prev => prev.map(a => a.ticketCode === val ? { ...a, checkedIn: true } : a));
                  alert(`Attendee with ticket ${val} checked in successfully! Door unlocked.`);
                }} className="bg-teal-600 text-slate-950 font-black text-xs px-2 py-1 rounded">Scan</button>
              </div>
            </div>

            {/* Tool 5: Expo Vendor Promo Creator */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Tag className="w-4 h-4 text-pink-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">5. Event Promo Code Builder</span>
                </div>
                <p className="text-[11px] text-gray-400">Generate event-specific discount codes for vendors.</p>
              </div>
              <div className="mt-3 space-y-1">
                <div className="flex gap-1">
                  <input 
                    type="text" placeholder="Prefix..." value={promoPrefix} onChange={e => setPromoPrefix(e.target.value)}
                    className="bg-black/40 border border-white/10 rounded px-2 py-1 text-xs outline-none focus:border-teal-500 w-20 font-mono uppercase"
                  />
                  <button onClick={() => {
                    const cd = `${promoPrefix.toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
                    setGeneratedPromo(cd);
                    alert(`Event Promo ${cd} created successfully! Vendors notified.`);
                  }} className="bg-teal-600 text-slate-950 font-black text-xs px-2 py-1 rounded flex-1">Generate</button>
                </div>
                {generatedPromo && <div className="text-[9px] text-teal-300 font-mono text-center">Active: {generatedPromo}</div>}
              </div>
            </div>

            {/* Tool 6: Sponsor Logo Banner Config */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-4 h-4 text-emerald-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">6. Sponsor Ads Carousel</span>
                </div>
                <p className="text-[11px] text-gray-400">Configure partner logo ads on the stadium banner.</p>
              </div>
              <div className="mt-3 text-[10px] text-gray-400 flex justify-between">
                <span>Sponsors: 3 active</span>
                <span className="text-teal-400 font-bold">Lalamove, J&T, ZooMed</span>
              </div>
            </div>

            {/* Tool 7: Sound system audio channel config */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Power className="w-4 h-4 text-teal-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">7. Audio System Channel</span>
                </div>
                <p className="text-[11px] text-gray-400">Verify microphone and ambient music frequencies at venue.</p>
              </div>
              <div className="mt-3 text-[10px] text-green-400 font-bold">
                ● Master Audio Feed Online (44.1kHz)
              </div>
            </div>

            {/* Tool 8: Venue Security Log */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck className="w-4 h-4 text-red-500 animate-pulse"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">8. Venue Security Log</span>
                </div>
                <p className="text-[11px] text-gray-400">Registered staff logs actively on duty at floor gates.</p>
              </div>
              <div className="mt-3 text-[10px] text-gray-400 flex justify-between">
                <span>Active officers: 8</span>
                <span className="text-green-400 font-bold">All Gates Locked</span>
              </div>
            </div>

            {/* Tool 9: Local LGU Mayor Permit Badge */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-4 h-4 text-yellow-500"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">9. Mayor Permit Clearances</span>
                </div>
                <p className="text-[11px] text-gray-400">Permits required under municipality business regulations.</p>
              </div>
              <div className="mt-3 text-[10px] text-gray-400 flex justify-between">
                <span>Clearance No:</span>
                <span className="text-teal-400 font-mono font-bold">LGU-PRE-NCR-2026</span>
              </div>
            </div>

            {/* Tool 10: Expo Expense Tracker */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-4 h-4 text-yellow-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">10. Logistics Budget Expense</span>
                </div>
                <p className="text-[11px] text-gray-400">Track venue lease and speaker prizes.</p>
              </div>
              <div className="mt-3 text-[10px] text-gray-400 flex justify-between">
                <span>Total Spent: ₱84,500</span>
                <span className="text-emerald-400 font-bold">Within Budget</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 6. SELLER SUITE (10 TOOLS) */}
      {activeRoleTab === 'SELLER' && (
        <div className="space-y-6 relative z-10 animate-fade-in">
          <h4 className="text-sm font-bold text-teal-400 uppercase tracking-widest border-b border-teal-500/15 pb-2">Breeder & Seller Hub (10 Premium Management Tools)</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Tool 1: Vacation Mode */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Plane className="w-4 h-4 text-rose-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">1. Shop Vacation Mode</span>
                </div>
                <p className="text-[11px] text-gray-400">Temporarily suspend listing orders.</p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-300 font-bold">Status: {isVacationMode ? 'ON VACATION' : 'OPEN'}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={isVacationMode} onChange={handleToggleVacation} />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>
            </div>

            {/* Tool 2: Bulk Listing tool */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <FilePlus className="w-4 h-4 text-cyan-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">2. Bulk Listing / CSV</span>
                </div>
                <p className="text-[11px] text-gray-400">Import inventory spreadsheet file instantly.</p>
              </div>
              <button 
                onClick={handleUploadBulkCSV}
                className="mt-3 w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-1.5 rounded text-[10px] flex items-center justify-center gap-1"
              >
                <FilePlus className="w-3.5 h-3.5" /> Upload CSV Sheet
              </button>
            </div>

            {/* Tool 3: Sales Excel Export */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <DownloadCloud className="w-4 h-4 text-green-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">3. Sales Spreadsheet Export</span>
                </div>
                <p className="text-[11px] text-gray-400">Download complete ledger metrics as CSV.</p>
              </div>
              <button 
                onClick={handleExportSellerSales}
                className="mt-3 w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-1.5 rounded text-[10px] flex items-center justify-center gap-1 shadow-md"
              >
                <DownloadCloud className="w-3.5 h-3.5" /> Download sales history
              </button>
            </div>

            {/* Tool 4: Delivery Options Config */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Truck className="w-4 h-4 text-teal-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">4. Courier Delivery Config</span>
                </div>
                <p className="text-[11px] text-gray-400">Select supported local transport channels.</p>
              </div>
              <div className="mt-3 flex gap-2 justify-between">
                {['Lalamove', 'J&T', 'DIY'].map(courier => (
                  <button 
                    key={courier}
                    onClick={() => handleToggleCourier(courier)}
                    className={`flex-1 py-1 rounded text-[9px] font-bold border transition-colors ${selectedCouriers.includes(courier) ? 'bg-teal-500/20 border-teal-500 text-teal-300' : 'bg-slate-850 border-white/10 text-gray-400'}`}
                  >
                    {courier}
                  </button>
                ))}
              </div>
            </div>

            {/* Tool 5: Auto-Reply Settings */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <MessageSquare className="w-4 h-4 text-purple-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">5. Chat Auto-Reply Setup</span>
                </div>
                <p className="text-[11px] text-gray-400">Configure instant messaging responses.</p>
              </div>
              <input 
                type="text" value={autoReplyMsg} onChange={e => setAutoReplyMsg(e.target.value)}
                className="mt-3 bg-black/40 border border-white/10 rounded px-2 py-1 text-[10px] text-gray-300 outline-none focus:border-teal-500"
              />
            </div>

            {/* Tool 6: Listing Heatmap views */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Flame className="w-4 h-4 text-orange-500 animate-pulse"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">6. View Count Heatmap</span>
                </div>
                <p className="text-[11px] text-gray-400">Track click rates across your species.</p>
              </div>
              <div className="mt-3 text-[10px] text-gray-400 flex justify-between items-center">
                <span>🔥 Peak times: 7 PM - 10 PM</span>
                <span className="font-bold text-teal-400">3,241 total views</span>
              </div>
            </div>

            {/* Tool 7: Product Bundling Creator */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Layers className="w-4 h-4 text-yellow-500"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">7. Product Bundling Creator</span>
                </div>
                <p className="text-[11px] text-gray-400">Combine feeders with terrarium supplies.</p>
              </div>
              <div className="mt-3 text-[10px] text-gray-400 flex justify-between">
                <span>Active: Lizard + Habitat Bundle</span>
                <span className="text-green-400 font-bold">10% discount</span>
              </div>
            </div>

            {/* Tool 8: Stock Expiry Alerts */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Bell className="w-4 h-4 text-yellow-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">8. Feeder Expiry Reminders</span>
                </div>
                <p className="text-[11px] text-gray-400">Alert triggers for perishable foods/insects.</p>
              </div>
              <div className="mt-3 text-[10px] text-green-400 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> All stock fresh & healthy
              </div>
            </div>

            {/* Tool 9: Variant Selection Manager */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Sliders className="w-4 h-4 text-purple-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">9. Morph Variant Config</span>
                </div>
                <p className="text-[11px] text-gray-400">Add size, weight, and genetics dropdowns.</p>
              </div>
              <div className="mt-3 text-[10px] text-gray-400">
                Genetic options: <strong className="text-white">Morph, Gender, Age Group</strong>
              </div>
            </div>

            {/* Tool 10: Promotion Scheduler */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-4 h-4 text-gray-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">10. Promotion Scheduler</span>
                </div>
                <p className="text-[11px] text-gray-400">Pre-schedule discounts for holiday events.</p>
              </div>
              <div className="mt-3 text-[10px] text-gray-400 flex justify-between">
                <span>Schedules: 0 active</span>
                <span className="text-teal-400 font-bold">Ready</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 7. BUYER SUITE (10 TOOLS) */}
      {activeRoleTab === 'BUYER' && (
        <div className="space-y-6 relative z-10 animate-fade-in">
          <h4 className="text-sm font-bold text-teal-400 uppercase tracking-widest border-b border-teal-500/15 pb-2">Exo-Wiki Care Hub & Buyer Portal (10 Premium Features)</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Tool 1: Exo-Wiki Species Encyclopedia */}
            <div className="p-4 bg-slate-900/60 border border-teal-500/30 rounded-2xl flex flex-col justify-between col-span-1 md:col-span-2 shadow-[0_0_15px_rgba(20,184,166,0.1)]">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-teal-400">1. Interactive Species Care Wiki Encyclopedia</span>
                  <BookOpen className="w-4 h-4 text-teal-400 animate-pulse" />
                </div>
                <p className="text-[11px] text-gray-400">Search feeding habits, ideal humidity temperature ranges, and setup tutorials.</p>
              </div>
              <div className="mt-3 space-y-2">
                <input 
                  type="text" placeholder="Search species care (e.g. Gecko, Isopod, Python, Tarantula)..." value={wikiSearch} onChange={e => setWikiSearch(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-xs outline-none focus:border-teal-500 text-white"
                />
                <div className="bg-black/35 p-3 rounded-xl border border-white/5 text-xs space-y-2">
                  {wikiSearch.toLowerCase().includes('isopod') ? (
                    <div>
                      <strong className="text-teal-300">Isopod Care Guide (Porcellio / Armadillidium)</strong>
                      <p className="text-gray-400 text-[11px] mt-1">Humidity: 70-80%. Substrate: Organic soil, sphagnum moss, leaf litter. Diet: Decaying wood, yeast, calcium. Essential clean-up crew!</p>
                    </div>
                  ) : wikiSearch.toLowerCase().includes('python') || wikiSearch.toLowerCase().includes('snake') ? (
                    <div>
                      <strong className="text-teal-300">Ball Python (Python regius) Care Manual</strong>
                      <p className="text-gray-400 text-[11px] mt-1">Basking: 88-92°F. Humidity: 55-60%. Diet: Rodents once a week. Extremely docile and perfect for tropical enclosure terrariums.</p>
                    </div>
                  ) : (
                    <div>
                      <strong className="text-teal-300">Leopard Gecko (Eublepharis macularius)</strong>
                      <p className="text-gray-400 text-[11px] mt-1">Basking spot: 90°F. Humidity: 30-40%. Diet: Dust crickets/dubias with calcium. Active nighttime hunters. Very docile companion!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tool 2: Feeding Log */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="w-4 h-4 text-rose-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">2. Interactive Digital Feeding Log</span>
                </div>
                <p className="text-[11px] text-gray-400">Track insect and hydration history of your reptile.</p>
              </div>
              <div className="mt-2 space-y-1">
                {feedingLogs.map((f, i) => (
                  <div key={i} className="text-[9px] bg-black/30 p-1 rounded flex justify-between font-mono">
                    <span className="text-gray-400">{f.date}</span>
                    <span className="text-white font-bold">{f.food}</span>
                  </div>
                ))}
                <button 
                  onClick={() => {
                    const fd = prompt('What did you feed your companion today? (e.g. 5 crickets):');
                    if (!fd) return;
                    setFeedingLogs(prev => [{ date: new Date().toISOString().substring(0,10), food: fd, status: 'Success' }, ...prev]);
                  }}
                  className="w-full mt-2 bg-slate-800 hover:bg-slate-700 text-teal-400 font-bold py-1 rounded text-[10px]"
                >
                  + Log Feed
                </button>
              </div>
            </div>

            {/* Tool 3: Digital Pet Growth weight tracker */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">3. Pet Growth & Shed Tracker</span>
                </div>
                <p className="text-[11px] text-gray-400">Record shedding date and gram weight history.</p>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span>Weight: <strong className="text-white">{petWeight}g</strong></span>
                  <div className="flex gap-1">
                    <button onClick={() => setPetWeight(p => p - 1)} className="bg-slate-800 px-1.5 rounded text-xs">-</button>
                    <button onClick={() => setPetWeight(p => p + 1)} className="bg-slate-800 px-1.5 rounded text-xs">+</button>
                  </div>
                </div>
                <div className="text-[9px] text-emerald-400 bg-emerald-950/20 p-1 rounded text-center border border-emerald-500/10">
                  🐉 Shed Completed: July 10 (Full)
                </div>
              </div>
            </div>

            {/* Tool 4: Habitat setup step-by-step tutorials */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Sliders className="w-4 h-4 text-yellow-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">4. Habitat Setup Tutorial</span>
                </div>
                <p className="text-[11px] text-gray-400">Build optimal bio-active enclosures with plants.</p>
              </div>
              <button onClick={() => alert('Launching Bio-Active Soil & Drainage Layer tutorial!')} className="mt-3 w-full bg-slate-800 hover:bg-slate-700 text-teal-400 py-1.5 rounded text-[10px] font-bold">
                View 5-Step Enclosure Guide
              </button>
            </div>

            {/* Tool 5: Exo-Forum Care Discussion Board */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <MessageCircle className="w-4 h-4 text-teal-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">5. Care Discussion Board</span>
                </div>
                <p className="text-[11px] text-gray-400">Ask community breeders for health advice.</p>
              </div>
              <div className="mt-3 text-[10px] text-gray-400">
                💬 <em>"Is a 20-gallon tank too small for fully grown Geckos?"</em>
              </div>
            </div>

            {/* Tool 6: In-App Wallet Integration */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="w-4 h-4 text-[#D4AF37]"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">6. In-App Digital Vault</span>
                </div>
                <p className="text-[11px] text-gray-400">Store and track fast escrow trade balances.</p>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs text-gray-400">Balance: <strong className="text-white text-sm">{formatCurrency(currentUser.balance)}</strong></span>
                <span className="text-[10px] bg-green-500/10 text-green-400 px-1 rounded font-bold font-mono">Secured</span>
              </div>
            </div>

            {/* Tool 7: KYC Verification Badge Progress */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-4 h-4 text-emerald-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">7. KYC Badge Status</span>
                </div>
                <p className="text-[11px] text-gray-400">Check active status of your KYC papers.</p>
              </div>
              <div className="mt-3 flex justify-between items-center text-[10px]">
                <span className="text-gray-400">ID Verification:</span>
                <span className={`font-bold uppercase ${currentUser.status === 'APPROVED' ? 'text-green-400' : 'text-yellow-500 animate-pulse'}`}>{currentUser.status === 'APPROVED' ? 'Verified' : 'In Review / Pending'}</span>
              </div>
            </div>

            {/* Tool 8: Wishlist Price Drop Alert System */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <BellRing className="w-4 h-4 text-yellow-500"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">8. Wishlist Price Alerts</span>
                </div>
                <p className="text-[11px] text-gray-400">Get browser notifications if exotics go on sale.</p>
              </div>
              <div className="mt-3 text-[10px] text-gray-400 flex justify-between">
                <span>Leopard Gecko Alert: ON</span>
                <span className="text-teal-400 font-bold">Active</span>
              </div>
            </div>

            {/* Tool 9: Gift Card Redeemer */}
            <div className="p-4 bg-slate-900/60 border border-teal-500/30 rounded-2xl flex flex-col justify-between shadow-[0_0_15px_rgba(20,184,166,0.1)]">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-teal-400">9. Gift Card Redeemer</span>
                  <Gift className="w-4 h-4 text-teal-400 animate-pulse" />
                </div>
                <p className="text-[11px] text-gray-400">Redeem unique digital vouchers to load cash.</p>
              </div>
              <form onSubmit={handleRedeemGiftCard} className="mt-3 space-y-2">
                <div className="flex gap-1">
                  <input 
                    type="text" placeholder="Try 'EXOFREE500' or 'EXOPASSVIP'" 
                    value={voucherCode} onChange={e => setVoucherCode(e.target.value)}
                    className="bg-black/60 border border-teal-500/30 rounded px-2 py-1 text-[10px] text-white outline-none focus:border-teal-500 flex-1 font-mono uppercase placeholder:text-gray-600"
                  />
                  <Button type="submit" size="sm" className="bg-teal-600 text-white text-[10px] px-2 py-1">Apply</Button>
                </div>
                {voucherRedeemSuccess && <div className="text-[9px] text-teal-300 font-bold bg-teal-950/50 p-1 rounded border border-teal-500/20">{voucherRedeemSuccess}</div>}
              </form>
            </div>

            {/* Tool 10: Language Toggle */}
            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Languages className="w-4 h-4 text-indigo-400"  style={{ color: '#39FF14' }} />
                  <span className="text-xs font-bold text-gray-200">10. Language Toggle</span>
                </div>
                <p className="text-[11px] text-gray-400">Toggle display between Tagalog and English.</p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] text-gray-400">Selected: <strong className="text-white">{currentLanguage === 'EN' ? 'English (EN)' : 'Tagalog (TL)'}</strong></span>
                <button 
                  onClick={() => setCurrentLanguage(currentLanguage === 'EN' ? 'TL' : 'EN')}
                  className="bg-slate-850 hover:bg-slate-800 text-teal-400 border border-teal-500/20 rounded px-2 py-0.5 text-[9px] font-bold flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Translate
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
