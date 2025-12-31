import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, Code, Download, ExternalLink, Shield, Lock, Key } from "lucide-react";

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

          <section>
            <Tabs defaultValue="whitepaper" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 max-w-3xl">
              <TabsTrigger value="whitepaper">Whitepaper</TabsTrigger>
              <TabsTrigger value="governance">Governance</TabsTrigger>
              <TabsTrigger value="oauth">OAuth 2.0</TabsTrigger>
              <TabsTrigger value="passport">Passport API</TabsTrigger>
              <TabsTrigger value="architecture">Architecture</TabsTrigger>
            </TabsList>

            <TabsContent value="whitepaper" className="space-y-6">
              <Card className="border-border/30">
                <CardHeader>
                  <CardTitle>Foundation Whitepaper</CardTitle>
                  <CardDescription>Complete vision and technical specifications</CardDescription>
                </CardHeader>
                <CardContent className="prose prose-invert max-w-none">
                  <h3 className="text-xl font-semibold mb-4">Overview</h3>
                  <p className="text-muted-foreground mb-6">
                    The AeThex Foundation serves as the independent governance and authentication authority for the AeThex ecosystem. We maintain identity policy, operate AeThex Passport, and support mission-aligned workforce development in identity infrastructure.
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
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="governance" className="space-y-6">
              <Card className="border-border/30">
                <CardHeader>
                  <CardTitle>On-Chain Governance</CardTitle>
                  <CardDescription>AeThex DAO smart contracts and governance parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gradient-to-r from-gold-500/10 to-aethex-500/10 border border-gold-500/30 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-gold-400">$AETHEX Governance Token</h4>
                    <p className="text-sm text-muted-foreground">
                      The AeThex | Token ($AETHEX) is an ERC20 governance token with voting and delegation capabilities.
                      Token holders can create proposals, vote, and participate in Foundation governance.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Deployed Contracts</h3>
                    <div className="space-y-3">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-xs font-semibold text-muted-foreground mb-1">AeThex Token (Sepolia Testnet)</p>
                        <code className="text-xs font-mono text-aethex-400 break-all">
                          0xf846380e25b34B71474543fdB28258F8477E2Cf1
                        </code>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Timelock Controller (Sepolia Testnet)</p>
                        <code className="text-xs font-mono text-aethex-400 break-all">
                          0xDA8B4b2125B8837cAaa147265B401056b636F1D5
                        </code>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Governor (Sepolia Testnet)</p>
                        <code className="text-xs font-mono text-aethex-400 break-all">
                          0x6660344dA659aAcA0a7733dd70499be7ffa9F4Fa
                        </code>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Governance Parameters</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Voting Delay</p>
                        <p className="font-semibold">1 Day</p>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Voting Period</p>
                        <p className="font-semibold">1 Week</p>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Proposal Threshold</p>
                        <p className="font-semibold">0 Tokens</p>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Quorum</p>
                        <p className="font-semibold">4% of Total Supply</p>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Timelock Delay</p>
                        <p className="font-semibold">2 Days</p>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Total Supply</p>
                        <p className="font-semibold">1,000,000 $AETHEX</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-500/5 border border-blue-500/30 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-blue-400">Tally DAO Dashboard</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      View full proposal history, delegate voting power, and participate in governance on Tally.
                    </p>
                    <Button variant="outline" className="border-blue-500/50" asChild>
                      <a href="https://www.tally.xyz/gov/aethex-collective" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Tally Dashboard
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="oauth" className="space-y-6">
              <Card className="border-border/30">
                <CardHeader>
                  <CardTitle>OAuth 2.0 Provider Documentation</CardTitle>
                  <CardDescription>Integrate Foundation Passport authentication into your application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-aethex-400" />
                      Authorization Endpoint
                    </h3>
                    <code className="block bg-muted p-4 rounded-lg font-mono text-sm">
                      GET https://aethex.foundation/api/oauth/authorize
                    </code>
                    <p className="text-sm text-muted-foreground mt-2">
                      Required parameters: client_id, redirect_uri, response_type=code, scope, state, code_challenge, code_challenge_method
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Key className="h-5 w-5 text-aethex-400" />
                      Token Endpoint
                    </h3>
                    <code className="block bg-muted p-4 rounded-lg font-mono text-sm">
                      POST https://aethex.foundation/api/oauth/token
                    </code>
                    <p className="text-sm text-muted-foreground mt-2">
                      Exchange authorization code for access token. Supports refresh tokens and PKCE verification.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Lock className="h-5 w-5 text-aethex-400" />
                      UserInfo Endpoint
                    </h3>
                    <code className="block bg-muted p-4 rounded-lg font-mono text-sm">
                      GET https://aethex.foundation/api/oauth/userinfo
                    </code>
                    <p className="text-sm text-muted-foreground mt-2">
                      Retrieve authenticated user profile data. Requires Bearer token in Authorization header.
                    </p>
                  </div>

                  <div className="bg-amber-500/5 border border-amber-500/30 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-amber-400">OAuth Client Registration</h4>
                    <p className="text-sm text-muted-foreground">
                      To integrate Foundation Passport into your application, contact Foundation administrators to register your OAuth client.
                      You'll receive a client_id and client_secret for production use.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="passport" className="space-y-6">
              <Card className="border-border/30">
                <CardHeader>
                  <CardTitle>Passport API Documentation</CardTitle>
                  <CardDescription>Access public user profiles and achievement data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Get Public Profile</h3>
                    <code className="block bg-muted p-4 rounded-lg font-mono text-sm">
                      GET https://aethex.foundation/api/passport/:username
                    </code>
                    <p className="text-sm text-muted-foreground mt-2 mb-4">
                      Retrieve public profile data including username, bio, stats, and achievements.
                    </p>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Example Response:</p>
                      <pre className="text-xs overflow-x-auto">
{`{
  "id": "uuid",
  "username": "mrpiglr",
  "full_name": "Mr. PigLR",
  "avatar_url": "https://...",
  "bio": "Game developer and educator",
  "location": "San Francisco, CA",
  "level": 12,
  "total_xp": 5420,
  "current_streak": 7,
  "badge_count": 8,
  "social_links": { ... }
}`}
                      </pre>
                    </div>
                  </div>

                  <div className="bg-blue-500/5 border border-blue-500/30 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-blue-400">Rate Limiting</h4>
                    <p className="text-sm text-muted-foreground">
                      Public API endpoints are rate-limited to 100 requests per minute per IP address. 
                      Response includes cache headers for 5-minute caching.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="architecture" className="space-y-6">
              <Card className="border-border/30">
                <CardHeader>
                  <CardTitle>System Architecture</CardTitle>
                  <CardDescription>Foundation technical infrastructure and design patterns</CardDescription>
                </CardHeader>
                <CardContent className="prose prose-invert max-w-none">
                  <h3 className="text-xl font-semibold mb-4">The Axiom Model</h3>
                  <p className="text-muted-foreground mb-4">
                    Foundation operates as the "Government" - the central authority for identity and authentication across all AeThex properties.
                  </p>
                  <ul className="text-muted-foreground space-y-2 mb-6">
                    <li><strong>Foundation = Government:</strong> Owns the master identity database (user_profiles)</li>
                    <li><strong>Corp = Client:</strong> Authenticates through Foundation via OAuth 2.0</li>
                    <li><strong>Separation of Powers:</strong> Foundation can revoke Corp access if needed</li>
                    <li><strong>Single Source of Truth:</strong> All identities managed centrally</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-4">Technology Stack</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="font-semibold text-sm mb-2">Frontend</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>React 18 + TypeScript</li>
                        <li>Vite build system</li>
                        <li>TailwindCSS 3 + Radix UI</li>
                        <li>React Router 6</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-2">Backend</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>Express server</li>
                        <li>Supabase (PostgreSQL)</li>
                        <li>OAuth 2.0 + PKCE</li>
                        <li>Nodemailer (SMTP)</li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-4">Security</h3>
                  <p className="text-muted-foreground mb-4">
                    Foundation implements industry-standard security practices including PKCE for OAuth flows,
                    JWT access tokens, refresh token rotation, and comprehensive session management.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
        </div>
      </Layout>
    </>
  );
}
