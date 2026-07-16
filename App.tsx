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

  // Listahan ng mga authorized na roles para makita ang Enclave/Role Control Suite
  const authorizedRoles = ['ADMIN', 'FINANCE_STAFF', 'VERIFICATION_STAFF', 'EVENT_ORGANIZER'];

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
        }
      } catch (err) {
        console.log("Geo check bypassed.");
      } finally {
        setGeoChecking(false);
      }
    };
    checkGeo();
  }, []);

  if (geoChecking) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-teal-500 font-mono">Verifying...</div>;

  if (isGeoBlocked) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <Shield className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
      </div>
    );
  }

  if (!currentUser) return <AuthPage />;

  const isStaff = ['VERIFICATION_STAFF', 'FINANCE_STAFF', 'SUPPORT_STAFF', 'EVENT_ORGANIZER'].includes(currentUser.role);
  
  if (isStaff && activeTab !== 'profile' && activeTab !== 'chat' && activeTab !== 'enclave') {
    if (!(currentUser.role === 'EVENT_ORGANIZER' && activeTab === 'events')) {
        setActiveTab('profile');
    }
  }

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
        {activeTab === 'events' && (['ADMIN', 'BUYER', 'SELLER', 'EVENT_ORGANIZER'].includes(currentUser.role)) && <EventsPage />}
        {activeTab === 'chat' && <ChatPage />}
        {activeTab === 'profile' && <ProfileDashboardPage />}
        
        {/* Role-based check para sa Enclave/Role Control Suite */}
        {activeTab === 'enclave' && (
          authorizedRoles.includes(currentUser.role) ? (
            <React.Suspense fallback={<div className="p-12 text-center text-emerald-400">Loading Secure Enclave...</div>}>
              <EnclaveHub />
            </React.Suspense>
          ) : (
            <AccessDenied onBack={() => setActiveTab('profile')} />
          )
        )}
      </MainLayout>
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default function App() {
  return <AppProvider><AppContent /></AppProvider>;
}
