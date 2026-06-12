import { invoke } from "@tauri-apps/api/core";

export interface ElevationStatus {
  platform: "windows" | "macos" | "linux";
  needed: boolean;
  configured: boolean;
}

export function getElevationStatus(): Promise<ElevationStatus> {
  return invoke<ElevationStatus>("get_elevation_status");
}

export function installElevation(): Promise<ElevationStatus> {
  return invoke<ElevationStatus>("install_elevation");
}
