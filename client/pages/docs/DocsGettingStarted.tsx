import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Rocket,
  Shield,
  Layers,
  BookOpen,
  Users,
  Target,
  Clock,
  Star,
  Compass,
  Award,
  FileText,
} from "lucide-react";
import DocsLayout from "@/components/docs/DocsLayout";

const learningTracks = [
  {
    title: "Interactive Media Development",
    description: "Game design, Unity, Roblox Studio, and interactive experiences",
    courses: 8,
    sections: ["Game Design Fundamentals", "Unity Basics", "Roblox Development", "Interactive Storytelling"],
    color: "from-red-500 to-aethex-500",
    duration: "6-12 months",
    level: "Beginner-Friendly",
  },
  {
    title: "Web & Application Development",
    description: "Modern web technologies, React, and full-stack development",
    courses: 10,
    sections: ["HTML/CSS Foundations", "JavaScript Essentials", "React Development", "Backend Basics"],
    color: "from-gold-500 to-amber-600",
    duration: "4-8 months",
    level: "Beginner-Friendly",
  },
  {
    title: "Creative Technology",
    description: "Digital art, audio production, and multimedia design",
    courses: 6,
    sections: ["Digital Art Basics", "Audio Production", "Motion Graphics", "Portfolio Building"],
    color: "from-red-600 to-rose-500",
    duration: "3-6 months",
    level: "All Levels",
  },
  {
    title: "Professional Development",
    description: "Career skills, industry preparation, and job readiness",
    courses: 5,
    sections: ["Resume Building", "Interview Prep", "Industry Networking", "Freelance Basics"],
    color: "from-aethex-400 to-red-500",
    duration: "4-8 weeks",
    level: "All Levels",
  },
];

const enrollmentPrereqs = [
  {
    title: "Create Your Account",
    description:
      "Sign up for a free AeThex Passport account to access all programs, track your progress, and earn certificates.",
    actionLabel: "Create Account",
    actionHref: "/onboarding",
    icon: Shield,
  },
  {
    title: "Review Available Programs",
    description:
      "Browse our training programs to find courses that match your career goals and current skill level.",
    actionLabel: "View Programs",
    actionHref: "/programs",
    icon: BookOpen,
  },
  {
    title: "Connect with Mentors",
    description:
      "Optional: Match with an industry mentor for personalized guidance and career advice throughout your learning journey.",
    actionLabel: "Find Mentors",
    actionHref: "/mentorship",
    icon: Users,
  },
];

const enrollmentSteps = [
  {
    title: "Complete Your Profile",
    description:
      "Fill out your interests, experience level, and career goals so we can recommend the right courses for you.",
  },
  {
    title: "Choose a Learning Track",
    description:
      "Select from Interactive Media, Web Development, Creative Tech, or Professional Development tracks.",
  },
  {
    title: "Enroll in Courses",
    description:
      "Browse available courses within your track and enroll in programs that fit your schedule and goals.",
  },
  {
    title: "Start Learning",
    description:
      "Access course materials, complete projects, and track your progress through your student dashboard.",
  },
];

const programBenefits = [
  {
    title: "Free Training Programs",
    description:
      "All Foundation courses are 100% free thanks to grant funding and community support. No hidden fees.",
    icon: Star,
  },
  {
    title: "Industry-Ready Skills",
    description:
      "Learn practical skills directly applicable to real jobs. Our curriculum is designed with employers in mind.",
    icon: Target,
  },
  {
    title: "Flexible Learning",
    description:
      "Study at your own pace with self-paced courses, or join cohort-based programs for structured learning.",
    icon: Clock,
  },
  {
    title: "Career Support",
    description:
      "Get resume reviews, interview prep, and connections to hiring partners through our career services.",
    icon: Award,
  },
];

const nextSteps = [
  {
    title: "Browse Programs",
    description:
      "Explore all available training programs and workshops.",
    href: "/programs",
  },
  {
    title: "View Curriculum",
    description:
      "See detailed course syllabi and learning outcomes.",
    href: "/docs/curriculum",
  },
  {
    title: "Download Materials",
    description:
      "Access free course guides, templates, and resources.",
    href: "/downloads",
  },
  {
    title: "Meet Mentors",
    description:
      "Connect with industry professionals for guidance.",
    href: "/mentorship",
  },
  {
    title: "Student FAQs",
    description:
      "Common questions about programs and enrollment.",
    href: "/docs/platform",
  },
  {
    title: "Join Community",
    description:
      "Connect with other learners and get support.",
    href: "/community",
  },
];

