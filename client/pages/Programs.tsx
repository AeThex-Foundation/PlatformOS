import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
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
  Star,
  Zap,
  Calendar,
  Video,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  instructor_name: string;
  estimated_hours: number;
  modules?: number;
  students?: number;
}

interface Workshop {
  id: string;
  title: string;
  description: string;
  instructor: string;
  date: string;
  time: string;
  duration: number;
  capacity: number;
  registered: number;
  level: string;
  status: "upcoming" | "live" | "completed";
}

const CATEGORIES = [
  { value: "interactive-media", label: "Interactive Media" },
  { value: "web-dev", label: "Web Development" },
  { value: "ai-ml", label: "AI & Machine Learning" },
  { value: "design", label: "Design" },
  { value: "business", label: "Business" },
];

const difficultyColors: Record<string, string> = {
  beginner: "bg-green-500/20 text-green-300 border-green-500/30",
  intermediate: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  advanced: "bg-red-500/20 text-red-300 border-red-500/30",
};

const learningPaths = [
  {
    title: "Software Development Track",
    description: "Build job-ready programming skills from fundamentals to deployment",
    courses: 8,
    hours: 40,
    icon: GraduationCap,
    gradient: "from-aethex-500 to-red-600",
    skills: ["Programming", "Problem Solving", "Version Control", "Deployment"],
  },
  {
    title: "Interactive Media Track",
    description: "Create engaging digital experiences and applications",
    courses: 6,
    hours: 30,
    icon: Zap,
    gradient: "from-red-500 to-gold-500",
    skills: ["Scripting", "Digital Tools", "User Experience", "Content Creation"],
  },
  {
    title: "Digital Arts Track",
    description: "Master visual design tools and creative technologies",
    courses: 5,
    hours: 25,
    icon: Target,
    gradient: "from-gold-500 to-amber-500",
    skills: ["Visual Design", "3D Modeling", "Animation", "Digital Illustration"],
  },
  {
    title: "Product Design Track",
    description: "Learn user-centered design and project management",
    courses: 7,
    hours: 35,
    icon: Trophy,
    gradient: "from-amber-500 to-aethex-600",
    skills: ["UX Research", "Prototyping", "Project Planning", "Team Collaboration"],
  },
];

const sampleCourses: Course[] = [
  {
    id: "1",
    slug: "intro-game-dev",
    title: "Introduction to Game Development",
    description: "Build foundational skills for careers in interactive entertainment and creative technology industries.",
    category: "interactive-media",
    difficulty: "beginner",
    instructor_name: "Sarah Mitchell",
    estimated_hours: 8,
    modules: 12,
    students: 2500,
  },
  {
    id: "2",
    slug: "unity-fundamentals",
    title: "Unity Engine Fundamentals",
    description: "Master industry-standard tools used by professional studios worldwide for interactive media development.",
    category: "interactive-media",
    difficulty: "beginner",
    instructor_name: "Sarah Mitchell",
    estimated_hours: 15,
    modules: 20,
    students: 3200,
  },
  {
    id: "3",
    slug: "csharp-for-interactive-media",
    title: "C# Programming for Interactive Applications",
    description: "Learn C# programming fundamentals essential for Unity development and enterprise software careers.",
    category: "interactive-media",
    difficulty: "intermediate",
    instructor_name: "David Okonkwo",
    estimated_hours: 12,
    modules: 16,
    students: 1800,
  },
  {
    id: "4",
    slug: "roblox-studio",
    title: "Roblox Studio Development",
    description: "Create interactive experiences on the world's largest user-generated content platform with 70M+ daily users.",
    category: "interactive-media",
    difficulty: "beginner",
    instructor_name: "Priya Sharma",
    estimated_hours: 10,
    modules: 14,
    students: 4100,
  },
  {
    id: "5",
    slug: "game-design-principles",
    title: "Game Design & User Experience",
    description: "Apply user-centered design principles to create engaging interactive experiences and applications.",
    category: "interactive-media",
    difficulty: "intermediate",
    instructor_name: "David Okonkwo",
    estimated_hours: 14,
    modules: 18,
    students: 1950,
  },
  {
    id: "6",
    slug: "web-dev-fundamentals",
    title: "Web Development Fundamentals",
    description: "Master HTML, CSS, and JavaScript to build modern, responsive websites.",
    category: "web-dev",
    difficulty: "beginner",
    instructor_name: "Sarah Mitchell",
    estimated_hours: 15,
    modules: 20,
    students: 3200,
  },
  {
    id: "7",
    slug: "data-visualization",
    title: "Data Visualization with Python",
    description: "Learn to create compelling data visualizations using Python and modern libraries.",
    category: "ai-ml",
    difficulty: "advanced",
    instructor_name: "David Okonkwo",
    estimated_hours: 18,
    modules: 22,
    students: 950,
  },
  {
    id: "8",
    slug: "ui-ux-design-fundamentals",
    title: "UI/UX Design Fundamentals",
    description: "Learn the principles of user-centered design, usability, and user experience.",
    category: "design",
    difficulty: "beginner",
    instructor_name: "Sarah Mitchell",
    estimated_hours: 10,
    modules: 14,
    students: 2800,
  },
];

