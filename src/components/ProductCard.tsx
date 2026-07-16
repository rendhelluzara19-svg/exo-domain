import React, { useState } from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Plus, Minus, ShieldCheck, Leaf } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart, users } = useApp();
  const [currentMediaIdx, setCurrentMediaIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showWarning, setShowWarning] = useState(false);
  
  const allMedia = [...(product.images || []), ...(product.videos || [])];
  
  const seller = users.find(u => u.id === product.sellerId);

  const handleNext = () => setCurrentMediaIdx((p) => (p + 1) % allMedia.length);
  const handlePrev = () => setCurrentMediaIdx((p) => (p - 1 + allMedia.length) % allMedia.length);

  const handleQtyChange = (val: string | number) => {
    let num = typeof val === 'string' ? parseInt(val) : val;
    if (isNaN(num) || num < 1) num = 1;
    
    if (num > product.stock) {
      setQuantity(product.stock);
      setShowWarning(true);
    } else {
      setQuantity(num);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent clicking the card from bubbling up
    if (quantity > product.stock) {
      setShowWarning(true);
      setQuantity(product.stock);
      return;
    }
    addToCart(product.id, quantity);
  };

  return (
    <>
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow relative">
        {/* DENR BADGE */}
        {product.category === 'EXOTICS' && seller?.denrVerified && (
          <div className="absolute top-6 left-6 z-10 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Leaf className="w-3 h-3" /> DENR VERIFIED
          </div>
        )}
        
        {/* Media Carousel */}
        <div className="relative w-full aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4 group">
          {allMedia.length > 0 ? (
            <>
              {allMedia[currentMediaIdx].endsWith('.mp4') ? (
                <video src={allMedia[currentMediaIdx]} className="w-full h-full object-cover" autoPlay muted loop />
              ) : (
                <img src={allMedia[currentMediaIdx]} alt={product.name} className="w-full h-full object-cover" />
              )}
              {allMedia.length > 1 && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); handlePrev(); }} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><ChevronLeft className="w-5 h-5"/></button>
                  <button onClick={(e) => { e.stopPropagation(); handleNext(); }} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight className="w-5 h-5"/></button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {allMedia.map((_, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === currentMediaIdx ? 'bg-white' : 'bg-white/50'}`} />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Media</div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-gray-900 line-clamp-1 flex-1 pr-2">{product.name}</h3>
            <span className="font-bold text-teal-600">{formatCurrency(product.price)}</span>
          </div>
          <p className="text-xs text-gray-500 mb-2 line-clamp-2">{product.description}</p>
          <div className="text-xs font-medium text-gray-700 bg-gray-50 border border-gray-100 self-start px-2 py-1 rounded-lg mb-4 flex items-center gap-1">
            Stock: {product.stock}
            {seller?.plan === 'STARTER' && <ShieldCheck className="w-3 h-3 text-red-500 ml-1" title="Starter Seller" />}
            {seller?.plan === 'PRO' && <ShieldCheck className="w-3 h-3 text-blue-500 ml-1" title="Pro Seller" />}
            {seller?.plan === 'ELITE' && <div className="w-3 h-3 ml-1 bg-violet-500 animate-pulse rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(139,92,246,0.8)]" title="Elite Seller"><ShieldCheck className="w-2 h-2 text-white" /></div>}
          </div>
          
          <div className="text-[10px] font-bold text-gray-400 mb-4 flex items-center gap-1 uppercase tracking-wider">
            📍 {product.barangay ? `${product.barangay}, ` : ''}{product.province || seller?.location || 'Unknown'}
          </div>

          <div className="mt-auto">
            <div className="flex items-center gap-2 mb-3" onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => handleQtyChange(quantity - 1)}
                className="w-8 h-8 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100"
              ><Minus className="w-4 h-4"/></button>
              <input 
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => handleQtyChange(e.target.value)}
                className="w-full h-8 text-center border border-gray-200 bg-gray-50 rounded-lg font-bold focus:outline-none focus:ring-1 focus:ring-teal-500 text-sm"
              />
              <button 
                onClick={() => handleQtyChange(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100"
              ><Plus className="w-4 h-4"/></button>
            </div>
            
            <Button 
              className="w-full bg-gray-900 text-white hover:bg-gray-800" 
              onClick={handleAddToCart}
              disabled={product.stock < 1}
            >
              {product.stock < 1 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </div>

      <Modal isOpen={showWarning} onClose={() => setShowWarning(false)} title="Stock Limit Reached">
        <div className="text-center py-4">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-gray-700 font-medium mb-6">Input exceeds available stock. Quantity adjusted to maximum available.</p>
          <Button onClick={() => setShowWarning(false)} className="w-full">OK</Button>
        </div>
      </Modal>
    </>
  );
};
