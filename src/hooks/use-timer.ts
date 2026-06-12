import { useEffect, useState } from "react";
import {
  cancelTimer as apiCancel,
  getStatus,
  idleStatus,
  onTimerChanged,
  startTimer as apiStart,
  type TimerStatus,
} from "@/lib/timer-api";

export function useTimer() {
  const [status, setStatus] = useState<TimerStatus>(idleStatus);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let unlisten: (() => void) | undefined;
    getStatus()
      .then(setStatus)
      .catch(() => {});
    onTimerChanged(setStatus).then((fn) => {
      unlisten = fn;
    });
    return () => unlisten?.();
  }, []);

  useEffect(() => {
    if (!status.active) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [status.active]);

  const remainingMs =
    status.targetUnixMs != null ? Math.max(0, status.targetUnixMs - now) : 0;

  const progress =
    status.durationMs && status.durationMs > 0
      ? Math.min(1, Math.max(0, 1 - remainingMs / status.durationMs))
      : 0;

  return {
    status,
    remainingMs,
    progress,
    start: async (minutes: number) => setStatus(await apiStart(minutes)),
    cancel: async () => setStatus(await apiCancel()),
  };
}
