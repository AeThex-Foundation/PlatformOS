import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TeamMemberCardProps {
  name: string;
  role: string;
  avatarUrl?: string;
  profileUrl?: string;
  className?: string;
}

export default function TeamMemberCard({
  name,
  role,
  avatarUrl,
  profileUrl,
  className,
}: TeamMemberCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const CardContent = (
    <div
      className={cn(
        "flex flex-col items-center text-center p-6 rounded-lg",
        "border border-gameforge-green/30 bg-gameforge-dark/50",
        "hover-elevate",
        className
      )}
      data-testid={`card-team-member-${name.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <Avatar className="w-24 h-24 mb-4">
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback className="text-lg font-bold bg-gameforge-green/20 text-gameforge-green">
          {initials}
        </AvatarFallback>
      </Avatar>
      <h3 className="font-semibold text-lg text-white">{name}</h3>
      <p className="text-sm text-gameforge-green">{role}</p>
    </div>
  );

  if (profileUrl) {
    return (
      <a href={profileUrl} className="block">
        {CardContent}
      </a>
    );
  }

  return CardContent;
}
