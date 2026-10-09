import React, { useState, useEffect } from 'react';
import { facultyService } from '../services/facultyService';
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
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
} from 'react-icons/hi2';

const INITIAL_FORM = {
  name: '',
  designation: '',
  shortDesignation: '',
  qualification: '',
  specialization: '',
  experience: '',
  email: '',
  phone: '',
  photo: '',
  bio: '',
  teachingAreas: '',
  academicInterests: '',
  officeRoom: '',
  officeHours: '',
  order: 0,
  isActive: true,
};

export default function FacultyManagement() {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterActive, setFilterActive] = useState('all');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const toast = useToast();

  const fetchFaculties = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (search) params.search = search;
      if (filterActive !== 'all') params.isActive = filterActive === 'active';

      const res = await facultyService.getAll(params);
      setFaculties(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load faculty members.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFaculties();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, filterActive]);

  const handleOpenAdd = () => {
    setSelectedFaculty(null);
    setFormData(INITIAL_FORM);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (faculty) => {
    setSelectedFaculty(faculty);
    setFormData({
      name: faculty.name || '',
      designation: faculty.designation || '',
      shortDesignation: faculty.shortDesignation || '',
      qualification: faculty.qualification || '',
      specialization: faculty.specialization || '',
      experience: faculty.experience || '',
      email: faculty.email || '',
      phone: faculty.phone || '',
      photo: faculty.photo || '',
      bio: faculty.bio || '',
      teachingAreas: Array.isArray(faculty.teachingAreas)
        ? faculty.teachingAreas.join(', ')
        : faculty.teachingAreas || '',
      academicInterests: Array.isArray(faculty.academicInterests)
        ? faculty.academicInterests.join(', ')
        : faculty.academicInterests || '',
      officeRoom: faculty.officeRoom || '',
      officeHours: faculty.officeHours || '',
      order: faculty.order || 0,
      isActive: faculty.isActive ?? true,
    });
    setIsFormOpen(true);
  };

  const handleOpenView = (faculty) => {
    setSelectedFaculty(faculty);
    setIsViewOpen(true);
  };

  const handleOpenDelete = (faculty) => {
    setSelectedFaculty(faculty);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Faculty name is required');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        teachingAreas: formData.teachingAreas
          ? formData.teachingAreas.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        academicInterests: formData.academicInterests
          ? formData.academicInterests.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        order: Number(formData.order) || 0,
      };

      if (selectedFaculty) {
        await facultyService.update(selectedFaculty._id, payload);
        toast.success(`Updated faculty "${formData.name}" successfully!`);
      } else {
        await facultyService.create(payload);
        toast.success(`Added faculty "${formData.name}" successfully!`);
      }

      setIsFormOpen(false);
      fetchFaculties();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedFaculty) return;
    try {
      setDeleting(true);
      await facultyService.delete(selectedFaculty._id, true);
      toast.success(`Faculty member "${selectedFaculty.name}" deleted.`);
      setIsDeleteOpen(false);
      fetchFaculties();
    } catch (err) {
      toast.error(err.message || 'Failed to delete faculty member.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">Faculty Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage professors, assistant professors, guest lecturers, and coordinators.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-semibold shadow-lg shadow-navy-900/30 transition-all active:scale-95 shrink-0"
        >
          <HiPlus className="text-base" />
          <span>Add New Faculty</span>
        </button>
      </div>

      <ErrorAlert message={error} onRetry={fetchFaculties} />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, designation, specialization, qualification..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-gold-500 cursor-pointer w-full sm:w-auto"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <LoadingSpinner message="Loading faculty directory..." />
      ) : faculties.length === 0 ? (
        <EmptyState
          title="No faculty members found"
          description={
            search || filterActive !== 'all'
              ? 'Try modifying your search or filter options.'
              : 'Add your first faculty member to populate the department website.'
          }
          actionText="+ Add Faculty Member"
          onAction={handleOpenAdd}
          icon={HiOutlineUser}
        />
      ) : (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3.5 px-4">Faculty Member</th>
                  <th className="py-3.5 px-4">Designation & Dept</th>
                  <th className="py-3.5 px-4">Qualification</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {faculties.map((f) => (
                  <tr key={f._id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {f.photo ? (
                          <img
                            src={f.photo}
                            alt={f.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-700 bg-slate-950 shrink-0"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-400 flex items-center justify-center font-bold text-sm shrink-0">
                            {f.name?.charAt(0) || 'F'}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-white group-hover:text-gold-400 transition-colors">
                            {f.name}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate max-w-xs">
                            {f.specialization || 'Computer Applications'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-200">
                        {f.designation || f.shortDesignation || 'Faculty'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-slate-300">{f.qualification || '—'}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        {f.email && (
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <HiOutlineEnvelope className="text-xs" />
                            <span className="truncate max-w-[150px]">{f.email}</span>
                          </div>
                        )}
                        {f.phone && (
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <HiOutlinePhone className="text-xs" />
                            <span>{f.phone}</span>
                          </div>
                        )}
                        {!f.email && !f.phone && <span className="text-slate-300">—</span>}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {f.order ?? 0}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant={f.isActive ? 'active' : 'inactive'} size="xs">
                        {f.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenView(f)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <HiOutlineEye className="text-base" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(f)}
                          className="p-1.5 text-slate-400 hover:text-gold-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <HiOutlinePencilSquare className="text-base" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(f)}
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

      {/* Add / Edit Faculty Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedFaculty ? 'Edit Faculty Member' : 'Add New Faculty Member'}
        subtitle="Saved changes will be stored directly in MongoDB and displayed on the college website."
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo Upload */}
          <FileUpload
            label="Faculty Photo"
            accept="image/*"
            value={formData.photo}
            onChange={(url) => setFormData({ ...formData, photo: url })}
            isImage={true}
            helperText="Upload JPG, PNG or WEBP (Square ratio recommended)"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dr. John Doe"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            {/* Designation */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Designation</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="Assistant Professor & Coordinator"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            {/* Short Designation */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Short Designation</label>
              <input
                type="text"
                value={formData.shortDesignation}
                onChange={(e) => setFormData({ ...formData, shortDesignation: e.target.value })}
                placeholder="Asst. Prof."
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            {/* Qualification */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Qualification</label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                placeholder="Ph.D. in Computer Science, MCA"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            {/* Specialization */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Specialization</label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                placeholder="Database Systems, AI & Cloud"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            {/* Experience */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Experience</label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="12+ Years Teaching & Research"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="faculty@tpcollege.ac.in"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 9876543210"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            {/* Office Room */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Office Room</label>
              <input
                type="text"
                value={formData.officeRoom}
                onChange={(e) => setFormData({ ...formData, officeRoom: e.target.value })}
                placeholder="BCA Dept, Room 204"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            {/* Display Order */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Display Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                placeholder="1"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Biography</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Brief professional background, academic achievements, etc."
              className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
            />
          </div>

          {/* Teaching Areas & Interests */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Teaching Areas (comma separated)
              </label>
              <input
                type="text"
                value={formData.teachingAreas}
                onChange={(e) => setFormData({ ...formData, teachingAreas: e.target.value })}
                placeholder="C++, Java, DBMS, Operating Systems"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Academic Interests (comma separated)
              </label>
              <input
                type="text"
                value={formData.academicInterests}
                onChange={(e) => setFormData({ ...formData, academicInterests: e.target.value })}
                placeholder="Machine Learning, Cybersecurity, Cloud Computing"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          {/* Active Status Checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActiveCheck"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700 focus:ring-gold-500"
            />
            <label htmlFor="isActiveCheck" className="text-xs font-semibold text-slate-300">
              Active (Visible on public college website)
            </label>
          </div>

          {/* Form Actions */}
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
              ) : selectedFaculty ? (
                'Update Faculty'
              ) : (
                'Add Faculty'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Faculty Details Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title={selectedFaculty?.name || 'Faculty Details'}
        subtitle={selectedFaculty?.designation}
        maxWidth="max-w-xl"
      >
        {selectedFaculty && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              {selectedFaculty.photo ? (
                <img
                  src={selectedFaculty.photo}
                  alt={selectedFaculty.name}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-700 bg-slate-900"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-amber-500/20 text-gold-400 border border-gold-500/30 flex items-center justify-center font-bold text-2xl">
                  {selectedFaculty.name.charAt(0)}
                </div>
              )}
              <div>
                <h4 className="text-base font-bold text-white">{selectedFaculty.name}</h4>
                <p className="text-xs text-gold-400 font-medium">
                  {selectedFaculty.designation || 'Faculty Member'}
                </p>
                <div className="mt-1">
                  <Badge variant={selectedFaculty.isActive ? 'active' : 'inactive'} size="xs">
                    {selectedFaculty.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <span className="text-slate-400 block mb-1">Qualification</span>
                <span className="text-white font-medium">
                  {selectedFaculty.qualification || '—'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <span className="text-slate-400 block mb-1">Specialization</span>
                <span className="text-white font-medium">
                  {selectedFaculty.specialization || '—'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <span className="text-slate-400 block mb-1">Experience</span>
                <span className="text-white font-medium">
                  {selectedFaculty.experience || '—'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <span className="text-slate-400 block mb-1">Contact Email</span>
                <span className="text-white font-medium">{selectedFaculty.email || '—'}</span>
              </div>
            </div>

            {selectedFaculty.bio && (
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs">
                <span className="text-slate-400 block mb-1">Biography</span>
                <p className="text-slate-300 leading-relaxed">{selectedFaculty.bio}</p>
              </div>
            )}

            {selectedFaculty.teachingAreas?.length > 0 && (
              <div className="text-xs">
                <span className="text-slate-400 block mb-1">Teaching Areas:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedFaculty.teachingAreas.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-gold-500/10 border border-gold-500/20 text-gold-400 text-[11px]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
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
        title="Delete Faculty Member"
        message={`Are you sure you want to remove ${selectedFaculty?.name} from the faculty roster?`}
        confirmText="Confirm Delete"
        isDeleting={deleting}
      />
    </div>
  );
}
