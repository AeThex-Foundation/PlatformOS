import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Heart, Code, Users, Award, Globe, ArrowRight, Sparkles, Target, Eye, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatedCounter } from "@/components/home/AnimatedCounter";
import { foundationStats, missionContent, axiomPrinciples, coreValues, founderQuote } from "@/lib/content";

const principleIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  nonprofit: Shield,
  opensource: Code,
  community: Users,
};

const principleColors: Record<string, string> = {
  nonprofit: "from-aethex-500 to-red-600",
  opensource: "from-red-500 to-gold-500",
  community: "from-gold-500 to-amber-500",
};

const valueIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  education: Award,
  transparency: Globe,
  inclusion: Heart,
};

export default function About() {
  const stats = [
    foundationStats.developersTraining,
    foundationStats.openSourceProjects,
    foundationStats.countriesReached,
    foundationStats.workshopHours,
  ];

  return (
    <>
      <SEO
        pageTitle="About"
        description="Learn about AeThex Foundation's mission, values, and the Axiom Model that guides our work."
      />
      <Layout>
        <div className="min-h-screen">
          <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-aethex-900/30 via-background to-red-900/20" />

            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center space-y-6 max-w-4xl mx-auto">
                <Badge variant="outline" className="border-aethex-400/50 text-aethex-400">
                  <Heart className="h-3 w-3 mr-1" />
                  Our Story
                </Badge>
                <h1 className="text-4xl sm:text-6xl font-bold">
                  <span className="text-gradient bg-gradient-to-r from-aethex-500 via-red-500 to-gold-500 bg-clip-text text-transparent">
                    About the Foundation
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  AeThex Foundation is a non-profit organization dedicated to empowering game developers through open-source tools, quality education, and a thriving global community.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 max-w-5xl mx-auto">
                {stats.map((stat, index) => (
                  <Card key={index} className="bg-card/60 backdrop-blur-sm border-aethex-500/20 text-center">
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold text-aethex-400 mb-1">
                        <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                      </div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 bg-gradient-to-b from-transparent to-aethex-900/10">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <Card className="bg-card/60 backdrop-blur-sm border-aethex-500/20">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-aethex-500 to-red-600 grid place-items-center mb-6">
                      <Target className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{missionContent.mission.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {missionContent.mission.description}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-card/60 backdrop-blur-sm border-aethex-500/20">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-aethex-500 to-red-600 grid place-items-center mb-6">
                      <Eye className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{missionContent.vision.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {missionContent.vision.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">The Axiom Model</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Our foundation operates on three core principles that ensure independence, transparency, and community focus.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {axiomPrinciples.map((principle, index) => {
                  const Icon = principleIcons[principle.key];
                  const color = principleColors[principle.key];
                  return (
                    <Card key={index} className="group border-border/30 hover:border-aethex-400/50 transition-all duration-300 hover:translate-y-[-2px]">
                      <CardHeader>
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${color} grid place-items-center mb-4 shadow-lg`}>
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <CardTitle className="text-xl">{principle.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">{principle.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="py-16 bg-gradient-to-b from-aethex-900/10 to-transparent">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Everything we do is guided by these values that shape our community and programs.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {coreValues.map((value, index) => {
                  const Icon = valueIcons[value.key];
                  return (
                    <Card key={index} className="bg-card/60 backdrop-blur-sm border-border/30 hover:border-aethex-400/40 transition-all">
                      <CardContent className="pt-8 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-aethex-500/20 to-red-500/20 grid place-items-center mx-auto border border-aethex-500/30">
                          <Icon className="h-8 w-8 text-aethex-400" />
                        </div>
                        <h3 className="font-bold text-xl">{value.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <Card className="bg-gradient-to-r from-aethex-500/10 to-red-500/10 border-aethex-400/20">
                  <CardContent className="p-8">
                    <Quote className="h-10 w-10 text-aethex-400/40 mb-4" />
                    <blockquote className="text-xl text-foreground italic mb-4">
                      "{founderQuote.quote}"
                    </blockquote>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-aethex-500 to-red-600 grid place-items-center">
                        <span className="text-white font-bold">{founderQuote.initials}</span>
                      </div>
                      <div>
                        <p className="font-semibold">{founderQuote.author}</p>
                        <p className="text-sm text-muted-foreground">{founderQuote.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-aethex-900/50 via-red-900/30 to-aethex-900/50" />
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-6">
                  <span className="text-gradient bg-gradient-to-r from-aethex-400 to-gold-400 bg-clip-text text-transparent">
                    Join Our Mission
                  </span>
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  The Foundation is powered by contributors like you. Whether you're learning, teaching, or building tools, there's a place for you in our community.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button asChild size="lg" className="bg-gradient-to-r from-aethex-500 to-red-600 hover:from-aethex-600 hover:to-red-700">
                    <Link to="/signup" className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Join the Community
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-aethex-400/50 hover:border-aethex-400">
                    <Link to="/programs">
                      Explore Programs
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}
