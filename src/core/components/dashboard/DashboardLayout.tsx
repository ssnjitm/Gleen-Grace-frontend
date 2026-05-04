import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import type { FeatureCardData } from '../../types/dashboard.types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  features: FeatureCardData[];
  onNavigate: (path: string) => void;
  onLogout: () => void;
  isLoggingOut: boolean;
  userName: string;
  userInitial: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  features,
  onNavigate,
  onLogout,
  isLoggingOut,
  userName,
  userInitial,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        features={features}
        onNavigate={onNavigate}
        onLogout={onLogout}
        isLoggingOut={isLoggingOut}
      />

      <main className="lg:ml-64 min-h-screen">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          userName={userName}
          userInitial={userInitial}
        />
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};