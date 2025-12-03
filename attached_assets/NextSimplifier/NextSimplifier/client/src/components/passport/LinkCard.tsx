import { cn } from "@/lib/utils";
import { ArrowRight, LucideIcon } from "lucide-react";

interface LinkCardProps {
  icon: LucideIcon;
  title: string;
  href: string;
  className?: string;
}

export default function LinkCard({ icon: Icon, title, href, className }: LinkCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center justify-between p-6 rounded-lg",
        "border border-border bg-card",
        "hover-elevate group",
        className
      )}
      data-testid={`link-card-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="flex items-center gap-4">
        <Icon className="w-6 h-6 text-neon-purple" />
        <span className="font-medium">{title}</span>
      </div>
      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
    </a>
  );
}
