import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Handshake, GraduationCap } from "lucide-react";
import DocsLayout from "@/components/docs/DocsLayout";

export default function DocsPartnerProposal() {
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
    <DocsLayout title="Partnerships">
      <div className="space-y-8">
        <section className="space-y-4">
          <Badge className="bg-red-500/20 text-red-200 uppercase tracking-wide">
            <Handshake className="mr-2 h-3 w-3" />
            Partner With Us
          </Badge>
          <h2 className="text-3xl font-semibold text-white">
            Industry Partnerships
          </h2>
          <p className="text-gray-300 max-w-3xl">
            Interested in partnering with the AeThex Foundation? We work with
            studios, educators, and tech companies to create opportunities for
            our students. Contact us through our main site for partnership inquiries.
          </p>
        </section>

        <Card className="bg-gradient-to-br from-red-900/40 to-gold-900/20 border-red-500/30">
          <CardHeader>
            <CardTitle className="text-gold-300 flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Redirecting to Programs...
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              You'll be automatically redirected in{" "}
              <span className="font-bold text-gold-400">{countdown}</span>{" "}
              seconds to explore our learning programs.
            </p>
            <div className="flex gap-4">
              <Button
                asChild
                className="bg-red-600 hover:bg-red-500 text-white"
              >
                <Link to="/programs">
                  View Programs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-gold-500/50 text-gold-300 hover:bg-gold-500/10"
              >
                <Link to="/donate">Support the Foundation</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-4 md:grid-cols-2">
          <Card className="bg-slate-900/60 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">
                Partnership Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  Access to trained talent pipeline
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                  Co-branded educational content
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  Internship and apprenticeship programs
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                  Community visibility and branding
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">
                Get In Touch
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>
                  <Link
                    to="/donate"
                    className="text-gold-400 hover:text-gold-300 underline"
                  >
                    Donate
                  </Link>{" "}
                  — Support student education
                </li>
                <li>
                  <Link
                    to="/mentorship"
                    className="text-gold-400 hover:text-gold-300 underline"
                  >
                    Become a Mentor
                  </Link>{" "}
                  — Share your expertise
                </li>
                <li>
                  <Link
                    to="/programs"
                    className="text-gold-400 hover:text-gold-300 underline"
                  >
                    Programs
                  </Link>{" "}
                  — See what we teach
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-gold-400 hover:text-gold-300 underline"
                  >
                    About Us
                  </Link>{" "}
                  — Learn about the Foundation
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </DocsLayout>
  );
}
