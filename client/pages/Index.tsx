import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  Shield,
  Heart,
  GraduationCap,
} from "lucide-react";

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

  const labsNav = [
    {
      title: "Research",
      description: "Explore cutting-edge research and breakthrough discoveries",
      icon: GraduationCap,
      color: "from-yellow-400 to-yellow-600",
      link: "/research",
      audience: "All skill levels",
    },
    {
      title: "Experiments",
      description: "Innovative tools and experimental frameworks",
      icon: Code,
      color: "from-yellow-500 to-amber-500",
      link: "/experiments",
      audience: "Developers",
    },
    {
      title: "Community",
      description: "Connect with researchers and collaborate on projects",
      icon: Users,
      color: "from-amber-400 to-yellow-500",
      link: "/community",
      audience: "Everyone",
    },
    {
      title: "Achievements",
      description: "Build your research portfolio and showcase breakthroughs",
      icon: Award,
      color: "from-yellow-400 to-amber-600",
      link: "/achievements",
      audience: "Contributors",
    },
  ];

  const platformFeatures: FeatureCard[] = [
    {
      title: "Research Hub",
      description: "Your experiments, progress, and discoveries in one place",
      icon: BookOpen,
      color: "from-yellow-400 to-yellow-600",
      link: "/hub",
      tags: ["Research", "Progress"],
    },
    {
      title: "Project Showcase",
      description: "Explore and contribute to experimental research tools",
      icon: Code,
      color: "from-yellow-500 to-amber-500",
      link: "/hub/community",
      tags: ["Tools", "Libraries"],
    },
    {
      title: "Researcher Profile",
      description: "Public portfolio with verifiable breakthroughs and contributions",
      icon: Award,
      color: "from-amber-400 to-yellow-500",
      link: "/profile/me",
      tags: ["Portfolio", "Badges"],
    },
    {
      title: "Resource Center",
      description: "Download research tools, templates, and datasets",
      icon: Download,
      color: "from-yellow-400 to-amber-600",
      link: "/downloads",
      tags: ["Tools", "Assets"],
    },
  ];

  const showcaseImpact = [
    {
      title: "Researchers Connected",
      metric: "5,000+",
      description: "Through experiments and research programs",
      color: "bg-yellow-500/10 border-yellow-400/30",
    },
    {
      title: "Research Projects",
      metric: "25+",
      description: "Active experiments and breakthroughs",
      color: "bg-yellow-400/10 border-yellow-400/30",
    },
    {
      title: "Community Members",
      metric: "10,000+",
      description: "Active researchers in our network",
      color: "bg-amber-500/10 border-amber-400/30",
    },
    {
      title: "Resources Shared",
      metric: "100+",
      description: "Free research papers, guides, and datasets",
      color: "bg-yellow-400/10 border-yellow-400/30",
    },
  ];

  if (isLoading) {
    return (
      <LoadingScreen
        message="Connecting Labs Network..."
        showProgress={true}
        duration={1200}
        accentColor="from-yellow-400 to-yellow-600"
        armLogo="https://cdn.builder.io/api/v1/image/assets%2F9e2d722ce33b43fb82fef3c9ff87f2fb%2F8e68c2d3e68f4aa599086799e39bd53e"
      />
    );
  }

  return (
    <>
      <SEO
        pageTitle="Labs"
        description="AeThex Labs: Discover. Innovate. Transform. Cutting-edge research and breakthrough discoveries."
        canonical={
          typeof window !== "undefined"
            ? window.location.href
            : (undefined as any)
        }
      />
      <Layout hideFooter>
        <section className="relative min-h-screen flex items-start justify-center overflow-hidden pt-24 sm:pt-36">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/50 via-background to-amber-900/30" />
            <div className="absolute inset-0">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative w-96 h-96 opacity-5">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F9e2d722ce33b43fb82fef3c9ff87f2fb%2F8e68c2d3e68f4aa599086799e39bd53e"
                    alt="Labs Logo"
                    className="w-full h-full animate-float"
                  />
                </div>
              </div>

              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-yellow-400/20 animate-float"
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
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold font-labs">
                    <span className="text-gradient bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 bg-clip-text text-transparent">
                      AeThex Labs
                    </span>
                  </h1>
                  <h2 className="text-2xl lg:text-3xl text-gradient animate-fade-in bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent font-labs">
                    Discover. Innovate. Transform.
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-3xl mx-auto animate-slide-up">
                    Pushing the boundaries of technology through cutting-edge research and breakthrough discoveries. Join Labs and shape the future.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto animate-slide-up">
                {labsNav.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={index}
                      to={item.link}
                      className="group"
                    >
                      <Card className="relative overflow-hidden rounded-xl border border-border/30 hover:border-yellow-400/50 bg-card/60 backdrop-blur-sm hover:translate-y-[-4px] hover:shadow-[0_12px_40px_rgba(251,191,36,0.3)] transition-all duration-300 h-full cursor-pointer"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-yellow-500/10 via-transparent to-amber-500/10" />
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
                          {item.metric}
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
      </Layout>
    </>
  );
}
