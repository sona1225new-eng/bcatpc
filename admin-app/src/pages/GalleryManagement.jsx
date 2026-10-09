import React, { useState, useEffect } from 'react';
import { galleryService } from '../services/galleryService';
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
  HiOutlinePhoto,
} from 'react-icons/hi2';

const INITIAL_FORM = {
  title: '',
  imageUrl: '',
  category: 'General',
  description: '',
  order: 0,
  isPublished: true,
};

export default function GalleryManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const toast = useToast();

  const fetchGallery = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (search) params.search = search;
      if (categoryFilter !== 'All') params.category = categoryFilter;

      const res = await galleryService.getAll(params);
      setItems(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load gallery items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchGallery();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, categoryFilter]);

  const handleOpenAdd = () => {
    setSelectedItem(null);
    setFormData(INITIAL_FORM);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      title: item.title || '',
      imageUrl: item.imageUrl || '',
      category: item.category || 'General',
      description: item.description || '',
      order: item.order || 0,
      isPublished: item.isPublished ?? true,
    });
    setIsFormOpen(true);
  };

  const handleOpenDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.imageUrl.trim()) {
      toast.error('Title and Image are required.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        order: Number(formData.order) || 0,
      };

      if (selectedItem) {
        await galleryService.update(selectedItem._id, payload);
        toast.success(`Gallery photo "${formData.title}" updated.`);
      } else {
        await galleryService.create(payload);
        toast.success(`Gallery photo "${formData.title}" uploaded.`);
      }

      setIsFormOpen(false);
      fetchGallery();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      setDeleting(true);
      await galleryService.delete(selectedItem._id);
      toast.success(`Gallery photo "${selectedItem.title}" deleted.`);
      setIsDeleteOpen(false);
      fetchGallery();
    } catch (err) {
      toast.error(err.message || 'Failed to delete photo.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">Gallery Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Upload campus photos, labs, departmental events, and student activities.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-semibold shadow-lg shadow-navy-900/30 transition-all active:scale-95 shrink-0"
        >
          <HiPlus className="text-base" />
          <span>Upload Photo</span>
        </button>
      </div>

      <ErrorAlert message={error} onRetry={fetchGallery} />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search photos by title or description..."
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
            <option value="Campus">Campus</option>
            <option value="Department">Department</option>
            <option value="Labs">Labs</option>
            <option value="Events">Events</option>
            <option value="Students">Students</option>
            <option value="Activities">Activities</option>
            <option value="General">General</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading gallery photos..." />
      ) : items.length === 0 ? (
        <EmptyState
          title="No gallery items found"
          description="Upload high-quality campus photos to show in the college gallery."
          actionText="+ Upload Photo"
          onAction={handleOpenAdd}
          icon={HiOutlinePhoto}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="group bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-video bg-slate-950 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div className="absolute top-2 right-2">
                  <Badge variant={item.isPublished ? 'published' : 'draft'} size="xs">
                    {item.isPublished ? 'Published' : 'Hidden'}
                  </Badge>
                </div>
                <div className="absolute bottom-2 left-2">
                  <span className="px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-sm text-[10px] font-semibold text-white border border-slate-800">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-white group-hover:text-gold-400 transition-colors truncate">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-300 font-mono">
                    Order: {item.order ?? 0}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 text-slate-400 hover:text-gold-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Edit Photo"
                    >
                      <HiOutlinePencilSquare className="text-base" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenDelete(item)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Delete Photo"
                    >
                      <HiOutlineTrash className="text-base" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Gallery Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedItem ? 'Edit Photo Details' : 'Upload Gallery Photo'}
        subtitle="Upload photos for the campus, computer laboratories, and student events."
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FileUpload
            label="Photo Image"
            accept="image/*"
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            isImage={true}
            helperText="Upload JPG, PNG or WEBP (Max 5MB)"
          />

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              Photo Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Modern Computer Programming Lab 1"
              className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-gold-500 cursor-pointer"
              >
                <option value="Campus">Campus</option>
                <option value="Department">Department</option>
                <option value="Labs">Labs</option>
                <option value="Events">Events</option>
                <option value="Students">Students</option>
                <option value="Activities">Activities</option>
                <option value="General">General</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Display Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                placeholder="0"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Description / Caption</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description or caption for the photo..."
              className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isPhotoPublished"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700 focus:ring-gold-500"
            />
            <label htmlFor="isPhotoPublished" className="text-xs font-semibold text-slate-300">
              Published on Public College Website
            </label>
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
              ) : selectedItem ? (
                'Update Photo'
              ) : (
                'Upload Photo'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Photo"
        message={`Are you sure you want to permanently delete "${selectedItem?.title}" from the gallery?`}
        confirmText="Confirm Delete"
        isDeleting={deleting}
      />
    </div>
  );
}
