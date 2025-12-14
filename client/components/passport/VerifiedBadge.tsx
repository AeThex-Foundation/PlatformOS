import { cn } from "@/lib/utils";
import { BadgeCheck } from "lucide-react";

interface VerifiedBadgeProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function VerifiedBadge({ className, size = "md" }: VerifiedBadgeProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center text-amber-400",
        className
      )}
      title="Verified AeThex Member"
      data-testid="badge-verified"
    >
      <BadgeCheck className={cn(sizeClasses[size], "fill-amber-400/20")} />
    </span>
  );
}
