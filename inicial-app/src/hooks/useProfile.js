import { useCallback, useState } from "react";
import { profileService } from "../services/profileService";
import { getErrorMessage } from "../utils/errors";
import { useAuth } from "./useAuth";

export function useProfile() {
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProfile = useCallback(
    async (updates) => {
      if (!profile?.id) return null;
      setLoading(true);
      setError(null);
      try {
        await profileService.updateProfile(profile.id, updates);
        return await refreshProfile();
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [profile?.id, refreshProfile],
  );

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile,
  };
}
