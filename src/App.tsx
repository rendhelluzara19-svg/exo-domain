import React, { useState } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { AuthPage } from '@/pages/AuthPage';
import { MainLayout } from '@/components/MainLayout';
import { MarketplacePage } from '@/pages/MarketplacePage';
import { EventsPage } from '@/pages/EventsPage';
import { ChatPage } from '@/pages/ChatPage';
import { ProfileDashboardPage } from '@/pages/ProfileDashboardPage';
import { CartDrawer } from '@/components/CartDrawer';
import { PerformanceManager } from '@/components/PerformanceManager';
import { LeaderboardPage } from '@/pages/LeaderboardPage';
import EnclaveHub from '@/components/EnclaveHub';

const AppContent = () => {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [isCartOpen, setIsCartOpen] = useState(false);

  if (!currentUser) return <AuthPage />;

  return (
    <>
      <PerformanceManager />
      <MainLayout activeTab={activeTab} setActiveTab={setActiveTab} onCartClick={() => setIsCartOpen(true)} onNotifClick={() => {}}>
        {activeTab === 'market' && <MarketplacePage />}
        {activeTab === 'profile' && <ProfileDashboardPage />}
        {activeTab === 'enclave' && <EnclaveHub />}
        {activeTab === 'chat' && <ChatPage />}
        {activeTab === 'events' && <EventsPage />}
        {activeTab === 'rank' && <LeaderboardPage />}
      </MainLayout>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
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
