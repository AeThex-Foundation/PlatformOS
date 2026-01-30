import EducationLayout from "@/components/EducationLayout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Clock,
  Award,
  Users,
  Star,
  Play,
  ChevronRight
} from "lucide-react";

export default function EducationCourses() {
  const courses = [
    {
      id: 1,
      title: "Roblox Scripting Fundamentals",
      description: "Learn Lua programming and create your first Roblox game from scratch.",
      category: "Roblox",
      level: "Beginner",
      duration: "8 weeks",
      students: "250+",
      rating: 4.8,
      thumbnail: "/aethex-logo.png",
      status: "Coming Soon",
      modules: 12
    },
    {
      id: 2,
      title: "Advanced Roblox Game Mechanics",
      description: "Build complex game systems, monetization, and polish your Roblox games.",
      category: "Roblox",
      level: "Intermediate",
      duration: "10 weeks",
      students: "180+",
      rating: 4.9,
      thumbnail: "/aethex-logo.png",
      status: "Coming Soon",
      modules: 16
    },
    {
      id: 3,
      title: "Fortnite UEFN Essentials",
      description: "Master Unreal Editor for Fortnite and create immersive Creative experiences.",
      category: "Fortnite",
      level: "Beginner",
      duration: "6 weeks",
      students: "320+",
      rating: 4.7,
      thumbnail: "/aethex-logo.png",
      status: "Coming Soon",
      modules: 10
    },
    {
      id: 4,
      title: "Unity Game Development",
      description: "Complete guide to Unity, from basics to publishing your first game.",
      category: "Unity",
      level: "Beginner",
      duration: "12 weeks",
      students: "450+",
      rating: 4.9,
      thumbnail: "/aethex-logo.png",
      status: "Coming Soon",
      modules: 20
    },
    {
      id: 5,
      title: "Metaverse World Building",
      description: "Design and build immersive metaverse experiences across multiple platforms.",
      category: "Metaverse",
      level: "Advanced",
      duration: "14 weeks",
      students: "120+",
      rating: 5.0,
      thumbnail: "/aethex-logo.png",
      status: "Coming Soon",
      modules: 18
    },
    {
      id: 6,
      title: "Game Design Principles",
      description: "Learn core game design theory, player psychology, and engagement mechanics.",
      category: "Design",
      level: "All Levels",
      duration: "6 weeks",
      students: "580+",
      rating: 4.8,
      thumbnail: "/aethex-logo.png",
      status: "Coming Soon",
      modules: 8
    }
  ];

  const categories = ["All", "Roblox", "Fortnite", "Unity", "Metaverse", "Design"];

  return (
    <>
      <SEO
        pageTitle="Courses - AeThex Education"
        description="Browse our comprehensive catalog of free game development courses. Learn Roblox, Fortnite, Unity, and metaverse development."
      />
      <EducationLayout>
        {/* Hero */}
        <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl font-bold mb-4">Course Catalog</h1>
            <p className="text-xl text-blue-100 max-w-2xl">
              Explore our comprehensive curriculum designed to take you from beginner to professional game developer.
            </p>
          </div>
        </section>

        {/* Course Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filters */}
            <Tabs defaultValue="All" className="mb-12">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 max-w-4xl mx-auto">
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category} value={category} className="mt-8">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses
                      .filter((course) => category === "All" || course.category === category)
                      .map((course) => (
                        <Card key={course.id} className="hover:shadow-xl transition-all group">
                          <div className="relative">
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-full h-48 object-cover rounded-t-lg bg-gradient-to-br from-blue-100 to-green-100 p-12"
                            />
                            <Badge className="absolute top-4 right-4 bg-green-500">
                              {course.status}
                            </Badge>
                          </div>
                          <CardHeader>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{course.level}</Badge>
                              <Badge variant="outline">{course.category}</Badge>
                            </div>
                            <CardTitle className="text-xl group-hover:text-blue-600 transition">
                              {course.title}
                            </CardTitle>
                            <CardDescription>{course.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{course.duration}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                <span>{course.modules} modules</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{course.students} enrolled</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span>{course.rating}</span>
                              </div>
                            </div>
                            <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600">
                              Learn More <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Can't find what you're looking for?</h2>
            <p className="text-gray-600 mb-8">We're always adding new courses. Suggest a course topic!</p>
            <Button size="lg" variant="outline">
              Request a Course
            </Button>
          </div>
        </section>
      </EducationLayout>
    </>
  );
}
