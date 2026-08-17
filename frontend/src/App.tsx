import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PropertyProvider, useProperty } from './context/PropertyContext';
import { IntroSplash } from './components/IntroSplash';
import { LoginView } from './components/LoginView';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { PropertiesListView } from './components/PropertiesListView';
import { PropertyDetailView } from './components/PropertyDetailView';
import { StaffSettingsView } from './components/StaffSettingsView';
import { AddEditPropertyModal } from './components/AddEditPropertyModal';
import { RecordPaymentModal } from './components/RecordPaymentModal';
import { ReceiptModal } from './components/ReceiptModal';
import { SpotlightTour } from './components/SpotlightTour';
import { ProjectGuidelineModal } from './components/ProjectGuidelineModal';
import { ToastContainer } from './components/ToastContainer';

const MainAppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { currentView } = useProperty();
  const [hasCompletedIntro, setHasCompletedIntro] = useState<boolean>(() => {
    return sessionStorage.getItem('ntc_splash_shown') === 'true';
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleCompleteIntro = () => {
    setHasCompletedIntro(true);
    sessionStorage.setItem('ntc_splash_shown', 'true');
  };

  // Show branded splash screen on initial startup
  if (!hasCompletedIntro) {
    return <IntroSplash onComplete={handleCompleteIntro} />;
  }

  // If not authenticated, show the login portal / role switcher
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-[#070A0F] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 overflow-y-auto">
        <LoginView />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#F4F6F9] dark:bg-[#070A0F] text-slate-900 dark:text-slate-100 font-sans flex flex-col antialiased selection:bg-amber-500/30 selection:text-amber-800 dark:selection:text-amber-200 transition-colors duration-200">
      {/* Top Header - Fixed at Top */}
      <Header
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      {/* Main Layout Container - Independent Viewport Split */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop & Mobile Fixed Independent Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          mobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Page Content Canvas - Independent Scroll */}
        <main
          id="main-content-canvas"
          className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 overscroll-contain focus:outline-none"
          tabIndex={-1}
        >
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'properties' && <PropertiesListView />}
          {currentView === 'detail' && <PropertyDetailView />}
          {currentView === 'staff' && <StaffSettingsView />}
          {currentView === 'forecasting' && <DashboardView />}
          {currentView === 'guide' && <DashboardView />}
        </main>
      </div>

      {/* Modals & Overlays */}
      <AddEditPropertyModal />
      <RecordPaymentModal />
      <ReceiptModal />
      <SpotlightTour />
      <ProjectGuidelineModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <PropertyProvider>
        <MainAppContent />
      </PropertyProvider>
    </AuthProvider>
  );
}

