import React, { useState } from 'react';
import { useGallery } from '../../hooks/useGallery';
import GalleryCard from '../../components/cards/GalleryCard';
import Lightbox from '../../components/gallery/Lightbox';
import PageHeader from '../../components/common/PageHeader';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxImage, setLightboxImage] = useState(null);

  const { images, categories, loading, error } = useGallery(selectedCategory);

  const breadcrumbs = [
    { label: "Gallery", href: "/gallery" },
    { label: "Department Photo Stream" }
  ];

  const handleOpenLightbox = (item) => {
    setLightboxImage(item);
  };

  const handleCloseLightbox = () => {
    setLightboxImage(null);
  };

  const handlePrev = () => {
    if (!lightboxImage) return;
    const currentIndex = images.findIndex((img) => img.id === lightboxImage.id);
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setLightboxImage(images[prevIndex]);
  };

  const handleNext = () => {
    if (!lightboxImage) return;
    const currentIndex = images.findIndex((img) => img.id === lightboxImage.id);
    const nextIndex = (currentIndex + 1) % images.length;
    setLightboxImage(images[nextIndex]);
  };

  return (
    <div>
      <PageHeader
        badge="CAMPUS LIFE & INFRASTRUCTURE"
        title="Department Photo & Video"
        highlight="Gallery"
        description="Glimpses into our computing laboratories, academic campus, TechKriti hackathons, student coding clubs, seminars, and alumni celebrations."
        breadcrumbs={breadcrumbs}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        
        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap pb-4 border-b border-slate-200">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-150 ${
                selectedCategory === cat
                  ? 'bg-[#233B5D] text-amber-400 shadow-md'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat === 'All' ? 'All Photographs' : cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <LoadingState message="Loading gallery album..." count={6} />
        ) : error ? (
          <ErrorState message={error} />
        ) : images.length === 0 ? (
          <EmptyState
            title="No photographs available"
            message={`No images found under '${selectedCategory}'.`}
            actionText="Show All Images"
            onAction={() => setSelectedCategory('All')}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((item) => (
              <GalleryCard
                key={item.id}
                item={item}
                onClick={handleOpenLightbox}
              />
            ))}
          </div>
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
