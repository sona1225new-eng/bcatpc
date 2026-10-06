import React, { useEffect } from 'react';
import { HiX, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

export default function Lightbox({ image, onClose, onPrev, onNext }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext]);

  if (!image) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-20 focus:outline-none"
        aria-label="Close Preview"
      >
        <HiX className="w-6 h-6" />
      </button>

      {/* Navigation: Prev */}
      {onPrev && (
        <button
          type="button"
          onClick={onPrev}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors z-20 focus:outline-none"
          aria-label="Previous Image"
        >
          <HiChevronLeft className="w-7 h-7" />
        </button>
      )}

      {/* Main Image and details */}
      <div className="max-w-5xl max-h-[90vh] flex flex-col items-center justify-center text-center">
        <img
          src={image.imageUrl}
          alt={image.title}
          className="max-h-[75vh] w-auto max-w-full rounded-xl shadow-2xl object-contain"
        />
        <div className="mt-4 text-white max-w-2xl px-4">
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 text-slate-950 mb-1.5">
            {image.category}
          </span>
          <h3 className="text-lg sm:text-xl font-bold">{image.title}</h3>
          {image.description && (
            <p className="text-xs sm:text-sm text-slate-300 mt-1">{image.description}</p>
          )}
        </div>
      </div>

      {/* Navigation: Next */}
      {onNext && (
        <button
          type="button"
          onClick={onNext}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors z-20 focus:outline-none"
          aria-label="Next Image"
        >
          <HiChevronRight className="w-7 h-7" />
        </button>
      )}
    </div>
  );
}
