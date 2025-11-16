import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, FileText, AlertCircle } from "lucide-react";

export default function EthicsCouncil() {
  const councilMembers = [
    {
      name: "Council Member 1",
      role: "Lead Ethics Advisor",
      bio: "Oversees ethical guidelines and community standards",
      expertise: "Community Governance",
    },
    {
      name: "Council Member 2",
      role: "Technical Standards",
      bio: "Ensures technical integrity and open source compliance",
      expertise: "Open Source Policy",
    },
    {
      name: "Council Member 3",
      role: "Educational Integrity",
      bio: "Maintains quality and accessibility of educational content",
      expertise: "Education & Curriculum",
    },
  ];

  const responsibilities = [
    {
      title: "Community Standards",
      description: "Establishing and maintaining codes of conduct and ethical guidelines",
      icon: Users,
    },
    {
      title: "Transparency",
      description: "Ensuring open governance and public decision-making processes",
      icon: FileText,
    },
    {
      title: "Conflict Resolution",
      description: "Addressing disputes and maintaining community trust",
      icon: Shield,
    },
    {
      title: "Policy Review",
      description: "Regular review and updates to foundation policies",
      icon: AlertCircle,
    },
  ];

  return (
    <>
      <SEO
        pageTitle="Ethics Council"
        description="Meet the AeThex Foundation Ethics Council - ensuring integrity, transparency, and community trust."
      />
      <Layout>
        <div className="container mx-auto px-4 py-16 space-y-16">
          <section className="text-center space-y-6 max-w-4xl mx-auto">
            <Badge variant="outline" className="border-aethex-400/50 text-aethex-400">
              Governance
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="text-gradient bg-gradient-to-r from-aethex-500 via-red-500 to-gold-500 bg-clip-text text-transparent">
                Ethics Council
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              The Ethics Council ensures the Foundation operates with integrity, transparency, and in the best interest of our community.
            </p>
          </section>

          <section className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Council Members</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our council is composed of experienced community members committed to maintaining trust and ethical standards.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {councilMembers.map((member, index) => (
                <Card key={index} className="border-border/30 hover:border-aethex-400/50 transition-all">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-aethex-500 to-red-600 grid place-items-center mb-4 mx-auto">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-center">{member.name}</CardTitle>
                    <Badge variant="outline" className="mx-auto border-aethex-400/30">
                      {member.role}
                    </Badge>
                  </CardHeader>
                  <CardContent className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                    <p className="text-xs font-semibold text-aethex-400">{member.expertise}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Responsibilities</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The Council's primary responsibilities in ensuring Foundation integrity.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {responsibilities.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Card key={index} className="bg-card/60 backdrop-blur-sm border-border/30 text-center">
                    <CardContent className="pt-6 space-y-3">
                      <div className="w-12 h-12 rounded-lg bg-aethex-500/10 grid place-items-center mx-auto">
                        <Icon className="h-6 w-6 text-aethex-400" />
                      </div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <section className="bg-gradient-to-r from-aethex-500/10 to-red-500/10 rounded-xl p-8 border border-aethex-400/20 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Shield className="h-6 w-6 text-aethex-400" />
                Report a Concern
              </h2>
              <p className="text-muted-foreground">
                If you have concerns about Foundation policies, community conduct, or ethical matters, the Council is here to listen and take action.
              </p>
              <div className="pt-4">
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-aethex-500 hover:bg-aethex-600 rounded-lg font-semibold transition-colors"
                >
                  Contact the Council
                </a>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}
