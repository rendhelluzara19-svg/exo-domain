import React, { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Sparkles, Zap, Shield, HelpCircle } from 'lucide-react';

export const PerformanceManager: React.FC = () => {
  const { currentUser, isLiteMode, performanceMode, deviceType } = useApp();

  useEffect(() => {
    // Print performance status in the system terminal
    if (currentUser) {
      console.log(
        `[PerformanceManager] Active Mode: ${isLiteMode ? 'LITE (Optimized)' : 'FULL (Suite)'} | Device: ${deviceType.toUpperCase()} | Role: ${currentUser.role}`
      );
    }
  }, [currentUser, isLiteMode, performanceMode, deviceType]);

  if (!currentUser) return null;

  return (
    <div id="performance-manager-status" className="hidden">
      {/* Headless metadata tracking or standard visual verification marker */}
      <span data-performance-mode={isLiteMode ? 'lite' : 'full'} data-device-type={deviceType} />
    </div>
  );
};
