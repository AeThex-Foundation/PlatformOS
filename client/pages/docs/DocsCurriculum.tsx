import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import DocsLayout from "@/components/docs/DocsLayout";
import {
  ArrowRight,
  BookOpenCheck,
  Compass,
  GraduationCap,
  Layers,
  ListChecks,
  Sparkles,
  Target,
  Timer,
  Gamepad2,
  Globe,
  Palette,
  Briefcase,
  CheckCircle2,
  Play,
  FileText,
  Video,
  Code,
} from "lucide-react";

interface CurriculumLesson {
  title: string;
  summary: string;
  format: "article" | "video" | "interactive" | "project";
  duration: string;
}

interface CurriculumModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: "beginner" | "intermediate" | "advanced";
  icon: typeof Gamepad2;
  focus: string[];
  learningGoals: string[];
  lessons: CurriculumLesson[];
  capstone?: {
    title: string;
    summary: string;
    brief: string;
  };
}

const moduleLevelStyles: Record<CurriculumModule["level"], string> = {
  beginner: "bg-emerald-500/10 text-emerald-200 border-emerald-500/40",
  intermediate: "bg-gold-500/10 text-gold-200 border-gold-500/40",
  advanced: "bg-red-500/10 text-red-200 border-red-500/40",
};

const lessonFormatCopy: Record<CurriculumLesson["format"], string> = {
  article: "Reading",
  video: "Video Lesson",
  interactive: "Hands-On Lab",
  project: "Portfolio Project",
};

