import React, { useState, useEffect } from 'react';
import { blogService } from '../services/blogService';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorAlert from '../components/common/ErrorAlert';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import FileUpload from '../components/common/FileUpload';
import {
  HiPlus,
  HiMagnifyingGlass,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineBookOpen,
} from 'react-icons/hi2';

const INITIAL_FORM = {
  title: '',
  author: '',
  authorRole: 'Faculty',
  category: 'General',
  featuredImage: '',
  excerpt: '',
  content: '',
  readTime: '5 min read',
  tags: '',
  status: 'published',
};

export default function BlogManagement() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [selectedBlog, setSelectedBlog] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const toast = useToast();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (search) params.search = search;
      if (categoryFilter !== 'All') params.category = categoryFilter;
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await blogService.getAll(params);
      setBlogs(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load blog articles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBlogs();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, categoryFilter, statusFilter]);

  const handleOpenAdd = () => {
    setSelectedBlog(null);
    setFormData(INITIAL_FORM);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (b) => {
    setSelectedBlog(b);
    setFormData({
      title: b.title || '',
      author: b.author || '',
      authorRole: b.authorRole || 'Faculty',
      category: b.category || 'General',
      featuredImage: b.featuredImage || '',
      excerpt: b.excerpt || '',
      content: b.content || '',
      readTime: b.readTime || '5 min read',
      tags: Array.isArray(b.tags) ? b.tags.join(', ') : '',
      status: b.status || 'published',
    });
    setIsFormOpen(true);
  };

  const handleOpenView = (b) => {
    setSelectedBlog(b);
    setIsViewOpen(true);
  };

  const handleOpenDelete = (b) => {
    setSelectedBlog(b);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.author.trim()) {
      toast.error('Title and Author are required');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        tags: formData.tags
          ? formData.tags.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      };

      if (selectedBlog) {
        await blogService.update(selectedBlog._id, payload);
        toast.success(`Blog article "${formData.title}" updated.`);
      } else {
        await blogService.create(payload);
        toast.success(`Blog article "${formData.title}" created.`);
      }

      setIsFormOpen(false);
      fetchBlogs();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedBlog) return;
    try {
      setDeleting(true);
      await blogService.delete(selectedBlog._id);
      toast.success(`Blog article "${selectedBlog.title}" deleted.`);
      setIsDeleteOpen(false);
      fetchBlogs();
    } catch (err) {
      toast.error(err.message || 'Failed to delete blog article.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">Blog & Articles Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Publish technical posts, tutorials, and faculty research notes.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-semibold shadow-lg shadow-navy-900/30 transition-all active:scale-95 shrink-0"
        >
          <HiPlus className="text-base" />
          <span>Write New Article</span>
        </button>
      </div>

      <ErrorAlert message={error} onRetry={fetchBlogs} />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author name, excerpt, tags..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-gold-500 cursor-pointer w-full sm:w-auto"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading blog articles..." />
      ) : blogs.length === 0 ? (
        <EmptyState
          title="No articles found"
          description="Create your first technical article or insights post."
          actionText="+ Write Article"
          onAction={handleOpenAdd}
          icon={HiOutlineBookOpen}
        />
      ) : (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3.5 px-4">Article</th>
                  <th className="py-3.5 px-4">Author</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Read Time</th>
                  <th className="py-3.5 px-4">Views</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {blogs.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {b.featuredImage && (
                          <img
                            src={b.featuredImage}
                            alt={b.title}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-700 bg-slate-950 shrink-0"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <p className="font-semibold text-white group-hover:text-gold-400 transition-colors">
                            {b.title}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate max-w-xs">{b.excerpt}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-200">{b.author}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px]">
                        {b.category || 'General'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400">{b.readTime || '5 min'}</td>

                    <td className="py-3.5 px-4 font-mono text-slate-400">{b.views || 0}</td>

                    <td className="py-3.5 px-4">
                      <Badge variant={b.status || 'published'} size="xs">
                        {b.status || 'published'}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenView(b)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          title="View Article"
                        >
                          <HiOutlineEye className="text-base" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(b)}
                          className="p-1.5 text-slate-400 hover:text-gold-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <HiOutlinePencilSquare className="text-base" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(b)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Delete"
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
        </div>
      )}

      {/* Add / Edit Blog Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedBlog ? 'Edit Article' : 'Write New Article'}
        subtitle="Manage blog posts and technical articles displayed on the website."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              Article Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Introduction to Neural Networks and Deep Learning"
              className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
            />
          </div>

          <FileUpload
            label="Featured Cover Image"
            accept="image/*"
            value={formData.featuredImage}
            onChange={(url) => setFormData({ ...formData, featuredImage: url })}
            isImage={true}
            helperText="Upload JPG, PNG or WEBP (16:9 recommended)"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Author Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Dr. Rajesh Kumar"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Author Role</label>
              <input
                type="text"
                value={formData.authorRole}
                onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                placeholder="Assistant Professor"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Artificial Intelligence / Web Development"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Estimated Read Time</label>
              <input
                type="text"
                value={formData.readTime}
                onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                placeholder="5 min read"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Short Summary / Excerpt</label>
            <textarea
              rows={2}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief summary displayed on article cards..."
              className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Full Article Content</label>
            <textarea
              rows={6}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write or paste your article markdown / text..."
              className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="AI, Machine Learning, Python"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Publication Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-gold-500 cursor-pointer"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
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
              ) : selectedBlog ? (
                'Update Article'
              ) : (
                'Publish Article'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Article Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title={selectedBlog?.title || 'Article Preview'}
        subtitle={`By ${selectedBlog?.author} • ${selectedBlog?.readTime || '5 min'}`}
        maxWidth="max-w-2xl"
      >
        {selectedBlog && (
          <div className="space-y-4 text-xs">
            {selectedBlog.featuredImage && (
              <img
                src={selectedBlog.featuredImage}
                alt={selectedBlog.title}
                className="w-full h-48 rounded-xl object-cover border border-slate-800"
              />
            )}
            <div className="flex items-center gap-2">
              <Badge variant={selectedBlog.status || 'published'} size="xs">
                {selectedBlog.status || 'published'}
              </Badge>
              <span className="text-slate-400">•</span>
              <span className="text-slate-400">{selectedBlog.category}</span>
            </div>
            <p className="text-slate-300 italic border-l-2 border-gold-500 pl-3">
              {selectedBlog.excerpt}
            </p>
            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 whitespace-pre-wrap leading-relaxed text-slate-200">
              {selectedBlog.content}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Blog Article"
        message={`Are you sure you want to permanently delete "${selectedBlog?.title}"?`}
        confirmText="Confirm Delete"
        isDeleting={deleting}
      />
    </div>
  );
}
