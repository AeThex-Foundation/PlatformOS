import EducationLayout from "@/components/EducationLayout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Award,
  Clock,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

export default function EducationPrograms() {
  const programs = [
    {
      title: "Game Developer Certificate",
      description: "Comprehensive program covering Roblox, Unity, and game design fundamentals.",
      duration: "6 months",
      courses: 8,
      level: "Beginner to Intermediate",
      skills: [
        "Lua & C# Programming",
        "Game Design Principles",
        "3D Modeling Basics",
        "Monetization Strategies",
        "Publishing & Marketing"
      ],
      certificate: true,
      status: "Coming Soon"
    },
    {
      title: "Metaverse Creator Track",
      description: "Advanced program for building immersive metaverse experiences across platforms.",
      duration: "9 months",
      courses: 12,
      level: "Intermediate to Advanced",
      skills: [
        "Multi-platform Development",
        "Virtual World Design",
        "NFT Integration",
        "Social Features",
        "Advanced Scripting",
        "Performance Optimization"
      ],
      certificate: true,
      status: "Coming Soon"
    },
    {
      title: "Roblox Developer Mastery",
      description: "Deep-dive into Roblox development, from basic scripting to advanced monetization.",
      duration: "4 months",
      courses: 6,
      level: "All Levels",
      skills: [
        "Lua Programming",
        "Roblox Studio",
        "Game Mechanics",
        "DataStores & Servers",
        "DevProducts & Gamepasses"
      ],
      certificate: true,
      status: "Coming Soon"
    },
    {
      title: "Fortnite Creative Pro",
      description: "Master UEFN and creative mode to build next-gen Fortnite experiences.",
      duration: "3 months",
      courses: 5,
      level: "Beginner to Intermediate",
      skills: [
        "UEFN Fundamentals",
        "Verse Scripting",
        "Island Design",
        "Creative Devices",
        "Publishing & Promotion"
      ],
      certificate: true,
      status: "Coming Soon"
    }
  ];

  const benefits = [
    {
      icon: Award,
      title: "Industry-Recognized Certificate",
      description: "Earn credentials that employers and clients trust"
    },
    {
      icon: GraduationCap,
      title: "Structured Learning Path",
      description: "Clear progression from beginner to professional"
    },
    {
      icon: CheckCircle,
      title: "Project-Based Learning",
      description: "Build real portfolio projects as you learn"
    },
    {
      icon: Clock,
      title: "Self-Paced & Flexible",
      description: "Learn on your schedule, from anywhere"
    }
  ];

  return (
    <>
      <SEO
        pageTitle="Programs & Certificates - AeThex Education"
        description="Comprehensive game development certificate programs. Earn recognized credentials in Roblox, Fortnite, Unity, and metaverse development."
      />
      <EducationLayout>
        {/* Hero */}
        <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <Badge className="bg-white/20 text-white border-white/30 mb-4">
                🎓 Certificate Programs
              </Badge>
              <h1 className="text-5xl font-bold mb-4">Structured Learning Paths</h1>
              <p className="text-xl text-blue-100">
                Earn industry-recognized certificates through comprehensive, project-based programs
                designed to take you from beginner to professional.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-green-600 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Programs */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Certificate Programs</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Choose a structured learning path that matches your goals
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {programs.map((program, index) => (
                <Card key={index} className="hover:shadow-2xl transition-all border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-green-100 text-green-700">
                        {program.status}
                      </Badge>
                      {program.certificate && (
                        <Award className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <CardTitle className="text-2xl">{program.title}</CardTitle>
                    <CardDescription className="text-base">
                      {program.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Duration</div>
                        <div className="font-semibold">{program.duration}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Courses</div>
                        <div className="font-semibold">{program.courses}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Level</div>
                        <div className="font-semibold text-xs">{program.level}</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Skills You'll Learn</h4>
                      <ul className="space-y-2">
                        {program.skills.map((skill, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{skill}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600" asChild>
                      <Link to="/enroll">
                        Get Notified <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <GraduationCap className="h-16 w-16 mx-auto mb-6 text-blue-600" />
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              All programs are 100% free and include certification upon completion. Start building your
              game development career today.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600" asChild>
              <Link to="/enroll">
                Enroll Now - It's Free
              </Link>
            </Button>
          </div>
        </section>
      </EducationLayout>
    </>
  );
}
