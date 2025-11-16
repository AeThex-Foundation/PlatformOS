import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Heart, Code, Users, Award, Globe } from "lucide-react";

export default function About() {
  const axiomPrinciples = [
    {
      title: "Non-Profit Guardian",
      description: "The Foundation operates as a non-profit entity, ensuring our educational mission remains free from commercial pressures.",
      icon: Shield,
      color: "from-aethex-500 to-red-600",
    },
    {
      title: "Open Source First",
      description: "All tools, frameworks, and educational content are open source and freely available to the community.",
      icon: Code,
      color: "from-red-500 to-gold-500",
    },
    {
      title: "Community Driven",
      description: "Governed by contributors and maintained through collective effort and shared ownership.",
      icon: Users,
      color: "from-gold-500 to-amber-500",
    },
  ];

  const values = [
    {
      title: "Education & Growth",
      description: "Empowering developers through quality education, mentorship, and hands-on experience.",
      icon: Award,
    },
    {
      title: "Transparency",
      description: "Open governance, public roadmaps, and clear decision-making processes.",
      icon: Globe,
    },
    {
      title: "Collaboration",
      description: "Building together, learning together, and creating lasting value for the community.",
      icon: Heart,
    },
  ];

  return (
    <>
      <SEO
        pageTitle="About"
        description="Learn about AeThex Foundation's mission, values, and the Axiom Model that guides our work."
      />
      <Layout>
        <div className="container mx-auto px-4 py-16 space-y-16">
          <section className="text-center space-y-6 max-w-4xl mx-auto">
            <Badge variant="outline" className="border-aethex-400/50 text-aethex-400">
              Our Mission
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="text-gradient bg-gradient-to-r from-aethex-500 via-red-500 to-gold-500 bg-clip-text text-transparent">
                About the Foundation
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              AeThex Foundation is a non-profit organization dedicated to empowering game developers through open-source tools, quality education, and a thriving community.
            </p>
          </section>

          <section className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">The Axiom Model</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our foundation operates on three core principles that ensure independence, transparency, and community focus.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {axiomPrinciples.map((principle, index) => {
                const Icon = principle.icon;
                return (
                  <Card key={index} className="border-border/30 hover:border-aethex-400/50 transition-all">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${principle.color} grid place-items-center mb-4`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">{principle.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{principle.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <section className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Everything we do is guided by these core values that shape our community and programs.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index} className="bg-card/60 backdrop-blur-sm border-border/30">
                    <CardContent className="pt-6 text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-aethex-500/10 grid place-items-center mx-auto">
                        <Icon className="h-6 w-6 text-aethex-400" />
                      </div>
                      <h3 className="font-semibold text-lg">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <section className="bg-gradient-to-r from-aethex-500/10 to-red-500/10 rounded-xl p-8 border border-aethex-400/20 max-w-4xl mx-auto">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Join Our Mission</h2>
              <p className="text-muted-foreground">
                The Foundation is powered by contributors like you. Whether you're learning, teaching, or building tools, there's a place for you in our community.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Badge variant="outline" className="border-aethex-400/50">5,000+ Developers</Badge>
                <Badge variant="outline" className="border-aethex-400/50">25+ Open Source Projects</Badge>
                <Badge variant="outline" className="border-aethex-400/50">100% Free</Badge>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}
