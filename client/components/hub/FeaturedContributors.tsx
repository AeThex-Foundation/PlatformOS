import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Zap, Award } from "lucide-react";
import { Link } from "react-router-dom";

interface Contributor {
  username: string;
  displayName: string;
  avatar: string;
  role: string;
  xp: number;
  bounties: number;
  badge: string;
  gradient: string;
}

interface FeaturedContributorsProps {
  contributors: Contributor[];
  title?: string;
  showViewAll?: boolean;
}

export function FeaturedContributors({ 
  contributors, 
  title = "Top Contributors",
  showViewAll = true 
}: FeaturedContributorsProps) {
  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Diamond": return "border-blue-400/50 text-blue-400 bg-blue-500/10";
      case "Platinum": return "border-purple-400/50 text-purple-400 bg-purple-500/10";
      case "Gold": return "border-gold-400/50 text-gold-400 bg-gold-500/10";
      case "Staff": return "border-red-400/50 text-red-400 bg-red-500/10";
      default: return "border-gray-400/50 text-gray-400 bg-gray-500/10";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-gold-400" />
          {title}
        </h3>
        {showViewAll && (
          <Link 
            to="/leaderboard" 
            className="text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            View All
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {contributors.map((contributor, index) => (
          <Link key={contributor.username} to={`/${contributor.username}`}>
            <Card className="border-border/30 hover:border-red-500/50 transition-all group cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="relative">
                    {index === 0 && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gold-500 flex items-center justify-center">
                        <span className="text-xs font-bold text-black">1</span>
                      </div>
                    )}
                    <Avatar className={`h-16 w-16 border-2 bg-gradient-to-br ${contributor.gradient}`}>
                      <AvatarFallback className="bg-transparent text-white font-bold text-lg">
                        {contributor.avatar}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="font-semibold group-hover:text-red-400 transition-colors">
                      {contributor.displayName}
                    </p>
                    <p className="text-xs text-muted-foreground">@{contributor.username}</p>
                    <Badge variant="outline" className={getBadgeColor(contributor.badge)}>
                      <Award className="h-3 w-3 mr-1" />
                      {contributor.badge}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm pt-2 border-t border-border/30 w-full justify-center">
                    <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-amber-400" />
                      <span className="font-medium">{contributor.xp.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">XP</span>
                    </div>
                    <div className="text-muted-foreground">|</div>
                    <div>
                      <span className="font-medium">{contributor.bounties}</span>
                      <span className="text-xs text-muted-foreground ml-1">bounties</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
