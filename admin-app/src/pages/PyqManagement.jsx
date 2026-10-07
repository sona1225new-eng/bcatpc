import React, { useState, useEffect } from 'react';
import { pyqService } from '../services/pyqService';
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
  HiOutlineDocumentDuplicate,
  HiOutlineArrowDownTray,
  HiOutlineDocumentText,
} from 'react-icons/hi2';

const INITIAL_FORM = {
  title: '',
  semester: 'semester-1',
  semesterNumber: 1,
  subject: '',
  subjectCode: '',
  year: new Date().getFullYear(),
  examType: 'BNMU University Exam',
  paperType: 'Theory Paper',
  maxMarks: 80,
  duration: '3 Hours',
  description: '',
  topicsCovered: '',
  fileUrl: '',
  fileName: '',
  fileSize: '',
  status: 'published',
};

export default function PyqManagement() {
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [selectedPyq, setSelectedPyq] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const toast = useToast();

  const fetchPyqs = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (search) params.search = search;
      if (semesterFilter !== 'all') params.semester = semesterFilter;
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await pyqService.getAll(params);
      setPyqs(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load question papers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPyqs();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, semesterFilter, statusFilter]);

  const handleOpenAdd = () => {
    setSelectedPyq(null);
    setFormData(INITIAL_FORM);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (p) => {
    setSelectedPyq(p);
    setFormData({
      title: p.title || '',
      semester: p.semester || 'semester-1',
      semesterNumber: p.semesterNumber || 1,
      subject: p.subject || '',
      subjectCode: p.subjectCode || '',
      year: p.year || new Date().getFullYear(),
      examType: p.examType || 'BNMU University Exam',
      paperType: p.paperType || 'Theory Paper',
      maxMarks: p.maxMarks || 80,
      duration: p.duration || '3 Hours',
      description: p.description || '',
      topicsCovered: Array.isArray(p.topicsCovered) ? p.topicsCovered.join(', ') : '',
      fileUrl: p.fileUrl || '',
      fileName: p.fileName || '',
      fileSize: p.fileSize || '',
      status: p.status || 'published',
    });
    setIsFormOpen(true);
  };

  const handleOpenView = (p) => {
    setSelectedPyq(p);
    setIsViewOpen(true);
  };

  const handleOpenDelete = (p) => {
    setSelectedPyq(p);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.subject.trim()) {
      toast.error('Title and Subject are required');
      return;
    }

    try {
      setSubmitting(true);
      const semNum = parseInt(formData.semester.replace('semester-', ''), 10) || 1;
      const payload = {
        ...formData,
        semesterNumber: semNum,
        semesterLabel: `Semester ${semNum}`,
        year: Number(formData.year),
        maxMarks: Number(formData.maxMarks),
        topicsCovered: formData.topicsCovered
          ? formData.topicsCovered.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      };

      if (selectedPyq) {
        await pyqService.update(selectedPyq._id, payload);
        toast.success(`Question paper "${formData.title}" updated.`);
      } else {
        await pyqService.create(payload);
        toast.success(`Question paper "${formData.title}" created.`);
      }

      setIsFormOpen(false);
      fetchPyqs();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPyq) return;
    try {
      setDeleting(true);
      await pyqService.delete(selectedPyq._id);
      toast.success(`Question paper "${selectedPyq.title}" deleted.`);
      setIsDeleteOpen(false);
      fetchPyqs();
    } catch (err) {
      toast.error(err.message || 'Failed to delete question paper.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">
            PYQ / Question Bank Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Upload, manage, and catalog university question papers across all BCA semesters.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-900/30 transition-all active:scale-95 shrink-0"
        >
          <HiPlus className="text-base" />
          <span>Upload New PYQ</span>
        </button>
      </div>

      <ErrorAlert message={error} onRetry={fetchPyqs} />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, subject name, subject code, or topics..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Semester Filter */}
          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer w-full sm:w-auto"
          >
            <option value="all">All Semesters</option>
            <option value="semester-1">Semester 1</option>
            <option value="semester-2">Semester 2</option>
            <option value="semester-3">Semester 3</option>
            <option value="semester-4">Semester 4</option>
            <option value="semester-5">Semester 5</option>
            <option value="semester-6">Semester 6</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer w-full sm:w-auto"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Main List Table */}
      {loading ? (
        <LoadingSpinner message="Loading question bank catalog..." />
      ) : pyqs.length === 0 ? (
        <EmptyState
          title="No question papers found"
          description={
            search || semesterFilter !== 'all' || statusFilter !== 'all'
              ? 'Try modifying your search or semester filter.'
              : 'Upload previous year examination papers to help students prepare.'
          }
          actionText="+ Upload Question Paper"
          onAction={handleOpenAdd}
          icon={HiOutlineDocumentDuplicate}
        />
      ) : (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3.5 px-4">Paper Title & Subject</th>
                  <th className="py-3.5 px-4">Semester</th>
                  <th className="py-3.5 px-4">Year</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">PDF File</th>
                  <th className="py-3.5 px-4">Downloads</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {pyqs.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {p.title}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {p.subject} {p.subjectCode ? `(${p.subjectCode})` : ''}
                        </p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-blue-400 uppercase tracking-wider text-[11px]">
                        Sem {p.semesterNumber || p.semester?.replace('semester-', '')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono text-slate-300 font-semibold">{p.year}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-slate-300">{p.paperType || 'Theory'}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      {p.fileUrl ? (
                        <a
                          href={p.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 hover:text-blue-300 rounded-lg text-[11px] font-medium transition-colors"
                        >
                          <HiOutlineDocumentText className="text-sm" />
                          <span>View PDF</span>
                        </a>
                      ) : (
                        <span className="text-slate-500">No file</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-slate-400 font-mono">{p.downloadsCount || 0}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant={p.status || 'published'} size="xs">
                        {p.status || 'published'}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenView(p)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <HiOutlineEye className="text-base" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <HiOutlinePencilSquare className="text-base" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(p)}
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

      {/* Add / Edit PYQ Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedPyq ? 'Edit Question Paper' : 'Upload Question Paper'}
        subtitle="Manage semester question papers and upload PDF examination copies."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              Paper Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. BCA 1st Semester C Programming 2023"
              className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Semester</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="semester-1">Semester 1</option>
                <option value="semester-2">Semester 2</option>
                <option value="semester-3">Semester 3</option>
                <option value="semester-4">Semester 4</option>
                <option value="semester-5">Semester 5</option>
                <option value="semester-6">Semester 6</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Examination Year</label>
              <input
                type="number"
                required
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="2023"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Subject Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Programming in C / Data Structures"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Subject Code</label>
              <input
                type="text"
                value={formData.subjectCode}
                onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
                placeholder="BCA-102"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Paper Type</label>
              <select
                value={formData.paperType}
                onChange={(e) => setFormData({ ...formData, paperType: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Theory Paper">Theory Paper</option>
                <option value="Practical Paper">Practical Paper</option>
                <option value="Project">Project</option>
                <option value="Viva">Viva</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Exam Type / Authority</label>
              <input
                type="text"
                value={formData.examType}
                onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                placeholder="BNMU University Exam"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* PDF Document Upload */}
          <FileUpload
            label="Upload Question Paper (PDF)"
            accept="application/pdf"
            value={formData.fileUrl}
            onChange={(url) => setFormData({ ...formData, fileUrl: url })}
            onFileInfoChange={(info) => {
              setFormData((prev) => ({
                ...prev,
                fileUrl: info.fileUrl,
                fileName: info.fileName,
                fileSize: info.fileSize,
              }));
            }}
            helperText="Upload official PDF file (Max 5MB)"
          />

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              Topics Covered (comma separated)
            </label>
            <input
              type="text"
              value={formData.topicsCovered}
              onChange={(e) => setFormData({ ...formData, topicsCovered: e.target.value })}
              placeholder="Pointers, Arrays, File Handling, Recursion"
              className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Description / Instructions</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Special instructions, question format, etc."
              className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
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
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-900/40 disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : selectedPyq ? (
                'Update PYQ'
              ) : (
                'Save PYQ'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* View PYQ Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title={selectedPyq?.title || 'PYQ Details'}
        subtitle={`${selectedPyq?.subject} • ${selectedPyq?.year}`}
        maxWidth="max-w-xl"
      >
        {selectedPyq && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Semester</span>
                <span className="text-blue-400 font-bold uppercase">
                  {selectedPyq.semester?.replace('-', ' ')}
                </span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Exam Year</span>
                <span className="text-white font-mono font-medium">{selectedPyq.year}</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Paper Type</span>
                <span className="text-white font-medium">{selectedPyq.paperType}</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Downloads Count</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {selectedPyq.downloadsCount || 0}
                </span>
              </div>
            </div>

            {selectedPyq.fileUrl && (
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-xl">
                    <HiOutlineDocumentText />
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {selectedPyq.fileName || 'Examination_Paper.pdf'}
                    </p>
                    <p className="text-slate-400 text-[11px]">{selectedPyq.fileSize || 'PDF'}</p>
                  </div>
                </div>
                <a
                  href={selectedPyq.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
                >
                  Download
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
        title="Delete Question Paper"
        message={`Are you sure you want to permanently delete "${selectedPyq?.title}"?`}
        confirmText="Confirm Delete"
        isDeleting={deleting}
      />
    </div>
  );
}
