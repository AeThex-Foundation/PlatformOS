import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Users,
  Search,
  Loader2,
  GraduationCap,
  Target,
  Trophy,
  ArrowRight,
  Play,
  CheckCircle,
  Star,
  Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const API_BASE = import.meta.env.VITE_API_BASE || "";

interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  instructor_id: string;
  instructor_name: string;
  instructor_avatar?: string;
  cover_image_url: string;
  estimated_hours: number;
  modules?: number;
  students?: number;
}

const CATEGORIES = [
  { value: "game-dev", label: "Game Development" },
  { value: "web-dev", label: "Web Development" },
  { value: "ai-ml", label: "AI & Machine Learning" },
  { value: "design", label: "Design" },
  { value: "business", label: "Business" },
];

const DIFFICULTIES = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const difficultyColors: Record<string, string> = {
  beginner: "bg-green-500/20 text-green-300 border-green-500/30",
  intermediate: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  advanced: "bg-red-500/20 text-red-300 border-red-500/30",
};

const learningPaths = [
  {
    title: "Game Developer Path",
    description: "From zero to shipping your first game",
    courses: 8,
    hours: 40,
    icon: GraduationCap,
    gradient: "from-aethex-500 to-red-600",
    skills: ["Unity", "C#", "Game Design", "2D/3D Art"],
  },
  {
    title: "Roblox Creator Path",
    description: "Build professional Roblox experiences",
    courses: 6,
    hours: 30,
    icon: Zap,
    gradient: "from-red-500 to-gold-500",
    skills: ["Lua", "Roblox Studio", "Monetization", "UGC"],
  },
  {
    title: "Technical Artist Path",
    description: "Master shaders, VFX, and visual tools",
    courses: 5,
    hours: 25,
    icon: Target,
    gradient: "from-gold-500 to-amber-500",
    skills: ["Shaders", "VFX", "Blender", "Substance"],
  },
  {
    title: "Game Designer Path",
    description: "Learn mechanics, balance, and player psychology",
    courses: 7,
    hours: 35,
    icon: Trophy,
    gradient: "from-amber-500 to-aethex-600",
    skills: ["Systems Design", "Level Design", "UX", "Prototyping"],
  },
];

