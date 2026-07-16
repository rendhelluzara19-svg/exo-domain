import React from 'react';
import { User } from '@/types';

interface ProfileAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ user, size = 'md', className = '', onClick }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl'
  };

  const getOverlayFrame = () => {
    switch (user.plan) {
      case 'STARTER':
        return (
          <svg viewBox="0 0 100 100" className="absolute -inset-[20%] w-[140%] h-[140%] z-20 pointer-events-none overflow-visible">
            <defs>
              <linearGradient id="starterGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff4d4d" />
                <stop offset="50%" stopColor="#8b0000" />
                <stop offset="100%" stopColor="#3d0000" />
              </linearGradient>
              <linearGradient id="starterSteel" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#5a0000" />
                <stop offset="40%" stopColor="#ff4d4d" />
                <stop offset="60%" stopColor="#ff9999" />
                <stop offset="100%" stopColor="#8b0000" />
              </linearGradient>
              <filter id="starterShadow" x="-25%" y="-25%" width="150%" height="150%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#ff4d4d" floodOpacity="0.75"/>
              </filter>
            </defs>
            
            {/* 4 Cardinal Spikes - Burnished Red Steel */}
            {/* Top Spike */}
            <path d="M50,1 L45,15 L48,17 L50,8 L52,17 L55,15 Z" fill="url(#starterSteel)" stroke="#2b0000" strokeWidth="0.75" filter="url(#starterShadow)" />
            {/* Bottom Spike */}
            <path d="M50,99 L45,85 L48,83 L50,92 L52,83 L55,85 Z" fill="url(#starterSteel)" stroke="#2b0000" strokeWidth="0.75" filter="url(#starterShadow)" />
            {/* Left Spike */}
            <path d="M1,50 L15,45 L17,48 L8,50 L17,52 L15,55 Z" fill="url(#starterSteel)" stroke="#2b0000" strokeWidth="0.75" filter="url(#starterShadow)" />
            {/* Right Spike */}
            <path d="M99,50 L85,45 L83,48 L92,50 L83,52 L85,55 Z" fill="url(#starterSteel)" stroke="#2b0000" strokeWidth="0.75" filter="url(#starterShadow)" />

            {/* Subtle Diagonal Accents */}
            <path d="M21,21 L27,27 L25,29 L19,23 Z" fill="#8b0000" opacity="0.85" />
            <path d="M79,21 L73,27 L75,29 L81,23 Z" fill="#8b0000" opacity="0.85" />
            <path d="M21,79 L27,73 L25,71 L19,77 Z" fill="#8b0000" opacity="0.85" />
            <path d="M79,79 L73,73 L75,71 L81,77 Z" fill="#8b0000" opacity="0.85" />

            {/* Burnished Red Steel Circular Ring */}
            <circle cx="50" cy="50" r="37.5" fill="none" stroke="url(#starterGlow)" strokeWidth="4.5" />
            <circle cx="50" cy="50" r="35.5" fill="none" stroke="url(#starterSteel)" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="39.5" fill="none" stroke="#1a0000" strokeWidth="0.75" />
          </svg>
        );
      case 'PRO':
        return (
          <svg viewBox="0 0 100 100" className="absolute -inset-[20%] w-[140%] h-[140%] z-20 pointer-events-none overflow-visible">
            <defs>
              <linearGradient id="proBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00d2ff" />
                <stop offset="50%" stopColor="#005bea" />
                <stop offset="100%" stopColor="#001a66" />
              </linearGradient>
              <linearGradient id="proSilver" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8a9db8" />
                <stop offset="35%" stopColor="#ffffff" />
                <stop offset="65%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
              <radialGradient id="proGem" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#00f2ff" />
                <stop offset="80%" stopColor="#005bea" />
                <stop offset="100%" stopColor="#001133" />
              </radialGradient>
              <filter id="proGlow" x="-25%" y="-25%" width="150%" height="150%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#00d2ff" floodOpacity="0.75"/>
              </filter>
            </defs>

            {/* Outer Circular Frame with Chrome Silver finish */}
            <circle cx="50" cy="50" r="41.5" fill="none" stroke="url(#proSilver)" strokeWidth="2" filter="url(#proGlow)" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="url(#proBlue)" strokeWidth="3" />
            <circle cx="50" cy="50" r="35.5" fill="none" stroke="url(#proSilver)" strokeWidth="1" />

            {/* Embedded Blue Gem Nodes at 12, 3, 6, 9 o'clock */}
            {/* 12 o'clock node */}
            <circle cx="50" cy="11.5" r="5" fill="url(#proSilver)" stroke="#1e293b" strokeWidth="0.75" />
            <circle cx="50" cy="11.5" r="3" fill="url(#proGem)" />

            {/* 6 o'clock node */}
            <circle cx="50" cy="88.5" r="5" fill="url(#proSilver)" stroke="#1e293b" strokeWidth="0.75" />
            <circle cx="50" cy="88.5" r="3" fill="url(#proGem)" />

            {/* 3 o'clock node */}
            <circle cx="88.5" cy="50" r="5" fill="url(#proSilver)" stroke="#1e293b" strokeWidth="0.75" />
            <circle cx="88.5" cy="50" r="3" fill="url(#proGem)" />

            {/* 9 o'clock node */}
            <circle cx="11.5" cy="50" r="5" fill="url(#proSilver)" stroke="#1e293b" strokeWidth="0.75" />
            <circle cx="11.5" cy="50" r="3" fill="url(#proGem)" />

            {/* Micro Chrome details */}
            <path d="M23,23 L19,19 L25,19 Z" fill="url(#proSilver)" />
            <path d="M77,23 L81,19 L75,19 Z" fill="url(#proSilver)" />
            <path d="M23,77 L19,81 L25,81 Z" fill="url(#proSilver)" />
            <path d="M77,77 L81,81 L75,81 Z" fill="url(#proSilver)" />
          </svg>
        );
      case 'ELITE':
        return (
          <svg viewBox="0 0 100 100" className="absolute -inset-[22%] w-[144%] h-[144%] z-20 pointer-events-none overflow-visible">
            <defs>
              <linearGradient id="eliteGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffe680" />
                <stop offset="35%" stopColor="#f5b041" />
                <stop offset="65%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#805d00" />
              </linearGradient>
              <linearGradient id="eliteGoldBright" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a67c00" />
                <stop offset="50%" stopColor="#fff2cc" />
                <stop offset="100%" stopColor="#e6b800" />
              </linearGradient>
              <radialGradient id="eliteGemViolet" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="25%" stopColor="#e8daff" />
                <stop offset="70%" stopColor="#9b59b6" />
                <stop offset="100%" stopColor="#3d144d" />
              </radialGradient>
              <filter id="eliteAura" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#8e44ad" floodOpacity="0.9"/>
                <feDropShadow dx="0" dy="1" stdDeviation="2.5" floodColor="#f1c40f" floodOpacity="0.75"/>
              </filter>
            </defs>

            {/* Intricate Gold Sun-burst / Spiked Structure with violet energy aura */}
            <g filter="url(#eliteAura)">
              {/* Corner Gold Spikes */}
              <path d="M20,20 L11,11 L23,17 Z" fill="url(#eliteGold)" stroke="#4d3b00" strokeWidth="0.5" />
              <path d="M80,20 L89,11 L77,17 Z" fill="url(#eliteGold)" stroke="#4d3b00" strokeWidth="0.5" />
              <path d="M20,80 L11,89 L23,83 Z" fill="url(#eliteGold)" stroke="#4d3b00" strokeWidth="0.5" />
              <path d="M80,80 L89,89 L77,83 Z" fill="url(#eliteGold)" stroke="#4d3b00" strokeWidth="0.5" />
              
              {/* Cardinal Sharp Spikes */}
              <path d="M50,1 L45,15 L55,15 Z" fill="url(#eliteGoldBright)" stroke="#4d3b00" strokeWidth="0.5" />
              <path d="M50,99 L45,85 L55,85 Z" fill="url(#eliteGoldBright)" stroke="#4d3b00" strokeWidth="0.5" />
              <path d="M1,50 L15,45 L15,55 Z" fill="url(#eliteGoldBright)" stroke="#4d3b00" strokeWidth="0.5" />
              <path d="M99,50 L85,45 L85,55 Z" fill="url(#eliteGoldBright)" stroke="#4d3b00" strokeWidth="0.5" />

              {/* Sun-burst Flame Spokes */}
              <path d="M31,14 L34,5 L37,14 Z" fill="url(#eliteGold)" />
              <path d="M69,14 L66,5 L63,14 Z" fill="url(#eliteGold)" />
              <path d="M14,31 L5,34 L14,37 Z" fill="url(#eliteGold)" />
              <path d="M14,69 L5,66 L14,63 Z" fill="url(#eliteGold)" />
              <path d="M86,31 L95,34 L86,37 Z" fill="url(#eliteGold)" />
              <path d="M86,69 L95,66 L86,63 Z" fill="url(#eliteGold)" />

              {/* Solid Gold Circular Structure */}
              <circle cx="50" cy="50" r="41" fill="none" stroke="url(#eliteGold)" strokeWidth="3" />
              <circle cx="50" cy="50" r="37" fill="none" stroke="url(#eliteGoldBright)" strokeWidth="1.5" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="#2b0d38" strokeWidth="1" />
            </g>

            {/* FLOATING BOTTOM WING ORNAMENT */}
            <g className="elite-wing-float" filter="url(#eliteAura)">
              {/* Majestic Wings wrapping the bottom of the circle */}
              <path d="M50,85 C39,85 29,91 23,98 C33,94 44,91 50,91 C56,91 67,94 77,98 C71,91 61,85 50,85 Z" fill="url(#eliteGoldBright)" stroke="#4d3b00" strokeWidth="0.5" />
              <path d="M50,87 C42,87 34,92 29,96 C36,94 43,92 50,92 C57,92 64,94 71,96 C66,92 58,87 50,87 Z" fill="#fff5cc" />
              <polygon points="50,81 44,87 50,93 56,87" fill="url(#eliteGold)" stroke="#4d3b00" strokeWidth="0.5" />
              <circle cx="50" cy="87" r="2.5" fill="url(#eliteGemViolet)" className="gem-glow-pulse" />
            </g>

            {/* Glowing Violet Gems on Nodes */}
            <g className="gem-glow-pulse">
              {/* Top Gem */}
              <circle cx="50" cy="15" r="4.5" fill="url(#eliteGold)" stroke="#4d3b00" strokeWidth="0.5" />
              <circle cx="50" cy="15" r="3" fill="url(#eliteGemViolet)" />

              {/* Left Gem */}
              <circle cx="15" cy="50" r="4.5" fill="url(#eliteGold)" stroke="#4d3b00" strokeWidth="0.5" />
              <circle cx="15" cy="50" r="3" fill="url(#eliteGemViolet)" />

              {/* Right Gem */}
              <circle cx="85" cy="50" r="4.5" fill="url(#eliteGold)" stroke="#4d3b00" strokeWidth="0.5" />
              <circle cx="85" cy="50" r="3" fill="url(#eliteGemViolet)" />
            </g>
          </svg>
        );
      default:
        return null;
    }
  };

  const hasSpecialFrame = ['STARTER', 'PRO', 'ELITE'].includes(user.plan);

  return (
    <div 
      className={`relative inline-flex items-center justify-center ${className} ${onClick ? 'cursor-pointer group' : ''}`}
      onClick={onClick}
    >
      <style>{`
        @keyframes geckoSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Animated Gecko Companion wrapping the avatar */}
      <div className="absolute inset-0 z-30 pointer-events-none rounded-full animate-[geckoSpin_15s_linear_infinite]">
        {/* Little crawling gecko element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rotate-90 select-none pointer-events-none filter drop-shadow-[0_0_3px_#10b981]">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-emerald-400 text-emerald-400">
            {/* Lizard / Gecko high-contrast path */}
            <path d="M12 2c-.6 0-1 .4-1 1v2.1c-1.5-.1-3 1.1-3 2.9 0 .8.4 1.5 1 2V12c-1.2.4-2 1.4-2 2.7 0 1.2.7 2.2 1.7 2.6L7.3 19c-.4.4-.4 1 0 1.4.4.4 1 .4 1.4 0l1.4-1.4c.6.4 1.2.6 1.9.6s1.3-.2 1.9-.6l1.4 1.4c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4l-1.4-1.7c1-.4 1.7-1.4 1.7-2.6 0-1.3-.8-2.3-2-2.7V10c.6-.5 1-1.2 1-2 0-1.8-1.5-3-3-2.9V3c0-.6-.4-1-1-1zm0 5c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm-3 7c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm6 0c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z" />
          </svg>
        </div>
      </div>

      {/* Background Violet Energy Aura glow for Elite underlay */}
      {user.plan === 'ELITE' && (
        <div className="absolute inset-[-15%] rounded-full bg-purple-600/20 blur-md animate-pulse z-0"></div>
      )}

      {/* Render RPG Frame Overlay */}
      {getOverlayFrame()}

      {/* Avatar Image Circle Container */}
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex items-center justify-center relative z-10 bg-gray-950 ${
        !hasSpecialFrame ? 'border-2 border-gray-700 shadow-sm' : 'border border-gray-900 shadow-inner'
      }`}>
        {user.avatar ? (
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center text-teal-400 font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Hover action overlay indicator */}
      {onClick && (
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity z-30 pointer-events-none"></div>
      )}
    </div>
  );
};
