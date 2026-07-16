import React from 'react';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/lib/utils';
import { Lock } from 'lucide-react';

export const BuyerBadges = () => {
  const { currentUser } = useApp();
  const spent = currentUser?.spentAmount || 0;

  const badges = [
    { id: 'bronze', name: 'Bronze Hatchling', threshold: 0, icon: '🦎', desc: 'Baby Bearded Dragon', color: 'bg-amber-700/20 text-amber-900 border-amber-700/30' },
    { id: 'silver', name: 'Silver Crested Gecko', threshold: 5000, icon: '🦎', desc: 'Sleek silver metallic', color: 'bg-slate-300/40 text-slate-700 border-slate-400/50' },
    { id: 'gold', name: 'Golden Dubia Emperor', threshold: 15000, icon: '🪲', desc: 'Gold-plated Dubia Roach', color: 'bg-yellow-400/30 text-yellow-800 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]' },
    { id: 'platinum', name: 'Platinum Python', threshold: 50000, icon: '🐍', desc: 'Metallic platinum python', color: 'bg-cyan-100/50 text-cyan-800 border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]' },
    { id: 'diamond', name: 'Diamond Sovereign', threshold: 100000, icon: '👑', desc: 'Diamond-encrusted crown', color: 'bg-blue-100 text-blue-900 border-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.4)]' },
  ];

  return (
    <div className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-900">Achievements Shelf</h3>
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Total Spent: {formatCurrency(spent)}</span>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar items-end">
        {badges.map((badge, idx) => {
          const unlocked = spent >= badge.threshold;
          return (
            <div key={badge.id} className="relative flex flex-col items-center group shrink-0 w-24">
              {/* Badge Icon Container */}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-3 transition-all duration-500 ${
                unlocked ? `${badge.color} border-2 transform hover:-translate-y-2` : 'bg-gray-100 border border-gray-200 grayscale opacity-50'
              }`}>
                {unlocked ? (
                   <span className="animate-pulse">{badge.icon}</span>
                ) : (
                  <Lock className="w-6 h-6 text-gray-400" />
                )}
              </div>
              
              {/* Tooltip / Label */}
              <div className="text-center">
                <div className={`text-[10px] font-bold leading-tight ${unlocked ? 'text-gray-900' : 'text-gray-400'}`}>
                  {badge.name}
                </div>
                {!unlocked && (
                  <div className="text-[9px] text-gray-400 mt-1">Unlock at {formatCurrency(badge.threshold)}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
