import React from 'react';
import { BottomNavigation } from './BottomNavigation';

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileLayout({ children, className = '' }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-background max-w-mobile mx-auto relative">
      <main className={`pb-20 ${className}`}>
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}