import React, { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Trophy, ShieldCheck, Crown, Star, ArrowUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const LeaderboardPage = () => {
  const { users, currentUser } = useApp();

  // Top Buyers based on spentAmount
  const topBuyers = useMemo(() => {
    return users
      .filter(u => u.role === 'BUYER' && u.status === 'APPROVED' && (u.spentAmount || 0) > 0)
      .sort((a, b) => (b.spentAmount || 0) - (a.spentAmount || 0))
      .slice(0, 10);
  }, [users]);

  // Top Sellers based on rating (mock) and plan tier (Elite > Pro > Starter)
  const topSellers = useMemo(() => {
    return users
      .filter(u => u.role === 'SELLER' && u.status === 'APPROVED' && u.plan !== 'NONE')
      .sort((a, b) => {
        // First sort by plan tier
        const planWeight = { 'ELITE': 3, 'PRO': 2, 'STARTER': 1, 'NONE': 0, 'EXO_PASS': 0 };
        const weightA = planWeight[a.plan] || 0;
        const weightB = planWeight[b.plan] || 0;
        if (weightA !== weightB) return weightB - weightA;
        return 0; // Then by other metrics if available
      })
      .slice(0, 10);
  }, [users]);

  return (
    <div className="p-4 sm:p-6 pb-24 max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Hall of Fame</h1>
        <p className="text-gray-500 max-w-lg mx-auto">Discover the most trusted breeders and elite buyers in the Exo Domain community.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Trusted Sellers Leaderboard */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative">
          <div className="bg-[#15241C] p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Trusted Breeders</h2>
                <p className="text-teal-400/80 text-xs font-medium uppercase tracking-widest">Top Verified Sellers</p>
              </div>
            </div>
          </div>
          
          <div className="p-2">
            {topSellers.map((seller, index) => (
              <div key={seller.id} className={`flex items-center gap-4 p-4 rounded-2xl transition-colors ${currentUser?.id === seller.id ? 'bg-teal-50 border border-teal-100' : 'hover:bg-gray-50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-[#D4AF37] text-white shadow-[0_0_10px_rgba(212,175,55,0.5)]' : index === 1 ? 'bg-gray-300 text-gray-800' : index === 2 ? 'bg-[#CD7F32] text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {index + 1}
                </div>
                
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-400">
                  {seller.name.substring(0,2).toUpperCase()}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate flex items-center gap-1">
                    {seller.name}
                    {seller.plan === 'ELITE' && <Crown className="w-4 h-4 text-[#D4AF37]" title="Elite Breeder" />}
                  </h3>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-teal-600 font-medium bg-teal-50 px-2 py-0.5 rounded-md">{seller.plan} SELLER</span>
                    <span className="text-gray-500 flex items-center"><Star className="w-3 h-3 text-orange-400 fill-orange-400 mr-0.5" /> 5.0</span>
                  </div>
                </div>
              </div>
            ))}
            {topSellers.length === 0 && (
              <div className="p-8 text-center text-gray-500 text-sm">No verified sellers yet.</div>
            )}
          </div>
        </div>

        {/* Top Buyers Leaderboard */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative">
          <div className="bg-[#D4AF37] p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-black/10 rounded-xl flex items-center justify-center">
                <Trophy className="w-5 h-5 text-gray-900" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Elite Buyers</h2>
                <p className="text-gray-900/70 text-xs font-bold uppercase tracking-widest">Highest Volume Traders</p>
              </div>
            </div>
          </div>
          
          <div className="p-2">
            {topBuyers.map((buyer, index) => (
              <div key={buyer.id} className={`flex items-center gap-4 p-4 rounded-2xl transition-colors ${currentUser?.id === buyer.id ? 'bg-[#D4AF37]/10 border border-[#D4AF37]/20' : 'hover:bg-gray-50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-[#D4AF37] text-white shadow-[0_0_10px_rgba(212,175,55,0.5)]' : index === 1 ? 'bg-gray-300 text-gray-800' : index === 2 ? 'bg-[#CD7F32] text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {index + 1}
                </div>
                
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-400">
                  {buyer.name.substring(0,2).toUpperCase()}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate flex items-center gap-1">
                    {buyer.name}
                    {buyer.plan === 'EXO_PASS' && <Crown className="w-4 h-4 text-[#D4AF37]" title="VIP Pass" />}
                  </h3>
                  <div className="text-xs text-gray-500">
                    Volume: <span className="font-medium text-gray-900">{formatCurrency(buyer.spentAmount || 0)}</span>
                  </div>
                </div>
                
                {index < 3 && (
                  <div className="text-[#D4AF37]">
                    <ArrowUp className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            {topBuyers.length === 0 && (
              <div className="p-8 text-center text-gray-500 text-sm">No buyers with transaction volume yet.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
