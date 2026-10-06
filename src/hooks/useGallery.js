import { useState, useEffect } from 'react';
import { galleryService } from '../services/galleryService';

export function useGallery(category = "All") {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const [imgsRes, catsRes] = await Promise.all([
          galleryService.getAll({ category }),
          galleryService.getCategories(),
        ]);
        if (isMounted) {
          setImages(imgsRes.data || []);
          if (catsRes.data) setCategories(catsRes.data);
        }
      } catch (err) {
        if (isMounted) setError(err.message || "Failed to load gallery images.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [category]);

  return { images, categories, loading, error };
}
