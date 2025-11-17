/**
 * Achievement Badges Component
 * Displays user's earned achievements/badges with icons and tooltips
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sparkles,
  Compass,
  Code,
  Trophy,
  Award,
  Star,
  Flame,
  Zap,
  Heart,
  Shield,
} from "lucide-react";
import { aethexAchievementService } from "@/lib/aethex-database-adapter";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp_reward: number;
  badge_color: string;
  earned_at?: string;
}

interface AchievementBadgesProps {
  userId: string;
  variant?: "grid" | "compact";
  maxDisplay?: number;
}

const iconMap: Record<string, any> = {
  sparkles: Sparkles,
  compass: Compass,
  code: Code,
  trophy: Trophy,
  award: Award,
  star: Star,
  flame: Flame,
  zap: Zap,
  heart: Heart,
  shield: Shield,
};

export default function AchievementBadges({ 
  userId, 
  variant = "grid",
  maxDisplay 
}: AchievementBadgesProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchAchievements = async () => {
      try {
        setLoading(true);
        const data = await aethexAchievementService.getUserAchievements(userId);
        setAchievements(data as Achievement[]);
      } catch (error) {
        console.error("Error fetching achievements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [userId]);

  if (loading) {
    return (
      <div className={variant === "grid" ? "grid grid-cols-2 md:grid-cols-3 gap-4" : "flex flex-wrap gap-2"}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className={variant === "grid" ? "h-24" : "h-16 w-16"} />
        ))}
      </div>
    );
  }

  if (achievements.length === 0) {
    return (
      <Card className="border-border/30">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground">No achievements earned yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Complete tasks and contribute to the community to earn badges!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayAchievements = maxDisplay 
    ? achievements.slice(0, maxDisplay) 
    : achievements;

  if (variant === "compact") {
    return (
      <TooltipProvider>
        <div className="flex flex-wrap gap-2">
          {displayAchievements.map((achievement) => {
            const Icon = iconMap[achievement.icon] || Award;
            return (
              <Tooltip key={achievement.id}>
                <TooltipTrigger asChild>
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${achievement.badge_color}20`, border: `2px solid ${achievement.badge_color}40` }}
                  >
                    <Icon 
                      className="h-6 w-6" 
                      style={{ color: achievement.badge_color }}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="space-y-1">
                    <p className="font-semibold">{achievement.name}</p>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    <div className="flex items-center gap-2 text-xs mt-2">
                      <Badge variant="outline" className="text-xs">
                        +{achievement.xp_reward} XP
                      </Badge>
                      {achievement.earned_at && (
                        <span className="text-muted-foreground">
                          {new Date(achievement.earned_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
          {maxDisplay && achievements.length > maxDisplay && (
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-muted/30 border border-border/50">
              <span className="text-sm font-semibold text-muted-foreground">
                +{achievements.length - maxDisplay}
              </span>
            </div>
          )}
        </div>
      </TooltipProvider>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {displayAchievements.map((achievement) => {
        const Icon = iconMap[achievement.icon] || Award;
        return (
          <Card 
            key={achievement.id} 
            className="border-border/30 hover:border-gold-400/50 transition-all group cursor-default"
            style={{ borderColor: `${achievement.badge_color}30` }}
          >
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${achievement.badge_color}20` }}
                >
                  <Icon 
                    className="h-8 w-8" 
                    style={{ color: achievement.badge_color }}
                  />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-sm">{achievement.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {achievement.description}
                  </p>
                </div>
                <Badge 
                  variant="outline" 
                  className="text-xs"
                  style={{ borderColor: `${achievement.badge_color}40`, color: achievement.badge_color }}
                >
                  +{achievement.xp_reward} XP
                </Badge>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
