import React, { useState, useEffect, useRef } from 'react';
import { pageService } from '../services/pageService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorAlert from '../components/common/ErrorAlert';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import Pagination from '../components/common/Pagination';
import FileUpload from '../components/common/FileUpload';
import RichTextEditor from '../components/editor/RichTextEditor';
import {
  HiPlus,
  HiMagnifyingGlass,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineDocumentText,
  HiOutlineGlobeAlt,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineCheckCircle,
  HiOutlineEyeSlash,
  HiOutlineSparkles,
} from 'react-icons/hi2';

const INITIAL_FORM = {
  title: '',
  slug: '',
  content: '',
  description: '',
  featuredImage: '',
  seoTitle: '',
  seoDescription: '',
  keywords: '',
  status: 'draft',
};

const slugify = (text) => {
  return String(text)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default function PageManagement() {
  const { hasPermission } = useAuth();
  const toast = useToast();

  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, pages: 1 });

  // Modals
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDiscardConfirmOpen, setIsDiscardConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Form State
  const [selectedPage, setSelectedPage] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isDirty, setIsDirty] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const fetchPages = async (page = pagination.page) => {
    try {
      setLoading(true);
      setError('');
      const params = { page, limit: pagination.limit };
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== 'All') params.status = statusFilter;

      const res = await pageService.getAllAdmin(params);
      if (res.data) {
        setPages(res.data.pages || []);
        if (res.data.pagination) setPagination(res.data.pagination);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dynamic pages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPages(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  // Window beforeunload warning for unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleOpenCreate = () => {
    setSelectedPage(null);
    setFormData(INITIAL_FORM);
    setSlugManuallyEdited(false);
    setIsDirty(false);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (pageItem) => {
    setSelectedPage(pageItem);
    setFormData({
      title: pageItem.title || '',
      slug: pageItem.slug || '',
      content: pageItem.content || '',
      description: pageItem.description || '',
      featuredImage: pageItem.featuredImage || '',
      seoTitle: pageItem.seoTitle || '',
      seoDescription: pageItem.seoDescription || '',
      keywords: Array.isArray(pageItem.keywords) ? pageItem.keywords.join(', ') : '',
      status: pageItem.status || 'draft',
    });
    setSlugManuallyEdited(true);
    setIsDirty(false);
    setIsEditorOpen(true);
  };

  const handleCloseEditorRequest = () => {
    if (isDirty) {
      setIsDiscardConfirmOpen(true);
    } else {
      setIsEditorOpen(false);
    }
  };

  const handleConfirmDiscard = () => {
    setIsDiscardConfirmOpen(false);
    setIsDirty(false);
    setIsEditorOpen(false);
  };

  const handleTitleChange = (e) => {
    const titleVal = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: titleVal,
      slug: !slugManuallyEdited ? slugify(titleVal) : prev.slug,
    }));
    setIsDirty(true);
  };

  const handleSlugChange = (e) => {
    setSlugManuallyEdited(true);
    setFormData((prev) => ({
      ...prev,
      slug: slugify(e.target.value),
    }));
    setIsDirty(true);
  };

  const handleTogglePublish = async (pageItem) => {
    try {
      const res = await pageService.togglePublish(pageItem._id);
      toast.success(res.message || 'Page publication status updated.');
      fetchPages(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Failed to toggle publication status.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Page title is required.');
      return;
    }
    if (!formData.slug.trim()) {
      toast.error('Page URL slug is required.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        title: formData.title.trim(),
        slug: slugify(formData.slug),
        description: formData.description.trim(),
        featuredImage: formData.featuredImage.trim(),
        seoTitle: formData.seoTitle.trim(),
        seoDescription: formData.seoDescription.trim(),
        keywords: formData.keywords
          ? formData.keywords.split(',').map((k) => k.trim()).filter(Boolean)
          : [],
      };

      if (selectedPage) {
        await pageService.update(selectedPage._id, payload);
        toast.success(`Dynamic page "${payload.title}" saved successfully.`);
      } else {
        await pageService.create(payload);
        toast.success(`Dynamic page "${payload.title}" created successfully.`);
      }

      setIsDirty(false);
      setIsEditorOpen(false);
      fetchPages(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Failed to save page.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPage) return;
    try {
      setDeleting(true);
      await pageService.delete(selectedPage._id);
      toast.success(`Page "${selectedPage.title}" deleted.`);
      setIsDeleteOpen(false);
      fetchPages(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Failed to delete page.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2.5">
            <HiOutlineDocumentText className="text-gold-400 text-2xl" />
            <span>Dynamic Page Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Create unlimited custom pages with rich WYSIWYG content, custom slugs, and SEO meta tags.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-semibold shadow-lg shadow-navy-900/30 transition-all active:scale-95 shrink-0"
        >
          <HiPlus className="text-base" />
          <span>Create New Page</span>
        </button>
      </div>

      <ErrorAlert message={error} onRetry={() => fetchPages(1)} />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pages by title, slug, or description..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-gold-500 cursor-pointer w-full sm:w-auto"
          >
            <option value="All">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts Only</option>
          </select>
        </div>
      </div>

      {/* Pages Table */}
      {loading ? (
        <LoadingSpinner message="Loading custom pages..." />
      ) : pages.length === 0 ? (
        <EmptyState
          title="No dynamic pages found"
          description="Create your first custom college information page, admissions guide, or departmental policy."
          actionText="+ Create Page"
          onAction={handleOpenCreate}
          icon={HiOutlineDocumentText}
        />
      ) : (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Page Title & Slug</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {pages.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="py-3.5 px-4">
                      <div className="min-w-0">
                        <span className="font-semibold text-white text-sm group-hover:text-gold-400 transition-colors block truncate">
                          {item.title}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[11px] font-mono text-gold-400/90 truncate">
                            /pages/{item.slug}
                          </span>
                          {item.status === 'published' && (
                            <a
                              href={`http://localhost:5173/pages/${item.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-400 hover:text-white"
                              title="View on Public Website"
                            >
                              <HiOutlineArrowTopRightOnSquare className="text-xs" />
                            </a>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant={item.status === 'published' ? 'published' : 'draft'} size="xs">
                        {item.status === 'published' ? 'Published' : 'Draft'}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300 font-medium text-[11px]">
                      {item.authorName || 'Admin'}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(item.updatedAt || item.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(item)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            item.status === 'published'
                              ? 'text-emerald-400 hover:bg-emerald-500/10'
                              : 'text-amber-400 hover:bg-amber-500/10'
                          }`}
                          title={
                            item.status === 'published'
                              ? 'Unpublish (Switch to Draft)'
                              : 'Publish Immediately'
                          }
                        >
                          {item.status === 'published' ? (
                            <HiOutlineCheckCircle className="text-base" />
                          ) : (
                            <HiOutlineEyeSlash className="text-base" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-slate-400 hover:text-gold-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit Page Content"
                        >
                          <HiOutlinePencilSquare className="text-base" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPage(item);
                            setIsDeleteOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Delete Page"
                        >
                          <HiOutlineTrash className="text-base" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div className="p-4 border-t border-slate-800">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={(page) => fetchPages(page)}
              />
            </div>
          )}
        </div>
      )}

      {/* Full Page Editor Modal */}
      <Modal
        isOpen={isEditorOpen}
        onClose={handleCloseEditorRequest}
        title={selectedPage ? `Edit Page: ${selectedPage.title}` : 'Create Dynamic Page'}
        subtitle="Manage page content with rich formatting, image uploads, and SEO parameters."
        maxWidth="max-w-5xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Page Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. Admission Guidelines 2026-27"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>
                  URL Slug <span className="text-rose-400">*</span>
                </span>
                <span className="text-[10px] text-gold-400 font-mono">
                  /pages/{formData.slug || 'slug-example'}
                </span>
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={handleSlugChange}
                placeholder="admission-guidelines-2026-27"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500 font-mono"
              />
            </div>
          </div>

          {/* Description & Featured Image */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Summary / Excerpt Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  setIsDirty(true);
                }}
                placeholder="Brief summary displayed in search and header cards..."
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-1">
              <FileUpload
                label="Featured Cover Image (Optional)"
                accept="image/*"
                value={formData.featuredImage}
                onChange={(url) => {
                  setFormData({ ...formData, featuredImage: url });
                  setIsDirty(true);
                }}
                isImage={true}
                helperText="Upload hero image for page header"
              />
            </div>
          </div>

          {/* WYSIWYG Content Editor */}
          <div className="space-y-1">
            <div className="flex items-center justify-between pb-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <HiOutlineSparkles className="text-gold-400" />
                <span>Page Body Content (WYSIWYG)</span>
              </label>
              <span className="text-[10px] text-slate-400">
                Supports bold, lists, tables, links & image uploads
              </span>
            </div>

            <RichTextEditor
              content={formData.content}
              onChange={(newHtml) => {
                setFormData((prev) => ({ ...prev, content: newHtml }));
                setIsDirty(true);
              }}
            />
          </div>

          {/* SEO Parameters Accordion */}
          <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              SEO & Metadata Settings
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">SEO Title</label>
                <input
                  type="text"
                  value={formData.seoTitle}
                  onChange={(e) => {
                    setFormData({ ...formData, seoTitle: e.target.value });
                    setIsDirty(true);
                  }}
                  placeholder="Defaults to Page Title"
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">SEO Description</label>
                <input
                  type="text"
                  value={formData.seoDescription}
                  onChange={(e) => {
                    setFormData({ ...formData, seoDescription: e.target.value });
                    setIsDirty(true);
                  }}
                  placeholder="Defaults to summary excerpt"
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Keywords (Comma separated)</label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => {
                    setFormData({ ...formData, keywords: e.target.value });
                    setIsDirty(true);
                  }}
                  placeholder="admission, bca, tp college"
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </div>

          {/* Publication Status & Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.status === 'published'}
                  onChange={(e) => {
                    setFormData({ ...formData, status: e.target.checked ? 'published' : 'draft' });
                    setIsDirty(true);
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
              <span className="text-xs font-semibold text-slate-300">
                {formData.status === 'published' ? 'Publish Immediately' : 'Save as Draft'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCloseEditorRequest}
                disabled={submitting}
                className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 text-xs font-semibold text-white bg-navy-900 hover:bg-navy-800 rounded-xl transition-all shadow-lg shadow-navy-900/40 disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : selectedPage ? (
                  'Update Page'
                ) : (
                  'Create Page'
                )}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Confirm Discard Modal */}
      <ConfirmDialog
        isOpen={isDiscardConfirmOpen}
        onClose={() => setIsDiscardConfirmOpen(false)}
        onConfirm={handleConfirmDiscard}
        title="Unsaved Changes Detected"
        message="You have unsaved changes in the editor. If you leave now, your modifications will be discarded. Are you sure you want to close without saving?"
        confirmText="Discard Changes"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Dynamic Page"
        message={`Are you sure you want to permanently delete "${selectedPage?.title}" (/pages/${selectedPage?.slug})? This action cannot be reversed.`}
        confirmText="Confirm Delete"
        isDeleting={deleting}
      />
    </div>
  );
}
