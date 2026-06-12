import { invoke } from "@tauri-apps/api/core";

export interface Settings {
  notifyOneMinute: boolean;
  closeToTray: boolean;
}

export const defaultSettings: Settings = {
  notifyOneMinute: true,
  closeToTray: true,
};

export function getSettings(): Promise<Settings> {
  return invoke<Settings>("get_settings");
}

export function setSettings(settings: Settings): Promise<Settings> {
  return invoke<Settings>("set_settings", { settings });
}
