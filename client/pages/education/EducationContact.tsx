import { useState } from "react";
import EducationLayout from "@/components/EducationLayout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Mail, MessageSquare, User, Send } from "lucide-react";

export default function EducationContact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
                <h2 className="text-3xl font-bold mb-4">Message Sent!</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Thank you for reaching out. We'll get back to you at{" "}
                  <span className="font-semibold text-blue-600">{formData.email}</span> as soon as possible.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Message
                </Button>
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
        pageTitle="Contact - AeThex Education"
        description="Get in touch with AeThex Education. We're here to help with any questions about our courses and programs."
      />
      <EducationLayout>
        {/* Hero */}
        <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Mail className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Have questions about our courses? We're here to help!
            </p>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          <User className="h-4 w-4 inline mr-2" />
                          Name
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Your name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">
                          <Mail className="h-4 w-4 inline mr-2" />
                          Email
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
                        <Label htmlFor="subject">
                          <MessageSquare className="h-4 w-4 inline mr-2" />
                          Subject
                        </Label>
                        <Input
                          id="subject"
                          type="text"
                          placeholder="What's this about?"
                          required
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us how we can help..."
                          rows={6}
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-gradient-to-r from-blue-600 to-green-600"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Other Ways to Reach Us</h2>
                  <div className="space-y-6">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Mail className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1">Email</h3>
                            <p className="text-gray-600 text-sm mb-2">
                              For general inquiries and support
                            </p>
                            <a
                              href="mailto:developers@aethex.education"
                              className="text-blue-600 hover:underline"
                            >
                              developers@aethex.education
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                            <img src="/aethex-logo.png" alt="Foundation" className="h-8 w-8" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1">AeThex Foundation</h3>
                            <p className="text-gray-600 text-sm mb-2">
                              Visit our parent organization
                            </p>
                            <a
                              href="https://aethex.foundation"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              aethex.foundation →
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* FAQ Quick Links */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Frequently Asked</h3>
                  <div className="space-y-3">
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-4 pb-4">
                        <h4 className="font-semibold text-sm mb-1">When do courses start?</h4>
                        <p className="text-gray-600 text-sm">Spring 2026 - join the waitlist to be notified!</p>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-4 pb-4">
                        <h4 className="font-semibold text-sm mb-1">Is it really free?</h4>
                        <p className="text-gray-600 text-sm">Yes! 100% free, funded by the AeThex Foundation.</p>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-4 pb-4">
                        <h4 className="font-semibold text-sm mb-1">Do I need experience?</h4>
                        <p className="text-gray-600 text-sm">No! We have courses for all skill levels.</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </EducationLayout>
    </>
  );
}
