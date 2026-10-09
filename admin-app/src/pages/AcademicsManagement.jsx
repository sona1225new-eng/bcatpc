import React, { useState, useEffect } from 'react';
import { academicService } from '../services/academicService';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorAlert from '../components/common/ErrorAlert';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import {
  HiPlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineAcademicCap,
  HiOutlineBuildingLibrary,
  HiOutlineBookOpen,
  HiOutlineClipboardDocumentCheck,
} from 'react-icons/hi2';

const INITIAL_FORM = {
  programTitle: 'Bachelor of Computer Applications (BCA)',
  degree: 'Undergraduate Degree (B.C.A.)',
  duration: '3 Years (6 Semesters)',
  intake: 60,
  affiliation: 'B.N. Mandal University, Madhepura',
  curriculumFramework: 'Choice Based Credit System (CBCS) & NEP Aligned',
  overview: '',
  objectivesText: '',
  eligibilityQualification: '10+2 (Intermediate) or equivalent from a recognized board',
  eligibilitySubject: 'Mathematics / Statistics / Computer Science preferred',
  eligibilityMarks: '45% aggregate (40% for reserved categories)',
  eligibilitySelection: 'Merit basis / University Entrance Guidelines',
  isPublished: true,
};

export default function AcademicsManagement() {
  const [academics, setAcademics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [selectedAcademic, setSelectedAcademic] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const toast = useToast();

  const fetchAcademics = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await academicService.getAll({ list: true });
      // Can be array or single object
      if (Array.isArray(res.data)) {
        setAcademics(res.data);
      } else if (res.data) {
        setAcademics([res.data]);
      } else {
        setAcademics([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load academic records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademics();
  }, []);

  const handleOpenAdd = () => {
    setSelectedAcademic(null);
    setFormData(INITIAL_FORM);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (record) => {
    setSelectedAcademic(record);
    setFormData({
      programTitle: record.programTitle || 'Bachelor of Computer Applications (BCA)',
      degree: record.degree || '',
      duration: record.duration || '',
      intake: record.intake || 60,
      affiliation: record.affiliation || '',
      curriculumFramework: record.curriculumFramework || '',
      overview: record.overview || '',
      objectivesText: Array.isArray(record.objectives)
        ? record.objectives.join('\n')
        : '',
      eligibilityQualification: record.eligibility?.qualification || '',
      eligibilitySubject: record.eligibility?.subjectRequirement || '',
      eligibilityMarks: record.eligibility?.minimumMarks || '',
      eligibilitySelection: record.eligibility?.selectionCriteria || '',
      isPublished: record.isPublished ?? true,
    });
    setIsFormOpen(true);
  };

  const handleOpenView = (record) => {
    setSelectedAcademic(record);
    setIsViewOpen(true);
  };

  const handleOpenDelete = (record) => {
    setSelectedAcademic(record);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        programTitle: formData.programTitle,
        degree: formData.degree,
        duration: formData.duration,
        intake: Number(formData.intake) || 60,
        affiliation: formData.affiliation,
        curriculumFramework: formData.curriculumFramework,
        overview: formData.overview,
        objectives: formData.objectivesText
          ? formData.objectivesText.split('\n').map((s) => s.trim()).filter(Boolean)
          : [],
        eligibility: {
          qualification: formData.eligibilityQualification,
          subjectRequirement: formData.eligibilitySubject,
          minimumMarks: formData.eligibilityMarks,
          selectionCriteria: formData.eligibilitySelection,
        },
        isPublished: formData.isPublished,
      };

      if (selectedAcademic) {
        await academicService.update(selectedAcademic._id, payload);
        toast.success('Academic program updated successfully in MongoDB!');
      } else {
        await academicService.create(payload);
        toast.success('New academic program created successfully in MongoDB!');
      }

      setIsFormOpen(false);
      fetchAcademics();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAcademic) return;
    try {
      setDeleting(true);
      await academicService.delete(selectedAcademic._id);
      toast.success('Academic program record deleted.');
      setIsDeleteOpen(false);
      fetchAcademics();
    } catch (err) {
      toast.error(err.message || 'Failed to delete record.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">Academics Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage the BCA curriculum framework, program objectives, eligibility criteria, and semester outlines.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-semibold shadow-lg shadow-navy-900/30 transition-all active:scale-95 shrink-0"
        >
          <HiPlus className="text-base" />
          <span>Add Academic Program</span>
        </button>
      </div>

      <ErrorAlert message={error} onRetry={fetchAcademics} />

      {/* Main List */}
      {loading ? (
        <LoadingSpinner message="Loading academic programs..." />
      ) : academics.length === 0 ? (
        <EmptyState
          title="No academic programs found"
          description="Initialize or create the BCA degree structure to publish on the portal."
          actionText="+ Add Program Structure"
          onAction={handleOpenAdd}
          icon={HiOutlineAcademicCap}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {academics.map((record) => (
            <div
              key={record._id}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-400 flex items-center justify-center text-2xl shrink-0">
                    <HiOutlineAcademicCap />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{record.programTitle}</h3>
                    <p className="text-xs text-slate-400">
                      {record.degree} • {record.duration}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={record.isPublished ? 'published' : 'draft'} size="sm">
                    {record.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                  <button
                    type="button"
                    onClick={() => handleOpenView(record)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                    title="View Program Details"
                  >
                    <HiOutlineEye className="text-lg" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(record)}
                    className="p-2 text-slate-400 hover:text-gold-400 hover:bg-slate-800 rounded-xl transition-colors"
                    title="Edit Program"
                  >
                    <HiOutlinePencilSquare className="text-lg" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenDelete(record)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors"
                    title="Delete Program"
                  >
                    <HiOutlineTrash className="text-lg" />
                  </button>
                </div>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400 block mb-1">Affiliation</span>
                  <span className="font-semibold text-white">{record.affiliation || '—'}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400 block mb-1">Student Intake</span>
                  <span className="font-semibold text-white">{record.intake || 60} Seats</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400 block mb-1">Curriculum Framework</span>
                  <span className="font-semibold text-white">
                    {record.curriculumFramework || 'CBCS & NEP'}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400 block mb-1">Semesters & Labs</span>
                  <span className="font-semibold text-white">
                    {record.semestersStructure?.length || 6} Semesters •{' '}
                    {record.laboratories?.length || 2} Labs
                  </span>
                </div>
              </div>

              {record.overview && (
                <div className="text-xs text-slate-300 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60 leading-relaxed">
                  <p className="font-semibold text-white mb-1">Program Overview</p>
                  {record.overview}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Academic Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedAcademic ? 'Edit Academic Program' : 'Add Academic Program'}
        subtitle="Changes are saved into MongoDB and populate the public Academics page dynamically."
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Program Title</label>
              <input
                type="text"
                required
                value={formData.programTitle}
                onChange={(e) => setFormData({ ...formData, programTitle: e.target.value })}
                placeholder="Bachelor of Computer Applications (BCA)"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Degree Conferred</label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                placeholder="Undergraduate Degree (B.C.A.)"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="3 Years (6 Semesters)"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Annual Intake (Seats)</label>
              <input
                type="number"
                value={formData.intake}
                onChange={(e) => setFormData({ ...formData, intake: e.target.value })}
                placeholder="60"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Affiliation University</label>
              <input
                type="text"
                value={formData.affiliation}
                onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                placeholder="B.N. Mandal University, Madhepura"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Curriculum Framework</label>
              <input
                type="text"
                value={formData.curriculumFramework}
                onChange={(e) => setFormData({ ...formData, curriculumFramework: e.target.value })}
                placeholder="Choice Based Credit System (CBCS) & NEP Aligned"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Overview / Introduction</label>
            <textarea
              rows={3}
              value={formData.overview}
              onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
              placeholder="Detailed description of the BCA degree program..."
              className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              Program Objectives (one per line)
            </label>
            <textarea
              rows={3}
              value={formData.objectivesText}
              onChange={(e) => setFormData({ ...formData, objectivesText: e.target.value })}
              placeholder="Develop deep problem solving and algorithmic thinking.&#10;Build robust web, cloud, and mobile software applications."
              className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
            />
          </div>

          {/* Eligibility Section */}
          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800/80 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold-400">
              Eligibility & Admission Requirements
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">
                  Educational Qualification
                </label>
                <input
                  type="text"
                  value={formData.eligibilityQualification}
                  onChange={(e) =>
                    setFormData({ ...formData, eligibilityQualification: e.target.value })
                  }
                  className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">
                  Subject Requirement
                </label>
                <input
                  type="text"
                  value={formData.eligibilitySubject}
                  onChange={(e) =>
                    setFormData({ ...formData, eligibilitySubject: e.target.value })
                  }
                  className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Minimum Marks</label>
                <input
                  type="text"
                  value={formData.eligibilityMarks}
                  onChange={(e) =>
                    setFormData({ ...formData, eligibilityMarks: e.target.value })
                  }
                  className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Selection Criteria</label>
                <input
                  type="text"
                  value={formData.eligibilitySelection}
                  onChange={(e) =>
                    setFormData({ ...formData, eligibilitySelection: e.target.value })
                  }
                  className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                />
              </div>
            </div>
          </div>

          {/* Published checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isAcademicPublished"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700 focus:ring-gold-500"
            />
            <label htmlFor="isAcademicPublished" className="text-xs font-semibold text-slate-300">
              Published on Public Website
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
              ) : selectedAcademic ? (
                'Update Program'
              ) : (
                'Save Program'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Academic Details Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title={selectedAcademic?.programTitle || 'Academic Program Details'}
        subtitle={selectedAcademic?.affiliation}
        maxWidth="max-w-2xl"
      >
        {selectedAcademic && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Degree</span>
                <span className="text-white font-medium">{selectedAcademic.degree}</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Duration</span>
                <span className="text-white font-medium">{selectedAcademic.duration}</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Intake</span>
                <span className="text-white font-medium">{selectedAcademic.intake} Students</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Status</span>
                <Badge variant={selectedAcademic.isPublished ? 'published' : 'draft'} size="xs">
                  {selectedAcademic.isPublished ? 'Published' : 'Draft'}
                </Badge>
              </div>
            </div>

            {selectedAcademic.overview && (
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 leading-relaxed">
                <span className="text-slate-400 block mb-1 font-semibold">Overview</span>
                <p className="text-slate-300">{selectedAcademic.overview}</p>
              </div>
            )}

            {selectedAcademic.objectives?.length > 0 && (
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-2 font-semibold">
                  Program Objectives
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {selectedAcademic.objectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
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
        title="Delete Academic Program"
        message={`Are you sure you want to delete "${selectedAcademic?.programTitle}"?`}
        confirmText="Confirm Delete"
        isDeleting={deleting}
      />
    </div>
  );
}
