import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiOutlineCalendar, HiOutlineUser, HiOutlineTag, HiOutlineArrowLeft, HiOutlineShare } from 'react-icons/hi';
import { useBlogDetail, useBlogs } from '../../hooks/useBlogs';
import PageHeader from '../../components/common/PageHeader';
import BlogCard from '../../components/cards/BlogCard';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';

export default function BlogDetailPage() {
  const { id } = useParams();
  const { blog, loading, error } = useBlogDetail(id);
  const { blogs: relatedBlogs } = useBlogs({ limit: 3 });

  if (loading) {
    return (
      <div className="py-24 max-w-4xl mx-auto px-4">
        <LoadingState message="Loading blog post..." />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="py-24 max-w-4xl mx-auto px-4">
        <ErrorState
          title="Article Not Found"
          message={`The article '${id}' could not be located.`}
        />
        <div className="text-center mt-6">
          <Link to="/blogs" className="text-sm font-bold text-navy-900 hover:underline">
            ← Back to All Blogs
          </Link>
        </div>
      </div>
    );
  }

  const breadcrumbs = [
    { label: "Blogs", href: "/blogs" },
    { label: blog.title }
  ];

  return (
    <div>
      <PageHeader
        badge={blog.category}
        title={blog.title}
        breadcrumbs={breadcrumbs}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Back Link */}
        <Link
          to="/blogs"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-amber-600 transition"
        >
          <HiOutlineArrowLeft className="w-4 h-4" />
          <span>Back to All Blogs</span>
        </Link>

        {/* Featured Image */}
        <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200">
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="w-full max-h-[460px] object-cover"
          />
        </div>

        {/* Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200 text-xs sm:text-sm text-slate-600 font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-900 font-bold">
              <HiOutlineUser className="w-4 h-4 text-amber-600" />
              {blog.author} {blog.authorRole && <span className="font-normal text-slate-500">({blog.authorRole})</span>}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <HiOutlineCalendar className="w-4 h-4" />
              {blog.formattedDate || blog.publishedDate}
            </span>
            <span>•</span>
            <span>{blog.readTime || "5 min read"}</span>
          </div>

          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert("Article link copied!");
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
          >
            <HiOutlineShare className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>

        {/* Excerpt */}
        <div className="p-5 bg-amber-50/70 border-l-4 border-amber-500 rounded-r-2xl text-slate-800 text-base font-semibold leading-relaxed">
          {blog.excerpt}
        </div>

        {/* Article Body */}
        <div className="text-slate-800 text-sm sm:text-base leading-relaxed space-y-6 whitespace-pre-line font-normal">
          {blog.content}
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Topics:</span>
            {blog.tags.map((tag, idx) => (
              <span key={idx} className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-lg">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Related Blogs */}
        <div className="pt-12 border-t border-slate-200 space-y-6">
          <h3 className="text-xl font-bold text-slate-900">Related Articles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedBlogs.filter(b => b.id !== blog.id).slice(0, 3).map((item) => (
              <BlogCard key={item.id} blog={item} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
