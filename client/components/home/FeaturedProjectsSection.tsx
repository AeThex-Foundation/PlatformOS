import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Star, Users, Gamepad2, Palette, Wrench, Code2 } from "lucide-react";
import { Link } from "react-router-dom";

const featuredProjects = [
  {
    title: "AeThex Engine Core",
    description: "Open-source game engine components built for performance and flexibility. Cross-platform support for web, desktop, and mobile.",
    category: "Engine",
    icon: Gamepad2,
    stars: 2400,
    contributors: 48,
    tags: ["TypeScript", "WebGL", "WASM"],
    gradient: "from-aethex-500 to-red-600",
    status: "Active",
  },
  {
    title: "Shader Library",
    description: "Collection of production-ready shaders for Unity and Unreal. PBR materials, post-processing effects, and particle systems.",
    category: "Graphics",
    icon: Palette,
    stars: 1800,
    contributors: 32,
    tags: ["HLSL", "GLSL", "Unity"],
    gradient: "from-red-500 to-gold-500",
    status: "Active",
  },
  {
    title: "DevOps Toolkit",
    description: "CI/CD pipelines, build automation, and deployment scripts optimized for game development workflows.",
    category: "Tools",
    icon: Wrench,
    stars: 950,
    contributors: 21,
    tags: ["GitHub Actions", "Docker", "AWS"],
    gradient: "from-gold-500 to-amber-500",
    status: "Active",
  },
  {
    title: "AI Behavior Framework",
    description: "Modular behavior tree system with visual editor. Built for complex game AI with performance in mind.",
    category: "AI",
    icon: Code2,
    stars: 1200,
    contributors: 27,
    tags: ["C#", "Python", "ML"],
    gradient: "from-amber-500 to-aethex-600",
    status: "Beta",
  },
];

export function FeaturedProjectsSection() {
  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-gradient bg-gradient-to-r from-aethex-400 to-gold-400 bg-clip-text text-transparent">
              Featured Projects
            </h2>
            <p className="text-muted-foreground">
              Open-source tools built by our community
            </p>
          </div>
          <Button asChild variant="outline" className="border-aethex-500/30 hover:border-aethex-400">
            <Link to="/hub/community" className="flex items-center gap-2">
              View All Projects
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {featuredProjects.map((project, index) => {
            const Icon = project.icon;
            return (
              <Card
                key={index}
                className="group relative overflow-hidden bg-card/60 backdrop-blur-sm border-border/30 hover:border-aethex-400/50 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-[0_12px_40px_rgba(217,55,55,0.2)]"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-aethex-500/5 via-transparent to-gold-500/5" />
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${project.gradient} grid place-items-center shadow-lg flex-shrink-0`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg truncate">{project.title}</h3>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            project.status === "Active"
                              ? "border-green-500/50 text-green-400"
                              : "border-gold-500/50 text-gold-400"
                          }`}
                        >
                          {project.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs bg-white/5">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-gold-400" />
                          <span>{project.stars.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-aethex-400" />
                          <span>{project.contributors} contributors</span>
                        </div>
                        <Button variant="ghost" size="sm" className="ml-auto text-aethex-400 hover:text-aethex-300 p-0 h-auto">
                          <Github className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
