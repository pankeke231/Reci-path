import { useCallback, useEffect, useState } from "react";
import { adminService } from "../services/adminService";
import { getErrorMessage } from "../utils/errors";

export function useCollectors({ autoFetch = true } = {}) {
  const [collectors, setCollectors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCollectors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.listCollectors();
      setCollectors(data);
      return data;
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) fetchCollectors();
  }, [autoFetch, fetchCollectors]);

  return {
    collectors,
    loading,
    error,
    fetchCollectors,
    setCollectors,
  };
}
