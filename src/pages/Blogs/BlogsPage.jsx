import React, { useState } from 'react';
import { useBlogs } from '../../hooks/useBlogs';
import BlogCard from '../../components/cards/BlogCard';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

export default function BlogsPage() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  const { blogs, loading, error, refetch } = useBlogs({ category, search });

  const categories = ['All', 'Web Development', 'Career Guidance', 'Artificial Intelligence'];

  const breadcrumbs = [
    { label: "Blogs", href: "/blogs" },
    { label: "Technical Articles" }
  ];

  return (
    <div>
      <PageHeader
        badge="STUDENT & FACULTY INSIGHTS"
        title="Technical Blogs &"
        highlight="Articles"
        description="Programming tutorials, technology trends, career guidance, and academic roadmaps curated by BCA faculty and students."
        breadcrumbs={breadcrumbs}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  category === cat
                    ? 'bg-[#0B192C] text-amber-400 shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat === 'All' ? 'All Topics' : cat}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-80">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search tech articles, MERN, AI..."
            />
          </div>
        </div>

        {/* Listing */}
        {loading ? (
          <LoadingState message="Loading blog articles..." count={3} />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : blogs.length === 0 ? (
          <EmptyState
            title="No blogs found"
            message={`No articles match your search '${search || category}'.`}
            actionText="Reset Filter"
            onAction={() => { setSearch(''); setCategory('All'); }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