const sampleWorkshops: Workshop[] = [
  {
    id: "1",
    title: "Interactive Media Challenge: Build a Puzzle Game",
    description: "Collaborative team workshop building portfolio-ready interactive experiences. Practice agile development and creative problem-solving.",
    instructor: "Sarah Mitchell",
    date: "2025-12-05",
    time: "14:00",
    duration: 180,
    capacity: 100,
    registered: 67,
    level: "Beginner",
    status: "upcoming",
  },
  {
    id: "2",
    title: "Real-Time Networking for Interactive Applications",
    description: "Learn multiplayer networking architecture and industry-standard practices for connected experiences.",
    instructor: "James Park",
    date: "2025-12-12",
    time: "16:00",
    duration: 120,
    capacity: 50,
    registered: 42,
    level: "Advanced",
    status: "upcoming",
  },
  {
    id: "3",
    title: "Unity Visual Scripting Workshop",
    description: "Introduction to visual programming concepts for non-coders entering the interactive media industry.",
    instructor: "David Okonkwo",
    date: "2025-12-19",
    time: "15:00",
    duration: 150,
    capacity: 75,
    registered: 38,
    level: "Beginner",
    status: "upcoming",
  },
];

export default function Programs() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>(sampleCourses);
  const [workshops, setWorkshops] = useState<Workshop[]>(sampleWorkshops);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [coursesRes, workshopsRes] = await Promise.all([
          fetch("/api/foundation/courses"),
          fetch("/api/workshops"),
        ]);

        if (coursesRes.ok) {
          const data = await coursesRes.json();
          if (Array.isArray(data)) {
            setCourses(data.length > 0 ? data : sampleCourses);
          }
        }

        if (workshopsRes.ok) {
          const data = await workshopsRes.json();
          if (data?.workshops?.length > 0) {
            setWorkshops(data.workshops.map((w: any) => ({
              id: w.id,
              title: w.title,
              description: w.description,
              instructor: w.instructor_name,
              date: new Date(w.start_time).toISOString().split("T")[0],
              time: new Date(w.start_time).toTimeString().slice(0, 5),
              duration: Math.round((new Date(w.end_time).getTime() - new Date(w.start_time).getTime()) / 60000),
              capacity: w.capacity,
              registered: w.registered_count,
              level: "Beginner",
              status: w.status,
            })));
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = !search || 
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const upcomingWorkshops = workshops.filter(w => w.status === "upcoming");

  return (
    <>
      <SEO
        pageTitle="Programs"
        description="Free workforce development programs, digital literacy courses, and career-ready training paths from the AeThex Foundation."
      />
      <Layout>
        <div className="relative min-h-screen bg-background text-foreground overflow-hidden pb-12">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-aethex-900/30 via-background to-red-900/20" />
          <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-aethex-500/10 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl" />

          <main className="relative z-10">
            <section className="py-16">
              <div className="container mx-auto max-w-7xl px-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-aethex-500 to-red-600 grid place-items-center">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-gradient bg-gradient-to-r from-aethex-400 to-gold-400 bg-clip-text text-transparent">
                      Programs
                    </h1>
                    <p className="text-muted-foreground">
                      Workforce development and digital literacy training
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                  <Card className="bg-card/60 backdrop-blur-sm border-aethex-500/20 text-center">
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold text-aethex-400 mb-1">50+</div>
                      <div className="text-sm text-muted-foreground">Training Modules</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-card/60 backdrop-blur-sm border-gold-500/20 text-center">
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold text-gold-400 mb-1">200+</div>
                      <div className="text-sm text-muted-foreground">Instructional Hours</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-card/60 backdrop-blur-sm border-red-500/20 text-center">
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold text-red-400 mb-1">15K+</div>
                      <div className="text-sm text-muted-foreground">Learners Trained</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-card/60 backdrop-blur-sm border-amber-500/20 text-center">
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold text-amber-400 mb-1">4.8</div>
                      <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 fill-current" /> Program Rating
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

            <section className="py-12 border-y border-border/30 bg-card/30">
              <div className="container mx-auto max-w-7xl px-4">
                <h2 className="text-2xl font-bold mb-6">Career-Ready Learning Paths</h2>
                <p className="text-muted-foreground mb-8 max-w-2xl">
                  Structured workforce training programs designed to build job-ready skills from fundamentals to professional competency.
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
                          <p className="text-sm text-muted-foreground mb-4">{path.description}</p>
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

            <section className="py-12">
              <div className="container mx-auto max-w-7xl px-4">
                <Tabs defaultValue="courses" className="space-y-8">
                  <TabsList className="bg-card/60 border border-border/30">
                    <TabsTrigger value="courses" className="data-[state=active]:bg-aethex-500/20">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Courses
                    </TabsTrigger>
                    <TabsTrigger value="workshops" className="data-[state=active]:bg-aethex-500/20">
                      <Video className="h-4 w-4 mr-2" />
                      Workshops
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="courses" className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative flex-1 max-w-xl">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          placeholder="Search courses..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="pl-10 bg-card/60 border-border/50"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setSelectedCategory(null)}
                          className={`px-4 py-2 rounded-lg transition text-sm ${
                            selectedCategory === null
                              ? "bg-aethex-500/20 text-aethex-300 border border-aethex-500/50"
                              : "bg-card/50 text-muted-foreground border border-border/50"
                          }`}
                        >
                          All
                        </button>
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat.value}
                            onClick={() => setSelectedCategory(selectedCategory === cat.value ? null : cat.value)}
                            className={`px-4 py-2 rounded-lg transition text-sm ${
                              selectedCategory === cat.value
                                ? "bg-aethex-500/20 text-aethex-300 border border-aethex-500/50"
                                : "bg-card/50 text-muted-foreground border border-border/50"
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {isLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-aethex-400" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course) => (
                          <Card
                            key={course.id}
                            className="group bg-card/60 backdrop-blur-sm border-border/30 hover:border-aethex-400/50 transition-all duration-300 hover:translate-y-[-2px] overflow-hidden cursor-pointer"
                          >
                            <div className="h-40 bg-gradient-to-br from-aethex-500/20 via-red-500/10 to-gold-500/20 flex items-center justify-center">
                              <Play className="h-12 w-12 text-white/50 group-hover:text-aethex-400 group-hover:scale-110 transition-all" />
                            </div>
                            <CardContent className="p-6">
                              <h3 className="font-bold text-lg mb-2 group-hover:text-aethex-400 transition-colors">
                                {course.title}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                {course.description}
                              </p>
                              <div className="flex gap-2 mb-4">
                                <Badge variant="outline" className={difficultyColors[course.difficulty]}>
                                  {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {course.estimated_hours}h
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {course.students?.toLocaleString()}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="workshops" className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold">Upcoming Workshops</h3>
                      <Badge variant="outline" className="border-aethex-400/30 text-aethex-400">
                        {upcomingWorkshops.length} upcoming
                      </Badge>
                    </div>

                    {upcomingWorkshops.length === 0 ? (
                      <Card className="bg-card/60 border-border/30">
                        <CardContent className="p-12 text-center">
                          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No upcoming workshops scheduled.</p>
                          <p className="text-sm text-muted-foreground mt-2">Check back soon for new events!</p>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {upcomingWorkshops.map((workshop) => (
                          <Card key={workshop.id} className="bg-card/60 border-border/30 hover:border-aethex-400/50 transition-all">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <h4 className="font-bold text-lg mb-1">{workshop.title}</h4>
                                  <p className="text-sm text-muted-foreground">{workshop.instructor}</p>
                                </div>
                                <Badge className="bg-aethex-500/20 text-aethex-300">{workshop.level}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-4">{workshop.description}</p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {workshop.date}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {workshop.time}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {workshop.registered}/{workshop.capacity}
                                </span>
                              </div>
                              <Button className="w-full bg-gradient-to-r from-aethex-500 to-red-600">
                                Register Now
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </section>
          </main>
        </div>
      </Layout>
    </>
  );
}