export default function DocsGettingStarted() {
  return (
    <DocsLayout title="Getting Started">
      <div className="space-y-12">
        <section className="space-y-4">
          <Badge className="bg-red-600/20 text-red-200 uppercase tracking-wide">
            <GraduationCap className="mr-2 h-3 w-3" />
            Student Enrollment Guide
          </Badge>
          <h2 className="text-3xl font-semibold text-white">
            Start Your Learning Journey with AeThex Foundation
          </h2>
          <p className="text-gray-300 max-w-3xl">
            Welcome to the AeThex Foundation Learning Hub! Our free workforce development 
            programs help you build career-ready skills in interactive media, web development, 
            and creative technology. This guide will walk you through enrollment, choosing 
            your learning path, and getting the most out of our programs.
          </p>
        </section>

        <section id="create-account" className="space-y-6">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-red-400" />
            <h3 className="text-2xl font-semibold text-white">
              Create Your AeThex Passport Account
            </h3>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-slate-900/60 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  Step 1 — Sign Up
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Create your free account using email, Google, GitHub, or Discord.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal pl-6 space-y-2 text-sm text-gray-300">
                  <li>
                    Visit{" "}
                    <Link to="/signup" className="text-aethex-400 underline">
                      Sign Up
                    </Link>
                    {" "}and enter your email address and create a password.
                  </li>
                  <li>
                    Or click "Continue with Google", "Continue with Discord", 
                    or "Continue with GitHub" for faster registration.
                  </li>
                  <li>
                    Check your email for a verification link and click to confirm your account.
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/60 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  Step 2 — Complete Your Profile
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Tell us about yourself so we can personalize your learning experience.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal pl-6 space-y-2 text-sm text-gray-300">
                  <li>
                    Add your name, display handle, and optional profile photo.
                  </li>
                  <li>
                    Select your current experience level (beginner, intermediate, or advanced).
                  </li>
                  <li>
                    Choose your interests and career goals from the provided options.
                  </li>
                  <li>
                    Click "Finish" to access your student dashboard and start browsing courses.
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>

          <div className="bg-slate-900/60 border border-slate-700 rounded-lg p-4 text-sm text-gray-300">
            <strong className="text-gold-300">Tips for Success</strong>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                Use an email you check regularly — we'll send course updates and deadline reminders.
              </li>
              <li>
                Complete your profile fully — this helps mentors and peers connect with you.
              </li>
              <li>
                If you don't receive verification emails, check your spam folder.
              </li>
            </ul>
          </div>
        </section>

        <section id="learning-tracks" className="space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <Compass className="h-6 w-6 text-gold-400" />
              <h3 className="text-2xl font-semibold text-white">
                Choose Your Learning Track
              </h3>
            </div>
            <p className="text-gray-300 max-w-2xl mx-auto text-sm">
              Each track is designed for different career paths. Pick the one that matches 
              your goals, or explore multiple tracks as you grow.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {learningTracks.map((track) => (
              <Card
                key={track.title}
                className="border-border/50 hover:border-aethex-400/40 transition-all"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div
                      className={`inline-flex rounded-lg bg-gradient-to-r ${track.color} px-3 py-1 text-xs uppercase tracking-wider text-white`}
                    >
                      {track.courses} courses
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {track.level}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-white mt-3">
                    {track.title}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {track.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                    {track.sections.map((section) => (
                      <li key={section} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-aethex-400" />
                        {section}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2 text-xs text-gray-400">
                    Duration: {track.duration}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="prerequisites" className="grid gap-6 lg:grid-cols-3">
          {enrollmentPrereqs.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="bg-slate-900/60 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2 text-lg">
                    <Icon className="h-5 w-5 text-red-400" />
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-gray-300">
                    {item.description}
                  </CardDescription>
                  <Button asChild variant="outline" className="justify-start border-gold-500/30 text-gold-300 hover:bg-gold-500/10">
                    <Link to={item.actionHref}>
                      <ArrowRight className="mr-2 h-4 w-4" />
                      {item.actionLabel}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section id="enrollment-steps" className="space-y-6">
          <div className="flex items-center gap-3">
            <Rocket className="h-6 w-6 text-red-400" />
            <h3 className="text-2xl font-semibold text-white">How to Enroll</h3>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {enrollmentSteps.map((step, index) => (
              <Card key={step.title} className="bg-slate-900/60 border-slate-700">
                <CardHeader className="space-y-1">
                  <Badge variant="outline" className="w-fit border-red-500/30 text-red-300">
                    Step {index + 1}
                  </Badge>
                  <CardTitle className="text-white text-lg">
                    {step.title}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {step.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section id="program-benefits" className="space-y-6">
          <div className="flex items-center gap-3">
            <Star className="h-6 w-6 text-gold-400" />
            <h3 className="text-2xl font-semibold text-white">
              Why Learn with AeThex Foundation
            </h3>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {programBenefits.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.title}
                  className="bg-slate-900/60 border-slate-700"
                >
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center gap-3">
                      <Icon className="h-5 w-5 text-gold-300" />
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-300 text-sm leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section id="what-to-expect" className="space-y-6">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-red-400" />
            <h3 className="text-2xl font-semibold text-white">
              What to Expect as a Student
            </h3>
          </div>
          <div className="bg-slate-900/60 border border-slate-700 rounded-lg p-6 text-sm text-gray-300">
            <p className="mb-4">
              Once enrolled, you'll have access to a personalized learning experience:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-white">Self-Paced Courses</strong> — Complete modules at your own speed with video lessons, reading materials, and hands-on projects.
              </li>
              <li>
                <strong className="text-white">Project-Based Learning</strong> — Build real portfolio pieces as you learn. Every course includes practical assignments.
              </li>
              <li>
                <strong className="text-white">Progress Tracking</strong> — Your dashboard shows completed courses, certificates earned, and recommended next steps.
              </li>
              <li>
                <strong className="text-white">Community Support</strong> — Join Discord channels with other students, ask questions, and collaborate on projects.
              </li>
              <li>
                <strong className="text-white">Mentorship Access</strong> — Optional 1:1 mentorship with industry professionals for personalized guidance.
              </li>
              <li>
                <strong className="text-white">Certificates</strong> — Earn digital certificates for completed courses to share on LinkedIn and resumes.
              </li>
            </ul>
          </div>
        </section>

        <section id="student-requirements" className="grid gap-6 lg:grid-cols-3">
          <Card className="bg-slate-900/60 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-lg">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                No Prior Experience Needed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm leading-relaxed">
                Our beginner tracks start from scratch. If you can use a computer and web browser, you can learn with us.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/60 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-lg">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                Computer with Internet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm leading-relaxed">
                Access courses from any device. Some advanced projects may require a Windows/Mac computer for software installation.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/60 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-lg">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                5-10 Hours Per Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm leading-relaxed">
                Recommended time commitment. Study at your own pace — there are no strict deadlines for self-paced courses.
              </p>
            </CardContent>
          </Card>
        </section>

        <section id="next-steps" className="space-y-4">
          <div className="flex items-center gap-3">
            <Layers className="h-6 w-6 text-gold-400" />
            <h3 className="text-2xl font-semibold text-white">Next Steps</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {nextSteps.map((link) => (
              <Card
                key={link.title}
                className="bg-slate-900/60 border-slate-700 hover:border-red-500/40 transition-colors"
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-white text-base">
                    {link.title}
                    <ArrowRight className="h-4 w-4 text-red-300" />
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-sm">
                    {link.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-start text-red-300 hover:text-red-200"
                  >
                    <Link to={link.href}>
                      Explore
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-red-500/40 bg-red-900/20 p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-white">
                Ready to Start Learning?
              </h3>
              <p className="text-gray-300 max-w-2xl text-sm">
                Create your free account today and explore our workforce development programs. 
                No credit card required — our programs are completely free.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-gradient-to-r from-aethex-500 to-red-600 hover:from-aethex-600 hover:to-red-700 text-white">
                <Link to="/onboarding">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Get Started Free
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-gold-500/50 text-gold-300 hover:bg-gold-500/10">
                <Link to="/programs">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Browse Programs
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