const curriculumModules: CurriculumModule[] = [
  {
    id: "interactive-media",
    title: "Interactive Media Development",
    description:
      "Learn game design, interactive storytelling, and hands-on development with Unity and Roblox Studio. Build portfolio-ready projects.",
    duration: "40+ hours",
    level: "beginner",
    icon: Gamepad2,
    focus: [
      "Game Design Principles",
      "Unity Fundamentals",
      "Roblox Studio",
      "Interactive Storytelling",
    ],
    learningGoals: [
      "Understand core game design concepts and player psychology",
      "Build playable games in Unity with C# scripting",
      "Create Roblox experiences with Lua programming",
      "Design engaging narratives for interactive media",
    ],
    lessons: [
      {
        title: "Introduction to Game Design",
        summary:
          "Explore the fundamentals of game design: mechanics, dynamics, and aesthetics framework.",
        format: "video",
        duration: "45 min",
      },
      {
        title: "Unity Basics: Your First Game",
        summary:
          "Set up Unity, learn the interface, and create a simple 2D game from scratch.",
        format: "interactive",
        duration: "2 hrs",
      },
      {
        title: "Roblox Studio Fundamentals",
        summary:
          "Build your first Roblox experience using Studio tools and basic Lua scripting.",
        format: "interactive",
        duration: "2 hrs",
      },
      {
        title: "Storytelling in Games",
        summary:
          "Learn narrative design techniques for creating immersive player experiences.",
        format: "article",
        duration: "30 min",
      },
    ],
    capstone: {
      title: "Create Your Own Game",
      summary:
        "Design and build a complete playable game in Unity or Roblox to add to your portfolio.",
      brief:
        "Document your design process, implement core gameplay mechanics, and publish a playable demo.",
    },
  },
  {
    id: "web-development",
    title: "Web & Application Development",
    description:
      "Master modern web technologies including HTML, CSS, JavaScript, and React. Build responsive websites and web applications.",
    duration: "60+ hours",
    level: "beginner",
    icon: Globe,
    focus: [
      "HTML & CSS Foundations",
      "JavaScript Essentials",
      "React Development",
      "Backend Basics",
    ],
    learningGoals: [
      "Build responsive websites with HTML and CSS",
      "Write interactive features with JavaScript",
      "Create component-based UIs with React",
      "Understand server-side concepts and APIs",
    ],
    lessons: [
      {
        title: "HTML & CSS Foundations",
        summary:
          "Learn semantic HTML structure and modern CSS styling techniques including Flexbox and Grid.",
        format: "interactive",
        duration: "3 hrs",
      },
      {
        title: "JavaScript Essentials",
        summary:
          "Master JavaScript fundamentals: variables, functions, DOM manipulation, and events.",
        format: "video",
        duration: "2 hrs",
      },
      {
        title: "Introduction to React",
        summary:
          "Build your first React application with components, props, and state management.",
        format: "interactive",
        duration: "3 hrs",
      },
      {
        title: "Working with APIs",
        summary:
          "Connect your frontend to backend services using fetch and REST API concepts.",
        format: "article",
        duration: "1 hr",
      },
    ],
    capstone: {
      title: "Build a Full-Stack Web App",
      summary:
        "Create a complete web application with frontend, backend integration, and user authentication.",
      brief:
        "Design, develop, and deploy a responsive web application that showcases your full-stack skills.",
    },
  },
  {
    id: "creative-technology",
    title: "Creative Technology & Digital Arts",
    description:
      "Explore digital art, audio production, motion graphics, and visual design. Perfect for artists transitioning to tech.",
    duration: "30+ hours",
    level: "beginner",
    icon: Palette,
    focus: [
      "Digital Art Fundamentals",
      "Audio Production",
      "Motion Graphics",
      "Portfolio Building",
    ],
    learningGoals: [
      "Create digital artwork for games and web applications",
      "Produce audio assets and understand sound design basics",
      "Design motion graphics and animations",
      "Build a professional creative portfolio",
    ],
    lessons: [
      {
        title: "Digital Art for Interactive Media",
        summary:
          "Learn digital painting, asset creation, and design principles for games and apps.",
        format: "video",
        duration: "2 hrs",
      },
      {
        title: "Audio Production Basics",
        summary:
          "Create sound effects and background music using free tools and techniques.",
        format: "interactive",
        duration: "2 hrs",
      },
      {
        title: "Motion Graphics Introduction",
        summary:
          "Design animated graphics and UI animations for digital products.",
        format: "video",
        duration: "1.5 hrs",
      },
      {
        title: "Building Your Creative Portfolio",
        summary:
          "Curate and present your work professionally for job applications and freelance.",
        format: "article",
        duration: "45 min",
      },
    ],
    capstone: {
      title: "Complete Creative Portfolio",
      summary:
        "Compile your best work into a professional portfolio website showcasing your creative skills.",
      brief:
        "Create at least 5 portfolio pieces across different mediums with professional presentation.",
    },
  },
  {
    id: "professional-development",
    title: "Professional Development & Career Skills",
    description:
      "Prepare for your tech career with resume building, interview preparation, networking, and freelance fundamentals.",
    duration: "15+ hours",
    level: "intermediate",
    icon: Briefcase,
    focus: [
      "Resume & LinkedIn",
      "Interview Preparation",
      "Industry Networking",
      "Freelance Basics",
    ],
    learningGoals: [
      "Create a compelling tech resume and LinkedIn profile",
      "Prepare for technical and behavioral interviews",
      "Build professional connections in the industry",
      "Understand freelance business fundamentals",
    ],
    lessons: [
      {
        title: "Crafting Your Tech Resume",
        summary:
          "Write a resume that highlights your projects, skills, and stands out to recruiters.",
        format: "article",
        duration: "1 hr",
      },
      {
        title: "Interview Preparation Workshop",
        summary:
          "Practice common interview questions and learn strategies for technical assessments.",
        format: "video",
        duration: "2 hrs",
      },
      {
        title: "Networking in Tech",
        summary:
          "Build meaningful professional connections through events, online communities, and mentorship.",
        format: "article",
        duration: "45 min",
      },
      {
        title: "Freelancing Fundamentals",
        summary:
          "Learn how to find clients, set rates, manage projects, and build a freelance business.",
        format: "video",
        duration: "1.5 hrs",
      },
    ],
    capstone: {
      title: "Career Launch Kit",
      summary:
        "Complete your job-ready materials including resume, portfolio, LinkedIn, and interview prep.",
      brief:
        "Prepare all materials needed to start applying for jobs or freelance opportunities.",
    },
  },
];

const curriculumHighlights = [
  {
    title: "Project-Based Learning",
    description: "Build real portfolio pieces as you learn, not just theory.",
    icon: Target,
  },
  {
    title: "Industry-Aligned Skills",
    description:
      "Curriculum designed with input from employers and hiring managers.",
    icon: Sparkles,
  },
  {
    title: "Flexible Pacing",
    description:
      "Learn at your own speed with self-paced modules and no deadlines.",
    icon: Layers,
  },
];

