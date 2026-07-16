import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Modal = ({ isOpen, onClose, children, title, className }: { isOpen: boolean; onClose: () => void; children: React.ReactNode; title?: string; className?: string }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className={cn("relative w-full max-w-md bg-[#FDFBF7] rounded-3xl shadow-xl overflow-hidden border border-[#D4AF37]/30", className)}
          >
            <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB] bg-white">
              {title && <h3 className="font-bold text-gray-900">{title}</h3>}
              <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-900 bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 max-h-[80vh] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
