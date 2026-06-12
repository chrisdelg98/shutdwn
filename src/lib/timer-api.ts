import { invoke } from "@tauri-apps/api/core";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";

export interface TimerStatus {
  active: boolean;
  targetUnixMs: number | null;
  durationMs: number | null;
  remainingMs: number | null;
}

export const idleStatus: TimerStatus = {
  active: false,
  targetUnixMs: null,
  durationMs: null,
  remainingMs: null,
};

export function getStatus(): Promise<TimerStatus> {
  return invoke<TimerStatus>("get_status");
}

export function startTimer(minutes: number): Promise<TimerStatus> {
  return invoke<TimerStatus>("start_timer", { minutes });
}

export function cancelTimer(): Promise<TimerStatus> {
  return invoke<TimerStatus>("cancel_timer");
}

export function onTimerChanged(
  cb: (s: TimerStatus) => void,
): Promise<UnlistenFn> {
  return listen<TimerStatus>("timer-changed", (e) => cb(e.payload));
}

export function onTimerFired(cb: () => void): Promise<UnlistenFn> {
  return listen("timer-fired", () => cb());
}
