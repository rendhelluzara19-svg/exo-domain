import React, { useState, Suspense } from 'react';
import { useApp } from '@/context/AppContext';
import { Megaphone, Search, Shield, Zap, Sparkles, Filter, ChevronDown, ChevronUp, Check } from 'lucide-react';

// Error Boundary para maiwasan ang white screen
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: any) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error: any) { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div className="p-12 text-center text-red-500 font-mono">System Error: Check transaction data.</div>;
    return this.props.children;
  }
}

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
    const icons = ['Search', 'Sliders', 'Droplets', 'Thermometer', 'BarChart2', 'FileText', 'Bell', 'Upload', 'Lock', 'Megaphone', 'MapPin', 'Calculator', 'Users', 'Sparkles', 'CreditCard', 'Calendar', 'ShieldCheck', 'Play', 'TrendingUp', 'Smartphone'];
    return icons[parseInt(id.replace('w', '')) - 1] || 'ShoppingBag';
  } else if (id.startsWith('c')) {
    const icons = ['Camera', 'Activity', 'Clipboard', 'Smile', 'Clock', 'Droplets', 'Sun', 'Thermometer', 'Heart', 'Percent', 'ShieldAlert', 'FileText', 'Calendar', 'Layers', 'CheckSquare', 'Truck', 'LifeBuoy', 'Briefcase', 'AlertTriangle', 'Moon', 'Timer', 'Eye', 'CloudRain', 'BarChart2', 'Scissors', 'Cpu', 'HeartHandshake', 'GitBranch', 'Users', 'Phone'];
    return icons[parseInt(id.replace('c', '')) - 1] || 'Activity';
  } else if (id.startsWith('s')) {
    const icons = ['CalendarRange', 'Clock', 'FileCheck', 'UserX', 'DollarSign', 'Ban', 'Search', 'HelpCircle', 'Terminal', 'Sliders', 'TrendingUp', 'Briefcase', 'Activity', 'Megaphone', 'ShieldAlert', 'Hammer', 'Unlock', 'Award', 'HardDrive', 'Key', 'BellRing', 'AlertCircle', 'Lock', 'Cpu', 'Gift', 'Percent', 'UserMinus', 'Globe', 'Zap', 'Power'];
    return icons[parseInt(id.replace('s', '')) - 1] || 'ShieldCheck';
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

  const playChime = (freq = 800, duration = 0.08) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine'; osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  const handleActivate = (id: string, name: string) => {
    try {
        playChime(1000, 0.1);
        setActivatedFeature(id);
        setTimeout(() => setActivatedFeature(null), 2500);
    } catch (err) {
        console.error("Action error:", err);
    }
  };

  const toggleExpand = (id: string) => {
    playChime(600, 0.05);
    setExpandedFeature(expandedFeature === id ? null : id);
  };

  const isStaffRole = ['ADMIN', 'VERIFICATION_STAFF', 'FINANCE_STAFF', 'SUPPORT_STAFF', 'EVENT_ORGANIZER'].includes(currentUser.role);

  return (
    <ErrorBoundary>
      <div className="p-4 sm:p-6 pb-24 max-w-5xl mx-auto space-y-6 font-sans text-gray-100">
        <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Enclave Feature Hub</h2>
          <p className="text-xs text-slate-400 mt-1">Secure node online. Status: {currentUser.role} Access.</p>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-xl border border-white/5 self-start">
            <button onClick={() => setActiveSubTab('widgets')} className={`px-4 py-2 rounded-lg text-xs font-semibold ${activeSubTab === 'widgets' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'}`}>Widgets</button>
            <button onClick={() => setActiveSubTab('care')} className={`px-4 py-2 rounded-lg text-xs font-semibold ${activeSubTab === 'care' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'}`}>Care Hub</button>
            {isStaffRole && <button onClick={() => setActiveSubTab('staff')} className={`px-4 py-2 rounded-lg text-xs font-semibold ${activeSubTab === 'staff' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'}`}>Staff Tools</button>}
        </div>

        {/* Dito ilalagay ang grid content gaya ng dati */}
        <div className="text-center py-10 text-slate-500">Node initialized. Select a category to proceed.</div>
      </div>
    </ErrorBoundary>
  );
}
