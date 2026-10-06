import { useState, useEffect } from 'react';
import { academicService } from '../services/academicService';

export function useAcademics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await academicService.getAll();
        if (isMounted) setData(res.data);
      } catch (err) {
        if (isMounted) setError(err.message || "Failed to load academics data.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  return { academics: data, loading, error };
}