const curriculumStats = [
  {
    label: "Total Learning Hours",
    value: "145+ hrs",
    icon: Timer,
  },
  {
    label: "Portfolio Projects",
    value: "12+",
    icon: ListChecks,
  },
  {
    label: "Certificates Available",
    value: "4 Tracks",
    icon: GraduationCap,
  },
];

const supplementalResources = [
  {
    title: "Course Downloads",
    description:
      "Access free PDFs, code samples, templates, and supplementary materials for all courses.",
    cta: "Browse Downloads",
    href: "/downloads",
  },
  {
    title: "Mentorship Program",
    description:
      "Connect with industry mentors for personalized guidance throughout your learning journey.",
    cta: "Find a Mentor",
    href: "/mentorship",
  },
  {
    title: "All Training Programs",
    description:
      "Explore the complete catalog of available courses, workshops, and bootcamps.",
    cta: "View Programs",
    href: "/programs",
  },
];

export default function DocsCurriculum() {
  return (
    <DocsLayout title="Curriculum">
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-900/80 p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.15),transparent_60%)]" />
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Badge className="w-fit bg-red-600/80 text-white">
                Foundation Curriculum
              </Badge>
              <h1 className="text-3xl font-semibold text-white sm:text-4xl">
                Course Syllabi & Learning Outcomes
              </h1>
              <p className="max-w-3xl text-base text-slate-200 sm:text-lg">
                Explore detailed course structures across all learning tracks. Each module 
                includes hands-on projects, video lessons, and practical assignments designed 
                to build job-ready skills.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {curriculumStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card
                    key={stat.label}
                    className="border-slate-800 bg-slate-900/70 shadow-lg backdrop-blur"
                  >
                    <CardHeader className="flex flex-row items-center gap-3 pb-2">
                      <span className="rounded-full bg-red-500/10 p-2 text-red-200">
                        <Icon className="h-5 w-5" />
                      </span>
                      <CardTitle className="text-slate-100 text-lg">
                        {stat.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 text-2xl font-semibold text-white">
                      {stat.value}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
          <Card className="border-slate-800 bg-slate-900/70 shadow-xl backdrop-blur">
            <CardHeader className="space-y-4">
              <CardTitle className="flex items-center gap-3 text-2xl text-white">
                <Compass className="h-6 w-6 text-red-300" /> Learning Tracks
              </CardTitle>
              <CardDescription className="text-slate-300">
                Expand each track to view course modules, lesson formats, and learning outcomes. 
                Each track ends with a capstone project for your portfolio.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Accordion type="single" collapsible className="space-y-3">
                {curriculumModules.map((module) => {
                  const ModuleIcon = module.icon;
                  return (
                    <AccordionItem
                      key={module.id}
                      value={module.id}
                      className="overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-950/70"
                    >
                      <AccordionTrigger className="px-5 py-4 text-left hover:no-underline data-[state=open]:bg-slate-900/70">
                        <div className="flex w-full flex-col gap-2 text-left">
                          <div className="flex flex-wrap items-center gap-2">
                            <ModuleIcon className="h-5 w-5 text-red-300" />
                            <Badge
                              variant="outline"
                              className={moduleLevelStyles[module.level]}
                            >
                              {module.level.charAt(0).toUpperCase() + module.level.slice(1)}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="border-slate-700/60 bg-slate-900/70 text-slate-200"
                            >
                              {module.duration}
                            </Badge>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white sm:text-xl">
                              {module.title}
                            </h3>
                            <p className="text-sm text-slate-300">
                              {module.description}
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-5 pb-6 pt-2">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
                              Topics Covered
                            </h4>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {module.focus.map((focusItem) => (
                                <Badge
                                  key={focusItem}
                                  variant="outline"
                                  className="border-slate-700/60 bg-slate-900/60 text-xs text-slate-200"
                                >
                                  {focusItem}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
                              What You'll Learn
                            </h4>
                            <ul className="mt-2 space-y-2">
                              {module.learningGoals.map((goal, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-400 flex-shrink-0" />
                                  {goal}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-4">
                            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
                              Course Modules
                            </h4>
                            <div className="mt-3 space-y-3">
                              {module.lessons.map((lesson, index) => (
                                <div
                                  key={lesson.title}
                                  className="rounded-xl border border-slate-800/60 bg-slate-950/80 p-4"
                                >
                                  <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                      <p className="text-xs uppercase text-slate-400">
                                        Module {index + 1}
                                      </p>
                                      <h5 className="text-base font-semibold text-white">
                                        {lesson.title}
                                      </h5>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-300">
                                      <Badge
                                        variant="outline"
                                        className="border-slate-700/60 bg-slate-900/60 text-xs"
                                      >
                                        {lessonFormatCopy[lesson.format]}
                                      </Badge>
                                      <span>{lesson.duration}</span>
                                    </div>
                                  </div>
                                  <p className="mt-2 text-sm text-slate-300">
                                    {lesson.summary}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {module.capstone && (
                            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
                              <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-red-100">
                                <Sparkles className="h-4 w-4" /> Capstone Project
                              </h4>
                              <div className="mt-2 space-y-2">
                                <p className="text-base font-semibold text-white">
                                  {module.capstone.title}
                                </p>
                                <p className="text-sm text-red-100/80">
                                  {module.capstone.summary}
                                </p>
                                <p className="text-xs text-red-200/80">
                                  {module.capstone.brief}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-slate-800 bg-slate-900/70 shadow-xl">
              <CardHeader className="space-y-2">
                <CardTitle className="text-xl text-white">
                  Why Our Curriculum Works
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Designed by industry professionals for career readiness.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {curriculumHighlights.map((highlight) => {
                  const Icon = highlight.icon;
                  return (
                    <div
                      key={highlight.title}
                      className="flex items-start gap-3 rounded-2xl border border-slate-800/60 bg-slate-950/70 p-4"
                    >
                      <span className="rounded-lg bg-slate-900/80 p-2 text-red-200">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-white">
                          {highlight.title}
                        </p>
                        <p className="text-sm text-slate-300">
                          {highlight.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900/70 shadow-xl">
              <CardHeader className="space-y-2">
                <CardTitle className="flex items-center gap-2 text-xl text-white">
                  <BookOpenCheck className="h-5 w-5 text-red-300" />{" "}
                  Additional Resources
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Supplement your learning with these resources.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {supplementalResources.map((resource) => (
                  <div
                    key={resource.title}
                    className="space-y-2 rounded-2xl border border-slate-800/60 bg-slate-950/70 p-4"
                  >
                    <p className="text-sm font-semibold text-white">
                      {resource.title}
                    </p>
                    <p className="text-sm text-slate-300">
                      {resource.description}
                    </p>
                    <Button
                      asChild
                      variant="ghost"
                      className="h-8 w-fit gap-2 rounded-full border border-slate-800/60 bg-slate-900/60 px-3 text-xs text-slate-200 hover:border-red-500/50 hover:text-white"
                    >
                      <Link to={resource.href}>
                        {resource.cta} <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900/70 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Lesson Format Guide
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Understanding our different learning formats.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 rounded-2xl border border-slate-800/60 bg-slate-950/70 p-4">
                  <Video className="mt-1 h-5 w-5 text-red-200" />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Video Lessons
                    </p>
                    <p className="text-sm text-slate-300">
                      Watch instructor-led tutorials with real-world examples and demonstrations.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-slate-800/60 bg-slate-950/70 p-4">
                  <Code className="mt-1 h-5 w-5 text-gold-200" />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Hands-On Labs
                    </p>
                    <p className="text-sm text-slate-300">
                      Practice coding and building in guided, step-by-step exercises.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-slate-800/60 bg-slate-950/70 p-4">
                  <FileText className="mt-1 h-5 w-5 text-emerald-200" />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Reading Materials
                    </p>
                    <p className="text-sm text-slate-300">
                      In-depth articles covering concepts, best practices, and reference materials.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="rounded-2xl border border-red-500/40 bg-red-900/20 p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-white">
                Ready to Start Learning?
              </h3>
              <p className="text-gray-300 max-w-2xl text-sm">
                Enroll in any of our free training programs and begin building your career 
                in tech today. All courses include certificates upon completion.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-aethex-500 to-red-600 hover:from-aethex-600 hover:to-red-700 text-white"
              >
                <Link to="/programs">
                  <Play className="mr-2 h-5 w-5" />
                  Browse Programs
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-gold-500/50 text-gold-300 hover:bg-gold-500/10"
              >
                <Link to="/docs/getting-started">
                  <ArrowRight className="mr-2 h-5 w-5" />
                  How to Enroll
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
