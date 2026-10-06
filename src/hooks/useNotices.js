import { useState, useEffect, useCallback } from 'react';
import { noticeService } from '../services/noticeService';

export function useNotices({ category = "All", search = "", limit = null } = {}) {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await noticeService.getAll({ category, search, limit });
      setNotices(res.data || []);
    } catch (err) {
      setError(err.message || "Failed to load notices.");
    } finally {
      setLoading(false);
    }
  }, [category, search, limit]);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  return { notices, loading, error, refetch: fetchNotices };
}

export function useNoticeDetail(id) {
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const res = await noticeService.getById(id);
        if (isMounted) setNotice(res.data);
      } catch (err) {
        if (isMounted) setError(err.message || "Notice not found.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [id]);

  return { notice, loading, error };
}
