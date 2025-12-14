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
  ArrowRight,
  LucideIcon,
  Video,
  Code,
  FileText,
  Puzzle,
  LayoutDashboard,
} from "lucide-react";
import { useDocsTheme } from "@/contexts/DocsThemeContext";

export interface ResourceSection {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  items: string[];
  badge: string;
}

const defaultSections: ResourceSection[] = [
  {
    title: "Training Programs",
    description: "Structured courses with hands-on projects and certification",
    icon: Video,
    href: "/programs",
    items: [
      "Interactive Media Development",
      "Web Development Fundamentals",
      "UI/UX Design",
      "AI & Data Science",
    ],
    badge: "50+ courses",
  },
  {
    title: "Learning Guides",
    description: "Step-by-step tutorials for building real projects",
    icon: LayoutDashboard,
    href: "/docs/tutorials",
    items: ["Unity Basics", "Roblox Studio", "React Projects", "Portfolio Building"],
    badge: "Career-Ready",
  },
  {
    title: "Curriculum Details",
    description: "Course syllabi, learning outcomes, and prerequisites",
    icon: Code,
    href: "/docs/curriculum",
    items: ["Course Modules", "Skill Progression", "Capstone Projects", "Certifications"],
    badge: "Detailed",
  },
  {
    title: "Downloadable Resources",
    description: "Free guides, code samples, and learning materials",
    icon: FileText,
    href: "/downloads",
    items: [
      "Course PDFs",
      "Code Templates",
      "Project Starters",
      "Reference Guides",
    ],
    badge: "Free",
  },
  {
    title: "Mentorship Programs",
    description: "1:1 guidance, workshops, and boot camps with industry experts",
    icon: Puzzle,
    href: "/mentorship",
    items: [
      "Individual Mentorship",
      "Group Workshops",
      "Intensive Boot Camps",
      "Career Coaching",
    ],
    badge: "Expert-Led",
  },
];

interface ResourceSectionsGridProps {
  sections?: ResourceSection[];
}

export default function ResourceSectionsGrid({
  sections = defaultSections,
}: ResourceSectionsGridProps) {
  const { colors, theme } = useDocsTheme();
  const iconColor =
    theme === "professional" ? "text-gray-700" : "text-gold-400";
  const hoverBorderColor =
    theme === "professional"
      ? "hover:border-gray-400"
      : "hover:border-red-500/50";
  const hoverTitleColor =
    theme === "professional"
      ? "group-hover:text-gray-900"
      : "group-hover:text-red-500";
  const arrowColor =
    theme === "professional" ? "text-gray-600" : "text-gold-400";
  const explorehoverColor =
    theme === "professional"
      ? "group-hover:text-gray-900"
      : "group-hover:text-red-500";

  return (
    <div className="mb-12">
      <h3 className={`text-2xl font-bold ${colors.headingColor} mb-6`}>
        Documentation Sections
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <Card
              key={index}
              className={`${colors.cardBg} border ${colors.cardBorder} ${hoverBorderColor} transition-all duration-300 cursor-pointer group`}
            >
              <Link to={section.href}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`h-8 w-8 ${iconColor}`} />
                    <Badge variant="outline">{section.badge}</Badge>
                  </div>
                  <CardTitle
                    className={`${colors.headingColor} ${hoverTitleColor} transition-colors`}
                  >
                    {section.title}
                  </CardTitle>
                  <CardDescription className={colors.textMuted}>
                    {section.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {section.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className={`text-sm ${colors.textMuted} flex items-center`}
                      >
                        <ArrowRight className={`h-3 w-3 mr-2 ${arrowColor}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div
                    className={`flex items-center ${theme === "professional" ? "text-gray-700" : "text-gold-400"} text-sm ${explorehoverColor} transition-colors`}
                  >
                    Explore section
                    <ArrowRight className="h-4 w-4 ml-1" />
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
