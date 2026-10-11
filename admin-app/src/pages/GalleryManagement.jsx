import React, { useState, useEffect, useRef } from 'react';
import { galleryService } from '../services/galleryService';
import { albumService } from '../services/albumService';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorAlert from '../components/common/ErrorAlert';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import FileUpload from '../components/common/FileUpload';
import Pagination from '../components/common/Pagination';
import {
  HiPlus,
  HiMagnifyingGlass,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlinePhoto,
  HiOutlineRectangleStack,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineEyeSlash,
  HiOutlineArrowUp,
  HiOutlineArrowDown,
  HiOutlineStar,
} from 'react-icons/hi2';

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

const INITIAL_PHOTO_FORM = {
  title: '',
  imageUrl: '',
  category: 'General',
  description: '',
  order: 0,
  isPublished: true,
};

const INITIAL_ALBUM_FORM = {
  title: '',
  slug: '',
  description: '',
  coverImage: '',
  eventDate: new Date().toISOString().split('T')[0],
  category: 'General',
  order: 0,
  isPublished: true,
  images: [],
};

export default function GalleryManagement() {
  const toast = useToast();
  const multiFileInputRef = useRef(null);

  // Active top-level tab: 'albums' | 'photos'
  const [activeTab, setActiveTab] = useState('albums');

  // ── ALBUMS STATE ─────────────────────────────────────────────────────────────
  const [albums, setAlbums] = useState([]);
  const [albumsLoading, setAlbumsLoading] = useState(true);
  const [albumsError, setAlbumsError] = useState('');
  const [albumSearch, setAlbumSearch] = useState('');
  const [albumCategoryFilter, setAlbumCategoryFilter] = useState('All');
  const [albumStatusFilter, setAlbumStatusFilter] = useState('All');
  const [albumPagination, setAlbumPagination] = useState({ page: 1, limit: 12, total: 0, pages: 1 });

  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [isAlbumDeleteOpen, setIsAlbumDeleteOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albumFormData, setAlbumFormData] = useState(INITIAL_ALBUM_FORM);
  const [albumSubmitting, setAlbumSubmitting] = useState(false);
  const [albumDeleting, setAlbumDeleting] = useState(false);
  const [uploadingMultiple, setUploadingMultiple] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  // ── PHOTOS STATE ─────────────────────────────────────────────────────────────
  const [photos, setPhotos] = useState([]);
  const [photosLoading, setPhotosLoading] = useState(true);
  const [photosError, setPhotosError] = useState('');
  const [photoSearch, setPhotoSearch] = useState('');
  const [photoCategoryFilter, setPhotoCategoryFilter] = useState('All');

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isPhotoDeleteOpen, setIsPhotoDeleteOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoFormData, setPhotoFormData] = useState(INITIAL_PHOTO_FORM);
  const [photoSubmitting, setPhotoSubmitting] = useState(false);
  const [photoDeleting, setPhotoDeleting] = useState(false);

  // ── FETCH ALBUMS ─────────────────────────────────────────────────────────────
  const fetchAlbums = async (page = albumPagination.page) => {
    try {
      setAlbumsLoading(true);
      setAlbumsError('');
      const params = { page, limit: albumPagination.limit };
      if (albumSearch.trim()) params.search = albumSearch.trim();
      if (albumCategoryFilter !== 'All') params.category = albumCategoryFilter;
      if (albumStatusFilter !== 'All') params.status = albumStatusFilter;

      const res = await albumService.getAllAdmin(params);
      if (res.data) {
        setAlbums(res.data.albums || []);
        if (res.data.pagination) setAlbumPagination(res.data.pagination);
      }
    } catch (err) {
      setAlbumsError(err.message || 'Failed to load albums.');
    } finally {
      setAlbumsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'albums') {
      const timer = setTimeout(() => {
        fetchAlbums(1);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [albumSearch, albumCategoryFilter, albumStatusFilter, activeTab]);

  // ── FETCH PHOTOS ─────────────────────────────────────────────────────────────
  const fetchPhotos = async () => {
    try {
      setPhotosLoading(true);
      setPhotosError('');
      const params = {};
      if (photoSearch.trim()) params.search = photoSearch.trim();
      if (photoCategoryFilter !== 'All') params.category = photoCategoryFilter;

      const res = await galleryService.getAll(params);
      setPhotos(res.data || []);
    } catch (err) {
      setPhotosError(err.message || 'Failed to load photos.');
    } finally {
      setPhotosLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'photos') {
      const timer = setTimeout(() => {
        fetchPhotos();
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [photoSearch, photoCategoryFilter, activeTab]);

  // ── ALBUM HANDLERS ───────────────────────────────────────────────────────────
  const handleOpenAddAlbum = () => {
    setSelectedAlbum(null);
    setAlbumFormData(INITIAL_ALBUM_FORM);
    setUploadProgress('');
    setIsAlbumModalOpen(true);
  };

  const handleOpenEditAlbum = (album) => {
    setSelectedAlbum(album);
    setAlbumFormData({
      title: album.title || '',
      slug: album.slug || '',
      description: album.description || '',
      coverImage: album.coverImage || '',
      eventDate: album.eventDate ? album.eventDate.split('T')[0] : new Date().toISOString().split('T')[0],
      category: album.category || 'General',
      order: album.order || 0,
      isPublished: album.isPublished ?? true,
      images: Array.isArray(album.images) ? JSON.parse(JSON.stringify(album.images)) : [],
    });
    setUploadProgress('');
    setIsAlbumModalOpen(true);
  };

  const handleMultiFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingMultiple(true);
      setUploadProgress(`Uploading ${files.length} images...`);
      const res = await albumService.uploadMultipleImages(files);
      const uploaded = res.data || [];

      const newImages = uploaded.map((item, idx) => ({
        url: item.fileUrl,
        title: item.fileName ? item.fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') : '',
        caption: '',
        altText: item.fileName || 'Album Image',
        order: (albumFormData.images.length || 0) + idx,
      }));

      setAlbumFormData((prev) => {
        const updatedImages = [...prev.images, ...newImages];
        return {
          ...prev,
          images: updatedImages,
          coverImage: prev.coverImage || (updatedImages[0] ? updatedImages[0].url : ''),
        };
      });

      toast.success(`${uploaded.length} images added to album.`);
    } catch (err) {
      toast.error(err.message || 'Failed to upload images.');
    } finally {
      setUploadingMultiple(false);
      setUploadProgress('');
      if (multiFileInputRef.current) multiFileInputRef.current.value = '';
    }
  };

  const handleRemoveImageFromAlbum = (index) => {
    setAlbumFormData((prev) => {
      const updated = prev.images.filter((_, i) => i !== index);
      const newCover =
        prev.coverImage === prev.images[index]?.url
          ? updated[0]?.url || ''
          : prev.coverImage;
      return {
        ...prev,
        images: updated,
        coverImage: newCover,
      };
    });
  };

  const handleMoveImage = (index, direction) => {
    setAlbumFormData((prev) => {
      const images = [...prev.images];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= images.length) return prev;

      const temp = images[index];
      images[index] = images[targetIndex];
      images[targetIndex] = temp;

      // Update order property
      images.forEach((img, i) => {
        img.order = i;
      });

      return { ...prev, images };
    });
  };

  const handleTogglePublishAlbum = async (album) => {
    try {
      const res = await albumService.togglePublish(album._id);
      toast.success(res.message || 'Album status updated.');
      fetchAlbums(albumPagination.page);
    } catch (err) {
      toast.error(err.message || 'Failed to toggle publication status.');
    }
  };

  const handleAlbumSubmit = async (e) => {
    e.preventDefault();
    if (!albumFormData.title.trim()) {
      toast.error('Album title is required.');
      return;
    }

    try {
      setAlbumSubmitting(true);
      const targetSlug = albumFormData.slug ? slugify(albumFormData.slug) : slugify(albumFormData.title);
      const payload = {
        ...albumFormData,
        title: albumFormData.title.trim(),
        slug: targetSlug,
        order: Number(albumFormData.order) || 0,
        coverImage:
          albumFormData.coverImage ||
          (albumFormData.images.length > 0 ? albumFormData.images[0].url : ''),
      };

      if (selectedAlbum) {
        await albumService.update(selectedAlbum._id, payload);
        toast.success(`Album "${payload.title}" updated.`);
      } else {
        await albumService.create(payload);
        toast.success(`Album "${payload.title}" created successfully.`);
      }

      setIsAlbumModalOpen(false);
      fetchAlbums(albumPagination.page);
    } catch (err) {
      toast.error(err.message || 'Failed to save album.');
    } finally {
      setAlbumSubmitting(false);
    }
  };

  const handleAlbumDelete = async () => {
    if (!selectedAlbum) return;
    try {
      setAlbumDeleting(true);
      await albumService.delete(selectedAlbum._id);
      toast.success(`Album "${selectedAlbum.title}" deleted.`);
      setIsAlbumDeleteOpen(false);
      fetchAlbums(albumPagination.page);
    } catch (err) {
      toast.error(err.message || 'Failed to delete album.');
    } finally {
      setAlbumDeleting(false);
    }
  };

  // ── PHOTO HANDLERS ───────────────────────────────────────────────────────────
  const handleOpenAddPhoto = () => {
    setSelectedPhoto(null);
    setPhotoFormData(INITIAL_PHOTO_FORM);
    setIsPhotoModalOpen(true);
  };

  const handleOpenEditPhoto = (item) => {
    setSelectedPhoto(item);
    setPhotoFormData({
      title: item.title || '',
      imageUrl: item.imageUrl || '',
      category: item.category || 'General',
      description: item.description || '',
      order: item.order || 0,
      isPublished: item.isPublished ?? true,
    });
    setIsPhotoModalOpen(true);
  };

  const handlePhotoSubmit = async (e) => {
    e.preventDefault();
    if (!photoFormData.title.trim() || !photoFormData.imageUrl.trim()) {
      toast.error('Title and Image are required.');
      return;
    }

    try {
      setPhotoSubmitting(true);
      const payload = {
        ...photoFormData,
        order: Number(photoFormData.order) || 0,
      };

      if (selectedPhoto) {
        await galleryService.update(selectedPhoto._id, payload);
        toast.success(`Photo "${photoFormData.title}" updated.`);
      } else {
        await galleryService.create(payload);
        toast.success(`Photo "${photoFormData.title}" uploaded.`);
      }

      setIsPhotoModalOpen(false);
      fetchPhotos();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setPhotoSubmitting(false);
    }
  };

  const handlePhotoDelete = async () => {
    if (!selectedPhoto) return;
    try {
      setPhotoDeleting(true);
      await galleryService.delete(selectedPhoto._id);
      toast.success(`Photo "${selectedPhoto.title}" deleted.`);
      setIsPhotoDeleteOpen(false);
      fetchPhotos();
    } catch (err) {
      toast.error(err.message || 'Failed to delete photo.');
    } finally {
      setPhotoDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2.5">
            <HiOutlinePhoto className="text-gold-400 text-2xl" />
            <span>Gallery & Albums Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Organize campus photo albums, multi-image event galleries, and departmental photo streams.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'albums' ? (
            <button
              type="button"
              onClick={handleOpenAddAlbum}
              className="inline-flex items-center gap-2 px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-semibold shadow-lg shadow-navy-900/30 transition-all active:scale-95"
            >
              <HiPlus className="text-base" />
              <span>Create New Album</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpenAddPhoto}
              className="inline-flex items-center gap-2 px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-semibold shadow-lg shadow-navy-900/30 transition-all active:scale-95"
            >
              <HiPlus className="text-base" />
              <span>Upload Single Photo</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('albums')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'albums'
              ? 'bg-gold-500 text-navy-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <HiOutlineRectangleStack className="text-base" />
          <span>Albums & Event Collections</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-900/40 text-current">
            {albums.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('photos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'photos'
              ? 'bg-gold-500 text-navy-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <HiOutlinePhoto className="text-base" />
          <span>Individual Photos Stream</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-900/40 text-current">
            {photos.length}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ALBUMS & EVENT COLLECTIONS                                         */}
      {/* ========================================================================= */}
      {activeTab === 'albums' && (
        <div className="space-y-6">
          <ErrorAlert message={albumsError} onRetry={() => fetchAlbums(1)} />

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
              <input
                type="text"
                value={albumSearch}
                onChange={(e) => setAlbumSearch(e.target.value)}
                placeholder="Search albums by title or description..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={albumCategoryFilter}
                onChange={(e) => setAlbumCategoryFilter(e.target.value)}
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

              <select
                value={albumStatusFilter}
                onChange={(e) => setAlbumStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-gold-500 cursor-pointer w-full sm:w-auto"
              >
                <option value="All">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Hidden / Draft</option>
              </select>
            </div>
          </div>

          {/* Albums Grid */}
          {albumsLoading ? (
            <LoadingSpinner message="Loading photo albums..." />
          ) : albums.length === 0 ? (
            <EmptyState
              title="No albums found"
              description="Create rich photo albums with multiple images for campus events, hackathons, and ceremonies."
              actionText="+ Create Album"
              onAction={handleOpenAddAlbum}
              icon={HiOutlineRectangleStack}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {albums.map((album) => {
                const cover =
                  album.coverImage ||
                  (album.images && album.images[0] ? album.images[0].url : '') ||
                  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80';

                return (
                  <div
                    key={album._id}
                    className="group bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between"
                  >
                    <div className="relative aspect-video bg-slate-950 overflow-hidden">
                      <img
                        src={cover}
                        alt={album.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src =
                            'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                      <div className="absolute top-2 right-2 flex items-center gap-1">
                        <Badge variant={album.isPublished ? 'published' : 'draft'} size="xs">
                          {album.isPublished ? 'Published' : 'Hidden'}
                        </Badge>
                      </div>

                      <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-sm text-[10px] font-semibold text-white border border-slate-800">
                          {album.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-navy-900/90 text-gold-400 text-[10px] font-bold border border-navy-700">
                          {album.images?.length || 0} Photos
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold text-sm text-white group-hover:text-gold-400 transition-colors truncate">
                          {album.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                          <HiOutlineCalendar className="text-gold-400 text-xs" />
                          <span>
                            {album.eventDate
                              ? new Date(album.eventDate).toLocaleDateString()
                              : 'No date'}
                          </span>
                        </div>
                        {album.description && (
                          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">
                            {album.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-mono">
                          Order: {album.order ?? 0}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleTogglePublishAlbum(album)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              album.isPublished
                                ? 'text-emerald-400 hover:bg-emerald-500/10'
                                : 'text-amber-400 hover:bg-amber-500/10'
                            }`}
                            title={album.isPublished ? 'Hide Album' : 'Publish Album'}
                          >
                            {album.isPublished ? (
                              <HiOutlineCheckCircle className="text-base" />
                            ) : (
                              <HiOutlineEyeSlash className="text-base" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEditAlbum(album)}
                            className="p-1.5 text-slate-400 hover:text-gold-400 hover:bg-slate-800 rounded-lg transition-colors"
                            title="Edit Album & Photos"
                          >
                            <HiOutlinePencilSquare className="text-base" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedAlbum(album);
                              setIsAlbumDeleteOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                            title="Delete Album"
                          >
                            <HiOutlineTrash className="text-base" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {albumPagination.pages > 1 && (
            <div className="p-4 border-t border-slate-800">
              <Pagination
                currentPage={albumPagination.page}
                totalPages={albumPagination.pages}
                onPageChange={(page) => fetchAlbums(page)}
              />
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: INDIVIDUAL PHOTO STREAM (PRESERVED)                                */}
      {/* ========================================================================= */}
      {activeTab === 'photos' && (
        <div className="space-y-6">
          <ErrorAlert message={photosError} onRetry={fetchPhotos} />

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
              <input
                type="text"
                value={photoSearch}
                onChange={(e) => setPhotoSearch(e.target.value)}
                placeholder="Search individual photos..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500 transition-colors"
              />
            </div>

            <select
              value={photoCategoryFilter}
              onChange={(e) => setPhotoCategoryFilter(e.target.value)}
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

          {photosLoading ? (
            <LoadingSpinner message="Loading single photos..." />
          ) : photos.length === 0 ? (
            <EmptyState
              title="No standalone photos found"
              description="Upload single photos for campus laboratories, events, and facilities."
              actionText="+ Upload Photo"
              onAction={handleOpenAddPhoto}
              icon={HiOutlinePhoto}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((item) => (
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
                      <span className="text-[10px] text-slate-400 font-mono">
                        Order: {item.order ?? 0}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditPhoto(item)}
                          className="p-1.5 text-slate-400 hover:text-gold-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit Photo"
                        >
                          <HiOutlinePencilSquare className="text-base" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPhoto(item);
                            setIsPhotoDeleteOpen(true);
                          }}
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT ALBUM                                                */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isAlbumModalOpen}
        onClose={() => setIsAlbumModalOpen(false)}
        title={selectedAlbum ? `Edit Album: ${selectedAlbum.title}` : 'Create New Photo Album'}
        subtitle="Upload multiple images, organize captions, reorder items, and manage cover display."
        maxWidth="max-w-4xl"
      >
        <form onSubmit={handleAlbumSubmit} className="space-y-4">
          <input
            type="file"
            ref={multiFileInputRef}
            onChange={handleMultiFileUpload}
            multiple
            accept="image/*"
            className="hidden"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Album Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={albumFormData.title}
                onChange={(e) => {
                  const val = e.target.value;
                  setAlbumFormData((prev) => ({
                    ...prev,
                    title: val,
                    slug: selectedAlbum ? prev.slug : slugify(val),
                  }));
                }}
                placeholder="e.g. TechKriti 2026 Annual Hackathon"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">URL Slug</label>
              <input
                type="text"
                required
                value={albumFormData.slug}
                onChange={(e) =>
                  setAlbumFormData({ ...albumFormData, slug: slugify(e.target.value) })
                }
                placeholder="techkriti-2026-annual-hackathon"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Category</label>
              <select
                value={albumFormData.category}
                onChange={(e) =>
                  setAlbumFormData({ ...albumFormData, category: e.target.value })
                }
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-gold-500 cursor-pointer"
              >
                <option value="Events">Events</option>
                <option value="Campus">Campus</option>
                <option value="Department">Department</option>
                <option value="Labs">Labs</option>
                <option value="Students">Students</option>
                <option value="Activities">Activities</option>
                <option value="General">General</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Event Date</label>
              <input
                type="date"
                value={albumFormData.eventDate}
                onChange={(e) =>
                  setAlbumFormData({ ...albumFormData, eventDate: e.target.value })
                }
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Display Order</label>
              <input
                type="number"
                value={albumFormData.order}
                onChange={(e) =>
                  setAlbumFormData({ ...albumFormData, order: e.target.value })
                }
                placeholder="0"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Album Description</label>
            <textarea
              rows={2}
              value={albumFormData.description}
              onChange={(e) =>
                setAlbumFormData({ ...albumFormData, description: e.target.value })
              }
              placeholder="Brief description of the event, attendees, achievements..."
              className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
            />
          </div>

          {/* Multiple Image Upload & Image List */}
          <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <HiOutlinePhoto className="text-gold-400 text-sm" />
                  <span>Album Photos ({albumFormData.images.length})</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Upload multiple photos at once. Click star to set album cover.
                </p>
              </div>

              <button
                type="button"
                onClick={() => multiFileInputRef.current?.click()}
                disabled={uploadingMultiple}
                className="px-3.5 py-1.5 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow"
              >
                {uploadingMultiple ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>{uploadProgress || 'Uploading...'}</span>
                  </>
                ) : (
                  <>
                    <HiPlus className="text-sm" />
                    <span>Upload Images</span>
                  </>
                )}
              </button>
            </div>

            {albumFormData.images.length === 0 ? (
              <div className="py-8 text-center border-2 border-dashed border-slate-800 rounded-xl text-slate-400 text-xs">
                No images added to this album yet. Click "+ Upload Images" above.
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                {albumFormData.images.map((img, idx) => {
                  const isCover = albumFormData.coverImage === img.url;
                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border flex flex-col sm:flex-row items-center gap-3 transition-colors ${
                        isCover
                          ? 'bg-gold-500/10 border-gold-500/30'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <div className="relative w-16 h-14 rounded-lg bg-slate-950 overflow-hidden shrink-0 border border-slate-800">
                        <img
                          src={img.url}
                          alt={img.altText || 'Thumbnail'}
                          className="w-full h-full object-cover"
                        />
                        {isCover && (
                          <div className="absolute top-0.5 right-0.5 p-0.5 bg-gold-500 rounded text-navy-950 text-[8px] font-black">
                            ★
                          </div>
                        )}
                      </div>

                      {/* Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1 w-full text-xs">
                        <input
                          type="text"
                          value={img.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setAlbumFormData((prev) => {
                              const imgs = [...prev.images];
                              imgs[idx].title = val;
                              return { ...prev, images: imgs };
                            });
                          }}
                          placeholder="Photo title"
                          className="px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs placeholder-slate-400"
                        />
                        <input
                          type="text"
                          value={img.caption}
                          onChange={(e) => {
                            const val = e.target.value;
                            setAlbumFormData((prev) => {
                              const imgs = [...prev.images];
                              imgs[idx].caption = val;
                              return { ...prev, images: imgs };
                            });
                          }}
                          placeholder="Caption / description"
                          className="px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs placeholder-slate-400"
                        />
                        <input
                          type="text"
                          value={img.altText}
                          onChange={(e) => {
                            const val = e.target.value;
                            setAlbumFormData((prev) => {
                              const imgs = [...prev.images];
                              imgs[idx].altText = val;
                              return { ...prev, images: imgs };
                            });
                          }}
                          placeholder="Alt text"
                          className="px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs placeholder-slate-400"
                        />
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => setAlbumFormData({ ...albumFormData, coverImage: img.url })}
                          className={`p-1.5 rounded-lg text-xs transition-colors ${
                            isCover
                              ? 'text-gold-400 bg-gold-500/20'
                              : 'text-slate-400 hover:text-gold-400 hover:bg-slate-800'
                          }`}
                          title={isCover ? 'Current Cover Image' : 'Set as Album Cover'}
                        >
                          <HiOutlineStar className="text-sm" />
                        </button>

                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveImage(idx, -1)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 rounded-lg"
                          title="Move Up"
                        >
                          <HiOutlineArrowUp className="text-xs" />
                        </button>

                        <button
                          type="button"
                          disabled={idx === albumFormData.images.length - 1}
                          onClick={() => handleMoveImage(idx, 1)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 rounded-lg"
                          title="Move Down"
                        >
                          <HiOutlineArrowDown className="text-xs" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveImageFromAlbum(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg"
                          title="Remove Image"
                        >
                          <HiOutlineTrash className="text-sm" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Published Toggle */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isAlbumPublished"
              checked={albumFormData.isPublished}
              onChange={(e) =>
                setAlbumFormData({ ...albumFormData, isPublished: e.target.checked })
              }
              className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700 focus:ring-gold-500"
            />
            <label htmlFor="isAlbumPublished" className="text-xs font-semibold text-slate-300">
              Published on Public College Website
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAlbumModalOpen(false)}
              disabled={albumSubmitting}
              className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={albumSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-navy-900 hover:bg-navy-800 rounded-xl transition-all shadow-lg shadow-navy-900/40 disabled:opacity-50 flex items-center gap-2"
            >
              {albumSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : selectedAlbum ? (
                'Update Album'
              ) : (
                'Create Album'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT SINGLE PHOTO                                         */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        title={selectedPhoto ? 'Edit Photo Details' : 'Upload Single Photo'}
        subtitle="Upload photos for the campus photo stream."
        maxWidth="max-w-xl"
      >
        <form onSubmit={handlePhotoSubmit} className="space-y-4">
          <FileUpload
            label="Photo Image"
            accept="image/*"
            value={photoFormData.imageUrl}
            onChange={(url) => setPhotoFormData({ ...photoFormData, imageUrl: url })}
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
              value={photoFormData.title}
              onChange={(e) => setPhotoFormData({ ...photoFormData, title: e.target.value })}
              placeholder="e.g. Modern Computer Programming Lab 1"
              className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Category</label>
              <select
                value={photoFormData.category}
                onChange={(e) => setPhotoFormData({ ...photoFormData, category: e.target.value })}
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
                value={photoFormData.order}
                onChange={(e) => setPhotoFormData({ ...photoFormData, order: e.target.value })}
                placeholder="0"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Description / Caption</label>
            <textarea
              rows={2}
              value={photoFormData.description}
              onChange={(e) => setPhotoFormData({ ...photoFormData, description: e.target.value })}
              placeholder="Brief description or caption for the photo..."
              className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isSinglePhotoPublished"
              checked={photoFormData.isPublished}
              onChange={(e) => setPhotoFormData({ ...photoFormData, isPublished: e.target.checked })}
              className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700 focus:ring-gold-500"
            />
            <label htmlFor="isSinglePhotoPublished" className="text-xs font-semibold text-slate-300">
              Published on Public College Website
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsPhotoModalOpen(false)}
              disabled={photoSubmitting}
              className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={photoSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-navy-900 hover:bg-navy-800 rounded-xl transition-all shadow-lg shadow-navy-900/40 disabled:opacity-50 flex items-center gap-2"
            >
              {photoSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : selectedPhoto ? (
                'Update Photo'
              ) : (
                'Upload Photo'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Album Confirm Dialog */}
      <ConfirmDialog
        isOpen={isAlbumDeleteOpen}
        onClose={() => setIsAlbumDeleteOpen(false)}
        onConfirm={handleAlbumDelete}
        title="Delete Photo Album"
        message={`Are you sure you want to permanently delete the album "${selectedAlbum?.title}" and all its associated photos?`}
        confirmText="Confirm Delete"
        isDeleting={albumDeleting}
      />

      {/* Delete Single Photo Confirm Dialog */}
      <ConfirmDialog
        isOpen={isPhotoDeleteOpen}
        onClose={() => setIsPhotoDeleteOpen(false)}
        onConfirm={handlePhotoDelete}
        title="Delete Photo"
        message={`Are you sure you want to permanently delete "${selectedPhoto?.title}" from the gallery?`}
        confirmText="Confirm Delete"
        isDeleting={photoDeleting}
      />
    </div>
  );
}
