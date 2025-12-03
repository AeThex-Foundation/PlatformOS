import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface CreatorBadgeProps {
  icon: LucideIcon;
  label: string;
  className?: string;
}

export default function CreatorBadge({ icon: Icon, label, className }: CreatorBadgeProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 p-4 rounded-lg",
        "border border-border bg-card/50",
        "hover-elevate cursor-default",
        className
      )}
      data-testid={`badge-creator-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <Icon className="w-8 h-8 text-neon-purple" />
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
