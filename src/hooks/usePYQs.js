import { useState, useEffect, useCallback } from 'react';
import { pyqService } from '../services/pyqService';

export function usePYQs({ semester = "all", subject = "", year = "all", search = "", limit = null } = {}) {
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPYQs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await pyqService.getAll({ semester, subject, year, search, limit });
      setPyqs(res.data || []);
    } catch (err) {
      setError(err.message || "Failed to load previous year question papers.");
    } finally {
      setLoading(false);
    }
  }, [semester, subject, year, search, limit]);

  useEffect(() => {
    fetchPYQs();
  }, [fetchPYQs]);

  return { pyqs, loading, error, refetch: fetchPYQs };
}

export function useSemesterPYQs(semesterId) {
  const [data, setData] = useState({ semester: null, papers: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      if (!semesterId) return;
      try {
        setLoading(true);
        setError(null);
        const res = await pyqService.getBySemester(semesterId);
        if (isMounted) setData(res.data);
      } catch (err) {
        if (isMounted) setError(err.message || "Failed to load semester PYQs.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [semesterId]);

  return { semester: data.semester, papers: data.papers, loading, error };
}

export function usePYQDetail(id) {
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const res = await pyqService.getById(id);
        if (isMounted) setPaper(res.data);
      } catch (err) {
        if (isMounted) setError(err.message || "Question paper not found.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [id]);

  return { paper, loading, error };
}