const sampleCourses: Course[] = [
  {
    id: "1",
    slug: "intro-game-dev",
    title: "Introduction to Game Development",
    description: "Learn the fundamentals of game development, from concepts to your first playable prototype. Perfect for complete beginners.",
    category: "game-dev",
    difficulty: "beginner",
    instructor_id: "1",
    instructor_name: "Sarah Mitchell",
    cover_image_url: "",
    estimated_hours: 8,
    modules: 12,
    students: 2500,
  },
  {
    id: "2",
    slug: "unity-fundamentals",
    title: "Unity Engine Fundamentals",
    description: "Master the Unity game engine from installation to building complete games. Includes hands-on projects and exercises.",
    category: "game-dev",
    difficulty: "beginner",
    instructor_id: "1",
    instructor_name: "Sarah Mitchell",
    cover_image_url: "",
    estimated_hours: 15,
    modules: 20,
    students: 3200,
  },
  {
    id: "3",
    slug: "advanced-csharp",
    title: "Advanced C# for Game Developers",
    description: "Deep dive into C# patterns, optimization techniques, and best practices specifically for game development.",
    category: "game-dev",
    difficulty: "intermediate",
    instructor_id: "2",
    instructor_name: "David Okonkwo",
    cover_image_url: "",
    estimated_hours: 12,
    modules: 16,
    students: 1800,
  },
  {
    id: "4",
    slug: "roblox-studio-mastery",
    title: "Roblox Studio Mastery",
    description: "Complete guide to Roblox game development, from basic mechanics to monetization strategies.",
    category: "game-dev",
    difficulty: "beginner",
    instructor_id: "3",
    instructor_name: "Priya Sharma",
    cover_image_url: "",
    estimated_hours: 20,
    modules: 25,
    students: 4100,
  },
  {
    id: "5",
    slug: "shader-programming",
    title: "Shader Programming for Games",
    description: "Learn HLSL/GLSL shader programming to create stunning visual effects and custom materials.",
    category: "design",
    difficulty: "advanced",
    instructor_id: "2",
    instructor_name: "David Okonkwo",
    cover_image_url: "",
    estimated_hours: 18,
    modules: 22,
    students: 950,
  },
  {
    id: "6",
    slug: "multiplayer-networking",
    title: "Multiplayer Game Networking",
    description: "Build real-time multiplayer games with proper networking architecture, lag compensation, and sync.",
    category: "game-dev",
    difficulty: "advanced",
    instructor_id: "4",
    instructor_name: "James Park",
    cover_image_url: "",
    estimated_hours: 16,
    modules: 18,
    students: 1200,
  },
  {
    id: "7",
    slug: "game-design-fundamentals",
    title: "Game Design Fundamentals",
    description: "Learn the principles of engaging game design, mechanics, and player psychology.",
    category: "design",
    difficulty: "beginner",
    instructor_id: "1",
    instructor_name: "Sarah Mitchell",
    cover_image_url: "",
    estimated_hours: 10,
    modules: 14,
    students: 2800,
  },
  {
    id: "8",
    slug: "ai-for-games",
    title: "AI Systems for Game NPCs",
    description: "Implement intelligent NPC behaviors using behavior trees, state machines, and modern AI techniques.",
    category: "ai-ml",
    difficulty: "intermediate",
    instructor_id: "2",
    instructor_name: "David Okonkwo",
    cover_image_url: "",
    estimated_hours: 14,
    modules: 16,
    students: 1500,
  },
  {
    id: "9",
    slug: "vfx-particle-systems",
    title: "VFX & Particle Systems",
    description: "Create stunning visual effects, explosions, and particle systems for your games.",
    category: "design",
    difficulty: "intermediate",
    instructor_id: "3",
    instructor_name: "Elena Rodriguez",
    cover_image_url: "",
    estimated_hours: 12,
    modules: 15,
    students: 1100,
  },
];

