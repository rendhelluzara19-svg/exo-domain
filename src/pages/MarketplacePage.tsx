import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { ProductCard } from '@/components/ProductCard';
import { ArrowLeft, MessageSquare, Star, CheckCircle, ShieldCheck, Megaphone } from 'lucide-react';
import { AppEvent } from '@/types';
import { motion, AnimatePresence } from 'motion/react';

const FeaturedAdsCarousel: React.FC<{ events: AppEvent[] }> = ({ events }) => {
  const { isLiteMode } = useApp();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (events.length <= 1 || isLiteMode) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % events.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [events.length, isLiteMode]);

  if (!events || events.length === 0) return null;

  const currentEvent = events[index];
  const hasMedia = currentEvent.mediaUrls && currentEvent.mediaUrls.length > 0 && currentEvent.mediaUrls[0] !== '';
  const isVideo = hasMedia && (currentEvent.mediaUrls[0].match(/\.(mp4|webm|ogg)$/i) || currentEvent.mediaUrls[0].includes('/video/upload/'));

  if (isLiteMode) {
    return (
      <div className="relative w-full aspect-[21/9] sm:aspect-[24/8] rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 mb-6">
        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#15241C]">
          {hasMedia ? (
            <img 
              src={currentEvent.mediaUrls[0]} 
              alt={currentEvent.title} 
              className="w-full h-full object-cover select-none pointer-events-none" 
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-[#15241C] via-[#0b130e] to-teal-950 flex flex-col items-center justify-center p-6 text-center select-none">
              <div className="text-[10px] text-teal-400 font-bold uppercase tracking-widest mb-1">MARKETPLACE FEATURED</div>
              <h3 className="text-white text-lg font-black max-w-md leading-snug">{currentEvent.title}</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-sm line-clamp-2">{currentEvent.description || 'Exclusive local events and breeder showcases.'}</p>
            </div>
          )}

          {/* Premium Gradient Shading Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30 pointer-events-none z-10" />

          {/* Attention Badge */}
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <span className="bg-rose-600 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 border border-rose-500/30">
              FEATURED AD
            </span>
          </div>

          {/* Slider Text Details */}
          <div className="absolute bottom-4 left-6 right-6 z-20 flex justify-between items-end">
            <div className="max-w-md text-left">
              <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest">Cavite Exotic Community Bulletin</span>
              <h3 className="text-white font-black text-sm sm:text-xl md:text-2xl mt-0.5 leading-tight">{currentEvent.title}</h3>
              <p className="text-xs text-gray-300 line-clamp-1 mt-0.5 font-medium">{currentEvent.description || 'Rare breeder showcase and terrarium bundle promotions.'}</p>
            </div>
            
            <button 
              onClick={() => alert(`Redirecting to ad: ${currentEvent.title}`)}
              className="hidden sm:block bg-teal-400 text-slate-950 text-xs font-black px-4 py-2 rounded-xl"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[21/9] sm:aspect-[24/8] rounded-3xl overflow-hidden border border-[#15241C] bg-slate-950 shadow-[0_4px_30px_rgba(20,184,166,0.15)] group mb-6">
      
      {/* Slide Transition Engine */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#15241C]"
          >
            {hasMedia ? (
              isVideo ? (
                <video 
                  src={currentEvent.mediaUrls[0]} 
                  className="w-full h-full object-cover select-none pointer-events-none" 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                />
              ) : (
                <img 
                  src={currentEvent.mediaUrls[0]} 
                  alt={currentEvent.title} 
                  className="w-full h-full object-cover select-none pointer-events-none" 
                />
              )
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-[#15241C] via-[#0b130e] to-teal-950 flex flex-col items-center justify-center p-6 text-center select-none">
                <Megaphone className="w-10 h-10 text-teal-400 mb-2 animate-bounce" />
                <div className="text-[10px] text-teal-400 font-bold uppercase tracking-widest mb-1">MARKETPLACE FEATURED</div>
                <h3 className="text-white text-lg font-black max-w-md leading-snug drop-shadow">{currentEvent.title}</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-sm line-clamp-2">{currentEvent.description || 'Exclusive local events and breeder showcases.'}</p>
              </div>
            )}

            {/* Premium Gradient Shading Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30 pointer-events-none z-10" />

            {/* Dual Blinking Neon Attention Badges */}
            <div className="absolute top-4 left-4 z-20 flex gap-2">
              <motion.span
                animate={{ opacity: [1, 0.4, 1, 0.9, 0.2, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="bg-rose-600 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-[0_0_12px_rgba(220,38,38,0.6)] flex items-center gap-1 border border-rose-500/30"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                FEATURED AD
              </motion.span>
              <motion.span
                animate={{ opacity: [0.3, 1, 0.2, 1, 0.8, 0.3] }}
                transition={{ repeat: Infinity, duration: 2.8, ease: 'linear' }}
                className="bg-teal-500 text-slate-950 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-[0_0_12px_rgba(20,184,166,0.6)] border border-teal-400/30"
              >
                ⚡ SPARK PROMO
              </motion.span>
            </div>

            {/* Slider Text Details */}
            <div className="absolute bottom-4 left-6 right-6 z-20 flex justify-between items-end">
              <div className="max-w-md text-left">
                <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest">Cavite Exotic Community Bulletin</span>
                <h3 className="text-white font-black text-sm sm:text-xl md:text-2xl mt-0.5 leading-tight drop-shadow-md">{currentEvent.title}</h3>
                <p className="text-xs text-gray-300 line-clamp-1 mt-0.5 font-medium drop-shadow">{currentEvent.description || 'Rare breeder showcase and terrarium bundle promotions.'}</p>
              </div>
              
              <button 
                onClick={() => alert(`Redirecting to ad: ${currentEvent.title}`)}
                className="hidden sm:block bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-black px-4 py-2 rounded-xl transition-all shadow-[0_0_12px_rgba(45,212,191,0.4)] transform hover:scale-105 active:scale-95"
              >
                Learn More
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Switch Controls */}
      {events.length > 1 && (
        <>
          <button 
            onClick={() => setIndex((prev) => (prev - 1 + events.length) % events.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/40 hover:bg-teal-400 hover:text-slate-950 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-colors shadow-md text-sm font-black"
          >
            ‹
          </button>
          <button 
            onClick={() => setIndex((prev) => (prev + 1) % events.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/40 hover:bg-teal-400 hover:text-slate-950 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-colors shadow-md text-sm font-black"
          >
            ›
          </button>

          {/* Indicator Pagination Dots */}
          <div className="absolute bottom-3 right-6 z-30 flex gap-1.5">
            {events.map((_, idx) => (
              <button 
                key={idx} 
                onClick={() => setIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${idx === index ? 'bg-teal-400 w-3' : 'bg-white/30'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export const MarketplacePage = () => {
  const { products, users, currentUser, events } = useApp();
  const [filterRegion, setFilterRegion] = useState<string>('All');
  const [filterBarangay, setFilterBarangay] = useState<string>('All');
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'FEEDERS' | 'EXOTICS' | 'SUPPLIES'>('ALL');
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);

  // Derive unique barangays for Cavite (or globally)
  const barangays = useMemo(() => {
    const list = new Set<string>();
    products.forEach(p => {
      if (p.barangay) list.add(p.barangay);
    });
    return Array.from(list);
  }, [products]);

  const filteredProducts = products.filter(p => {
    if (selectedSellerId) return p.sellerId === selectedSellerId;
    if (activeCategory !== 'ALL' && p.category !== activeCategory) return false;
    if (filterRegion === 'Cavite' && (!p.province?.toLowerCase().includes('cavite') && !p.barangay)) return false; // Basic region check
    if (filterBarangay !== 'All' && p.barangay !== filterBarangay) return false;
    return true;
  }).sort((a, b) => {
    // Plan Perks Priority
    const getWeight = (sellerId: string) => {
      const u = users.find(u => u.id === sellerId);
      switch(u?.plan) {
        case 'ELITE': return 3;
        case 'PRO': return 2;
        case 'STARTER': return 1;
        default: return 0;
      }
    };
    return getWeight(b.sellerId) - getWeight(a.sellerId);
  });

  const selectedSeller = selectedSellerId ? users.find(u => u.id === selectedSellerId) : null;

  return (
    <div className="p-4 sm:p-6 pb-24">
      {selectedSellerId && selectedSeller ? (
        <div className="mb-6">
          <button onClick={() => setSelectedSellerId(null)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Marketplace
          </button>
          
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full -mr-16 -mt-16 opacity-50"></div>
            
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center relative z-10">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 font-bold text-2xl uppercase border-2 border-white shadow-md">
                {selectedSeller.name.substring(0, 2)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900">{selectedSeller.name}'s Shop</h1>
                  {selectedSeller.kycData && <CheckCircle className="w-5 h-5 text-teal-500" title="Identity Verified" />}
                  {(selectedSeller.plan === 'PRO' || selectedSeller.plan === 'ELITE') && (
                    <ShieldCheck className="w-5 h-5 text-[#D4AF37]" title="Trusted Breeder" />
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                    <span className="font-medium text-gray-800">4.9</span> (128 reviews)
                  </div>
                  <span className="bg-gray-100 px-2 py-0.5 rounded-md font-medium">{selectedSeller.plan} Seller</span>
                </div>
              </div>
              
              <div className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Inquire / Chat
                </button>
              </div>
            </div>
          </div>
          
          <h2 className="text-lg font-bold text-gray-900 mt-8 mb-4">Available Listings</h2>
        </div>
      ) : (
        <>
          {/* Category Pills */}
          <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar">
            {['ALL', 'FEEDERS', 'EXOTICS', 'SUPPLIES'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as any)}
                className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat 
                    ? 'bg-[#15241C] text-teal-400 shadow-md' 
                    : 'bg-white text-gray-500 border border-[#E5E7EB] hover:border-teal-500 hover:text-teal-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Featured Carousel */}
          <FeaturedAdsCarousel events={events} />

          {/* Locator Filters */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Region</label>
              <select 
                value={filterRegion} 
                onChange={(e) => { setFilterRegion(e.target.value); setFilterBarangay('All'); }}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 text-sm"
              >
                <option value="All">All Regions</option>
                <option value="Cavite">📍 Cavite Area</option>
              </select>
            </div>
            
            {filterRegion === 'Cavite' && (
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Barangay (Cavite)</label>
                <select 
                  value={filterBarangay} 
                  onChange={(e) => setFilterBarangay(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 text-sm"
                >
                  <option value="All">All Barangays</option>
                  {barangays.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredProducts.map(p => (
          <div key={p.id} className="relative group cursor-pointer" onClick={() => !selectedSellerId && setSelectedSellerId(p.sellerId)}>
            <ProductCard product={p} />
            {!selectedSellerId && (
              <div className="absolute inset-0 bg-black/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px] pointer-events-none">
                <span className="bg-white text-gray-900 px-4 py-2 rounded-xl font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all pointer-events-auto">View Shop</span>
              </div>
            )}
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-3xl border border-gray-100">
            No products found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};
