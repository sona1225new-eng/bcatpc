import { useState, useEffect } from 'react';
import { facultyService } from '../services/facultyService';

export function useFaculties() {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const res = await facultyService.getAll();
        if (isMounted) {
          setFaculties(res.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load faculty members.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  return { faculties, loading, error };
}

export function useFacultyDetail(id) {
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadDetail() {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const res = await facultyService.getById(id);
        if (isMounted) {
          setFaculty(res.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Faculty member not found.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadDetail();
    return () => { isMounted = false; };
  }, [id]);

  return { faculty, loading, error };
}
