import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineCalendar, HiOutlineUser, HiOutlineArrowRight, HiOutlineBookOpen } from 'react-icons/hi';

export default function BlogCard({ blog }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!blog) return null;

  const blogPath = blog.slug || blog.id || blog._id;
  const publishedDate = blog.formattedDate || blog.publishedAt || blog.publishedDate || blog.createdAt;
  const formattedDate = publishedDate
    ? (Number.isNaN(new Date(publishedDate).getTime())
      ? publishedDate
      : new Date(publishedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }))
    : 'Date unavailable';
  const hasImage = Boolean(blog.featuredImage) && !imageFailed;

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 hover:border-gold-500 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Blog Featured Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
          {hasImage ? (
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#233B5D] to-slate-800 text-gold-400">
              <HiOutlineBookOpen className="h-10 w-10" aria-hidden="true" />
              <span className="text-xs font-semibold tracking-wide text-white/80">Technical Article</span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-navy-950/80 backdrop-blur-md text-gold-400 border border-gold-400/30">
              {blog.category || 'General'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center gap-3 text-xs text-muted mb-2.5">
            <span className="flex items-center gap-1 font-medium text-slate-600">
              <HiOutlineUser className="w-3.5 h-3.5 text-gold-500" />
              {blog.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <HiOutlineCalendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
          </div>

          <h3 className="text-lg font-bold text-navy-900 group-hover:text-navy-800 transition-colors line-clamp-2 leading-snug">
            <Link to={`/blogs/${blogPath}`}>
              {blog.title}
            </Link>
          </h3>

          <p className="mt-2.5 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {blog.excerpt}
          </p>
        </div>
      </div>

      <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
        <span className="text-[11px] font-medium text-muted">{blog.readTime || "4 min read"}</span>
        <Link
          to={`/blogs/${blogPath}`}
          className="text-xs font-bold text-navy-800 group-hover:text-navy-900 inline-flex items-center gap-1 transition-colors"
        >
          <span>Read More</span>
          <HiOutlineArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
}
