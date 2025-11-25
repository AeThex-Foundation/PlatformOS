import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import LoadingScreen from "@/components/LoadingScreen";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Shield,
  Eye,
  Gavel,
  Code,
  Vote,
  GraduationCap,
  ExternalLink,
  Github,
  Twitter,
} from "lucide-react";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const pillars = [
    {
      icon: Shield,
      title: "Sovereignty",
      description: "Users own their identity and data via the AeThex Passport.",
    },
    {
      icon: Eye,
      title: "Transparency",
      description: "The Axiom Protocol is open-source and fully auditable.",
    },
    {
      icon: Gavel,
      title: "Accountability",
      description: "Governed by an Independent Ethics Council with real power.",
    },
  ];

  const actionCards = [
    {
      icon: Code,
      title: "BUILD",
      subtitle: "For Developers",
      description: "Start building your next AI application on Axiom today.",
      link: "https://nexus.aethex.dev",
      linkText: "Start Building",
      external: true,
    },
    {
      icon: Vote,
      title: "GOVERN",
      subtitle: "For Architects",
      description: "Be a part of the AeThex DAO and shape the future.",
      link: "https://www.tally.xyz/gov/aethex",
      linkText: "Join the DAO",
      external: true,
    },
    {
      icon: GraduationCap,
      title: "LEARN",
      subtitle: "For Students",
      description: "Master the tools of the future in the GameForge.",
      link: "https://aethex.dev/gameforge",
      linkText: "Explore GameForge",
      external: true,
    },
  ];

  const ecosystemLinks = [
    { name: "QuantumLeap", href: "https://quantumleap.aethex.dev" },
    { name: "dev-link.me", href: "https://dev-link.me" },
    { name: "AeThex Labs", href: "https://aethex.sbs" },
  ];

  const resourceLinks = [
    { name: "Whitepaper", href: "/resources" },
    { name: "Brand Kit", href: "/foundation/downloads" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ];

  const socialLinks = [
    { name: "Discord", href: "https://discord.gg/aethex", icon: "discord" },
    { name: "X (Twitter)", href: "https://x.com/aethexfdn", icon: Twitter },
    { name: "GitHub", href: "https://github.com/aethex", icon: Github },
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
        description="The AeThex Foundation empowers the development and governance of the Axiom Protocol. Build the future of ethical AI."
        canonical={
          typeof window !== "undefined"
            ? window.location.href
            : (undefined as any)
        }
      />
      <Layout hideFooter>
        <div className="bg-institutional min-h-screen font-inter">
          {/* Hero Section */}
          <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-aethex-900/10 to-transparent" />
              {/* Abstract geometric shapes */}
              <div className="absolute top-20 left-10 w-64 h-64 bg-aethex-500/5 rounded-full blur-3xl animate-pulse-glow" />
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.03]">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fc02cb1bf5056479bbb3ea4bd91f0d472?format=webp&width=800"
                  alt=""
                  className="w-full h-full animate-float"
                />
              </div>
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center">
              <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
                <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight">
                  Welcome to the Future of{" "}
                  <span className="text-gradient bg-gradient-to-r from-aethex-400 via-gold-400 to-aethex-500 bg-clip-text text-transparent">
                    Ethical AI
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-inter">
                  The AeThex Foundation empowers the development and governance of the Axiom Protocol.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-black font-semibold px-8 py-6 text-lg rounded-lg shadow-lg shadow-gold-500/25 hover:shadow-gold-500/40 transition-all duration-300"
                  >
                    <Link to="/resources" className="flex items-center gap-2">
                      Apply for Grant
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-aethex-500/50 text-aethex-400 hover:bg-aethex-500/10 hover:border-aethex-400 font-semibold px-8 py-6 text-lg rounded-lg transition-all duration-300"
                  >
                    <a href="https://www.tally.xyz/gov/aethex" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <Vote className="h-5 w-5" />
                      Join the DAO
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-gentle">
              <div className="w-6 h-10 rounded-full border-2 border-gray-600 flex justify-center pt-2">
                <div className="w-1 h-2 bg-gray-600 rounded-full animate-pulse" />
              </div>
            </div>
          </section>

          {/* Pillars Section */}
          <section className="py-24 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-aethex-950/20 to-transparent" />
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center mb-16">
                <h2 className="font-heading text-3xl sm:text-4xl text-white mb-4">Our Principles</h2>
                <p className="text-gray-500 max-w-xl mx-auto">
                  The foundational values that guide everything we build
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {pillars.map((pillar, index) => {
                  const Icon = pillar.icon;
                  return (
                    <div
                      key={index}
                      className="group relative bg-gradient-to-b from-gray-900/50 to-transparent border border-gray-800/50 rounded-2xl p-8 hover:border-aethex-500/30 transition-all duration-500 animate-slide-up"
                      style={{ animationDelay: `${index * 0.15}s` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-aethex-500/5 via-transparent to-gold-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                      <div className="relative z-10">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-aethex-500 to-aethex-600 flex items-center justify-center mb-6 shadow-lg shadow-aethex-500/20 group-hover:shadow-aethex-500/40 transition-shadow duration-300">
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="font-heading text-2xl text-white mb-3">{pillar.title}</h3>
                        <p className="text-gray-400 leading-relaxed">{pillar.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Action Cards Section */}
          <section className="py-24 relative">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="font-heading text-3xl sm:text-4xl text-white mb-4">Get Involved</h2>
                <p className="text-gray-500 max-w-xl mx-auto">
                  Choose your path and start contributing to the ecosystem
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {actionCards.map((card, index) => {
                  const Icon = card.icon;
                  const CardWrapper = card.external ? 'a' : Link;
                  const cardProps = card.external 
                    ? { href: card.link, target: "_blank", rel: "noopener noreferrer" }
                    : { to: card.link };
                  
                  return (
                    <CardWrapper
                      key={index}
                      {...cardProps as any}
                      className="group relative bg-gray-900/30 border border-gray-800/50 rounded-2xl p-8 hover:border-gold-500/30 hover:bg-gray-900/50 transition-all duration-500 cursor-pointer animate-slide-up block"
                      style={{ animationDelay: `${index * 0.15}s` }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-aethex-500 via-gold-500 to-aethex-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl" />
                      
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold-500/20 to-gold-600/10 border border-gold-500/20 flex items-center justify-center group-hover:border-gold-400/40 transition-colors duration-300">
                          <Icon className="h-6 w-6 text-gold-400" />
                        </div>
                        <div>
                          <h3 className="font-heading text-xl text-white">{card.title}</h3>
                          <p className="text-xs text-gray-500 uppercase tracking-wider">{card.subtitle}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-400 mb-6 leading-relaxed">{card.description}</p>
                      
                      <div className="flex items-center gap-2 text-gold-400 font-medium group-hover:text-gold-300 transition-colors">
                        {card.linkText}
                        {card.external ? (
                          <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        ) : (
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        )}
                      </div>
                    </CardWrapper>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-gray-800/50 py-16 mt-12">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-4 gap-12 mb-12">
                {/* Logo & Description */}
                <div className="md:col-span-1">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fc02cb1bf5056479bbb3ea4bd91f0d472?format=webp&width=200"
                      alt="AeThex Foundation"
                      className="w-10 h-10"
                    />
                    <span className="font-heading text-xl text-white">AeThex</span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Empowering ethical AI development through transparent governance and community-driven innovation.
                  </p>
                </div>

                {/* Ecosystem */}
                <div>
                  <h4 className="font-semibold text-white mb-4 uppercase text-sm tracking-wider">Ecosystem</h4>
                  <ul className="space-y-3">
                    {ecosystemLinks.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-gold-400 transition-colors text-sm flex items-center gap-1"
                        >
                          {link.name}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resources */}
                <div>
                  <h4 className="font-semibold text-white mb-4 uppercase text-sm tracking-wider">Resources</h4>
                  <ul className="space-y-3">
                    {resourceLinks.map((link, index) => (
                      <li key={index}>
                        <Link
                          to={link.href}
                          className="text-gray-500 hover:text-gold-400 transition-colors text-sm"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Community */}
                <div>
                  <h4 className="font-semibold text-white mb-4 uppercase text-sm tracking-wider">Community</h4>
                  <ul className="space-y-3">
                    {socialLinks.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-gold-400 transition-colors text-sm flex items-center gap-2"
                        >
                          {typeof link.icon === 'string' ? (
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                            </svg>
                          ) : (
                            <link.icon className="h-4 w-4" />
                          )}
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="pt-8 border-t border-gray-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-gray-600 text-sm">
                  © {new Date().getFullYear()} AeThex Foundation. All rights reserved.
                </p>
                <div className="flex items-center gap-6">
                  <Link to="/privacy" className="text-gray-600 hover:text-gray-400 text-sm transition-colors">
                    Privacy
                  </Link>
                  <Link to="/terms" className="text-gray-600 hover:text-gray-400 text-sm transition-colors">
                    Terms
                  </Link>
                  <a 
                    href="https://www.tally.xyz/gov/aethex" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-400 text-sm transition-colors flex items-center gap-1"
                  >
                    Governance
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Layout>
    </>
  );
}
