import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { useBlogs } from '../../hooks/useBlogs';
import BlogCard from '../cards/BlogCard';
import SectionHeading from '../common/SectionHeading';
import LoadingState from '../common/LoadingState';
import ErrorState from '../common/ErrorState';

export default function TechnicalBlogsSection() {
  const { blogs, loading, error, refetch } = useBlogs({ limit: 3 });

  return (
    <section className="py-16 md:py-24 bg-[#F7F6F2] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="KNOWLEDGE HUB"
          badgeVariant="gold"
          title="Technical Blogs &"
          titleHighlight="Articles"
          subtitle="Explore practical tutorials, technology insights, and career guidance from our faculty and students."
          align="between"
          action={
            <Link
              to="/blogs"
              className="text-xs sm:text-sm font-bold text-navy-900 hover:text-amber-600 inline-flex items-center gap-1.5 transition"
            >
              <span>Explore All Articles</span>
              <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          }
        />

        {loading ? (
          <LoadingState message="Loading articles..." count={3} />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : blogs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 px-6 py-12 text-center">
            <h3 className="text-lg font-bold text-navy-900">No articles published yet</h3>
            <p className="mt-2 text-sm text-slate-600">
              Please check back soon for technical blogs and articles.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard key={blog.id || blog._id || blog.slug} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
