import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Code, Download, ExternalLink } from "lucide-react";

export default function Protocol() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/hub/protocol");
    }
  }, [user, navigate]);

  const protocolDocs = [
    {
      title: "Whitepaper",
      description: "Complete technical whitepaper and vision document",
      icon: FileText,
      link: "#whitepaper",
    },
    {
      title: "Architecture Guide",
      description: "System architecture and design principles",
      icon: Code,
      link: "#architecture",
    },
    {
      title: "API Documentation",
      description: "Complete API reference and integration guides",
      icon: BookOpen,
      link: "#api",
    },
    {
      title: "Development Guide",
      description: "How to contribute and build with Foundation tools",
      icon: Code,
      link: "#dev-guide",
    },
  ];

  if (!user) {
    return null;
  }

  return (
    <>
      <SEO
        pageTitle="Protocol Documentation"
        description="AeThex Foundation protocol documentation, whitepaper, and technical guides."
      />
      <Layout>
        <div className="container mx-auto px-4 py-16 space-y-12">
          <section className="space-y-4">
            <Badge variant="outline" className="border-aethex-400/50 text-aethex-400">
              Protocol
            </Badge>
            <h1 className="text-4xl font-bold">
              <span className="text-gradient bg-gradient-to-r from-aethex-500 to-red-600 bg-clip-text text-transparent">
                Protocol Documentation
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Technical specifications, architecture guides, and development resources for the AeThex Foundation protocol.
            </p>
          </section>

          <section className="grid md:grid-cols-2 gap-6">
            {protocolDocs.map((doc, index) => {
              const Icon = doc.icon;
              return (
                <Card key={index} className="border-border/30 hover:border-aethex-400/50 transition-all group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-aethex-500 to-red-600 grid place-items-center">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-aethex-400 transition-colors" />
                    </div>
                    <CardTitle>{doc.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{doc.description}</p>
                    <Button
                      variant="link"
                      className="px-0 mt-4 text-aethex-400 hover:text-aethex-300"
                      asChild
                    >
                      <a href={doc.link}>Read More →</a>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </section>

          <section className="bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Foundation Whitepaper</h2>
            <div className="prose prose-invert max-w-none">
              <h3 className="text-xl font-semibold mb-4">Overview</h3>
              <p className="text-muted-foreground mb-6">
                The AeThex Foundation operates as a non-profit organization dedicated to empowering game developers through open-source tools, quality education, and community collaboration.
              </p>
              <h3 className="text-xl font-semibold mb-4">Core Principles</h3>
              <ul className="text-muted-foreground space-y-2 mb-6">
                <li>Open Source First - All tools and resources are freely available</li>
                <li>Community Driven - Governed by contributors and maintained collectively</li>
                <li>Educational Focus - Quality education and mentorship for all skill levels</li>
                <li>Transparency - Open governance and public decision-making</li>
              </ul>
              <h3 className="text-xl font-semibold mb-4">Technical Architecture</h3>
              <p className="text-muted-foreground mb-6">
                The Foundation maintains a suite of open-source tools and frameworks designed to streamline game development workflows. Our architecture emphasizes modularity, extensibility, and developer experience.
              </p>
              <Button className="bg-gradient-to-r from-aethex-500 to-red-600 hover:from-aethex-600 hover:to-red-700">
                <Download className="h-4 w-4 mr-2" />
                Download Full Whitepaper
              </Button>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}
