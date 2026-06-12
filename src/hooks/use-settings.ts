import { useCallback, useEffect, useState } from "react";
import {
  defaultSettings,
  setSettings as pushSettings,
  type Settings,
} from "@/lib/settings-api";

const STORAGE_KEY = "shutdwn-settings";

function readStored(): Settings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return defaultSettings;
}

export function useSettings() {
  const [settings, setSettingsState] = useState<Settings>(readStored);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    pushSettings(settings).catch(() => {});
  }, [settings]);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettingsState((prev) => ({ ...prev, ...patch }));
  }, []);

  return { settings, update };
}
