import { useState } from "react";
import { Clock, Minus, Play, Plus, Power } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IdleViewProps {
  onStart: (minutes: number) => void;
}

const PRESETS: Array<{ label: string; minutes: number; hint: string }> = [
  { label: "15", minutes: 15, hint: "min" },
  { label: "30", minutes: 30, hint: "min" },
  { label: "1", minutes: 60, hint: "hour" },
  { label: "2", minutes: 120, hint: "hours" },
];

export function IdleView({ onStart }: IdleViewProps) {
  const [minutes, setMinutes] = useState(45);
  const clamp = (n: number) => Math.min(720, Math.max(1, n));

  return (
    <div className="flex w-80 flex-col items-center gap-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Power className="h-4 w-4" strokeWidth={2.75} />
        <span className="text-sm font-extrabold uppercase tracking-[0.22em]">
          Idle
        </span>
      </div>

      <div className="grid w-full grid-cols-2 gap-2.5">
        {PRESETS.map((p) => (
          <Button
            key={p.minutes}
            variant="preset"
            size="xl"
            onClick={() => onStart(p.minutes)}
            className="group flex-col gap-0.5"
          >
            <span className="font-mono text-2xl font-bold leading-none tabular-nums">
              {p.label}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground group-hover:text-foreground">
              {p.hint}
            </span>
          </Button>
        ))}
      </div>

      <div className="flex w-full items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Custom
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="w-full rounded-md border border-border bg-card/80 p-3 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setMinutes((m) => clamp(m - 5))}
            aria-label="Decrease 5 minutes"
            className="h-10 w-10 shrink-0"
          >
            <Minus className="h-4 w-4" />
          </Button>

          <div className="relative flex-1">
            <input
              type="number"
              min={1}
              max={720}
              value={minutes}
              onChange={(e) =>
                setMinutes(clamp(Number.parseInt(e.target.value, 10) || 1))
              }
              className="h-10 w-full rounded-md border border-input bg-background pr-10 text-center font-mono text-lg font-semibold tabular-nums text-foreground caret-[var(--accent-strong)] outline-none focus-visible:border-[var(--accent-strong)] focus-visible:shadow-[0_0_0_2px_var(--accent-glow)]"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              min
            </span>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setMinutes((m) => clamp(m + 5))}
            aria-label="Increase 5 minutes"
            className="h-10 w-10 shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="default"
          size="lg"
          className="mt-3 w-full"
          onClick={() => onStart(minutes)}
        >
          <Play className="h-4 w-4 fill-current" />
          Start countdown
        </Button>
      </div>

      <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
        <Clock className="h-3 w-3" />
        Press <Kbd>1</Kbd> <Kbd>2</Kbd> <Kbd>3</Kbd> <Kbd>4</Kbd> for presets
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
