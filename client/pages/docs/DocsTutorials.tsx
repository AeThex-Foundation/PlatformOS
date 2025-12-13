import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import DocsLayout from "@/components/docs/DocsLayout";
import {
  Play,
  Clock,
  User,
  Star,
  BookOpen,
  Code,
  Gamepad2,
  Palette,
  Briefcase,
  Rocket,
  Filter,
  Search,
  ChevronRight,
  Eye,
  Heart,
  Video,
  FileText,
  GraduationCap,
} from "lucide-react";

interface LearningGuide {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
  author: string;
  rating: number;
  views: number;
  likes: number;
  tags: string[];
  isNew?: boolean;
  type: "video" | "article" | "project";
  href: string;
}

const learningGuides: LearningGuide[] = [
  {
    id: "1",
    title: "Getting Started with Unity",
    description:
      "Your first steps in game development. Learn the Unity interface, create your first scene, and understand basic game objects.",
    category: "Interactive Media",
    difficulty: "beginner",
    duration: "45 min",
    author: "AeThex Team",
    rating: 4.9,
    views: 5420,
    likes: 412,
    tags: ["unity", "game-dev", "beginner"],
    isNew: true,
    type: "video",
    href: "/programs",
  },
  {
    id: "2",
    title: "HTML & CSS Crash Course",
    description:
      "Learn the building blocks of the web. Create your first webpage with semantic HTML and modern CSS styling techniques.",
    category: "Web Development",
    difficulty: "beginner",
    duration: "1 hr",
    author: "Sarah Chen",
    rating: 4.8,
    views: 8240,
    likes: 687,
    tags: ["html", "css", "web"],
    type: "video",
    href: "/programs",
  },
  {
    id: "3",
    title: "Build a Roblox Obby Game",
    description:
      "Step-by-step guide to creating an obstacle course game in Roblox Studio with checkpoints and scoring.",
    category: "Interactive Media",
    difficulty: "beginner",
    duration: "2 hrs",
    author: "Alex Rodriguez",
    rating: 4.9,
    views: 4156,
    likes: 398,
    tags: ["roblox", "lua", "game-dev"],
    type: "project",
    href: "/programs",
  },
  {
    id: "4",
    title: "JavaScript Fundamentals",
    description:
      "Master the basics of JavaScript programming: variables, functions, loops, and DOM manipulation.",
    category: "Web Development",
    difficulty: "beginner",
    duration: "1.5 hrs",
    author: "Mike Johnson",
    rating: 4.7,
    views: 6567,
    likes: 523,
    tags: ["javascript", "programming", "web"],
    type: "video",
    href: "/programs",
  },
  {
    id: "5",
    title: "Creating Game Art in Pixel Style",
    description:
      "Learn pixel art techniques for creating game sprites, backgrounds, and animations using free tools.",
    category: "Creative Technology",
    difficulty: "beginner",
    duration: "1 hr",
    author: "Emma Wilson",
    rating: 4.8,
    views: 3876,
    likes: 345,
    tags: ["pixel-art", "game-art", "design"],
    type: "video",
    href: "/programs",
  },
  {
    id: "6",
    title: "React: Build Your First App",
    description:
      "Introduction to React development. Create a functional web application with components, props, and state.",
    category: "Web Development",
    difficulty: "intermediate",
    duration: "2 hrs",
    author: "Dr. Lisa Park",
    rating: 4.9,
    views: 5943,
    likes: 534,
    tags: ["react", "javascript", "frontend"],
    isNew: true,
    type: "project",
    href: "/programs",
  },
  {
    id: "7",
    title: "Resume Writing for Tech Jobs",
    description:
      "Craft a compelling resume that highlights your projects and skills. Includes templates and examples.",
    category: "Career Skills",
    difficulty: "beginner",
    duration: "30 min",
    author: "AeThex Team",
    rating: 4.6,
    views: 2234,
    likes: 198,
    tags: ["career", "resume", "job-search"],
    type: "article",
    href: "/programs",
  },
  {
    id: "8",
    title: "Audio Design for Games",
    description:
      "Create sound effects and ambient audio for your games using free software and recording techniques.",
    category: "Creative Technology",
    difficulty: "intermediate",
    duration: "1.5 hrs",
    author: "Marcus Lee",
    rating: 4.7,
    views: 1987,
    likes: 167,
    tags: ["audio", "sound-design", "game-dev"],
    type: "video",
    href: "/programs",
  },
];