export default function FoundationCurriculum() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState<Course[]>(sampleCourses);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category") || null,
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    searchParams.get("difficulty") || null,
  );

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.set("category", selectedCategory);
        if (selectedDifficulty) params.set("difficulty", selectedDifficulty);

        const response = await fetch(
          `${API_BASE}/api/foundation/courses?${params}`,
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setCourses(data);
          } else {
            let filtered = sampleCourses;
            if (selectedCategory) {
              filtered = filtered.filter(c => c.category === selectedCategory);
            }
            if (selectedDifficulty) {
              filtered = filtered.filter(c => c.difficulty === selectedDifficulty);
            }
            setCourses(filtered);
          }
        } else {
          let filtered = sampleCourses;
          if (selectedCategory) {
            filtered = filtered.filter(c => c.category === selectedCategory);
          }
          if (selectedDifficulty) {
            filtered = filtered.filter(c => c.difficulty === selectedDifficulty);
          }
          setCourses(filtered);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        let filtered = sampleCourses;
        if (selectedCategory) {
          filtered = filtered.filter(c => c.category === selectedCategory);
        }
        if (selectedDifficulty) {
          filtered = filtered.filter(c => c.difficulty === selectedDifficulty);
        }
        setCourses(filtered);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [selectedCategory, selectedDifficulty]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let filtered = sampleCourses;
    if (search) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(search.toLowerCase()) ||
          course.description.toLowerCase().includes(search.toLowerCase()),
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter(c => c.category === selectedCategory);
    }
    if (selectedDifficulty) {
      filtered = filtered.filter(c => c.difficulty === selectedDifficulty);
    }
    setCourses(filtered);
  };

  const filteredCourses = courses;

  return (
    <Layout>
      <div className="relative min-h-screen bg-background text-foreground overflow-hidden pb-12">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-aethex-900/30 via-background to-red-900/20" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-aethex-500/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl" />

        <main className="relative z-10">
          <section className="py-16">
            <div className="container mx-auto max-w-7xl px-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/foundation")}
                className="mb-6 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Foundation
              </Button>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-aethex-500 to-red-600 grid place-items-center">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gradient bg-gradient-to-r from-aethex-400 to-gold-400 bg-clip-text text-transparent">
                    Curriculum
                  </h1>
                  <p className="text-muted-foreground">
                    Free courses from industry experts
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                <Card className="bg-card/60 backdrop-blur-sm border-aethex-500/20 text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-aethex-400 mb-1">50+</div>
                    <div className="text-sm text-muted-foreground">Free Courses</div>
                  </CardContent>
                </Card>
                <Card className="bg-card/60 backdrop-blur-sm border-gold-500/20 text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-gold-400 mb-1">200+</div>
                    <div className="text-sm text-muted-foreground">Video Hours</div>
                  </CardContent>
                </Card>
                <Card className="bg-card/60 backdrop-blur-sm border-red-500/20 text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-red-400 mb-1">15K+</div>
                    <div className="text-sm text-muted-foreground">Students</div>
                  </CardContent>
                </Card>
                <Card className="bg-card/60 backdrop-blur-sm border-amber-500/20 text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-amber-400 mb-1">4.8</div>
                    <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                      <Star className="h-4 w-4 fill-current" /> Avg Rating
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          <section className="py-12 border-y border-border/30 bg-card/30">
            <div className="container mx-auto max-w-7xl px-4">
              <h2 className="text-2xl font-bold mb-6">Learning Paths</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl">
                Structured paths to take you from beginner to professional. Each path includes carefully curated courses and projects.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {learningPaths.map((path, index) => {
                  const Icon = path.icon;
                  return (
                    <Card
                      key={index}
                      className="group bg-card/60 backdrop-blur-sm border-border/30 hover:border-aethex-400/50 transition-all duration-300 hover:translate-y-[-2px] cursor-pointer"
                    >
                      <CardContent className="p-6">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${path.gradient} grid place-items-center mb-4`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">{path.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {path.description}
                        </p>
                        <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                          <span>{path.courses} courses</span>
                          <span>{path.hours} hours</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {path.skills.slice(0, 3).map((skill, i) => (
                            <Badge key={i} variant="secondary" className="text-xs bg-white/5">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <Button className="w-full mt-4 bg-gradient-to-r from-aethex-500 to-red-600 hover:from-aethex-600 hover:to-red-700" size="sm">
                          Start Path
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="py-8 border-b border-border/30">
            <div className="container mx-auto max-w-7xl px-4">
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative max-w-xl">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search courses..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-card/60 border-border/50"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-aethex-500 hover:bg-aethex-600"
                  >
                    Search
                  </Button>
                </div>
              </form>

              <div className="mb-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Category
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setCourses(sampleCourses);
                    }}
                    className={`px-4 py-2 rounded-lg transition ${
                      selectedCategory === null
                        ? "bg-aethex-500/20 text-aethex-300 border border-aethex-500/50"
                        : "bg-card/50 text-muted-foreground border border-border/50 hover:border-aethex-400/30"
                    }`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => {
                        setSelectedCategory(
                          selectedCategory === cat.value ? null : cat.value,
                        );
                      }}
                      className={`px-4 py-2 rounded-lg transition ${
                        selectedCategory === cat.value
                          ? "bg-aethex-500/20 text-aethex-300 border border-aethex-500/50"
                          : "bg-card/50 text-muted-foreground border border-border/50 hover:border-aethex-400/30"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Difficulty
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setSelectedDifficulty(null);
                    }}
                    className={`px-4 py-2 rounded-lg transition ${
                      selectedDifficulty === null
                        ? "bg-aethex-500/20 text-aethex-300 border border-aethex-500/50"
                        : "bg-card/50 text-muted-foreground border border-border/50 hover:border-aethex-400/30"
                    }`}
                  >
                    All Levels
                  </button>
                  {DIFFICULTIES.map((diff) => (
                    <button
                      key={diff.value}
                      onClick={() => {
                        setSelectedDifficulty(
                          selectedDifficulty === diff.value ? null : diff.value,
                        );
                      }}
                      className={`px-4 py-2 rounded-lg transition ${
                        selectedDifficulty === diff.value
                          ? "bg-aethex-500/20 text-aethex-300 border border-aethex-500/50"
                          : "bg-card/50 text-muted-foreground border border-border/50 hover:border-aethex-400/30"
                      }`}
                    >
                      {diff.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="py-12">
            <div className="container mx-auto max-w-7xl px-4">
              <h2 className="text-2xl font-bold mb-8">
                {selectedCategory || selectedDifficulty ? "Filtered Courses" : "All Courses"}
                <span className="text-muted-foreground font-normal text-lg ml-2">
                  ({filteredCourses.length} courses)
                </span>
              </h2>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-aethex-400" />
                </div>
              ) : filteredCourses.length === 0 ? (
                <Card className="bg-card/60 border-border/30">
                  <CardContent className="p-12 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No courses found matching your criteria
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        setSelectedCategory(null);
                        setSelectedDifficulty(null);
                        setSearch("");
                        setCourses(sampleCourses);
                      }}
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <Card
                      key={course.id}
                      className="group bg-card/60 backdrop-blur-sm border-border/30 hover:border-aethex-400/50 transition-all duration-300 hover:translate-y-[-2px] overflow-hidden cursor-pointer"
                      onClick={() =>
                        navigate(`/foundation/curriculum/${course.slug}`)
                      }
                    >
                      <div className="h-40 bg-gradient-to-br from-aethex-500/20 via-red-500/10 to-gold-500/20 flex items-center justify-center">
                        <Play className="h-12 w-12 text-white/50 group-hover:text-aethex-400 group-hover:scale-110 transition-all" />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg mb-2 group-hover:text-aethex-400 transition-colors">
                              {course.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {course.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 mb-4">
                          <Badge
                            variant="outline"
                            className={difficultyColors[course.difficulty]}
                          >
                            {course.difficulty.charAt(0).toUpperCase() +
                              course.difficulty.slice(1)}
                          </Badge>
                        </div>

                        <div className="space-y-2 border-t border-border/30 pt-4 text-sm">
                          <div className="flex items-center justify-between text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{course.estimated_hours} hours</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4" />
                              <span>{course.modules || 10} modules</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>{(course.students || 1000).toLocaleString()} students</span>
                            </div>
                            <div className="flex items-center gap-1 text-gold-400">
                              <Star className="h-4 w-4 fill-current" />
                              <span>4.8</span>
                            </div>
                          </div>
                          {course.instructor_name && (
                            <div className="flex items-center gap-2 text-muted-foreground pt-2">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-aethex-500 to-red-600 grid place-items-center text-xs text-white font-bold">
                                {course.instructor_name.charAt(0)}
                              </div>
                              <span>{course.instructor_name}</span>
                            </div>
                          )}
                        </div>

                        <Button
                          className="w-full mt-4 bg-gradient-to-r from-aethex-500 to-red-600 hover:from-aethex-600 hover:to-red-700"
                          size="sm"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Course
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="py-16 bg-gradient-to-r from-aethex-900/30 via-red-900/20 to-aethex-900/30">
            <div className="container mx-auto max-w-4xl px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">
                <span className="text-gradient bg-gradient-to-r from-aethex-400 to-gold-400 bg-clip-text text-transparent">
                  Ready to Start Learning?
                </span>
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                All courses are completely free. Create an account to track your progress, earn achievements, and connect with other learners.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-aethex-500 to-red-600 hover:from-aethex-600 hover:to-red-700">
                  <a href="/signup" className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Create Free Account
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-aethex-400/50 hover:border-aethex-400">
                  <a href="/workshops">
                    Browse Workshops
                  </a>
                </Button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
