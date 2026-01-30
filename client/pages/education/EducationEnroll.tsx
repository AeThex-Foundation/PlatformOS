import { useState } from "react";
import EducationLayout from "@/components/EducationLayout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Mail, User, GraduationCap } from "lucide-react";

export default function EducationEnroll() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    interests: "",
    experience: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just show success message
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <EducationLayout>
        <div className="min-h-[80vh] flex items-center justify-center py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="max-w-2xl mx-auto text-center border-2 border-green-500">
              <CardContent className="pt-12 pb-12">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold mb-4">You're on the list!</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Thank you for your interest in AeThex Education. We'll notify you at{" "}
                  <span className="font-semibold text-blue-600">{formData.email}</span> when our
                  courses launch in Spring 2026.
                </p>
                <p className="text-gray-600 mb-8">
                  In the meantime, check out the AeThex Foundation for more resources and community programs.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setSubmitted(false)}
                  >
                    Submit Another
                  </Button>
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-green-600">
                    <a href="https://aethex.foundation" target="_blank" rel="noopener noreferrer">
                      Visit AeThex Foundation
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </EducationLayout>
    );
  }

  return (
    <>
      <SEO
        pageTitle="Enroll Now - AeThex Education"
        description="Sign up to be notified when AeThex Education launches. Free game development courses starting Spring 2026."
      />
      <EducationLayout>
        {/* Hero */}
        <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <GraduationCap className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-4">Get Notified When We Launch</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Be the first to know when AeThex Education courses go live in Spring 2026.
              100% free, forever.
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">Join the Waitlist</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      <User className="h-4 w-4 inline mr-2" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      <Mail className="h-4 w-4 inline mr-2" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interests">I'm interested in learning...</Label>
                    <Select
                      value={formData.interests}
                      onValueChange={(value) => setFormData({ ...formData, interests: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your interest" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="roblox">Roblox Development</SelectItem>
                        <SelectItem value="fortnite">Fortnite Creative / UEFN</SelectItem>
                        <SelectItem value="unity">Unity Game Development</SelectItem>
                        <SelectItem value="unreal">Unreal Engine</SelectItem>
                        <SelectItem value="metaverse">Metaverse Development</SelectItem>
                        <SelectItem value="all">Everything!</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience Level</Label>
                    <Select
                      value={formData.experience}
                      onValueChange={(value) => setFormData({ ...formData, experience: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Complete Beginner</SelectItem>
                        <SelectItem value="some">Some Programming Experience</SelectItem>
                        <SelectItem value="intermediate">Intermediate Developer</SelectItem>
                        <SelectItem value="advanced">Advanced / Professional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">
                      Anything else you'd like us to know? (Optional)
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your goals, what you're excited to learn, etc."
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600"
                  >
                    Join Waitlist
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* FAQ or Additional Info */}
            <div className="max-w-2xl mx-auto mt-12 space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">🎓 When do courses start?</h3>
                  <p className="text-gray-600 text-sm">
                    Our first cohort launches in Spring 2026. We'll email you as soon as enrollment opens!
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">💰 Is it really free?</h3>
                  <p className="text-gray-600 text-sm">
                    Yes! 100% free, forever. No hidden costs, no credit card required. Funded by the AeThex Foundation.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">🌍 Can I take courses from anywhere?</h3>
                  <p className="text-gray-600 text-sm">
                    Absolutely! All courses are online and self-paced. Learn from anywhere in the world.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </EducationLayout>
    </>
  );
}
