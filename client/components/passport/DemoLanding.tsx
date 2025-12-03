import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Gamepad2, ArrowRight, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoLandingProps {
  onSelectMode: (mode: "creator" | "project") => void;
}

export default function DemoLanding({ onSelectMode }: DemoLandingProps) {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={cn("min-h-screen transition-colors duration-300", isDark ? "dark" : "")}>
      <div className="min-h-screen bg-background flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">Ae</span>
            </div>
            <span className="font-display font-bold text-lg">Passport Engine</span>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-4xl w-full">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
                AeThex Identity System
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose a profile type to preview. In production, this routes automatically based on the domain.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card
                className="hover-elevate cursor-pointer group"
                onClick={() => onSelectMode("creator")}
                data-testid="card-select-creator"
              >
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-lg bg-neon-purple/20 flex items-center justify-center mb-2">
                    <User className="w-6 h-6 text-neon-purple" />
                  </div>
                  <CardTitle className="font-display text-2xl">Creator Profile</CardTitle>
                  <CardDescription>
                    username.aethex.me
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Personal profiles for creators with verified status, achievement badges, and social links.
                  </p>
                  <div className="flex items-center gap-2 text-neon-purple font-medium group-hover:gap-3 transition-all">
                    <span>Night Mode Theme</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>

              <Card
                className="hover-elevate cursor-pointer group"
                onClick={() => onSelectMode("project")}
                data-testid="card-select-project"
              >
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-lg bg-gameforge-green/20 flex items-center justify-center mb-2">
                    <Gamepad2 className="w-6 h-6 text-gameforge-green" />
                  </div>
                  <CardTitle className="font-display text-2xl">Project Showcase</CardTitle>
                  <CardDescription>
                    project-name.aethex.space
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Game project pages with hero images, team rosters, and play links.
                  </p>
                  <div className="flex items-center gap-2 text-gameforge-green font-medium group-hover:gap-3 transition-all">
                    <span>GameForge Theme</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center text-sm text-muted-foreground">
              <p>
                Point <code className="bg-muted px-2 py-1 rounded">*.aethex.me</code> and{" "}
                <code className="bg-muted px-2 py-1 rounded">*.aethex.space</code> to this server
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
