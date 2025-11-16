import { useState } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquare, Send, CheckCircle } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  const contactReasons = [
    {
      title: "Press Inquiries",
      description: "Media requests and press-related questions",
      icon: MessageSquare,
    },
    {
      title: "Partnership",
      description: "Collaboration and partnership opportunities",
      icon: Mail,
    },
    {
      title: "Ethics Council",
      description: "Report concerns or policy questions",
      icon: CheckCircle,
    },
  ];

  return (
    <>
      <SEO
        pageTitle="Contact"
        description="Get in touch with the AeThex Foundation team for press, partnerships, or community inquiries."
      />
      <Layout>
        <div className="container mx-auto px-4 py-16 space-y-16">
          <section className="text-center space-y-6 max-w-4xl mx-auto">
            <Badge variant="outline" className="border-aethex-400/50 text-aethex-400">
              Get in Touch
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="text-gradient bg-gradient-to-r from-aethex-500 via-red-500 to-gold-500 bg-clip-text text-transparent">
                Contact Us
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Have questions, partnership ideas, or press inquiries? We'd love to hear from you.
            </p>
          </section>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {contactReasons.map((reason, index) => {
              const Icon = reason.icon;
              return (
                <Card key={index} className="border-border/30 text-center">
                  <CardContent className="pt-6 space-y-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-aethex-500 to-red-600 grid place-items-center mx-auto">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold">{reason.title}</h3>
                    <p className="text-sm text-muted-foreground">{reason.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="max-w-2xl mx-auto border-border/30">
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 grid place-items-center mx-auto">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold">Message Sent!</h3>
                  <p className="text-muted-foreground">
                    Thank you for reaching out. We'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Name</label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Input
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="What is this regarding?"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <Textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us more..."
                      rows={6}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-aethex-500 to-red-600 hover:from-aethex-600 hover:to-red-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </Layout>
    </>
  );
}
