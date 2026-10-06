import React from 'react';
import HeroSection from '../components/home/HeroSection';
import TickerBar from '../components/home/TickerBar';
import NoticeBoard from '../components/home/NoticeBoard';
import WelcomeAbout from '../components/home/WelcomeAbout';
import VisionMission from '../components/home/VisionMission';
import CoordinatorMessage from '../components/home/CoordinatorMessage';
import QuickPYQsSection from '../components/home/QuickPYQsSection';
import LatestUpdatesSection from '../components/home/LatestUpdatesSection';

export default function HomePage() {
  return (
    <div>
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Latest Updates Ticker */}
      <TickerBar />

      {/* 3. Important Notice Board */}
      <NoticeBoard />

      {/* 4. About Department Section */}
      <WelcomeAbout />

      {/* 5. Vision & Mission Section */}
      <VisionMission />

      {/* 6. Message from the Coordinator */}
      <CoordinatorMessage />

      {/* 7. Previous Year Papers & Question Bank Hub */}
      <QuickPYQsSection />

      {/* 8. Latest Campus Updates & Blogs */}
      <LatestUpdatesSection />
    </div>
  );
}
