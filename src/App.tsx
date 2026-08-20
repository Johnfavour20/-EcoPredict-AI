import React, { useState } from 'react';
import { ActiveView, PlatformTab } from './types';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { WorkflowSection } from './components/WorkflowSection';
import { FeaturesSection } from './components/FeaturesSection';
import { TechStackSection } from './components/TechStackSection';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';
import { LoginView } from './components/LoginView';
import { RegisterView } from './components/RegisterView';
import { ForgotPasswordView } from './components/ForgotPasswordView';
import { CheckEmailView } from './components/CheckEmailView';
import { ResetPasswordView } from './components/ResetPasswordView';
import { PasswordResetSuccessView } from './components/PasswordResetSuccessView';
import { PlatformDashboard } from './components/PlatformDashboard';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('landing');
  const [platformTab, setPlatformTab] = useState<PlatformTab>('dashboard');
  const [userEmail, setUserEmail] = useState<string>('researcher@ecopredict.ai');
  const [resetEmail, setResetEmail] = useState<string>('researcher@ecopredict.ai');

  const navigateToPlatform = (tab: PlatformTab = 'dashboard') => {
    setPlatformTab(tab);
    setActiveView('platform');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExplorePlatform = (tab: PlatformTab = 'dashboard') => {
    setPlatformTab(tab);
    setActiveView('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (email: string) => {
    setUserEmail(email);
    navigateToPlatform(platformTab);
  };

  if (activeView === 'login') {
    return (
      <LoginView
        onBack={() => setActiveView('landing')}
        onSwitchToRegister={() => setActiveView('register')}
        onForgotPassword={() => setActiveView('forgot-password')}
        onSuccess={handleLoginSuccess}
      />
    );
  }

  if (activeView === 'register') {
    return (
      <RegisterView
        onBack={() => setActiveView('landing')}
        onSwitchToLogin={() => setActiveView('login')}
        onSuccess={handleLoginSuccess}
      />
    );
  }

  if (activeView === 'forgot-password') {
    return (
      <ForgotPasswordView
        onBackToLogin={() => setActiveView('login')}
        onBackToHome={() => setActiveView('landing')}
        onSentResetLink={(email) => {
          setResetEmail(email);
          setActiveView('check-email');
        }}
      />
    );
  }

  if (activeView === 'check-email') {
    return (
      <CheckEmailView
        email={resetEmail}
        onBackToLogin={() => setActiveView('login')}
        onBackToHome={() => setActiveView('landing')}
        onOpenResetPasswordLink={() => setActiveView('reset-password')}
      />
    );
  }

  if (activeView === 'reset-password') {
    return (
      <ResetPasswordView
        onBackToLogin={() => setActiveView('login')}
        onBackToHome={() => setActiveView('landing')}
        onResetSuccess={() => setActiveView('password-reset-success')}
      />
    );
  }

  if (activeView === 'password-reset-success') {
    return (
      <PasswordResetSuccessView
        onProceedToLogin={() => setActiveView('login')}
        onBackToHome={() => setActiveView('landing')}
      />
    );
  }

  if (activeView === 'platform') {
    return (
      <PlatformDashboard
        initialTab={platformTab}
        onExitPlatform={() => setActiveView('landing')}
        userEmail={userEmail}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1B1C1A] flex flex-col font-sans selection:bg-[#6E9445]/20 selection:text-[#2E5D3D]">
      {/* Fixed Navigation Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenLogin={() => setActiveView('login')}
      />

      {/* Main Landing Sections */}
      <main className="pt-20 flex-grow space-y-0">
        <HeroSection
          onExplore={() => handleExplorePlatform('dashboard')}
          onLogin={() => setActiveView('login')}
        />

        <AboutSection
          onExplore={() => handleExplorePlatform('visualizations')}
        />

        <WorkflowSection
          onSelectStep={(tab) => handleExplorePlatform(tab)}
        />

        <FeaturesSection
          onSelectTab={(tab) => handleExplorePlatform(tab)}
        />

        <TechStackSection />

        <CTASection
          onLogin={() => setActiveView('login')}
          onExplore={() => handleExplorePlatform('dashboard')}
        />
      </main>

      {/* Footer */}
      <Footer onSelectTab={(tab) => handleExplorePlatform(tab)} />
    </div>
  );
}
