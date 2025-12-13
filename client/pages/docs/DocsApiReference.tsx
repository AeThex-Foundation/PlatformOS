import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DocsLayout from "@/components/docs/DocsLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, GraduationCap } from "lucide-react";

export default function DocsApiReference() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/programs");
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <DocsLayout title="Page Moved">
      <div className="max-w-2xl mx-auto text-center py-12">
        <GraduationCap className="h-16 w-16 text-red-400 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-white mb-4">
          This Page Has Moved
        </h2>
        <p className="text-gray-300 mb-8">
          Looking for learning resources? Our curriculum has been reorganized to better 
          serve students. You'll be redirected to our Programs page in a few seconds.
        </p>
        
        <Card className="bg-slate-900/60 border-slate-700 mb-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Looking for something specific?
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button asChild variant="outline" className="justify-start border-gold-500/30 text-gold-300">
                <Link to="/programs">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Training Programs
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start border-gold-500/30 text-gold-300">
                <Link to="/docs/curriculum">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Course Curriculum
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start border-gold-500/30 text-gold-300">
                <Link to="/docs/tutorials">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Learning Guides
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start border-gold-500/30 text-gold-300">
                <Link to="/downloads">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Downloads
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Button asChild size="lg" className="bg-gradient-to-r from-aethex-500 to-red-600 hover:from-aethex-600 hover:to-red-700">
          <Link to="/programs">
            Go to Programs Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </DocsLayout>
  );
}
