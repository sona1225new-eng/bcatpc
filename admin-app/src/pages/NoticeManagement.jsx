import React, { useState, useEffect } from 'react';
import { noticeService } from '../services/noticeService';
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
  HiOutlineBell,
  HiOutlineDocumentText,
  HiExclamationCircle,
} from 'react-icons/hi2';

const INITIAL_FORM = {
  title: '',
  category: 'Official',
  tag: '',
  referenceNo: '',
  author: 'Examination Controller',
  isUrgent: false,
  isNew: true,
  description: '',
  content: '',
  documentUrl: '',
  documentName: '',
  documentSize: '',
  status: 'published',
};

export default function NoticeManagement() {
  const [notices, setNotices] = useState([]);
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

  const [selectedNotice, setSelectedNotice] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const toast = useToast();

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (search) params.search = search;
      if (categoryFilter !== 'All') params.category = categoryFilter;
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await noticeService.getAll(params);
      setNotices(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load notices.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNotices();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, categoryFilter, statusFilter]);

  const handleOpenAdd = () => {
    setSelectedNotice(null);
    setFormData(INITIAL_FORM);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (n) => {
    setSelectedNotice(n);
    setFormData({
      title: n.title || '',
      category: n.category || 'Official',
      tag: n.tag || '',
      referenceNo: n.referenceNo || '',
      author: n.author || 'Examination Controller',
      isUrgent: n.isUrgent ?? false,
      isNew: n.isNew ?? true,
      description: n.description || '',
      content: n.content || '',
      documentUrl: n.documentUrl || '',
      documentName: n.documentName || '',
      documentSize: n.documentSize || '',
      status: n.status || 'published',
    });
    setIsFormOpen(true);
  };

  const handleOpenView = (n) => {
    setSelectedNotice(n);
    setIsViewOpen(true);
  };

  const handleOpenDelete = (n) => {
    setSelectedNotice(n);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Notice title is required.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = { ...formData };

      if (selectedNotice) {
        await noticeService.update(selectedNotice._id, payload);
        toast.success(`Notice "${formData.title}" updated.`);
      } else {
        await noticeService.create(payload);
        toast.success(`Notice "${formData.title}" published.`);
      }

      setIsFormOpen(false);
      fetchNotices();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedNotice) return;
    try {
      setDeleting(true);
      await noticeService.delete(selectedNotice._id);
      toast.success(`Notice "${selectedNotice.title}" deleted.`);
      setIsDeleteOpen(false);
      fetchNotices();
    } catch (err) {
      toast.error(err.message || 'Failed to delete notice.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">Notices & Circulars</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Issue official university exam notifications, admission circulars, and departmental
            bulletins.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-semibold shadow-lg shadow-navy-900/30 transition-all active:scale-95 shrink-0"
        >
          <HiPlus className="text-base" />
          <span>Publish Notice</span>
        </button>
      </div>

      <ErrorAlert message={error} onRetry={fetchNotices} />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notices by title, reference number, description..."
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
            <option value="Official">Official</option>
            <option value="Admission">Admission</option>
            <option value="Examination">Examination</option>
            <option value="Campus Life">Campus Life</option>
            <option value="Department">Department</option>
            <option value="General">General</option>
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
        <LoadingSpinner message="Loading notices..." />
      ) : notices.length === 0 ? (
        <EmptyState
          title="No notices found"
          description="Publish official examination or administrative circulars for students."
          actionText="+ Publish Notice"
          onAction={handleOpenAdd}
          icon={HiOutlineBell}
        />
      ) : (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3.5 px-4">Notice Title & Ref</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Attachment</th>
                  <th className="py-3.5 px-4">Flags</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {notices.map((n) => (
                  <tr key={n._id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="flex items-center gap-2">
                          {n.isUrgent && (
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
                          )}
                          <p className="font-semibold text-white group-hover:text-gold-400 transition-colors">
                            {n.title}
                          </p>
                        </div>
                        {n.referenceNo && (
                          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                            Ref: {n.referenceNo}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-gold-500/10 border border-gold-500/20 text-gold-400 text-[11px]">
                        {n.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400">
                      {n.date ? new Date(n.date).toLocaleDateString() : 'Recent'}
                    </td>

                    <td className="py-3.5 px-4">
                      {n.documentUrl ? (
                        <a
                          href={n.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[11px] transition-colors"
                        >
                          <HiOutlineDocumentText className="text-sm text-gold-400" />
                          <span>PDF</span>
                        </a>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {n.isUrgent && (
                          <Badge variant="urgent" size="xs">
                            Urgent
                          </Badge>
                        )}
                        {n.isNew && (
                          <Badge variant="blue" size="xs">
                            New
                          </Badge>
                        )}
                        {!n.isUrgent && !n.isNew && <span className="text-slate-300">—</span>}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant={n.status || 'published'} size="xs">
                        {n.status || 'published'}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenView(n)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          title="View"
                        >
                          <HiOutlineEye className="text-base" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(n)}
                          className="p-1.5 text-slate-400 hover:text-gold-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <HiOutlinePencilSquare className="text-base" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(n)}
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
        title={selectedNotice ? 'Edit Notice' : 'Publish Notice'}
        subtitle="Saved notices appear immediately on the student portal and marquee ticker."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              Notice Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Schedule for BCA 2nd Semester Practical Examination 2024"
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
                <option value="Official">Official</option>
                <option value="Admission">Admission</option>
                <option value="Examination">Examination</option>
                <option value="Campus Life">Campus Life</option>
                <option value="Department">Department</option>
                <option value="General">General</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Reference Number</label>
              <input
                type="text"
                value={formData.referenceNo}
                onChange={(e) => setFormData({ ...formData, referenceNo: e.target.value })}
                placeholder="TPC/BCA/2024/EXAM-04"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Short Tag</label>
              <input
                type="text"
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                placeholder="Semester Exam / Practical"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Issuing Authority</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Controller of Examinations"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Brief Summary</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Short description displayed on notice board list..."
              className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Detailed Content</label>
            <textarea
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Full text of the circular, exam instructions, dates, roll numbers..."
              className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
            />
          </div>

          {/* Document / PDF Upload */}
          <FileUpload
            label="Upload Document Attachment (PDF)"
            accept="application/pdf,image/*"
            value={formData.documentUrl}
            onChange={(url) => setFormData({ ...formData, documentUrl: url })}
            onFileInfoChange={(info) => {
              setFormData((prev) => ({
                ...prev,
                documentUrl: info.fileUrl,
                documentName: info.fileName,
                documentSize: info.fileSize,
              }));
            }}
            helperText="Upload official signed circular PDF (Max 5MB)"
          />

          {/* Flags & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isUrgentCheck"
                checked={formData.isUrgent}
                onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                className="w-4 h-4 rounded text-rose-600 bg-slate-900 border-slate-700"
              />
              <label htmlFor="isUrgentCheck" className="text-xs font-semibold text-rose-300">
                Mark as Urgent (Highlighted)
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isNewCheck"
                checked={formData.isNew}
                onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700"
              />
              <label htmlFor="isNewCheck" className="text-xs font-semibold text-slate-300">
                Mark as New Badge
              </label>
            </div>

            <div className="space-y-1">
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-gold-500 cursor-pointer"
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
              ) : selectedNotice ? (
                'Update Notice'
              ) : (
                'Publish Notice'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title={selectedNotice?.title || 'Notice Details'}
        subtitle={`Category: ${selectedNotice?.category} • Ref: ${selectedNotice?.referenceNo || 'None'}`}
        maxWidth="max-w-xl"
      >
        {selectedNotice && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-2">
              <Badge variant={selectedNotice.status || 'published'} size="xs">
                {selectedNotice.status || 'published'}
              </Badge>
              {selectedNotice.isUrgent && (
                <Badge variant="urgent" size="xs">
                  Urgent
                </Badge>
              )}
            </div>

            <p className="text-slate-300 leading-relaxed font-medium">
              {selectedNotice.description}
            </p>

            {selectedNotice.content && (
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 whitespace-pre-wrap leading-relaxed text-slate-200">
                {selectedNotice.content}
              </div>
            )}

            {selectedNotice.documentUrl && (
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <HiOutlineDocumentText className="text-xl text-gold-400" />
                  <div>
                    <p className="font-semibold text-white">
                      {selectedNotice.documentName || 'Notice_Circular.pdf'}
                    </p>
                    <p className="text-[10px] text-slate-400">{selectedNotice.documentSize || 'PDF'}</p>
                  </div>
                </div>
                <a
                  href={selectedNotice.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-navy-900 hover:bg-navy-800 text-white rounded-lg font-medium transition-colors"
                >
                  View Attachment
                </a>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Notice"
        message={`Are you sure you want to permanently delete "${selectedNotice?.title}"?`}
        confirmText="Confirm Delete"
        isDeleting={deleting}
      />
    </div>
  );
}
