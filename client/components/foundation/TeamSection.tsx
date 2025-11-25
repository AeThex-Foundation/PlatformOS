import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Github, Linkedin, Twitter } from "lucide-react";

export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  bio: string;
  expertise: string[];
  gradient: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
}

interface TeamSectionProps {
  theme?: "red" | "default";
  members: TeamMember[];
  title?: string;
  subtitle?: string;
}

export function TeamSection({ 
  theme = "red", 
  members,
  title = "Meet Our Team",
  subtitle = "Passionate individuals dedicated to empowering the next generation of game developers"
}: TeamSectionProps) {
  const isRed = theme === "red";
  
  return (
    <section className="py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold mb-4 ${isRed ? "text-red-300" : "text-gradient bg-gradient-to-r from-aethex-400 to-gold-400 bg-clip-text text-transparent"}`}>
            {title}
          </h2>
          <p className={`max-w-2xl mx-auto ${isRed ? "text-red-200/70" : "text-muted-foreground"}`}>
            {subtitle}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member, index) => (
            <Card
              key={index}
              className={`group transition-all duration-300 hover:translate-y-[-2px] ${
                isRed 
                  ? "bg-red-950/20 border-red-400/30 hover:border-red-400/60" 
                  : "bg-card/60 backdrop-blur-sm border-border/30 hover:border-aethex-400/50"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-16 w-16 border-2 border-red-500/30">
                    <AvatarFallback className={`bg-gradient-to-br ${member.gradient} text-white font-bold text-lg`}>
                      {member.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className={`font-bold text-lg ${isRed ? "text-red-300" : ""}`}>{member.name}</h3>
                    <p className={`text-sm ${isRed ? "text-red-400" : "text-aethex-400"}`}>{member.role}</p>
                  </div>
                </div>
                <p className={`text-sm mb-4 leading-relaxed ${isRed ? "text-red-200/70" : "text-muted-foreground"}`}>
                  {member.bio}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {member.expertise.map((skill, i) => (
                    <Badge 
                      key={i} 
                      variant="secondary" 
                      className={`text-xs ${isRed ? "bg-red-500/20 text-red-300 border border-red-400/40" : "bg-white/5"}`}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
                {(member.twitter || member.linkedin || member.github) && (
                  <div className={`flex gap-2 pt-2 border-t ${isRed ? "border-red-400/20" : "border-border/30"}`}>
                    {member.twitter && (
                      <a 
                        href={member.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`p-2 rounded-lg transition-colors ${
                          isRed 
                            ? "hover:bg-red-500/10 text-red-300/60 hover:text-red-300" 
                            : "hover:bg-aethex-500/10 text-muted-foreground hover:text-aethex-400"
                        }`}
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    )}
                    {member.linkedin && (
                      <a 
                        href={member.linkedin}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`p-2 rounded-lg transition-colors ${
                          isRed 
                            ? "hover:bg-red-500/10 text-red-300/60 hover:text-red-300" 
                            : "hover:bg-aethex-500/10 text-muted-foreground hover:text-aethex-400"
                        }`}
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {member.github && (
                      <a 
                        href={member.github}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`p-2 rounded-lg transition-colors ${
                          isRed 
                            ? "hover:bg-red-500/10 text-red-300/60 hover:text-red-300" 
                            : "hover:bg-aethex-500/10 text-muted-foreground hover:text-aethex-400"
                        }`}
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
