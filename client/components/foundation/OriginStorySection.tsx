import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

interface OriginStorySectionProps {
  theme?: "red" | "default";
}

export function OriginStorySection({ theme = "red" }: OriginStorySectionProps) {
  const isRed = theme === "red";
  
  return (
    <section className={`py-16 relative ${isRed ? "border-t border-red-400/10" : ""}`}>
      {isRed && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-red-900/20 via-transparent to-red-900/20" />
      )}
      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-4 ${isRed ? "text-red-300" : "text-gradient bg-gradient-to-r from-aethex-400 to-gold-400 bg-clip-text text-transparent"}`}>
              Our Origin Story
            </h2>
          </div>

          <div className="space-y-8">
            <div className="prose prose-invert max-w-none">
              <p className={`text-lg leading-relaxed ${isRed ? "text-red-200/70" : "text-muted-foreground"}`}>
                In 2019, a small group of game developers faced a common frustration: the barriers to learning game development were too high. Quality resources were scattered, expensive, or locked behind paywalls. Mentorship was rare, and community support was fragmented.
              </p>
              <p className={`text-lg leading-relaxed ${isRed ? "text-red-200/70" : "text-muted-foreground"}`}>
                We asked ourselves: <span className={isRed ? "text-red-300 font-medium" : "text-foreground font-medium"}>What if we could build something different?</span> A place where knowledge flows freely, where experienced developers mentor newcomers, and where open-source tools are built for everyone.
              </p>
              <p className={`text-lg leading-relaxed ${isRed ? "text-red-200/70" : "text-muted-foreground"}`}>
                The AeThex Foundation was born from this vision. Starting with five founders sharing code and tutorials online, we've grown into a global community of thousands. Our open-source projects have been downloaded millions of times, and our workshops have trained developers across 20+ countries.
              </p>
            </div>

            <Card className={isRed 
              ? "bg-gradient-to-r from-red-950/40 to-red-900/20 border-red-400/30" 
              : "bg-gradient-to-r from-aethex-500/10 to-red-500/10 border-aethex-400/20"
            }>
              <CardContent className="p-8">
                <Quote className={`h-10 w-10 mb-4 ${isRed ? "text-red-400/40" : "text-aethex-400/40"}`} />
                <blockquote className={`text-xl italic mb-4 ${isRed ? "text-red-100" : "text-foreground"}`}>
                  "We believe that game development skills should be accessible to everyone, regardless of their background or resources. The games of tomorrow will be built by the diverse community we're nurturing today."
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-red-600 grid place-items-center">
                    <span className="text-white font-bold">MC</span>
                  </div>
                  <div>
                    <p className={`font-semibold ${isRed ? "text-red-300" : ""}`}>Marcus Chen</p>
                    <p className={`text-sm ${isRed ? "text-red-200/70" : "text-muted-foreground"}`}>Executive Director, AeThex Foundation</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid sm:grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${isRed ? "text-red-400" : "text-aethex-400"}`}>100%</div>
                <div className={`text-sm ${isRed ? "text-red-200/70" : "text-muted-foreground"}`}>Free Education</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gold-400 mb-2">Open Source</div>
                <div className={`text-sm ${isRed ? "text-red-200/70" : "text-muted-foreground"}`}>All Our Tools</div>
              </div>
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${isRed ? "text-red-400" : "text-red-400"}`}>Community</div>
                <div className={`text-sm ${isRed ? "text-red-200/70" : "text-muted-foreground"}`}>Owned & Governed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
