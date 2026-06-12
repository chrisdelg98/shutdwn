import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

function App() {
  return (
    <ThemeProvider>
      <main className="relative flex h-screen w-screen flex-col items-center justify-center bg-background text-foreground">
        <div className="absolute right-3 top-3">
          <ThemeToggle />
        </div>

        <div className="flex flex-col items-center gap-8 px-8 text-center">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">shutdwn</h1>
            <p className="text-sm text-muted-foreground">
              Choose when to power off
            </p>
          </div>

          <div className="grid w-full max-w-xs grid-cols-2 gap-3">
            <Button variant="secondary" size="lg">15 min</Button>
            <Button variant="secondary" size="lg">30 min</Button>
            <Button variant="secondary" size="lg">1 hour</Button>
            <Button variant="secondary" size="lg">2 hours</Button>
          </div>

          <Button variant="outline" className="w-full max-w-xs">
            Custom time
          </Button>
        </div>
      </main>
    </ThemeProvider>
  );
}

export default App;
