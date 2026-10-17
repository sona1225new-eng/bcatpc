import React from 'react';
import { getPublicFileUrl } from '../../services/api';

const FALLBACK_IMAGE = '/college-campus.png';

export default function GalleryImage({ src, ...props }) {
  return (
    <img
      {...props}
      src={getPublicFileUrl(src) || FALLBACK_IMAGE}
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.alt = `Image unavailable: ${props.alt || 'Gallery image'}`;
        event.currentTarget.title = 'This gallery image could not be loaded.';
        event.currentTarget.src = FALLBACK_IMAGE;
      }}
    />
  );
}
