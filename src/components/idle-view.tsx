import { useState } from "react";
import { Minus, Plus, Power } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IdleViewProps {
  onStart: (minutes: number) => void;
}

const PRESETS: Array<{ label: string; minutes: number }> = [
  { label: "15 min", minutes: 15 },
  { label: "30 min", minutes: 30 },
  { label: "1 hour", minutes: 60 },
  { label: "2 hours", minutes: 120 },
];

export function IdleView({ onStart }: IdleViewProps) {
  const [customOpen, setCustomOpen] = useState(false);
  const [minutes, setMinutes] = useState(45);

  const clamp = (n: number) => Math.min(720, Math.max(1, n));

  return (
    <div className="flex w-72 flex-col items-center gap-6">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Power className="h-3.5 w-3.5" />
        <span className="text-xs font-medium uppercase tracking-wider">
          Idle
        </span>
      </div>

      <div className="grid w-full grid-cols-2 gap-3">
        {PRESETS.map((p) => (
          <Button
            key={p.minutes}
            variant="secondary"
            size="xl"
            onClick={() => onStart(p.minutes)}
          >
            {p.label}
          </Button>
        ))}
      </div>

      {!customOpen ? (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setCustomOpen(true)}
        >
          Custom time
        </Button>
      ) : (
        <div className="flex w-full items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setMinutes((m) => clamp(m - 5))}
            aria-label="Decrease 5 minutes"
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
              className="h-10 w-full rounded-md border border-input bg-background pr-12 text-center font-mono text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              min
            </span>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setMinutes((m) => clamp(m + 5))}
            aria-label="Increase 5 minutes"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button onClick={() => onStart(minutes)}>Start</Button>
        </div>
      )}

      <p className="mt-2 text-center text-xs text-muted-foreground">
        Press <Kbd>1</Kbd> <Kbd>2</Kbd> <Kbd>3</Kbd> <Kbd>4</Kbd> for presets
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
