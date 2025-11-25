import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "Alex Chen",
    role: "Indie Game Developer",
    avatar: "AC",
    quote: "The Foundation's curriculum took me from hobbyist to shipping my first game in 6 months. The community support was incredible.",
    rating: 5,
    project: "Stellar Odyssey",
  },
  {
    name: "Maria Rodriguez",
    role: "Unity Developer",
    avatar: "MR",
    quote: "I've learned more practical skills here than in 2 years of tutorials. The hands-on projects and mentorship are game-changers.",
    rating: 5,
    project: "Realm of Shadows",
  },
  {
    name: "Jordan Taylor",
    role: "Game Designer",
    avatar: "JT",
    quote: "Being part of this community opened doors I never knew existed. I landed my dream job through connections made here.",
    rating: 5,
    project: "Puzzle Dimensions",
  },
  {
    name: "Sam Okonkwo",
    role: "Technical Artist",
    avatar: "SO",
    quote: "The open-source tools saved me hundreds of hours. Contributing back to the community has been incredibly rewarding.",
    rating: 5,
    project: "Chromatic",
  },
  {
    name: "Elena Volkov",
    role: "Studio Lead",
    avatar: "EV",
    quote: "We hired 3 developers directly from the Foundation program. The quality of talent coming through is exceptional.",
    rating: 5,
    project: "Neon Drift Studios",
  },
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const next = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-aethex-900/20 to-transparent" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gradient bg-gradient-to-r from-aethex-400 to-gold-400 bg-clip-text text-transparent">
            Community Voices
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from developers who've transformed their careers through the Foundation
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <Card className="bg-card/60 backdrop-blur-sm border-aethex-500/20 hover:border-aethex-400/40 transition-colors">
                    <CardContent className="p-8">
                      <Quote className="h-10 w-10 text-aethex-400/40 mb-4" />
                      <p className="text-lg text-foreground/90 mb-6 italic leading-relaxed">
                        "{testimonial.quote}"
                      </p>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14 border-2 border-aethex-500/30">
                          <AvatarFallback className="bg-gradient-to-br from-aethex-500 to-red-600 text-white font-bold">
                            {testimonial.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                          <p className="text-xs text-aethex-400">{testimonial.project}</p>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="rounded-full border-aethex-500/30 hover:border-aethex-400 hover:bg-aethex-500/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setActiveIndex(index);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "w-8 bg-gradient-to-r from-aethex-500 to-gold-500"
                      : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="rounded-full border-aethex-500/30 hover:border-aethex-400 hover:bg-aethex-500/10"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
