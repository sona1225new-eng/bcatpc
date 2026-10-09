import React, { useState, useEffect } from 'react';
import { campusUpdateService } from '../services/campusUpdateService';
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
  HiOutlineSparkles,
} from 'react-icons/hi2';

const INITIAL_FORM = {
  title: '',
  category: 'General',
  author: 'BCA Department',
  image: '',
  shortDescription: '',
  content: '',
  readTime: '3 min read',
  tags: '',
  status: 'published',
};

export default function CampusUpdatesManagement() {
  const [updates, setUpdates] = useState([]);
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

  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const toast = useToast();

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (search) params.search = search;
      if (categoryFilter !== 'All') params.category = categoryFilter;
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await campusUpdateService.getAll(params);
      setUpdates(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load campus updates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUpdates();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, categoryFilter, statusFilter]);

  const handleOpenAdd = () => {
    setSelectedUpdate(null);
    setFormData(INITIAL_FORM);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (u) => {
    setSelectedUpdate(u);
    setFormData({
      title: u.title || '',
      category: u.category || 'General',
      author: u.author || 'BCA Department',
      image: u.image || '',
      shortDescription: u.shortDescription || '',
      content: u.content || '',
      readTime: u.readTime || '3 min read',
      tags: Array.isArray(u.tags) ? u.tags.join(', ') : '',
      status: u.status || 'published',
    });
    setIsFormOpen(true);
  };

  const handleOpenView = (u) => {
    setSelectedUpdate(u);
    setIsViewOpen(true);
  };

  const handleOpenDelete = (u) => {
    setSelectedUpdate(u);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Title is required');
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

      if (selectedUpdate) {
        await campusUpdateService.update(selectedUpdate._id, payload);
        toast.success(`Campus update "${formData.title}" updated.`);
      } else {
        await campusUpdateService.create(payload);
        toast.success(`Campus update "${formData.title}" posted.`);
      }

      setIsFormOpen(false);
      fetchUpdates();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUpdate) return;
    try {
      setDeleting(true);
      await campusUpdateService.delete(selectedUpdate._id);
      toast.success(`Campus update "${selectedUpdate.title}" deleted.`);
      setIsDeleteOpen(false);
      fetchUpdates();
    } catch (err) {
      toast.error(err.message || 'Failed to delete campus update.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">Campus Updates & News</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Post achievements, workshops, placement records, and infrastructure news.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-semibold shadow-lg shadow-navy-900/30 transition-all active:scale-95 shrink-0"
        >
          <HiPlus className="text-base" />
          <span>New Campus Update</span>
        </button>
      </div>

      <ErrorAlert message={error} onRetry={fetchUpdates} />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search updates by title, description, or content..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-gold-500 cursor-pointer w-full sm:w-auto"
          >
            <option value="All">All Categories</option>
            <option value="Achievement">Achievement</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Workshop">Workshop</option>
            <option value="Placement">Placement</option>
            <option value="General">General</option>
            <option value="Event">Event</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-gold-500 cursor-pointer w-full sm:w-auto"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading campus updates..." />
      ) : updates.length === 0 ? (
        <EmptyState
          title="No campus updates found"
          description="Post achievements, workshops, and lab upgrades to keep students informed."
          actionText="+ Post Update"
          onAction={handleOpenAdd}
          icon={HiOutlineSparkles}
        />
      ) : (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3.5 px-4">Update Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Author</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {updates.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {u.image && (
                          <img
                            src={u.image}
                            alt={u.title}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-700 bg-slate-950 shrink-0"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <p className="font-semibold text-white group-hover:text-gold-400 transition-colors">
                            {u.title}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate max-w-sm">
                            {u.shortDescription}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
                        {u.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">{u.author || 'Department'}</td>

                    <td className="py-3.5 px-4 text-slate-400">
                      {u.date ? new Date(u.date).toLocaleDateString() : 'Recent'}
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant={u.status || 'published'} size="xs">
                        {u.status || 'published'}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenView(u)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          title="View"
                        >
                          <HiOutlineEye className="text-base" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(u)}
                          className="p-1.5 text-slate-400 hover:text-gold-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <HiOutlinePencilSquare className="text-base" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(u)}
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

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedUpdate ? 'Edit Campus Update' : 'Post Campus Update'}
        subtitle="Manage news, student achievements, and infrastructure upgrades."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              Update Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Modern AI & Machine Learning Lab Inaugurated"
              className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
            />
          </div>

          <FileUpload
            label="Banner / Cover Image"
            accept="image/*"
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
            isImage={true}
            helperText="Upload JPG, PNG or WEBP (Max 5MB)"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-gold-500 cursor-pointer"
              >
                <option value="Achievement">Achievement</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Workshop">Workshop</option>
                <option value="Placement">Placement</option>
                <option value="General">General</option>
                <option value="Event">Event</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Author</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="BCA Department"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Short Summary</label>
            <textarea
              rows={2}
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="Quick summary shown on cards..."
              className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Full Content</label>
            <textarea
              rows={5}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Detailed description of the achievement or event..."
              className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Tags (comma separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Lab, Innovation, Hardware"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Status</label>
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
              ) : selectedUpdate ? (
                'Update Update'
              ) : (
                'Post Update'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title={selectedUpdate?.title || 'Campus Update'}
        subtitle={`Category: ${selectedUpdate?.category}`}
        maxWidth="max-w-2xl"
      >
        {selectedUpdate && (
          <div className="space-y-4 text-xs">
            {selectedUpdate.image && (
              <img
                src={selectedUpdate.image}
                alt={selectedUpdate.title}
                className="w-full h-48 rounded-xl object-cover border border-slate-800"
              />
            )}
            <p className="text-slate-300 font-medium text-sm leading-relaxed">
              {selectedUpdate.shortDescription}
            </p>
            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 whitespace-pre-wrap leading-relaxed text-slate-200">
              {selectedUpdate.content || selectedUpdate.shortDescription}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Campus Update"
        message={`Are you sure you want to delete "${selectedUpdate?.title}"?`}
        confirmText="Confirm Delete"
        isDeleting={deleting}
      />
    </div>
  );
}
