import { Button } from "@/components/ui/button";
import TeamMemberCard from "./TeamMemberCard";
import ScopeAnchor from "./ScopeAnchor";
import { Play, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamMember {
  name: string;
  role: string;
  avatarUrl?: string;
  profileUrl?: string;
}

interface ProjectShowcaseProps {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  heroImageUrl: string;
  genre: string;
  platform: string;
  status: "In Development" | "Beta" | "Released" | "Early Access";
  timeline?: string;
  team: TeamMember[];
  features?: string[];
  playUrl?: string;
  className?: string;
}

export default function ProjectShowcase({
  title,
  tagline,
  description,
  heroImageUrl,
  genre,
  platform,
  status,
  timeline,
  team,
  features = [],
  playUrl = "https://aethex.fun",
  className,
}: ProjectShowcaseProps) {
  return (
    <div className={cn("min-h-screen bg-gameforge-dark text-white", className)}>
      <a
        href="https://aethex.dev"
        className="fixed top-4 left-4 flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors z-50"
        data-testid="link-back-aethex"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to AeThex</span>
      </a>

      <section
        className="relative min-h-screen flex flex-col items-center justify-center px-6"
        style={{
          backgroundImage: `url(${heroImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-gameforge-dark via-gameforge-dark/70 to-transparent" />
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold font-pixel uppercase tracking-wide text-white mb-4 drop-shadow-lg">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-gameforge-green font-medium mb-8">
            {tagline}
          </p>

          <Button
            size="lg"
            className="px-12 py-6 text-lg rounded-md bg-gameforge-green hover:bg-gameforge-green/90 text-gameforge-dark font-bold uppercase tracking-wider no-default-hover-elevate"
            asChild
          >
            <a href={playUrl} data-testid="button-play-now">
              <Play className="w-6 h-6 mr-2 fill-current" />
              Play Now
            </a>
          </Button>

          <div className="flex items-center justify-center gap-8 mt-12 text-sm">
            <div className="flex flex-col items-center">
              <span className="text-white/60 uppercase tracking-wider">Genre</span>
              <span className="font-medium text-gameforge-green">{genre}</span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="flex flex-col items-center">
              <span className="text-white/60 uppercase tracking-wider">Platform</span>
              <span className="font-medium text-gameforge-green">{platform}</span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="flex flex-col items-center">
              <span className="text-white/60 uppercase tracking-wider">Status</span>
              <span className="font-medium text-gameforge-green">{status}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-pixel text-gameforge-green uppercase mb-6">
              About the Game
            </h2>
            <p className="text-lg leading-relaxed text-white/80">
              {description}
            </p>
          </div>
          {features.length > 0 && (
            <div>
              <h3 className="text-xl font-bold font-pixel text-white uppercase mb-4">
                Key Features
              </h3>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-white/80"
                  >
                    <span className="text-gameforge-green mt-1">*</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-pixel text-gameforge-green uppercase text-center mb-12">
            The Team
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <TeamMemberCard
                key={index}
                name={member.name}
                role={member.role}
                avatarUrl={member.avatarUrl}
                profileUrl={member.profileUrl}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-6 pb-24">
        <ScopeAnchor
          genre={genre}
          platform={platform}
          status={status}
          timeline={timeline}
        />
      </section>
    </div>
  );
}
