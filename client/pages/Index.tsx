import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingScreen from "@/components/LoadingScreen";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  Code,
  Users,
  Award,
  Download,
  GraduationCap,
} from "lucide-react";
import { AnimatedCounter } from "@/components/home/AnimatedCounter";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FeaturedProjectsSection } from "@/components/home/FeaturedProjectsSection";
import { ValuesSection } from "@/components/home/ValuesSection";
import { LatestUpdatesSection } from "@/components/home/LatestUpdatesSection";
import { CTASection } from "@/components/home/CTASection";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSection((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  type FeatureCard = {
    title: string;
    description: string;
    icon: any;
    color: string;
    link?: string;
    tags?: string[];
  };

  const foundationNav = [
    {
      title: "Programs",
      description: "Workforce training through workshops, certifications, and project-based learning",
      icon: GraduationCap,
      color: "from-aethex-500 to-red-600",
      link: "/programs",
      audience: "All skill levels",
    },
    {
      title: "Open Source",
      description: "Real-world tools and frameworks for hands-on technical skill building",
      icon: Code,
      color: "from-red-500 to-gold-500",
      link: "/hub/community",
      audience: "Learners",
    },
    {
      title: "Community",
      description: "Connect with mentors, join collaborative teams, and grow professionally",
      icon: Users,
      color: "from-gold-500 to-amber-500",
      link: "/community",
      audience: "Everyone",
    },
    {
      title: "Achievements",
      description: "Industry-recognized credentials and portfolio development",
      icon: Award,
      color: "from-amber-500 to-aethex-600",
      link: "/achievements",
      audience: "Contributors",
    },
  ];

  const platformFeatures: FeatureCard[] = [
    {
      title: "Learning Hub",
      description: "Your courses, progress, and certifications in one place",
      icon: BookOpen,
      color: "from-aethex-500 to-red-600",
      link: "/hub",
      tags: ["Courses", "Progress"],
    },
    {
      title: "Skills Portfolio",
      description: "Explore and contribute to open-source learning tools",
      icon: Code,
      color: "from-red-500 to-gold-500",
      link: "/hub/community",
      tags: ["Projects", "Skills"],
    },
    {
      title: "Learner Profile",
      description: "Public portfolio with verifiable credentials and achievements",
      icon: Award,
      color: "from-gold-500 to-amber-500",
      link: "/profile/me",
      tags: ["Portfolio", "Credentials"],
    },
    {
      title: "Resource Center",
      description: "Download guides, templates, and training materials",
      icon: Download,
      color: "from-amber-500 to-aethex-600",
      link: "/resources",
      tags: ["Guides", "Materials"],
    },
  ];

  const showcaseImpact = [
    {
      title: "Learners Trained",
      metric: 5000,
      suffix: "+",
      description: "Through workforce development programs",
      color: "bg-aethex-500/10 border-aethex-400/30",
    },
    {
      title: "Skill-Building Projects",
      metric: 25,
      suffix: "+",
      description: "Hands-on learning opportunities maintained",
      color: "bg-red-500/10 border-red-400/30",
    },
    {
      title: "Community Members",
      metric: 10000,
      suffix: "+",
      description: "Active learners in our professional network",
      color: "bg-gold-500/10 border-gold-400/30",
    },
    {
      title: "Educational Resources",
      metric: 100,
      suffix: "+",
      description: "Free digital literacy materials",
      color: "bg-amber-500/10 border-amber-400/30",
    },
  ];

  if (isLoading) {
    return (
      <LoadingScreen
        message="Connecting Foundation Network..."
        showProgress={true}
        duration={1200}
        accentColor="from-aethex-500 to-red-600"
        armLogo="https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fc02cb1bf5056479bbb3ea4bd91f0d472?format=webp&width=800"
      />
    );
  }

  return (
    <>
      <SEO
        pageTitle="Foundation"
        description="AeThex Foundation: Advancing workforce development and digital literacy through hands-on mentorship, project-based learning, and open-source technology education."
        canonical={
          typeof window !== "undefined"
            ? window.location.href
            : (undefined as any)
        }
      />
      <Layout>
        <section className="relative min-h-screen flex items-start justify-center overflow-hidden pt-24 sm:pt-36">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-aethex-900/50 via-background to-red-900/30" />
            <div className="absolute inset-0">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative w-96 h-96 opacity-5">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fc02cb1bf5056479bbb3ea4bd91f0d472?format=webp&width=800"
                    alt="Foundation Logo"
                    className="w-full h-full animate-float"
                  />
                </div>
              </div>

              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-aethex-400/20 animate-float"
                  style={{
                    width: `${10 + Math.random() * 20}px`,
                    height: `${10 + Math.random() * 20}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${4 + Math.random() * 3}s`,
                    clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="container mx-auto px-4 relative z-10 pb-24 sm:pb-28">
            <div className="text-center space-y-12">
              <div className="space-y-6 animate-scale-in">
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold">
                    <span className="text-gradient bg-gradient-to-r from-aethex-500 via-red-500 to-gold-500 bg-clip-text text-transparent">
                      AeThex Foundation
                    </span>
                  </h1>
                  <h2 className="text-2xl lg:text-3xl text-gradient animate-fade-in bg-gradient-to-r from-red-400 to-gold-400 bg-clip-text text-transparent">
                    Empowering Tomorrow's Workforce
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-3xl mx-auto animate-slide-up">
                    Advancing <strong className="text-red-300">workforce development</strong> and{" "}
                    <strong className="text-red-300">digital literacy</strong> through hands-on mentorship, project-based learning, and open-source technology education.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto animate-slide-up">
                {foundationNav.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={index}
                      to={item.link}
                      className="group"
                    >
                      <Card className="relative overflow-hidden rounded-xl border border-border/30 hover:border-aethex-400/50 bg-card/60 backdrop-blur-sm hover:translate-y-[-4px] hover:shadow-[0_12px_40px_rgba(217,55,55,0.3)] transition-all duration-300 h-full cursor-pointer"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-aethex-500/10 via-transparent to-gold-500/10" />
                        <CardContent className="p-6 flex flex-col items-center text-center gap-4 h-full justify-between">
                          <div
                            className={`relative w-14 h-14 rounded-lg bg-gradient-to-r ${item.color} grid place-items-center shadow-inner`}
                          >
                            <Icon className="h-7 w-7 text-white drop-shadow" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg mb-2">
                              {item.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              {item.description}
                            </p>
                            <Badge variant="outline" className="text-xs border-aethex-400/30">
                              {item.audience}
                            </Badge>
                          </div>
                          <div
                            className={`h-[2px] w-12 rounded-full bg-gradient-to-r ${item.color} opacity-60 group-hover:opacity-100 transition-opacity`}
                          />
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>

              <div className="max-w-6xl mx-auto animate-slide-up mt-8">
                <h3 className="text-2xl font-bold mb-6 text-gradient bg-gradient-to-r from-aethex-500 to-gold-500 bg-clip-text text-transparent">Our Impact</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {showcaseImpact.map((item, index) => (
                    <Card key={index} className={`border ${item.color} bg-opacity-50`}>
                      <CardContent className="pt-6">
                        <h4 className="font-semibold text-sm mb-2">{item.title}</h4>
                        <p className="text-2xl font-bold text-aethex-400 mb-2">
                          <AnimatedCounter end={item.metric} suffix={item.suffix} />
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="max-w-6xl mx-auto animate-slide-up mt-12">
                <h3 className="text-2xl font-bold mb-6">Your Foundation Hub</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {platformFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    const isActive = activeSection === index;
                    return (
                      <Card
                        key={`platform-${index}`}
                        className={`relative overflow-hidden rounded-xl border transition-all duration-500 group animate-fade-in ${
                          isActive
                            ? "border-aethex-500/60 glow-gold"
                            : "border-border/30 hover:border-aethex-400/50"
                        } bg-card/60 backdrop-blur-sm hover:translate-y-[-2px] hover:shadow-[0_8px_30px_rgba(217,55,55,0.25)]`}
                        style={{ animationDelay: `${(index + 4) * 0.08}s` }}
                      >
                        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-aethex-500/10 via-transparent to-gold-500/10" />
                        <CardContent className="p-5 sm:p-6 flex flex-col items-center text-center gap-3">
                          <div
                            className={`relative w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} grid place-items-center shadow-inner`}
                          >
                            <Icon className="h-6 w-6 text-white drop-shadow" />
                          </div>
                          <h3 className="font-semibold text-sm tracking-wide">
                            {feature.title}
                          </h3>
                          <div className="flex flex-wrap justify-center gap-2 min-h-[24px]">
                            {(feature.tags || []).slice(0, 2).map((tag, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="border-white/10 text-xs text-foreground/80"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {feature.description}
                          </p>
                          <div
                            className={`mt-1 h-[2px] w-16 rounded-full bg-gradient-to-r ${feature.color} opacity-60 group-hover:opacity-100 transition-opacity`}
                          />
                          {feature.link ? (
                            <div className="pt-1">
                              <Link
                                to={feature.link}
                                className="text-xs inline-flex items-center gap-1 text-aethex-400 hover:text-aethex-300"
                              >
                                Explore
                                <ArrowRight className="h-3 w-3" />
                              </Link>
                            </div>
                          ) : null}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-6 animate-slide-up mt-8">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-aethex-500 to-red-600 hover:from-aethex-600 hover:to-red-700 glow-gold hover-lift text-base sm:text-lg px-6 py-4 sm:px-8 sm:py-6"
                >
                  <Link
                    to="/hub"
                    className="flex items-center space-x-2 group"
                  >
                    <Sparkles className="h-5 w-5" />
                    <span>Get Started</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-aethex-400/50 hover:border-aethex-400 hover-lift text-base sm:text-lg px-6 py-4 sm:px-8 sm:py-6"
                >
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <LatestUpdatesSection />
        <FeaturedProjectsSection />
        <TestimonialsSection />
        <ValuesSection />
        <CTASection />
      </Layout>
    </>
  );
}
