import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { pageService } from '../../services/pageService';
import PageHeader from '../../components/common/PageHeader';
import LoadingState from '../../components/common/LoadingState';
import {
  HiOutlineHome,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineArrowLeft,
  HiOutlineShare,
  HiOutlineDocumentText,
} from 'react-icons/hi2';

export default function DynamicPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadPage() {
      try {
        setLoading(true);
        setError(null);
        const res = await pageService.getBySlug(slug);
        if (isMounted) {
          setPage(res.data);
          if (res.data?.seoTitle || res.data?.title) {
            document.title = `${res.data.seoTitle || res.data.title} | T.P. College BCA`;
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Page not found or unavailable.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (slug) loadPage();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="py-20 max-w-5xl mx-auto px-4">
        <LoadingState message="Loading dynamic page content..." />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-20 px-4 bg-[#F7F6F2]">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[var(--college-logo-red)]/10 border border-amber-500/30 text-amber-600 text-3xl font-black">
            404
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Page Not Found or Restricted
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              The page <code className="px-1.5 py-0.5 bg-slate-200 rounded font-mono text-xs">/pages/{slug}</code> is either in draft mode, has been relocated, or does not exist.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/"
              className="px-5 py-2.5 rounded-xl bg-[#233B5D] hover:bg-slate-900 text-white font-bold text-xs inline-flex items-center gap-2 shadow"
            >
              <HiOutlineHome className="text-sm" />
              <span>Return Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Sanitize content with DOMPurify to prevent XSS attacks
  const sanitizedContent = DOMPurify.sanitize(page.content || '', {
    ADD_ATTR: ['target', 'rel'],
  });

  const breadcrumbs = [
    { label: 'Pages', href: '/' },
    { label: page.title },
  ];

  return (
    <div className="bg-[#FAF9F5] min-h-screen pb-20">
      <PageHeader
        title={page.title}
        description={page.description || 'Official communication and guidelines from T.P. College BCA Department.'}
        breadcrumbs={breadcrumbs}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 text-xs text-slate-500">
          <div className="flex items-center gap-4 flex-wrap">
            {page.publishedAt && (
              <span className="flex items-center gap-1.5 font-medium">
                <HiOutlineCalendar className="text-amber-600 text-sm" />
                <span>Published on {new Date(page.publishedAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}</span>
              </span>
            )}
            <span className="flex items-center gap-1.5 font-medium">
              <HiOutlineUser className="text-amber-600 text-sm" />
              <span>By {page.authorName || 'Administrator'}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-semibold"
            >
              <HiOutlineArrowLeft className="text-xs" />
              <span>Back</span>
            </Link>
          </div>
        </div>

        {/* Featured Hero Image */}
        {page.featuredImage && (
          <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200 aspect-video max-h-[420px] bg-slate-950">
            <img
              src={page.featuredImage}
              alt={page.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Safe Rendered WYSIWYG Content */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80">
          <div
            className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-sm sm:text-base space-y-4
              [&_h1]:text-2xl [&_h1]:font-black [&_h1]:text-[#233B5D] [&_h1]:mt-6 [&_h1]:mb-3
              [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#233B5D] [&_h2]:mt-5 [&_h2]:mb-2
              [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:mt-4 [&_h3]:mb-2
              [&_p]:leading-relaxed [&_p]:mb-3
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_ul]:my-3
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1.5 [&_ol]:my-3
              [&_blockquote]:border-l-4 [&_blockquote]:border-amber-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_blockquote]:bg-[var(--college-logo-red)]/5 [&_blockquote]:py-2 [&_blockquote]:rounded-r-xl
              [&_table]:w-full [&_table]:border-collapse [&_table]:my-6 [&_table]:border [&_table]:border-slate-200 [&_table]:rounded-xl [&_table]:overflow-hidden
              [&_th]:bg-slate-100 [&_th]:border [&_th]:border-slate-200 [&_th]:p-3 [&_th]:text-left [&_th]:font-bold [&_th]:text-xs [&_th]:text-[#233B5D]
              [&_td]:border [&_td]:border-slate-200 [&_td]:p-3 [&_td]:text-xs [&_td]:text-slate-700
              [&_img]:rounded-2xl [&_img]:shadow-md [&_img]:my-6 [&_img]:border [&_img]:border-slate-100
              [&_a]:text-amber-600 [&_a]:underline hover:[&_a]:text-amber-700 font-semibold"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </div>

        {/* Keywords / Tags */}
        {page.keywords && page.keywords.length > 0 && (
          <div className="pt-4 border-t border-slate-200 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Tags:
            </span>
            {page.keywords.map((kw, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600"
              >
                #{kw}
              </span>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}
