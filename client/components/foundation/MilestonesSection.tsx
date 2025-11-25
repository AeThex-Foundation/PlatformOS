import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";

export interface Milestone {
  year: string;
  title: string;
  description: string;
  icon: LucideIcon;
  metric: string;
  gradient: string;
}

interface MilestonesSectionProps {
  theme?: "red" | "default";
  milestones: Milestone[];
  title?: string;
  subtitle?: string;
}

export function MilestonesSection({ 
  theme = "red", 
  milestones,
  title = "Our Journey",
  subtitle = "From a small group of passionate developers to a global foundation"
}: MilestonesSectionProps) {
  const isRed = theme === "red";
  
  return (
    <section className={`py-16 relative overflow-hidden ${isRed ? "border-t border-red-400/10" : ""}`}>
      {isRed && (
        <div className="pointer-events-none absolute inset-0 bg-black/40" />
      )}
      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold mb-4 ${isRed ? "text-red-300" : "text-gradient bg-gradient-to-r from-aethex-400 to-gold-400 bg-clip-text text-transparent"}`}>
            {title}
          </h2>
          <p className={`max-w-2xl mx-auto ${isRed ? "text-red-200/70" : "text-muted-foreground"}`}>
            {subtitle}
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className={`absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full hidden md:block ${
            isRed ? "bg-gradient-to-b from-red-500 via-gold-500 to-red-500" : "bg-gradient-to-b from-aethex-500 via-gold-500 to-red-500"
          }`} />

          <div className="space-y-8">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;
              const isEven = index % 2 === 0;
              return (
                <div
                  key={index}
                  className={`relative flex items-center gap-8 ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 ${isEven ? "md:text-right" : "md:text-left"}`}>
                    <Card className={`inline-block transition-all duration-300 ${
                      isRed 
                        ? "bg-red-950/20 border-red-400/30 hover:border-red-400/50" 
                        : "bg-card/60 backdrop-blur-sm border-border/30 hover:border-aethex-400/40"
                    }`}>
                      <CardContent className="p-6">
                        <div className={`flex items-center gap-3 mb-3 ${isEven ? "md:justify-end" : ""}`}>
                          <Badge 
                            variant="outline" 
                            className={isRed ? "border-red-400/40 text-red-300" : "border-aethex-500/30 text-aethex-400"}
                          >
                            {milestone.year}
                          </Badge>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${isRed ? "bg-red-500/20 text-red-300" : "bg-white/5"}`}
                          >
                            {milestone.metric}
                          </Badge>
                        </div>
                        <h3 className={`font-bold text-lg mb-2 ${isRed ? "text-red-300" : ""}`}>{milestone.title}</h3>
                        <p className={`text-sm ${isRed ? "text-red-200/70" : "text-muted-foreground"}`}>
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${milestone.gradient} grid place-items-center shadow-lg z-10 flex-shrink-0 hidden md:grid`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  <div className="flex-1 hidden md:block" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
