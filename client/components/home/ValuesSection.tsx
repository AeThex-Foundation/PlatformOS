import { Card, CardContent } from "@/components/ui/card";
import { Heart, Lightbulb, Users, Shield, Rocket, Globe } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Community First",
    description: "We believe in the power of collaboration. Every decision we make prioritizes our community's growth and wellbeing.",
    gradient: "from-aethex-500 to-red-600",
  },
  {
    icon: Lightbulb,
    title: "Open Knowledge",
    description: "Education should be accessible to all. We share our expertise freely and encourage others to do the same.",
    gradient: "from-red-500 to-gold-500",
  },
  {
    icon: Shield,
    title: "Ethical Development",
    description: "We advocate for responsible game development practices that respect players and promote positive experiences.",
    gradient: "from-gold-500 to-amber-500",
  },
  {
    icon: Users,
    title: "Inclusive Excellence",
    description: "Diversity drives innovation. We welcome creators from all backgrounds and skill levels.",
    gradient: "from-amber-500 to-aethex-600",
  },
  {
    icon: Rocket,
    title: "Continuous Growth",
    description: "Learning never stops. We provide pathways for continuous skill development and career advancement.",
    gradient: "from-aethex-600 to-red-500",
  },
  {
    icon: Globe,
    title: "Global Impact",
    description: "Games connect people worldwide. We're building tools and training developers to create meaningful experiences.",
    gradient: "from-red-600 to-gold-500",
  },
];

export function ValuesSection() {
  return (
    <section className="py-16 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-900/10 to-transparent" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gradient bg-gradient-to-r from-aethex-400 to-gold-400 bg-clip-text text-transparent">
            Our Foundation Values
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The principles that guide everything we do
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <Card
                key={index}
                className="group relative overflow-hidden bg-card/40 backdrop-blur-sm border-border/20 hover:border-aethex-400/40 transition-all duration-300 hover:translate-y-[-2px]"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-aethex-500/10 via-transparent to-gold-500/10" />
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${value.gradient} grid place-items-center mb-4 shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
