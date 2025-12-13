import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import DocsLayout from "@/components/docs/DocsLayout";

export default function DocsExamples() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const redirectTimer = setTimeout(() => {
      navigate("/programs");
    }, 5000);

    return () => {
      clearInterval(countdownTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <DocsLayout title="Student Projects">
      <div className="space-y-8">
        <section className="space-y-4">
          <Badge className="bg-red-500/20 text-red-200 uppercase tracking-wide">
            <Sparkles className="mr-2 h-3 w-3" />
            Student Showcase
          </Badge>
          <h2 className="text-3xl font-semibold text-white">
            See What Students Create
          </h2>
          <p className="text-gray-300 max-w-3xl">
            This page has moved! We're redirecting you to our Programs page where
            you can explore student projects, see what you'll learn, and discover
            the amazing work created by Foundation graduates.
          </p>
        </section>

        <Card className="bg-gradient-to-br from-red-900/40 to-gold-900/20 border-red-500/30">
          <CardHeader>
            <CardTitle className="text-gold-300 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Redirecting to Programs...
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              You'll be automatically redirected in{" "}
              <span className="font-bold text-gold-400">{countdown}</span>{" "}
              seconds.
            </p>
            <div className="flex gap-4">
              <Button
                asChild
                className="bg-red-600 hover:bg-red-500 text-white"
              >
                <Link to="/programs">
                  Go to Programs Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-gold-500/50 text-gold-300 hover:bg-gold-500/10"
              >
                <Link to="/docs/tutorials">View Learning Guides</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-4 md:grid-cols-2">
          <Card className="bg-slate-900/60 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">
                What You'll Find in Programs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  Interactive Media & Game Development tracks
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                  Web Development learning paths
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  Creative Technology courses
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                  Professional Development skills
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">
                Related Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>
                  <Link
                    to="/docs/curriculum"
                    className="text-gold-400 hover:text-gold-300 underline"
                  >
                    Course Syllabi
                  </Link>{" "}
                  — View detailed course outlines
                </li>
                <li>
                  <Link
                    to="/docs/tutorials"
                    className="text-gold-400 hover:text-gold-300 underline"
                  >
                    Learning Guides
                  </Link>{" "}
                  — Step-by-step tutorials
                </li>
                <li>
                  <Link
                    to="/mentorship"
                    className="text-gold-400 hover:text-gold-300 underline"
                  >
                    Mentorship
                  </Link>{" "}
                  — Connect with industry mentors
                </li>
                <li>
                  <Link
                    to="/downloads"
                    className="text-gold-400 hover:text-gold-300 underline"
                  >
                    Downloads
                  </Link>{" "}
                  — Free learning resources
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </DocsLayout>
  );
}
