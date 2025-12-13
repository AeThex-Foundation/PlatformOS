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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  GraduationCap,
  BookOpen,
  Users,
  Download,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Award,
  MessageCircle,
  FileText,
  Compass,
} from "lucide-react";
import { Link } from "react-router-dom";
import DocsLayout from "@/components/docs/DocsLayout";

const platformFeatures = [
  {
    title: "Training Programs",
    description:
      "Browse and enroll in free courses across Interactive Media, Web Development, Creative Technology, and Career Skills.",
    icon: BookOpen,
    href: "/programs",
    cta: "View Programs",
  },
  {
    title: "Course Downloads",
    description:
      "Access free PDFs, code templates, project files, and supplementary materials for all courses.",
    icon: Download,
    href: "/downloads",
    cta: "Browse Downloads",
  },
  {
    title: "Mentorship Program",
    description:
      "Connect with industry professionals for personalized guidance, code reviews, and career advice.",
    icon: Users,
    href: "/mentorship",
    cta: "Find a Mentor",
  },
  {
    title: "Student Dashboard",
    description:
      "Track your progress, view enrolled courses, earn certificates, and manage your learning journey.",
    icon: GraduationCap,
    href: "/dashboard",
    cta: "Go to Dashboard",
  },
];

const frequentlyAskedQuestions = [
  {
    question: "Are the programs really free?",
    answer:
      "Yes! All AeThex Foundation training programs are 100% free. We're funded through grants, donations, and community support to provide workforce development opportunities at no cost to learners.",
  },
  {
    question: "How do I enroll in a course?",
    answer:
      "First, create a free AeThex Passport account at /onboarding. Once logged in, visit /programs to browse available courses and click 'Enroll' on any course you'd like to take. You can enroll in multiple courses at once.",
  },
  {
    question: "Do I need prior experience?",
    answer:
      "No prior experience is required for beginner-level courses. Our curriculum is designed to take you from complete beginner to job-ready. Just bring curiosity and commitment to learn!",
  },
  {
    question: "How long does it take to complete a course?",
    answer:
      "Course length varies by track. Most individual modules take 1-3 hours. Complete learning tracks (like Interactive Media or Web Development) typically take 4-12 months at a pace of 5-10 hours per week.",
  },
  {
    question: "Are there certificates?",
    answer:
      "Yes! You'll receive a digital certificate for each completed course that you can add to your LinkedIn profile and resume. Certificates verify the skills you've learned.",
  },
  {
    question: "Can I learn at my own pace?",
    answer:
      "Absolutely. All courses are self-paced with no strict deadlines. You can start, pause, and resume whenever works for your schedule. Some cohort-based programs may have set schedules.",
  },
  {
    question: "How does mentorship work?",
    answer:
      "After enrolling in courses, you can apply for our mentorship program at /mentorship. If matched, you'll have regular 1:1 sessions with an industry professional who can provide personalized guidance and career advice.",
  },
  {
    question: "What software/tools do I need?",
    answer:
      "For most web development courses, just a computer with a web browser. For game development, you'll need to download Unity (free) or Roblox Studio (free). Each course lists specific requirements at the start.",
  },
  {
    question: "Is there community support?",
    answer:
      "Yes! Join our Discord community to connect with other learners, ask questions, share projects, and get help. Visit /community for links and more information.",
  },
  {
    question: "How do I get help if I'm stuck?",
    answer:
      "Multiple support options: 1) Ask in our Discord community, 2) Connect with a mentor, 3) Review course materials and FAQs, 4) Contact support at support@aethex.tech for technical issues.",
  },
];

const studentResources = [
  {
    title: "Getting Started Guide",
    description: "Step-by-step enrollment walkthrough for new students.",
    href: "/docs/getting-started",
    icon: Compass,
  },
  {
    title: "Course Curriculum",
    description: "Detailed syllabi and learning outcomes for all tracks.",
    href: "/docs/curriculum",
    icon: FileText,
  },
  {
    title: "Learning Guides",
    description: "Tutorials and step-by-step project walkthroughs.",
    href: "/docs/tutorials",
    icon: BookOpen,
  },
  {
    title: "Community & Support",
    description: "Connect with other learners and get help.",
    href: "/community",
    icon: MessageCircle,
  },
];

const successMetrics = [
  {
    stat: "1,000+",
    label: "Students Enrolled",
    icon: Users,
  },
  {
    stat: "95%",
    label: "Completion Rate",
    icon: CheckCircle2,
  },
  {
    stat: "4.8/5",
    label: "Average Rating",
    icon: Award,
  },
  {
    stat: "Free",
    label: "All Courses",
    icon: GraduationCap,
  },
];

