import { useEffect, useRef, useState } from "react";
import { Bell, Minimize2, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/hooks/use-settings";

export function SettingsPopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { settings, update } = useSettings();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((o) => !o)}
        aria-label="Settings"
        title="Settings"
      >
        <SettingsIcon className="h-4 w-4" />
      </Button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-2 w-72 rounded-md border border-border bg-card p-1 shadow-lg">
          <div className="border-b border-border px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Settings
            </p>
          </div>

          <Row
            icon={<Bell className="h-4 w-4" />}
            title="Notify 1 min before"
            subtitle="Show a desktop notification"
            checked={settings.notifyOneMinute}
            onChange={(v) => update({ notifyOneMinute: v })}
          />

          <Row
            icon={<Minimize2 className="h-4 w-4" />}
            title="Close minimizes to tray"
            subtitle="Keep app running in the background"
            checked={settings.closeToTray}
            onChange={(v) => update({ closeToTray: v })}
          />
        </div>
      )}
    </div>
  );
}

interface RowProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function Row({ icon, title, subtitle, checked, onChange }: RowProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-sm px-3 py-2.5 hover:bg-accent">
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground">{icon}</span>
        <div className="flex flex-col">
          <span className="text-sm font-medium leading-tight">{title}</span>
          <span className="text-[11px] text-muted-foreground leading-tight">
            {subtitle}
          </span>
        </div>
      </div>
      <Switch checked={checked} onChange={onChange} aria-label={title} />
    </label>
  );
}