const categories = [
  { id: "all", name: "All Guides", icon: BookOpen },
  { id: "interactive-media", name: "Interactive Media", icon: Gamepad2 },
  { id: "web-development", name: "Web Development", icon: Code },
  { id: "creative-technology", name: "Creative Technology", icon: Palette },
  { id: "career-skills", name: "Career Skills", icon: Briefcase },
];

export default function DocsTutorials() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-emerald-500";
      case "intermediate":
        return "bg-gold-500";
      case "advanced":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return Video;
      case "article":
        return FileText;
      case "project":
        return Code;
      default:
        return BookOpen;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "video":
        return "text-red-400";
      case "article":
        return "text-blue-400";
      case "project":
        return "text-emerald-400";
      default:
        return "text-gray-400";
    }
  };

  const filteredGuides = learningGuides.filter((guide) => {
    const matchesSearch =
      guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    const matchesCategory =
      selectedCategory === "all" ||
      guide.category.toLowerCase().replace(/[\/\s]/g, "-") === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "all" || guide.difficulty === selectedDifficulty;
    const matchesType = selectedType === "all" || guide.type === selectedType;

    return matchesSearch && matchesCategory && matchesDifficulty && matchesType;
  });

  return (
    <DocsLayout title="Learning Guides" description="Step-by-step tutorials for students">
      <div>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="h-8 w-8 text-red-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">
                Learning Guides & Tutorials
              </h2>
              <p className="text-gray-300">
                Step-by-step guides to help you build skills and create projects
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search tutorials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-slate-600 text-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-slate-800/50 border-slate-600 text-white rounded-md px-3 py-2"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-slate-800/50 border-slate-600 text-white rounded-md px-3 py-2"
              >
                <option value="all">All Types</option>
                <option value="video">Video</option>
                <option value="article">Article</option>
                <option value="project">Project</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                        selectedCategory === category.id
                          ? "bg-gradient-to-r from-aethex-500 to-red-600 text-white"
                          : "bg-slate-900/50 text-gray-300 hover:bg-slate-700/50"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {category.name}
                      </span>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 mt-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Rocket className="h-5 w-5 mr-2" />
                  Quick Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start border-slate-600 text-gray-300 hover:bg-slate-700/50">
                  <Link to="/programs">
                    <Play className="h-4 w-4 mr-2" />
                    All Programs
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start border-slate-600 text-gray-300 hover:bg-slate-700/50">
                  <Link to="/downloads">
                    <FileText className="h-4 w-4 mr-2" />
                    Downloads
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start border-slate-600 text-gray-300 hover:bg-slate-700/50">
                  <Link to="/mentorship">
                    <User className="h-4 w-4 mr-2" />
                    Find a Mentor
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <div className="mb-4">
              <p className="text-gray-400">
                Showing {filteredGuides.length} learning guides
              </p>
            </div>

            <div className="space-y-4">
              {filteredGuides.map((guide) => {
                const TypeIcon = getTypeIcon(guide.type);
                return (
                  <Card
                    key={guide.id}
                    className="bg-slate-800/50 border-slate-700 hover:border-red-500/50 transition-all duration-300 cursor-pointer group"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <TypeIcon
                              className={`h-5 w-5 ${getTypeColor(guide.type)}`}
                            />
                            <Badge variant="outline" className="text-xs">
                              {guide.category}
                            </Badge>
                            <Badge
                              className={`${getDifficultyColor(guide.difficulty)} text-white text-xs`}
                            >
                              {guide.difficulty}
                            </Badge>
                            {guide.isNew && (
                              <Badge className="bg-emerald-600 text-white text-xs">
                                New
                              </Badge>
                            )}
                          </div>

                          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-red-400 transition-colors">
                            {guide.title}
                          </h3>

                          <p className="text-gray-400 mb-4">
                            {guide.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {guide.duration}
                              </div>
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                {guide.author}
                              </div>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 mr-1 text-yellow-400" />
                                {guide.rating}
                              </div>
                              <div className="flex items-center">
                                <Eye className="h-4 w-4 mr-1" />
                                {guide.views.toLocaleString()}
                              </div>
                              <div className="flex items-center">
                                <Heart className="h-4 w-4 mr-1" />
                                {guide.likes}
                              </div>
                            </div>

                            <Button
                              asChild
                              className="bg-gradient-to-r from-aethex-500 to-red-600 hover:from-aethex-600 hover:to-red-700"
                            >
                              <Link to={guide.href}>
                                Start Learning
                                <ChevronRight className="h-4 w-4 ml-2" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredGuides.length === 0 && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    No guides found
                  </h3>
                  <p className="text-gray-400">
                    Try adjusting your search terms or filters to find what
                    you're looking for.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DocsLayout>
  );
}
