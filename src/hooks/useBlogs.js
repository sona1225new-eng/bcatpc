import { useState, useEffect, useCallback } from 'react';
import { blogService } from '../services/blogService';

export function useBlogs({ category = "All", search = "", limit = null } = {}) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await blogService.getAll({ category, search, limit });
      setBlogs(res.data || []);
    } catch (err) {
      setError(err.message || "Failed to load blog articles.");
    } finally {
      setLoading(false);
    }
  }, [category, search, limit]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return { blogs, loading, error, refetch: fetchBlogs };
}

export function useBlogDetail(idOrSlug) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      if (!idOrSlug) return;
      try {
        setLoading(true);
        setError(null);
        const res = await blogService.getById(idOrSlug);
        if (isMounted) setBlog(res.data);
      } catch (err) {
        if (isMounted) setError(err.message || "Blog article not found.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [idOrSlug]);

  return { blog, loading, error };
}
