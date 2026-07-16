import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Order, Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency } from '@/lib/utils';
import { Send, Upload, Lock, Clock, CheckCircle2, Copy, MessageSquare, Loader2 } from 'lucide-react';
import { uploadToCloudinary } from '@/utils/cloudinary';

export const ChatPage = () => {
  const { currentUser, orders, users, products, updateOrder, updateUser } = useApp();
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [tempReceipt, setTempReceipt] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isBankManagerOpen, setIsBankManagerOpen] = useState(false);

  // Bank Manager State
  const [newBank, setNewBank] = useState('');
  const [newBankName, setNewBankName] = useState('');
  const [newBankNumber, setNewBankNumber] = useState('');

  if (!currentUser) return null;

  // For Buyers: Orders where they are the buyer
  // For Sellers: Orders where they are the seller
  const userOrders = orders.filter(o => 
    currentUser.role === 'BUYER' ? o.buyerId === currentUser.id : o.sellerId === currentUser.id
  );

  const getOrderTitle = (order: Order) => {
    const mainProduct = products.find(p => p.id === order.items[0]?.productId);
    if (currentUser.role === 'BUYER') {
      return mainProduct ? `Order: ${mainProduct.name}` : `Order: ${order.id.substring(0,8)}`;
    } else {
      const buyer = users.find(u => u.id === order.buyerId);
      return `Buyer: ${buyer?.name || 'Unknown'}`;
    }
  };

  const activeOrder = userOrders.find(o => o.id === activeOrderId) || userOrders[0];
  const activeSeller = activeOrder ? users.find(u => u.id === activeOrder.sellerId) : null;

  const handleUploadReceipt = () => {
    setIsConfirmModalOpen(true);
  };

  const confirmUploadReceipt = () => {
    if (!activeOrder || !tempReceipt) return;
    updateOrder(activeOrder.id, { receiptUrl: tempReceipt, status: 'PAYMENT_UPLOADED' });
    setTempReceipt('');
    setIsConfirmModalOpen(false);
  };

  const handleSellerAccept = () => {
    if (!activeOrder) return;
    updateOrder(activeOrder.id, { status: 'VERIFIED' });
  };

  const handleAddPaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();
    const currentMethods = currentUser.paymentMethods || [];
    updateUser(currentUser.id, {
      paymentMethods: [...currentMethods, { bank: newBank, name: newBankName, number: newBankNumber }]
    });
    setNewBank('');
    setNewBankName('');
    setNewBankNumber('');
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col sm:flex-row p-4 gap-4 pb-10">
      {/* Sidebar: Chat List */}
      <div className="w-full sm:w-1/3 bg-white rounded-3xl border border-gray-100 overflow-hidden flex flex-col shadow-sm">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h2 className="font-bold text-gray-900">Conversations</h2>
          {currentUser.role === 'SELLER' && (
            <button onClick={() => setIsBankManagerOpen(true)} className="text-xs text-teal-600 font-bold hover:underline">
              Bank Setup
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {userOrders.length === 0 ? (
            <div className="text-sm text-gray-500 text-center p-4 border border-dashed rounded-xl mt-2 mx-2">No active inquiries.</div>
          ) : (
            userOrders.map(order => (
              <button
                key={order.id}
                onClick={() => setActiveOrderId(order.id)}
                className={`w-full text-left p-3 rounded-2xl transition-all ${
                  activeOrder?.id === order.id 
                    ? 'bg-teal-50 border-teal-200 shadow-sm' 
                    : 'bg-white hover:bg-gray-50 border border-transparent hover:border-gray-100 text-gray-700'
                } border`}
              >
                <div className="font-bold text-sm truncate text-gray-900">{getOrderTitle(order)}</div>
                <div className="text-xs mt-1 text-teal-600 font-medium truncate">
                  {order.status === 'PENDING_PAYMENT' ? '🔒 Payment Required' : 
                   order.status === 'PAYMENT_UPLOADED' ? '⏳ Verifying Payment' : '💬 Active Chat'}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="w-full sm:w-2/3 bg-white rounded-3xl border border-gray-100 flex flex-col overflow-hidden shadow-sm">
        {activeOrder ? (
          <>
            <div className="p-4 border-b border-gray-100 bg-white shadow-sm z-10 flex justify-between items-center">
              <div>
                <h2 className="font-bold text-lg text-gray-900">{getOrderTitle(activeOrder)}</h2>
                <div className="text-xs text-gray-500 font-mono mt-0.5">Order ID: {activeOrder.id} • Total: <span className="text-teal-600 font-bold">{formatCurrency(activeOrder.totalAmount)}</span></div>
              </div>
            </div>

            <div className="flex-1 p-4 bg-[#FDFBF7] overflow-y-auto flex flex-col gap-4">
              {/* Dummy messages representation */}
              {activeOrder.status === 'VERIFIED' && (
                <>
                  <div className="self-center bg-teal-100 text-teal-800 text-xs px-3 py-1 rounded-full mb-4 font-bold">
                    Payment Verified. Chat Unlocked.
                  </div>
                  <div className="self-end bg-teal-600 text-white p-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm">
                    Hello! I have verified your order. Let's arrange shipping.
                  </div>
                </>
              )}
            </div>

            {/* Input / Queue Area */}
            <div className="p-4 border-t border-gray-100 bg-white">
              {activeOrder.status === 'PENDING_PAYMENT' || activeOrder.status === 'PAYMENT_UPLOADED' ? (
                currentUser.role === 'BUYER' ? (
                  !activeOrder.receiptUrl ? (
                    <div className="bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-300 text-center">
                      <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <h4 className="font-bold text-gray-700 mb-1">🔒 SECURE CHECKOUT</h4>
                      
                      {activeSeller?.paymentMethods && activeSeller.paymentMethods.length > 0 ? (
                        <div className="mb-4 text-left bg-white p-3 rounded-xl border border-gray-100 inline-block text-xs w-full max-w-sm">
                          <p className="font-bold text-gray-900 mb-2">Seller Payment Options:</p>
                          {activeSeller.paymentMethods.map((m, i) => (
                            <div key={i} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg mb-1">
                              <div>
                                <span className="font-bold">{m.bank}</span>: {m.name}
                              </div>
                              <div className="flex items-center gap-2">
                                <code className="text-teal-600 bg-teal-50 px-1 rounded">{m.number}</code>
                                <button onClick={() => navigator.clipboard.writeText(m.number)} className="text-gray-400 hover:text-teal-600"><Copy className="w-3 h-3" /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-orange-500 mb-4 font-medium">Seller has not provided bank details. Contact support.</p>
                      )}

                      <p className="text-xs text-gray-500 mb-4">Please upload your digital receipt as proof of payment.</p>
                      <input 
                        type="file" 
                        accept="image/*" 
                        disabled={isUploading}
                        onChange={async (e) => {
                          if (e.target.files && e.target.files[0]) {
                            setIsUploading(true);
                            try {
                              const url = await uploadToCloudinary(e.target.files[0]);
                              setTempReceipt(url);
                            } catch (err) {
                              console.error(err);
                            } finally {
                              setIsUploading(false);
                            }
                          }
                        }}
                        className="text-xs w-full max-w-xs mx-auto block mb-3 disabled:opacity-50"
                      />
                      {isUploading && (
                        <div className="text-xs text-teal-600 mb-3 flex items-center justify-center gap-2">
                          <Loader2 className="w-3 h-3 animate-spin" /> Uploading to Cloudinary...
                        </div>
                      )}
                      <Button onClick={handleUploadReceipt} disabled={!tempReceipt || isUploading} className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700">
                        Submit Proof of Payment
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 text-center">
                      <Clock className="w-10 h-10 text-orange-400 mx-auto mb-3 animate-pulse" />
                      <h4 className="font-bold text-orange-800 mb-1 text-lg">Verifying Payment</h4>
                      <p className="text-sm text-orange-600">Please wait while the seller confirms your receipt. The chat will unlock automatically upon approval.</p>
                    </div>
                  )
                ) : (
                  // Seller View of QUEUED
                  activeOrder.receiptUrl ? (
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-3 text-lg">Buyer Uploaded Receipt</h4>
                      <div className="bg-white p-2 rounded-xl inline-block mb-4 border border-gray-100 shadow-sm cursor-pointer hover:opacity-90" onClick={() => window.open(activeOrder.receiptUrl)}>
                        <img src={activeOrder.receiptUrl} alt="Receipt" className="w-full max-w-xs h-40 object-cover rounded-lg bg-gray-100" />
                      </div>
                      <div className="flex gap-3 max-w-xs">
                        <Button onClick={handleSellerAccept} className="flex-1 bg-teal-600 hover:bg-teal-700">Approve & Open Chat</Button>
                        <Button variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50">Decline</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-6 rounded-2xl text-center border border-dashed border-gray-200">
                      <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 font-medium">Waiting for buyer to upload payment receipt...</p>
                      <p className="text-xs text-gray-400 mt-1">Make sure your Bank Details are updated in the Bank Setup menu.</p>
                    </div>
                  )
                )
              ) : (
                <div className="flex items-center gap-3">
                  <input 
                    type="text" 
                    placeholder="Type a message..." 
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-sm"
                  />
                  <button className="p-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors shadow-md">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
            <p>Select a conversation from the sidebar.</p>
          </div>
        )}
      </div>

      {/* Upload Confirmation Modal */}
      <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} title="Confirm Payment Upload">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Are you sure this is the correct receipt? Fraudulent receipts may result in a permanent ban.</p>
          <img src={tempReceipt} alt="Preview" className="w-full h-48 object-cover rounded-xl border border-gray-200" />
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)} className="flex-1">Cancel</Button>
            <Button onClick={confirmUploadReceipt} className="flex-1 bg-teal-600 hover:bg-teal-700">Confirm & Upload</Button>
          </div>
        </div>
      </Modal>

      {/* Seller Bank Manager Modal */}
      <Modal isOpen={isBankManagerOpen} onClose={() => setIsBankManagerOpen(false)} title="Bank Manager (Copyable)">
        <div className="space-y-4">
          <div className="space-y-2 mb-4">
            {currentUser.paymentMethods?.map((m, i) => (
              <div key={i} className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex justify-between items-center">
                <div>
                  <div className="font-bold text-sm text-gray-900">{m.bank}</div>
                  <div className="text-xs text-gray-500">{m.name}</div>
                </div>
                <div className="font-mono text-sm text-teal-600 bg-teal-50 px-2 py-1 rounded-md">{m.number}</div>
              </div>
            ))}
            {(!currentUser.paymentMethods || currentUser.paymentMethods.length === 0) && (
              <p className="text-sm text-gray-500 text-center p-4 border border-dashed rounded-xl">No payment methods added yet.</p>
            )}
          </div>
          
          <form onSubmit={handleAddPaymentMethod} className="space-y-3 border-t border-gray-100 pt-4">
            <h4 className="font-bold text-sm text-gray-900">Add New Method</h4>
            <select value={newBank} onChange={e => setNewBank(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none" required>
              <option value="">Select Bank/E-Wallet</option>
              <option value="GCash">GCash</option>
              <option value="Maya">Maya</option>
              <option value="GoTyme">GoTyme Bank</option>
              <option value="BDO">BDO</option>
              <option value="BPI">BPI</option>
            </select>
            <input type="text" placeholder="Account Name" value={newBankName} onChange={e => setNewBankName(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none" required />
            <input type="text" placeholder="Account Number" value={newBankNumber} onChange={e => setNewBankNumber(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none" required />
            <Button type="submit" className="w-full bg-gray-900 text-white">Add Method</Button>
          </form>
        </div>
      </Modal>

    </div>
  );
};
