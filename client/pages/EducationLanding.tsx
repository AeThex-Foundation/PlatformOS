import { useState, useEffect } from "react";
import EducationLayout from "@/components/EducationLayout";
import EducationSEO from "@/components/EducationSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Code,
  Users,
  Award,
  GraduationCap,
  Gamepad2,
  Rocket,
  CheckCircle,
  Star,
  Download,
  Monitor
} from "lucide-react";

export default function EducationLanding() {
  const [email, setEmail] = useState("");

  const features = [
    {
      icon: Gamepad2,
      title: "Roblox Development",
      description: "Master Lua scripting, game design, and monetization strategies for Roblox."
    },
    {
      icon: Code,
      title: "Fortnite Creative",
      description: "Build immersive experiences with UEFN and creative mode development."
    },
    {
      icon: Rocket,
      title: "Unity & Unreal",
      description: "Professional game development with industry-standard engines."
    },
    {
      icon: GraduationCap,
      title: "Certified Programs",
      description: "Earn recognized certifications in game development and metaverse creation."
    }
  ];

  const stats = [
    { value: "100%", label: "Free" },
    { value: "1000+", label: "Students" },
    { value: "50+", label: "Courses" },
    { value: "24/7", label: "Support" }
  ];

  const upcomingCourses = [
    {
      title: "Roblox Scripting Fundamentals",
      level: "Beginner",
      duration: "8 weeks",
      status: "Coming Soon"
    },
    {
      title: "Fortnite UEFN Mastery",
      level: "Intermediate",
      duration: "10 weeks",
      status: "Coming Soon"
    },
    {
      title: "Metaverse Builder Track",
      level: "Advanced",
      duration: "12 weeks",
      status: "Coming Soon"
    }
  ];

  return (
    <>
      <EducationSEO
        pageTitle="AeThex Education - Free Game Development Courses"
        description="Free game development education for the metaverse generation. Learn Roblox, Fortnite Creative, Unity, and more. Part of the AeThex Foundation."
      />
      <EducationLayout>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-green-600 to-blue-700 text-white">
          <div className="absolute inset-0 opacity-10">
            <img
              src="/aethex-logo.png"
              alt="Background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-1 text-sm">
                🎮 Launching Spring 2026
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold">
                Build the Future of Gaming
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto">
                Free, world-class game development education. Learn Roblox, Fortnite, Unity,
                and metaverse technologies from industry experts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex gap-3 w-full sm:w-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="px-6 py-3 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 flex-1 sm:w-80"
                  />
                  <Button
                    className="bg-green-500 hover:bg-green-600 text-white px-8"
                  >
                    Get Notified
                  </Button>
                </div>
              </div>
              <p className="text-sm text-blue-200">
                ✨ 100% Free · No Credit Card Required · An AeThex Foundation Initiative
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">What You'll Learn</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Comprehensive courses designed to take you from beginner to professional game developer
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-2 hover:border-blue-500 transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-600 to-green-600 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Courses */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Upcoming Courses</h2>
              <p className="text-xl text-gray-600">First cohort starting Spring 2026</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {upcomingCourses.map((course, index) => (
                <Card key={index} className="hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <Badge className="w-fit mb-2 bg-green-100 text-green-700">
                      {course.status}
                    </Badge>
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Award className="h-4 w-4" />
                      <span>{course.level}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Desktop App Download Section */}
        <section className="py-20 border-t">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <Badge className="mb-4 bg-blue-100 text-blue-700">
                    Desktop App Available
                  </Badge>
                  <h2 className="text-4xl font-bold mb-4">
                    Learn Faster with the Desktop App
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    Download our native desktop application for Windows, macOS, and Linux.
                    Enjoy a faster, more focused learning experience with offline access
                    and dedicated window.
                  </p>
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Faster performance than web browsers</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Offline access to downloaded content</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Dedicated window without distractions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Auto-updates with latest features</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                      asChild
                    >
                      <Link to="/download">
                        <Download className="mr-2 h-5 w-5" />
                        Download Desktop App
                      </Link>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      asChild
                    >
                      <Link to="/download">
                        View All Platforms
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl p-12 flex items-center justify-center">
                  <div className="text-center">
                    <Monitor className="h-32 w-32 mx-auto mb-6 text-blue-600" />
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        <span>Windows</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        <span>macOS</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        <span>Linux</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of aspiring game developers learning to build the next generation of games and metaverse experiences.
            </p>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg"
              asChild
            >
              <Link to="/enroll">
                Enroll Now - It's Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </EducationLayout>
    </>
  );
}
