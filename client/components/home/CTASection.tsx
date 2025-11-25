import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles, Users, BookOpen, Code } from "lucide-react";
import { Link } from "react-router-dom";

export function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-aethex-900/80 via-red-900/50 to-aethex-900/80" />
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-aethex-400/10 animate-float"
            style={{
              width: `${8 + Math.random() * 15}px`,
              height: `${8 + Math.random() * 15}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 4}s`,
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="text-gradient bg-gradient-to-r from-aethex-400 via-red-400 to-gold-400 bg-clip-text text-transparent">
              Ready to Build the Future?
            </span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of developers who are learning, creating, and innovating together. Your journey starts here.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            <Card className="bg-card/40 backdrop-blur-sm border-aethex-500/20">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-3 text-aethex-400" />
                <h3 className="font-semibold mb-1">Learn</h3>
                <p className="text-sm text-muted-foreground">Free courses and workshops</p>
              </CardContent>
            </Card>
            <Card className="bg-card/40 backdrop-blur-sm border-gold-500/20">
              <CardContent className="p-6 text-center">
                <Code className="h-8 w-8 mx-auto mb-3 text-gold-400" />
                <h3 className="font-semibold mb-1">Build</h3>
                <p className="text-sm text-muted-foreground">Open-source tools & projects</p>
              </CardContent>
            </Card>
            <Card className="bg-card/40 backdrop-blur-sm border-red-500/20">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-3 text-red-400" />
                <h3 className="font-semibold mb-1">Connect</h3>
                <p className="text-sm text-muted-foreground">Thriving community</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-aethex-500 to-red-600 hover:from-aethex-600 hover:to-red-700 text-lg px-8 py-6 glow-gold"
            >
              <Link to="/signup" className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Create Free Account
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/20 hover:border-aethex-400 text-lg px-8 py-6"
            >
              <Link to="/foundation/curriculum">
                Explore Curriculum
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
