import EducationLayout from "@/components/EducationLayout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  Users,
  Globe,
  Award,
  BookOpen,
  Target
} from "lucide-react";
import { Link } from "react-router-dom";

export default function EducationAbout() {
  const values = [
    {
      icon: Heart,
      title: "Accessibility First",
      description: "100% free education for everyone, regardless of background or location"
    },
    {
      icon: Users,
      title: "Community-Driven",
      description: "Learn together with a supportive community of creators and mentors"
    },
    {
      icon: Globe,
      title: "Future-Focused",
      description: "Preparing developers for the metaverse and next-gen gaming platforms"
    },
    {
      icon: Award,
      title: "Quality Education",
      description: "Industry-standard curriculum taught by experienced game developers"
    }
  ];

  const stats = [
    { value: "10,000+", label: "Students Worldwide" },
    { value: "50+", label: "Expert Instructors" },
    { value: "100+", label: "Hours of Content" },
    { value: "100%", label: "Free Forever" }
  ];

  return (
    <>
      <SEO
        pageTitle="About - AeThex Education"
        description="Learn about AeThex Education's mission to provide free, world-class game development education to the next generation of creators."
      />
      <EducationLayout>
        {/* Hero */}
        <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold mb-6">
                Empowering the Next Generation of Game Developers
              </h1>
              <p className="text-xl text-blue-100">
                AeThex Education is a free, open-source educational initiative powered by the AeThex
                Foundation. Our mission is to make world-class game development education accessible
                to everyone.
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
                <div className="space-y-4 text-lg text-gray-700">
                  <p>
                    We believe that everyone should have access to high-quality education, regardless
                    of their financial situation or geographic location.
                  </p>
                  <p>
                    AeThex Education provides comprehensive, hands-on courses in game development,
                    covering platforms like Roblox, Fortnite Creative, Unity, and emerging metaverse
                    technologies.
                  </p>
                  <p>
                    As part of the AeThex Foundation, we're building a global community of creators
                    who are shaping the future of interactive entertainment.
                  </p>
                </div>
                <Button
                  size="lg"
                  className="mt-8 bg-gradient-to-r from-blue-600 to-green-600"
                  asChild
                >
                  <Link to="/enroll">Join Us Today</Link>
                </Button>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl p-12 flex items-center justify-center">
                <img
                  src="/aethex-logo.png"
                  alt="AeThex Education"
                  className="w-64 h-64 object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Our Values</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 pb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-green-600 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                    <p className="text-gray-600 text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* AeThex Foundation */}
        <section className="py-20 bg-white border-t">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <Target className="h-16 w-16 mx-auto mb-6 text-blue-600" />
              <h2 className="text-3xl font-bold mb-4">Part of the AeThex Foundation</h2>
              <p className="text-lg text-gray-700 mb-8">
                AeThex Education is an initiative of the AeThex Foundation, a nonprofit organization
                dedicated to empowering developers through open-source tools, education, and community
                programs.
              </p>
              <Button variant="outline" size="lg" asChild>
                <a
                  href="https://aethex.foundation"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn More About AeThex Foundation
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Start Learning Today</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of aspiring game developers building the future of interactive entertainment.
            </p>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50"
              asChild
            >
              <Link to="/courses">Browse Courses</Link>
            </Button>
          </div>
        </section>
      </EducationLayout>
    </>
  );
}
