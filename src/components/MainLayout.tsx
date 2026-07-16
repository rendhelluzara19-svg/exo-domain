import React from 'react';
import { useApp } from '@/context/AppContext';
import { Logo } from '@/components/Logo';
import { ShoppingCart, Bell, LogOut, Home, Calendar, MessageSquare, UserCircle, Trophy, ShieldCheck, Megaphone } from 'lucide-react';
import { ExoBot } from '@/components/ExoBot';
import { ProfileAvatar } from '@/components/ProfileAvatar';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (t: string) => void;
  onCartClick: () => void;
  onNotifClick: () => void;
}

export const MainLayout = ({ children, activeTab, setActiveTab, onCartClick, onNotifClick }: LayoutProps) => {
  const { setCurrentUser, cart, notifications, currentUser, appConfig, isLiteMode } = useApp();
  
  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const unreadNotifs = notifications.filter(n => !n.read && n.userId === currentUser?.id).length;

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#1a1c23] border-b border-gray-800 shadow-md px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {currentUser && (
            <ProfileAvatar user={currentUser} size="md" onClick={() => setActiveTab('profile')} />
          )}
          <Logo className="w-8 h-8 hidden sm:block text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]" />
          <span className="font-bold text-white hidden sm:block drop-shadow-md tracking-wider">Exo Domain</span>
          {appConfig.dtiVerified && (
            <span className="hidden sm:inline-flex items-center gap-1 bg-teal-500/10 text-teal-400 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border border-teal-500/30 drop-shadow-sm">
              <ShieldCheck className="w-3 h-3" /> DTI Verified
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={onNotifClick} className="relative p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full transition-colors drop-shadow-sm">
            <Bell className="w-6 h-6" />
            {unreadNotifs > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#1a1c23] shadow-[0_0_5px_rgba(239,68,68,0.5)] animate-pulse"></span>
            )}
          </button>
          
          <button onClick={onCartClick} className="relative p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full transition-colors drop-shadow-sm">
            <ShoppingCart className="w-6 h-6" />
            {totalCartItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#1a1c23] shadow-[0_0_5px_rgba(45,212,191,0.5)]">
                {totalCartItems}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => setCurrentUser(null)} 
            className="p-2 text-red-400 hover:bg-red-500/10 rounded-full transition-colors cursor-pointer z-50 drop-shadow-sm"
            title="Logout"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full relative z-0">
        {children}
      </main>

      {/* Fixed Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-[#1a1c23]/95 backdrop-blur-md border-t border-gray-800 px-6 py-3 flex justify-between items-center z-40 pb-safe overflow-x-auto gap-4 shadow-[0_-5px_20px_rgba(0,0,0,0.3)]">
        <NavButton icon={<Home />} label="Market" active={activeTab === 'market'} onClick={() => setActiveTab('market')} />
        {!isLiteMode && (
          <NavButton icon={<Trophy />} label="Rank" active={activeTab === 'leaderboard'} onClick={() => setActiveTab('leaderboard')} />
        )}
        <NavButton icon={<Calendar />} label="Events" active={activeTab === 'events'} onClick={() => setActiveTab('events')} />
        <NavButton icon={<MessageSquare />} label="Chat" active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
        <NavButton icon={<Megaphone />} label="Hub" active={activeTab === 'enclave'} onClick={() => setActiveTab('enclave')} />
        <NavButton icon={<UserCircle />} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
      </nav>
      
      <ExoBot />
    </div>
  );
};

const NavButton = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all duration-300 relative group ${active ? 'text-teal-400' : 'text-gray-500 hover:text-gray-300'}`}
  >
    {active && (
      <span className="absolute -top-3 w-8 h-1 bg-teal-400 rounded-b-full shadow-[0_0_10px_rgba(45,212,191,0.8)]"></span>
    )}
    <div className={`relative ${active ? 'animate-pulse' : 'group-hover:animate-pulse'}`}>
      {React.cloneElement(icon as React.ReactElement, { className: `w-6 h-6 ${active ? 'drop-shadow-[0_0_5px_rgba(45,212,191,0.5)]' : ''}` })}
    </div>
    <span className="text-[10px] font-bold tracking-wider">{label}</span>
  </button>
);
