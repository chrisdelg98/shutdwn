import { Power } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="flex w-72 flex-col items-center gap-6">
      <div className="flex items-center gap-2 text-primary">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
        </span>
        <span className="text-xs font-medium uppercase tracking-wider">
          Active
        </span>
      </div>

      <CountdownRing remainingMs={remainingMs} progress={progress} />

      <div className="flex flex-col items-center gap-1">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Shutdown at
        </p>
        <p className="font-mono text-lg font-medium tabular-nums">
          {formatTargetTime(targetUnixMs)}
        </p>
      </div>

      <Button
        variant="destructive"
        size="lg"
        className="w-full"
        onClick={onCancel}
      >
        <Power className="h-4 w-4" />
        Cancel
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Press <Kbd>Esc</Kbd> to cancel
      </p>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="mx-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-muted px-1 font-mono text-[10px] text-foreground">
      {children}
    </kbd>
  );
}
