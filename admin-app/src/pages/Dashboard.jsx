import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorAlert from '../components/common/ErrorAlert';
import Badge from '../components/common/Badge';
import {
  HiOutlineUserGroup,
  HiOutlineAcademicCap,
  HiOutlineDocumentDuplicate,
  HiOutlineBookOpen,
  HiOutlinePhoto,
  HiOutlineSparkles,
  HiOutlineBell,
  HiPlus,
  HiArrowRight,
  HiOutlineCalendar,
  HiOutlineEye,
  HiOutlineArrowDownTray,
} from 'react-icons/hi2';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await dashboardService.getStats();
      setStats(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Fetching college database overview..." />;
  }

  const counts = stats?.counts || stats || {};
  const recent = stats?.recent || {};

  const CARDS = [
    {
      title: 'Total Faculty',
      count: counts.faculty ?? 0,
      icon: HiOutlineUserGroup,
      path: '/faculty',
      color: 'from-gold-500/15 to-gold-500/5 text-gold-400 border-gold-500/20',
      textColor: 'text-gold-400',
    },
    {
      title: 'Total Academics',
      count: counts.academics ?? 1,
      icon: HiOutlineAcademicCap,
      path: '/academics',
      color: 'from-gold-500/15 to-gold-500/5 text-gold-400 border-gold-500/20',
      textColor: 'text-gold-400',
    },
    {
      title: 'Question Bank (PYQ)',
      count: counts.pyqs ?? 0,
      icon: HiOutlineDocumentDuplicate,
      path: '/pyqs',
      color: 'from-gold-500/15 to-gold-500/5 text-gold-400 border-gold-500/20',
      textColor: 'text-emerald-400',
    },
    {
      title: 'Blogs & Articles',
      count: counts.blogs ?? 0,
      icon: HiOutlineBookOpen,
      path: '/blogs',
      color: 'from-gold-500/15 to-gold-500/5 text-gold-400 border-gold-500/20',
      textColor: 'text-purple-400',
    },
    {
      title: 'Gallery Photos',
      count: counts.gallery ?? 0,
      icon: HiOutlinePhoto,
      path: '/gallery',
      color: 'from-gold-500/15 to-gold-500/5 text-gold-400 border-gold-500/20',
      textColor: 'text-pink-400',
    },
    {
      title: 'Campus Updates',
      count: counts.campusUpdates ?? 0,
      icon: HiOutlineSparkles,
      path: '/campus-updates',
      color: 'from-gold-500/15 to-gold-500/5 text-gold-400 border-gold-500/20',
      textColor: 'text-amber-400',
    },
    {
      title: 'Notices & Circulars',
      count: counts.notices ?? 0,
      icon: HiOutlineBell,
      path: '/notices',
      color: 'from-gold-500/15 to-gold-500/5 text-gold-400 border-gold-500/20',
      textColor: 'text-rose-400',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-navy-900/60 via-navy-900/45 to-slate-900 border border-gold-500/20 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
              College Administration Console
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Welcome back. Manage real-time academic curricula, faculty rosters, previous year
              question papers, campus news, and university notices.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/notices"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-semibold shadow-lg shadow-navy-900/40 transition-all active:scale-95"
            >
              <HiPlus className="text-sm" />
              <span>Post Notice</span>
            </Link>
            <Link
              to="/faculty"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl text-xs font-semibold transition-all"
            >
              <HiPlus className="text-sm" />
              <span>Add Faculty</span>
            </Link>
          </div>
        </div>
      </div>

      <ErrorAlert message={error} onRetry={fetchStats} />

      {/* Overview Stat Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white tracking-wide">
            Database Overview
          </h2>
          <span className="text-xs text-slate-400">Synchronized with MongoDB</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                to={card.path}
                className="group relative p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 overflow-hidden flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      {card.title}
                    </p>
                    <p className="text-3xl font-extrabold text-white mt-2 tracking-tight">
                      {card.count}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br border flex items-center justify-center text-xl shrink-0 transition-transform group-hover:scale-110 ${card.color}`}
                  >
                    <Icon />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-gold-400 transition-colors">
                  <span>Manage records</span>
                  <HiArrowRight className="transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity & Quick Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notices */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <HiOutlineBell className="text-gold-400 text-lg" />
                <h3 className="text-sm font-bold text-white">Recent Notices</h3>
              </div>
              <Link
                to="/notices"
                className="text-xs font-semibold text-gold-400 hover:text-gold-500 flex items-center gap-1"
              >
                <span>View all</span>
                <HiArrowRight className="text-xs" />
              </Link>
            </div>

            <div className="divide-y divide-slate-800/60 mt-1">
              {recent.notices && recent.notices.length > 0 ? (
                recent.notices.map((n) => (
                  <div key={n._id} className="py-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate hover:text-gold-400 transition-colors">
                        {n.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                        <span className="text-slate-300 font-medium">{n.category}</span>
                        <span>•</span>
                        <span>
                          {n.date ? new Date(n.date).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                    </div>
                    <Badge variant={n.status || 'published'} size="xs">
                      {n.status || 'published'}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-xs text-slate-300">
                  No notices published yet.
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-right">
            <Link
              to="/notices"
              className="text-xs font-semibold text-slate-400 hover:text-white"
            >
              + Create New Notice
            </Link>
          </div>
        </div>

        {/* Recent Campus Updates */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <HiOutlineSparkles className="text-gold-400 text-lg" />
                <h3 className="text-sm font-bold text-white">Recent Campus Updates</h3>
              </div>
              <Link
                to="/campus-updates"
                className="text-xs font-semibold text-gold-400 hover:text-gold-500 flex items-center gap-1"
              >
                <span>View all</span>
                <HiArrowRight className="text-xs" />
              </Link>
            </div>

            <div className="divide-y divide-slate-800/60 mt-1">
              {recent.campusUpdates && recent.campusUpdates.length > 0 ? (
                recent.campusUpdates.map((u) => (
                  <div key={u._id} className="py-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate hover:text-gold-400 transition-colors">
                        {u.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                        <span className="text-slate-300 font-medium">{u.category}</span>
                        <span>•</span>
                        <span>
                          {u.date ? new Date(u.date).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                    </div>
                    <Badge variant={u.status || 'published'} size="xs">
                      {u.status || 'published'}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-xs text-slate-300">
                  No campus updates posted yet.
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-right">
            <Link
              to="/campus-updates"
              className="text-xs font-semibold text-slate-400 hover:text-white"
            >
              + Post Campus Update
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Blogs & Question Papers summary row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Blogs */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <HiOutlineBookOpen className="text-gold-400 text-lg" />
              <h3 className="text-sm font-bold text-white">Recent Technical Blogs</h3>
            </div>
            <Link
              to="/blogs"
              className="text-xs font-semibold text-gold-400 hover:text-gold-500 flex items-center gap-1"
            >
              <span>View all</span>
              <HiArrowRight className="text-xs" />
            </Link>
          </div>

          <div className="divide-y divide-slate-800/60 mt-1">
            {recent.blogs && recent.blogs.length > 0 ? (
              recent.blogs.map((b) => (
                <div key={b._id} className="py-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate hover:text-gold-400 transition-colors">
                      {b.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">By {b.author}</p>
                  </div>
                  <Badge variant={b.status || 'published'} size="xs">
                    {b.status || 'published'}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-xs text-slate-300">
                No blog articles published yet.
              </p>
            )}
          </div>
        </div>

        {/* Recent Question Papers */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <HiOutlineDocumentDuplicate className="text-gold-400 text-lg" />
              <h3 className="text-sm font-bold text-white">Recent PYQs Uploaded</h3>
            </div>
            <Link
              to="/pyqs"
              className="text-xs font-semibold text-gold-400 hover:text-gold-500 flex items-center gap-1"
            >
              <span>View all</span>
              <HiArrowRight className="text-xs" />
            </Link>
          </div>

          <div className="divide-y divide-slate-800/60 mt-1">
            {recent.pyqs && recent.pyqs.length > 0 ? (
              recent.pyqs.map((p) => (
                <div key={p._id} className="py-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate hover:text-gold-400 transition-colors">
                      {p.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {p.subject} • {p.year}
                    </p>
                  </div>
                  <Badge variant={p.status || 'published'} size="xs">
                    {p.status || 'published'}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-xs text-slate-300">
                No question papers uploaded yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
