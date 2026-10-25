import React from 'react';
import HeroSection from '../components/home/HeroSection';
import TickerBar from '../components/home/TickerBar';
import CoordinatorMessage from '../components/home/CoordinatorMessage';
import NoticeBoard from '../components/home/NoticeBoard';
import WelcomeAbout from '../components/home/WelcomeAbout';
import TechnicalBlogsSection from '../components/home/TechnicalBlogsSection';
import QuickPYQsSection from '../components/home/QuickPYQsSection';

export default function HomePage() {
  return (
    <div>
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Latest Updates Ticker */}
      <TickerBar />

      {/* 3. Important Notice Board */}
      <NoticeBoard />

      {/* 4. Message from the Coordinator */}
      <CoordinatorMessage />

      {/* 5. About Department Section */}
      <WelcomeAbout />

      {/* 6. Technical Blogs & Articles */}
      <TechnicalBlogsSection />

      {/* 7. Previous Year Papers & Question Bank Hub */}
      <QuickPYQsSection />
    </div>
  );
}