export default function DocsPlatform() {
  return (
    <DocsLayout title="Student FAQs">
      <div className="space-y-12">
        <section className="space-y-4">
          <Badge className="bg-red-600/20 text-red-200 uppercase tracking-wide">
            <HelpCircle className="mr-2 h-3 w-3" />
            Student FAQs & Platform Guide
          </Badge>
          <h2 className="text-3xl font-semibold text-white">
            How to Use the Learning Platform
          </h2>
          <p className="text-gray-300 max-w-3xl">
            Find answers to common questions about our programs, enrollment, certificates, 
            mentorship, and how to navigate the AeThex Foundation learning platform.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {successMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.label} className="bg-slate-900/60 border-slate-700">
                <CardContent className="p-6 text-center">
                  <Icon className="h-8 w-8 text-red-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white">{metric.stat}</div>
                  <div className="text-sm text-gray-400">{metric.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section id="features" className="space-y-6">
          <div className="flex items-center gap-3">
            <Compass className="h-6 w-6 text-red-400" />
            <h3 className="text-2xl font-semibold text-white">Platform Features</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {platformFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="bg-slate-900/60 border-slate-700"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6 text-red-300" />
                        <CardTitle className="text-white text-lg">
                          {feature.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-gray-300 text-sm">
                      {feature.description}
                    </CardDescription>
                    <Button
                      asChild
                      variant="ghost"
                      className="justify-start text-red-200 hover:text-red-100 hover:bg-red-500/10"
                    >
                      <Link to={feature.href}>
                        {feature.cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section id="faqs" className="space-y-6">
          <div className="flex items-center gap-3">
            <HelpCircle className="h-6 w-6 text-gold-400" />
            <h3 className="text-2xl font-semibold text-white">
              Frequently Asked Questions
            </h3>
          </div>
          <Card className="bg-slate-900/60 border-slate-700">
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="space-y-2">
                {frequentlyAskedQuestions.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`faq-${index}`}
                    className="border-b border-slate-700/50 last:border-0"
                  >
                    <AccordionTrigger className="text-left text-white hover:text-red-300 hover:no-underline py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300 pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section>

        <section id="resources" className="space-y-6">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-red-400" />
            <h3 className="text-2xl font-semibold text-white">
              Student Resources
            </h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {studentResources.map((resource) => {
              const Icon = resource.icon;
              return (
                <Card
                  key={resource.title}
                  className="bg-slate-900/60 border-slate-700 hover:border-red-500/40 transition-colors"
                >
                  <CardHeader>
                    <CardTitle className="text-white text-base flex items-center gap-3">
                      <Icon className="h-5 w-5 text-red-300" />
                      {resource.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-gray-300 text-sm">
                      {resource.description}
                    </CardDescription>
                    <Button
                      asChild
                      variant="ghost"
                      className="justify-start text-red-200 hover:text-red-100 hover:bg-red-500/10"
                    >
                      <Link to={resource.href}>
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section id="support" className="space-y-6">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-6 w-6 text-gold-400" />
            <h3 className="text-2xl font-semibold text-white">
              Need More Help?
            </h3>
          </div>
          <Card className="bg-slate-900/60 border-slate-700">
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-semibold text-white">Community Discord</h4>
                  <p className="text-sm text-gray-300">
                    Join our Discord server to ask questions, share projects, and connect with other learners.
                  </p>
                  <Button asChild variant="outline" size="sm" className="border-gold-500/30 text-gold-300">
                    <Link to="/community">Join Community</Link>
                  </Button>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-white">Email Support</h4>
                  <p className="text-sm text-gray-300">
                    For technical issues or account problems, contact our support team.
                  </p>
                  <Button asChild variant="outline" size="sm" className="border-gold-500/30 text-gold-300">
                    <a href="mailto:support@aethex.tech">Contact Support</a>
                  </Button>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-white">Mentorship</h4>
                  <p className="text-sm text-gray-300">
                    Get personalized help from an industry mentor who can guide your learning.
                  </p>
                  <Button asChild variant="outline" size="sm" className="border-gold-500/30 text-gold-300">
                    <Link to="/mentorship">Find a Mentor</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="rounded-2xl border border-red-500/40 bg-red-900/20 p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-white">
                Ready to Start Learning?
              </h3>
              <p className="text-gray-300 max-w-2xl text-sm">
                Create your free account and begin your journey in tech today.
                Browse programs, enroll in courses, and start building your skills.
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
