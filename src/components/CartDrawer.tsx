import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Download, ShoppingCart } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

export const CartDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { cart, products, currentUser, removeFromCart, clearCart, createOrder, updateUser } = useApp();
  const [showWarning, setShowWarning] = useState(false);
  const [warningMsg, setWarningMsg] = useState('');
  const [successReceipt, setSuccessReceipt] = useState<{ id: string; text: string } | null>(null);

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product !== undefined);

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.product!.price * item.quantity), 0);

  const handleCheckout = () => {
    if (!currentUser) return;

    if (currentUser.balance < totalAmount) {
      setWarningMsg(`Insufficient Balance. Your balance is ${formatCurrency(currentUser.balance)}, but the total is ${formatCurrency(totalAmount)}.`);
      setShowWarning(true);
      return;
    }

    // Process Order
    const orderId = createOrder(
      currentUser.id,
      cartItems.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.product!.price })),
      totalAmount
    );

    // Deduct Balance
    updateUser(currentUser.id, { balance: currentUser.balance - totalAmount });

    // Generate Receipt Data
    const receiptText = `
========================================
    FEEDERS DOMAIN OFFICIAL RECEIPT
========================================
Transaction ID: ${orderId}
Date: ${new Date().toLocaleString()}
Buyer: ${currentUser.name} (${currentUser.email})
----------------------------------------
ITEMS:
${cartItems.map(i => `${i.product!.name} x${i.quantity} = ${formatCurrency(i.product!.price * i.quantity)}`).join('\n')}
----------------------------------------
TOTAL DEDUCTED: ${formatCurrency(totalAmount)}
REMAINING BALANCE: ${formatCurrency(currentUser.balance - totalAmount)}
========================================
HASH: ${btoa(orderId + totalAmount.toString()).substring(0, 16).toUpperCase()}
    `;

    setSuccessReceipt({ id: orderId, text: receiptText });
    clearCart();
  };

  const handleDownloadReceipt = () => {
    if (!successReceipt) return;
    const blob = new Blob([successReceipt.text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FDX-Receipt-${successReceipt.id.substring(0,8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Close everything after download
    setSuccessReceipt(null);
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-[#FDFBF7] h-full shadow-2xl flex flex-col border-l border-[#E5E7EB]"
            >
              <div className="p-4 border-b border-[#E5E7EB] bg-white flex justify-between items-center">
                <h2 className="font-bold text-xl text-gray-900">Your Cart</h2>
                <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <ShoppingCart className="w-12 h-12 mb-2 opacity-50" />
                    <p>Your cart is empty.</p>
                  </div>
                ) : (
                  cartItems.map(item => (
                    <div key={item.productId} className="flex gap-4 bg-white p-3 rounded-2xl border border-[#E5E7EB] shadow-sm">
                      <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                        {item.product!.images?.[0] && <img src={item.product!.images[0]} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{item.product!.name}</h4>
                        <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                        <div className="font-bold text-[#D4AF37]">{formatCurrency(item.product!.price * item.quantity)}</div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.productId)}
                        className="self-center p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="p-4 bg-white border-t border-[#E5E7EB] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-gray-500">Total</span>
                    <span className="font-bold text-2xl text-[#15241C]">{formatCurrency(totalAmount)}</span>
                  </div>
                  <Button className="w-full py-4 text-lg" onClick={handleCheckout}>
                    Proceed to Checkout
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Modal isOpen={showWarning} onClose={() => setShowWarning(false)} title="Transaction Failed">
        <div className="text-center py-4">
          <div className="text-4xl mb-4">💳</div>
          <p className="text-gray-700 font-medium mb-6">{warningMsg}</p>
          <Button onClick={() => setShowWarning(false)} className="w-full">Dismiss</Button>
        </div>
      </Modal>

      <Modal isOpen={!!successReceipt} onClose={() => setSuccessReceipt(null)} title="Order Successful">
        <div className="text-center py-4">
          <div className="text-4xl mb-4">🎉</div>
          <p className="text-gray-900 font-bold mb-2">Payment Deducted & Order Queued!</p>
          <p className="text-sm text-gray-500 mb-6">Please download your official receipt. You will need to upload this in the Chat tab to unlock communication with the seller.</p>
          <Button onClick={handleDownloadReceipt} className="w-full flex items-center justify-center gap-2">
            <Download className="w-5 h-5" />
            Download Receipt / Save Proof
          </Button>
        </div>
      </Modal>
    </>
  );
};
