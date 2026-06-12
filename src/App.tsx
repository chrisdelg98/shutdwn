import { useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { IdleView } from "@/components/idle-view";
import { ActiveView } from "@/components/active-view";
import { BackgroundFx } from "@/components/background-fx";
import { useTimer } from "@/hooks/use-timer";

function AppShell() {
  const { status, remainingMs, progress, start, cancel } = useTimer();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "Escape") {
        if (status.active) cancel();
        return;
      }
      if (status.active) return;
      const map: Record<string, number> = {
        "1": 15,
        "2": 30,
        "3": 60,
        "4": 120,
      };
      const minutes = map[e.key];
      if (minutes) start(minutes);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [status.active, start, cancel]);

  return (
    <main className="relative flex h-screen w-screen flex-col items-center justify-center bg-background text-foreground">
      <BackgroundFx />

      <div className="absolute right-3 top-3 z-20">
        <ThemeToggle />
      </div>

      <div className="absolute left-4 top-3 z-20 flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-[var(--accent-strong)] shadow-[0_0_8px_var(--accent-glow)]" />
        <h1 className="text-base font-bold tracking-tight">shutdwn</h1>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {status.active && status.targetUnixMs != null ? (
          <ActiveView
            targetUnixMs={status.targetUnixMs}
            remainingMs={remainingMs}
            progress={progress}
            onCancel={cancel}
          />
        ) : (
          <IdleView onStart={start} />
        )}
      </div>
    </main>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}

export default App;
