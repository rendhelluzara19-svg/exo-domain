import React, { useState, Suspense } from 'react';
import { useApp } from '@/context/AppContext';
import { Megaphone, Search, Shield, Zap, Sparkles, Filter, ChevronDown, ChevronUp, Check } from 'lucide-react';

// Highly performance-optimized dynamic LazyIcon component for Lucide iconography
const LazyIcon = ({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) => {
  const IconComponent = React.useMemo(() => {
    return React.lazy(() =>
      import('lucide-react').then((mod: any) => ({
        default: mod[name] || mod.Megaphone,
      }))
    );
  }, [name]);

  return (
    <Suspense fallback={<div className="w-4 h-4 bg-[#39FF14]/10 rounded animate-pulse" />}>
      <IconComponent className={className} style={style} />
    </Suspense>
  );
};

const getIconName = (id: string): string => {
  if (id.startsWith('w')) {
    const icons = [
      'Search', 'Sliders', 'Droplets', 'Thermometer', 'BarChart2',
      'FileText', 'Bell', 'Upload', 'Lock', 'Megaphone',
      'MapPin', 'Calculator', 'Users', 'Sparkles', 'CreditCard',
      'Calendar', 'ShieldCheck', 'Play', 'TrendingUp', 'Smartphone'
    ];
    const index = parseInt(id.replace('w', '')) - 1;
    return icons[index] || 'ShoppingBag';
  } else if (id.startsWith('c')) {
    const icons = [
      'Camera', 'Activity', 'Clipboard', 'Smile', 'Clock',
      'Droplets', 'Sun', 'Thermometer', 'Heart', 'Percent',
      'ShieldAlert', 'FileText', 'Calendar', 'Layers', 'CheckSquare',
      'Truck', 'LifeBuoy', 'Briefcase', 'AlertTriangle', 'Moon',
      'Timer', 'Eye', 'CloudRain', 'BarChart2', 'Scissors',
      'Cpu', 'HeartHandshake', 'GitBranch', 'Users', 'Phone'
    ];
    const index = parseInt(id.replace('c', '')) - 1;
    return icons[index] || 'Activity';
  } else if (id.startsWith('s')) {
    const icons = [
      'CalendarRange', 'Clock', 'FileCheck', 'UserX', 'DollarSign',
      'Ban', 'Search', 'HelpCircle', 'Terminal', 'Sliders',
      'TrendingUp', 'Briefcase', 'Activity', 'Megaphone', 'ShieldAlert',
      'Hammer', 'Unlock', 'Award', 'HardDrive', 'Key',
      'BellRing', 'AlertCircle', 'Lock', 'Cpu', 'Gift',
      'Percent', 'UserMinus', 'Globe', 'Zap', 'Power'
    ];
    const index = parseInt(id.replace('s', '')) - 1;
    return icons[index] || 'ShieldCheck';
  }
  return 'Megaphone';
};

export default function EnclaveHub() {
  const { currentUser } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'widgets' | 'care' | 'staff'>('widgets');
  const [searchTerm, setSearchTerm] = useState('');
  const [activatedFeature, setActivatedFeature] = useState<string | null>(null);
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  if (!currentUser) return null;

  // Sound generator helper for tech chimes
  const playChime = (freq = 800, duration = 0.08) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Ignored gracefully
    }
  };

  const handleActivate = (id: string, name: string) => {
    playChime(1000, 0.1);
    setActivatedFeature(id);
    setTimeout(() => {
      setActivatedFeature(null);
    }, 2500);
  };

  const toggleExpand = (id: string) => {
    playChime(600, 0.05);
    setExpandedFeature(expandedFeature === id ? null : id);
  };

  // Lists of 80 Additive Features using Megaphone icon for placeholders

  const widgetsList = [
    { id: 'w1', name: 'Smart Pet Search Engine', desc: 'Scan categories and keyword indexes with precision.' },
    { id: 'w2', name: 'Quick-Action Fab Menu', desc: 'Floating system shortcut manager for easy staging.' },
    { id: 'w3', name: 'Weather Humidity Alert', desc: 'Atmospheric alerts mapped to major PH local habitats.' },
    { id: 'w4', name: 'Exo-Hab Temperature Monitor', desc: 'Sensor array tracking current microclimate limits.' },
    { id: 'w5', name: 'Livestock Market Ticker', desc: 'Current average rates for feeder colonies and exotics.' },
    { id: 'w6', name: 'DTI-BIR Verification Portal Link', desc: 'Instant gateway to validation databases.' },
    { id: 'w7', name: 'Active Care Reminder Notification', desc: 'Automated notification ping queue for feed cycles.' },
    { id: 'w8', name: 'Fast-Staging Receipt Uploader', desc: 'One-click transaction receipt submission terminal.' },
    { id: 'w9', name: 'Bio-Lock Fingerprint Vault status', desc: 'Secure fingerprint state monitor.' },
    { id: 'w10', name: 'Community Megaphone Announcements', desc: 'Live system alerts from Exo Domain administrators.' },
    { id: 'w11', name: 'Verified Seller Map Radar', desc: 'Geolocated seller hubs within Metro Manila and provinces.' },
    { id: 'w12', name: 'Feed Schedule Calculator', desc: 'Prey mass ratio calculator matching body weight.' },
    { id: 'w13', name: 'Herpetologist Consulting Queue', desc: 'Active line status of virtual veterinary partners.' },
    { id: 'w14', name: 'Gene Calculator & Morph Predictor', desc: 'Codominant gene outcomes simulator for breeders.' },
    { id: 'w15', name: 'Eco-Tax Calculator & Ledger Check', desc: 'Local tax staging check node.' },
    { id: 'w16', name: 'Hatching Calendar & Incubator Sync', desc: 'Clutch due-dates synchronized with real-time timers.' },
    { id: 'w17', name: 'Shipping Escrow Safeguard Badge', desc: 'Delivery key protection token status.' },
    { id: 'w18', name: 'Live Auction Spotlight Panel', desc: 'Interactive view of active bidding sessions.' },
    { id: 'w19', name: 'Reptile Weight Tracker Widget', desc: 'Digital weight gain progression log chart.' },
    { id: 'w20', name: 'Quick QR Scanner Launch Node', desc: 'Session handoff scanner initiator.' }
  ];

  const careList = [
    { id: 'c1', name: 'Growth & Length Gallery', desc: 'Timeline photo logs charting physical development.' },
    { id: 'c2', name: 'AI Health & Symptom Diagnosis', desc: 'Expert neural analyzer mapping abnormal scales or lethargy.' },
    { id: 'c3', name: 'Diet, Calcium & Multivitamin Tracker', desc: 'Avoid MBD with strictly structured nutrient schedules.' },
    { id: 'c4', name: 'Shedding & Skin Care Log', desc: 'Humidity assistance tracker during shedding phases.' },
    { id: 'c5', name: 'Bracing & Quarantine Timer', desc: 'Strict 30-day isolated quarantine cycle counter.' },
    { id: 'c6', name: 'Water Quality Salinity Checker', desc: 'PH, salinity and chlorine index tracking for amphibians.' },
    { id: 'c7', name: 'Light UV Index & Solenoid Status', desc: 'UVB bulb output and photoperiod timers.' },
    { id: 'c8', name: 'Thermophilic Gradient Mapper', desc: 'Heat-mat & radiant heat panel balance dashboard.' },
    { id: 'c9', name: 'Breeding Pair Bio-Compatibilities', desc: 'Stress index analyzer for successful breeding introductions.' },
    { id: 'c10', name: 'Egg Clutches Yield Forecast', desc: 'Incubation survival rate calculator.' },
    { id: 'c11', name: 'Quarantine Node Sentinel', desc: 'Contagion alert for mite or virus outbreaks.' },
    { id: 'c12', name: 'Fecal Lab Analysis Ledger', desc: 'Track veterinary parasite test outcomes.' },
    { id: 'c13', name: 'Vet Consultation Booking Node', desc: 'Instant slots booking with herpetology experts.' },
    { id: 'c14', name: 'Morph Visualizer & Genetic Blueprint', desc: '3D scale pattern preview based on morph selection.' },
    { id: 'c15', name: 'Habitat Sanitation Checklists', desc: 'Deep-cleaning task lists with notification reminders.' },
    { id: 'c16', name: 'Exotic Relocation Safe Transport Logger', desc: 'Maintains climate-controlled state during transit.' },
    { id: 'c17', name: 'Venomous Bite First-Aid Manual', desc: 'Regional antivenom supply directories and protocols.' },
    { id: 'c18', name: 'CITES Permit Compliance Vault', desc: 'Upload and link legal wildlife registration permits.' },
    { id: 'c19', name: 'Diet Feed Store Stock Level Alert', desc: 'Alerts when regional roach/worm supply runs low.' },
    { id: 'c20', name: 'Winter Brumation Sleep Tracker', desc: 'Core temperature charting during brumation cycles.' },
    { id: 'c21', name: 'Light Cycle Timer & Solar Tracker', desc: 'Simulates natural sunlight hours based on hemisphere.' },
    { id: 'c22', name: 'Prey Sizing Calibrator', desc: 'Ensures feeder prey diameter matches eyes-spacing.' },
    { id: 'c23', name: 'Substrate Moisture Level Sensor', desc: 'Monitors risk of respiratory infection or scale rot.' },
    { id: 'c24', name: 'Behavior & Stress Level Grapher', desc: 'Record glass-surfing or dark stress-coloration.' },
    { id: 'c25', name: 'Tail Drop & Regeneration Journal', desc: 'Tracks gecko tail regrowth milestones.' },
    { id: 'c26', name: 'Microchip Transponder Registry', desc: 'Store high-value specimen identity microchips.' },
    { id: 'c27', name: 'Pet Insurance & Health Cover Stager', desc: 'Staged application for health reimbursement plans.' },
    { id: 'c28', name: 'Hereditary Lineage Tree Builder', desc: 'Visual pedigree chart mapping multi-generational genetics.' },
    { id: 'c29', name: 'Social Habitat Cohabitation Analysis', desc: 'Safety audit for multi-specimen setups.' },
    { id: 'c30', name: 'Animal Rescue Hotline & Reporting Link', desc: 'Direct emergency numbers for local wildlife handlers.' }
  ];

  const staffList = [
    { id: 's1', name: 'Staff Shift Scheduler & Node Allocator', desc: 'Staging shifts for verification & treasurer members.' },
    { id: 's2', name: 'Multi-party Escrow Dispute & Conflict Timer', desc: 'Arbitrator timer counting down to final resolution.' },
    { id: 's3', name: 'DENR Permit Inspection Gate', desc: 'Document validation queue for CITES and local permits.' },
    { id: 's4', name: 'Automatic KYC Rejection Generator', desc: 'Pre-formatted template generator matching rejection reasons.' },
    { id: 's5', name: 'GCash/Bank Topup Ledger Auditor', desc: 'Cross-checks database ledgers against simulated GCash API logs.' },
    { id: 's6', name: 'Banned Seller Blacklist Ledger', desc: 'List of blacklisted addresses and device signatures.' },
    { id: 's7', name: 'Fake Receipt Digital Signature Checker', desc: 'Neural analysis of uploaded transaction receipts.' },
    { id: 's8', name: 'Escalated Incident Ticket Resolver', desc: 'Support queue for priority buyer issues.' },
    { id: 's9', name: 'Real-time Live Server Log Stream', desc: 'Live monitoring of Node 3000 API requests.' },
    { id: 's10', name: 'Seller Limits & Tier Governor', desc: 'Override maximum listings allowance for sellers.' },
    { id: 's11', name: 'Verification Staff Performance Metrics', desc: 'Average KYC processing times tracker.' },
    { id: 's12', name: 'Finance Audit & Tax Vault Stager', desc: 'Generates quarterly VAT reports for exotic trade.' },
    { id: 's13', name: 'Live WebSocket Connection Health Monitor', desc: 'Monitors real-time client socket active state.' },
    { id: 's14', name: 'Global Platform Banner Broadcast Node', desc: 'Instantly updates emergency banner alerts on all clients.' },
    { id: 's15', name: 'Auto-Moderation Poison Words Filter', desc: 'Regex-based search for restricted or illegal pet sales.' },
    { id: 's16', name: 'Auction Reserve Limit Override Control', desc: 'Administrator intervention on high-value specimen bids.' },
    { id: 's17', name: 'Delivery Escrow Safety Key Release', desc: 'Manual release override for non-responsive buyers.' },
    { id: 's18', name: 'Verified Business Badge DTI-BIR Gate', desc: 'Check registered company details manually.' },
    { id: 's19', name: 'Database Backup & Mirror State Scheduler', desc: 'Control local Storage backups and mirrors.' },
    { id: 's20', name: 'API Key Rotator & Gateway Monitor', desc: 'Rotates third-party service credentials.' },
    { id: 's21', name: 'Bulk Notification Megaphone Broadcaster', desc: 'Broadcast notifications to all active buyer nodes.' },
    { id: 's22', name: 'Seller Permit Grace Period Tracker', desc: 'Tracks upcoming wildlife farm license expiration.' },
    { id: 's23', name: 'Suspicious Pattern & Brute-Force Log Analyzer', desc: 'Tracks IP block failures and locks out abusers.' },
    { id: 's24', name: 'Support Ticket Auto-Responder AI Template', desc: 'Draft AI responses to high-volume questions.' },
    { id: 's25', name: 'Breeder Starter Pack Grant Node', desc: 'Approve 10 free Starter Pack listings slots.' },
    { id: 's26', name: 'Affiliate Referral Payout Auditor', desc: 'Verifies active referrers payout ledger.' },
    { id: 's27', name: 'Live Auction Banned User Inspector', desc: 'Terminates auction access for bidding violators.' },
    { id: 's28', name: 'Geo-Block Country Exception Gate', desc: 'Add IP whitelists for international veterinarian consultation.' },
    { id: 's29', name: 'Discord Webhook Sync Status Controller', desc: 'Manage external webhook streams health.' },
    { id: 's30', name: 'Master Emergency System Kill-Switch Node', desc: 'Suspends system transaction flow globally.' }
  ];

  const getActiveList = () => {
    switch (activeSubTab) {
      case 'widgets': return widgetsList;
      case 'care': return careList;
      case 'staff': return staffList;
    }
  };

  const filteredList = getActiveList().filter(
    item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            item.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isStaffRole = ['ADMIN', 'VERIFICATION_STAFF', 'FINANCE_STAFF', 'SUPPORT_STAFF', 'EVENT_ORGANIZER'].includes(currentUser.role);

  return (
    <div className="p-4 sm:p-6 pb-24 max-w-5xl mx-auto space-y-6 font-sans text-gray-100">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Enclave Feature Hub
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Strictly additive, highly designed dashboard extensions for the Exo Domain platform. 
              Enjoy 80 advanced modules tailored for collectors, hobbyists, and staff.
            </p>
          </div>
          <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-white/5 text-[10px] font-mono text-emerald-400 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            SECURE ENCLAVE NODE ONLINE
          </div>
        </div>
      </div>

      {/* Tabs Controller */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 border-b border-white/5 pb-4">
        <div className="flex bg-slate-950 p-1 rounded-xl border border-white/5 self-start">
          <button 
            onClick={() => { playChime(600, 0.05); setActiveSubTab('widgets'); setSearchTerm(''); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${activeSubTab === 'widgets' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            20 Widgets
          </button>
          <button 
            onClick={() => { playChime(700, 0.05); setActiveSubTab('care'); setSearchTerm(''); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${activeSubTab === 'care' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            30 Care Hub
          </button>
          {isStaffRole && (
            <button 
              onClick={() => { playChime(800, 0.05); setActiveSubTab('staff'); setSearchTerm(''); }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${activeSubTab === 'staff' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              30 Staff Tools
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder={`Search ${activeSubTab}...`}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-emerald-500 placeholder-slate-500 transition-all"
          />
        </div>
      </div>

      {/* Grid of Additive Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredList.map((item, index) => {
          const isExpanded = expandedFeature === item.id;
          const isCurrentActive = activatedFeature === item.id;

          return (
            <div 
              key={item.id}
              className={`p-4 bg-slate-950/40 hover:bg-slate-900/60 rounded-2xl border border-white/5 transition-all duration-300 relative group flex flex-col justify-between hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/30 ${isCurrentActive ? 'border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)] bg-slate-900/80' : ''}`}
            >
              <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                <span className="text-[9px] font-mono text-slate-500 uppercase">
                  {activeSubTab === 'widgets' ? 'Widget' : activeSubTab === 'care' ? 'Care' : 'Staff'}-{index + 1}
                </span>
                <LazyIcon name={getIconName(item.id)} className="w-3.5 h-3.5" style={{ color: '#39FF14' }} />
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-[#39FF14]/10 border border-[#39FF14]/20 flex items-center justify-center shrink-0">
                    <LazyIcon name={getIconName(item.id)} className="w-4 h-4" style={{ color: '#39FF14' }} />
                  </div>
                  <h4 className="font-bold text-sm text-gray-200 line-clamp-1 group-hover:text-[#39FF14] transition-colors">
                    {item.name}
                  </h4>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed min-h-[32px] line-clamp-2">
                  {item.desc}
                </p>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-white/5 space-y-2 text-[10px] text-slate-300 font-mono animate-fade-in bg-slate-950/50 p-2.5 rounded-xl">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Registry ID:</span>
                      <span className="text-emerald-400 font-bold uppercase">{item.id.toUpperCase()}-042X</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Node Compliance:</span>
                      <span className="text-cyan-400 font-bold">DENR/BIR LEVEL-1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Execution Stack:</span>
                      <span className="text-gray-400">LAZY-LOADED REACT BUNDLE</span>
                    </div>
                    <div className="text-[9px] text-slate-500 mt-2 italic leading-relaxed">
                      Placeholder telemetry simulation. Activate node below to establish websocket data bridge.
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
                <button
                  onClick={() => handleActivate(item.id, item.name)}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${isCurrentActive ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/10 hover:border-emerald-500/30'}`}
                >
                  {isCurrentActive ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Operational
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" /> Launch Feature
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleExpand(item.id)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5 transition-colors"
                  title="Toggle Telemetry logs"
                >
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredList.length === 0 && (
        <div className="text-center py-16 border border-dashed border-white/5 rounded-3xl bg-slate-950/20 animate-fade-in">
          <Megaphone className="w-8 h-8 mx-auto mb-3 animate-bounce text-[#39FF14]" />
          <p className="text-xs text-slate-400">No matching additive features found in this sub-tab.</p>
        </div>
      )}

    </div>
  );
}
