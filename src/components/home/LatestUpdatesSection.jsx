import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { useCampusUpdates } from '../../hooks/useCampusUpdates';
import { useBlogs } from '../../hooks/useBlogs';
import CampusUpdateCard from '../cards/CampusUpdateCard';
import BlogCard from '../cards/BlogCard';
import SectionHeading from '../common/SectionHeading';
import LoadingState from '../common/LoadingState';

export default function LatestUpdatesSection() {
  const { updates, loading: loadingUpdates } = useCampusUpdates();
  const { blogs, loading: loadingBlogs } = useBlogs({ limit: 3 });

  // Ensure plenty of items in the marquee set for ultra-smooth loop
  const marqueeItems = updates.length > 0 && updates.length < 4
    ? [...updates, ...updates]
    : updates;

  return (
    <div className="space-y-16 md:space-y-24 py-16 md:py-24 bg-[#F8FAFC] overflow-hidden">
      
      {/* 1. Latest Campus Updates - Continuous Smooth Horizontal Marquee */}
      <section className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <SectionHeading
            badge="CAMPUS HAPPENINGS"
            badgeVariant="blue"
            title="Latest Campus Updates"
            subtitle="Achievements, laboratory upgrades, workshops, hackathons, and placement milestones from our department."
            align="between"
            action={
              <Link
                to="/campus-updates"
                className="text-xs sm:text-sm font-bold text-navy-900 hover:text-amber-600 inline-flex items-center gap-1.5 transition"
              >
                <span>View All Campus Updates</span>
                <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
            }
          />
        </div>

        {loadingUpdates ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <LoadingState message="Loading latest campus stories..." count={3} />
          </div>
        ) : updates.length === 0 ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 py-8">
            No campus updates found.
          </div>
        ) : (
          /* Continuous Horizontal Marquee Container */
          <div className="relative overflow-hidden w-full group py-2">
            {/* Left & Right Soft Fade Masks */}
            <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 md:w-24 bg-gradient-to-r from-[#F8FAFC] via-[#F8FAFC]/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 md:w-24 bg-gradient-to-l from-[#F8FAFC] via-[#F8FAFC]/80 to-transparent z-10 pointer-events-none" />

            {/* Scrolling Track */}
            <div className="flex gap-6 animate-marquee w-max group-hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
              {/* Set 1 */}
              <div className="flex gap-6 flex-shrink-0">
                {marqueeItems.map((update, idx) => (
                  <div
                    key={`track1-${update.id}-${idx}`}
                    className="w-[280px] sm:w-[330px] md:w-[360px] flex-shrink-0"
                  >
                    <CampusUpdateCard update={update} />
                  </div>
                ))}
              </div>

              {/* Set 2 (Identical duplicate for seamless, jump-free loop) */}
              <div className="flex gap-6 flex-shrink-0" aria-hidden="true">
                {marqueeItems.map((update, idx) => (
                  <div
                    key={`track2-${update.id}-${idx}`}
                    className="w-[280px] sm:w-[330px] md:w-[360px] flex-shrink-0"
                  >
                    <CampusUpdateCard update={update} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. Latest Blogs & Technical Articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="KNOWLEDGE HUB"
          badgeVariant="gold"
          title="Latest Technical Blogs"
          subtitle="Insightful guides, roadmaps, and programming articles penned by our faculty members and student leaders."
          align="between"
          action={
            <Link
              to="/blogs"
              className="text-xs sm:text-sm font-bold text-navy-900 hover:text-amber-600 inline-flex items-center gap-1.5 transition"
            >
              <span>Explore All Blogs</span>
              <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          }
        />

        {loadingBlogs ? (
          <LoadingState message="Loading articles..." count={3} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}

