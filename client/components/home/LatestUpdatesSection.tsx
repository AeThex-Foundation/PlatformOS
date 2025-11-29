import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, BookOpen, Trophy, Users, Megaphone } from "lucide-react";
import { Link } from "react-router-dom";

const updates = [
  {
    type: "Workshop",
    icon: BookOpen,
    title: "Advanced Shader Programming",
    description: "Deep dive into custom shader development for Unity and Unreal Engine",
    date: "Dec 5, 2025",
    link: "/workshops",
    color: "bg-aethex-500/20 text-aethex-400 border-aethex-500/30",
  },
  {
    type: "Achievement",
    icon: Trophy,
    title: "New Certification Path",
    description: "Game Audio Design certification now available with industry recognition",
    date: "Nov 28, 2025",
    link: "/achievements",
    color: "bg-gold-500/20 text-gold-400 border-gold-500/30",
  },
  {
    type: "Community",
    icon: Users,
    title: "Game Jam Results",
    description: "Congratulations to all participants! See the winning projects from our Fall Game Jam",
    date: "Nov 20, 2025",
    link: "/hub/community",
    color: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  {
    type: "Announcement",
    icon: Megaphone,
    title: "DAO Governance Live",
    description: "On-chain voting is now active. Participate in Foundation decisions",
    date: "Nov 24, 2025",
    link: "/hub/governance",
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
];

export function LatestUpdatesSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-gradient bg-gradient-to-r from-aethex-400 to-gold-400 bg-clip-text text-transparent">
              Latest Updates
            </h2>
            <p className="text-muted-foreground">
              What's happening in the Foundation
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {updates.map((update, index) => {
            const Icon = update.icon;
            return (
              <Link key={index} to={update.link}>
                <Card className="group h-full bg-card/60 backdrop-blur-sm border-border/30 hover:border-aethex-400/50 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_8px_30px_rgba(217,55,55,0.15)] cursor-pointer">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className={update.color}>
                        <Icon className="h-3 w-3 mr-1" />
                        {update.type}
                      </Badge>
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-aethex-400 transition-colors line-clamp-1">
                      {update.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {update.description}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {update.date}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
