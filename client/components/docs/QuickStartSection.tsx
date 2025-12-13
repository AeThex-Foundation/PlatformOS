import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Code,
  Terminal,
  Rocket,
  Play,
  Link as LinkIcon,
  LucideIcon,
} from "lucide-react";
import { useDocsTheme } from "@/contexts/DocsThemeContext";

export interface QuickStartCard {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  duration: string;
  difficulty: string;
  isNew?: boolean;
}

const defaultCards: QuickStartCard[] = [
  {
    title: "Choose Your Path",
    description: "Explore learning tracks in game dev, web development, and design",
    icon: LayoutDashboard,
    href: "/programs",
    duration: "5 min",
    difficulty: "Beginner",
    isNew: true,
  },
  {
    title: "Enrollment Guide",
    description: "How to sign up for courses and start your learning journey",
    icon: Rocket,
    href: "/docs/getting-started",
    duration: "5 min read",
    difficulty: "Beginner",
  },
  {
    title: "Course Curriculum",
    description: "View detailed syllabi, learning outcomes, and prerequisites",
    icon: Play,
    href: "/docs/curriculum",
    duration: "10 min",
    difficulty: "Beginner",
  },
  {
    title: "Download Materials",
    description: "Access free course guides, PDFs, and code samples",
    icon: Code,
    href: "/downloads",
    duration: "Varies",
    difficulty: "Beginner",
  },
  {
    title: "Find a Mentor",
    description: "Connect with industry experts for personalized guidance",
    icon: Terminal,
    href: "/mentorship",
    duration: "Ongoing",
    difficulty: "All Levels",
  },
  {
    title: "Student FAQs",
    description: "Common questions about programs, certificates, and support",
    icon: LinkIcon,
    href: "/docs/platform",
    duration: "5 min read",
    difficulty: "Beginner",
  },
];

interface QuickStartSectionProps {
  cards?: QuickStartCard[];
}

export default function QuickStartSection({
  cards = defaultCards,
}: QuickStartSectionProps) {
  const { colors, theme } = useDocsTheme();

  return (
    <div className="mb-12">
      <h3 className={`text-2xl font-bold ${colors.headingColor} mb-6`}>
        Quick Start
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          const hoverBorderColor =
            theme === "professional"
              ? "hover:border-gray-400"
              : "hover:border-purple-500/50";
          const iconColor =
            theme === "professional" ? "text-gray-700" : "text-purple-400";
          const hoverTitleColor =
            theme === "professional"
              ? "group-hover:text-gray-900"
              : "group-hover:text-purple-400";

          return (
            <Card
              key={index}
              className={`${colors.cardBg} border ${colors.cardBorder} ${hoverBorderColor} transition-all duration-300 hover:scale-105 cursor-pointer group`}
            >
              <Link to={card.href}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`h-8 w-8 ${iconColor}`} />
                    {card.isNew && (
                      <Badge className="bg-green-600 text-white text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                  <CardTitle
                    className={`${colors.headingColor} text-lg ${hoverTitleColor} transition-colors`}
                  >
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className={`${colors.textMuted} mb-3`}>
                    {card.description}
                  </CardDescription>
                  <div
                    className={`flex items-center justify-between text-xs ${colors.textMuted}`}
                  >
                    <span>{card.duration}</span>
                    <Badge variant="outline" className="text-xs">
                      {card.difficulty}
                    </Badge>
                  </div>
                </CardContent>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
