import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Video, Headphones, Github, Download, LucideIcon } from "lucide-react";
import { useDocsTheme } from "@/contexts/DocsThemeContext";

export interface LearningResource {
  title: string;
  description: string;
  icon: LucideIcon;
  count: string;
  link: string;
  color: string;
}

const defaultResources: LearningResource[] = [
  {
    title: "Video Courses",
    description: "Step-by-step video training for visual learners",
    icon: Video,
    count: "50+ hours",
    link: "/programs",
    color: "from-aethex-500 to-red-600",
  },
  {
    title: "Industry Talks",
    description: "Insights from professionals in game dev and tech",
    icon: Headphones,
    count: "20+ sessions",
    link: "/mentorship",
    color: "from-gold-500 to-amber-600",
  },
  {
    title: "Project Templates",
    description: "Starter projects to build your portfolio",
    icon: Github,
    count: "100+ templates",
    link: "/downloads",
    color: "from-green-500 to-emerald-600",
  },
  {
    title: "Course Materials",
    description: "PDFs, guides, and reference materials for offline study",
    icon: Download,
    count: "Free downloads",
    link: "/downloads",
    color: "from-blue-500 to-cyan-600",
  },
];

interface LearningResourcesGridProps {
  resources?: LearningResource[];
}

export default function LearningResourcesGrid({
  resources = defaultResources,
}: LearningResourcesGridProps) {
  const { colors, theme } = useDocsTheme();
  const hoverBorderColor =
    theme === "professional"
      ? "hover:border-gray-400"
      : "hover:border-red-500/50";

  return (
    <div className="mb-12">
      <h3 className={`text-2xl font-bold ${colors.headingColor} mb-6`}>
        Learning resources
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {resources.map((resource, index) => {
          const Icon = resource.icon;
          return (
            <Card
              key={resource.title}
              className={`text-center ${colors.cardBg} border ${colors.cardBorder} ${hoverBorderColor} transition-all duration-300`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div
                  className={`mx-auto w-16 h-16 rounded-lg bg-gradient-to-r ${resource.color} flex items-center justify-center mb-4`}
                >
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className={`${colors.headingColor} text-lg`}>
                  {resource.title}
                </CardTitle>
                <CardDescription className={colors.textMuted}>
                  {resource.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="mb-4">
                  {resource.count}
                </Badge>
                <Button asChild size="sm" className="w-full">
                  <Link to={resource.link}>Explore</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
