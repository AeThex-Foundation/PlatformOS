import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Shield, CheckCircle, Star, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Creator } from "@/api/creators";

export interface CreatorCardProps {
  creator: Creator;
}

const divisionEmojis: Record<string, string> = {
  Ethos: '🎧',
  Forge: '💻',
  Visuals: '🎨',
};

const realmColors: Record<string, string> = {
  'Development Forge': 'text-orange-400',
  'Strategist Nexus': 'text-blue-400',
  'Innovation Commons': 'text-green-400',
  'Experience Hub': 'text-amber-400',
};

export function CreatorCard({ creator }: CreatorCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg hover:shadow-red-500/10 transition-all overflow-hidden bg-red-950/20 border-amber-700/30 hover:border-amber-500/50">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="relative">
            <Avatar className="h-16 w-16 border-2 border-amber-500/30">
              <AvatarImage src={creator.avatar_url} alt={creator.username} />
              <AvatarFallback className="bg-red-950 text-amber-400">
                {creator.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {creator.is_verified && (
              <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-0.5">
                <CheckCircle className="h-4 w-4 text-black" />
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            {creator.passport_level && (
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                <Star className="h-3 w-3 mr-1" />
                Level {creator.passport_level}
              </Badge>
            )}
            {creator.division && (
              <span className="text-xs text-amber-200/60">
                {divisionEmojis[creator.division]} {creator.division}
              </span>
            )}
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-white truncate">
              @{creator.username}
            </h3>
            {creator.is_verified && (
              <Shield className="h-4 w-4 text-amber-400 flex-shrink-0" />
            )}
          </div>
          {creator.aethex_domain && (
            <p className="text-xs text-amber-400 font-mono mb-1">
              {creator.aethex_domain}
            </p>
          )}
          <p className="text-sm text-amber-200/60 line-clamp-2">
            {creator.bio || "Certified Nexus member"}
          </p>
        </div>

        {creator.realm && (
          <div className="mb-3">
            <span className={`text-xs font-medium ${realmColors[creator.realm] || 'text-gray-400'}`}>
              {creator.realm}
            </span>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 mb-4">
          {creator.arm_affiliations && creator.arm_affiliations.slice(0, 3).map((arm) => (
            <span
              key={arm}
              className="text-xs bg-red-950/50 text-amber-300/80 px-2 py-1 rounded border border-amber-700/20"
            >
              {arm}
            </span>
          ))}
          {creator.arm_affiliations && creator.arm_affiliations.length > 3 && (
            <span className="text-xs bg-red-950/50 text-amber-200/50 px-2 py-1 rounded">
              +{creator.arm_affiliations.length - 3}
            </span>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-amber-700/20">
          <Button
            onClick={() => navigate(`/creators/${creator.username}`)}
            className="w-full bg-red-500/10 text-amber-300 border border-amber-500/30 hover:bg-red-500/20 hover:border-amber-400/50"
            variant="outline"
          >
            View Passport <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
