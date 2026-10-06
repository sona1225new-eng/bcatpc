import { useState, useEffect, useCallback } from 'react';
import { campusUpdateService } from '../services/campusUpdateService';

export function useCampusUpdates({ category = "All", search = "", limit = null } = {}) {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUpdates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await campusUpdateService.getAll({ category, search, limit });
      setUpdates(res.data || []);
    } catch (err) {
      setError(err.message || "Failed to load campus updates.");
    } finally {
      setLoading(false);
    }
  }, [category, search, limit]);

  useEffect(() => {
    fetchUpdates();
  }, [fetchUpdates]);

  return { updates, loading, error, refetch: fetchUpdates };
}

export function useCampusUpdateDetail(id) {
  const [update, setUpdate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const res = await campusUpdateService.getById(id);
        if (isMounted) setUpdate(res.data);
      } catch (err) {
        if (isMounted) setError(err.message || "Campus update not found.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [id]);

  return { update, loading, error };
}
