import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ScopeAnchorProps {
  genre: string;
  platform: string;
  status: "In Development" | "Beta" | "Released" | "Early Access";
  timeline?: string;
  className?: string;
}

export default function ScopeAnchor({
  genre,
  platform,
  status,
  timeline,
  className,
}: ScopeAnchorProps) {
  const statusColors: Record<string, string> = {
    "In Development": "bg-amber-500/20 text-amber-400 border-amber-500/30",
    Beta: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    Released: "bg-gameforge-green/20 text-gameforge-green border-gameforge-green/30",
    "Early Access": "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <div
      className={cn(
        "p-8 rounded-lg border border-gameforge-green/30 bg-gameforge-dark/30",
        "max-w-3xl mx-auto",
        className
      )}
      data-testid="scope-anchor"
    >
      <h3 className="text-lg font-bold font-pixel text-gameforge-green mb-6 uppercase tracking-wider">
        Project Scope
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Genre
          </p>
          <p className="font-medium text-white">{genre}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Platform
          </p>
          <p className="font-medium text-white">{platform}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Status
          </p>
          <Badge variant="outline" className={cn("mt-1", statusColors[status])}>
            {status}
          </Badge>
        </div>
        {timeline && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Timeline
            </p>
            <p className="font-medium text-white">{timeline}</p>
          </div>
        )}
      </div>
    </div>
  );
}
