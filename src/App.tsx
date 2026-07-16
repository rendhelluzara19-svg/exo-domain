import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { AuthPage } from '@/pages/AuthPage';
import { MainLayout } from '@/components/MainLayout';
import { MarketplacePage } from '@/pages/MarketplacePage';
import { EventsPage } from '@/pages/EventsPage';
import { ChatPage } from '@/pages/ChatPage';
import { ProfileDashboardPage } from '@/pages/ProfileDashboardPage';
import { CartDrawer } from '@/components/CartDrawer';
import { Modal } from '@/components/ui/Modal';
import { Shield } from 'lucide-react';
import { PerformanceManager } from '@/components/PerformanceManager';
import { LeaderboardPage } from '@/pages/LeaderboardPage';

const EnclaveHub = React.lazy(() => import('@/components/EnclaveHub'));

const AccessDenied = ({ onBack }: { onBack: () => void }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
    <Shield className="w-16 h-16 text-red-500 mb-4" />
    <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
    <p className="text-gray-600 mb-6 text-center max-w-sm">You do not have the required permissions to view this area.</p>
    <button onClick={onBack} className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-medium">Return to Dashboard</button>
  </div>
);

const AppContent = () => {
  const { currentUser, notifications, markNotificationRead, isLiteMode } = useApp();
  const [activeTab, setActiveTab] = useState('market');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isGeoBlocked, setIsGeoBlocked] = useState(false);
  const [geoChecking, setGeoChecking] = useState(true);

  useEffect(() => {
    if (isLiteMode && activeTab === 'leaderboard') {
      setActiveTab('market');
    }
  }, [isLiteMode, activeTab]);

  useEffect(() => {
    const checkGeo = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);
        
        const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (res.ok) {
          const data = await res.json();
          if (data && data.country_code && data.country_code !== 'PH') {
            setIsGeoBlocked(true);
          }
        } else {
          console.log(`Geo check returned status ${res.status}. Bypassing block.`);
        }
      } catch (err) {
        console.log("Geo check bypassed or timed out. Defaulting to Philippines (PH) region access.");
      } finally {
        setGeoChecking(false);
      }
    };
    checkGeo();
  }, []);

  if (geoChecking) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-teal-500 font-mono">Verifying Location...</div>;
  }

  if (isGeoBlocked) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <Shield className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-gray-400 mb-6 text-center max-w-sm">Service restricted to Philippines only.</p>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthPage />;
  }

  const isStaff = ['VERIFICATION_STAFF', 'FINANCE_STAFF', 'SUPPORT_STAFF', 'EVENT_ORGANIZER'].includes(currentUser.role);
  
  if (isStaff && activeTab !== 'profile' && activeTab !== 'chat' && activeTab !== 'enclave') {
    if (currentUser.role === 'EVENT_ORGANIZER' && activeTab === 'events') {
    } else {
      setActiveTab('profile');
    }
  }

  const unreadCount = notifications.filter(n => !n.read && n.userId === currentUser.id).length;

  return (
    <>
      <PerformanceManager />
      <MainLayout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onCartClick={() => setIsCartOpen(true)}
        onNotifClick={() => setIsNotifOpen(true)}
      >
        {activeTab === 'market' && !isStaff && <MarketplacePage />}
        {activeTab === 'market' && isStaff && <AccessDenied onBack={() => setActiveTab('profile')} />}
        
        {activeTab === 'leaderboard' && <LeaderboardPage />}

        {activeTab === 'events' && (currentUser.role === 'ADMIN' || currentUser.role === 'BUYER' || currentUser.role === 'SELLER' || currentUser.role === 'EVENT_ORGANIZER') && <EventsPage />}
        {activeTab === 'events' && isStaff && currentUser.role !== 'EVENT_ORGANIZER' && <AccessDenied onBack={() => setActiveTab('profile')} />}
        
        {activeTab === 'chat' && <ChatPage />}
        {activeTab === 'profile' && <ProfileDashboardPage />}
        
        {activeTab === 'enclave' && (
          <React.Suspense fallback={<div className="p-12 text-center text-emerald-400 font-mono">Loading Secure Enclave...</div>}>
            <EnclaveHub />
          </React.Suspense>
        )}
      </MainLayout>
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <Modal isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} title={`Notifications (${unreadCount})`}>
        <div className="space-y-3 py-2">
          {notifications.filter(n => n.userId === currentUser.id || (n.userId === 'ADMIN' && currentUser.role === 'ADMIN')).length === 0 && (
            <div className="text-center py-6 text-gray-500 text-sm">No new notifications</div>
          )}
          {notifications.filter(n => n.userId === currentUser.id || (n.userId === 'ADMIN' && currentUser.role === 'ADMIN')).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(n => (
            <div 
              key={n.id} 
              className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${!n.read ? 'bg-teal-50 border-teal-100 hover:bg-teal-100' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}`}
              onClick={() => {
                if (!n.read && n.id) {
                  markNotificationRead(n.id);
                }
                if (n.title.includes('Message')) {
                  setActiveTab('chat');
                } else if (n.title.includes('Order') || n.title.includes('Payment') || n.title.includes('Status')) {
                  setActiveTab('profile');
                }
                setIsNotifOpen(false);
              }}
            >
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-teal-500' : 'bg-gray-300'}`} />
              <div>
                <p className={`text-sm font-bold ${!n.read ? 'text-teal-900' : 'text-gray-700'}`}>{n.title}</p>
                <p className={`text-xs ${!n.read ? 'text-teal-700' : 'text-gray-500'}`}>{n.message}</p>
                <p className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
