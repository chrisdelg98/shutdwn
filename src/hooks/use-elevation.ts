import { useCallback, useEffect, useState } from "react";
import {
  getElevationStatus,
  installElevation,
  type ElevationStatus,
} from "@/lib/elevation-api";

export function useElevation() {
  const [status, setStatus] = useState<ElevationStatus | null>(null);
  const [installing, setInstalling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getElevationStatus()
      .then(setStatus)
      .catch(() => {});
  }, []);

  const install = useCallback(async () => {
    setInstalling(true);
    setError(null);
    try {
      const next = await installElevation();
      setStatus(next);
      return next;
    } catch (e) {
      setError(String(e));
      throw e;
    } finally {
      setInstalling(false);
    }
  }, []);

  return { status, install, installing, error };
}
