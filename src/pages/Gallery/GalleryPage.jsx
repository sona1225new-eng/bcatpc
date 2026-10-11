import React, { useState, useEffect } from 'react';
import { useGallery } from '../../hooks/useGallery';
import { galleryService } from '../../services/galleryService';
import GalleryCard from '../../components/cards/GalleryCard';
import Lightbox from '../../components/gallery/Lightbox';
import PageHeader from '../../components/common/PageHeader';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import {
  HiOutlineRectangleStack,
  HiOutlinePhoto,
  HiOutlineCalendar,
  HiOutlineArrowLeft,
  HiOutlineEye,
} from 'react-icons/hi2';

export default function GalleryPage() {
  const [viewMode, setViewMode] = useState('albums'); // 'albums' | 'stream'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxList, setLightboxList] = useState([]);

  // Albums State
  const [albums, setAlbums] = useState([]);
  const [albumsLoading, setAlbumsLoading] = useState(true);
  const [albumsError, setAlbumsError] = useState(null);
  const [activeAlbum, setActiveAlbum] = useState(null); // When user clicks to open an album

  // Single photos state (from existing hook)
  const { images: streamImages, categories, loading: streamLoading, error: streamError } = useGallery(selectedCategory);

  // Fetch albums
  useEffect(() => {
    let isMounted = true;
    async function loadAlbums() {
      try {
        setAlbumsLoading(true);
        setAlbumsError(null);
        const res = await galleryService.getAlbums({ category: selectedCategory });
        if (isMounted) {
          setAlbums(res.data || []);
        }
      } catch (err) {
        if (isMounted) setAlbumsError(err.message || 'Failed to load photo albums.');
      } finally {
        if (isMounted) setAlbumsLoading(false);
      }
    }

    loadAlbums();
    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  const breadcrumbs = activeAlbum
    ? [
        { label: 'Gallery', href: '/gallery' },
        { label: 'Albums', href: '#' },
        { label: activeAlbum.title },
      ]
    : [
        { label: 'Gallery', href: '/gallery' },
        { label: viewMode === 'albums' ? 'Event Albums' : 'Photo Stream' },
      ];

  const handleOpenLightbox = (item, list) => {
    // Normalize image object so Lightbox can display it properly
    const normalized = {
      ...item,
      imageUrl: item.imageUrl || item.url,
      id: item.id || item._id || item.url,
    };
    setLightboxList(list.map((img) => ({
      ...img,
      imageUrl: img.imageUrl || img.url,
      id: img.id || img._id || img.url,
    })));
    setLightboxImage(normalized);
  };

  const handleCloseLightbox = () => {
    setLightboxImage(null);
  };

  const handlePrev = () => {
    if (!lightboxImage || lightboxList.length === 0) return;
    const currentIndex = lightboxList.findIndex((img) => img.id === lightboxImage.id);
    const prevIndex = (currentIndex - 1 + lightboxList.length) % lightboxList.length;
    setLightboxImage(lightboxList[prevIndex]);
  };

  const handleNext = () => {
    if (!lightboxImage || lightboxList.length === 0) return;
    const currentIndex = lightboxList.findIndex((img) => img.id === lightboxImage.id);
    const nextIndex = (currentIndex + 1) % lightboxList.length;
    setLightboxImage(lightboxList[nextIndex]);
  };

  return (
    <div>
      <PageHeader
        badge="CAMPUS LIFE & INFRASTRUCTURE"
        title={activeAlbum ? activeAlbum.title : 'Department Photo & Video'}
        highlight={activeAlbum ? '' : 'Gallery'}
        description={
          activeAlbum
            ? activeAlbum.description || `Viewing photographs from ${activeAlbum.title}.`
            : 'Glimpses into our computing laboratories, academic campus, TechKriti hackathons, student coding clubs, seminars, and alumni celebrations.'
        }
        breadcrumbs={breadcrumbs}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        {/* If viewing a specific album */}
        {activeAlbum ? (
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <button
                type="button"
                onClick={() => setActiveAlbum(null)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 font-bold text-xs sm:text-sm transition-all shadow-xs"
              >
                <HiOutlineArrowLeft className="text-base" />
                <span>← Back to All Albums</span>
              </button>

              <div className="flex items-center gap-3 text-xs text-slate-500">
                {activeAlbum.eventDate && (
                  <span className="flex items-center gap-1 font-medium">
                    <HiOutlineCalendar className="text-amber-600" />
                    <span>{new Date(activeAlbum.eventDate).toLocaleDateString()}</span>
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 font-bold text-slate-700">
                  {activeAlbum.images?.length || 0} Photos
                </span>
              </div>
            </div>

            {/* Album Images Grid */}
            {activeAlbum.images && activeAlbum.images.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {activeAlbum.images.map((item, idx) => {
                  const cardItem = {
                    id: item._id || idx,
                    imageUrl: item.url,
                    title: item.title || activeAlbum.title,
                    description: item.caption || item.altText,
                    category: activeAlbum.category,
                  };
                  return (
                    <GalleryCard
                      key={item._id || idx}
                      item={cardItem}
                      onClick={() => handleOpenLightbox(cardItem, activeAlbum.images)}
                    />
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title="No photographs in this album"
                message="This album currently does not contain any images."
                actionText="Back to Albums"
                onAction={() => setActiveAlbum(null)}
              />
            )}
          </div>
        ) : (
          <>
            {/* View Mode & Category Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200">
              {/* Mode Toggle */}
              <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setViewMode('albums')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    viewMode === 'albums'
                      ? 'bg-[#233B5D] text-amber-400 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <HiOutlineRectangleStack className="text-base" />
                  <span>Event Albums</span>
                  {albums.length > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900/40">
                      {albums.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('stream')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    viewMode === 'stream'
                      ? 'bg-[#233B5D] text-amber-400 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <HiOutlinePhoto className="text-base" />
                  <span>All Photographs</span>
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-end">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedCategory === cat
                        ? 'bg-amber-500 text-slate-950 font-extrabold shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode 1: ALBUMS VIEW */}
            {viewMode === 'albums' && (
              <>
                {albumsLoading ? (
                  <LoadingState message="Loading event albums..." count={6} />
                ) : albumsError ? (
                  <ErrorState message={albumsError} />
                ) : albums.length === 0 ? (
                  <EmptyState
                    title="No albums found"
                    message={`No photo albums published under '${selectedCategory}'.`}
                    actionText="View Individual Photos"
                    onAction={() => setViewMode('stream')}
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
                    {albums.map((album) => (
                      <div
                        key={album._id}
                        onClick={async () => {
                          try {
                            const res = await galleryService.getAlbumBySlug(album.slug);
                            setActiveAlbum(res.data);
                          } catch (err) {
                            setActiveAlbum(album);
                          }
                        }}
                        className="group relative rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
                      >
                        {/* Cover Image */}
                        <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                          <img
                            src={
                              album.coverImage ||
                              'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80'
                            }
                            alt={album.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                          {/* Category Badge */}
                          <div className="absolute top-3 left-3">
                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-navy-950/80 backdrop-blur-md text-amber-400 border border-amber-400/30">
                              {album.category}
                            </span>
                          </div>

                          {/* Image count pill */}
                          <div className="absolute bottom-3 right-3">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-950/80 backdrop-blur-md text-white border border-slate-700 flex items-center gap-1.5 shadow">
                              <HiOutlinePhoto className="text-amber-400" />
                              <span>{album.imageCount || 0} Photos</span>
                            </span>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
                              <HiOutlineCalendar className="text-amber-600 text-sm" />
                              <span>
                                {album.eventDate
                                  ? new Date(album.eventDate).toLocaleDateString(undefined, {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                    })
                                  : 'Event Archive'}
                              </span>
                            </div>
                            <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                              {album.title}
                            </h3>
                            {album.description && (
                              <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                                {album.description}
                              </p>
                            )}
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#233B5D] group-hover:text-amber-600">
                            <span>Open Album Collection</span>
                            <span>→</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Mode 2: INDIVIDUAL PHOTO STREAM (PRESERVED) */}
            {viewMode === 'stream' && (
              <>
                {streamLoading ? (
                  <LoadingState message="Loading photographs..." count={6} />
                ) : streamError ? (
                  <ErrorState message={streamError} />
                ) : streamImages.length === 0 ? (
                  <EmptyState
                    title="No photographs available"
                    message={`No images found under '${selectedCategory}'.`}
                    actionText="Show All Images"
                    onAction={() => setSelectedCategory('All')}
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {streamImages.map((item) => (
                      <GalleryCard
                        key={item.id}
                        item={item}
                        onClick={() => handleOpenLightbox(item, streamImages)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <Lightbox
          image={lightboxImage}
          onClose={handleCloseLightbox}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
