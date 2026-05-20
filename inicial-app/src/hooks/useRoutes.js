import { useCallback, useEffect, useState } from 'react';
import { routesService } from '../services/routesService';
import { getErrorMessage } from '../utils/errors';
import { useAuth } from './useAuth';
import { ROLES } from '../constants/roles';

export function useRoutes({ autoFetch = true } = {}) {
  const { profile } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRoutes = useCallback(async () => {
    if (!profile?.id) return [];
    setLoading(true);
    setError(null);
    try {
      const data =
        profile.role === ROLES.ADMIN
          ? await routesService.listAll()
          : await routesService.listByCollector(profile.id);
      setRoutes(data);
      return data;
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [profile?.id, profile?.role]);

  useEffect(() => {
    if (autoFetch && profile?.id) {
      fetchRoutes();
    }
  }, [autoFetch, profile?.id, fetchRoutes]);

  return { routes, loading, error, fetchRoutes };
}
