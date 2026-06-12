import { Power } from "lucide-react";
import { CountdownRing } from "@/components/countdown-ring";
import { formatTargetTime } from "@/lib/format";

interface ActiveViewProps {
  targetUnixMs: number;
  remainingMs: number;
  progress: number;
  onCancel: () => void;
}

export function ActiveView({
  targetUnixMs,
  remainingMs,
  progress,
  onCancel,
}: ActiveViewProps) {
  return (
    <div className="flex w-80 flex-col items-center gap-6">
      <div className="flex items-center gap-2 text-[var(--accent-strong)]">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-strong)] opacity-60"></span>
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--accent-strong)]"></span>
        </span>
        <span className="text-sm font-extrabold uppercase tracking-[0.22em]">
          Active
        </span>
      </div>

      <CountdownRing remainingMs={remainingMs} progress={progress} />

      <div className="flex flex-col items-center gap-0.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Shutdown at
        </p>
        <p className="font-mono text-xl font-bold tabular-nums">
          {formatTargetTime(targetUnixMs)}
        </p>
      </div>

      <button
        type="button"
        onClick={onCancel}
        aria-label="Cancel timer"
        className="group relative flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border-[3px] border-destructive bg-background text-destructive transition-all duration-150 hover:bg-[color-mix(in_oklch,var(--destructive)_10%,transparent)] hover:shadow-[0_0_12px_color-mix(in_oklch,var(--destructive)_35%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95"
      >
        <Power className="h-10 w-10" strokeWidth={2.25} />
      </button>

      <p className="text-[11px] text-muted-foreground">
        Press <Kbd>Esc</Kbd> to cancel
      </p>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="mx-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-muted px-1 font-mono text-[11px] text-foreground">
      {children}
    </kbd>
  );
}
